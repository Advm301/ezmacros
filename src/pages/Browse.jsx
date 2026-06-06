import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';
import { SPICE_LEVELS } from '../lib/generator.js';

export default function Browse({ezLevel, onOpen}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [spiceFilter, setSpiceFilter] = useState("Any Spice");
  const [sortBy, setSortBy] = useState("default");
  const filters = ["Breakfast","Lunch/Dinner","Snack"];
  const spiceFilters = ["Any Spice","No Spice","Mild","Medium","Hot"];
  const sortOptions = ["Default","Protein (High→Low)","Calories (High→Low)","Time (Short→Long)"];

  const filtered = RECIPES.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());

    // Meal type filtering - empty filter shows all meal types
    let matchFilter = !filter;
    if (filter) {
      matchFilter = r.mealType === filter;
    }

    let matchSpice = true;
    if (spiceFilter === "No Spice") matchSpice = r.spiceLevel === 0;
    else if (spiceFilter === "Mild") matchSpice = r.spiceLevel === 1;
    else if (spiceFilter === "Medium") matchSpice = r.spiceLevel === 2;
    else if (spiceFilter === "Hot") matchSpice = r.spiceLevel === 3;
    // "Any Spice" matches all

    // Filter by global EZ level: Effortless shows only level 1, Easy shows <= 2, Relaxed shows all
    let matchEz = true;
    if (ezLevel === 1) matchEz = r.ezLevel === 1;
    else if (ezLevel === 2) matchEz = r.ezLevel <= 2;
    // ezLevel === 3 (Relaxed) matches all

    return matchSearch && matchFilter && matchSpice && matchEz;
  }).sort((a, b) => {
    // Apply sorting based on sortBy selection
    if (sortBy === "Protein (High→Low)") {
      return b.protein - a.protein;
    } else if (sortBy === "Calories (High→Low)") {
      return b.cal - a.cal;
    } else if (sortBy === "Time (Short→Long)") {
      return a.activeTime - b.activeTime;
    }
    // Default: return in original order
    return 0;
  });
  return (
    <div style={{paddingBottom: 20}}>
      <div className="px pt">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
          <div className="h1">Browse Recipes</div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{background: "var(--s2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--cream)", fontSize: 12, fontWeight: 600, cursor: "pointer"}}
          >
            {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="sub" style={{marginBottom: 12}}>
          {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{width: "100%", background: "var(--s2)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", color: "var(--cream)", fontSize: 14, marginBottom: 10, boxSizing: "border-box"}}/>

        <div className="filter-label" style={{marginBottom: 8}}>Meal Type</div>
        <div className="scroll-row" style={{marginBottom: 16}}>
          {filters.map(f => <div key={f} className={`pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</div>)}
        </div>

        <div className="filter-label" style={{marginBottom: 8}}>Spice Level</div>
        <div className="scroll-row" style={{marginBottom: 16}}>
          {spiceFilters.map(s => <div key={s} className={`pill ${spiceFilter === s ? "active" : ""}`} onClick={() => setSpiceFilter(s)}>{s}</div>)}
        </div>
      </div>
      <div className="px">
        {filtered.map(r => (
          <div key={r.id} className="recipe-card" style={{marginBottom: 10, cursor: "pointer"}} onClick={() => onOpen({...r, isBrowseRecipe: true})}>
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <span style={{fontSize: 24}}>{r.emoji}</span>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 700, fontSize: 15, color: "var(--cream)", marginBottom: 2}}>
                  {r.name}
                  {r.spiceLevel > 0 && <span style={{marginLeft: 6, fontSize: 12, color: "var(--orange)"}}>{SPICE_LEVELS[r.spiceLevel].display}</span>}
                </div>
                <div style={{fontSize: 11, color: "var(--muted)"}}>{r.method} · {r.activeTime} min · {r.cal} cal · {r.protein}g P</div>
              </div>
              <div style={{textAlign: "right"}}>
                <div style={{fontSize: 18, fontWeight: 700, color: "var(--lime)", fontFamily: "'Clash Display',sans-serif"}}>{r.protein}g</div>
                <div style={{fontSize: 10, color: "var(--muted)"}}>protein</div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{textAlign: "center", color: "var(--muted)", padding: 40}}>No recipes found. Try the Kitchen tab to generate one!</div>}
      </div>
    </div>
  );
}
