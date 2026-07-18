import { useEffect, useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_STAPLES, QUICK_PICKS } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import PantryPickerModal from '../components/PantryPickerModal';
import SurpriseSparkles from '../components/SurpriseSparkles';
import EffortGauge from '../components/EffortGauge';
import LightningIcon from '../components/LightningIcon';
import FirstVisitTip from '../components/FirstVisitTip';
import { getProteinCardBackground } from '../utils/proteinColors';
import { rankForPreferences } from '../utils/onboardingGoals';
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

// `initialPicks` (shape { staples, goal, servingsPref }) arrives once,
// right after onboarding finishes (see App.jsx) -- it's how the app shows
// a real, personalized set of recipes the instant onboarding ends instead
// of dropping someone onto this same empty screen to do the work
// themselves a second time. `goal`/`servingsPref` only ever affect THIS
// one seed: they bias which of the matching recipes shows up first (see
// rankForPreferences), they don't change how filterRecipes itself works
// for any later search, since there's no ongoing preference setting
// visible anywhere else in the app for a person to reason about. (When
// onboarding's "plan my day" option is picked instead, App.jsx logs a
// full day to the Diary directly and never hands Kitchen anything --
// see utils/fullDayPlan.js.)
export default function Kitchen({ onOpen, getRatingSummary, initialPicks, onConsumeInitialPicks }) {
  const [selectedStaples, setSelectedStaples] = useState(() => initialPicks?.staples || []);
  const [showPantryModal, setShowPantryModal] = useState(false);
  const [results, setResults] = useState(() => (
    initialPicks?.staples?.length
      ? rankForPreferences(filterRecipes(RECIPES, initialPicks.staples), initialPicks)
      : null
  ));
  const [surpriseError, setSurpriseError] = useState('');
  // Whether this particular mount of Kitchen is the one, one-time reveal
  // right after onboarding hands off real results -- captured once, at
  // mount, same as `results` above, so it stays true for this view even
  // after the consume-once effect below clears `initialPicks` back to
  // null a moment later. Drives the celebratory banner below; Kitchen
  // fully unmounts on every tab switch (see App.jsx), so this can never
  // resurface on a later, ordinary visit to the tab.
  const [justOnboarded] = useState(() => !!initialPicks?.staples?.length);

  // Runs once, right after mount -- tells the parent the initial picks
  // have been consumed so it can clear them. Kitchen fully unmounts every
  // time you switch tabs away from it (see App.jsx's tab === "kitchen"
  // conditional render) and remounts fresh on the way back, so without
  // this, the lazy initializers above would silently reseed the same
  // onboarding picks every single time you revisit the tab, overwriting
  // whatever you'd searched for since.
  useEffect(() => {
    if (initialPicks && onConsumeInitialPicks) onConsumeInitialPicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anyFilterActive = selectedStaples.length > 0;

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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div className="page-h1">What's In Your Kitchen?</div>
          {anyFilterActive && (
            <div
              onClick={reset}
              style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', marginTop: 6 }}
            >
              Clear
            </div>
          )}
        </div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Tell us what's already in your kitchen and we'll find recipes that use it -- or hit Surprise Me to skip the decision entirely.
        </div>

        <FirstVisitTip storageKey="quickprep_seen_kitchen_tip">
          This is your shortcut to "what can I make right now?" -- pick a few things you have on hand and we'll match them to real recipes, or tap Surprise Me below if you'd rather skip the decision entirely.
        </FirstVisitTip>

        {/* Pantry picking lives in its own drawer (PantryPickerModal) instead
            of rendering all ~30 chips across 5 categories inline -- this row
            is just a compact summary/entry point into it. */}
        <div className="filter-sec" style={{ marginBottom: 10 }}>
          {/* The "Clear" link next to the page title above already resets
              everything -- a second one here duplicated it for no reason
              (Browse's single "Clear All Filters" link is the pattern this
              now matches). */}
          <div className="filter-label" style={{ marginBottom: 8 }}>
            What Do You Have?
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
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                <span style={{ color: 'var(--lime)' }}>●</span> {results.length} recipe{results.length > 1 ? 's' : ''}
              </div>
              {results.map((r, i) => {
                const missingStaples = selectedStaples.length > 0
                  ? (r.pantryTags || []).filter((t) => !selectedStaples.includes(t))
                  : [];
                return (
                  <div
                    key={r.id}
                    className="kitchen-result-card"
                    style={{
                      background: getProteinCardBackground(r.proteins),
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 10,
                      cursor: 'pointer',
                      '--card-i': Math.min(i, 8),
                    }}
                    onClick={() => openRecipe(r)}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 4 }}>
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
