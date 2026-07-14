import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';

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

export default function Browse({ onOpen, isFavorited, toggleFavorite }) {
  const [search, setSearch] = useState('');
  const [mealFilter, setMealFilter] = useState(null);
  const [proteinFilter, setProteinFilter] = useState(null);
  const [flavorFilter, setFlavorFilter] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filtered = RECIPES.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchMeal = !mealFilter || r.mealType === mealFilter;
    const matchProtein = !proteinFilter || r.proteins.includes(proteinFilter);
    const matchFlavor = !flavorFilter || r.flavor === flavorFilter;
    const matchFavorites = !showFavoritesOnly || isFavorited(r.id);
    return matchSearch && matchMeal && matchProtein && matchFlavor && matchFavorites;
  });

  const sections = MEAL_SECTIONS.filter((s) => !mealFilter || s.value === mealFilter);

  const renderRecipeRow = (r) => (
    <div
      key={r.id}
      style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}
      onClick={() => onOpen(r)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2 }}>
            {r.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {r.method}{r.method && r.activeTime ? ' · ' : ''}{r.activeTime ? `${r.activeTime} min` : ''}
          </div>
        </div>
        <div onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}>
          <StarIcon filled={isFavorited(r.id)} size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div className="h1" style={{ marginBottom: 12 }}>Browse Recipes</div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', color: 'var(--cream)', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' }}
        />

        <div className="filter-label">Meal Type</div>
        <div className="scroll-row" style={{ marginBottom: 14 }}>
          <div className={`pill ${!mealFilter ? 'active' : ''}`} onClick={() => setMealFilter(null)}>
            {!mealFilter ? '✓ All Meals' : 'All Meals'}
          </div>
          <div className={`pill ${showFavoritesOnly ? 'active' : ''}`} onClick={() => setShowFavoritesOnly((v) => !v)}>
            {showFavoritesOnly ? '★ Favorites' : '☆ Favorites'}
          </div>
          {MEAL_SECTIONS.map((s) => (
            <div key={s.value} className={`pill ${mealFilter === s.value ? 'active' : ''}`} onClick={() => setMealFilter(s.value)}>
              {s.label}
            </div>
          ))}
        </div>

        <div className="filter-label">Protein</div>
        <div className="scroll-row" style={{ marginBottom: 14 }}>
          <div className={`pill ${!proteinFilter ? 'active' : ''}`} onClick={() => setProteinFilter(null)}>
            Any
          </div>
          {PROTEINS.map((p) => (
            <div key={p.value} className={`pill ${proteinFilter === p.value ? 'active' : ''}`} onClick={() => setProteinFilter(proteinFilter === p.value ? null : p.value)}>
              {p.label}
            </div>
          ))}
        </div>

        <div className="filter-label">Flavor</div>
        <div className="scroll-row" style={{ marginBottom: 6 }}>
          <div className={`pill ${!flavorFilter ? 'active' : ''}`} onClick={() => setFlavorFilter(null)}>
            Any
          </div>
          {FLAVORS.map((f) => (
            <div key={f.value} className={`pill ${flavorFilter === f.value ? 'active' : ''}`} onClick={() => setFlavorFilter(flavorFilter === f.value ? null : f.value)}>
              {f.label}
            </div>
          ))}
        </div>

        <div className="sub" style={{ marginTop: 10 }}>
          {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
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
            return (
              <div key={section.value} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  {section.label} ({sectionRecipes.length})
                </div>
                {sectionRecipes.map(renderRecipeRow)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
