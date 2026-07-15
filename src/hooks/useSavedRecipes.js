import { useState, useEffect } from 'react';

const SAVED_KEY = 'quickprep_saved_recipes';
const CUSTOM_KEY = 'quickprep_recipe_customizations';

function loadJSON(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

function blankCustomization() {
  return { notes: '', ingredientOverrides: {}, instructionOverrides: {} };
}

// Computed once and memoized (not on every render) -- older versions of
// this hook stored notes/ingredient/instruction overrides inside the same
// entry as the star/saved flag, which meant customizing a recipe silently
// starred it. This pulls any pre-existing customizations back out into
// their own store so that migration only happens once per page load.
let cachedInitial = null;
function loadInitialState() {
  if (cachedInitial) return cachedInitial;

  const rawSaved = loadJSON(SAVED_KEY, {});
  const existingCustom = loadJSON(CUSTOM_KEY, null);

  if (existingCustom) {
    cachedInitial = { saved: rawSaved, customizations: existingCustom };
    return cachedInitial;
  }

  const customizations = {};
  for (const [id, entry] of Object.entries(rawSaved)) {
    if (!entry) continue;
    const hasNotes = entry.notes && entry.notes.trim().length > 0;
    const hasIngredientOverrides = entry.ingredientOverrides && Object.keys(entry.ingredientOverrides).length > 0;
    const hasInstructionOverrides = entry.instructionOverrides && Object.keys(entry.instructionOverrides).length > 0;
    if (hasNotes || hasIngredientOverrides || hasInstructionOverrides) {
      customizations[id] = {
        notes: entry.notes || '',
        ingredientOverrides: entry.ingredientOverrides || {},
        instructionOverrides: entry.instructionOverrides || {},
      };
    }
  }

  cachedInitial = { saved: rawSaved, customizations };
  return cachedInitial;
}

// Two independent, per-device localStorage stores:
// - `saved`: recipes the user has explicitly starred/favorited. This is the
//   ONLY thing that puts a recipe on the Saved list.
// - `customizations`: per-recipe notes and ingredient/instruction edits.
//   These persist regardless of whether the recipe is starred -- editing a
//   recipe should never silently favorite it.
export default function useSavedRecipes() {
  const [saved, setSaved] = useState(() => loadInitialState().saved);
  const [customizations, setCustomizations] = useState(() => loadInitialState().customizations);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    } catch (err) {
      console.error('Error saving recipes to localStorage:', err);
    }
  }, [saved]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customizations));
    } catch (err) {
      console.error('Error saving recipe customizations to localStorage:', err);
    }
  }, [customizations]);

  const isSaved = (id) => Boolean(saved[id]);

  const toggleSaved = (id) => {
    setSaved((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { savedAt: Date.now() } };
    });
  };

  const getEntry = (id) => customizations[id] || null;

  const updateNotes = (id, notes) => {
    setCustomizations((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || blankCustomization()), notes },
    }));
  };

  const updateIngredientOverride = (id, index, override) => {
    setCustomizations((prev) => {
      const entry = prev[id] || blankCustomization();
      return {
        ...prev,
        [id]: { ...entry, ingredientOverrides: { ...entry.ingredientOverrides, [index]: override } },
      };
    });
  };

  const updateInstructionOverride = (id, index, text) => {
    setCustomizations((prev) => {
      const entry = prev[id] || blankCustomization();
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
