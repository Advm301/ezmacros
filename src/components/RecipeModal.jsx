import { useState, useEffect, useRef } from 'react';
import StarIcon from './StarIcon';
import StarRating from './StarRating';
import { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString } from '../hooks/useDiary';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
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
  // Picked once per recipe-modal session (not re-rolled on every render as
  // you page through steps) so the same line stays put through to Finish.
  // The actual pool (single-serving vs. meal-prep) is chosen later once
  // `r.servings` is known -- this just needs a stable index into whichever
  // pool applies.
  const [completionMsgSeed] = useState(() => Math.floor(Math.random() * 3));
  // Guided walkthrough of the decide screen (see RecipeTutorial.jsx) --
  // manually launched via the info button next to Let's Make It, not
  // gated by localStorage like the one-time coach callouts below (this
  // one's meant to be revisitable any time someone wants a refresher).
  const [showTutorial, setShowTutorial] = useState(false);
  // Three separate one-time "here's what this does" callouts (same
  // useFirstVisitTip hook the Kitchen/Browse/Diary tabs use for their own
  // first-visit tips), each shown automatically the first time its target
  // is ever on screen -- not the guided tutorial above, and independent of
  // it, so someone who never opens the tutorial still gets a lightweight
  // explanation of Add to Diary, editing amounts, and notes-auto-saving
  // the first time they'd naturally run into each one.
  const diaryTip = useFirstVisitTip('quickprep_seen_recipe_diary_tip');
  const editTip = useFirstVisitTip('quickprep_seen_recipe_edit_tip');
  const favoriteTip = useFirstVisitTip('quickprep_seen_recipe_favorite_tip');

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

  const components = (r.components || []).map((c, i) => {
    const override = entry?.ingredientOverrides?.[i];
    return override ? { ...c, quantity: override.quantity, unit: override.unit ?? c.unit, edited: true } : c;
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
    if (onRate && !alreadyRated) onRate(r.id, n, photoFile);
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
      setBurstId((id) => id + 1);
      // Only while still stepping between instructions -- the transition
      // into the closing rating page already gets its own, bigger
      // completion message, so a second little popup on top would just be
      // noise.
      if (cookPages[nextStep].type === 'instruction') {
        showMotivation(cookStep + 1, instructions.length);
      }
    } else {
      onClose();
    }
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
      <div id="tour-add-to-diary" style={{ marginBottom: 16, position: 'relative' }}>
        {/* First-time-only explanation of what this button actually does --
            aimed at someone who picked a single meal during onboarding and
            is opening a recipe for the very first time, before they've even
            seen the Diary tab. Never shown again once dismissed (see
            useFirstVisitTip). */}
        {diaryTip.show && (
          <div className="coach-callout" onClick={diaryTip.dismiss}>
            Add meals to your daily Diary to keep track of what you're eating, or plan ahead.
          </div>
        )}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
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
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: madeIt ? 10 : 14 }}>
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
              actually produced instead of a generic line. */}
          <div style={{ fontSize: 14, color: 'var(--cream)', marginBottom: 14, textAlign: 'center', lineHeight: 1.5, fontWeight: 600 }}>
            {getCompletionMessage(r.servings, completionMsgSeed)}
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
          <div style={{ marginTop: 20, position: 'relative' }}>
            {/* First-time-only explanation of the auto-save-to-Favorites
                behavior (see useSavedRecipes' autoSaveIfNeeded) -- easy to
                miss since nothing here says "favorites" anywhere on screen
                otherwise. */}
            {favoriteTip.show && (
              <div className="coach-callout" onClick={favoriteTip.dismiss}>
                Adding a note here automatically saves this recipe to your Favorites, so it's easy to find again.
              </div>
            )}
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
          margin: '20px auto',
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
                    exists at all until a recipe is actually multi-portion. */}
                {' · '}Serves {r.servings || 1}
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
            {r.servings > 1 && (
              <div style={{ marginTop: 6 }}>
                <span className="ezb pkg">📦 Meal Prep · Makes {r.servings}</span>
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
                const renderRow = (c, origIndex, isLast, isFirst) => {
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
                              id={isFirst ? 'tour-quantity-edit' : undefined}
                              onClick={() => startEditingIngredient(origIndex, c)}
                              style={{ fontSize: 12, color: c.edited ? 'var(--lime)' : 'var(--muted)', whiteSpace: 'nowrap', cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                            >
                              {display.value}{display.suffix}
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
                  <div style={{ marginBottom: 16, position: 'relative' }}>
                    {/* First-time-only explanation of the two things this
                        whole block lets you do -- tweak amounts here, and
                        (once cooking starts) tweak instruction wording too.
                        Anchored to the section as a whole rather than a
                        single row, since it's explaining a pattern that
                        applies to every row. */}
                    {editTip.show && (
                      <div className="coach-callout" onClick={editTip.dismiss}>
                        Tap any quantity to edit it -- and once you're cooking, tap any instruction step to rewrite it your way.
                      </div>
                    )}
                    <div id="tour-ingredients-check" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                      Check off what you already have. Tap a quantity to edit it, or the unit badge to switch between g/oz or ml/fl oz.
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: 1, paddingRight: seasonings.length > 0 ? 14 : 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Core Ingredients
                        </div>
                        {core.map((c, idx) => renderRow(c, c.index, idx === core.length - 1, idx === 0))}
                      </div>
                      {seasonings.length > 0 && (
                        <div style={{ flex: 1, paddingLeft: 14, borderLeft: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Seasonings
                          </div>
                          {seasonings.map((c, idx) => renderRow(c, c.index, idx === seasonings.length - 1, false))}
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
                    {/* Manually-launched guided walkthrough of this whole
                        screen (see RecipeTutorial.jsx) -- separate from the
                        one-time automatic coach callouts sprinkled through
                        this file, and revisitable any time, not just once. */}
                    <div
                      className="info-btn"
                      onClick={() => { hapticLight(); setShowTutorial(true); }}
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

      {showTutorial && <RecipeTutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
