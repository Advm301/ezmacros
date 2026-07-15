import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { hapticSuccess } from '../utils/haptics';

// Signed URLs are short-lived download links into the private recipe-photos
// bucket. An hour is more than enough for a single viewing session -- if it
// expires the user can just reopen the recipe to get a fresh one.
const PHOTO_SIGNED_URL_TTL = 60 * 60;

// Global recipe ratings, shared across all users via Supabase (unlike
// useSavedRecipes, which is per-device localStorage). Everyone reads the
// same average; each signed-in user can set/change their own 1-5 rating,
// optionally attaching a photo as proof they actually made the recipe.
// Photos are private: only the uploader can ever see their own photo, so
// other users' photo paths are never even fetched by this client (a
// separate, own-rows-only query handles that), and the storage bucket
// itself is private with RLS restricting reads to the owner's folder.
export default function useRecipeRatings(userId) {
  const [ratingsByRecipe, setRatingsByRecipe] = useState({});
  const [myRatings, setMyRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Global aggregate query -- deliberately never selects photo_url, so no
    // other user's photo path can ever reach this client.
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('recipe_id, rating, user_id, created_at');

    if (error) {
      console.error('Error loading recipe ratings:', error);
      setLoading(false);
      return;
    }

    const sums = {};
    const mine = {};
    for (const row of data || []) {
      const id = row.recipe_id;
      if (!sums[id]) sums[id] = { total: 0, count: 0 };
      sums[id].total += row.rating;
      sums[id].count += 1;
      if (userId && row.user_id === userId) {
        mine[id] = { rating: row.rating, ratedAt: row.created_at, photoPath: null };
      }
    }

    // Second, own-rows-only query -- the only place photo_url is ever
    // requested, scoped to the signed-in user's own ratings.
    if (userId) {
      const { data: ownRows, error: ownError } = await supabase
        .from('recipe_ratings')
        .select('recipe_id, photo_url')
        .eq('user_id', userId);

      if (ownError) {
        console.error("Error loading your rating photos:", ownError);
      } else {
        for (const row of ownRows || []) {
          if (mine[row.recipe_id]) {
            mine[row.recipe_id].photoPath = row.photo_url || null;
          }
        }
      }
    }

    const summary = {};
    for (const id of Object.keys(sums)) {
      summary[id] = { avg: sums[id].total / sums[id].count, count: sums[id].count };
    }

    setRatingsByRecipe(summary);
    setMyRatings(mine);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    // Fetching from Supabase on mount (and whenever the signed-in user
    // changes) is exactly what an effect is for -- refresh() is async and
    // only calls setState once the network response comes back.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  // photoFile is optional -- pass null/undefined to leave any existing
  // photo on the rating untouched, or a File to upload a new one. Stores
  // the storage object path (not a public URL, since the bucket is
  // private) -- use getPhotoSignedUrl to turn it into something viewable.
  const rateRecipe = async (recipeId, rating, photoFile) => {
    if (!userId) return;

    let photoPath = myRatings[recipeId]?.photoPath || null;

    if (photoFile) {
      const ext = (photoFile.name || 'jpg').split('.').pop();
      const path = `${userId}/${recipeId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-photos')
        .upload(path, photoFile, { upsert: true });

      if (uploadError) {
        console.error('Error uploading recipe photo:', uploadError);
      } else {
        photoPath = path;
      }
    }

    const { error } = await supabase
      .from('recipe_ratings')
      .upsert(
        {
          recipe_id: recipeId,
          user_id: userId,
          rating,
          photo_url: photoPath,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'recipe_id,user_id' }
      );

    if (error) {
      console.error('Error saving rating:', error);
      return;
    }

    hapticSuccess();
    // Re-fetch so the displayed average reflects the server's numbers
    // exactly (cheap at this scale, and avoids optimistic-math drift).
    refresh();
  };

  // Generates a short-lived signed URL for a photo path. Storage RLS
  // restricts this bucket to the owner's own folder, so calling this with
  // someone else's photo path will simply fail -- that's the enforcement
  // point, not just a UI convention.
  const getPhotoSignedUrl = async (photoPath) => {
    if (!photoPath) return null;
    const { data, error } = await supabase.storage
      .from('recipe-photos')
      .createSignedUrl(photoPath, PHOTO_SIGNED_URL_TTL);

    if (error) {
      console.error('Error creating signed photo URL:', error);
      return null;
    }
    return data?.signedUrl || null;
  };

  const getRatingSummary = (recipeId) => ratingsByRecipe[recipeId] || null;
  const getMyRatingEntry = (recipeId) => myRatings[recipeId] || null;

  return { loading, getRatingSummary, getMyRatingEntry, rateRecipe, getPhotoSignedUrl, refresh };
}
