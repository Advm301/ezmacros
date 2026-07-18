import { useEffect, useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_STAPLES, QUICK_PICKS } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import PantryPickerModal from '../components/PantryPickerModal';
import SurpriseSparkles from '../components/SurpriseSparkles';
import OnboardingFinishSparkles from '../components/OnboardingFinishSparkles';
import EffortGauge from '../components/EffortGauge';
import LightningIcon from '../components/LightningIcon';
import FirstVisitTip from '../components/FirstVisitTip';
import InfoIcon from '../components/InfoIcon';
import useFirstVisitTip from '../hooks/useFirstVisitTip';
import { getProteinCardBackground } from '../utils/proteinColors';
import { filterRecipes } from '../utils/pantryMatch';

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));

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

  // The "Your First Picks Are Ready!" banner is a one-time celebratory
  // flourish, not a permanent fixture -- since justOnboarded now lives in
  // App.jsx (and so survives tab switches), it needs its own explicit
  // auto-dismiss rather than relying on Kitchen unmounting to clear it.
  useEffect(() => {
    if (!justOnboarded) return;
    const timer = setTimeout(() => onDismissJustOnboarded?.(), 5000);
    return () => clearTimeout(timer);
  }, [justOnboarded, onDismissJustOnboarded]);

  const toggleStaple = (id) => {
    hapticSelection();
    setSelectedStaples((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleFindRecipes = () => {
    if (selectedStaples.length === 0) return;
    hapticLight();
    setSurpriseError('');
    setResults(filterRecipes(RECIPES, selectedStaples));
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
    if (onOpen) onOpen(pick);
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
    setResults(next.length > 0 ? filterRecipes(RECIPES, next) : null);
  };

  const reset = () => {
    hapticLight();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="page-h1" style={{ marginBottom: 0 }}>What's In Your Kitchen?</div>
          <div className="info-btn" onClick={tip.reopen} title="Show info">
            <InfoIcon />
          </div>
        </div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Tell us what's already in your kitchen and we'll find recipes that use it -- or hit Surprise Me to skip the decision entirely.
        </div>

        <FirstVisitTip show={tip.show} onDismiss={tip.dismiss}>
          This is your shortcut to "what can I make right now?" -- pick a few things you have on hand and we'll match them to real recipes, or tap Surprise Me below if you'd rather skip the decision entirely.
        </FirstVisitTip>

        {/* Pantry picking lives in its own drawer (PantryPickerModal) instead
            of rendering all ~30 chips across 5 categories inline -- this row
            is just a compact summary/entry point into it. */}
        <div className="filter-sec" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="filter-label" style={{ marginBottom: 0 }}>
              What Do You Have?
            </div>
            {/* Lives right next to the label (rather than appended at the
                tail end of the pill row below) so it's always on screen --
                with several staples picked, the pill row scrolls
                horizontally and a trailing "+ Edit" pill there could sit
                fully off-screen, reachable only by scrolling. The whole
                pill row is still clickable too; this is just a guaranteed-
                visible entry point into the same pantry drawer. */}
            {selectedStaples.length > 0 && (
              <div
                onClick={() => { hapticLight(); setShowPantryModal(true); }}
                style={{ fontSize: 12, fontWeight: 700, color: 'var(--lime)', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                + Edit
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
            </div>
          )}
        </div>

        {surpriseError && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{surpriseError}</div>
        )}

        {/* Quick Picks -- shown only on the idle screen (nothing searched
            yet), so the space between the pantry input and the floating
            Surprise Me button isn't just empty. One tap runs the same
            match Find Recipes does (see handleQuickPick above), so results
            appear right below immediately instead of requiring a trip
            through the full pantry drawer first. Mostly proteins since
            that's the hard filter that actually narrows things down. */}
        {results === null && (
          <div style={{ marginTop: 18 }}>
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
        <div className="px" style={{ marginTop: 8 }}>
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
              {/* A single result (typical of the post-onboarding single-
                  meal handoff, or a Quick Pick narrowed all the way down)
                  gets its own "hero" treatment instead of blending in with
                  an ordinary result list -- a pulsing glow border, a small
                  "Your Match" label, and a couple of twinkling bolt
                  sparkles (reusing OnboardingFinishSparkles rather than
                  inventing a third sparkle animation) so this is
                  unmistakably the one thing to look at, not just the top
                  row of a list. The "N recipes" count line is dropped in
                  this case since it'd just say "1 recipe" right above the
                  thing it's emphasizing.

                  Clear now lives right here, immediately above the
                  result(s), rather than up by the page title -- the
                  onboarding hand-off in particular lands here with no
                  staples picked at all, so the old title-row Clear link
                  (only shown when selectedStaples was non-empty) never
                  appeared, leaving no way to dismiss a generated meal you
                  didn't want. Showing unconditionally whenever there's
                  something to clear (any time `results` isn't null) fixes
                  that, and putting it right next to what it clears is a
                  clearer pairing than a link way up at the top of the
                  page. */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {results.length > 1 && (
                    <><span style={{ color: 'var(--lime)' }}>●</span> {results.length} recipes</>
                  )}
                </div>
                <div
                  onClick={reset}
                  style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
                >
                  Clear
                </div>
              </div>
              {results.map((r, i) => {
                const missingStaples = selectedStaples.length > 0
                  ? (r.pantryTags || []).filter((t) => !selectedStaples.includes(t))
                  : [];
                const isHero = results.length === 1;
                return (
                  <div key={r.id} style={isHero ? { position: 'relative' } : undefined}>
                    {isHero && (
                      <div className="kitchen-hero-label">
                        <LightningIcon size={16} id="kitchen-hero" />
                        <span>Your Match</span>
                      </div>
                    )}
                    <div
                      className={`kitchen-result-card${isHero ? ' kitchen-hero-card' : ''}`}
                      style={{
                        position: 'relative',
                        background: getProteinCardBackground(r.proteins),
                        border: '1px solid var(--border)',
                        borderRadius: 14,
                        padding: isHero ? 18 : 14,
                        marginBottom: 10,
                        cursor: 'pointer',
                        '--card-i': Math.min(i, 8),
                      }}
                      onClick={() => openRecipe(r)}
                    >
                      {isHero && <OnboardingFinishSparkles />}
                      <div style={{ fontWeight: 700, fontSize: isHero ? 18 : 15, color: 'var(--cream)', marginBottom: 4 }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <span>
                          {r.method}{r.method && r.activeTime ? ' · ' : ''}{formatTime(r.activeTime, r.totalTime)}
                          {getRatingSummary && getRatingSummary(r.id) && (
                            <> · ★ {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
                          )}
                        </span>
                        <span>·</span>
                        <EffortGauge recipe={r} size={11} />
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
                  </div>
                );
              })}
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
