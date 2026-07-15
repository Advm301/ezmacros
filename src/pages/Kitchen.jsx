import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_CATEGORIES, PANTRY_STAPLES } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';

const MEAL_TYPES = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch_dinner' },
  { label: 'Dinner', value: 'lunch_dinner' },
  { label: 'Snack', value: 'snack' },
];

const PROTEINS = [
  { label: 'Chicken', value: 'chicken' },
  { label: 'Beef', value: 'beef' },
  { label: 'Turkey', value: 'turkey' },
  { label: 'Fish', value: 'fish' },
  { label: 'Eggs', value: 'eggs' },
  { label: 'Pork', value: 'pork' },
];

const FLAVORS = [
  { label: 'Spicy', value: 'spicy' },
  { label: 'Saucy', value: 'saucy' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Asian', value: 'asian' },
  { label: 'Italian', value: 'italian' },
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'BBQ', value: 'bbq' },
  { label: 'Mexican', value: 'mexican' },
];

const QUICK_FILTERS = [
  { label: 'Air Fryer', value: 'air_fryer' },
  { label: 'High Protein', value: 'high_protein' },
  { label: 'Grab & Go', value: 'grab_and_go' },
];

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));

// When pantry staples are selected, recipes are filtered to those that use
// at least one of them, then sorted so the recipes using the MOST of your
// picks show up first -- closest matches to "what I already have" win.
function filterRecipes(recipes, mealTypeLabel, protein, flavor, quickFilter, selectedStaples) {
  const mealTypeValue = MEAL_TYPES.find((m) => m.label === mealTypeLabel)?.value;
  let filtered = recipes.filter((r) => {
    if (mealTypeValue && r.mealType !== mealTypeValue) return false;
    if (protein && !r.proteins.includes(protein)) return false;
    if (flavor && r.flavor !== flavor) return false;
    if (quickFilter === 'air_fryer' && r.method !== 'Air Fryer') return false;
    if (quickFilter === 'high_protein' && !(r.tags || []).includes('high_protein')) return false;
    if (quickFilter === 'grab_and_go' && !(r.tags || []).includes('grab_and_go')) return false;
    return true;
  });

  if (selectedStaples.length > 0) {
    filtered = filtered
      .filter((r) => (r.pantryTags || []).some((t) => selectedStaples.includes(t)))
      .map((r) => ({ ...r, _matchCount: (r.pantryTags || []).filter((t) => selectedStaples.includes(t)).length }))
      .sort((a, b) => b._matchCount - a._matchCount);
  }

  return filtered;
}

