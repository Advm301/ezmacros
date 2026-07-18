import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_STAPLES, PANTRY_CATEGORIES } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import PantryPickerModal from '../components/PantryPickerModal';
import SurpriseSparkles from '../components/SurpriseSparkles';
import EffortGauge from '../components/EffortGauge';
import { getProteinCardBackground } from '../utils/proteinColors';

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));

// One-tap shortcuts for the most common "what's actually in the fridge"
// picks, shown on the idle Kitchen screen (before you've searched or opened
// the full pantry drawer) so that screen isn't just a title and an empty
// input box with a wall of blank space beneath it. Mostly proteins, since
// a protein is the hard filter that actually decides what you can make
// (see filterRecipes above), plus the two most common carb staples --
// tapping one runs the same pantry match Find Recipes does, immediately
// filling that space with real results instead of leaving it empty until
// the picker drawer is opened.
const QUICK_PICK_IDS = [
  'chicken_breast', 'ground_beef', 'eggs', 'chicken_thighs', 'ground_turkey',
  'salmon', 'shrimp', 'rotisserie_chicken', 'rice', 'pasta',
];
const QUICK_PICKS = QUICK_PICK_IDS
  .map((id) => PANTRY_STAPLES.find((s) => s.id === id))
  .filter(Boolean);

// Straight "matches ANY of your picks" was surfacing recipes that shared
// only a side ingredient (rice, bell peppers, hot sauce) with a completely
// different protein than the one actually selected -- picking Chicken
// Breast alongside a couple of pantry basics would still return cod, ground
// beef, and pork recipes, because they also happened to use rice. Proteins
// are the actual entree, not just another ingredient to tally, so they get
// a harder rule: if you've picked one or more proteins, a recipe MUST use
// at least one of them to show up at all. Everything else you've picked
// stays a soft "nice to have" signal that only affects ranking.
const PROTEIN_IDS = new Set(
  (PANTRY_CATEGORIES.find((c) => c.category === 'Proteins')?.items || []).map((i) => i.id)
);

// Kitchen used to duplicate Browse's Meal Type/Protein/Flavor/Quick Filter
// dropdowns almost exactly -- same filters, same underlying data, just a
// second place to set them. That overlap made the two tabs feel
// interchangeable rather than distinct. Kitchen's actual, unique job is
// "what can I make with what's already here" -- so it's now pantry-in,
// recipe-out (plus the no-input Surprise Me shortcut) and nothing else.
// Browse remains the general-purpose search/filter/sort tool over the
// whole catalog.
//
// With no staples selected, every recipe is an equally valid match (there's
// nothing to rank against), so this just returns the full list -- Surprise
// Me uses that to mean "pick anything," while Find Recipes is disabled
// below until at least one staple is picked, since showing all 144 recipes
// unranked isn't a useful "find" result.
function filterRecipes(recipes, selectedStaples) {
  if (selectedStaples.length === 0) return recipes;

  const selectedProteins = selectedStaples.filter((id) => PROTEIN_IDS.has(id));
  const pool = selectedProteins.length > 0
    ? recipes.filter((r) => (r.pantryTags || []).some((t) => selectedProteins.includes(t)))
    : recipes;

  return pool
    .filter((r) => (r.pantryTags || []).some((t) => selectedStaples.includes(t)))
    .map((r) => ({ ...r, _matchCount: (r.pantryTags || []).filter((t) => selectedStaples.includes(t)).length }))
    .sort((a, b) => b._matchCount - a._matchCount);
}

export default function Kitchen({ onOpen, getRatingSummary }) {
  const [selectedStaples, setSelectedStaples] = useState([]);
  const [showPantryModal, setShowPantryModal] = useState(false);
  const [results, setResults] = useState(null);
  const [surpriseError, setSurpriseError] = useState('');

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
