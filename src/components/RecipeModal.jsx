import { useState, useEffect, useRef } from 'react';
import StarIcon from './StarIcon';
import StarRating from './StarRating';
import { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString } from '../hooks/useDiary';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium, hapticHeavy, hapticSuccess } from '../utils/haptics';
import { summarizeSteps } from '../utils/recipeSummary';
import { detectPreheatTip, previewNextStep } from '../utils/stepHints';
import { matchIngredientsForStep } from '../utils/ingredientMatch';
import { splitIngredients } from '../utils/ingredientClassify';
import { getFreshAltHint } from '../utils/freshAltTips';
import LightningIcon from './LightningIcon';
import SparkBurst from './SparkBurst';
import LightningStrike from './LightningStrike';
import EffortGauge from './EffortGauge';
import InstructionText from './InstructionText';
import InfoIcon from './InfoIcon';
import RecipeTutorial from './RecipeTutorial';
import useFirstVisitTip from '../hooks/useFirstVisitTip';

const GRAMS_PER_OZ = 28.3495;
const ML_PER_FLOZ = 29.5735;

// Fixed presets for "how many servings am I actually making" (see
// scaleServings state below) rather than a freeform amount -- a handful of
// clean serving counts keeps every ingredient's scaled quantity a
// reasonable, easy-to-measure number, and keeps the recipe's own
// instructions (which reference "divide into 4 containers"-style container
// counts) close enough to true that a plain contextual note can cover the
// gap instead of needing every recipe's instruction text rewritten to be
// dynamic. Every recipe in the catalog currently has a base `servings` of
// 1, 4, or 6, all of which already appear in this list.
const SERVING_SCALE_OPTIONS = [1, 2, 3, 4, 6, 8];

// Scales one ingredient's stored quantity by a servings ratio. No rounding
// here -- getQuantityDisplay/getEditableAmount below already round to
// whatever precision makes sense per unit (whole eggs, whole "each" items,
// 1-decimal grams/oz, etc.), so scaling just needs to hand them a plain
// float. The floor guard only matters when scaling DOWN: without it, a
// 0.5g pinch of something scaled to e.g. 0.25x would round down to a
// confusing "0g" in the ingredient list instead of just staying small.
function scaleQuantity(quantity, factor) {
  if (!factor || factor === 1) return quantity;
  const scaled = quantity * factor;
  const floor = quantity > 0 ? Math.min(quantity, 0.5) : 0;
  return Math.max(scaled, floor);
}

const GRAMS_PER_LB = 453.592;

// Whether this ingredient is a weight-based protein someone would actually
// be comparing against a real package sitting on their counter (ground
// meat, a fillet, a chop, a bag of shrimp) -- these get a "(X lb)" readout
// next to their gram amount below, so a glance at e.g. "568g (1.25 lb)"
// immediately tells someone whether that matches the 1lb or 3lb package
// they bought, without doing the g-to-lb math themselves before deciding
// whether to bump the servings picker. Deliberately NOT applied to every
// gram-weighted ingredient (rice, veg, cottage cheese, etc.) -- just the
// ones people actually buy and think about in pounds.
const BULK_PROTEIN_KEYWORDS = [
  'Ground Beef', 'Ground Turkey', 'Ground Pork', 'Ground Chicken', 'Ground Mexican Chorizo', 'Chorizo',
  'Chicken Breast', 'Chicken Thigh', 'Chicken Tender',
  'Pork Chop', 'Pork Tenderloin', 'Pork Shoulder',
  'Turkey Breast', 'Turkey Tenderloin',
  'Steak', 'Ham',
  'Cod Fillet', 'Salmon Fillet', 'Tilapia', 'Frozen Shrimp',
];

function isBulkProteinComponent(name) {
  return Boolean(name) && BULK_PROTEIN_KEYWORDS.some((k) => name.includes(k));
}

function formatLb(grams) {
  return formatNum(grams / GRAMS_PER_LB);
}

// Approximate per-unit gram weight for "each"-style convenience sides (a
// microwave rice pouch, a steam-bag of broccoli, a pre-cooked pasta
// pouch) -- these are written as "1 per meal" so the ingredient list stays
// easy to read, but that shouldn't leave out anyone who isn't buying that
// exact packaged product (cooking rice from scratch, air-frying loose
// frozen broccoli instead of a steam bag, etc.). The gram figures match
// what these same ingredients are already written as elsewhere in the
// catalog wherever a recipe calls for them in plain grams instead of
// "each" (e.g. every non-meal-prep rice bowl already calls for 200g of
// rice) -- so "1 pouch" here and "200g" there mean the same thing.
// Deliberately only covers sides with an obvious from-scratch/bulk
// alternative -- burger buns, cheese slices, and tortillas don't have the
// same ambiguity (nobody weighs a bun), so they're left alone.
const EACH_ITEM_GRAMS = [
  ['Rice Pouch', 200],
  ['Frozen Broccoli', 100],
  ['Frozen Mixed Veg', 85],
  ['Frozen Hash Browns', 100],
  ['Egg Noodles', 150],
  ['Spaghetti Pouch', 200],
];

function getEachItemGramsPerUnit(name) {
  if (!name) return null;
  const match = EACH_ITEM_GRAMS.find(([key]) => name.includes(key));
  return match ? match[1] : null;
}

// Shown on the finish screen once a recipe is completed -- the point is to
// make people feel good about having just cooked instead of ordering in,
// not to overstate any one dish. Two pools rather than one: a meal-prep
// recipe (servings > 1) earns a different kind of payoff ("N meals ready
// to go") than a single-serving one, so the message stays true to what was
// actually just made instead of a generic line that doesn't quite fit.
const COMPLETION_MESSAGES_SINGLE = [
  "Nice work -- that wasn't so bad, and now you've got a healthy meal ready to go.",
  "Well done! One more real meal made instead of ordering in.",
  "You did it -- fresh, home-cooked, and better than delivery.",
];
const COMPLETION_MESSAGES_MEAL_PREP = [
  (n) => `Nice work -- that wasn't so bad, and now you've got ${n} healthy meals prepped and ready to go.`,
  (n) => `Well done! ${n} meals down, zero decisions left to make later this week.`,
  (n) => `You did it -- ${n} healthy meals ready whenever you need them.`,
];

function getCompletionMessage(servings, seed) {
  if (servings > 1) {
    const pool = COMPLETION_MESSAGES_MEAL_PREP;
    return pool[seed % pool.length](servings);
  }
  const pool = COMPLETION_MESSAGES_SINGLE;
  return pool[seed % pool.length];
}

// Shown briefly next to the Next button each time someone advances through
// an instruction step -- a little "someone's paying attention" nudge to
// keep things feeling encouraging rather than just mechanical page-turning.
// Mostly generic lines, plus a couple that reference real progress (steps
// completed / steps left) for variety -- those two take (doneCount,
// totalCount) so they stay accurate regardless of recipe length.
const MOTIVATION_MESSAGES = [
  () => 'Nice, keep going!',
  () => 'Nicely done!',
  () => "You've got this.",
  () => 'Cooking like a pro.',
  () => 'Almost there!',
  (done, total) => `That's ${done} step${done === 1 ? '' : 's'} down, ${Math.max(total - done, 0)} to go!`,
  (done) => `Step ${done} done -- keep it up!`,
  () => 'Smells good already.',
  () => 'Look at you go.',
  () => "You're on a roll.",
  () => 'Great progress.',
  () => 'One step closer to dinner.',
  () => 'Crushing it.',
  () => 'Keep that momentum up.',
  () => "That's the way.",
  () => 'Making it happen.',
  () => 'Onward!',
  () => 'Nailed it.',
  () => 'Solid work.',
  () => 'This is coming together nicely.',
  () => 'Chef mode: activated.',
  () => "You're doing great.",
  () => 'Not so bad, right?',
];

