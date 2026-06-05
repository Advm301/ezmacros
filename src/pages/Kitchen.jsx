import { useState } from 'react';
import { EZ } from '../data/recipes.js';
import { QUICK_COMBOS } from '../data/quickCombos.js';
import { generateLocalRecipes, classifyIngredient, SPICE_LEVELS } from '../lib/generator.js';

export default function Kitchen({ezLevel, goals, onOpen}) {
  const [input, setInput] = useState("");
  const [ings, setIngs] = useState([]);
  const [flavorTags, setFlavorTags] = useState([]);
  const [cookMethod, setCookMethod] = useState("Any");
  const [heatLevel, setHeatLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const FLAVORS = ["Spicy","Saucy","Neutral","Asian-Inspired","Italian-Inspired","Mediterranean","Caribbean","BBQ","American"];
  const METHODS = ["Any","No Cook","Microwave","Air Fryer","Bake","Stovetop","Slow Cooker"];
  const HEAT_LEVELS = ["Mild", "Medium", "Hot"];

  const addIng = () => {
    const v = input.trim();
    if(!v || ings.includes(v)) return;
    setIngs(p => [...p, v]);
    setInput("");
  };

  const removeIng = n => setIngs(p => p.filter(i => i !== n));
  const toggleFlavor = t => {
    if (t === "Spicy" && flavorTags.includes("Spicy")) {
      // Reset heat level when removing Spicy flavor
      setHeatLevel(null);
    }
    setFlavorTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  };

  const generate = () => {
    if(!ings.length) return;
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      const isSpicy = flavorTags.includes("Spicy");
      const heatLevelNum = isSpicy && heatLevel ? (heatLevel === "Mild" ? 1 : heatLevel === "Medium" ? 2 : 3) : null;
      const recipes = generateLocalRecipes(ings, ezLevel, flavorTags, cookMethod, goals, heatLevelNum);
      setResults(recipes);
      setLoading(false);
    }, 900);
  };

  const lev = EZ[ezLevel];

  return(
    <div style={{paddingBottom: 20}}>
      <div className="px pt">
        <div className="h1">What's In My Kitchen?</div>
        <div className="sub" style={{marginBottom: 14}}>Add your ingredients — get EZ-certified recipes instantly.</div>

        <div className="quick-label">Quick combos:</div>
        <div className="quick-chips">
          {QUICK_COMBOS.map((c, i) => (
            <div key={i} className="quick-chip" onClick={() => {setIngs(c.ings); setResults([]);}}>
              {c.label}
            </div>
          ))}
        </div>

        <div className="ing-area">
          <div className="ing-row">
            <input className="ing-input" placeholder="e.g. cod fillet, green beans..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => {if(e.key === "Enter") addIng();}}/>
            <button className="add-btn" onClick={addIng}>Add</button>
          </div>
          <div className="ing-chips">
            {ings.length === 0 && <span style={{fontSize: 12, color: "var(--muted)"}}>No ingredients added yet — try a quick combo above</span>}
            {ings.map(ing => (
              <div key={ing} className={`ing-chip ${classifyIngredient(ing)}`}>
                {ing}
                <span className="rm" onClick={() => removeIng(ing)}>×</span>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-sec">
          <div className="filter-label">Flavor / Cuisine</div>
          <div className="scroll-row">
            {FLAVORS.map(t => <div key={t} className={`pill ${flavorTags.includes(t) ? "active" : ""}`} onClick={() => toggleFlavor(t)}>{t}</div>)}
          </div>
        </div>

        <div className="filter-sec" style={{marginBottom: 12}}>
          <div className="filter-label">Cooking Method</div>
          <div className="scroll-row">
            {METHODS.map(m => <div key={m} className={`pill ${cookMethod === m ? "active" : ""}`} onClick={() => setCookMethod(m)}>{m}</div>)}
          </div>
        </div>

        {flavorTags.includes("Spicy") && (
          <div className="filter-sec" style={{marginBottom: 12}}>
            <div className="filter-label">Heat Level</div>
            <div className="scroll-row">
              {HEAT_LEVELS.map(level => <div key={level} className={`pill ${heatLevel === level ? "active" : ""}`} onClick={() => setHeatLevel(level)}>{level}</div>)}
            </div>
          </div>
        )}

        <div className="ez-level-info">
          <span style={{fontSize: 15}}>{lev.bolts}</span>
          <span>Generating at <b style={{color: lev.color}}>{lev.name}</b> level · {lev.time} · max {lev.steps} steps. Change in Goals tab.</span>
        </div>

        <button className="gen-kitchen-btn" onClick={generate} disabled={loading || ings.length === 0}>
          {loading
            ? <><div style={{width: 18, height: 18, border: "2px solid rgba(0,0,0,.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin .7s linear infinite"}}/> Generating...</>
            : <>✦ Generate EZ Recipes</>}
        </button>
      </div>

      {loading && (
        <div className="px">
          <div className="ai-loading">
            <div className="ai-spinner"/>
            <div className="ai-loading-txt">Building your recipes...</div>
            <div className="ai-loading-sub">Checking EZ Standard · Calculating scale weights</div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="px" style={{marginTop: 16}}>
          {results[0]?.isMessage ? (
            // Message result - no recipes found
            <div style={{background: "var(--s1)", border: "2px solid var(--lime)", borderRadius: 16, padding: 20, textAlign: "center"}}>
              <div style={{fontSize: 40, marginBottom: 12}}>🥩</div>
              <div style={{fontSize: 15, fontWeight: 700, color: "var(--cream)", marginBottom: 10}}>
                No EZ recipes found for those ingredients
              </div>
              <div style={{fontSize: 13, color: "var(--muted)", lineHeight: 1.6}}>
                Try adding a recognizable protein — chicken, beef, turkey, salmon, tuna, eggs, or shrimp — and we'll build you something real.
              </div>
            </div>
          ) : (
            // Recipe results
            <>
              <div style={{fontSize: 12, color: "var(--muted)", marginBottom: 10}}>
                <span style={{color: "var(--lime)"}}>●</span> {results.length} recipe{results.length > 1 ? "s" : ""} · EZ {EZ[ezLevel].name} certified · click to expand
              </div>
              {results.map((r, i) => (
                <div key={i} className="recipe-card" style={{marginBottom: 10, cursor: "pointer"}}
                  onClick={() => onOpen && onOpen({...r,
                    id: `gen_${i}`,
                    cal: r.totalCal,
                    protein: r.totalProtein,
                    carbs: r.totalCarbs,
                    fat: r.totalFat,
                    activeTime: r.activeMinutes,
                    stepCount: r.stepCount,
                    type: r.type || "fresh",
                    components: r.components.map(c => ({...c, p: c.protein, c: c.carbs, f: c.fat})),
                    steps: r.steps,
                    toppings: r.toppings || [],
                    utensils: r.utensils || ["Food scale"],
                    scaleTip: r.scaleTip || "Always weigh proteins raw.",
                    ezChecks: r.ezChecks || {stepsOk: true, noKnifeWork: true, microwaveCarbs: true, bottledSauces: true, noPeeling: true, noScratchSauce: true},
                  })}>
                  <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 6}}>
                    <span style={{fontSize: 22}}>{r.emoji}</span>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 700, fontSize: 15}}>
                        {r.name}
                        {r.spiceLevel > 0 && <span style={{marginLeft: 6, fontSize: 12, color: "var(--orange)"}}>{SPICE_LEVELS[r.spiceLevel].display}</span>}
                      </div>
                      <div style={{fontSize: 11, color: "var(--muted)", marginTop: 2}}>
                        {r.method} · {r.activeMinutes} min · {r.stepCount} steps
                      </div>
                    </div>
                  </div>
                  <div style={{display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8}}>
                    <span className="ezb" style={{background: "var(--s3)", color: "var(--muted)", border: "1px solid var(--border)"}}>🔥 {r.method}</span>
                    <span className="ezb" style={{background: "var(--s3)", color: "var(--muted)", border: "1px solid var(--border)"}}>⏱ {r.activeMinutes} min</span>
                    <span className="ezb" style={{background: "var(--s3)", color: "var(--muted)", border: "1px solid var(--border)"}}>📋 {r.stepCount} steps</span>
                    {(r.tags || []).slice(0, 2).map(t => <span key={t} className="ezb" style={{background: "var(--s3)", color: "var(--muted)", border: "1px solid var(--border)"}}>{t}</span>)}
                  </div>
                  <div className="ms">
                    <div style={{background: "var(--s2)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px"}}>
                      <div style={{display: "flex", justifyContent: "space-between"}}>
                        {[["cal","orange",r.totalCal],["protein","var(--lime)",r.totalProtein+"g"],["carbs","var(--blue)",r.totalCarbs+"g"],["fat","var(--muted)",r.totalFat+"g"]].map(([l,c,v]) => (
                          <div key={l} style={{textAlign: "center"}}>
                            <div style={{fontFamily: "'Clash Display',sans-serif", fontSize: 18, fontWeight: 700, color: c}}>{v}</div>
                            <div style={{fontSize: 10, color: "var(--muted)"}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
