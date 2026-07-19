import { useState, useMemo, useEffect } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';
import { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString, formatDateString } from '../hooks/useDiary';
import { formatTime } from '../utils/time';
import { buildShoppingList, formatShoppingQuantity } from '../utils/shoppingList';
import { computeLoggingStreak } from '../utils/streak';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import LightningIcon from '../components/LightningIcon';
import SurpriseSparkles from '../components/SurpriseSparkles';
import FirstVisitTip from '../components/FirstVisitTip';
import InfoIcon from '../components/InfoIcon';
import useFirstVisitTip from '../hooks/useFirstVisitTip';

// Maps a diary meal slot to the recipe mealType pool it should draw random
// picks from. Lunch and Dinner share the same 'lunch_dinner' pool.
const SLOT_MEAL_TYPE = {
  breakfast: 'breakfast',
  lunch: 'lunch_dinner',
  dinner: 'lunch_dinner',
  snack: 'snack',
};

// Full-day Surprise Me only fills Breakfast/Lunch/Dinner -- Snack stays a
// manual add, and any slot that already has an entry is left untouched.
const FULL_DAY_SLOTS = ['breakfast', 'lunch', 'dinner'];

function shiftDateString(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return formatDateString(d);
}

function displayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = todayString();
  const label = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return dateStr === today ? `Today · ${label}` : label;
}

