import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];

const MEAL_SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

function formatDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayString() {
  return formatDateString(new Date());
}

// Personal, per-user meal diary -- unlike recipe ratings, these entries are
// private to the signed-in user (not visible to anyone else). Organizes
// recipes into Breakfast/Lunch/Dinner/Snack buckets for a given date, with
// no macro or nutrition tracking, just "what did I plan/eat that day."
export default function useDiary(userId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('diary_entries')
      .select('id, entry_date, meal_slot, recipe_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading diary entries:', error);
      setLoading(false);
      return;
    }

    setEntries(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    // Loading the signed-in user's diary on mount (and whenever the user
    // changes) is a standard data-fetching effect -- refresh() is async and
    // only calls setState once the network response comes back.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  // Returns true on success, false on failure, so callers can decide what
  // to do next (e.g. only show a confirmation / close the modal on success).
  const addEntry = async (entryDate, mealSlot, recipeId) => {
    if (!userId) return false;
    const { error } = await supabase
      .from('diary_entries')
      .insert({ user_id: userId, entry_date: entryDate, meal_slot: mealSlot, recipe_id: recipeId });

    if (error) {
      console.error('Error adding diary entry:', error);
      return false;
    }
    refresh();
    return true;
  };

  const removeEntry = async (entryId) => {
    const { error } = await supabase.from('diary_entries').delete().eq('id', entryId);
    if (error) {
      console.error('Error removing diary entry:', error);
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const getEntriesForDate = (dateStr) => entries.filter((e) => e.entry_date === dateStr);

  return { loading, entries, addEntry, removeEntry, getEntriesForDate, refresh };
}

export { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString, formatDateString };
