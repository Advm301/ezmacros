// "Quick Prep Gauge" -- a relative effort indicator shown as 1-3 flames.
// Every recipe in this app is already quick and easy (the whole point of
// the app), so this isn't sorting "easy" from "hard" -- it's surfacing
// which ones are the absolute quickest grab-and-go options versus the ones
// that ask a little more of you. Framing/labels below are deliberately
// positive for that reason (no recipe should read as "the hard one").
//
// Weighted toward activeTime (hands-on minutes) rather than totalTime,
// since totalTime inflates for anything with passive wait -- a slow cooker
// recipe can show 245 minutes total but only 5 minutes of actual work.
// Active time is the honest measure of effort; ingredient count and step
// count are secondary "how much is there to juggle" signals.
//
// The max values and tier breakpoints below aren't round numbers picked
// out of thin air -- they came from running this exact formula across all
// 144 real recipes and choosing thresholds that split them into three
// roughly even, sensible groups (51 / 50 / 43) where the recipes landing
// at each extreme actually matched intuition (e.g. jerky + rice cakes and
// cottage cheese + pineapple scored lowest; from-scratch shakshuka and a
// slow cooker gumbo scored highest).
const MAX_ACTIVE_TIME = 15; // minutes -- the slowest active time in the app
const MAX_INGREDIENTS = 9; // the most components any single recipe has
const MAX_STEPS = 5; // the most instruction steps any single recipe has

const TIER_1_MAX = 0.43;
const TIER_2_MAX = 0.545;

export const EFFORT_LEVELS = {
  1: { tier: 1, label: 'Quickest', flames: 1 },
  2: { tier: 2, label: 'Easy', flames: 2 },
  3: { tier: 3, label: 'A Little More Involved', flames: 3 },
};

export function getEffortScore(recipe) {
  const activeTime = recipe.activeTime || 0;
  const ingredientCount = (recipe.components || []).length;
  const stepCount = (recipe.instructions || []).length;
  return (
    (activeTime / MAX_ACTIVE_TIME) * 0.5 +
    (ingredientCount / MAX_INGREDIENTS) * 0.25 +
    (stepCount / MAX_STEPS) * 0.25
  );
}

export function getEffortTier(recipe) {
  const score = getEffortScore(recipe);
  if (score <= TIER_1_MAX) return 1;
  if (score <= TIER_2_MAX) return 2;
  return 3;
}

export function getEffortLevel(recipe) {
  return EFFORT_LEVELS[getEffortTier(recipe)];
}
