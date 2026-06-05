import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const MACRO_VALUES = {
  // Proteins
  "tilapia": { cal: 96, protein: 20, carbs: 0, fat: 2 },
  "cod": { cal: 82, protein: 18, carbs: 0, fat: 1 },
  "canned salmon": { cal: 130, protein: 20, carbs: 0, fat: 5 },
  "shrimp": { cal: 85, protein: 18, carbs: 1, fat: 1 },
  "chicken breast": { cal: 110, protein: 23, carbs: 0, fat: 1 },
  "ground chicken": { cal: 143, protein: 27, carbs: 0, fat: 3 },
  "ground turkey": { cal: 123, protein: 22, carbs: 0, fat: 4 },
  "ground beef": { cal: 137, protein: 21, carbs: 0, fat: 5 },
  "canned chicken": { cal: 100, protein: 22, carbs: 0, fat: 1 },
  "rotisserie chicken": { cal: 165, protein: 28, carbs: 0, fat: 6 },
  "ground bison": { cal: 146, protein: 21, carbs: 0, fat: 7 },

  // Carbs
  "cauliflower rice": { cal: 25, protein: 2, carbs: 5, fat: 0 },
  "brown rice": { cal: 108, protein: 2, carbs: 22, fat: 1 },
  "quinoa": { cal: 120, protein: 4, carbs: 22, fat: 2 },

  // Vegetables
  "frozen green beans": { cal: 31, protein: 2, carbs: 7, fat: 0 },
  "frozen spinach": { cal: 23, protein: 3, carbs: 3, fat: 0 },
  "frozen peas": { cal: 77, protein: 5, carbs: 14, fat: 0 },
  "frozen edamame": { cal: 121, protein: 11, carbs: 9, fat: 5 },
  "frozen asparagus": { cal: 20, protein: 2, carbs: 4, fat: 0 },
  "frozen mixed veg": { cal: 65, protein: 3, carbs: 13, fat: 0 },

  // Oils & Seasonings
  "avocado oil spray": { cal: 7, protein: 0, carbs: 0, fat: 1 },
  "coconut oil spray": { cal: 7, protein: 0, carbs: 0, fat: 1 },
  "butter": { cal: 72, protein: 0, carbs: 0, fat: 8 },
  "italian seasoning": { cal: 5, protein: 0, carbs: 1, fat: 0 },
  "lemon pepper seasoning": { cal: 5, protein: 0, carbs: 1, fat: 0 },
  "everything bagel seasoning": { cal: 8, protein: 0, carbs: 1, fat: 0 },
  "coconut aminos": { cal: 10, protein: 0, carbs: 2, fat: 0 },
  "frank's redhot": { cal: 5, protein: 0, carbs: 1, fat: 0 },
  "cholula": { cal: 5, protein: 0, carbs: 1, fat: 0 },
};