export default function Kitchen({ onOpen, getRatingSummary }) {
  const [mealType, setMealType] = useState(null);
  const [protein, setProtein] = useState(null);
  const [flavor, setFlavor] = useState(null);
  const [quickFilter, setQuickFilter] = useState(null);
  const [selectedStaples, setSelectedStaples] = useState([]);
  const [pantrySearch, setPantrySearch] = useState('');
  const [results, setResults] = useState(null);
  const [surpriseError, setSurpriseError] = useState('');

  const toggleStaple = (id) => {
    hapticSelection();
    setSelectedStaples((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const selectMealType = (label) => {
    hapticSelection();
    setMealType(label);
  };

  const selectProtein = (value) => {
    hapticSelection();
    setProtein(value);
  };

  const selectFlavor = (value) => {
    hapticSelection();
    setFlavor(value);
  };

  const selectQuickFilter = (value) => {
    hapticSelection();
    setQuickFilter(value);
  };

  const handleFindRecipes = () => {
    hapticLight();
    setSurpriseError('');
    setResults(filterRecipes(RECIPES, mealType, protein, flavor, quickFilter, selectedStaples));
  };

  // Picks one random recipe from whatever the current filters/pantry
  // selection match (or the full recipe list if nothing is set) and opens
  // it directly -- a shortcut for "just decide for me."
  const handleSurpriseMe = () => {
    hapticMedium();
    setSurpriseError('');
    const pool = filterRecipes(RECIPES, mealType, protein, flavor, quickFilter, selectedStaples);
    if (pool.length === 0) {
      setSurpriseError('No recipes match those filters to surprise you with -- try loosening them.');
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (onOpen) onOpen(pick);
  };

  const reset = () => {
    hapticLight();
    setMealType(null);
    setProtein(null);
    setFlavor(null);
    setQuickFilter(null);
    setSelectedStaples([]);
    setPantrySearch('');
    setResults(null);
    setSurpriseError('');
  };

  const openRecipe = (r) => {
    hapticLight();
    if (onOpen) onOpen(r);
  };

  const searchLower = pantrySearch.trim().toLowerCase();
  const visibleCategories = PANTRY_CATEGORIES.map((cat) => ({
    category: cat.category,
    items: searchLower
      ? cat.items.filter((s) => s.label.toLowerCase().includes(searchLower))
      : cat.items,
  })).filter((cat) => cat.items.length > 0);

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div className="h1">What Can I Make?</div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Pick a meal type (or all), a protein, and (optionally) what's already in your kitchen — get quick recipes.
        </div>

        <div className="filter-sec">
          <div className="filter-label">Meal Type</div>
          <div className="scroll-row">
            <div
              className={`pill ${mealType === null ? 'active' : ''}`}
              onClick={() => selectMealType(null)}
            >
              All Meals
            </div>
            {MEAL_TYPES.map((m) => (
              <div
                key={m.label}
                className={`pill ${mealType === m.label ? 'active' : ''}`}
                onClick={() => selectMealType(m.label)}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-sec">
          <div className="filter-label">Quick Filter (optional)</div>
          <div className="scroll-row">
            {QUICK_FILTERS.map((q) => (
              <div
                key={q.value}
                className={`pill ${quickFilter === q.value ? 'active' : ''}`}
                onClick={() => selectQuickFilter(quickFilter === q.value ? null : q.value)}
              >
                {q.label}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-sec">
          <div className="filter-label">Protein</div>
          <div className="scroll-row">
            <div
              className={`pill ${protein === null ? 'active' : ''}`}
              onClick={() => selectProtein(null)}
            >
              Any Protein
            </div>
            {PROTEINS.map((p) => (
              <div
                key={p.value}
                className={`pill ${protein === p.value ? 'active' : ''}`}
                onClick={() => selectProtein(protein === p.value ? null : p.value)}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-sec">
          <div className="filter-label">Flavor (optional)</div>
          <div className="scroll-row">
            {FLAVORS.map((f) => (
              <div
                key={f.value}
                className={`pill ${flavor === f.value ? 'active' : ''}`}
                onClick={() => selectFlavor(flavor === f.value ? null : f.value)}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-sec" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="filter-label" style={{ marginBottom: 0 }}>
              What Do You Have? (optional)
            </div>
            {selectedStaples.length > 0 && (
              <div
                onClick={() => { hapticLight(); setSelectedStaples([]); }}
                style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear ({selectedStaples.length})
              </div>
            )}
          </div>

          <input
            type="text"
            value={pantrySearch}
            onChange={(e) => setPantrySearch(e.target.value)}
            placeholder="Search your pantry (e.g. rice, eggs, salsa)..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--cream)',
              fontSize: 13,
              padding: '10px 12px',
              marginBottom: 10,
              fontFamily: "'Manrope',sans-serif",
            }}
          />

          {visibleCategories.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              No pantry items match "{pantrySearch}".
            </div>
          ) : (
            visibleCategories.map((cat) => (
              <div key={cat.category} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                  {cat.category}
                </div>
                <div className="scroll-row">
                  {cat.items.map((s) => (
                    <div
                      key={s.id}
                      className={`pill ${selectedStaples.includes(s.id) ? 'active' : ''}`}
                      onClick={() => toggleStaple(s.id)}
                    >
                      {selectedStaples.includes(s.id) ? `✓ ${s.label}` : s.label}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="gen-kitchen-btn" style={{ flex: 1 }} onClick={handleFindRecipes}>
            ✦ Find Recipes
          </button>
          <button
            className="gen-kitchen-btn"
            style={{ flex: 1, background: 'var(--s2)', color: 'var(--cream)' }}
            onClick={handleSurpriseMe}
          >
            ✦ Surprise Me
          </button>
        </div>
        {surpriseError && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>{surpriseError}</div>
        )}
      </div>

      {results !== null && (
        <div className="px" style={{ marginTop: 8 }}>
          {results.length === 0 ? (
            <div style={{ background: 'var(--s1)', border: '2px solid var(--lime)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)', marginBottom: 10 }}>
                No recipes match those filters
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
                Try a different protein, drop the flavor filter, or select fewer pantry items.
              </div>
              <div className="quick-chip" style={{ display: 'inline-block' }} onClick={reset}>
                Start Over
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                <span style={{ color: 'var(--lime)' }}>●</span> {results.length} recipe{results.length > 1 ? 's' : ''}
              </div>
              {results.map((r) => {
                const missingStaples = selectedStaples.length > 0
                  ? (r.pantryTags || []).filter((t) => !selectedStaples.includes(t))
                  : [];
                return (
                  <div
                    key={r.id}
                    style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer' }}
                    onClick={() => openRecipe(r)}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 4 }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
                      {getRatingSummary && getRatingSummary(r.id) && (
                        <> · ★ {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
                      )}
                    </div>
                    {selectedStaples.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--lime)', marginTop: 4 }}>
                        Uses {r._matchCount} of your {selectedStaples.length} pick{selectedStaples.length === 1 ? '' : 's'}
                        {missingStaples.length > 0 && (
                          <span style={{ color: 'var(--muted)' }}>
                            {' '}· also needs: {missingStaples.map((t) => PANTRY_LABELS[t] || t).join(', ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