function getMotivationMessage(doneCount, totalCount) {
  const pick = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
  return pick(doneCount, totalCount);
}

// Two mandatory, no-skip-allowed guided tours (see RecipeTutorial.jsx and
// the activeTutorial state below) -- split by screen since their targets
// only exist on one screen or the other. DECIDE_TUTORIAL_STEPS' "Check What
// You Have" step also covers quantity editing and unit toggling now that
// the ingredients table's old inline how-to text has been replaced with the
// recipe's own description (see recipe.description in data/recipes.js) --
// without folding that explanation in here, nothing on screen would explain
// either behavior anymore. COOK_TUTORIAL_STEPS covers editing an
// instruction's text and adding a per-step note instead -- neither is
// visible until you're actually on the first real cook step, which is why
// that tour launches there rather than up front with the other one.
const DECIDE_TUTORIAL_STEPS = [
  {
    selector: '#tour-add-to-diary',
    title: 'Add to Diary',
    text: "Log this meal to a specific day in your Diary -- track what you're eating, or plan ahead for later in the week.",
  },
  {
    selector: '#tour-effort-gauge',
    title: 'Quick Prep Gauge',
    text: 'These bolts show how much effort a recipe takes relative to the rest of the app -- 1 lit bolt is the easiest, 3 is more involved.',
  },
  {
    selector: '#tour-ingredients-check',
    title: 'Check What You Have',
    text: "Tap the checkbox next to any ingredient or seasoning to mark it off as something you've already got. Tap a quantity to edit it, or the unit badge to switch between g/oz or ml/fl oz.",
  },
  {
    selector: '#tour-favorite-star',
    title: 'Save to Favorites',
    text: 'Tap the star to save this recipe to your Favorites, so you can find it again later.',
  },
  {
    selector: '#tour-view-all-steps',
    title: 'View All Steps',
    text: 'See every instruction at once instead of one at a time -- a quick way to read through the whole recipe before you dive in.',
  },
];

const COOK_TUTORIAL_STEPS = [
  {
    selector: '#tour-edit-step-text',
    title: 'Edit Any Step',
    text: "Tap a step's text to rewrite it in your own words -- swap an ingredient, adjust a technique, whatever makes it yours.",
  },
  {
    selector: '#tour-add-step-note',
    title: 'Add a Note',
    text: "Jot a quick note on any step -- what worked, what you'd change next time. Adding any note automatically saves this recipe to your Favorites too.",
  },
];

// Third mandatory tour, covering the closing "How'd It Go" rating page --
// launched automatically the first time anyone ever reaches it (see
// isRatingPageNow below), same no-skip-the-first-time pattern as the other
// two. Kept to just these two things, per how this screen is actually used
// step by step: check "I made this recipe" first, which is what actually
// reveals the tappable star row underneath it -- so the tour points at the
// checkbox and at the always-visible rating summary above it (which
// explains what tapping a star there will do) rather than at the stars
// themselves, since they don't exist in the DOM yet on someone's very
// first visit to this page.
const RATING_TUTORIAL_STEPS = [
  {
    selector: '#tour-made-it-checkbox',
    title: 'Made This Recipe?',
    text: 'Check this once you’ve actually made it -- it unlocks the star rating right below.',
  },
  {
    selector: '#tour-rating-summary',
    title: 'Rate It',
    text: "This shows the recipe's overall rating from everyone who's tried it. Once you check the box above, tap a star here to leave your own -- ratings can't be changed once submitted.",
  },
];

