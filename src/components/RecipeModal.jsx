import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const MACRO_VALUES = {
  "Ground Chicken": { cal: 143, protein: 27, carbs: 0, fat: 3 },
  "Ground Beef (93% lean)": { cal: 137, protein: 21, carbs: 0, fat: 5 },
  "Chicken Breast": { cal: 110, protein: 23, carbs: 0, fat: 1 },
  "Brown Rice Pouch": { cal: 216, protein: 5, carbs: 45, fat: 2 },
  "Cauliflower rice bag": { cal: 25, protein: 2, carbs: 5, fat: 0 },
  "Frozen Green Beans": { cal: 31, protein: 2, carbs: 7, fat: 0 },
  "Frozen Spinach": { cal: 23, protein: 3, carbs: 3, fat: 0 },
};

const SUBSTITUTIONS = {
  // Proteins
  "ground turkey": ["Ground Chicken", "Ground Beef (93% lean)", "Canned Chicken"],
  "chicken thighs": ["Chicken Breast", "Ground Turkey", "Rotisserie Chicken"],
  "salmon": ["Cod", "Canned Salmon pouch", "Tilapia"],
  "cod": ["Salmon", "Tilapia", "Shrimp"],
  "ground beef": ["Ground Turkey", "Ground Bison", "Canned Beef"],
  "tuna": ["Canned Salmon", "Canned Chicken", "Sardines"],
  "shrimp": ["Bay scallops", "Tilapia", "Canned crab"],
  "pork": ["Chicken Thighs", "Turkey Tenderloin", "Lamb chops"],
  "egg": ["Egg whites (carton)", "Tofu scramble", "Liquid egg substitute"],

  // Carbs
  "white rice": ["Brown Rice Pouch", "Quinoa pouch", "Cauliflower rice bag"],
  "pasta": ["Banza chickpea pasta", "Lentil pasta", "Zucchini noodles (frozen)"],
  "oat": ["Cream of wheat", "Grits", "Quinoa flakes"],

  // Vegetables
  "broccoli": ["Frozen Green Beans", "Frozen Spinach", "Frozen Mixed Veg"],
  "green bean": ["Frozen Broccoli", "Frozen Asparagus", "Frozen Mixed Veg"],
  "spinach": ["Kale (bagged, pre-washed)", "Frozen peas", "Arugula"],
  "mixed veg": ["Frozen edamame", "Frozen peas and carrots", "Canned mixed vegetables"],
  "asparagus": ["Frozen broccoli", "Frozen green beans", "Zucchini"],

  // Dairy
  "greek yogurt": ["Skyr (Siggi's)", "Cottage Cheese", "Quark"],
  "cottage cheese": ["Ricotta", "Greek Yogurt", "Quark"],
  "cheddar": ["Mozzarella", "Pepper jack", "Colby jack"],
  "cheese": ["Nutritional yeast", "Dairy-free shredded cheese", "Light cream cheese"],

  // Sauces & Seasonings
  "garlic herb": ["Italian Seasoning (shaker)", "Lemon Pepper Seasoning", "Everything Bagel Seasoning"],
  "taco seasoning": ["Fajita Seasoning packet", "Chili Seasoning packet", "Cumin + Paprika + Garlic Powder"],
  "teriyaki": ["Coconut Aminos + honey", "Soy sauce + honey + garlic powder", "Kikkoman Stir Fry Sauce"],
  "sriracha": ["Frank's RedHot", "Cholula", "Sambal Oelek"],
  "lemon pepper": ["Garlic Herb Seasoning", "Italian Seasoning", "Cajun Seasoning"],
  "buffalo": ["Frank's RedHot + butter", "Sriracha + honey", "Sweet Baby Ray's Buffalo"],
  "marinara": ["Tomato paste + Italian seasoning", "Prego Traditional", "Pizza sauce"],
  "soy sauce": ["Coconut Aminos", "Tamari (gluten-free soy)", "Liquid Aminos"],
  "olive oil": ["Avocado oil spray", "Coconut oil spray", "Butter"],
  "honey": ["Maple syrup", "Agave nectar", "Sugar-free syrup"],
  "mayo": ["Greek yogurt", "Avocado", "Light mayo"],
  "mustard": ["Dijon mustard", "Hot sauce", "Horseradish"],

  // Baking & Misc
  "panko": ["Regular breadcrumbs", "Crushed rice cakes", "Almond flour"],
  "almond milk": ["Oat milk", "Regular milk", "Coconut milk carton"],
};

