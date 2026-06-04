import { useState } from 'react';
import { RECIPES } from '../data/recipes.js';

export default function Browse({ezLevel, onOpen}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All","Breakfast","Lunch","Dinner","Snack","No Cook","Quick","Meal Prep"];
  const filtered = RECIPES.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (r.tags || []).some(t => t.includes(filter));
    return matchSearch && matchFilter;
  });
  return (
    <div style={{paddingBottom: 20}}>
      <div className="px pt">
        <div className="h1">Browse Recipes</div>
        <div className="sub" style={{marginBottom: 12}}>{RECIPES.length} curated EZ-certified recipes</div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{width: "100%", background: "var(--s2)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", color: "var(--cream)", fontSize: 14, marginBottom: 10, boxSizing: "border-box"}}/>
        <div className="scroll-row" style={{marginBottom: 16}}>
          {filters.map(f => <div key={f} className={`pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</div>)}
        </div>
      </div>
      <div className="px">
        {filtered.map(r => (
          <div key={r.id} className="recipe-card" style={{marginBottom: 10, cursor: "pointer"}} onClick={() => onOpen(r)}>
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <span style={{fontSize: 24}}>{r.emoji}</span>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 700, fontSize: 15, color: "var(--cream)"}}>{r.name}</div>
                <div style={{fontSize: 11, color: "var(--muted)", marginTop: 2}}>{r.method} · {r.activeTime} min · {r.cal} cal · {r.protein}g P</div>
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
