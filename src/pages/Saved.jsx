import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';
import { MEAL_SLOTS, MEAL_SLOT_LABELS, todayString, formatDateString } from '../hooks/useDiary';
import { formatTime } from '../utils/time';
import { buildShoppingList, formatShoppingQuantity } from '../utils/shoppingList';

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
  selectedDate,
  onDateChange,
}) {
  const [dayMessage, setDayMessage] = useState('');
  const [generatingDay, setGeneratingDay] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

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

  const handleClearDay = async () => {
    if (!diary || dayEntries.length === 0) return;
    const confirmed = window.confirm(`Clear all ${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'} for ${displayDate(selectedDate)}?`);
    if (!confirmed) return;
    const ok = await diary.clearDay(selectedDate);
    showDayMessage(ok ? 'Day cleared.' : 'Could not clear the day -- try again.');
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

  const shoppingList = showShoppingList ? buildShoppingList(dayEntries) : [];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="h1" style={{ marginBottom: 0 }}>Diary</div>
          <div
            onClick={() => setShowSavedModal(true)}
            title="Saved recipes"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <StarIcon filled={savedRecipes.length > 0} size={18} />
          </div>
        </div>

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

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            onClick={handleSurpriseDay}
            disabled={generatingDay}
            style={{
              flex: 1,
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              color: 'var(--cream)',
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
          <button
            onClick={() => setShowShoppingList((v) => !v)}
            style={{
              flex: 1,
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
              shoppingList.map((item, i) => (
                <div
                  key={`${item.name}-${item.unit}`}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < shoppingList.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <span style={{ fontSize: 13, color: 'var(--cream)' }}>{item.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{formatShoppingQuantity(item)}</span>
                </div>
              ))
            )}
          </div>
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

      {showSavedModal && (
        <div
          onClick={() => setShowSavedModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 70, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, maxHeight: '80vh', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', overflowY: 'auto', padding: '18px 18px 24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>Saved Recipes</div>
              <div
                onClick={() => setShowSavedModal(false)}
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
