import { RECIPES } from '../data/recipes.js';

// Sunday Meal Prep: once a week, hand back a single recipe (scaled up by
// whoever renders it) meant to be batch-cooked and eaten across several
// days -- the classic "cook once on Sunday, reheat all week" ritual. Recipes
// opt into the pool via the 'sunday_prep' tag in data/recipes.js, hand-picked
// for holding up well in the fridge for 4-5 days (stews, chilis, sauced rice
// bowls, casseroles) rather than same-day-fresh items like smash burgers or
// crispy hash browns that lose their appeal reheated.

const CURRENT_KEY = 'quickprep_sunday_prep_current'; // { weekKey, recipeId }
const RECENT_KEY = 'quickprep_sunday_prep_recent'; // [recipeId, ...] most-recent-first
const RECENT_LIMIT = 4; // avoid repeating a pick for ~a month before it can resurface

function formatDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// The Sunday that starts "this week" -- stable all week (Sun-Sat) so
// reopening the app doesn't reroll the pick, then naturally advances once
// the next Sunday arrives.
function currentWeekKey() {
  const d = new Date();
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - d.getDay());
  return formatDateKey(sunday);
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore -- worst case a pick just rerolls next open */
  }
}

function readRecentIds() {
  return readJSON(RECENT_KEY, []);
}

function pushRecentId(id) {
  const recent = readRecentIds();
  writeJSON(RECENT_KEY, [id, ...recent.filter((x) => x !== id)].slice(0, RECENT_LIMIT));
}

export function getSundayPrepPool() {
  return RECIPES.filter((r) => (r.tags || []).includes('sunday_prep'));
}

// Picks a recipe from the pool, preferring one that hasn't shown up in the
// last few weeks and (for Swap) isn't the one currently on screen. Relaxes
// step by step -- unseen-and-not-current -> anything-but-current ->
// anything at all -- so it never comes back empty even if the pool is small.
function pickFromPool({ excludeId } = {}) {
  const pool = getSundayPrepPool();
  if (pool.length === 0) return null;
  const recent = readRecentIds();

  const notExcluded = pool.filter((r) => r.id !== excludeId);
  const unseen = notExcluded.filter((r) => !recent.includes(r.id));
  const candidates = unseen.length > 0 ? unseen : (notExcluded.length > 0 ? notExcluded : pool);

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  pushRecentId(pick.id);
  return pick;
}

// Returns this week's Sunday Prep recipe, generating and persisting a new
// one the first time it's asked for in a given week, then returning that
// same pick on every later call until the next Sunday rolls around.
export function getThisWeeksPick() {
  const weekKey = currentWeekKey();
  const current = readJSON(CURRENT_KEY, null);
  if (current && current.weekKey === weekKey) {
    const recipe = RECIPES.find((r) => r.id === current.recipeId);
    if (recipe) return recipe;
    // Stored id no longer exists (recipe removed/retagged) -- fall through
    // and pick a fresh one rather than returning nothing.
  }
  const pick = pickFromPool();
  if (!pick) return null;
  writeJSON(CURRENT_KEY, { weekKey, recipeId: pick.id });
  return pick;
}

// Rough "how full will my containers be" total for a Sunday Prep recipe --
// sums every genuinely batched ingredient (protein, sauce, aromatics,
// spices -- anything that gets cooked into the one shared mixture) and
// skips pre-portioned per-meal items (unit 'each': rice/pasta pouches,
// steam-bag veg, tortilla counts) that are never part of what actually gets
// divided into containers, since those get cooked fresh each day instead.
// Treats 1ml as roughly 1g -- the standard home-kitchen approximation for
// water-based sauces/broths/dairy -- since this is a packaging-size
// estimate, not a nutrition figure. Pass in the recipe's already scaled,
// protein-resolved component list (RecipeModal's own `components`, not
// r.components directly) so this stays correct at whatever batch size
// someone's picked.
export function estimateBatchWeight(components) {
  const total = (components || [])
    .filter((c) => c.unit === 'g' || c.unit === 'ml')
    .reduce((sum, c) => sum + (c.quantity || 0), 0);
  return Math.round(total / 10) * 10;
}

// Re-picks within the pool for the current week, replacing (not adding to)
// this week's stored pick.
export function swapThisWeeksPick() {
  const weekKey = currentWeekKey();
  const current = readJSON(CURRENT_KEY, null);
  const excludeId = current && current.weekKey === weekKey ? current.recipeId : null;
  const pick = pickFromPool({ excludeId });
  if (!pick) return null;
  writeJSON(CURRENT_KEY, { weekKey, recipeId: pick.id });
  return pick;
}

// How many days the week's pick should cover -- device-remembered, same
// getter/setter-pair convention as freshAltTips.js's readPreferFresh/
// savePreferFresh. Defaults to 5 (a work week of lunches) rather than
// requiring a choice before the feature does anything useful; the one-time
// settings prompt (see hasSeenSundayPrepSettings below) just offers a
// chance to change that default, it doesn't gate functionality on it.
const MEAL_COUNT_KEY = 'quickprep_sunday_prep_meal_count';
const DEFAULT_MEAL_COUNT = 5;

export function readSundayPrepMealCount() {
  try {
    const raw = localStorage.getItem(MEAL_COUNT_KEY);
    const n = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_MEAL_COUNT;
  } catch {
    return DEFAULT_MEAL_COUNT;
  }
}

export function saveSundayPrepMealCount(value) {
  try {
    localStorage.setItem(MEAL_COUNT_KEY, String(value));
  } catch {
    // Not worth blocking on -- worst case it just won't be remembered.
  }
}

// Tracks whether the one-time "how many days should this cover?" prompt has
// already been shown, so it surfaces once (the first time the Diary tab
// renders the Sunday Prep card) and never again, while staying reachable any
// time afterward via the account menu's Sunday Prep row.
const SEEN_SETTINGS_KEY = 'quickprep_seen_sunday_prep_settings';

export function hasSeenSundayPrepSettings() {
  try {
    return localStorage.getItem(SEEN_SETTINGS_KEY) === '1';
  } catch {
    return false;
  }
}

export function markSeenSundayPrepSettings() {
  try {
    localStorage.setItem(SEEN_SETTINGS_KEY, '1');
  } catch {
    // Worst case the prompt just shows again next launch.
  }
}
