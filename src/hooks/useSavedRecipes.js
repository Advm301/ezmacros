import { useState, useEffect } from 'react';
import { hapticSelection } from '../utils/haptics';

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
  return { notes: '', ingredientOverrides: {}, instructionOverrides: {}, stepNotes: {} };
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
// - `saved`: recipes the user has starred/favorited -- either explicitly
//   via the star icon, or automatically the moment they actually cook one
//   (see RecipeModal's handleRate, which calls toggleSaved when "I made
//   this recipe" is rated). This is what puts a recipe on the Saved list.
// - `customizations`: per-recipe notes, per-step comments, and
//   ingredient/instruction edits. These persist regardless of whether the
//   recipe is starred, and deliberately do NOT auto-save it any more --
//   merely tweaking an ingredient amount or jotting a note doesn't mean
//   you've actually made the thing, and used to silently star it anyway
//   (a reported bug: editing one ingredient amount, without ever cooking,
//   immediately added the recipe to Favorites). Saving to Favorites is now
//   driven only by an explicit star tap, or by actually rating a cooked
//   recipe -- see handleRate in RecipeModal.jsx.
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
    hapticSelection();
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

  // Wipes both stores back to empty -- both in this hook's own React state
  // AND (via the two effects above, which fire right after) localStorage.
  // Needed alongside App.jsx's own localStorage.removeItem(SAVED_KEY)/
  // (CUSTOM_KEY) calls on account deletion, not instead of them: this hook
  // is only ever instantiated once for the whole app session (App.jsx
  // never remounts), and its initial state is seeded from a *module-level*
  // cache (see cachedInitial/loadInitialState above) that only ever reads
  // localStorage once per page load -- so clearing localStorage alone,
  // without this, left a deleted account's favorites/customizations
  // sitting in memory and got written straight back out to localStorage
  // again by these same effects the next time either state changed.
  const resetAll = () => {
    setSaved({});
    setCustomizations({});
  };

  // None of the four update* functions below auto-save any more (see the
  // comment above useSavedRecipes) -- they only ever touch `customizations`,
  // never `saved`. Editing an ingredient/instruction, jotting a note, or
  // leaving a per-step comment no longer implies "I cooked this."
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

  // A per-step comment jotted while actually cooking ("used low-sodium
  // sauce", "needed 2 extra minutes") -- separate from the single
  // end-of-recipe notes field, and separate from instructionOverrides
  // (which rewrites the instruction text itself).
  const updateStepNote = (id, index, text) => {
    setCustomizations((prev) => {
      const entry = prev[id] || blankCustomization();
      return {
        ...prev,
        [id]: { ...entry, stepNotes: { ...entry.stepNotes, [index]: text } },
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
    updateStepNote,
    resetAll,
  };
}