export default function RecipeModal({recipe, onClose, onMealLogged, isLoggedView}) {
  const [logged, setLogged] = useState(false);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSwap, setExpandedSwap] = useState(null);
  const [components, setComponents] = useState([]);
  const [macros, setMacros] = useState({ cal: 0, protein: 0, carbs: 0, fat: 0 });
  const [steps, setSteps] = useState([]);
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [editingStepText, setEditingStepText] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Reset logged state when modal opens for a new recipe
    setLogged(false);
    setError(null);
    setExpandedSwap(null);
    setEditingStepIndex(null);
    setIsModified(false);
    // Initialize components, steps, and macros from recipe
    if (recipe) {
      setComponents(recipe.components ? [...recipe.components] : []);
      setSteps(recipe.steps ? [...recipe.steps] : []);
      setMacros({
        cal: recipe.cal || recipe.totalCal || 0,
        protein: recipe.protein || recipe.totalProtein || 0,
        carbs: recipe.carbs || recipe.totalCarbs || 0,
        fat: recipe.fat || recipe.totalFat || 0,
      });
    }
  }, [recipe?.id]);

  const getSubstitutions = (ingredientName) => {
    const lowerName = ingredientName.toLowerCase();
    for (const key in SUBSTITUTIONS) {
      if (lowerName.includes(key.toLowerCase())) {
        return SUBSTITUTIONS[key];
      }
    }
    return null;
  };

  const handleSwapComponent = (index, newName) => {
    console.log('handleSwapComponent called:', { index, newName });

    // Update the component at this index
    const updatedComponents = [...components];
    const originalComponent = updatedComponents[index];
    const newMacros = MACRO_VALUES[newName];

    console.log('Macro lookup result:', { newName, newMacros });

    if (newMacros) {
      // Update component name and macros
      updatedComponents[index] = {
        ...originalComponent,
        name: newName,
        cal: Math.round(newMacros.cal * (originalComponent.grams / 100)),
        protein: Math.round((newMacros.protein * (originalComponent.grams / 100)) * 10) / 10,
        carbs: Math.round((newMacros.carbs * (originalComponent.grams / 100)) * 10) / 10,
        fat: Math.round((newMacros.fat * (originalComponent.grams / 100)) * 10) / 10,
      };

      setComponents(updatedComponents);

      // Recalculate totals
      const newTotals = updatedComponents.reduce(
        (acc, comp) => ({
          cal: acc.cal + (comp.cal || 0),
          protein: acc.protein + (comp.protein || 0),
          carbs: acc.carbs + (comp.carbs || 0),
          fat: acc.fat + (comp.fat || 0),
        }),
        { cal: 0, protein: 0, carbs: 0, fat: 0 }
      );

      setMacros(newTotals);
      setIsModified(true);
    }

    setExpandedSwap(null);
  };

  const handleEditStep = (index) => {
    setEditingStepIndex(index);
    setEditingStepText(steps[index] || '');
  };

  const handleSaveStep = () => {
    if (editingStepIndex !== null) {
      const updatedSteps = [...steps];
      updatedSteps[editingStepIndex] = editingStepText;
      setSteps(updatedSteps);
      setEditingStepIndex(null);
      setIsModified(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingStepIndex(null);
    setEditingStepText('');
  };

  const handleMoveStepUp = (index) => {
    if (index > 0) {
      const updatedSteps = [...steps];
      [updatedSteps[index - 1], updatedSteps[index]] = [updatedSteps[index], updatedSteps[index - 1]];
      setSteps(updatedSteps);
      setIsModified(true);
    }
  };

  const handleMoveStepDown = (index) => {
    if (index < steps.length - 1) {
      const updatedSteps = [...steps];
      [updatedSteps[index], updatedSteps[index + 1]] = [updatedSteps[index + 1], updatedSteps[index]];
      setSteps(updatedSteps);
      setIsModified(true);
    }
  };

  if (!recipe) return null;
  const r = recipe;

  const handleLogMeal = async () => {
    setLogging(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to log meals");
        setLogging(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('meal_logs')
        .insert({
          user_id: user.id,
          recipe_id: String(r.id || r.name),
          recipe_name: r.name,
          cal: Math.round(macros.cal),
          protein: Math.round(macros.protein),
          carbs: Math.round(macros.carbs),
          fat: Math.round(macros.fat),
          logged_at: new Date().toISOString(),
          recipe_data: JSON.stringify({
            components: components.map(comp => ({
              ...comp,
              cal: Math.round(comp.cal),
              protein: Math.round(comp.protein),
              carbs: Math.round(comp.carbs),
              fat: Math.round(comp.fat),
            })),
            steps: steps,
            toppings: r.toppings || [],
          }),
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        setLogged(true);
        // Call onMealLogged callback if provided
        if (onMealLogged) {
          onMealLogged();
        }
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "Failed to log meal");
    } finally {
      setLogging(false);
    }
  };
  return (
    <div style={{position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 100, overflowY: "auto"}} onClick={onClose}>
      <div style={{background: "var(--s1)", margin: "20px auto", maxWidth: 430, borderRadius: 20, padding: 24, border: "1px solid var(--border)"}} onClick={e => e.stopPropagation()}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16}}>
          <div>
            <div style={{fontSize: 32, marginBottom: 4}}>{r.emoji}</div>
            <div style={{fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--cream)"}}>
              {r.name}{isModified && !r.isLogged ? " (Modified)" : ""}
            </div>
            {!r.isLogged && (
              <div style={{fontSize: 12, color: "var(--muted)", marginTop: 4}}>
                {r.method} · {r.activeTime || r.activeMinutes} min active · {r.stepCount} steps
              </div>
            )}
          </div>
          <button onClick={onClose} style={{background: "var(--s3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13}}>✕ Close</button>
        </div>

        {/* Macros */}
        <div style={{background: "var(--s2)", borderRadius: 14, padding: 14, marginBottom: 16, border: "1px solid var(--border)"}}>
          <div style={{display: "flex", justifyContent: "space-around"}}>
            {[["cal", macros.cal, "var(--orange)"],["protein", macros.protein + "g", "var(--lime)"],
              ["carbs", macros.carbs + "g", "var(--blue)"],["fat", macros.fat + "g", "var(--muted)"]].map(([l,v,c]) => (
              <div key={l} style={{textAlign: "center"}}>
                <div style={{fontSize: 22, fontWeight: 700, color: c, fontFamily: "'Clash Display',sans-serif"}}>{v}</div>
                <div style={{fontSize: 10, color: "var(--muted)"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logged Meal Details */}
        {r.isLoggedView && r.loggedTime && (
          <div style={{fontSize: 12, color: "var(--muted)", marginBottom: 12}}>
            Logged at: {new Date(r.loggedTime).toLocaleString()}
          </div>
        )}

        {/* Components */}
        {(!r.isLogged || r.isLoggedView) && components && components.length > 0 && (
          <div style={{marginBottom: 16}}>
            <div style={{fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1}}>Components</div>
            {components.map((c, i) => {
              const substitutions = getSubstitutions(c.name);
              return (
                <div key={i}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)"}}>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: 13, fontWeight: 600, color: "var(--cream)"}}>{c.name}</div>
                      <div style={{fontSize: 11, color: "var(--muted)"}}>{c.type} · {c.grams}g{c.weighRaw ? " (weigh raw)" : ""}</div>
                    </div>
                    <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                      <div style={{textAlign: "right", fontSize: 12, color: "var(--muted)"}}>
                        <div style={{color: "var(--orange)", fontWeight: 600}}>{c.cal} cal</div>
                        <div>{c.protein || c.p}g P</div>
                      </div>
                      <button
                        onClick={() => setExpandedSwap(expandedSwap === i ? null : i)}
                        style={{
                          background: "transparent",
                          border: "1px solid var(--border)",
                          color: substitutions ? "var(--muted)" : "var(--s3)",
                          borderRadius: 6,
                          padding: "4px 8px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: substitutions ? "pointer" : "not-allowed",
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                          opacity: substitutions ? 1 : 0.5,
                        }}
                        disabled={!substitutions}
                        onMouseEnter={(e) => {
                          if (substitutions) {
                            e.target.style.borderColor = "var(--lime)";
                            e.target.style.color = "var(--lime)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (substitutions) {
                            e.target.style.borderColor = "var(--border)";
                            e.target.style.color = "var(--muted)";
                          }
                        }}
                      >
                        Swap
                      </button>
                    </div>
                  </div>

                  {/* Substitution Panel */}
                  {expandedSwap === i && substitutions && (
                    <div style={{padding: "8px 0 12px 0", borderBottom: "1px solid var(--border)"}}>
                      <div style={{fontSize: 10, color: "var(--muted)", marginBottom: 8}}>Alternatives:</div>
                      <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                        {substitutions.map((sub, j) => (
                          <button
                            key={j}
                            onClick={() => handleSwapComponent(i, sub)}
                            style={{
                              background: "var(--s2)",
                              border: "1px solid var(--lime)",
                              color: "var(--lime)",
                              borderRadius: 20,
                              padding: "6px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "var(--lime)";
                              e.target.style.color = "#000";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "var(--s2)";
                              e.target.style.color = "var(--lime)";
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No swaps available */}
                  {expandedSwap === i && !substitutions && (
                    <div style={{padding: "8px 0 12px 0", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--muted)"}}>
                      No swaps available for this ingredient
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Steps */}
        {(!r.isLogged || r.isLoggedView) && steps.length > 0 && (
          <div style={{marginBottom: 16}}>
            <div style={{fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1}}>Steps</div>
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{display: "flex", flexDirection: "column", gap: 4, paddingTop: 2}}>
                  {i > 0 && (
                    <button
                      onClick={() => handleMoveStepUp(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "2px 6px",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => e.target.style.color = "var(--lime)"}
                      onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
                    >
                      ▲
                    </button>
                  )}
                  {i < steps.length - 1 && (
                    <button
                      onClick={() => handleMoveStepDown(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "2px 6px",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => e.target.style.color = "var(--lime)"}
                      onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
                    >
                      ▼
                    </button>
                  )}
                </div>
                <div style={{width: 24, height: 24, minWidth: 24, background: "var(--lime)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000"}}>{i+1}</div>
                <div style={{flex: 1}}>
                  {editingStepIndex === i ? (
                    <div>
                      <textarea
                        value={editingStepText}
                        onChange={(e) => setEditingStepText(e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "8px",
                          borderRadius: 6,
                          border: "1px solid var(--lime)",
                          background: "var(--s2)",
                          color: "var(--cream)",
                          fontSize: 13,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          resize: "vertical",
                        }}
                      />
                      <div style={{display: "flex", gap: 8, marginTop: 8}}>
                        <button
                          onClick={handleSaveStep}
                          style={{
                            background: "var(--lime)",
                            color: "#000",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            background: "var(--s2)",
                            color: "var(--muted)",
                            border: "1px solid var(--border)",
                            borderRadius: 6,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                      <div style={{fontSize: 13, color: "var(--cream)", lineHeight: 1.5}}>{s}</div>
                      <button
                        onClick={() => handleEditStep(i)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--muted)",
                          fontSize: 14,
                          cursor: "pointer",
                          padding: "2px 6px",
                          marginLeft: 8,
                        }}
                        onMouseEnter={(e) => e.target.style.color = "var(--lime)"}
                        onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toppings */}
        {(!r.isLogged || r.isLoggedView) && r.toppings && r.toppings.length > 0 && (
          <div style={{marginBottom: 16}}>
            <div style={{fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1}}>Optional Toppings</div>
            {r.toppings.map((t, i) => (
              <div key={i} style={{display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)"}}>
                <div style={{fontSize: 13, color: "var(--cream)"}}>{t.name}</div>
                <div style={{fontSize: 11, color: "var(--muted)"}}>{t.info}</div>
              </div>
            ))}
          </div>
        )}

        {/* Log Meal Button */}
        {!r.isLogged && !r.isLoggedView && (
          <>
            <button
              onClick={handleLogMeal}
              disabled={logging || logged}
              style={{
                width: "100%",
                background: logged ? "var(--s2)" : "var(--lime)",
                color: logged ? "var(--muted)" : "#000",
                border: "none",
                borderRadius: 12,
                padding: "14px 16px",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'Clash Display', sans-serif",
                cursor: logged || logging ? "not-allowed" : "pointer",
                opacity: logged ? 0.6 : 1,
                transition: "all 0.15s",
                marginBottom: error ? 12 : 0,
              }}
            >
              {logged ? "✓ Logged" : logging ? "Logging..." : "Log This Meal"}
            </button>

            {/* Error Message */}
            {error && (
              <div style={{
                background: "rgba(255, 77, 77, 0.1)",
                border: "1px solid rgba(255, 77, 77, 0.3)",
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                color: "var(--red)",
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
