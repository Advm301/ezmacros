import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_PREFERENCES = {
  spice_level: 'any',
  protein_preferences: ['chicken', 'beef', 'fish', 'pork', 'ground_beef', 'ground_chicken', 'ground_pork', 'ground_turkey', 'vegetarian', 'eggs'],
  meal_frequency: '3_meals',
  variety_level: 'some_repeat',
  include_shakes: true,
};

export default function useUserPreferences() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load preferences from database on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: settings, error: fetchError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (settings) {
          setPreferences({
            spice_level: settings.spice_level || DEFAULT_PREFERENCES.spice_level,
            protein_preferences: settings.protein_preferences || DEFAULT_PREFERENCES.protein_preferences,
            meal_frequency: settings.meal_frequency || DEFAULT_PREFERENCES.meal_frequency,
            variety_level: settings.variety_level || DEFAULT_PREFERENCES.variety_level,
            include_shakes: settings.include_shakes !== null ? settings.include_shakes : DEFAULT_PREFERENCES.include_shakes,
          });
        } else {
          // Create default preferences for this user
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              ...DEFAULT_PREFERENCES,
            });

          if (insertError) throw insertError;
          setPreferences(DEFAULT_PREFERENCES);
        }
      } catch (err) {
        console.error('Error loading user preferences:', err);
        setError(err.message);
        setPreferences(DEFAULT_PREFERENCES);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to database
  const savePreferences = async (newPreferences) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          spice_level: newPreferences.spice_level,
          protein_preferences: newPreferences.protein_preferences,
          meal_frequency: newPreferences.meal_frequency,
          variety_level: newPreferences.variety_level,
          include_shakes: newPreferences.include_shakes,
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setPreferences(newPreferences);
      return { success: true };
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    preferences,
    loading,
    error,
    savePreferences,
  };
}
