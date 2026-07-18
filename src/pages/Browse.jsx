import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';
import LightningIcon from '../components/LightningIcon';
import EffortGauge from '../components/EffortGauge';
import FirstVisitTip from '../components/FirstVisitTip';
import InfoIcon from '../components/InfoIcon';
import useFirstVisitTip from '../hooks/useFirstVisitTip';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight } from '../utils/haptics';
import { getProteinCardBackground } from '../utils/proteinColors';

const MEAL_SECTIONS = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch & Dinner', value: 'lunch_dinner' },
  { label: 'Snacks', value: 'snack' },
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

const METHODS = [
  { label: 'Air Fryer', value: 'Air Fryer' },
  { label: 'Slow Cooker', value: 'Slow Cooker' },
  { label: 'Bake', value: 'Bake' },
  { label: 'Skillet', value: 'Skillet' },
  { label: 'Stovetop', value: 'Stovetop' },
  { label: 'No Cook', value: 'No Cook' },
  { label: 'Microwave', value: 'Microwave' },
];

// Same native-<select> pattern as Kitchen's FilterSelect -- tapping opens
// the OS picker instead of requiring a swipe through a pill row. Duplicated
// here rather than shared/imported to keep each page's filter set free to
// diverge without coupling the two together.
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

export default function Browse({ onOpen, isSaved, toggleSaved, getRatingSummary }) {
  const tip = useFirstVisitTip('quickprep_seen_browse_tip');
  const [search, setSearch] = useState('');
  const [mealFilter, setMealFilter] = useState(null);
  const [proteinFilter, setProteinFilter] = useState(null);
  const [flavorFilter, setFlavorFilter] = useState(null);
  const [methodFilter, setMethodFilter] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  const [grabAndGoOnly, setGrabAndGoOnly] = useState(false);
  const [mealPrepOnly, setMealPrepOnly] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  // Sorting is separate from the filters above -- it reorders results
  // rather than removing any, so it's left out of anyFilterActive /
  // clearAllFilters on purpose.
  const [sortByRating, setSortByRating] = useState(false);
  // Each meal section (Breakfast / Lunch & Dinner / Snacks) starts closed --
  // all three expanded by default was the exact "everything dumped on one
  // screen" clutter this redesign is meant to fix. Opening one reveals its
  // list inside a fixed-height scroll area rather than growing the page.
  const [openSections, setOpenSections] = useState({});

  const moreFiltersCount = (proteinFilter ? 1 : 0) + (flavorFilter ? 1 : 0);
  // Drives whether the "Clear All Filters" link shows at all -- no point
  // offering to clear filters that are already at their defaults.
  const anyFilterActive = Boolean(
    search || mealFilter || proteinFilter || flavorFilter || methodFilter ||
    showSavedOnly || highProteinOnly || grabAndGoOnly || mealPrepOnly
  );
  const clearAllFilters = () => {
    hapticLight();
    setSearch('');
    setMealFilter(null);
    setProteinFilter(null);
    setFlavorFilter(null);
    setMethodFilter(null);
    setShowSavedOnly(false);
    setHighProteinOnly(false);
    setGrabAndGoOnly(false);
    setMealPrepOnly(false);
  };
  // A search or a picked meal type is an explicit signal the person wants to
  // see matches right now -- forcing sections open in that case avoids the
  // frustrating "I searched but the results are hidden behind a collapsed
  // section" trap.
  const isFiltering = search.trim().length > 0;

  const toggleSection = (value) => {
    hapticSelection();
    setOpenSections((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  let filtered = RECIPES.filter((r) => {
    const tags = r.tags || [];
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchMeal = !mealFilter || r.mealType === mealFilter;
    const matchProtein = !proteinFilter || r.proteins.includes(proteinFilter);
    const matchFlavor = !flavorFilter || r.flavor === flavorFilter;
    const matchMethod = !methodFilter || r.method === methodFilter;
    const matchSaved = !showSavedOnly || isSaved(r.id);
    const matchHighProtein = !highProteinOnly || tags.includes('high_protein');
    const matchGrabAndGo = !grabAndGoOnly || tags.includes('grab_and_go');
    const matchMealPrep = !mealPrepOnly || r.servings > 1;
    return matchSearch && matchMeal && matchProtein && matchFlavor && matchMethod && matchSaved && matchHighProtein && matchGrabAndGo && matchMealPrep;
  });

  // Top-rated first: recipes with at least one rating sort by average
  // (ties broken by rating count, so a 5.0 from 1 person doesn't outrank a
  // 4.8 from 20), unrated recipes drop to the bottom rather than being
  // filtered out entirely -- this is a reorder, not a filter.
  if (sortByRating && getRatingSummary) {
    filtered = [...filtered].sort((a, b) => {
      const ra = getRatingSummary(a.id);
      const rb = getRatingSummary(b.id);
      if (ra && rb) return rb.avg - ra.avg || rb.count - ra.count;
      if (ra && !rb) return -1;
      if (!ra && rb) return 1;
      return 0;
    });
  }

  const sections = MEAL_SECTIONS.filter((s) => !mealFilter || s.value === mealFilter);

  const select = (setter) => (value) => {
    hapticSelection();
    setter(value);
  };
  const selectMeal = select(setMealFilter);
  const selectProtein = select(setProteinFilter);
  const selectFlavor = select(setFlavorFilter);
  const selectMethod = select(setMethodFilter);

  const toggleSavedOnly = () => { hapticSelection(); setShowSavedOnly((v) => !v); };
  const toggleHighProtein = () => { hapticSelection(); setHighProteinOnly((v) => !v); };
  const toggleGrabAndGo = () => { hapticSelection(); setGrabAndGoOnly((v) => !v); };
  const toggleMealPrep = () => { hapticSelection(); setMealPrepOnly((v) => !v); };

  const openRecipe = (r) => {
    hapticLight();
    onOpen(r);
  };

  const renderRecipeRow = (r) => (
    <div
      key={r.id}
      style={{
        background: getProteinCardBackground(r.proteins),
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        cursor: 'pointer',
      }}
      onClick={() => openRecipe(r)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2 }}>
            {r.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <span>
              {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
              {getRatingSummary && getRatingSummary(r.id) && (
                <> · ★ {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
              )}
            </span>
            {/* Quick Prep gauge -- 1-3 bolts showing relative effort (see
                EffortGauge/utils/effortLevel.js). Everything here is
                already quick; this just surfaces which are the absolute
                quickest vs. a touch more involved. */}
            <span>·</span>
            <EffortGauge recipe={r} size={11} />
          </div>
          {(r.tags || []).length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {/* .ezb.ez1/.ez3 are existing soft-tinted badge classes already
                  defined in globals.css (same accent colors used elsewhere
                  in the app) -- reusing them instead of one-off colors keeps
                  these consistent with the rest of the palette. Gold for
                  High Protein reads as "powered up"/energy; lime-green for
                  Grab & Go reads as "fresh/fast" -- distinct hues so the two
                  are easy to tell apart at a glance. */}
              {r.tags.includes('high_protein') && (
                <span className="ezb ez3"><LightningIcon id={`browse-hp-${r.id}`} size={12} /> High Protein</span>
              )}
              {r.tags.includes('grab_and_go') && (
                <span className="ezb ez1">Grab & Go</span>
              )}
            </div>
          )}
          {r.servings > 1 && (
            <div style={{ marginTop: 4 }}>
              <span className="ezb pkg">📦 Meal Prep · Makes {r.servings}</span>
            </div>
          )}
        </div>
        <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }}>
          <StarIcon filled={isSaved(r.id)} size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="page-h1" style={{ marginBottom: 0 }}>Browse Recipes</div>
            <div className="info-btn" onClick={tip.reopen} title="Show info">
              <InfoIcon />
            </div>
          </div>
          {anyFilterActive && (
            <div
              onClick={clearAllFilters}
              style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
            >
              Clear All Filters
            </div>
          )}
        </div>

        <FirstVisitTip show={tip.show} onDismiss={tip.dismiss}>
          This is the full QuickPrep catalog -- search by name or use the filters below to narrow it down by meal type, method, protein, or effort level.
        </FirstVisitTip>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', color: 'var(--cream)', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' }}
        />

        <FilterSelect
          label="Meal Type"
          placeholder="All Meals"
          value={mealFilter}
          onChange={selectMeal}
          options={MEAL_SECTIONS}
        />

        <FilterSelect
          label="Method"
          placeholder="Any Method"
          value={methodFilter}
          onChange={selectMethod}
          options={METHODS}
        />

        {/* Saved / High Protein / Grab & Go are simple on-off toggles -- only
            3 of them, so a non-scrolling row of pills is clearer than a
            dropdown (and matches how the tags are displayed on each recipe
            row below). "High Protein" is called out at 35g+ so the cutoff
            isn't a mystery. */}
        <div className="filter-sec">
          <div className="filter-label">Quick Toggles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <div className={`pill ${showSavedOnly ? 'active' : ''}`} onClick={toggleSavedOnly}>
              {showSavedOnly ? '★ Saved' : '☆ Saved'}
            </div>
            <div className={`pill ${highProteinOnly ? 'active' : ''}`} onClick={toggleHighProtein}>
              High Protein (35g+)
            </div>
            <div className={`pill ${grabAndGoOnly ? 'active' : ''}`} onClick={toggleGrabAndGo}>
              Grab & Go
            </div>
            <div className={`pill ${mealPrepOnly ? 'active' : ''}`} onClick={toggleMealPrep}>
              📦 Meal Prep
            </div>
          </div>
        </div>

        {/* Protein and Flavor are further refinements on top of Meal Type +
            Method -- tucked behind a collapsible section so the page isn't
            front-loading four dropdowns before showing any results. */}
        <div className="filter-sec">
          <div
            onClick={() => { hapticSelection(); setShowMoreFilters((v) => !v); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '6px 0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>More Filters</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>(Protein, Flavor)</span>
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
                label="Protein (optional)"
                placeholder="Any Protein"
                value={proteinFilter}
                onChange={selectProtein}
                options={PROTEINS}
              />

              <FilterSelect
                label="Flavor (optional)"
                placeholder="Any Flavor"
                value={flavorFilter}
                onChange={selectFlavor}
                options={FLAVORS}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div className="sub" style={{ marginTop: 0 }}>
            {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
          </div>
          <div
            className={`pill ${sortByRating ? 'active' : ''}`}
            onClick={() => { hapticSelection(); setSortByRating((v) => !v); }}
          >
            ★ Top Rated
          </div>
        </div>
      </div>

      <div className="px">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
            No recipes found. Try adjusting your filters.
          </div>
        ) : (
          sections.map((section) => {
            const sectionRecipes = filtered.filter((r) => r.mealType === section.value);
            if (sectionRecipes.length === 0) return null;
            const isOpen = isFiltering || Boolean(openSections[section.value]);
            return (
              <div key={section.value} style={{ marginBottom: 12 }}>
                <div
                  onClick={() => toggleSection(section.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    padding: '10px 12px',
                    background: 'var(--s1)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {section.label} ({sectionRecipes.length})
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>
                    ▾
                  </span>
                </div>
                {isOpen && (
                  <div style={{ maxHeight: 420, overflowY: 'auto', paddingTop: 10 }}>
                    {sectionRecipes.map(renderRecipeRow)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
