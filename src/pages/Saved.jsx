import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';
import { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString, formatDateString } from '../hooks/useDiary';
import { formatTime } from '../utils/time';

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

export default function Saved({
  saved,
  isSaved,
  toggleSaved,
  onOpen,
  getRatingSummary,
  getEntry,
  diary,
  view,
  onViewChange,
  selectedDate,
  onDateChange,
}) {
  const [dayMessage, setDayMessage] = useState('');
  const [generatingDay, setGeneratingDay] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);

  const savedIds = Object.keys(saved);
  const savedRecipes = RECIPES.filter((r) => savedIds.includes(String(r.id)));

  const dayEntries = diary ? diary.getEntriesForDate(selectedDate) : [];

  const showDayMessage = (msg) => {
    setDayMessage(msg);
    setTimeout(() => setDayMessage(''), 3000);
  };

  const handleSurpriseDay = async () => {
    if (!diary) return;
    setGeneratingDay(true);
    const usedIds = [];
    let addedCount = 0;
    for (const slot of FULL_DAY_SLOTS) {
      const alreadyFilled = dayEntries.some((e) => e.meal_slot === slot);
      if (alreadyFilled) continue;
      const recipe = pickRandomRecipe(SLOT_MEAL_TYPE[slot], usedIds);
      if (!recipe) continue;
      usedIds.push(recipe.id);
      const ok = await diary.addEntry(selectedDate, slot, recipe.id);
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
    setRegeneratingId(entry.id);
    const recipe = pickRandomRecipe(SLOT_MEAL_TYPE[entry.meal_slot] || 'lunch_dinner', [entry.recipe_id]);
    if (recipe) {
      await diary.removeEntry(entry.id);
      await diary.addEntry(entry.entry_date, entry.meal_slot, recipe.id);
    }
    setRegeneratingId(null);
  };

  const renderSavedRow = (r) => {
    const entry = getEntry ? getEntry(r.id) : null;
    const hasNotes = entry && entry.notes && entry.notes.trim().length > 0;
    const hasOverrides = entry && (
      Object.keys(entry.ingredientOverrides || {}).length > 0 ||
      Object.keys(entry.instructionOverrides || {}).length > 0
    );
    return (
      <div
        key={r.id}
        style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}
        onClick={() => onOpen(r)}
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
            {(hasNotes || hasOverrides) && (
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
                {hasNotes ? entry.notes.slice(0, 60) : 'Customized'}
              </div>
            )}
          </div>
          <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }}>
            <StarIcon filled={isSaved(r.id)} size={20} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div className="h1" style={{ marginBottom: 12 }}>Saved & Diary</div>

        <div className="scroll-row" style={{ marginBottom: 16 }}>
          <div className={`pill ${view === 'saved' ? 'active' : ''}`} onClick={() => onViewChange('saved')}>
            Saved Recipes
          </div>
          <div className={`pill ${view === 'diary' ? 'active' : ''}`} onClick={() => onViewChange('diary')}>
            Diary
          </div>
        </div>
      </div>

      {view === 'saved' ? (
        <>
          <div className="px">
            <div className="sub" style={{ marginBottom: 14 }}>
              Recipes you've starred.
            </div>
          </div>
          <div className="px">
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
        </>
      ) : (
        <>
          <div className="px">
            <div className="sub" style={{ marginBottom: 14 }}>
              Organize what you're eating each day -- no macros, just easy meals.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
              <div
                onClick={() => onDateChange(shiftDateString(selectedDate, -1))}
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
                onClick={() => onDateChange(shiftDateString(selectedDate, 1))}
                style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cream)', fontSize: 16, flexShrink: 0 }}
              >
                ›
              </div>
            </div>

            <button
              onClick={handleSurpriseDay}
              disabled={generatingDay}
              style={{
                width: '100%',
                background: 'var(--s2)',
                border: '1px solid var(--border)',
                color: 'var(--cream)',
                borderRadius: 13,
                padding: 12,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Manrope',sans-serif",
                cursor: generatingDay ? 'default' : 'pointer',
                opacity: generatingDay ? 0.6 : 1,
                marginBottom: 8,
              }}
            >
              {generatingDay ? 'Picking meals…' : '✦ Surprise Me — Fill My Day'}
            </button>
            {dayMessage && (
              <div style={{ fontSize: 12, color: 'var(--lime)', marginBottom: 8 }}>{dayMessage}</div>
            )}
          </div>

          <div className="px">
            {MEAL_SLOTS.map((slot) => {
              const slotEntries = dayEntries.filter((e) => e.meal_slot === slot);
              return (
                <div key={slot} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    {MEAL_SLOT_LABELS[slot]}
                  </div>
                  {slotEntries.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Nothing added yet</div>
                  ) : (
                    slotEntries.map((entry) => {
                      const r = RECIPES.find((rec) => rec.id === entry.recipe_id);
                      if (!r) return null;
                      const isRegenerating = regeneratingId === entry.id;
                      return (
                        <div
                          key={entry.id}
                          style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: isRegenerating ? 0.6 : 1 }}
                          onClick={() => onOpen(r)}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>{r.name}</div>
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
                            onClick={(e) => { e.stopPropagation(); diary.removeEntry(entry.id); }}
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
            })}
          </div>
        </>
      )}
    </div>
  );
}
