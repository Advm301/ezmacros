import { useState, useEffect, useRef } from 'react';
import StarIcon from './StarIcon';
import StarRating from './StarRating';
import { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString } from '../hooks/useDiary';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';

const GRAMS_PER_OZ = 28.3495;
const ML_PER_FLOZ = 29.5735;

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
  const [completedSteps, setCompletedSteps] = useState({});
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingIngredientValue, setEditingIngredientValue] = useState('');
  const [unitModes, setUnitModes] = useState({});
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [editingStepValue, setEditingStepValue] = useState('');
  const [notesValue, setNotesValue] = useState(entry?.notes || '');
  const [madeIt, setMadeIt] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [ratedPhotoUrl, setRatedPhotoUrl] = useState(null);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [diaryDate, setDiaryDate] = useState(todayString());
  const [diaryError, setDiaryError] = useState('');
  const [addingToDiary, setAddingToDiary] = useState(false);

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

  // The cook screen is a sequence of pages: one per instruction, then an
  // optional toppings page, then notes, then rating as the closing "how'd
  // it go" wrap-up. Built fresh each render (cheap) rather than stored in
  // state, since it only depends on the recipe's own content.
  const cookPages = [];
  instructions.forEach((_, i) => cookPages.push({ type: 'instruction', index: i }));
  if (hasToppings) cookPages.push({ type: 'toppings' });
  cookPages.push({ type: 'notes' });
  if (onRate) cookPages.push({ type: 'rating' });

  const canCook = instructions.length > 0;

  const toggleStepDone = (i) => {
    hapticSelection();
    setCompletedSteps((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const toggleUnitMode = (i) => {
    hapticSelection();
    setUnitModes((prev) => ({ ...prev, [i]: prev[i] === 'alt' ? 'native' : 'alt' }));
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

  const goNextCookPage = () => {
    hapticLight();
    if (cookStep < cookPages.length - 1) {
      setDirection('forward');
      setCookStep((s) => s + 1);
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
    if (editingIngredientIndex !== null || editingStepIndex !== null) {
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
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: madeIt ? 10 : 0 }}>
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
      return (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Step {i + 1} of {instructions.length}
          </div>
          <div style={{ height: 4, background: 'var(--s2)', borderRadius: 100, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--lime)', borderRadius: 100, transition: 'width .25s ease' }} />
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', minHeight: 140 }}>
            <div
              onClick={() => toggleStepDone(i)}
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
                style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--cream)', fontSize: 16, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', minHeight: 100 }}
              />
            ) : (
              <div
                onClick={() => startEditingStep(i, step.text)}
                style={{
                  fontSize: 19, lineHeight: 1.55, cursor: 'pointer', flex: 1,
                  color: done ? 'var(--muted)' : (step.edited ? 'var(--lime)' : 'var(--cream)'),
                  textDecoration: done ? 'line-through' : 'none',
                }}
              >
                {step.text}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (page.type === 'toppings') {
      return (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Optional Toppings
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {r.toppings.map((t, i) => (
              <span
                key={i}
                style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: 100, padding: '6px 14px', fontSize: 13 }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (page.type === 'notes') {
      return (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Notes
          </div>
          <textarea
            autoFocus
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            onBlur={commitNotes}
            placeholder="Add your own notes -- substitutions, timing tweaks, anything worth remembering."
            style={{ width: '100%', minHeight: 120, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, color: 'var(--cream)', fontSize: 15, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
      );
    }

    if (page.type === 'rating') {
      return (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
            How'd It Go?
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
            Rate the recipe now that you've made it.
          </div>
          {renderRatingBlock()}
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
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {toggleSaved && (
              <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }} style={{ cursor: 'pointer' }} title={saved ? 'Tap to unsave' : 'Tap to save'}>
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
              {onAddToDiary && (
                <div style={{ marginBottom: 16 }}>
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
              )}

              {/* Ingredients */}
              {components.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Ingredients
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                    Tap a quantity to edit it. Tap the unit badge to switch between g/oz or ml/fl oz.
                  </div>
                  {components.map((c, i) => {
                    const isEditing = editingIngredientIndex === i;
                    const display = getQuantityDisplay(c.quantity, c.unit, c.name, unitModes[i]);
                    return (
                      <div
                        key={i}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < components.length - 1 ? '1px solid var(--border)' : 'none' }}
                      >
                        <span style={{ fontSize: 13, color: 'var(--cream)' }}>{c.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12 }}>
                          {isEditing ? (
                            <input
                              type="number"
                              autoFocus
                              value={editingIngredientValue}
                              onChange={(e) => setEditingIngredientValue(e.target.value)}
                              onBlur={() => commitIngredientEdit(i, c)}
                              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                              style={{ width: 64, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 6px', color: 'var(--cream)', fontSize: 13, textAlign: 'right' }}
                            />
                          ) : (
                            <span
                              onClick={() => startEditingIngredient(i, c)}
                              style={{ fontSize: 13, color: c.edited ? 'var(--lime)' : 'var(--muted)', whiteSpace: 'nowrap', cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                            >
                              {display.value}{display.suffix}
                            </span>
                          )}
                          {display.toggleable && (
                            <span
                              onClick={(e) => { e.stopPropagation(); toggleUnitMode(i); }}
                              style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              {display.altLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
                <>
                  <button className="gen-kitchen-btn" onClick={goToCook} style={{ marginTop: 4, marginBottom: 8 }}>
                    🍳 Let's Make It
                  </button>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
                    or swipe right to start cooking
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {renderCookPage()}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={goPrevCookPage} style={navBtnStyle}>
                  ← Back
                </button>
                <button className="gen-kitchen-btn" onClick={goNextCookPage} style={{ flex: 1, marginBottom: 0 }}>
                  {cookStep === cookPages.length - 1 ? 'Finish' : 'Next →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
