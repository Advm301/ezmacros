import { useState, useEffect, useRef } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';
import EffortGauge from '../components/EffortGauge';
import FirstVisitTip from '../components/FirstVisitTip';
import InfoIcon from '../components/InfoIcon';
import MealPrepIcon from '../components/MealPrepIcon';
import useFirstVisitTip from '../hooks/useFirstVisitTip';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight } from '../utils/haptics';
import { getProteinCardBackground } from '../utils/proteinColors';
import { getRecipeGradient } from '../utils/recipeArt';
import { estimateRecipeCost, formatUsd } from '../utils/ingredientPricing';
import { estimateRecipeProtein, isHighProtein, HIGH_PROTEIN_THRESHOLD_G, formatProtein } from '../utils/ingredientNutrition';
import FlameIcon from '../components/FlameIcon';

// How many tiles into a freshly-filtered result set get the staggered
// entrance + tick haptic (see RecipeRow below) -- capped rather than
// applied to every tile so a 20+ recipe result set doesn't drag the reveal
// out for seconds or turn into a long buzz of haptic ticks. Tiles past the
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

// Taste/heat profile only -- see data/recipes.js's schema comment for why
// this used to also carry cuisine values (Asian, Italian, etc.) crammed
// into the same field. A tester flagged that they couldn't find a cuisine
// filter at all; turned out it was hiding under this "Flavor" label,
// buried in More Filters, AND only covering ~1/3 of the catalog since a
// recipe could carry a cuisine value OR a taste value, never both --
// "Ground Beef Taco Bowl" was tagged 'spicy' with nowhere to also say
// Mexican. See CUISINES below for its own real, visible filter now that
// recipes.js tracks both independently.
const FLAVORS = [
  { label: 'Spicy', value: 'spicy' },
  { label: 'Saucy', value: 'saucy' },
  { label: 'Savory', value: 'savory' },
  { label: 'Neutral', value: 'neutral' },
];

