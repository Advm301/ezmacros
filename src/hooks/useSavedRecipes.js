import { useState, useEffect } from 'react';

const STORAGE_KEY = 'quickprep_saved_recipes';

// Reads the persisted saved-recipes map once, synchronously, so we don't
// need a load effect that calls setState on mount (avoids a cascading
// render and lets the very first paint already reflect saved state).
function loadInitial() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.error('Error loading saved recipes from localStorage:', err);
    return {};
  }
}

function blankEntry() {
  return { savedAt: Date.now(), notes: '', ingredientOverrides: {}, instructionOverrides: {} };
}

// Unified store for both "favorited" (starred) and "saved" recipes -- they
// are the same thing. A recipe also becomes saved automatically the moment
// the user edits an ingredient quantity, edits an instruction, or adds a
// note, since that customization is only worth keeping if it's remembered.
export default function useSavedRecipes() {
  const [saved, setSaved] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (err) {
      console.error('Error saving recipes to localStorage:', err);
    }
  }, [saved]);

  const isSaved = (id) => Boolean(saved[id]);

  const getEntry = (id) => saved[id] || null;

  const toggleSaved = (id) => {
    setSaved((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: blankEntry() };
    });
  };

  const updateNotes = (id, notes) => {
    setSaved((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || blankEntry()), notes },
    }));
  };

  const updateIngredientOverride = (id, index, override) => {
    setSaved((prev) => {
      const entry = prev[id] || blankEntry();
      return {
        ...prev,
        [id]: { ...entry, ingredientOverrides: { ...entry.ingredientOverrides, [index]: override } },
      };
    });
  };

  const updateInstructionOverride = (id, index, text) => {
    setSaved((prev) => {
      const entry = prev[id] || blankEntry();
      return {
        ...prev,
        [id]: { ...entry, instructionOverrides: { ...entry.instructionOverrides, [index]: text } },
      };
    });
  };

  return {
    saved,
    isSaved,
    toggleSaved,
    getEntry,
    updateNotes,
    updateIngredientOverride,
    updateInstructionOverride,
  };
}
