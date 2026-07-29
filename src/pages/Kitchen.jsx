import { useState, useRef, useEffect } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_STAPLES, QUICK_PICKS } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import PantryPickerModal from '../components/PantryPickerModal';
import SurpriseSparkles from '../components/SurpriseSparkles';
import OnboardingFinishSparkles from '../components/OnboardingFinishSparkles';
import EffortGauge from '../components/EffortGauge';
import LightningIcon from '../components/LightningIcon';
import StarIcon from '../components/StarIcon';
import FirstVisitTip from '../components/FirstVisitTip';
import InfoIcon from '../components/InfoIcon';
import MealPrepIcon from '../components/MealPrepIcon';
import useFirstVisitTip from '../hooks/useFirstVisitTip';
import { getRecipeGradient } from '../utils/recipeArt';
import { filterRecipes } from '../utils/pantryMatch';
import { estimateRecipeCost, formatUsd } from '../utils/ingredientPricing';
import { estimateRecipeProtein, formatProtein } from '../utils/ingredientNutrition';
import FlameIcon from '../components/FlameIcon';

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));
const SWIPE_THRESHOLD = 60;

// Kitchen used to duplicate Browse's Meal Type/Protein/Flavor/Quick Filter
// dropdowns almost exactly -- same filters, same underlying data, just a
// second place to set them. That overlap made the two tabs feel
// interchangeable rather than distinct. Kitchen's actual, unique job is
// "what can I make with what's already here" -- so it's now pantry-in,
// recipe-out (plus the no-input Surprise Me shortcut) and nothing else.
// Browse remains the general-purpose search/filter/sort tool over the
// whole catalog. The actual matching rule (filterRecipes) now lives in
// utils/pantryMatch.js, shared with App.jsx's onboarding "plan my day"
// flow -- Find Recipes is disabled below until at least one staple is
// picked, since showing all 144 recipes unranked isn't a useful "find"
// result.
//
// v2 visual pass: results used to render as a scrollable list (every match
// visible, stacked top to bottom, competing for attention) with an inline
// "What Do You Have?" pantry-summary block permanently on screen above it.
// That's what made this page feel like a form -- every control visible at
// once, nothing revealed. It's now one full-bleed match at a time in a
// swipeable stack (tap to open the recipe, swipe left to pass, swipe right
// to cook it, mirroring the card-stack pattern people already know from
// Tinder/Hinge), with pantry input collapsed into the single "Refine" pill
// up top -- PantryPickerModal (unchanged) is that sheet.

