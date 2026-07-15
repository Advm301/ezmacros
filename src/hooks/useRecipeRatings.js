import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Global recipe ratings, shared across all users via Supabase (unlike
// useSavedRecipes, which is per-device localStorage). Everyone reads the
// same average; each signed-in user can set/change their own 1-5 rating,
// optionally attaching a photo as proof they actually made the recipe.
export default function useRecipeRatings(userId) {
  const [ratingsByRecipe, setRatingsByRecipe] = useState({});
  const [myRatings, setMyRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('recipe_id, rating, user_id, photo_url');

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
        mine[id] = { rating: row.rating, photoUrl: row.photo_url || null };
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
  // photo on the rating untouched, or a File to upload a new one.
  const rateRecipe = async (recipeId, rating, photoFile) => {
    if (!userId) return;

    let photoUrl = myRatings[recipeId]?.photoUrl || null;

    if (photoFile) {
      const ext = (photoFile.name || 'jpg').split('.').pop();
      const path = `${userId}/${recipeId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-photos')
        .upload(path, photoFile, { upsert: true });

      if (uploadError) {
        console.error('Error uploading recipe photo:', uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage.from('recipe-photos').getPublicUrl(path);
        photoUrl = publicUrlData?.publicUrl || photoUrl;
      }
    }

    const { error } = await supabase
      .from('recipe_ratings')
      .upsert(
        {
          recipe_id: recipeId,
          user_id: userId,
          rating,
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'recipe_id,user_id' }
      );

    if (error) {
      console.error('Error saving rating:', error);
      return;
    }

    // Re-fetch so the displayed average reflects the server's numbers
    // exactly (cheap at this scale, and avoids optimistic-math drift).
    refresh();
  };

  const getRatingSummary = (recipeId) => ratingsByRecipe[recipeId] || null;
  const getMyRatingEntry = (recipeId) => myRatings[recipeId] || null;

  return { loading, getRatingSummary, getMyRatingEntry, rateRecipe, refresh };
}