function pickRandomRecipe(mealType, excludeIds) {
  const pool = RECIPES.filter((r) => r.mealType === mealType && !excludeIds.includes(r.id));
  const finalPool = pool.length > 0 ? pool : RECIPES.filter((r) => r.mealType === mealType);
  if (finalPool.length === 0) return null;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

// Shopping-list "have it already" checkboxes are saved per-day so hiding and
// re-showing the list (or leaving and coming back to the same date) doesn't
// lose what was already checked off -- keyed by date since a different day's
// list is an entirely different set of items.
function shoppingCheckedKey(dateStr) {
  return `quickprep_shopping_checked_${dateStr}`;
}

function loadShoppingChecked(dateStr) {
  try {
    const raw = localStorage.getItem(shoppingCheckedKey(dateStr));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function Saved({
  saved,
  isSaved,
  toggleSaved,
  onOpen,
  getRatingSummary,
  getEntry,
  diary,
  selectedDate,
  onDateChange,
  // Briefly calls out whichever single entry Finish-cooking just navigated
  // here for -- self-clears after a few seconds (see the effect below).
  // Unrelated to the persistent onboarding highlight below; an ordinary
  // "I just cooked this" add doesn't deserve a permanent glow.
  highlightedEntryId,
  onConsumeHighlightedEntry,
  // The full-day onboarding hand-off's entries (breakfast/lunch/dinner all
  // added at once) -- see App.jsx's onboardingHighlightedEntryIds. Unlike
  // highlightedEntryId above, this does NOT auto-clear on a timer: it's
  // meant to stay lit up for exactly as long as those original onboarding
  // picks are still sitting in the Diary, mirroring Kitchen's justOnboarded
  // hero-card treatment (see Kitchen.jsx's own comment on the same
  // reasoning). It "clears" implicitly the moment an entry is removed --
  // once gone, it's no longer in dayEntries below and so can't render
  // highlighted regardless of whether its id is still in this list.
  onboardingHighlightedEntryIds = [],
}) {
  const [dayMessage, setDayMessage] = useState('');
  const [generatingDay, setGeneratingDay] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [shoppingChecked, setShoppingChecked] = useState(() => loadShoppingChecked(selectedDate));
  const tip = useFirstVisitTip('quickprep_seen_diary_tip');

  // Re-derive the checked-off map whenever the viewed date changes -- this
  // is the "adjust state when a prop changes" pattern React recommends
  // doing directly during render (not inside an effect, which would cause
  // an extra cascading render pass just to reset state a prop already told
  // us to reset). A ref alone can't drive this since the new value has to
  // come from localStorage, not be derived from selectedDate directly.
  const [checkedForDate, setCheckedForDate] = useState(selectedDate);
  if (checkedForDate !== selectedDate) {
    setCheckedForDate(selectedDate);
    setShoppingChecked(loadShoppingChecked(selectedDate));
  }

  const toggleShoppingChecked = (itemName) => {
    hapticSelection();
    setShoppingChecked((prev) => {
      const next = { ...prev, [itemName]: !prev[itemName] };
      try {
        localStorage.setItem(shoppingCheckedKey(selectedDate), JSON.stringify(next));
      } catch {
        // Storage unavailable -- checkbox state just won't persist this session.
      }
      return next;
    });
  };

  // Briefly calls out whichever entry Finish just navigated here for (see
  // App.jsx's highlightedDiaryEntryId) -- self-clears after a few seconds
  // via onConsumeHighlightedEntry so the glow doesn't linger forever, and
  // clears early if the person navigates away/back before the timer fires.
  useEffect(() => {
    if (!highlightedEntryId) return;
    const timer = setTimeout(() => {
      if (onConsumeHighlightedEntry) onConsumeHighlightedEntry();
    }, 3000);
    return () => clearTimeout(timer);
  }, [highlightedEntryId, onConsumeHighlightedEntry]);

  const savedIds = Object.keys(saved);
  const savedRecipes = RECIPES.filter((r) => savedIds.includes(String(r.id)));

  const dayEntries = diary ? diary.getEntriesForDate(selectedDate) : [];

  // The onboarding highlight only "counts" for entries that are actually
  // still on today's list -- see the onboardingHighlightedEntryIds prop
  // comment above for why this is what makes it self-clear on removal
  // without any extra plumbing.
  const activeOnboardingHighlightIds = onboardingHighlightedEntryIds.filter((id) =>
    dayEntries.some((e) => e.id === id)
  );

  const streak = useMemo(() => computeLoggingStreak(diary?.entries || []), [diary]);

  const showDayMessage = (msg) => {
    setDayMessage(msg);
    setTimeout(() => setDayMessage(''), 3000);
  };

  const handleSurpriseDay = async () => {
    if (!diary) return;
    hapticMedium();
    setGeneratingDay(true);
    const usedIds = [];
    let addedCount = 0;
    for (const slot of FULL_DAY_SLOTS) {
      const alreadyFilled = dayEntries.some((e) => e.meal_slot === slot);
      if (alreadyFilled) continue;
      const recipe = pickRandomRecipe(SLOT_MEAL_TYPE[slot], usedIds);
      if (!recipe) continue;
      usedIds.push(recipe.id);
      const ok = await diary.addEntry(selectedDate, slot, recipe.id, true);
      if (ok) addedCount += 1;
    }
    setGeneratingDay(false);
    if (addedCount === 0) {
      showDayMessage('Every slot is already filled -- remove an entry first to regenerate it.');
    } else {
      showDayMessage(`Added ${addedCount} surprise meal${addedCount === 1 ? '' : 's'} to today's slots!`);
    }
  };

  const handleRegenerate = async (entry) => {
    if (!diary) return;
    hapticLight();
    setRegeneratingId(entry.id);
    const recipe = pickRandomRecipe(SLOT_MEAL_TYPE[entry.meal_slot] || 'lunch_dinner', [entry.recipe_id]);
    if (recipe) {
      await diary.removeEntry(entry.id);
      // Regenerate is also a randomized pick (same pool logic as Surprise
      // Me, just scoped to one slot), so it gets the same surprise badge.
      await diary.addEntry(entry.entry_date, entry.meal_slot, recipe.id, true);
    }
    setRegeneratingId(null);
  };

  const handleRemoveEntry = (entryId) => {
    hapticLight();
    diary.removeEntry(entryId);
  };

  const handleClearDay = async () => {
    if (!diary || dayEntries.length === 0) return;
    const confirmed = window.confirm(`Clear all ${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'} for ${displayDate(selectedDate)}?`);
    if (!confirmed) return;
    hapticMedium();
    const ok = await diary.clearDay(selectedDate);
    showDayMessage(ok ? 'Day cleared.' : 'Could not clear the day -- try again.');
  };

  const openRecipe = (r) => {
    hapticLight();
    onOpen(r);
  };

  const shiftDate = (days) => {
    hapticSelection();
    onDateChange(shiftDateString(selectedDate, days));
  };

  const handleRemoveSaved = (id) => {
    hapticLight();
    toggleSaved(id);
  };

  const renderSavedRow = (r) => {
    const entry = getEntry ? getEntry(r.id) : null;
    const hasNotes = entry && entry.notes && entry.notes.trim().length > 0;
    // Per-step comments jotted mid-cook ("used low-sodium sauce", "needed 2
    // extra minutes") -- these also auto-save the recipe (see
    // useSavedRecipes' updateStepNote), but were previously invisible here:
    // finding one again meant reopening the full cook wizard and clicking
    // through to that exact step. Surfacing them right in this row, labeled
    // by step number, is the point of this view -- see the note without
    // starting the recipe over.
    const stepNoteEntries = Object.entries(entry?.stepNotes || {})
      .filter(([, text]) => text && text.trim().length > 0)
      .sort(([a], [b]) => Number(a) - Number(b));
    const hasOverrides = entry && (
      Object.keys(entry.ingredientOverrides || {}).length > 0 ||
      Object.keys(entry.instructionOverrides || {}).length > 0
    );
    return (
      <div
        key={r.id}
        style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}
        onClick={() => openRecipe(r)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2 }}>
              {r.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
              {getRatingSummary && getRatingSummary(r.id) && (
                <> · ★ {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
              )}
            </div>
            {(hasNotes || stepNoteEntries.length > 0 || hasOverrides) && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {hasNotes && (
                  <div style={{ fontSize: 11.5, color: 'var(--cream)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{entry.notes}"
                  </div>
                )}
                {stepNoteEntries.map(([index, text]) => (
                  <div key={index} style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--lime)', fontWeight: 700 }}>Step {Number(index) + 1}:</span> {text}
                  </div>
                ))}
                {!hasNotes && stepNoteEntries.length === 0 && hasOverrides && (
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>Customized</div>
                )}
              </div>
            )}
          </div>
          <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }}>
            <StarIcon filled={isSaved(r.id)} size={20} />
          </div>
          <div
            onClick={(e) => { e.stopPropagation(); handleRemoveSaved(r.id); }}
            title="Remove from Saved"
            style={{ fontSize: 18, color: 'var(--muted)', padding: 4, cursor: 'pointer', lineHeight: 1 }}
          >
            ✕
          </div>
        </div>
      </div>
    );
  };

  const shoppingList = showShoppingList ? buildShoppingList(dayEntries) : [];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="page-h1" style={{ marginBottom: 0 }}>Diary</div>
            <div className="info-btn" onClick={tip.reopen} title="Show info">
              <InfoIcon />
            </div>
            {streak > 0 && (
              <div
                title="Consecutive days with something logged"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 100, padding: '4px 10px', color: 'var(--lime)' }}
              >
                <LightningIcon id="streak" />
                <span style={{ fontSize: 12, fontWeight: 700 }}>{streak} day{streak === 1 ? '' : 's'}</span>
              </div>
            )}
          </div>
          <div
            onClick={() => { hapticLight(); setShowSavedModal(true); }}
            title="Saved recipes"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <StarIcon filled={savedRecipes.length > 0} size={18} />
          </div>
        </div>

        <div className="sub" style={{ marginBottom: 14 }}>
          Organize what you're eating each day -- no macros, just easy meals.
        </div>

        <FirstVisitTip show={tip.show} onDismiss={tip.dismiss}>
          This is your Diary -- log what you're eating for Breakfast, Lunch, Dinner, and Snacks, one day at a time. Hit Surprise Me for an instant pick, or use Shopping List to see everything you'll need for the day.
        </FirstVisitTip>

        {/* One-time celebratory hand-off from full-day onboarding -- the
            Diary-tab equivalent of Kitchen's justOnboarded banner (see
            Kitchen.jsx), reusing the exact same .kitchen-ready-banner/
            .kitchen-ready-title/.kitchen-ready-sub classes so both
            "onboarding just delivered your first real payoff" moments look
            and feel like the same feature. Stays up for as long as any of
            the onboarding-added entries are still on today's list -- see
            activeOnboardingHighlightIds above -- not on a timer, same
            persistence model as Kitchen's own banner. */}
        {activeOnboardingHighlightIds.length > 0 && (
          <div className="kitchen-ready-banner">
            <LightningIcon size={30} id="diary-ready" />
            <div className="kitchen-ready-title">Your Day Is Ready!</div>
            <div className="kitchen-ready-sub">Breakfast, lunch, and dinner are all set below -- tap any meal to dive in.</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
          <div
            onClick={() => shiftDate(-1)}
            style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cream)', fontSize: 16, flexShrink: 0 }}
          >
            ‹
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)' }}>{displayDate(selectedDate)}</div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              style={{ marginTop: 4, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: 11, padding: '2px 6px' }}
            />
          </div>
          <div
            onClick={() => shiftDate(1)}
            style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cream)', fontSize: 16, flexShrink: 0 }}
          >
            ›
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={handleSurpriseDay}
              disabled={generatingDay}
              className="surprise-btn"
              style={{
                width: '100%',
                borderRadius: 13,
                padding: 12,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Manrope',sans-serif",
                cursor: generatingDay ? 'default' : 'pointer',
                opacity: generatingDay ? 0.6 : 1,
              }}
            >
              {generatingDay ? 'Picking…' : '✦ Surprise Me'}
            </button>
            {!generatingDay && <SurpriseSparkles />}
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => {
                hapticSelection();
                setShowShoppingList((v) => !v);
              }}
              style={{
                width: '100%',
                background: showShoppingList ? 'var(--lime)' : 'var(--s2)',
                border: '1px solid var(--border)',
                color: showShoppingList ? '#000' : 'var(--cream)',
                borderRadius: 13,
                padding: 12,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Manrope',sans-serif",
                cursor: 'pointer',
              }}
            >
              {showShoppingList ? 'Hide List' : 'Shopping List'}
            </button>
          </div>
        </div>

        {dayEntries.length > 0 && (
          <div
            onClick={handleClearDay}
            style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', marginBottom: 8, textAlign: 'right' }}
          >
            Clear Day
          </div>
        )}

        {dayMessage && (
          <div style={{ fontSize: 12, color: 'var(--lime)', marginBottom: 8 }}>{dayMessage}</div>
        )}

        {showShoppingList && (
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Shopping List — {displayDate(selectedDate)}
            </div>
            {shoppingList.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
                Nothing planned for this day yet -- add a meal to build a list.
              </div>
            ) : (
              shoppingList.map((item, i) => {
                const checked = !!shoppingChecked[item.name];
                return (
                  <div
                    key={`${item.name}-${item.unit}`}
                    onClick={() => toggleShoppingChecked(item.name)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between', padding: '6px 0', borderBottom: i < shoppingList.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          flexShrink: 0,
                          border: `1.5px solid ${checked ? 'var(--lime)' : 'var(--border)'}`,
                          background: checked ? 'var(--lime)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 900,
                          color: '#000',
                        }}
                      >
                        {checked ? '✓' : ''}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: checked ? 'var(--muted)' : 'var(--cream)',
                          textDecoration: checked ? 'line-through' : 'none',
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--muted)', flexShrink: 0 }}>{formatShoppingQuantity(item)}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="px">
        {dayEntries.length === 0 ? (
          // The whole day is blank -- rather than four empty "Nothing added
          // yet" slots, point at the two actual ways to fill it. Deliberately
          // not calorie/nutrition framed (not this app's focus) and not the
          // "Did you eat yet?" MyFitnessPal line.
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)', marginBottom: 6 }}>
              Nothing on the books today.
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              Hit Surprise Me above, or head to Kitchen if you already know what you're working with.
            </div>
          </div>
        ) : (
          MEAL_SLOTS.map((slot) => {
            const slotEntries = dayEntries.filter((e) => e.meal_slot === slot);
            return (
              <div key={slot} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {MEAL_SLOT_LABELS[slot]}
                </div>
                {slotEntries.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                    {slot === 'snack'
                      // Surprise Me only fills Breakfast/Lunch/Dinner (see
                      // FULL_DAY_SLOTS above) -- Snack always needs a manual
                      // add, so the plain "Nothing added yet" line left no
                      // hint of how to actually do that. Points at both real
                      // ways in: browsing the catalog directly, or matching
                      // against what's on hand in Kitchen.
                      ? "Nothing added yet -- find one in Browse, or match what you've got in Kitchen."
                      : 'Nothing added yet'}
                  </div>
                ) : (
                  slotEntries.map((entry) => {
                    const r = RECIPES.find((rec) => rec.id === entry.recipe_id);
                    if (!r) return null;
                    const isRegenerating = regeneratingId === entry.id;
                    const isHighlighted = entry.id === highlightedEntryId || activeOnboardingHighlightIds.includes(entry.id);
                    return (
                      <div
                        key={entry.id}
                        className={isHighlighted ? 'diary-entry-highlight' : undefined}
                        style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: isRegenerating ? 0.6 : 1 }}
                        onClick={() => openRecipe(r)}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            {r.name}
                            {entry.is_surprise && (
                              <span
                                title="Added via Surprise Me"
                                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--magic)', fontSize: 12, flexShrink: 0 }}
                              >
                                ★<span className="surprise-sparkle-inline" aria-hidden="true">✦</span>
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
                          </div>
                        </div>
                        <div
                          onClick={(e) => { e.stopPropagation(); if (!isRegenerating) handleRegenerate(entry); }}
                          title="Regenerate this meal"
                          style={{ fontSize: 16, color: 'var(--muted)', padding: 6, cursor: isRegenerating ? 'default' : 'pointer' }}
                        >
                          ↻
                        </div>
                        <div
                          onClick={(e) => { e.stopPropagation(); handleRemoveEntry(entry.id); }}
                          style={{ fontSize: 18, color: 'var(--muted)', padding: 6, cursor: 'pointer' }}
                        >
                          ✕
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })
        )}
      </div>

      {showSavedModal && (
        <div
          onClick={() => { hapticLight(); setShowSavedModal(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 70, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, maxHeight: '80vh', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', overflowY: 'auto', padding: '18px 18px 24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>Saved Recipes</div>
              <div
                onClick={() => { hapticLight(); setShowSavedModal(false); }}
                style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}
              >
                ✕
              </div>
            </div>
            {savedRecipes.length === 0 ? (
              <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                  Nothing saved yet. Tap the star on any recipe to keep it here.
                </div>
              </div>
            ) : (
              savedRecipes.map(renderSavedRow)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