// `selectedStaples`/`results` (and the post-onboarding `justOnboarded`
// flag) are now owned by App.jsx rather than local state here -- Kitchen
// fully unmounts every time you switch tabs away from it (see App.jsx's
// tab === "kitchen" conditional render), so state that lived only inside
// Kitchen itself, including a just-onboarded person's very first
// generated meal, was getting silently wiped out by a simple tab-away-
// and-back. Lifting it to App.jsx means it survives exactly as long as
// the rest of the app's state does; App.jsx also does the one-time
// "seed from onboarding picks" work that used to happen in a lazy
// `useState` initializer here (see its handleOnboardingComplete, which
// mirrors the same rankForPreferences/pickBestMatch fallback logic this
// used to run locally).
export default function Kitchen({
  onOpen,
  getRatingSummary,
  isSaved,
  toggleSaved,
  selectedStaples,
  setSelectedStaples,
  results,
  setResults,
  justOnboarded,
  onDismissJustOnboarded,
}) {
  const tip = useFirstVisitTip('quickprep_seen_kitchen_tip');
  const [showPantryModal, setShowPantryModal] = useState(false);
  const [surpriseError, setSurpriseError] = useState('');
  // Which match in `results` the stack is currently showing -- reset to 0
  // any time the underlying result set changes (a fresh search, a
  // Quick Pick toggle, Clear) so a stale index from a previous, longer
  // list can't point past the end of a new, shorter one.
  const [cardIndex, setCardIndex] = useState(0);
  const stackRef = useRef(null);
  const touchStateRef = useRef({ x: 0, y: 0, active: false });

  const toggleStaple = (id) => {
    hapticSelection();
    setSelectedStaples((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  // The "Your First Picks Are Ready!" banner (see justOnboarded below) is
  // meant to stay up as long as those original onboarding picks are still
  // what's on screen -- it should NOT auto-dismiss on a timer; someone
  // reading the recipe card, getting distracted, and coming back a few
  // seconds later shouldn't find it already gone. It only stops making
  // sense once the picks it's celebrating are no longer what's showing --
  // either Clear (reset, below) wipes them back to the empty state, or a
  // fresh Find Recipes/Quick Pick search replaces them with different
  // results the banner's "matched to what you told us" text no longer
  // describes. So it's dismissed explicitly at exactly those two points,
  // never on a blind timer.
  const handleFindRecipes = () => {
    if (selectedStaples.length === 0) return;
    hapticLight();
    setSurpriseError('');
    setCardIndex(0);
    setResults(filterRecipes(RECIPES, selectedStaples));
    onDismissJustOnboarded?.();
  };

  // Find Recipes now lives inside the pantry picker itself (replacing what
  // used to be a plain "Done" button) rather than as a separate, mostly-
  // disabled button on the main page -- there's no reason to show a button
  // that only works after you've already gone into the picker anyway. This
  // runs the search and closes the drawer in one tap.
  const handleFindRecipesAndClose = () => {
    if (selectedStaples.length === 0) return;
    handleFindRecipes();
    setShowPantryModal(false);
  };

  // Picks one random recipe from whatever your pantry picks match (or the
  // full recipe list if nothing's selected yet) and opens it directly -- a
  // shortcut for "just decide for me," no ingredients required.
  const handleSurpriseMe = () => {
    hapticMedium();
    setSurpriseError('');
    const pool = filterRecipes(RECIPES, selectedStaples);
    if (pool.length === 0) {
      setSurpriseError('No recipes match those ingredients to surprise you with -- try picking a few different ones.');
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (onOpen) onOpen(pick, { surprise: true });
  };

  // One-tap version of picking a single item in the pantry drawer and
  // hitting Find Recipes -- toggles it in/out of selectedStaples and runs
  // the match immediately, so tapping a Quick Pick chip fills the empty
  // space below with real recipes in one step instead of needing to open
  // the full picker first. Deselecting back down to zero picks clears
  // results back to the empty state (showing the Quick Picks again)
  // rather than dumping the full unranked 144-recipe catalog, which is
  // what filterRecipes returns for an empty selection.
  const handleQuickPick = (id) => {
    hapticSelection();
    setSurpriseError('');
    const next = selectedStaples.includes(id)
      ? selectedStaples.filter((s) => s !== id)
      : [...selectedStaples, id];
    setSelectedStaples(next);
    setCardIndex(0);
    setResults(next.length > 0 ? filterRecipes(RECIPES, next) : null);
    onDismissJustOnboarded?.();
  };

  const reset = () => {
    hapticLight();
    setSelectedStaples([]);
    setResults(null);
    setSurpriseError('');
    setCardIndex(0);
    onDismissJustOnboarded?.();
  };

  const openRecipe = (r) => {
    hapticLight();
    if (onOpen) onOpen(r);
  };

  // "Pass" -- advances to the next match in the stack. There's nothing to
  // advance to from a single-result hero (the post-onboarding hand-off, or
  // a Quick Pick narrowed all the way down) or once you've reached the end
  // of a longer list, so both cases fall back to Clear (reset) instead of
  // silently doing nothing -- "not this one" always does *something*.
  const handlePass = () => {
    if (!results || results.length === 0) return;
    if (results.length === 1 || cardIndex >= results.length - 1) {
      reset();
      return;
    }
    hapticSelection();
    setCardIndex((i) => i + 1);
  };

  const handleCook = () => {
    if (!results || results.length === 0) return;
    openRecipe(results[cardIndex]);
  };

  // Native (non-passive) touch listeners, same reasoning as
  // components/PullToRefresh.jsx: React's synthetic onTouchMove is passive
  // by default, so preventDefault() there silently no-ops. A swipe here is
  // horizontal (left = pass, right = cook) so it doesn't fight the page's
  // own vertical scroll -- preventDefault only fires once a gesture is
  // already confidently more horizontal than vertical.
  useEffect(() => {
    const node = stackRef.current;
    if (!node || !results || results.length === 0) return undefined;

    function handleStart(e) {
      touchStateRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
    }
    function handleMove(e) {
      const st = touchStateRef.current;
      if (!st.active) return;
      const dx = e.touches[0].clientX - st.x;
      const dy = e.touches[0].clientY - st.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) e.preventDefault();
    }
    function handleEnd(e) {
      const st = touchStateRef.current;
      st.active = false;
      const dx = e.changedTouches[0].clientX - st.x;
      const dy = e.changedTouches[0].clientY - st.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
        // Too small / too vertical to be a swipe -- treat as a tap instead.
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) handleCook();
        return;
      }
      if (dx < 0) handlePass();
      else handleCook();
    }

    node.addEventListener('touchstart', handleStart, { passive: true });
    node.addEventListener('touchmove', handleMove, { passive: false });
    node.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('touchmove', handleMove);
      node.removeEventListener('touchend', handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, cardIndex]);

  const current = results && results.length > 0 ? results[Math.min(cardIndex, results.length - 1)] : null;
  const isHero = results && results.length === 1;
  const missingStaples = current && selectedStaples.length > 0
    ? (current.pantryTags || []).filter((t) => !selectedStaples.includes(t))
    : [];

  const renderCardBody = (r) => (
    <>
      <div style={{ position: 'relative', padding: 'var(--space-5) var(--space-4) var(--space-4)' }}>
        {isHero && (
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 1.2, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
            <LightningIcon size={14} id="kitchen-hero" /> Your Match
          </div>
        )}
        <div style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 800, fontSize: 'var(--type-display)', lineHeight: 'var(--type-display-lh)', color: '#fff', marginBottom: 'var(--space-2)', textShadow: '0 2px 14px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {r.name}
          {r.isNew && <span className="new-badge">New</span>}
          {r.isTrending && <span className="trending-badge"><FlameIcon size={10.5} /> Trending</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: 'rgba(0,0,0,.34)', backdropFilter: 'blur(4px)', borderRadius: 'var(--r)', padding: '6px 11px', fontSize: 'var(--type-caption)', color: 'rgba(255,255,255,.92)', marginBottom: 'var(--space-3)' }}>
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
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <span className="ezb pkg"><MealPrepIcon size={12} /> Meal Prep · Makes {r.servings}</span>
          </div>
        )}
        {selectedStaples.length > 0 && (
          <div style={{ fontSize: 'var(--type-caption)', color: '#fff', fontWeight: 600 }}>
            Uses {r._matchCount} of your {selectedStaples.length} pick{selectedStaples.length === 1 ? '' : 's'}
            {missingStaples.length > 0 && (
              <span style={{ color: 'rgba(255,255,255,.75)', fontWeight: 500 }}>
                {' '}· also needs: {missingStaples.map((t) => PANTRY_LABELS[t] || t).join(', ')}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div style={{ paddingBottom: 150 }}>
      <div className="px pt">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="page-h1" style={{ marginBottom: 0 }}>Kitchen</div>
            <div className="info-btn" onClick={tip.reopen} title="Show info">
              <InfoIcon />
            </div>
          </div>
          {/* Replaces the old always-visible "What Do You Have?" summary
              block -- one pill, one entry point into the same
              PantryPickerModal sheet, so the pantry input isn't permanently
              occupying screen space above every result. */}
          <div
            onClick={() => { hapticLight(); setShowPantryModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--rtag)', padding: '8px 14px 8px 12px', fontSize: 12.5, fontWeight: 700, color: 'var(--cream)', cursor: 'pointer', flexShrink: 0 }}
          >
            <span aria-hidden="true">⚙</span> Refine{selectedStaples.length > 0 ? ` · ${selectedStaples.length}` : ''}
          </div>
        </div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Tell us what's already in your kitchen and we'll find recipes that use it -- or hit Surprise Me to skip the decision entirely.
        </div>

        <FirstVisitTip show={tip.show} onDismiss={tip.dismiss}>
          This is your shortcut to "what can I make right now?" -- pick a few things you have on hand and we'll match them to real recipes, or tap Surprise Me below if you'd rather skip the decision entirely. Swipe a match left to pass, right (or tap) to cook it.
        </FirstVisitTip>

        {surpriseError && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{surpriseError}</div>
        )}

        {/* Quick Picks -- shown only on the idle screen (nothing searched
            yet), so the space below the page header isn't empty while
            someone decides whether to open the full Refine sheet. One tap
            runs the same match Find Recipes does (see handleQuickPick
            above), so results appear right below immediately instead of
            requiring a trip through the full pantry drawer first. Mostly
            proteins since that's the hard filter that actually narrows
            things down. */}
        {results === null && (
          <div style={{ marginTop: 10 }}>
            <div className="filter-label" style={{ marginBottom: 8 }}>
              Quick Picks
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {QUICK_PICKS.map((s) => (
                <div
                  key={s.id}
                  className={`pill ${selectedStaples.includes(s.id) ? 'active' : ''}`}
                  onClick={() => handleQuickPick(s.id)}
                >
                  {selectedStaples.includes(s.id) ? `✓ ${s.label}` : s.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {results !== null && (
        <div className="px" style={{ marginTop: 4 }}>
          {results.length === 0 ? (
            <div style={{ background: 'var(--s1)', border: '2px solid var(--lime)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)', marginBottom: 10 }}>
                No recipes match those ingredients
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
                Try picking a few different pantry items.
              </div>
              <div className="quick-chip" style={{ display: 'inline-block' }} onClick={reset}>
                Start Over
              </div>
            </div>
          ) : (
            <>
              {/* One-time celebratory hand-off from onboarding -- see
                  `justOnboarded` above. Never shown for an ordinary
                  Find Recipes/Quick Pick search, only this first reveal. */}
              {justOnboarded && (
                <div className="kitchen-ready-banner">
                  <LightningIcon size={30} id="kitchen-ready" />
                  <div className="kitchen-ready-title">Your First Picks Are Ready!</div>
                  <div className="kitchen-ready-sub">Matched to what you told us -- tap any recipe to dive in.</div>
                </div>
              )}

              {/* Progress + Clear -- a single numeric pill rather than a
                  dot-per-result row, since a pantry match can easily return
                  20+ recipes and a dot for each of those would just be
                  another wall of small UI. */}
              {!isHero && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cream)' }}>
                      {cardIndex + 1} of {results.length}
                    </div>
                    <div style={{ width: 60, height: 4, borderRadius: 4, background: 'var(--s3)', overflow: 'hidden' }}>
                      <div style={{ width: `${((cardIndex + 1) / results.length) * 100}%`, height: '100%', background: 'var(--lime)', transition: 'width var(--dur-med) var(--ease-out)' }} />
                    </div>
                  </div>
                  <div
                    onClick={reset}
                    style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
                  >
                    Clear
                  </div>
                </div>
              )}

              {/* The stack itself -- current match full-bleed up front, with
                  up to two faded/scaled-down cards peeking out behind it to
                  signal "there's more, keep going" (purely decorative --
                  they're not individually tappable). Swipe left = pass,
                  swipe right or tap = cook (see the touch handlers above);
                  key={current.id} forces a remount -- and so replays
                  .hero-pop -- every time the front card changes. */}
              <div ref={stackRef} style={{ position: 'relative', marginBottom: 14, touchAction: 'pan-y' }}>
                {!isHero && results.length > 2 && (
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-lg)', background: getRecipeGradient(), transform: 'scale(.94) translateY(16px)', opacity: 0.28 }} />
                )}
                {!isHero && results.length > 1 && (
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-lg)', background: getRecipeGradient(), transform: 'scale(.97) translateY(8px)', opacity: 0.5 }} />
                )}
                <div
                  key={current.id}
                  className="hero-pop"
                  style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', background: getRecipeGradient() }}
                  onClick={() => openRecipe(current)}
                >
                  {isHero && <OnboardingFinishSparkles />}
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(4,20,26,.42)' }} />
                  {renderCardBody(current)}
                </div>
              </div>

              {/* Big circular action row instead of the old text-link
                  "Clear" -- Pass/Cook/Save mirror the swipe gestures above
                  (left/right) so the buttons work as a discoverable
                  fallback for the exact same two actions, plus a save
                  shortcut swiping alone can't express. */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginBottom: 6 }}>
                <div
                  onClick={handlePass}
                  title="Pass"
                  style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--s2)', border: '1.5px solid var(--border)', color: 'var(--cream)', fontSize: 21, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  ✕
                </div>
                <div
                  onClick={handleCook}
                  title="Cook this"
                  style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', color: '#000', fontSize: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 22px rgba(0,0,0,.35)' }}
                >
                  ✓
                </div>
                {toggleSaved && (
                  <div
                    onClick={(e) => { e.stopPropagation(); hapticLight(); toggleSaved(current.id); }}
                    title="Save"
                    style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--s2)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <StarIcon filled={isSaved ? isSaved(current.id) : false} size={22} />
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
                {isHero ? 'Tap the card to dive in' : 'Swipe for another match · tap the card for the full recipe'}
              </div>
            </>
          )}
        </div>
      )}

      {/* Sticky action bar -- always visible above the bottom nav. Just
          Surprise Me now: Find Recipes moved into the pantry picker itself
          (it only ever made sense once you'd already opened that drawer
          and picked something, so a second, mostly-disabled button for it
          out here was redundant). Surprise Me needs no input at all --
          that's the whole point of it -- so it's the one thing that
          belongs on the main page regardless of what you've picked. */}
      {/* Bottom nav in App.jsx is now a floating pill sitting 14px above the
          true screen edge instead of flush at bottom:0 -- bumped this up
          from 58 to clear it with a small gap. No background/border-top on
          this wrapper anymore either -- with only one button left here
          (Find Recipes moved into the pantry picker), a full-width opaque
          bar with a separator line above it just read as an odd dark slab
          around a lone button. It's centered and about half-width instead,
          floating on its own like the Surprise Me button does everywhere
          else it appears (e.g. the Kitchen recipe modal). */}
      <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '0 18px', boxSizing: 'border-box', zIndex: 25, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '50%' }}>
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

      {showPantryModal && (
        <PantryPickerModal
          selectedStaples={selectedStaples}
          toggleStaple={toggleStaple}
          onClose={() => setShowPantryModal(false)}
          onFindRecipes={handleFindRecipesAndClose}
        />
      )}
    </div>
  );
}
