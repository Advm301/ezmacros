import { useState, useEffect, useRef } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';
import LightningIcon from '../components/LightningIcon';
import EffortGauge from '../components/EffortGauge';
import FirstVisitTip from '../components/FirstVisitTip';
import InfoIcon from '../components/InfoIcon';
import MealPrepIcon from '../components/MealPrepIcon';
import useFirstVisitTip from '../hooks/useFirstVisitTip';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight } from '../utils/haptics';
import { getProteinCardBackground } from '../utils/proteinColors';
import { estimateRecipeCost, formatUsd } from '../utils/ingredientPricing';
import { estimateRecipeProtein, isHighProtein, HIGH_PROTEIN_THRESHOLD_G, formatProtein } from '../utils/ingredientNutrition';
import FlameIcon from '../components/FlameIcon';

// How many rows into a freshly-opened section get the staggered
// entrance + tick haptic (see RecipeRow below) -- capped rather than
// applied to every row so a 20+ recipe section doesn't drag the reveal
// out for seconds or turn into a long buzz of haptic ticks. Rows past the
// cap just fade in together at the cap's own delay, still quick and
// clean, just without their own individual stagger/tick.
const REVEAL_CAP = 8;
const REVEAL_STEP_MS = 45;

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

const MEAL_SECTIONS = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch & Dinner', value: 'lunch_dinner' },
  { label: 'Snacks', value: 'snack' },
];

const MEAL_TYPE_SHORT_LABELS = {
  breakfast: 'Breakfast',
  lunch_dinner: 'Lunch/Dinner',
  snack: 'Snack',
};

