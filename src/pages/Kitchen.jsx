import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { PANTRY_STAPLES, PANTRY_CATEGORIES } from '../data/pantryStaples.js';
import { formatTime } from '../utils/time';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import PantryPickerModal from '../components/PantryPickerModal';
import SurpriseSparkles from '../components/SurpriseSparkles';
import FindRecipesSparkles from '../components/FindRecipesSparkles';
import { getProteinCardBackground } from '../utils/proteinColors';

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="filter-label" style={{ marginBottom: 0 }}>
              What Do You Have?
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
          primary "do the thing" action never gets buried below the pantry
          picker. Find Recipes is disabled until at least one ingredient is
          picked (unranked "here's all 144 recipes" isn't a useful "find"
          result); Surprise Me stays enabled always, since it needs no
          input at all -- that's the whole point of it. */}
      <div style={{ position: 'fixed', bottom: 58, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '10px 18px', boxSizing: 'border-box', zIndex: 25 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className="gen-kitchen-btn find-recipes-btn"
              style={{ width: '100%', marginBottom: 0 }}
              disabled={selectedStaples.length === 0}
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