// Round to 1 decimal place, stripping a trailing ".0".
function formatNum(n) {
  const rounded = Math.round(n * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}

// Returns the parts needed to render an ingredient's quantity: the number,
// a unit suffix, whether it can be toggled to an alternate unit, and the
// label for that alternate unit. Weights (g) toggle with ounces; volumes
// (ml) toggle with fluid ounces. Counts, sprays, and "each" items aren't
// real measurements, so they're not toggleable.
function getQuantityDisplay(quantity, unit, name, displayMode) {
  const u = unit || 'g';

  if (u === 'count') {
    if (name && name.toLowerCase().includes('egg')) {
      const eggCount = Math.round(quantity / 50);
      return { value: `${eggCount}`, suffix: ` egg${eggCount === 1 ? '' : 's'}`, toggleable: false };
    }
    return { value: `${Math.round(quantity)}`, suffix: '', toggleable: false };
  }
  if (u === 'spray') {
    return { value: `${Math.round(quantity)}`, suffix: ` spray${quantity === 1 ? '' : 's'}`, toggleable: false };
  }
  if (u === 'each') {
    return { value: `${Math.round(quantity)}`, suffix: '', toggleable: false };
  }
  if (u === 'g') {
    if (displayMode === 'alt') {
      return { value: formatNum(quantity / GRAMS_PER_OZ), suffix: ' oz', toggleable: true, altLabel: 'g' };
    }
    return { value: `${Math.round(quantity)}`, suffix: 'g', toggleable: true, altLabel: 'oz' };
  }
  if (u === 'ml') {
    if (displayMode === 'alt') {
      return { value: formatNum(quantity / ML_PER_FLOZ), suffix: ' fl oz', toggleable: true, altLabel: 'ml' };
    }
    return { value: `${Math.round(quantity)}`, suffix: 'ml', toggleable: true, altLabel: 'fl oz' };
  }
  return { value: `${Math.round(quantity)}`, suffix: '', toggleable: false };
}

// The editable value for an ingredient, respecting whichever unit is
// currently displayed (native or the toggled alternate).
function getEditableAmount(quantity, unit, name, displayMode) {
  if (unit === 'count' && name && name.toLowerCase().includes('egg')) {
    return Math.round(quantity / 50);
  }
  if (unit === 'g' && displayMode === 'alt') {
    return formatNum(quantity / GRAMS_PER_OZ);
  }
  if (unit === 'ml' && displayMode === 'alt') {
    return formatNum(quantity / ML_PER_FLOZ);
  }
  return Math.round(quantity);
}

// Converts an edited amount back into the recipe's native stored unit
// (grams or ml), regardless of which unit was showing while editing.
function amountToQuantity(amount, unit, name, displayMode) {
  if (unit === 'count' && name && name.toLowerCase().includes('egg')) {
    return amount * 50;
  }
  if (unit === 'g' && displayMode === 'alt') {
    return amount * GRAMS_PER_OZ;
  }
  if (unit === 'ml' && displayMode === 'alt') {
    return amount * ML_PER_FLOZ;
  }
  return amount;
}

function formatRatedAt(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Secondary "footer nav" button style shared by the cook wizard's Back
// control across every page type.
const navBtnStyle = {
  background: 'var(--s3)',
  border: '1px solid var(--border)',
  color: 'var(--cream)',
  borderRadius: 13,
  padding: '12px 18px',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: "'Manrope',sans-serif",
  cursor: 'pointer',
  flexShrink: 0,
};

export default function RecipeModal({
  recipe,
  onClose,
  onFinish,
  isSaved,
  toggleSaved,
  entry,
  onUpdateNotes,
  onUpdateIngredientOverride,
  onUpdateInstructionOverride,
  onUpdateStepNote,
  ratingSummary,
  myRatingEntry,
  onRate,
  getPhotoSignedUrl,
  onAddToDiary,
  // Fired (with no args) the moment rating this recipe also auto-saves it
  // to Favorites (see handleRate below) -- lets the parent show a one-time
  // "Saved to Favorites" confirmation instead of silently flipping the
  // star with no feedback. This is now the ONLY thing that can implicitly
  // save a recipe; editing an ingredient/instruction or jotting a note no
  // longer does (see hooks/useSavedRecipes.js).
  onFavoriteAutoSaved,
}) {
  // Rendered with key={recipe.id} by the parent, so this component remounts
  // fresh (and all local state below resets naturally, including `screen`)
  // whenever a different recipe is opened -- no reset effect needed.
  const [screen, setScreen] = useState('decide'); // 'decide' | 'cook'
  const [cookStep, setCookStep] = useState(0);
  const [direction, setDirection] = useState('forward'); // drives the slide-in animation
  // Bumped on every forward step through the cook wizard to (re)trigger a
  // spark burst near the Next button; 0 means no burst currently showing.
  const [burstId, setBurstId] = useState(0);
  // Drives the recipe-complete celebration: a sequence of three full-screen
  // lightning strikes (see LightningStrike below) fired the moment the last
  // instruction step advances into the closing rating page, in place of the
  // ordinary single strike/spark every other Next tap gets. 0 means no
  // celebration strike is currently showing; 1/2/3 identifies which strike
  // in the sequence is on screen, which also picks that strike's haptic
  // (see COMPLETION_HAPTICS) so the sequence visibly and physically
  // escalates rather than repeating the same tap three times.
  const [completionStrike, setCompletionStrike] = useState(0);
  // Short encouragement shown next to the Next button each time someone
  // advances through an instruction step -- null means nothing showing.
  // Re-picked (not just re-shown) on every click so it doesn't feel like
  // the same canned line every time; see MOTIVATION_MESSAGES below.
  const [motivationMsg, setMotivationMsg] = useState(null);
  // Bumped alongside motivationMsg so the pill's key changes and React
  // remounts it -- otherwise the CSS pop-in/shine/glow animations would
  // only ever play once, since React just swaps the text node on a DOM
  // element that never actually re-enters the page.
  const [motivationId, setMotivationId] = useState(0);
  const motivationTimeoutRef = useRef(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingIngredientValue, setEditingIngredientValue] = useState('');
  const [unitModes, setUnitModes] = useState({});
  // "Do I already have this" checklist for the ingredients screen -- purely
  // a reading-time aid (checking the fridge/pantry before you shop or
  // cook), not something tied to the recipe itself, so it's plain local
  // state keyed by each ingredient's original components[] index rather
  // than anything persisted to the diary entry.
  const [haveIngredient, setHaveIngredient] = useState({});
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [editingStepValue, setEditingStepValue] = useState('');
  const [editingStepNoteIndex, setEditingStepNoteIndex] = useState(null);
  const [editingStepNoteValue, setEditingStepNoteValue] = useState('');
  const [notesValue, setNotesValue] = useState(entry?.notes || '');
  const [madeIt, setMadeIt] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [ratedPhotoUrl, setRatedPhotoUrl] = useState(null);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [diaryDate, setDiaryDate] = useState(todayString());
  const [diaryError, setDiaryError] = useState('');
  const [addingToDiary, setAddingToDiary] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  // "How many servings am I actually making" -- lets someone match the
  // recipe to how much protein they actually have/bought (e.g. a 4-serving
  // recipe scaled down to 3 for a 1lb package, or a single-serving chicken
  // recipe scaled up to 4 for the whole family) instead of being stuck with
  // whatever amount the recipe happened to be written at. Defaults to the
  // recipe's own stored servings -- see SERVING_SCALE_OPTIONS above for why
  // this is a fixed preset list rather than a freeform amount. Resets
  // naturally per recipe since this component remounts on key={recipe.id}.
  const [scaleServings, setScaleServings] = useState(recipe?.servings || 1);
  // Picked once per recipe-modal session (not re-rolled on every render as
  // you page through steps) so the same line stays put through to Finish.
  // The actual pool (single-serving vs. meal-prep) is chosen later once
  // `r.servings` is known -- this just needs a stable index into whichever
  // pool applies.
  const [completionMsgSeed] = useState(() => Math.floor(Math.random() * 3));
  // Guided walkthrough (see RecipeTutorial.jsx), split into three
  // mandatory, no-skip-allowed passes, each launched automatically the
  // very first time it's reached: one covering the decide screen (Add to
  // Diary, effort gauge, ingredient checkboxes, favorites, View All
  // Steps), one covering per-step editing and notes on the very first
  // cook-wizard step, and one covering the closing "How'd It Go" rating
  // page (checking "I made this recipe", and rating). Each is gated by its
  // own useFirstVisitTip flag so it only forces itself once, but
  // `activeTutorial` (which one, if any, is currently showing) and
  // `tutorialSkippable` (whether Skip is allowed) are separate local state
  // -- the decide-screen tour can also be replayed voluntarily later via
  // the info button next to Let's Make It, which IS skippable, unlike the
  // mandatory first pass.
  const decideTutorialTip = useFirstVisitTip('quickprep_seen_recipe_decide_tutorial');
  const cookTutorialTip = useFirstVisitTip('quickprep_seen_recipe_cook_tutorial');
  const ratingTutorialTip = useFirstVisitTip('quickprep_seen_recipe_rating_tutorial');
  // Decided once, right in the lazy initializer, rather than via an effect
  // that fires setState on mount -- this is the actual initial render
  // value, not a follow-up render, so there's no cascading-render effect
  // to avoid in the first place. `recipe` (a prop) is used directly here
  // instead of the `canCook`/`instructions` derived further down, since
  // those come after this component's early `if (!recipe) return null`
  // guard and can't be referenced before it without breaking hook order.
  const [activeTutorial, setActiveTutorial] = useState(() => {
    const canCookNow = (recipe?.instructions?.length ?? 0) > 0;
    return decideTutorialTip.show && canCookNow ? 'decide' : null;
  }); // null | 'decide' | 'cook' | 'rating'
  const [tutorialSkippable, setTutorialSkippable] = useState(false);
  // Tracks the previous `screen` value so the cook-wizard tutorial can be
  // triggered the moment `screen` becomes 'cook' -- compared and acted on
  // directly during render (React's documented pattern for reacting to a
  // value changing) rather than in a useEffect, which would otherwise
  // trigger the same "setState synchronously inside an effect causes a
  // cascading extra render" concern the lazy initializer above avoids.
  const [prevScreenForTutorial, setPrevScreenForTutorial] = useState(screen);
  if (screen !== prevScreenForTutorial) {
    setPrevScreenForTutorial(screen);
    if (screen === 'cook' && cookStep === 0 && cookTutorialTip.show) {
      setActiveTutorial('cook');
      setTutorialSkippable(false);
    }
  }

  // Same render-time-comparison pattern as the cook tutorial above, but for
  // reaching the closing "How'd It Go" rating page specifically -- that's
  // always the very last cook-wizard page (see cookPages further down),
  // computed here directly from `recipe`/`onRate` rather than the later
  // derived `cookPages`/`instructions`, for the same early-return/hook-
  // order reason explained on activeTutorial's lazy initializer above.
  const instructionsCountForTutorial = recipe?.instructions?.length ?? 0;
  const totalCookPagesForTutorial = instructionsCountForTutorial + (onRate ? 1 : 0);
  const isRatingPageNow = screen === 'cook' && Boolean(onRate) && cookStep === totalCookPagesForTutorial - 1;
  const [prevIsRatingPageForTutorial, setPrevIsRatingPageForTutorial] = useState(isRatingPageNow);
  if (isRatingPageNow !== prevIsRatingPageForTutorial) {
    setPrevIsRatingPageForTutorial(isRatingPageNow);
    if (isRatingPageNow && ratingTutorialTip.show) {
      setActiveTutorial('rating');
      setTutorialSkippable(false);
    }
  }

  const closeTutorial = () => {
    if (activeTutorial === 'decide') decideTutorialTip.dismiss();
    if (activeTutorial === 'cook') cookTutorialTip.dismiss();
    if (activeTutorial === 'rating') ratingTutorialTip.dismiss();
    setActiveTutorial(null);
    setTutorialSkippable(false);
  };

  const touchStartRef = useRef(null);

  const photoPath = myRatingEntry?.photoPath;

  useEffect(() => {
    let cancelled = false;
    async function loadPhoto() {
      if (!photoPath || !getPhotoSignedUrl) return;
      const url = await getPhotoSignedUrl(photoPath);
      // Fetching a short-lived signed URL for your own rating photo on
      // mount is a standard data-fetching effect -- this component
      // remounts per recipe (key={recipe.id}), so it always reflects the
      // photo for the recipe currently open.
      if (!cancelled) setRatedPhotoUrl(url);
    }
    loadPhoto();
    return () => {
      cancelled = true;
    };
  }, [photoPath, getPhotoSignedUrl]);

  useEffect(() => () => {
    if (motivationTimeoutRef.current) clearTimeout(motivationTimeoutRef.current);
  }, []);

  if (!recipe) return null;
  const r = recipe;
  const saved = isSaved ? isSaved(r.id) : false;
  const alreadyRated = Boolean(myRatingEntry?.rating);

  // How much bigger/smaller than the recipe's own written amount the
  // chosen serving count is -- 1 when scaleServings matches r.servings (the
  // common case), otherwise the ratio every unscaled ingredient quantity
  // below gets multiplied by.
  const scaleFactor = scaleServings / (r.servings || 1);
  const isScaled = scaleFactor !== 1;

  const components = (r.components || []).map((c, i) => {
    const override = entry?.ingredientOverrides?.[i];
    // A manual per-ingredient override is a deliberate, specific amount
    // someone already dialed in for this ingredient -- it wins outright
    // and is shown as-is, not further multiplied by the batch-size scale.
    if (override) return { ...c, quantity: override.quantity, unit: override.unit ?? c.unit, edited: true };
    if (!isScaled) return c;
    return { ...c, quantity: scaleQuantity(c.quantity, scaleFactor) };
  });

  const instructions = (r.instructions || []).map((step, i) => {
    const override = entry?.instructionOverrides?.[i];
    return { text: override !== undefined ? override : step, edited: override !== undefined };
  });

  const hasToppings = Boolean(r.toppings && r.toppings.length > 0);
  // "Microwaving rice, browning meat, and mixing a sauce" -- a heuristic
  // preview of what the steps involve, shown on the decide screen so
  // people can gauge effort before committing. Returns null (and is
  // simply not shown) when the scan can't confidently parse enough of the
  // free-text instructions.
  const stepsSummary = summarizeSteps(instructions.map((s) => s.text));
  // Catches the "I wouldn't have known to preheat the oven" gap: a later
  // step bakes/roasts/broils/air-fries at a temperature with no earlier
  // mention of preheating. Shown as early as possible (step 1) rather than
  // buried where the gap actually bites.
  const preheatTip = detectPreheatTip(instructions.map((s) => s.text));

  // For each component that has a fresh-substitute note (frozen steam-bag
  // broccoli, bagged diced sweet potato, etc.), find the FIRST instruction
  // step that actually calls for it and attach the note there -- so it
  // shows exactly once, right when it's relevant, rather than repeating on
  // every later step that happens to mention the ingredient again (e.g.
  // "broccoli on the side" during plating).
  const freshAltByStep = new Map();
  components.forEach((c) => {
    const hint = getFreshAltHint(c.name);
    if (!hint) return;
    for (let i = 0; i < instructions.length; i++) {
      if (hint.stepMatch.test(instructions[i].text)) {
        if (!freshAltByStep.has(i)) freshAltByStep.set(i, []);
        freshAltByStep.get(i).push(hint.note);
        break;
      }
    }
  });

  // The cook screen is a sequence of pages: one per instruction, then
  // rating as the closing "how'd it go" wrap-up (which also now carries the
  // Notes field -- see the 'rating' branch of renderCookPage -- rather than
  // giving notes their own page to click through). Optional toppings aren't
  // a real step on their own -- they're folded into the last instruction
  // page instead (see the 'instruction' branch of renderCookPage) so they
  // don't inflate the step count with a page that has nothing to actually
  // do. Built fresh each render (cheap) rather than stored in state, since
  // it only depends on the recipe's own content.
  const cookPages = [];
  instructions.forEach((_, i) => cookPages.push({ type: 'instruction', index: i }));
  if (onRate) cookPages.push({ type: 'rating' });

  // How far through the whole wizard (not just the instruction steps) the
  // person currently is, 0 to 1 -- drives the size of the persistent bolt
  // indicator and the intensity of each Next-click spark burst, so both
  // visibly build toward the finish rather than resetting per-section.
  const cookProgress = cookPages.length > 1 ? cookStep / (cookPages.length - 1) : 1;

  const canCook = instructions.length > 0;

  const toggleStepDone = (i) => {
    hapticSelection();
    setCompletedSteps((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const toggleUnitMode = (i) => {
    hapticSelection();
    setUnitModes((prev) => ({ ...prev, [i]: prev[i] === 'alt' ? 'native' : 'alt' }));
  };

  const toggleHaveIngredient = (i) => {
    hapticSelection();
    setHaveIngredient((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const startEditingIngredient = (i, comp) => {
    setEditingIngredientIndex(i);
    setEditingIngredientValue(String(getEditableAmount(comp.quantity, comp.unit, comp.name, unitModes[i])));
  };

  const commitIngredientEdit = (i, comp) => {
    const amount = parseFloat(editingIngredientValue);
    if (!isNaN(amount) && amount > 0) {
      const quantity = amountToQuantity(amount, comp.unit, comp.name, unitModes[i]);
      onUpdateIngredientOverride(r.id, i, { quantity, unit: comp.unit });
    }
    setEditingIngredientIndex(null);
  };

  const startEditingStep = (i, text) => {
    setEditingStepIndex(i);
    setEditingStepValue(text);
  };

  const commitStepEdit = (i) => {
    if (editingStepValue.trim().length > 0) {
      onUpdateInstructionOverride(r.id, i, editingStepValue);
    }
    setEditingStepIndex(null);
  };

  const commitNotes = () => {
    if (onUpdateNotes) onUpdateNotes(r.id, notesValue);
  };

  // Per-step comments, separate from the single end-of-recipe notes field
  // above and from instructionOverrides (which rewrites the step text
  // itself) -- this is for jotting something about a specific step while
  // actually cooking it ("used low-sodium sauce here").
  const startEditingStepNote = (i, existing) => {
    hapticSelection();
    setEditingStepNoteIndex(i);
    setEditingStepNoteValue(existing || '');
  };

  const commitStepNote = (i) => {
    if (onUpdateStepNote) onUpdateStepNote(r.id, i, editingStepNoteValue);
    setEditingStepNoteIndex(null);
  };

  const handleRate = (n) => {
    // Ratings are one-shot: once a rating exists, this control isn't shown
    // any more (see the read-only branch below), but guard here too in case
    // of a stale click during the re-render.
    if (onRate && !alreadyRated) {
      onRate(r.id, n, photoFile);
      // Rating a recipe means you actually made and judged it -- that's a
      // strong enough signal to also save it to Favorites automatically,
      // so it shows up in Saved without a separate manual tap. Only saves
      // (never un-saves) if it isn't already there.
      if (toggleSaved && !saved) {
        toggleSaved(r.id);
        if (onFavoriteAutoSaved) onFavoriteAutoSaved();
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || alreadyRated) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleAddToDiary = async (slot) => {
    if (!onAddToDiary) return;
    hapticSelection();
    setDiaryError('');
    setAddingToDiary(true);
    const ok = await onAddToDiary(r.id, diaryDate, slot);
    setAddingToDiary(false);
    // On success, the parent switches to the Diary tab, shows a
    // confirmation toast, and closes this modal itself. On failure, leave
    // the picker open so the user can retry.
    if (!ok) setDiaryError("Couldn't add to diary. Please try again.");
  };

  // Navigation between the "decide" screen and the cook wizard's pages.
  // `direction` drives which way the incoming page slides in from --
  // forward pages enter from the left, back pages enter from the right.
  const goToCook = () => {
    if (!canCook) return;
    hapticMedium();
    setDirection('forward');
    setScreen('cook');
    setCookStep(0);
  };

  // Pops a short encouragement next to the Next button and clears it a
  // beat later. Re-triggerable mid-fade (clears any pending hide first) so
  // rapid-fire clicking through steps always shows the newest line instead
  // of the old timeout wiping out a message that just appeared.
  const showMotivation = (doneCount, totalCount) => {
    if (motivationTimeoutRef.current) clearTimeout(motivationTimeoutRef.current);
    setMotivationMsg(getMotivationMessage(doneCount, totalCount));
    setMotivationId((id) => id + 1);
    // Kept in sync with the `motivation-lifecycle` animation's duration in
    // globals.css (2.6s) -- that keyframe fades the pill back out on its
    // own, so this timeout should unmount it right as the fade finishes,
    // not cut it off mid-animation. 1.6s was proving too quick to reliably
    // catch mid-recipe with hands full.
    motivationTimeoutRef.current = setTimeout(() => setMotivationMsg(null), 2600);
  };

  const goNextCookPage = () => {
    hapticLight();
    if (cookStep < cookPages.length - 1) {
      const nextStep = cookStep + 1;
      setDirection('forward');
      setCookStep(nextStep);
      if (cookPages[nextStep].type === 'rating') {
        // Landing on the closing rating page -- the recipe itself is done,
        // so this gets the bigger three-strike celebration (see
        // completionStrike above) instead of the ordinary single
        // burst/strike every other step gets. Starts light and escalates
        // with each subsequent strike (see handleCompletionStrikeDone).
        setCompletionStrike(1);
        hapticLight();
      } else {
        setBurstId((id) => id + 1);
        // Only while still stepping between instructions -- the rating
        // page's own completion message covers this instead.
        if (cookPages[nextStep].type === 'instruction') {
          showMotivation(cookStep + 1, instructions.length);
        }
      }
    } else {
      // Finish, on the closing rating page -- distinct from the plain
      // "✕ Close" button/backdrop (which always just calls onClose). If
      // anything was added to the Diary this session, the parent (see
      // App.jsx's handleFinishCooking) navigates to Diary and briefly
      // highlights it instead of just closing; falls back to onClose if a
      // caller doesn't pass onFinish, so this never silently does nothing.
      (onFinish || onClose)();
    }
  };

  // Called by each LightningStrike in the completion celebration when its
  // own ~450ms animation finishes -- chains into the next, stronger strike
  // (light -> medium -> heavy) rather than firing all three at once, so the
  // sequence reads as three distinct hits building in intensity. A final
  // hapticSuccess caps it off once all three have landed.
  const handleCompletionStrikeDone = () => {
    setCompletionStrike((n) => {
      if (n >= 3) {
        hapticSuccess();
        return 0;
      }
      const next = n + 1;
      if (next === 2) hapticMedium();
      if (next === 3) hapticHeavy();
      return next;
    });
  };

  const goPrevCookPage = () => {
    hapticLight();
    setDirection('back');
    if (cookStep === 0) {
      setScreen('decide');
    } else {
      setCookStep((s) => s - 1);
    }
  };

  // Bonus swipe gesture: swipe right to advance, swipe left to go back --
  // confined to clearly-horizontal drags that don't start near the screen
  // edges, so it doesn't fight iOS Safari's own edge-swipe-back gesture or
  // hijack vertical scrolling. Tap buttons remain the primary, reliable way
  // to navigate; this is purely a nice-to-have on top.
  const handleTouchStart = (e) => {
    if (editingIngredientIndex !== null || editingStepIndex !== null || editingStepNoteIndex !== null) {
      touchStartRef.current = null;
      return;
    }
    const t = e.touches[0];
    if (t.clientX < 24 || t.clientX > window.innerWidth - 24) {
      touchStartRef.current = null;
      return;
    }
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx > 0) {
      if (screen === 'decide') goToCook();
      else goNextCookPage();
    } else if (screen === 'cook') {
      goPrevCookPage();
    }
  };

  // Shared between the decide screen (plan a meal ahead of cooking it) and
  // the final rating page (log it right after making it) -- same
  // diaryOpen/diaryDate state either way, so opening it from one place and
  // then navigating away and back still remembers the picker's state.
  const renderAddToDiaryBlock = () => {
    if (!onAddToDiary) return null;
    return (
      <div id="tour-add-to-diary" style={{ marginBottom: 16 }}>
        <button
          onClick={() => { hapticLight(); setDiaryOpen((v) => !v); }}
          style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: 13, padding: 12, fontSize: 14, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}
        >
          {diaryOpen ? 'Close' : '+ Add to Diary'}
        </button>

        {diaryOpen && (
          <div style={{ marginTop: 10, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Date</div>
            <input
              type="date"
              value={diaryDate}
              onChange={(e) => { if (e.target.value) setDiaryDate(e.target.value); }}
              style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--cream)', fontSize: 13, padding: '6px 10px', marginBottom: 10 }}
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Add to</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', opacity: addingToDiary ? 0.6 : 1 }}>
              {MEAL_SLOTS.map((slot) => (
                <div
                  key={slot}
                  className="pill"
                  onClick={() => { if (!addingToDiary) handleAddToDiary(slot); }}
                  style={{ cursor: addingToDiary ? 'default' : 'pointer' }}
                >
                  {MEAL_SLOT_LABELS[slot]}
                </div>
              ))}
            </div>
            {diaryError && (
              <div style={{ fontSize: 12, color: '#ff8080', marginTop: 8 }}>{diaryError}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRatingBlock = () => (
    <>
      <div id="tour-rating-summary" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <StarRating value={ratingSummary?.avg || 0} readOnly size={16} />
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {ratingSummary
            ? `${ratingSummary.avg.toFixed(1)} (${ratingSummary.count} rating${ratingSummary.count === 1 ? '' : 's'})`
            : 'No ratings yet'}
        </span>
      </div>

      {alreadyRated ? (
        // Locked view: once you've rated a recipe, the rating can't be
        // changed. This just shows what you rated and when. Any photo is
        // fetched via a private, signed URL that only works for the user
        // who uploaded it -- nobody else can ever see it.
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Your rating</div>
          <StarRating value={myRatingEntry.rating} readOnly size={26} />
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            You rated this on {formatRatedAt(myRatingEntry.ratedAt)} — ratings can't be changed once submitted.
          </div>
          {ratedPhotoUrl && (
            <img
              src={ratedPhotoUrl}
              alt="Your photo of this recipe"
              style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', marginTop: 10, display: 'block' }}
            />
          )}
        </div>
      ) : (
        <>
          <label id="tour-made-it-checkbox" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: madeIt ? 10 : 14 }}>
            <input
              type="checkbox"
              checked={madeIt}
              onChange={(e) => setMadeIt(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 13, color: 'var(--cream)' }}>I made this recipe</span>
          </label>

          {madeIt && (
            <>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                Your rating — tap a star (this can't be changed once submitted)
              </div>
              <StarRating value={0} onRate={handleRate} size={26} />

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                  Add a photo (optional -- only you can ever see it)
                </div>
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Your photo of this recipe"
                    style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 8, display: 'block' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  style={{ fontSize: 12, color: 'var(--muted)', maxWidth: '100%' }}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  // Renders whichever cook-wizard page is currently active.
  const renderCookPage = () => {
    const page = cookPages[cookStep];
    if (!page) return null;

    if (page.type === 'instruction') {
      const i = page.index;
      const step = instructions[i];
      const done = Boolean(completedSteps[i]);
      const isEditingStep = editingStepIndex === i;
      const progressPct = ((i + 1) / instructions.length) * 100;
      const rawInstructionTexts = instructions.map((s) => s.text);
      const nextPreview = previewNextStep(rawInstructionTexts, i);
      // Same `components` array (with any overrides applied) the decide
      // screen renders from -- reused here, not recomputed, so an amount
      // shown mid-cook is always identical to what's editable up front.
      const stepIngredientIdxs = matchIngredientsForStep(step.text, components);
      return (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Step {i + 1} of {instructions.length}
          </div>
          <div style={{ height: 4, background: 'var(--s2)', borderRadius: 100, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--lime)', borderRadius: 100, transition: 'width .25s ease' }} />
          </div>

          {i === 0 && preheatTip && (
            <div style={{ background: 'rgba(255,193,58,.14)', border: '1px solid rgba(255,193,58,.32)', borderRadius: 10, padding: '10px 12px', marginBottom: 16, fontSize: 12.5, color: 'var(--ez2)', lineHeight: 1.5 }}>
              🔥 {preheatTip}
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', minHeight: 140 }}>
            <div
              onClick={(e) => { e.stopPropagation(); toggleStepDone(i); }}
              style={{
                flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                background: done ? 'var(--lime)' : 'var(--s2)',
                border: '1px solid var(--border)', color: done ? '#000' : 'var(--lime)', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 2,
              }}
            >
              {done ? '✓' : i + 1}
            </div>
            {isEditingStep ? (
              <textarea
                autoFocus
                value={editingStepValue}
                onChange={(e) => setEditingStepValue(e.target.value)}
                onBlur={() => commitStepEdit(i)}
                onClick={(e) => e.stopPropagation()}
                style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--cream)', fontSize: 16, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', minHeight: 100 }}
              />
            ) : (
              <div
                id={i === 0 ? 'tour-edit-step-text' : undefined}
                onClick={(e) => { e.stopPropagation(); startEditingStep(i, step.text); }}
                style={{
                  fontSize: 19, lineHeight: 1.55, cursor: 'pointer', flex: 1,
                  color: done ? 'var(--muted)' : (step.edited ? 'var(--lime)' : 'var(--cream)'),
                  textDecoration: done ? 'line-through' : 'none',
                }}
              >
                {done ? step.text : <InstructionText text={step.text} />}
              </div>
            )}
          </div>

          {stepIngredientIdxs.length > 0 && (
            <div style={{ marginTop: 18, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                For This Step
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {stepIngredientIdxs.map((idx) => {
                  const c = components[idx];
                  const display = getQuantityDisplay(c.quantity, c.unit, c.name, unitModes[idx]);
                  return (
                    <span
                      key={idx}
                      style={{ fontSize: 12, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 100, padding: '5px 12px', color: 'var(--cream)' }}
                    >
                      {c.name}: <strong style={{ color: c.edited ? 'var(--lime)' : 'var(--cream)' }}>{display.value}{display.suffix}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {(freshAltByStep.get(i) || []).map((note, ni) => (
            <div
              key={ni}
              style={{ marginTop: ni === 0 ? 18 : 8, background: 'rgba(127,163,99,.14)', border: '1px solid rgba(127,163,99,.32)', borderRadius: 10, padding: '10px 12px', fontSize: 12.5, color: '#9bc47d', lineHeight: 1.5 }}
            >
              🌱 {note}
            </div>
          ))}

          {nextPreview && (
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              Coming up: {nextPreview}
            </div>
          )}

          {/* Per-step comment -- separate from the single end-of-recipe
              Notes page, for jotting something about this specific step
              while it's actually in front of you ("used low-sodium sauce",
              "needed 2 extra minutes"). */}
          <div style={{ marginTop: 14 }}>
            {editingStepNoteIndex === i ? (
              <textarea
                autoFocus
                value={editingStepNoteValue}
                onChange={(e) => setEditingStepNoteValue(e.target.value)}
                onBlur={() => commitStepNote(i)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Add a note for this step..."
                style={{ width: '100%', minHeight: 60, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--cream)', fontSize: 13, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }}
              />
            ) : entry?.stepNotes?.[i] ? (
              <div
                onClick={(e) => { e.stopPropagation(); startEditingStepNote(i, entry.stepNotes[i]); }}
                style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                  Your Note
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--cream)', lineHeight: 1.5 }}>
                  {entry.stepNotes[i]}
                </div>
              </div>
            ) : (
              <div
                id={i === 0 ? 'tour-add-step-note' : undefined}
                onClick={(e) => { e.stopPropagation(); startEditingStepNote(i, ''); }}
                style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' }}
              >
                + Add a note for this step
              </div>
            )}
          </div>

          {/* Optional toppings ride along on the last real step instead of
              getting their own page -- there's nothing to actually "do" on
              a toppings-only screen, so giving it a dedicated step just
              inflated the step count without adding a real action. */}
          {i === instructions.length - 1 && hasToppings && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Optional Toppings
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {r.toppings.map((t, ti) => (
                  <span
                    key={ti}
                    style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: 100, padding: '6px 14px', fontSize: 13 }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (page.type === 'rating') {
      return (
        <div>
          {/* One-time "you made it" flourish -- the bolt pops in with a
              little bounce, then settles into a soft ambient glow. Subtle
              on purpose: a quiet payoff for reaching the end, not confetti. */}
          <div className="cook-complete-flourish">
            <div className="cook-complete-glow" />
            <LightningIcon id="cook-complete" size={40} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
            How'd It Go?
          </div>
          {/* The whole point of finishing a recipe is that it wasn't as bad
              as you feared and you now have real food -- say so explicitly
              rather than jumping straight to "please rate this." Picked
              once per session (completionMsgSeed) so it doesn't reshuffle
              on every re-render, and pulled from a meal-prep-aware pool so
              a batch-cooked recipe gets credit for the number of meals it
              actually produced instead of a generic line -- using the live
              scaleServings rather than r.servings so scaling a normally
              single-serving recipe up still earns the meal-prep message. */}
          <div style={{ fontSize: 14, color: 'var(--cream)', marginBottom: 14, textAlign: 'center', lineHeight: 1.5, fontWeight: 600 }}>
            {getCompletionMessage(scaleServings, completionMsgSeed)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
            Rate the recipe now that you've made it.
          </div>
          {renderRatingBlock()}

          {/* Available here too, not just on the decide screen -- logging
              the meal right after making it means not having to reopen the
              recipe from scratch to find this button. */}
          {renderAddToDiaryBlock()}

          {/* Notes used to be their own page you had to click through --
              folded in here instead so finishing the recipe, rating it, and
              jotting anything worth remembering all happen on one screen. */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Notes
            </div>
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              onBlur={commitNotes}
              placeholder="Add your own notes -- substitutions, timing tweaks, anything worth remembering."
              style={{ width: '100%', minHeight: 100, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, color: 'var(--cream)', fontSize: 15, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const animClass = direction === 'forward' ? 'step-fwd' : 'step-back';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 100, overflowY: 'auto' }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #08677B 0%, #08677B 20%, #041A20 65%, #000000 100%)',
          margin: 'calc(20px + env(safe-area-inset-top)) auto 20px auto',
          maxWidth: 430,
          borderRadius: 20,
          padding: 24,
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              <span style={{ color: 'var(--cream)' }}>{r.name}</span>
            </div>
            {(r.method || r.activeTime) && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {r.method}
                {r.method && r.activeTime ? ' · ' : ''}
                {formatTime(r.activeTime, r.totalTime)}
                {/* Always show the serving count, even at the default of 1
                    -- otherwise there's no visible confirmation the field
                    exists at all until a recipe is actually multi-portion.
                    Reflects the live batch-size selection below, not just
                    the recipe's own written amount. */}
                {' · '}Serves {scaleServings}
              </div>
            )}
            {/* Quick Prep gauge -- 1-3 bolts showing effort relative to the
                rest of the app (see EffortGauge/utils/effortLevel.js). Shown
                with its label here (unlike the compact version on Browse/
                Kitchen cards) since there's room and it's the main detail
                view. */}
            <div id="tour-effort-gauge" style={{ marginTop: 6, display: 'inline-block' }}>
              <EffortGauge recipe={r} size={13} showLabel />
            </div>
            {scaleServings > 1 && (
              <div style={{ marginTop: 6 }}>
                <span className="ezb pkg">📦 Meal Prep · Makes {scaleServings}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {toggleSaved && (
              <div id="tour-favorite-star" onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }} style={{ cursor: 'pointer' }} title={saved ? 'Tap to unsave' : 'Tap to save'}>
                <StarIcon filled={saved} size={24} />
              </div>
            )}
            <button
              onClick={() => { hapticLight(); onClose(); }}
              style={{ background: 'var(--s3)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div key={`${screen}-${cookStep}`} className={animClass}>
          {screen === 'decide' ? (
            <>
              {/* Diary -- available regardless of whether you've cooked yet,
                  so you can plan a meal ahead of actually making it. */}
              {renderAddToDiaryBlock()}

              {/* Ingredients -- split into two side-by-side tables (Core
                  Ingredients / Seasonings) instead of one long stacked list.
                  A recipe like Saucy Tomato Beef Bowl now carries 6-7 spice-
                  rack items alongside its 5-6 real ingredients, and reading
                  those as one undifferentiated column reads as a much
                  longer, more intimidating list than it is -- splitting by
                  kind also matches how someone actually shops/checks their
                  kitchen: "do I have this food" is a different question
                  than "do I have this spice." isSeasoning() classifies by
                  name (see utils/ingredientClassify.js); each item keeps its
                  original array index so tap-to-edit still targets the
                  right ingredientOverrides slot after the split. */}
              {components.length > 0 && (() => {
                const { core, seasonings } = splitIngredients(components);
                const renderRow = (c, origIndex, isLast) => {
                  const isEditing = editingIngredientIndex === origIndex;
                  const display = getQuantityDisplay(c.quantity, c.unit, c.name, unitModes[origIndex]);
                  const have = Boolean(haveIngredient[origIndex]);
                  return (
                    <div
                      key={origIndex}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}
                    >
                      {/* "Do I have this" checkbox -- a reading-time aid, not
                          part of the recipe data itself (see haveIngredient
                          state above). Checking it dims + strikes the row
                          rather than removing it, so it's still visible if
                          tapped by mistake. */}
                      <div
                        onClick={() => toggleHaveIngredient(origIndex)}
                        role="checkbox"
                        aria-checked={have}
                        style={{
                          flexShrink: 0, width: 16, height: 16, marginTop: 3, borderRadius: 4,
                          border: `1px solid ${have ? 'var(--lime)' : 'var(--border)'}`,
                          background: have ? 'var(--lime)' : 'transparent',
                          color: '#000', fontSize: 11, fontWeight: 700, lineHeight: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        {have ? '✓' : ''}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, opacity: have ? 0.5 : 1 }}>
                        <div style={{ fontSize: 12.5, color: 'var(--cream)', marginBottom: 3, lineHeight: 1.3, textDecoration: have ? 'line-through' : 'none' }}>{c.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isEditing ? (
                            <input
                              type="number"
                              autoFocus
                              value={editingIngredientValue}
                              onChange={(e) => setEditingIngredientValue(e.target.value)}
                              onBlur={() => commitIngredientEdit(origIndex, c)}
                              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                              style={{ width: 56, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 6px', color: 'var(--cream)', fontSize: 12, textAlign: 'right' }}
                            />
                          ) : (
                            <span
                              onClick={() => startEditingIngredient(origIndex, c)}
                              style={{ fontSize: 12, color: c.edited ? 'var(--lime)' : 'var(--muted)', whiteSpace: 'nowrap', cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                            >
                              {display.value}{display.suffix}
                            </span>
                          )}
                          {c.unit === 'g' && isBulkProteinComponent(c.name) && (
                            <span style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                              ({formatLb(c.quantity)} lb)
                            </span>
                          )}
                          {c.unit === 'each' && getEachItemGramsPerUnit(c.name) != null && (
                            <span style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                              (≈{Math.round(c.quantity) * getEachItemGramsPerUnit(c.name)}g)
                            </span>
                          )}
                          {display.toggleable && (
                            <span
                              onClick={(e) => { e.stopPropagation(); toggleUnitMode(origIndex); }}
                              style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, padding: '1px 5px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              {display.altLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                };
                return (
                  <div style={{ marginBottom: 16 }}>
                    {/* Used to carry inline how-to text ("Check off what you
                        already have...") -- that behavior is now explained
                        by the mandatory first-time tutorial instead (see
                        DECIDE_TUTORIAL_STEPS' "Check What You Have" step
                        above), freeing this space up for the recipe's own
                        short description. The #tour-ingredients-check
                        spotlight target moved down onto the actual
                        ingredients table below (see the flex wrapper right
                        after this) since that's the real thing the tutorial
                        step is explaining -- leaving it up here just
                        highlighted the description text instead. */}
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>
                      {r.description}
                    </div>
                    {/* Batch-size scaler -- lets someone match the recipe to
                        how much they actually bought/have (a 4-serving
                        recipe scaled down to 3 for a 1lb package of ground
                        meat, or a single-serving chicken recipe scaled up
                        to feed the family) instead of being stuck with
                        whatever amount the recipe happens to be written at.
                        Fixed preset counts (see SERVING_SCALE_OPTIONS) so
                        every scaled quantity below stays a clean, easy-to-
                        measure number. Scaling only touches the ingredient
                        list -- the instructions below still describe the
                        recipe's own written amount, so the note under the
                        chips calls that out whenever the two no longer
                        match. */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        How Many Servings?
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {SERVING_SCALE_OPTIONS.map((n) => (
                          <div
                            key={n}
                            onClick={() => { hapticSelection(); setScaleServings(n); }}
                            className={`pill${n === scaleServings ? ' active' : ''}`}
                          >
                            {n}
                          </div>
                        ))}
                      </div>
                      {isScaled && (
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, lineHeight: 1.4 }}>
                          Ingredient amounts below are scaled for {scaleServings} servings (written for {r.servings || 1}). The instructions further down still describe the original {r.servings || 1}-serving batch -- adjust container counts and timing by eye.
                        </div>
                      )}
                    </div>
                    <div id="tour-ingredients-check" style={{ display: 'flex' }}>
                      <div style={{ flex: 1, paddingRight: seasonings.length > 0 ? 14 : 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Core Ingredients
                        </div>
                        {core.map((c, idx) => renderRow(c, c.index, idx === core.length - 1))}
                      </div>
                      {seasonings.length > 0 && (
                        <div style={{ flex: 1, paddingLeft: 14, borderLeft: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Seasonings
                          </div>
                          {seasonings.map((c, idx) => renderRow(c, c.index, idx === seasonings.length - 1))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Fallback: if a recipe somehow has no instructions, there's
                  nothing to "cook" through, so show rating/notes/toppings
                  right here instead of hiding them behind a wizard with
                  nothing in it. */}
              {!canCook && (
                <>
                  {hasToppings && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Optional Toppings
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {r.toppings.map((t, i) => (
                          <span key={i} style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 100, padding: '4px 10px', fontSize: 12 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Notes
                    </div>
                    <textarea
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      onBlur={commitNotes}
                      placeholder="Add your own notes -- substitutions, timing tweaks, anything worth remembering."
                      style={{ width: '100%', minHeight: 64, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: 'var(--cream)', fontSize: 13, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                  {onRate && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Rating
                      </div>
                      {renderRatingBlock()}
                    </div>
                  )}
                </>
              )}

              {canCook && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Instructions
                  </div>
                  {stepsSummary && (
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>
                      This recipe involves {stepsSummary}.
                    </div>
                  )}
                  <div
                    id="tour-view-all-steps"
                    onClick={() => { hapticLight(); setShowAllSteps(true); }}
                    style={{ fontSize: 12, color: 'var(--lime)', textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' }}
                  >
                    View All Steps ({instructions.length})
                  </div>
                </div>
              )}

              {canCook && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 8 }}>
                    <button className="gen-kitchen-btn cook-action-btn" onClick={goToCook} style={{ flex: 1, marginTop: 0, marginBottom: 0 }}>
                      Let's Make It
                    </button>
                    {/* Voluntary replay of the decide-screen tutorial (see
                        RecipeTutorial.jsx) -- the mandatory, non-skippable
                        first pass launches itself automatically (see
                        activeTutorial's lazy initializer above), so this
                        is only ever reached after that's already been
                        completed once, which is why a replay is allowed
                        to be skipped. */}
                    <div
                      className="info-btn"
                      onClick={() => { hapticLight(); setActiveTutorial('decide'); setTutorialSkippable(true); }}
                      title="How this screen works"
                    >
                      <InfoIcon />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
                    or swipe right to start cooking
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* The persistent growing-bolt progress indicator that used to
                  live here was replaced with LightningStrike below -- a
                  single quick strike across the whole screen fired on each
                  Next tap, rather than one icon slowly growing across the
                  whole wizard. Kept this row's layout (empty div so "View
                  All Steps" stays right-aligned via space-between). */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div />
                <div
                  onClick={() => { hapticLight(); setShowAllSteps(true); }}
                  style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  View All Steps
                </div>
              </div>
              {cookPages[cookStep].type === 'instruction' ? (
                // Tap-anywhere-to-advance zone, instruction pages only --
                // greasy/wet fingers from actual cooking make hitting a
                // precise "Next" button annoying, so the whole step area
                // (text, ingredient chips, tips, the blank space around
                // them) also advances on tap. The few genuinely interactive
                // bits inside a step -- the done-circle, the step text
                // (tap to edit), and the per-step note -- stop propagation
                // on their own onClick so this doesn't fight them. Left off
                // the rating page on purpose: that page is full of things
                // you tap to interact with (stars, checkbox, notes), not
                // page through.
                <div onClick={goNextCookPage} style={{ cursor: 'pointer' }}>
                  {renderCookPage()}
                </div>
              ) : (
                renderCookPage()
              )}
              {/* Brief encouragement pill -- see showMotivation/
                  goNextCookPage. Sits in normal flow between the step
                  content and the Back/Next row rather than floating over
                  the button, so it never overlaps whatever the step
                  happens to end with (toppings, a note link, etc.) -- it
                  just nudges the buttons down a touch while it's showing.
                  Styled via .motivation-pill in globals.css (warm gold/
                  orange glossy gradient with a pop-in, one shine sweep, and
                  one glow pulse) rather than inline, since the animations
                  need real @keyframes. Keyed on motivationId so each new
                  message is a fresh DOM node -- otherwise React would just
                  swap the text and the entrance animation would never
                  replay after the first time. */}
              {motivationMsg && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
                  <div
                    key={motivationId}
                    className="motivation-pill"
                    style={{
                      padding: '6px 15px',
                      borderRadius: 100,
                      fontSize: 12.5,
                      fontWeight: 700,
                      fontFamily: "'Manrope',sans-serif",
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {motivationMsg}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={goPrevCookPage} style={navBtnStyle}>
                  ← Back
                </button>
                <div style={{ position: 'relative', flex: 1 }}>
                  <button className="gen-kitchen-btn cook-action-btn" onClick={goNextCookPage} style={{ width: '100%', marginBottom: 0 }}>
                    {cookStep === cookPages.length - 1 ? 'Finish' : 'Next →'}
                  </button>
                  {burstId > 0 && (
                    <SparkBurst key={burstId} intensity={cookProgress} onDone={() => setBurstId(0)} />
                  )}
                </div>
              </div>
              {burstId > 0 && (
                <LightningStrike key={`strike-${burstId}`} onDone={() => setBurstId(0)} />
              )}
              {completionStrike > 0 && (
                <LightningStrike key={`completion-strike-${completionStrike}`} onDone={handleCompletionStrikeDone} />
              )}
            </>
          )}
        </div>
      </div>

      {showAllSteps && (
        <div
          onClick={(e) => { e.stopPropagation(); setShowAllSteps(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 110, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, height: '85vh', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', padding: '18px 18px 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>All Steps</div>
              <div onClick={() => setShowAllSteps(false)} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
                ✕
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 12 }}>
              {instructions.map((step, i) => {
                const done = Boolean(completedSteps[i]);
                const isEditingStep = editingStepIndex === i;
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                    <div
                      onClick={() => toggleStepDone(i)}
                      style={{
                        flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                        background: done ? 'var(--lime)' : 'var(--s2)',
                        border: '1px solid var(--border)', color: done ? '#000' : 'var(--lime)', fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, cursor: 'pointer',
                      }}
                    >
                      {done ? '✓' : i + 1}
                    </div>
                    {isEditingStep ? (
                      <textarea
                        autoFocus
                        value={editingStepValue}
                        onChange={(e) => setEditingStepValue(e.target.value)}
                        onBlur={() => commitStepEdit(i)}
                        style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--cream)', fontSize: 13, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', minHeight: 50 }}
                      />
                    ) : (
                      <div
                        onClick={() => startEditingStep(i, step.text)}
                        style={{
                          fontSize: 14, lineHeight: 1.5, cursor: 'pointer', flex: 1,
                          color: done ? 'var(--muted)' : (step.edited ? 'var(--lime)' : 'var(--cream)'),
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {done ? step.text : <InstructionText text={step.text} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '12px 0 18px', borderTop: '1px solid var(--border)' }}>
              <button className="gen-kitchen-btn" style={{ marginBottom: 0 }} onClick={() => setShowAllSteps(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTutorial === 'decide' && (
        <RecipeTutorial steps={DECIDE_TUTORIAL_STEPS} mandatory={!tutorialSkippable} onClose={closeTutorial} />
      )}
      {activeTutorial === 'cook' && (
        <RecipeTutorial steps={COOK_TUTORIAL_STEPS} mandatory={!tutorialSkippable} onClose={closeTutorial} />
      )}
      {activeTutorial === 'rating' && (
        <RecipeTutorial steps={RATING_TUTORIAL_STEPS} mandatory={!tutorialSkippable} onClose={closeTutorial} />
      )}
    </div>
  );
}
