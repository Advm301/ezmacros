import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_PREFERENCES = {
  spice_level: 'any',
  protein_preferences: ['chicken', 'beef', 'fish', 'pork', 'ground_beef', 'ground_chicken', 'ground_pork', 'ground_turkey', 'vegetarian', 'eggs'],
  variety_level: 'some_repeat',
  include_shakes: true,
  include_snacks: false,
  snack_timing: [],
};

// Handle migration: if user had 'same_daily', convert to 'some_repeat'
const sanitizeVarietyLevel = (level) => {
  if (level === 'same_daily') return 'some_repeat';
  return level || 'some_repeat';
};

export default function useUserPreferences() {
  console.log('[DEBUG] useUserPreferences hook initialized');
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('[DEBUG] useUserPreferences initial state:', { preferences, loading, error });

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
            variety_level: sanitizeVarietyLevel(settings.variety_level),
            include_shakes: settings.include_shakes !== null ? settings.include_shakes : DEFAULT_PREFERENCES.include_shakes,
            include_snacks: settings.include_snacks !== null ? settings.include_snacks : DEFAULT_PREFERENCES.include_snacks,
            snack_timing: settings.snack_timing || DEFAULT_PREFERENCES.snack_timing,
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
          variety_level: newPreferences.variety_level,
          include_shakes: newPreferences.include_shakes,
          include_snacks: newPreferences.include_snacks,
          snack_timing: newPreferences.snack_timing,
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