const CUISINES = [
  { label: 'Asian', value: 'asian' },
  { label: 'Italian', value: 'italian' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'American', value: 'american' },
  { label: 'BBQ', value: 'bbq' },
  { label: 'Caribbean', value: 'caribbean' },
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

// Wraps a result tile so it animates in on mount (see .recipe-row-reveal in
// globals.css) instead of the whole grid just appearing instantly when a
// filter changes -- and fires one light haptic tick timed to its own
// entrance, so a fresh result set reads/feels like a quick cascade landing
// rather than a flat dump of tiles. `index` drives both the CSS
// animation-delay and the haptic's setTimeout, capped at REVEAL_CAP so a
// long result set's tail doesn't stretch the reveal out or turn into a
// buzz of ticks -- tiles past the cap still fade in (all at the cap's
// delay), just without their own individual stagger/tick.
//
// A plain function (not a component) can't use useEffect, and this needs
// one to time its own haptic tick to when its entrance animation actually
// plays -- so this is a real component, mounted per-tile via the
// `key={r.id}` on the caller's side, which is also what makes this behave
// correctly under Browse's live search filtering: only recipes newly
// entering the filtered set actually mount (and get a tick), tiles still
// present from the previous keystroke keep their existing DOM node and
// don't replay.
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
  const [cuisineFilter, setCuisineFilter] = useState(null);
  const [methodFilter, setMethodFilter] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  const [grabAndGoOnly, setGrabAndGoOnly] = useState(false);
  const [mealPrepOnly, setMealPrepOnly] = useState(false);
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  // Every filter used to live on screen at once -- Meal Type, Cuisine, a
  // Method dropdown, a Quick Toggles row, and a More Filters accordion, all
  // stacked above the results whether or not any of them were in use. That
  // permanent wall of controls was the actual "spreadsheet" feeling, not
  // the colors -- so it's now one sheet (see showFiltersSheet below),
  // opened on demand, with only the search bar and a single Filters pill
  // staying on the main page.
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  // Sorting is separate from the filters above -- it reorders results
  // rather than removing any, so it's left out of anyFilterActive /
  // clearAllFilters on purpose.
  const [sortByRating, setSortByRating] = useState(false);

  const moreFiltersCount = (proteinFilter ? 1 : 0) + (flavorFilter ? 1 : 0);
  // Drives whether the "Clear All Filters" link shows at all -- no point
  // offering to clear filters that are already at their defaults.
  const anyFilterActive = Boolean(
    search || mealFilter || proteinFilter || flavorFilter || cuisineFilter || methodFilter ||
    showSavedOnly || highProteinOnly || grabAndGoOnly || mealPrepOnly || trendingOnly
  );
  const clearAllFilters = () => {
    hapticLight();
    setSearch('');
    setMealFilter(null);
    setProteinFilter(null);
    setFlavorFilter(null);
    setCuisineFilter(null);
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
    const matchCuisine = !cuisineFilter || r.cuisine === cuisineFilter;
    const matchMethod = !methodFilter || r.method === methodFilter;
    const matchSaved = !showSavedOnly || isSaved(r.id);
    // Computed from real ingredient quantities (utils/ingredientNutrition.js)
    // rather than the old hand-applied `high_protein` tag, which had no
    // gram threshold backing it at all.
    const matchHighProtein = !highProteinOnly || isHighProtein(r);
    const matchGrabAndGo = !grabAndGoOnly || tags.includes('grab_and_go');
    const matchMealPrep = !mealPrepOnly || r.servings > 1;
    const matchTrending = !trendingOnly || r.isTrending;
    return matchSearch && matchMeal && matchProtein && matchFlavor && matchCuisine && matchMethod && matchSaved && matchHighProtein && matchGrabAndGo && matchMealPrep && matchTrending;
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
  // Same toggle-to-clear pattern as Meal Type above, not the dropdown
  // `select()` helper -- Cuisine is a visible pill row, not a <select>.
  const selectCuisine = (value) => {
    hapticSelection();
    setCuisineFilter((prev) => (prev === value ? null : value));
  };

  const toggleSavedOnly = () => { hapticSelection(); setShowSavedOnly((v) => !v); };
  const toggleHighProtein = () => { hapticSelection(); setHighProteinOnly((v) => !v); };
  const toggleGrabAndGo = () => { hapticSelection(); setGrabAndGoOnly((v) => !v); };
  const toggleMealPrep = () => { hapticSelection(); setMealPrepOnly((v) => !v); };
  const toggleTrending = () => { hapticSelection(); setTrendingOnly((v) => !v); };

  const openRecipe = (r) => {
    hapticLight();
    onOpen(r);
  };

  // Drives both the Filters pill's badge count and the removable chip row
  // on the main page -- every active filter appears exactly once in each,
  // built from one list so they can't drift out of sync with each other.
  const activeFilterChips = [
    mealFilter && { key: 'meal', label: MEAL_SECTIONS.find((s) => s.value === mealFilter)?.label, onRemove: () => selectMeal(mealFilter) },
    cuisineFilter && { key: 'cuisine', label: CUISINES.find((c) => c.value === cuisineFilter)?.label, onRemove: () => selectCuisine(cuisineFilter) },
    methodFilter && { key: 'method', label: methodFilter, onRemove: () => selectMethod(null) },
    proteinFilter && { key: 'protein', label: PROTEINS.find((p) => p.value === proteinFilter)?.label, onRemove: () => selectProtein(null) },
    flavorFilter && { key: 'flavor', label: FLAVORS.find((f) => f.value === flavorFilter)?.label, onRemove: () => selectFlavor(null) },
    trendingOnly && { key: 'trending', label: 'Trending', onRemove: toggleTrending },
    showSavedOnly && { key: 'saved', label: 'Saved', onRemove: toggleSavedOnly },
    highProteinOnly && { key: 'hp', label: `High Protein (${HIGH_PROTEIN_THRESHOLD_G}g+)`, onRemove: toggleHighProtein },
    grabAndGoOnly && { key: 'gng', label: 'Grab & Go', onRemove: toggleGrabAndGo },
    mealPrepOnly && { key: 'mp', label: 'Meal Prep', onRemove: toggleMealPrep },
  ].filter(Boolean);

  // The top result becomes a full-bleed featured tile (same brand-gradient
  // hero language as Kitchen/Sunday Prep, just shorter -- this is "look at
  // this one first," not "the one decision" the way Kitchen's stack is),
  // everything else below it renders as a 2-column bento grid instead of a
  // single stacked list -- see the bento-grid-trend research this
  // redesign is based on (Apple/Google/Samsung all lean on the same
  // pattern now). Photo-forward tiles instead of dense text rows -- a
  // trade-off that means cost-per-serving and the effort gauge no longer
  // fit on every tile (still visible once you tap in), in exchange for a
  // page that actually looks like something worth swiping through.
  // A big, unlabeled card at the top used to just look like an unexplained
  // mystery pick ("is this trending? recipe of the day? why this one?").
  // This eyebrow says the real, honest reason it's here -- genuinely
  // trending, genuinely new, the actual top result of whatever sort/filter
  // is active, or (with nothing special going on and nothing filtered)
  // just null, since there's no truthful claim to make about an arbitrary
  // catalog-order pick and this app doesn't fabricate a "recipe of the
  // day."
  const featuredReason = (r) => {
    if (r.isTrending) return 'Trending This Week';
    if (r.isNew) return 'Just Added';
    if (sortByRating) return 'Top Rated';
    if (anyFilterActive) return 'Top Match';
    return null;
  };

  const renderFeaturedTile = (r, index) => (
    <RecipeRow
      key={r.id}
      index={index}
      onClick={() => openRecipe(r)}
      style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 'var(--space-3)', cursor: 'pointer', background: getRecipeGradient() }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(4,20,26,.42)' }} />
      <div style={{ position: 'relative', padding: 'var(--space-4)' }}>
        {featuredReason(r) && (
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 'var(--space-2)' }}>
            {r.isTrending && <FlameIcon size={12} />} {featuredReason(r)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 800, fontSize: 'var(--type-h1)', lineHeight: 1.2, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {r.name}
            {r.isNew && <span className="new-badge">New</span>}
            {r.isTrending && <span className="trending-badge"><FlameIcon size={10.5} color="var(--orange)" /> Trending</span>}
          </div>
          <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }} style={{ flexShrink: 0, marginLeft: 8 }}>
            <StarIcon filled={isSaved(r.id)} size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: 'rgba(0,0,0,.34)', backdropFilter: 'blur(4px)', borderRadius: 'var(--rtag)', padding: '6px 11px', fontSize: 'var(--type-caption)', color: 'rgba(255,255,255,.92)', width: 'fit-content' }}>
          <span>
            {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
            {' · '}
            {getRatingSummary && getRatingSummary(r.id) ? (
              <><span style={{ color: 'var(--gold)' }}>★</span> {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
            ) : (
              'No ratings yet'
            )}
          </span>
          <span>·</span>
          <EffortGauge recipe={r} size={11} />
          <span>·</span>
          <span>~{formatUsd(estimateRecipeCost(r).perServing)}/serving</span>
          <span>·</span>
          <span>{formatProtein(estimateRecipeProtein(r).perServing)}</span>
        </div>
        {r.servings > 1 && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            <span className="ezb pkg"><MealPrepIcon size={12} /> Meal Prep · Makes {r.servings}</span>
          </div>
        )}
      </div>
    </RecipeRow>
  );

  // Compact grid tiles for everything after the featured one -- a small
  // protein-color band up top (getProteinCardBackground, the same accent
  // system already used elsewhere in the app) stands in for a photo, name
  // clamped to 2 lines so uneven-length titles don't break the grid's row
  // heights, then just the two numbers that matter most for a fast scan:
  // time and protein, plus a rating when one exists.
  const renderGridTile = (r, index) => (
    <RecipeRow
      key={r.id}
      index={index}
      onClick={() => openRecipe(r)}
      style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', minWidth: 0 }}
    >
      <div style={{ height: 42, background: getProteinCardBackground(r.proteins), display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '6px 7px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {r.isNew && <span className="new-badge" style={{ fontSize: 9, padding: '2px 6px' }}>New</span>}
          {r.isTrending && <span className="trending-badge" style={{ fontSize: 9, padding: '2px 6px' }}><FlameIcon size={9} color="var(--orange)" /></span>}
        </div>
        <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }} style={{ flexShrink: 0 }}>
          <StarIcon filled={isSaved(r.id)} size={16} />
        </div>
      </div>
      <div style={{ background: 'var(--s1)', padding: 'var(--space-2)' }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--cream)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3, marginBottom: 4, minHeight: '2.6em' }}>
          {r.name}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>
          {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>
          {formatProtein(estimateRecipeProtein(r).perServing)}
          {getRatingSummary && getRatingSummary(r.id) && (
            <> · <span style={{ color: 'var(--gold)' }}>★</span> {getRatingSummary(r.id).avg.toFixed(1)}</>
          )}
        </div>
      </div>
    </RecipeRow>
  );

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
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
          This is the full QuickPrep catalog -- search by name, or tap Filters to narrow it down by meal type, cuisine, method, protein, or effort level.
        </FirstVisitTip>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', color: 'var(--cream)', fontSize: 14, marginBottom: 'var(--space-3)', boxSizing: 'border-box' }}
        />

        {/* Replaces the old always-on stack of Meal Type / Cuisine / Method /
            Quick Toggles / More Filters blocks -- one pill, one entry point
            into the same filters (now a sheet, see showFiltersSheet below),
            so none of that occupies screen space unless it's actually
            being used. Top Rated stays out here as its own pill since it's
            a reorder someone reaches for constantly, not a narrowing
            filter worth burying a tap away. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-2)' }}>
          <div
            onClick={() => { hapticLight(); setShowFiltersSheet(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--rtag)', padding: '8px 14px 8px 12px', fontSize: 12.5, fontWeight: 700, color: 'var(--cream)', cursor: 'pointer' }}
          >
            <span aria-hidden="true">⚙</span> Filters{activeFilterChips.length > 0 ? ` · ${activeFilterChips.length}` : ''}
          </div>
          <div
            className={`pill ${sortByRating ? 'active' : ''}`}
            onClick={() => { hapticSelection(); setSortByRating((v) => !v); }}
          >
            ★ Top Rated
          </div>
          <div style={{ flex: 1 }} />
          <div className="sub" style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
            {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Removable chips for whatever's currently active -- visibility
            into applied filters without reopening the sheet, and a
            one-tap way to back any single one of them out. */}
        {activeFilterChips.length > 0 && (
          <div className="scroll-row" style={{ marginBottom: 'var(--space-2)' }}>
            {activeFilterChips.map((chip) => (
              <div
                key={chip.key}
                className="pill active"
                onClick={() => { hapticSelection(); chip.onRemove(); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}
              >
                {chip.label} ✕
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bento grid instead of one flat stacked list -- see
          renderFeaturedTile/renderGridTile above. Narrowing via Filters (or
          search) shrinks this same grid rather than requiring a
          tap-to-expand per section. */}
      <div className="px">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
            No recipes found. Try adjusting your filters.
          </div>
        ) : (
          <>
            {renderFeaturedTile(filtered[0], 0)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {filtered.slice(1).map((r, i) => renderGridTile(r, i + 1))}
            </div>
          </>
        )}
      </div>

      {/* Filters sheet -- everything that used to live permanently on the
          page (Meal Type, Cuisine, Method, Quick Toggles, More Filters),
          unchanged in behavior, just relocated behind one entry point. */}
      {showFiltersSheet && (
        <div
          onClick={() => { hapticLight(); setShowFiltersSheet(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, maxHeight: '85vh', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', overflowY: 'auto', padding: '18px 18px 28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>Filters</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {anyFilterActive && (
                  <div onClick={clearAllFilters} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer' }}>
                    Clear All
                  </div>
                )}
                <div onClick={() => setShowFiltersSheet(false)} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
                  ✕
                </div>
              </div>
            </div>

            {/* Meal Type as a pill row narrows the same grid below rather
                than switching between separate collapsible sections.
                Tapping the active pill again clears back to all meals (see
                selectMeal above). */}
            <div className="filter-sec">
              <div className="filter-label">Meal Type</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
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

            <div className="filter-sec">
              <div className="filter-label">Cuisine</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {CUISINES.map((c) => (
                  <div
                    key={c.value}
                    className={`pill ${cuisineFilter === c.value ? 'active' : ''}`}
                    onClick={() => selectCuisine(c.value)}
                  >
                    {c.label}
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

            {/* Saved / High Protein / Grab & Go are simple on-off toggles --
                only a few of them, so a non-scrolling row of pills is
                clearer than a dropdown (and matches how the tags are
                displayed on each tile). "High Protein" is called out at
                35g+ so the cutoff isn't a mystery. */}
            <div className="filter-sec">
              <div className="filter-label">Quick Toggles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
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

            {/* Protein and Flavor are further refinements on top of Meal
                Type + Method -- tucked behind their own collapsible section
                so the sheet isn't front-loading four dropdowns before the
                simpler pill rows above. */}
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
                <span style={{ fontSize: 11, color: 'var(--muted)', transform: showMoreFilters ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)', display: 'inline-block' }}>
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

            <button
              className="gen-kitchen-btn"
              style={{ marginTop: 8, marginBottom: 0 }}
              onClick={() => { hapticLight(); setShowFiltersSheet(false); }}
            >
              Show {filtered.length} Recipe{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
