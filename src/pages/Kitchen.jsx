import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_STAPLES } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import PantryPickerModal from '../components/PantryPickerModal';
import SurpriseSparkles from '../components/SurpriseSparkles';
import FindRecipesSparkles from '../components/FindRecipesSparkles';
import { getProteinCardBackground } from '../utils/proteinColors';

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

// "High Protein" = estimated 35g+ protein per serving -- called out here
// since it's not obvious from the label alone what the cutoff is.
const QUICK_FILTERS = [
  { label: 'Air Fryer', value: 'air_fryer' },
  { label: 'High Protein (35g+)', value: 'high_protein' },
  { label: 'Grab & Go', value: 'grab_and_go' },
  { label: 'Meal Prep (multi-portion)', value: 'meal_prep' },
];

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));

// Native <select> in place of a horizontally-scrolling pill row -- tapping
// it opens the OS's own picker (the wheel on iOS) instead of requiring a
// swipe gesture to see the rest of the options. Styled to match the pill
// aesthetic as closely as a native form control allows; the picker sheet
// itself is rendered by the OS and isn't something we can restyle.
function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="filter-sec">
      <div className="filter-label">{label}</div>
      <div style={{ position: 'relative' }}>
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            background: 'var(--s2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--cream)',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Manrope',sans-serif",
            padding: '11px 34px 11px 14px',
            cursor: 'pointer',
          }}
        >
          {/* Real CSS gradients aren't supported inside a native <option>
              list (it renders in its own OS popup, not the app's DOM
              layers) -- this solid dark blue-black is the closest match to
              the app's teal-to-near-black palette that's reliably
              respected cross-browser, instead of the browser's default
              white. */}
          <option value="" style={{ backgroundColor: '#052d37', color: 'var(--cream)' }}>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ backgroundColor: '#052d37', color: 'var(--cream)' }}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--muted)', pointerEvents: 'none' }}
        >
          ▾
        </span>
      </div>
    </div>
  );
}

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
    if (quickFilter === 'meal_prep' && !(r.servings > 1)) return false;
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
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showPantryModal, setShowPantryModal] = useState(false);
  const [results, setResults] = useState(null);
  const [surpriseError, setSurpriseError] = useState('');

  const moreFiltersCount = (quickFilter ? 1 : 0) + (flavor ? 1 : 0);
  // Drives whether the "Clear All Filters" link shows at all -- no point
  // offering to clear filters that are already at their defaults.
  const anyFilterActive = Boolean(
    mealType || protein || flavor || quickFilter || selectedStaples.length > 0
  );

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
    setResults(null);
    setSurpriseError('');
  };

  const openRecipe = (r) => {
    hapticLight();
    if (onOpen) onOpen(r);
  };

  return (
    <div style={{ paddingBottom: 150 }}>
      <div className="px pt">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          {/* This is the app's flagship screen -- pick what you have, get a
              recipe -- so the title gets its own gradient treatment
              (kitchen-hero-title in globals.css) instead of the plain .h1
              every other page uses, tying back to this tab's own orange
              identity color (see KitchenIcon in App.jsx). */}
          <div className="kitchen-hero-title">What's In Your Kitchen?</div>
          {anyFilterActive && (
            <div
              onClick={reset}
              style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', marginTop: 6 }}
            >
              Clear All Filters
            </div>
          )}
        </div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Pick a meal type (or all), a protein, and (optionally) what's already in your kitchen — get quick recipes.
        </div>

        <FilterSelect
          label="Meal Type"
          placeholder="All Meals"
          value={mealType}
          onChange={(val) => selectMealType(val)}
          options={MEAL_TYPES.map((m) => ({ label: m.label, value: m.label }))}
        />

        <FilterSelect
          label="Protein"
          placeholder="Any Protein"
          value={protein}
          onChange={(val) => selectProtein(val)}
          options={PROTEINS.map((p) => ({ label: p.label, value: p.value }))}
        />

        {/* Quick Filter and Flavor are both optional refinements -- tucked
            behind a single collapsible toggle so the page doesn't front-load
            two extra rows of chips nobody has to touch. */}
        <div className="filter-sec">
          <div
            onClick={() => { hapticSelection(); setShowMoreFilters((v) => !v); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '6px 0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>More Filters</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>(Quick Filter, Flavor)</span>
              {moreFiltersCount > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#000', background: 'var(--lime)', borderRadius: 100, padding: '2px 7px' }}>
                  {moreFiltersCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: 'var(--muted)', transform: showMoreFilters ? 'rotate(180deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>
              ▾
            </span>
          </div>

          {showMoreFilters && (
            <div style={{ marginTop: 8 }}>
              <FilterSelect
                label="Quick Filter (optional)"
                placeholder="Any"
                value={quickFilter}
                onChange={(val) => selectQuickFilter(val)}
                options={QUICK_FILTERS.map((q) => ({ label: q.label, value: q.value }))}
              />

              <FilterSelect
                label="Flavor (optional)"
                placeholder="Any Flavor"
                value={flavor}
                onChange={(val) => selectFlavor(val)}
                options={FLAVORS.map((f) => ({ label: f.label, value: f.value }))}
              />
            </div>
          )}
        </div>

        {/* Pantry picking lives in its own drawer (PantryPickerModal) instead
            of rendering all ~30 chips across 5 categories inline -- this row
            is just a compact summary/entry point into it. */}
        <div className="filter-sec" style={{ marginBottom: 10 }}>
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

          {selectedStaples.length === 0 ? (
            <div
              onClick={() => { hapticLight(); setShowPantryModal(true); }}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13,
                color: 'var(--muted)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              + Add ingredients you have
            </div>
          ) : (
            <div
              className="scroll-row"
              onClick={() => { hapticLight(); setShowPantryModal(true); }}
              style={{ cursor: 'pointer' }}
            >
              {selectedStaples.map((id) => (
                <div key={id} className="pill active">
                  {PANTRY_LABELS[id] || id}
                </div>
              ))}
              <div className="pill">+ Edit</div>
            </div>
          )}
        </div>

        {surpriseError && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{surpriseError}</div>
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
                    style={{
                      background: getProteinCardBackground(r.proteins),
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 10,
                      cursor: 'pointer',
                    }}
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
                    {r.servings > 1 && (
                      <div style={{ marginTop: 4 }}>
                        <span className="ezb pkg">📦 Meal Prep · Makes {r.servings}</span>
                      </div>
                    )}
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

      {/* Sticky action bar -- always visible above the bottom nav so the
          primary "do the thing" action never gets buried below the filter
          sections, no matter how many are expanded. */}
      <div style={{ position: 'fixed', bottom: 58, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '10px 18px', boxSizing: 'border-box', zIndex: 25 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className="gen-kitchen-btn find-recipes-btn"
              style={{ width: '100%', marginBottom: 0 }}
              onClick={handleFindRecipes}
            >
              ✦ Find Recipes
            </button>
            <FindRecipesSparkles />
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className="gen-kitchen-btn surprise-btn"
              style={{ width: '100%', marginBottom: 0 }}
              onClick={handleSurpriseMe}
            >
              ✦ Surprise Me
            </button>
            <SurpriseSparkles />
          </div>
        </div>
      </div>

      {showPantryModal && (
        <PantryPickerModal
          selectedStaples={selectedStaples}
          toggleStaple={toggleStaple}
          onClose={() => setShowPantryModal(false)}
        />
      )}
    </div>
  );
}