const SUBSTITUTIONS = {
  // Proteins
  "ground turkey": ["Ground Chicken", "Ground Beef", "Canned Chicken"],
  "ground chicken": ["Ground Turkey", "Ground Beef", "Canned Chicken"],
  "ground beef": ["Ground Turkey", "Ground Chicken", "Ground Bison"],
  "chicken breast": ["Rotisserie Chicken", "Ground Chicken", "Canned Chicken"],
  "chicken thighs": ["Chicken Breast", "Ground Turkey", "Rotisserie Chicken"],
  "salmon": ["Cod", "Canned Salmon", "Tilapia"],
  "cod": ["Salmon", "Tilapia", "Shrimp"],
  "tilapia": ["Salmon", "Cod", "Shrimp"],
  "shrimp": ["Cod", "Tilapia", "Canned Salmon"],
  "canned salmon": ["Canned Chicken", "Shrimp", "Cod"],
  "canned chicken": ["Ground Chicken", "Chicken Breast", "Canned Salmon"],
  "rotisserie chicken": ["Chicken Breast", "Ground Chicken", "Canned Chicken"],
  "ground bison": ["Ground Turkey", "Ground Beef", "Ground Chicken"],
  "tuna": ["Canned Salmon", "Canned Chicken", "Shrimp"],
  "pork": ["Chicken Thighs", "Ground Turkey", "Ground Beef"],
  "egg": ["Egg whites", "Canned Chicken", "Tofu"],

  // Carbs
  "white rice": ["Brown Rice", "Quinoa", "Cauliflower Rice"],
  "brown rice": ["White Rice", "Quinoa", "Cauliflower Rice"],
  "quinoa": ["Brown Rice", "White Rice", "Cauliflower Rice"],
  "pasta": ["Brown Rice", "Quinoa", "Zucchini noodles"],
  "oat": ["Quinoa", "Brown Rice", "Cauliflower Rice"],

  // Vegetables
  "broccoli": ["Frozen Green Beans", "Frozen Spinach", "Frozen Mixed Veg"],
  "green beans": ["Frozen Spinach", "Frozen Broccoli", "Frozen Asparagus"],
  "frozen green beans": ["Frozen Broccoli", "Frozen Spinach", "Frozen Asparagus"],
  "spinach": ["Frozen Peas", "Frozen Broccoli", "Frozen Asparagus"],
  "frozen spinach": ["Frozen Peas", "Frozen Green Beans", "Frozen Broccoli"],
  "frozen peas": ["Frozen Spinach", "Frozen Edamame", "Frozen Mixed Veg"],
  "frozen edamame": ["Frozen Peas", "Frozen Spinach", "Frozen Green Beans"],
  "frozen asparagus": ["Frozen Broccoli", "Frozen Green Beans", "Frozen Spinach"],
  "frozen mixed veg": ["Frozen Peas", "Frozen Edamame", "Frozen Green Beans"],
  "mixed veg": ["Frozen Edamame", "Frozen Peas", "Frozen Mixed Veg"],
  "asparagus": ["Frozen Broccoli", "Frozen Green Beans", "Frozen Spinach"],

  // Dairy
  "greek yogurt": ["Cottage Cheese", "Skyr", "Quark"],
  "cottage cheese": ["Greek Yogurt", "Ricotta", "Quark"],
  "cheddar": ["Mozzarella", "Pepper Jack", "Colby Jack"],
  "cheese": ["Greek Yogurt", "Cottage Cheese", "Nutritional Yeast"],

  // Sauces & Seasonings
  "garlic herb": ["Italian Seasoning", "Lemon Pepper Seasoning", "Everything Bagel Seasoning"],
  "italian seasoning": ["Garlic Herb", "Lemon Pepper Seasoning", "Everything Bagel Seasoning"],
  "lemon pepper seasoning": ["Italian Seasoning", "Garlic Herb", "Everything Bagel Seasoning"],
  "everything bagel seasoning": ["Italian Seasoning", "Lemon Pepper Seasoning", "Garlic Herb"],
  "taco seasoning": ["Fajita Seasoning", "Cumin", "Paprika"],
  "teriyaki": ["Coconut Aminos", "Soy Sauce", "Tamari"],
  "sriracha": ["Frank's RedHot", "Cholula", "Hot Sauce"],
  "frank's redhot": ["Cholula", "Sriracha", "Hot Sauce"],
  "cholula": ["Frank's RedHot", "Sriracha", "Hot Sauce"],
  "lemon pepper": ["Italian Seasoning", "Garlic Herb", "Cajun Seasoning"],
  "buffalo": ["Frank's RedHot", "Sriracha", "Hot Sauce"],
  "marinara": ["Tomato Paste", "Pizza Sauce", "Prego"],
  "soy sauce": ["Coconut Aminos", "Tamari", "Liquid Aminos"],
  "coconut aminos": ["Soy Sauce", "Tamari", "Liquid Aminos"],
  "olive oil": ["Avocado Oil Spray", "Coconut Oil Spray", "Butter"],
  "avocado oil spray": ["Coconut Oil Spray", "Olive Oil", "Butter"],
  "coconut oil spray": ["Avocado Oil Spray", "Olive Oil", "Butter"],
  "butter": ["Avocado Oil Spray", "Coconut Oil Spray", "Olive Oil"],
  "honey": ["Maple Syrup", "Agave Nectar", "Sugar-free Syrup"],
  "mayo": ["Greek Yogurt", "Avocado", "Light Mayo"],
  "mustard": ["Dijon Mustard", "Hot Sauce", "Horseradish"],

  // Baking & Misc
  "panko": ["Breadcrumbs", "Rice Cakes", "Almond Flour"],
  "almond milk": ["Oat Milk", "Regular Milk", "Coconut Milk"],
  "cauliflower rice": ["Brown Rice", "Quinoa", "White Rice"],
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

  // Recalculate totals whenever components change
  useEffect(() => {
    if (components && components.length > 0) {
      const newTotals = components.reduce(
        (acc, comp) => ({
          cal: acc.cal + (comp.cal || 0),
          protein: acc.protein + (comp.protein || 0),
          carbs: acc.carbs + (comp.carbs || 0),
          fat: acc.fat + (comp.fat || 0),
        }),
        { cal: 0, protein: 0, carbs: 0, fat: 0 }
      );
      setMacros(newTotals);
    }
  }, [components]);

  const getSubstitutions = (ingredientName) => {
    const lowerName = ingredientName.toLowerCase();
    for (const key in SUBSTITUTIONS) {
      if (lowerName.includes(key.toLowerCase())) {
        return SUBSTITUTIONS[key];
      }
    }
    return null;
  };

  const getMacroValues = (name) => {
    // Try exact match first (case-insensitive)
    const lowerName = name.toLowerCase();
    const exactKey = Object.keys(MACRO_VALUES).find(key => key.toLowerCase() === lowerName);
    if (exactKey) return MACRO_VALUES[exactKey];

    // Try partial match: newName includes key or key includes newName
    const partialKey = Object.keys(MACRO_VALUES).find(
      key => lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)
    );
    if (partialKey) return MACRO_VALUES[partialKey];

    // No match found
    return null;
  };

  const handleSwapComponent = (index, newName) => {
    // Update the component at this index
    const updatedComponents = [...components];
    const originalComponent = updatedComponents[index];
    const newMacros = getMacroValues(newName);

    // Update component name
    if (newMacros) {
      // If we found macros, calculate new values
      updatedComponents[index] = {
        ...originalComponent,
        name: newName,
        cal: Math.round(newMacros.cal * (originalComponent.grams / 100)),
        protein: Math.round((newMacros.protein * (originalComponent.grams / 100)) * 10) / 10,
        carbs: Math.round((newMacros.carbs * (originalComponent.grams / 100)) * 10) / 10,
        fat: Math.round((newMacros.fat * (originalComponent.grams / 100)) * 10) / 10,
      };
    } else {
      // If no macros found, just update the name but keep the original macros
      updatedComponents[index] = {
        ...originalComponent,
        name: newName,
      };
    }

    setComponents(updatedComponents);
    setIsModified(true);
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
