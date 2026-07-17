import { useState } from 'react';
import { PANTRY_CATEGORIES, PANTRY_STAPLES } from '../data/pantryStaples.js';
import { hapticLight, hapticSelection } from '../utils/haptics';
import FindRecipesSparkles from './FindRecipesSparkles';

const PANTRY_LABELS = Object.fromEntries(PANTRY_STAPLES.map((s) => [s.id, s.label]));

// Short labels for the category quick-filter row -- the full category names
// ("Canned & Condiments") are fine as section headers but too wide for a
// row of 5 tappable pills across a 430px screen.
const CATEGORY_SHORT_LABELS = {
  'Grains & Starches': 'Grains',
  'Proteins': 'Proteins',
  'Dairy & Fridge': 'Dairy',
  'Produce': 'Produce',
  'Canned & Condiments': 'Condiments',
};

// Redesigned after the pantry list grew from ~27 to ~50 items (see
// pantryStaples.js) -- rendering all of them as one flat wall of pills, all
// the time, was exactly the "ton of touchable pills / long scroll bar"
// problem at that scale. This is a search-then-click picker instead:
// nothing but your already-picked chips shows by default, and a results
// list only appears once you either type a search or tap one of the 5
// category pills. Both narrow the same underlying item list, so you can
// combine them (tap "Proteins" then type "chick" to jump straight to
// chicken breast/thighs).
export default function PantryPickerModal({ selectedStaples, toggleStaple, onClose, onFindRecipes }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const searchLower = search.trim().toLowerCase();
  const showResults = searchLower.length > 0 || activeCategory !== null;

  const results = showResults
    ? PANTRY_CATEGORIES
        .filter((cat) => !activeCategory || cat.category === activeCategory)
        .flatMap((cat) => cat.items)
        .filter((s) => !searchLower || s.label.toLowerCase().includes(searchLower))
    : [];

  const selectCategory = (category) => {
    hapticSelection();
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  // Selecting doesn't close the picker or reset the category filter --
  // just clears the search text so the same "type the next thing" flow
  // works for adding several items in a row.
  const selectResult = (id) => {
    hapticSelection();
    toggleStaple(id);
    setSearch('');
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // Height used to be a flat 82vh regardless of content -- with the
        // idle state now just a title, search box, and one row of category
        // pills (no results list until you search or pick a category), a
        // fixed 82vh left a big slab of empty sheet below it. maxHeight
        // instead lets the sheet hug whatever's actually showing, and only
        // grows toward the cap once a results list (bounded to its own
        // maxHeight below) actually has something to show.
        style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, maxHeight: '82vh', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', padding: '18px 18px 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>What Do You Have?</div>
          <div onClick={onClose} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
            ✕
          </div>
        </div>

        {/* Selected items as removable chips -- typically a handful, so
            this stays compact even as the underlying list has grown. */}
        {selectedStaples.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
            {selectedStaples.map((id) => (
              <div
                key={id}
                className="pill active"
                onClick={() => { hapticLight(); toggleStaple(id); }}
              >
                {PANTRY_LABELS[id] || id} ✕
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search 50+ ingredients (e.g. rice, chicken thighs)..."
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--cream)', fontSize: 13, padding: '10px 12px', marginBottom: 10, fontFamily: "'Manrope',sans-serif" }}
        />

        {/* One row, 5 pills -- an alternative to typing when you're not sure
            of the exact name, not a second wall of options. Tapping one
            scopes the results below to that category; tapping it again (or
            just searching across all of them) clears the scope. */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
          {PANTRY_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              className={`pill ${activeCategory === cat.category ? 'active' : ''}`}
              onClick={() => selectCategory(cat.category)}
            >
              {CATEGORY_SHORT_LABELS[cat.category] || cat.category}
            </div>
          ))}
        </div>

        <div style={{ maxHeight: '46vh', overflowY: 'auto', paddingBottom: 12 }}>
          {!showResults ? (
            <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, textAlign: 'center', padding: '10px 12px' }}>
              Search for an ingredient, or tap a category above to browse.
            </div>
          ) : results.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              No pantry items match "{search}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {results.map((s) => (
                <div
                  key={s.id}
                  className={`pill ${selectedStaples.includes(s.id) ? 'active' : ''}`}
                  onClick={() => selectResult(s.id)}
                >
                  {selectedStaples.includes(s.id) ? `✓ ${s.label}` : s.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Used to be a plain "Done" that just closed the drawer -- now it
            IS the Find Recipes action (the old main-page button was
            redundant with this one and mostly sat there disabled). Stays
            disabled until at least one ingredient is picked, same as
            before. */}
        <div style={{ padding: '12px 0 18px', borderTop: '1px solid var(--border)', position: 'relative' }}>
          <button
            className="gen-kitchen-btn find-recipes-btn"
            style={{ marginBottom: 0 }}
            disabled={selectedStaples.length === 0}
            onClick={onFindRecipes}
          >
            ✦ Find Recipes{selectedStaples.length > 0 ? ` (${selectedStaples.length})` : ''}
          </button>
          <FindRecipesSparkles />
        </div>
      </div>
    </div>
  );
}