// Kept in sync with every distinct `proteins` value actually used in
// recipes.js (audited when the meal-type accordion was replaced with a flat
// list below) -- Dairy/Plant-Based/Protein Powder were previously missing
// here entirely, which meant the ~40 recipes built around cottage cheese,
// Greek yogurt, black beans, protein shakes, etc. had no way to be found
// through this filter at all, even though they're a real, sizeable slice of
// the catalog (breakfast bowls and snacks especially).
const PROTEINS = [
  { label: 'Chicken', value: 'chicken' },
  { label: 'Beef', value: 'beef' },
  { label: 'Turkey', value: 'turkey' },
  { label: 'Pork', value: 'pork' },
  { label: 'Fish', value: 'fish' },
  { label: 'Eggs', value: 'eggs' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Plant-Based', value: 'plant' },
  { label: 'Protein Powder', value: 'protein_powder' },
];

// Same sync audit as PROTEINS above -- American, Caribbean, and Savory were
// real flavor values already in use (Jamaican Jerk Chicken, Nashville Hot
// Chicken Tenders, and the new bratwurst/kielbasa/sausage recipes among
// them) with no matching filter option, so those recipes were unreachable
// by Flavor even though the field was populated correctly on the recipe
// itself.
const FLAVORS = [
  { label: 'Spicy', value: 'spicy' },
  { label: 'Saucy', value: 'saucy' },
  { label: 'Savory', value: 'savory' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Asian', value: 'asian' },
  { label: 'Italian', value: 'italian' },
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'American', value: 'american' },
  { label: 'Caribbean', value: 'caribbean' },
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

// Wraps a recipe row so it animates in on mount (see .recipe-row-reveal in
// globals.css) instead of the whole list just appearing instantly when a
// meal section opens -- and fires one light haptic tick timed to its own
// entrance, so opening a section reads/feels like a quick cascade landing
// rather than a flat dump of rows. `index` drives both the CSS
// animation-delay and the haptic's setTimeout, capped at REVEAL_CAP so a
// long section's tail doesn't stretch the reveal out or turn into a buzz
// of ticks -- rows past the cap still fade in (all at the cap's delay),
// just without their own individual stagger/tick.
//
// A plain function (not a component) can't use useEffect, and this needs
// one to time its own haptic tick to when its entrance animation actually
// plays -- so this is a real component, mounted per-row via the `key={r.id}`
// on the caller's side, which is also what makes this behave correctly
// under Browse's live search filtering: only recipes newly entering the
// filtered set actually mount (and get a tick), rows still present from the
// previous keystroke keep their existing DOM node and don't replay.
function RecipeRow({ index = 0, children, style, onClick }) {
  const firedRef = useRef(false);
  const delayIndex = Math.min(index, REVEAL_CAP);
  const delayMs = delayIndex * REVEAL_STEP_MS;

  useEffect(() => {
    if (firedRef.current || prefersReducedMotion()) return;
    firedRef.current = true;
    if (index > REVEAL_CAP) return;
    const t = setTimeout(() => hapticSelection(), delayMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="recipe-row-reveal"
      style={{ ...style, '--reveal-delay': `${delayMs}ms` }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

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
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  // Sorting is separate from the filters above -- it reorders results
  // rather than removing any, so it's left out of anyFilterActive /
  // clearAllFilters on purpose.
  const [sortByRating, setSortByRating] = useState(false);

  const moreFiltersCount = (proteinFilter ? 1 : 0) + (flavorFilter ? 1 : 0);
  // Drives whether the "Clear All Filters" link shows at all -- no point
  // offering to clear filters that are already at their defaults.
  const anyFilterActive = Boolean(
    search || mealFilter || proteinFilter || flavorFilter || methodFilter ||
    showSavedOnly || highProteinOnly || grabAndGoOnly || mealPrepOnly || trendingOnly
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
    setTrendingOnly(false);
  };

  let filtered = RECIPES.filter((r) => {
    const tags = r.tags || [];
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchMeal = !mealFilter || r.mealType === mealFilter;
    const matchProtein = !proteinFilter || r.proteins.includes(proteinFilter);
    const matchFlavor = !flavorFilter || r.flavor === flavorFilter;
    const matchMethod = !methodFilter || r.method === methodFilter;
    const matchSaved = !showSavedOnly || isSaved(r.id);
    // Computed from real ingredient quantities (utils/ingredientNutrition.js)
    // rather than the old hand-applied `high_protein` tag, which had no
    // gram threshold backing it at all.
    const matchHighProtein = !highProteinOnly || isHighProtein(r);
    const matchGrabAndGo = !grabAndGoOnly || tags.includes('grab_and_go');
    const matchMealPrep = !mealPrepOnly || r.servings > 1;
    const matchTrending = !trendingOnly || r.isTrending;
    return matchSearch && matchMeal && matchProtein && matchFlavor && matchMethod && matchSaved && matchHighProtein && matchGrabAndGo && matchMealPrep && matchTrending;
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
  } else {
    // Default order (no explicit sort chosen): trending recipes float
    // highest, then newest, then everything else -- so this week's curated
    // Trending picks are the very first thing someone sees, ahead of a
    // freshly-added batch, which is itself ahead of the other 190+ existing
    // recipes at the bottom of the catalog's id order. Array.prototype.sort
    // is stable, so this only reorders trending/new-vs-not -- everything
    // else keeps its original relative order. Explicitly choosing "Top
    // Rated" above overrides this entirely, on purpose.
    filtered = [...filtered].sort((a, b) => {
      const trendA = a.isTrending ? 1 : 0;
      const trendB = b.isTrending ? 1 : 0;
      if (trendA !== trendB) return trendB - trendA;
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }

  const select = (setter) => (value) => {
    hapticSelection();
    setter(value);
  };
  // Meal Type is a single-select pill row rather than a dropdown -- tapping
  // the already-active pill clears back to "All" instead of needing a
  // separate "All Meals" option to tap.
  const selectMeal = (value) => {
    hapticSelection();
    setMealFilter((prev) => (prev === value ? null : value));
  };
  const selectProtein = select(setProteinFilter);
  const selectFlavor = select(setFlavorFilter);
  const selectMethod = select(setMethodFilter);

  const toggleSavedOnly = () => { hapticSelection(); setShowSavedOnly((v) => !v); };
  const toggleHighProtein = () => { hapticSelection(); setHighProteinOnly((v) => !v); };
  const toggleGrabAndGo = () => { hapticSelection(); setGrabAndGoOnly((v) => !v); };
  const toggleMealPrep = () => { hapticSelection(); setMealPrepOnly((v) => !v); };
  const toggleTrending = () => { hapticSelection(); setTrendingOnly((v) => !v); };

  const openRecipe = (r) => {
    hapticLight();
    onOpen(r);
  };

  const renderRecipeRow = (r, index) => (
    <RecipeRow
      key={r.id}
      index={index}
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
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {r.name}
            {r.isNew && <span className="new-badge">New</span>}
            {r.isTrending && <span className="trending-badge"><FlameIcon size={10.5} /> Trending</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <span>
              {/* Meal type only shown when browsing "All Meals" -- with a
                  specific meal picked via the pill row above, every row in
                  the list is already that meal type, so repeating it on
                  every card would just be noise. This is what replaces the
                  old Breakfast/Lunch & Dinner/Snacks section headers'
                  context now that results render as one flat list instead
                  of three separate accordions. */}
              {!mealFilter && <>{MEAL_TYPE_SHORT_LABELS[r.mealType] || r.mealType} · </>}
              {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
              {' · '}
              {getRatingSummary && getRatingSummary(r.id) ? (
                <><span style={{ color: 'var(--gold)' }}>★</span> {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
              ) : (
                'No ratings yet'
              )}
            </span>
            {/* Quick Prep gauge -- 1-3 bolts showing relative effort (see
                EffortGauge/utils/effortLevel.js). Everything here is
                already quick; this just surfaces which are the absolute
                quickest vs. a touch more involved. */}
            <span>·</span>
            <EffortGauge recipe={r} size={11} />
            {/* Estimated grocery cost per serving -- see
                utils/ingredientPricing.js for why this is a category-price
                estimate rather than a live retailer price. */}
            <span>·</span>
            <span>~{formatUsd(estimateRecipeCost(r).perServing)}/serving</span>
            <span>·</span>
            <span>{formatProtein(estimateRecipeProtein(r).perServing)}</span>
          </div>
          {(isHighProtein(r) || (r.tags || []).length > 0) && (
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {/* .ezb.ez1/.ez3 are existing soft-tinted badge classes already
                  defined in globals.css (same accent colors used elsewhere
                  in the app) -- reusing them instead of one-off colors keeps
                  these consistent with the rest of the palette. Gold for
                  High Protein reads as "powered up"/energy; lime-green for
                  Grab & Go reads as "fresh/fast" -- distinct hues so the two
                  are easy to tell apart at a glance. */}
              {isHighProtein(r) && (
                <span className="ezb ez3"><LightningIcon id={`browse-hp-${r.id}`} size={12} /> High Protein</span>
              )}
              {(r.tags || []).includes('grab_and_go') && (
                <span className="ezb ez1">Grab & Go</span>
              )}
            </div>
          )}
          {r.servings > 1 && (
            <div style={{ marginTop: 4 }}>
              <span className="ezb pkg"><MealPrepIcon size={12} /> Meal Prep · Makes {r.servings}</span>
            </div>
          )}
        </div>
        <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }}>
          <StarIcon filled={isSaved(r.id)} size={20} />
        </div>
      </div>
    </RecipeRow>
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

        {/* Meal Type as a pill row narrows the same flat list below rather
            than switching between three separate collapsible sections --
            replaces the old accordion (Breakfast/Lunch & Dinner/Snacks each
            needing its own tap-to-expand) that made this page feel
            cluttered. Tapping the active pill again clears back to all
            meals (see selectMeal above). */}
        <div className="filter-sec">
          <div className="filter-label">Meal Type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {MEAL_SECTIONS.map((s) => (
              <div
                key={s.value}
                className={`pill ${mealFilter === s.value ? 'active' : ''}`}
                onClick={() => selectMeal(s.value)}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>

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
            <div className={`pill ${trendingOnly ? 'active' : ''}`} onClick={toggleTrending} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <FlameIcon size={12} /> Trending
            </div>
            <div className={`pill ${showSavedOnly ? 'active' : ''}`} onClick={toggleSavedOnly}>
              {showSavedOnly ? '★ Saved' : '☆ Saved'}
            </div>
            <div className={`pill ${highProteinOnly ? 'active' : ''}`} onClick={toggleHighProtein}>
              High Protein ({HIGH_PROTEIN_THRESHOLD_G}g+)
            </div>
            <div className={`pill ${grabAndGoOnly ? 'active' : ''}`} onClick={toggleGrabAndGo}>
              Grab & Go
            </div>
            <div className={`pill ${mealPrepOnly ? 'active' : ''}`} onClick={toggleMealPrep} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <MealPrepIcon size={12} /> Meal Prep
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

      {/* One flat, page-scrolled list instead of three separate collapsible
          Breakfast/Lunch & Dinner/Snacks sections -- narrowing via the Meal
          Type pill row above (or any other filter) shrinks this same list
          rather than requiring a tap-to-expand per section. This is the
          whole point of the redesign: less clutter, no click-to-reveal
          needed just to see results that are already filtered down. */}
      <div className="px">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
            No recipes found. Try adjusting your filters.
          </div>
        ) : (
          filtered.map((r, i) => renderRecipeRow(r, i))
        )}
      </div>
    </div>
  );
}
