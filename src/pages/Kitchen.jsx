import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';

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

function filterRecipes(recipes, mealTypeLabel, protein, flavor, quickFilter) {
  const mealTypeValue = MEAL_TYPES.find((m) => m.label === mealTypeLabel)?.value;
  return recipes.filter((r) => {
    if (mealTypeValue && r.mealType !== mealTypeValue) return false;
    if (protein && !r.proteins.includes(protein)) return false;
    if (flavor && r.flavor !== flavor) return false;
    if (quickFilter === 'air_fryer' && r.method !== 'Air Fryer') return false;
    if (quickFilter === 'high_protein' && !(r.tags || []).includes('high_protein')) return false;
    if (quickFilter === 'grab_and_go' && !(r.tags || []).includes('grab_and_go')) return false;
    return true;
  });
}

export default function Kitchen({ onOpen }) {
  const [mealType, setMealType] = useState(null);
  const [protein, setProtein] = useState(null);
  const [flavor, setFlavor] = useState(null);
  const [quickFilter, setQuickFilter] = useState(null);
  const [results, setResults] = useState(null);

  const handleFindRecipes = () => {
    setResults(filterRecipes(RECIPES, mealType, protein, flavor, quickFilter));
  };

  const reset = () => {
    setMealType(null);
    setProtein(null);
    setFlavor(null);
    setQuickFilter(null);
    setResults(null);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div className="h1">What Can I Make?</div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Pick a meal type (or all), a protein, and (optionally) a flavor — get quick recipes.
        </div>

        <div className="filter-sec">
          <div className="filter-label">Meal Type</div>
          <div className="scroll-row">
            <div
              className={`pill ${mealType === null ? 'active' : ''}`}
              onClick={() => setMealType(null)}
            >
              All Meals
            </div>
            {MEAL_TYPES.map((m) => (
              <div
                key={m.label}
                className={`pill ${mealType === m.label ? 'active' : ''}`}
                onClick={() => setMealType(m.label)}
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
                onClick={() => setQuickFilter(quickFilter === q.value ? null : q.value)}
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
              onClick={() => setProtein(null)}
            >
              Any Protein
            </div>
            {PROTEINS.map((p) => (
              <div
                key={p.value}
                className={`pill ${protein === p.value ? 'active' : ''}`}
                onClick={() => setProtein(protein === p.value ? null : p.value)}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-sec" style={{ marginBottom: 16 }}>
          <div className="filter-label">Flavor (optional)</div>
          <div className="scroll-row">
            {FLAVORS.map((f) => (
              <div
                key={f.value}
                className={`pill ${flavor === f.value ? 'active' : ''}`}
                onClick={() => setFlavor(flavor === f.value ? null : f.value)}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <button className="gen-kitchen-btn" onClick={handleFindRecipes}>
          ✦ Find Recipes
        </button>
      </div>

      {results !== null && (
        <div className="px" style={{ marginTop: 8 }}>
          {results.length === 0 ? (
            <div style={{ background: 'var(--s1)', border: '2px solid var(--lime)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)', marginBottom: 10 }}>
                No recipes match those filters
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
                Try a different protein or drop the flavor filter.
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
              {results.map((r) => (
                <div
                  key={r.id}
                  style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer' }}
                  onClick={() => onOpen && onOpen(r)}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 4 }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {r.method}{r.method && r.activeTime ? ' · ' : ''}{r.activeTime ? `${r.activeTime} min` : ''}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
