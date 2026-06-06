import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { SPICE_LEVELS } from '../lib/generator.js';
import StarIcon from './StarIcon';

const MACRO_VALUES = {
  // Proteins
  "tilapia": { cal: 96, protein: 20, carbs: 0, fat: 2 },
  "cod": { cal: 82, protein: 18, carbs: 0, fat: 1 },
  "salmon": { cal: 142, protein: 20, carbs: 0, fat: 6 },
  "canned salmon": { cal: 130, protein: 20, carbs: 0, fat: 5 },
  "shrimp": { cal: 85, protein: 18, carbs: 1, fat: 1 },
  "chicken breast": { cal: 110, protein: 23, carbs: 0, fat: 1 },
  "chicken thighs": { cal: 119, protein: 19, carbs: 0, fat: 4 },
  "ground chicken": { cal: 143, protein: 27, carbs: 0, fat: 3 },
  "ground turkey": { cal: 149, protein: 19, carbs: 0, fat: 8 },
  "ground beef": { cal: 137, protein: 21, carbs: 0, fat: 5 },
  "canned chicken": { cal: 100, protein: 22, carbs: 0, fat: 1 },
  "rotisserie chicken": { cal: 165, protein: 28, carbs: 0, fat: 6 },
  "ground bison": { cal: 146, protein: 21, carbs: 0, fat: 7 },

  // Egg alternatives
  "whole eggs": { cal: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  "egg white carton": { cal: 52, protein: 10.9, carbs: 0.7, fat: 0.2 },
  "liquid egg substitute": { cal: 74, protein: 11, carbs: 1, fat: 3 },
  "silken tofu": { cal: 55, protein: 5, carbs: 2, fat: 3 },
  "flax egg": { cal: 37, protein: 1, carbs: 3, fat: 3 },

  // Carbs
  "white rice": { cal: 130, protein: 3, carbs: 28, fat: 0 },
  "cauliflower rice": { cal: 25, protein: 2, carbs: 5, fat: 0 },
  "brown rice": { cal: 108, protein: 2, carbs: 22, fat: 1 },
  "quinoa": { cal: 120, protein: 4, carbs: 22, fat: 2 },

  // Vegetables
  "frozen broccoli": { cal: 35, protein: 3, carbs: 6, fat: 0 },
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

const FOOD_DATABASE = [
  // Cheeses
  { name: "Reduced Fat Cheddar", cal: 290, protein: 24, carbs: 1, fat: 20 },
  { name: "Mozzarella", cal: 280, protein: 22, carbs: 2, fat: 20 },
  { name: "Pepper Jack", cal: 370, protein: 22, carbs: 1, fat: 30 },
  { name: "Colby Jack", cal: 390, protein: 23, carbs: 1, fat: 32 },
  { name: "Feta Cheese", cal: 264, protein: 14, carbs: 4, fat: 21 },
  { name: "Parmesan", cal: 431, protein: 38, carbs: 4, fat: 29 },
  { name: "Cottage Cheese", cal: 98, protein: 11, carbs: 3, fat: 4 },
  { name: "Ricotta", cal: 174, protein: 11, carbs: 3, fat: 13 },

  // Deli & Proteins
  { name: "Turkey Breast (deli)", cal: 89, protein: 17, carbs: 2, fat: 1 },
  { name: "Ham (deli)", cal: 107, protein: 17, carbs: 2, fat: 4 },
  { name: "Smoked Salmon", cal: 117, protein: 18, carbs: 0, fat: 4 },
  { name: "Sardines", cal: 208, protein: 25, carbs: 0, fat: 11 },
  { name: "Tuna (canned)", cal: 116, protein: 26, carbs: 0, fat: 1 },

  // Legumes
  { name: "Edamame", cal: 121, protein: 11, carbs: 9, fat: 5 },
  { name: "Black Beans", cal: 132, protein: 9, carbs: 24, fat: 1 },
  { name: "Chickpeas", cal: 164, protein: 9, carbs: 27, fat: 3 },
  { name: "Lentils", cal: 116, protein: 9, carbs: 20, fat: 0 },

  // Grains & Carbs
  { name: "Quinoa", cal: 120, protein: 4, carbs: 22, fat: 2 },
  { name: "Sweet Potato", cal: 86, protein: 2, carbs: 20, fat: 0 },

  // Fruits & Nuts
  { name: "Avocado", cal: 160, protein: 2, carbs: 9, fat: 15 },
  { name: "Banana", cal: 89, protein: 1, carbs: 23, fat: 0 },
  { name: "Blueberries", cal: 57, protein: 1, carbs: 14, fat: 0 },
  { name: "Strawberries", cal: 32, protein: 1, carbs: 8, fat: 0 },
  { name: "Almond Butter", cal: 614, protein: 21, carbs: 19, fat: 56 },
  { name: "Peanut Butter", cal: 588, protein: 25, carbs: 20, fat: 50 },

  // Grains & Cereals
  { name: "Granola", cal: 471, protein: 10, carbs: 64, fat: 20 },
  { name: "Protein Powder (whey)", cal: 400, protein: 80, carbs: 8, fat: 5 },

  // Dairy & Milk
  { name: "Whole Milk", cal: 61, protein: 3, carbs: 5, fat: 3 },
  { name: "Oat Milk", cal: 45, protein: 1, carbs: 7, fat: 2 },
  { name: "Greek Yogurt 0%", cal: 59, protein: 10, carbs: 4, fat: 0 },
  { name: "Skyr", cal: 63, protein: 11, carbs: 4, fat: 0 },

  // Condiments & Sauces
  { name: "Hummus", cal: 166, protein: 8, carbs: 14, fat: 10 },
  { name: "Salsa", cal: 36, protein: 2, carbs: 8, fat: 0 },
  { name: "Hot Sauce", cal: 11, protein: 0, carbs: 2, fat: 0 },
  { name: "Soy Sauce", cal: 53, protein: 8, carbs: 5, fat: 0 },

  // Oils & Sweeteners
  { name: "Olive Oil", cal: 884, protein: 0, carbs: 0, fat: 100 },
  { name: "Butter", cal: 717, protein: 1, carbs: 0, fat: 81 },
  { name: "Honey", cal: 304, protein: 0, carbs: 82, fat: 0 },
  { name: "Maple Syrup", cal: 260, protein: 0, carbs: 67, fat: 0 },
];

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
  "egg white": ["Whole eggs (3 large)", "Liquid egg substitute", "Silken tofu scramble"],
  "whole egg": ["Egg white carton", "Liquid egg substitute", "Flax egg (1 tbsp flax + 3 tbsp water)"],
  "egg": ["Egg white carton", "Liquid egg substitute", "Silken tofu scramble"],
  "egg white carton": ["Whole eggs (3 large)", "Liquid egg substitute", "Silken tofu scramble"],
  "liquid egg substitute": ["Egg white carton", "Whole eggs (3 large)", "Silken tofu scramble"],

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

export default function RecipeModal({recipe, onClose, onMealLogged, isLoggedView, onSave, isFavorited, toggleFavorite}) {
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchComponentIndex, setSearchComponentIndex] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [resetConfirming, setResetConfirming] = useState(false);
  const resetConfirmTimeoutRef = useRef(null);
  const [usdaResults, setUsdaResults] = useState([]);
  const [usdaLoading, setUsdaLoading] = useState(false);
  const [usdaError, setUsdaError] = useState(null);
  const usdaDebounceRef = useRef(null);
  const [updatedStepIndices, setUpdatedStepIndices] = useState(new Set());
  const stepFlashTimeoutRef = useRef(null);
  const [userHasModified, setUserHasModified] = useState(false);
  const [editingGramIndex, setEditingGramIndex] = useState(null);
  const [editingGramValue, setEditingGramValue] = useState("");
  const [completedSteps, setCompletedSteps] = useState({});
  const [removedComponentIndices, setRemovedComponentIndices] = useState(new Set());

  // Track original state to enable reset functionality
  const originalComponents = useRef([]);
  const originalSteps = useRef([]);
  const originalName = useRef("");
  const initialLoadedComponents = useRef([]);
  const initialLoadedSteps = useRef([]);

  // Helper function to extract keyword from component name
  const extractKeyword = (name) => {
    if (!name) return "";
    // List of words to skip (descriptors and packaging that shouldn't be part of the keyword)
    const skipWords = ["frozen", "canned", "white", "brown", "ground", "pre-cooked", "pre-cut", "low-sodium", "heavy", "light", "reduced", "extra", "lean", "skinless", "boneless", "pouch", "bag", "carton", "bottle", "can"];

    // Remove everything in parentheses
    let cleaned = name.replace(/\s*\([^)]*\)/g, "").trim();

    // Split into words
    let words = cleaned.toLowerCase().split(/\s+/);

    // Find meaningful words (skip prefix words)
    let result = [];
    for (let word of words) {
      if (!skipWords.includes(word)) {
        result.push(word);
      }
    }

    // Return up to 2 words for compound ingredients like "green beans", "mixed veg", "cauliflower rice"
    let keyword = result.slice(0, 2).join(" ").toLowerCase();

    // Return the extracted keyword (handles both single and multi-word ingredients)
    return keyword;
  };

  useEffect(() => {
    // Reset logged state when modal opens for a new recipe
    setLogged(false);
    setError(null);
    setExpandedSwap(null);
    setEditingStepIndex(null);
    setIsModified(false);
    setHasUnsavedChanges(false);
    setResetConfirming(false);
    setCompletedSteps({});
    setRemovedComponentIndices(new Set());
    if (resetConfirmTimeoutRef.current) clearTimeout(resetConfirmTimeoutRef.current);

    // Initialize components, steps, and macros from recipe
    if (recipe) {
      // Deep copy components to avoid mutation issues
      const initialComponents = (recipe.components || []).map(comp => ({...comp}));
      const initialSteps = recipe.steps ? [...recipe.steps] : [];
      let initialName = recipe.name || "";
      initialName = initialName.replace(" (Modified)", "");

      // Store what was initially loaded from database
      initialLoadedComponents.current = initialComponents;
      initialLoadedSteps.current = initialSteps;

      // Determine original recipe data for reset functionality
      let originalComponentsData = initialComponents;
      let originalStepsData = initialSteps;

      // Priority 1: Use originalRecipeData passed from Today.jsx
      if (recipe.originalRecipeData) {
        originalComponentsData = (recipe.originalRecipeData.components || initialComponents).map(comp => ({...comp}));
        originalStepsData = recipe.originalRecipeData.steps || initialSteps;
      }
      // Priority 2: Check if recipe_data has originalData
      else if (recipe.recipe_data && typeof recipe.recipe_data === "string") {
        try {
          const parsedData = JSON.parse(recipe.recipe_data);
          if (parsedData.originalData) {
            originalComponentsData = (parsedData.originalData.components || initialComponents).map(comp => ({...comp}));
            originalStepsData = parsedData.originalData.steps || initialSteps;
          }
        } catch (e) {
          // If parsing fails, use loaded data as original
        }
      }

      // Store original recipe values in refs (deep copies)
      originalComponents.current = originalComponentsData;
      originalSteps.current = originalStepsData;
      originalName.current = initialName;

      setComponents(initialComponents);
      setSteps(initialSteps);
      setRecipeName(initialName);

      // Initialize macros with correct field names for both Kitchen recipes (totalCal) and Browse recipes (cal)
      const initialCal = recipe.totalCal ?? recipe.cal ?? 0;
      const initialProtein = recipe.totalProtein ?? recipe.protein ?? 0;
      const initialCarbs = recipe.totalCarbs ?? recipe.carbs ?? 0;
      const initialFat = recipe.totalFat ?? recipe.fat ?? 0;

      setMacros({
        cal: initialCal,
        protein: initialProtein,
        carbs: initialCarbs,
        fat: initialFat,
      });

      // Reset userHasModified on new recipe open, but preserve if meal was previously modified
      if (recipe.wasModified) {
        setUserHasModified(true);
      } else {
        setUserHasModified(false);
      }
    }

    return () => {
      // Cleanup timeouts on unmount
      if (resetConfirmTimeoutRef.current) clearTimeout(resetConfirmTimeoutRef.current);
      if (stepFlashTimeoutRef.current) clearTimeout(stepFlashTimeoutRef.current);
      if (usdaDebounceRef.current) clearTimeout(usdaDebounceRef.current);
    };
  }, [recipe?.id]);

  // Recalculate totals whenever components change or removed components change
  useEffect(() => {
    if (components && components.length > 0) {
      // Filter out removed components before calculating totals
      const visibleComponents = components.filter((c, i) => !removedComponentIndices.has(i));

      const totalCal = visibleComponents.reduce((sum, c) => sum + (Number(c.cal) || 0), 0);
      const totalProtein = visibleComponents.reduce((sum, c) => sum + (Number(c.protein ?? c.p) || 0), 0);
      const totalCarbs = visibleComponents.reduce((sum, c) => sum + (Number(c.carbs ?? c.c) || 0), 0);
      const totalFat = visibleComponents.reduce((sum, c) => sum + (Number(c.fat ?? c.f) || 0), 0);

      setMacros({
        cal: totalCal,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      });
      if (recipe?.isLoggedView) setHasChanges(true);
    }
  }, [components, removedComponentIndices, recipe?.isLoggedView]);

  // Update recipeName display based on userHasModified flag
  useEffect(() => {
    if (userHasModified) {
      if (recipeName !== originalName.current + " (Modified)") {
        setRecipeName(originalName.current + " (Modified)");
      }
    } else {
      if (recipeName !== originalName.current) {
        setRecipeName(originalName.current);
      }
    }
  }, [userHasModified]);


  // For logged meals, track if there are unsaved changes from what was loaded from database
  useEffect(() => {
    if (!recipe?.isLoggedView) return;

    const hasUnsaved = components.length !== initialLoadedComponents.current.length ||
      steps.length !== initialLoadedSteps.current.length ||
      !components.every((comp, i) => {
        const orig = initialLoadedComponents.current[i];
        return comp.name === orig.name &&
          Math.round(comp.cal) === Math.round(orig.cal) &&
          Math.round(comp.protein * 10) / 10 === Math.round(orig.protein * 10) / 10 &&
          Math.round(comp.carbs * 10) / 10 === Math.round(orig.carbs * 10) / 10 &&
          Math.round(comp.fat * 10) / 10 === Math.round(orig.fat * 10) / 10;
      }) ||
      !steps.every((step, i) => step === initialLoadedSteps.current[i]);

    setHasUnsavedChanges(hasUnsaved);
  }, [components, steps, recipe?.isLoggedView]);

  // Track step changes for logged meals
  useEffect(() => {
    if (r.isLoggedView && recipe?.steps && steps.length > 0) {
      const hasStepChanges = !recipe.steps.every((step, idx) => step === steps[idx]);
      if (hasStepChanges) setHasChanges(true);
    }
  }, [steps]);

  const getSubstitutions = (ingredientName) => {
    const lowerName = ingredientName.toLowerCase();
    for (const key in SUBSTITUTIONS) {
      if (lowerName.includes(key.toLowerCase())) {
        return SUBSTITUTIONS[key];
      }
    }
    return null;
  };

  // Check if current state matches original state
  const isCurrentStateModified = () => {
    // Check if components have changed
    if (components.length !== originalComponents.current.length) return true;
    for (let i = 0; i < components.length; i++) {
      if (components[i].name !== originalComponents.current[i].name) return true;
      if (Math.round(components[i].cal) !== Math.round(originalComponents.current[i].cal)) return true;
      if (Math.round(components[i].protein * 10) / 10 !== Math.round(originalComponents.current[i].protein * 10) / 10) return true;
      if (Math.round(components[i].carbs * 10) / 10 !== Math.round(originalComponents.current[i].carbs * 10) / 10) return true;
      if (Math.round(components[i].fat * 10) / 10 !== Math.round(originalComponents.current[i].fat * 10) / 10) return true;
    }

    // Check if steps have changed
    if (steps.length !== originalSteps.current.length) return true;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] !== originalSteps.current[i]) return true;
    }

    return false;
  };

  const getMacroValues = (name) => {
    // Try exact match first in MACRO_VALUES (case-insensitive)
    const lowerName = name.toLowerCase();
    const exactKey = Object.keys(MACRO_VALUES).find(key => key.toLowerCase() === lowerName);
    if (exactKey) return MACRO_VALUES[exactKey];

    // Try partial match in MACRO_VALUES: newName includes key or key includes newName
    const partialKey = Object.keys(MACRO_VALUES).find(
      key => lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)
    );
    if (partialKey) return MACRO_VALUES[partialKey];

    // Try exact match in FOOD_DATABASE
    const foodItem = FOOD_DATABASE.find(item => item.name.toLowerCase() === lowerName);
    if (foodItem) return { cal: foodItem.cal, protein: foodItem.protein, carbs: foodItem.carbs, fat: foodItem.fat };

    // Try partial match in FOOD_DATABASE
    const partialFood = FOOD_DATABASE.find(item =>
      lowerName.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(lowerName)
    );
    if (partialFood) return { cal: partialFood.cal, protein: partialFood.protein, carbs: partialFood.carbs, fat: partialFood.fat };

    // No match found
    return null;
  };

  // Cooking methods and prep instructions for different ingredients
  const COOKING_METHODS = {
    // Proteins
    "salmon": "Bake at 425°F for 12–14 minutes until it flakes easily with a fork.",
    "cod": "Bake at 425°F for 12–14 minutes until the fish flakes easily.",
    "chicken breast": "Air fry at 400°F for 18–22 minutes, flipping once halfway.",
    "chicken thigh": "Air fry at 400°F for 18–20 minutes, flipping once at 10 minutes.",
    "ground beef": "Brown in a skillet over medium-high heat for 5–6 minutes, breaking it apart. Drain excess fat.",
    "ground turkey": "Cook in a skillet over medium-high heat for 5–6 minutes, breaking apart until no pink remains.",
    "shrimp": "Cook in a hot pan for 2 minutes per side until pink and curled. Do not overcook.",
    "tuna": "Drain the can. No cooking needed.",
    "egg": "Crack into a bowl, whisk, cook in buttered pan over medium-low heat, stirring gently.",
    // Vegetables
    "baby spinach": "Heat a pan over medium with a small spray of oil. Add spinach and toss for 1–2 minutes until wilted. Season with salt.",
    "fresh spinach": "Heat a pan over medium with a small spray of oil. Add spinach and toss for 1–2 minutes until wilted. Season with salt.",
    "frozen spinach": "Microwave frozen spinach for 2 minutes. Squeeze out all excess water using a paper towel.",
    "broccoli": "Microwave the frozen broccoli bag for 4 minutes. Drain any water.",
    "green beans": "Microwave the green beans steam bag for 3 minutes.",
    "mixed veg": "Microwave the frozen vegetable bag for 3–4 minutes following package directions.",
    "edamame": "Microwave the frozen edamame bag for 3 minutes. Season with a pinch of salt.",
    "kale": "Heat a pan with a small spray of oil. Add kale and toss for 2–3 minutes until slightly wilted.",
    "asparagus": "Air fry at 400°F for 6–8 minutes, or roast in oven at 425°F for 10 minutes.",
    "zucchini": "Slice and air fry at 400°F for 8–10 minutes until golden.",
    "brussels sprouts": "Air fry at 400°F for 12–15 minutes, shaking halfway.",
    "cauliflower rice": "Microwave the frozen cauliflower rice bag for 4 minutes.",
    "sweet potato": "Microwave whole for 5–6 minutes until soft, or air fry cubes at 400°F for 15 minutes.",
    // Carbs
    "rice": "Microwave the rice pouch for 90 seconds.",
    "quinoa": "Cook quinoa per package directions (usually 2:1 water ratio, 15 minutes simmering) OR use a microwave quinoa pouch for 90 seconds.",
    "pasta": "Cook pasta in boiling salted water per package directions. Drain well.",
    "naan": "No cooking needed, or warm in air fryer at 350°F for 2 minutes.",
    "tortilla": "No cooking needed, or warm in a dry pan for 30 seconds per side.",
    // Sauces/Condiments
    "sauce": "No preparation needed — pour directly from the bottle.",
  };

  const getCookingMethod = (ingredientName) => {
    if (!ingredientName) return null;
    const lower = ingredientName.toLowerCase();

    // Check for exact matches first
    if (COOKING_METHODS[lower]) return COOKING_METHODS[lower];

    // Check for partial matches
    for (const key in COOKING_METHODS) {
      if (lower.includes(key)) {
        return COOKING_METHODS[key];
      }
    }

    return null;
  };

  const handleSwapComponent = (index, newName) => {
    // Update the component at this index
    const updatedComponents = [...components];
    const originalComponent = updatedComponents[index];
    const oldName = originalComponent.name;
    const newMacros = getMacroValues(newName);

    // Update component name and preserve userAdded status
    if (newMacros) {
      // If we found macros, calculate new values
      updatedComponents[index] = {
        ...originalComponent,
        name: newName,
        cal: Math.round(newMacros.cal * (originalComponent.grams / 100)),
        protein: Math.round((newMacros.protein * (originalComponent.grams / 100)) * 10) / 10,
        carbs: Math.round((newMacros.carbs * (originalComponent.grams / 100)) * 10) / 10,
        fat: Math.round((newMacros.fat * (originalComponent.grams / 100)) * 10) / 10,
        userAdded: originalComponent.userAdded || false,
      };
    } else {
      // If no macros found, just update the name but keep the original macros
      updatedComponents[index] = {
        ...originalComponent,
        name: newName,
        userAdded: originalComponent.userAdded || false,
      };
    }

    setComponents(updatedComponents);

    // Update steps to reflect ingredient name change
    const oldKeyword = extractKeyword(oldName);
    const newKeyword = extractKeyword(newName);

    if (oldKeyword && newKeyword && oldKeyword !== newKeyword) {
      const updatedSteps = [...steps];
      const flashedIndices = new Set();

      // STEP 1: Keyword replacement - replace old ingredient name with new ingredient name in steps
      const escapedKeyword = oldKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');

      updatedSteps.forEach((step, stepIndex) => {
        if (regex.test(step)) {
          // Reset regex internal pointer after test()
          regex.lastIndex = 0;
          // Replace old keyword with new keyword in a single pass
          updatedSteps[stepIndex] = step.replace(regex, newKeyword);
          flashedIndices.add(stepIndex);
        }
      });

      // STEP 2: Check if cooking method needs updating after keyword replacement
      const isFreshSpinach = newName.toLowerCase().includes("spinach, baby") ||
                              newName.toLowerCase().includes("baby spinach") ||
                              newName.toLowerCase().includes("fresh spinach");

      console.log('Checking cooking method for:', newName);
      console.log('Is fresh spinach:', isFreshSpinach);

      if (isFreshSpinach) {
        // Find steps that now contain spinach with microwave/steam cooking method (after keyword replacement)
        updatedSteps.forEach((step, stepIndex) => {
          const stepLower = step.toLowerCase();
          if (stepLower.includes("spinach") && (stepLower.includes("microwave") || stepLower.includes("steam"))) {
            // Replace the microwave/steam cooking instruction with sauté instruction
            updatedSteps[stepIndex] = "Heat a pan over medium with a small spray of olive oil. Add the fresh spinach and toss for 1–2 minutes until just wilted.";
            flashedIndices.add(stepIndex);
          }
        });
      }

      console.log('Updated steps:', updatedSteps);

      // Only update if we made changes
      if (flashedIndices.size > 0) {
        setSteps(updatedSteps);
        setUpdatedStepIndices(flashedIndices);

        // Clear the flash after 1 second
        if (stepFlashTimeoutRef.current) clearTimeout(stepFlashTimeoutRef.current);
        stepFlashTimeoutRef.current = setTimeout(() => {
          setUpdatedStepIndices(new Set());
        }, 1000);
      }
    }

    if (recipe?.isLoggedView) setHasUnsavedChanges(true);
    setUserHasModified(true);
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
      setUserHasModified(true);
      if (recipe?.isLoggedView) setHasUnsavedChanges(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingStepIndex(null);
    setEditingStepText('');
  };

  const handleStepCheck = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleRemoveComponent = (index) => {
    setRemovedComponentIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    setUserHasModified(true);
    if (recipe?.isLoggedView) setHasUnsavedChanges(true);
  };

  const handleGramChange = (index, newGramValue) => {
    const newGram = parseInt(newGramValue) || 0;
    if (newGram <= 0) return;

    const updatedComponents = [...components];
    const component = updatedComponents[index];
    const scaleFactor = newGram / component.grams;

    // Scale macros based on new gram amount
    updatedComponents[index] = {
      ...component,
      grams: newGram,
      cal: Math.round((component.cal / component.grams) * newGram),
      protein: Math.round(((component.protein || component.p || 0) / component.grams) * newGram * 10) / 10,
      carbs: Math.round(((component.carbs || component.c || 0) / component.grams) * newGram * 10) / 10,
      fat: Math.round(((component.fat || component.f || 0) / component.grams) * newGram * 10) / 10,
    };

    setComponents(updatedComponents);
    setEditingGramIndex(null);
    setUserHasModified(true);
    if (recipe?.isLoggedView) setHasUnsavedChanges(true);
  };

  const isEggComponent = (componentName, weighRaw) => {
    const lowerName = componentName.toLowerCase();
    // Only whole eggs show count display, not egg whites or egg products
    const isWholeEgg = lowerName.includes('whole egg');
    const isNotEggWhiteOrProduct = !lowerName.includes('egg white') &&
                                    !lowerName.includes('liquid egg') &&
                                    !lowerName.includes('egg substitute');
    return isWholeEgg && isNotEggWhiteOrProduct && weighRaw === false;
  };

  const handleEggCountChange = (index, newCount) => {
    const count = parseInt(newCount) || 1;
    if (count <= 0) return;

    const newGrams = count * 50; // One large egg ≈ 50g
    const updatedComponents = [...components];
    const component = updatedComponents[index];

    // Scale macros based on new gram amount
    updatedComponents[index] = {
      ...component,
      grams: newGrams,
      cal: Math.round((component.cal / component.grams) * newGrams),
      protein: Math.round(((component.protein || component.p || 0) / component.grams) * newGrams * 10) / 10,
      carbs: Math.round(((component.carbs || component.c || 0) / component.grams) * newGrams * 10) / 10,
      fat: Math.round(((component.fat || component.f || 0) / component.grams) * newGrams * 10) / 10,
    };

    setComponents(updatedComponents);
    setEditingGramIndex(null);
    setUserHasModified(true);
    if (recipe?.isLoggedView) setHasUnsavedChanges(true);
  };

  const shouldShowRawSuffix = (componentName, weighRaw, componentType) => {
    if (!weighRaw) return false;
    if (componentName.toLowerCase().includes('egg')) return false;
    if (componentType === 'Sauce' || componentType === 'Seasoning' || componentType === 'Veg/Sauce') return false;
    return true;
  };

  const handleReset = () => {
    if (!resetConfirming) {
      // First click - enter confirmation state
      setResetConfirming(true);
      // Auto-revert after 3 seconds
      if (resetConfirmTimeoutRef.current) clearTimeout(resetConfirmTimeoutRef.current);
      resetConfirmTimeoutRef.current = setTimeout(() => {
        setResetConfirming(false);
      }, 3000);
    } else {
      // Second click - confirm reset
      setComponents([...originalComponents.current]);
      setSteps([...originalSteps.current]);
      setRecipeName(originalName.current);
      setRemovedComponentIndices(new Set()); // Clear removed components
      setResetConfirming(false);
      setUserHasModified(false);
      if (resetConfirmTimeoutRef.current) clearTimeout(resetConfirmTimeoutRef.current);
      // If in logged view, ensure Save Changes button appears
      if (recipe?.isLoggedView) setHasUnsavedChanges(true);
    }
  };

  const handleMoveStepUp = (index) => {
    if (index > 0) {
      const updatedSteps = [...steps];
      [updatedSteps[index - 1], updatedSteps[index]] = [updatedSteps[index], updatedSteps[index - 1]];
      setSteps(updatedSteps);
      setUserHasModified(true);
      if (recipe?.isLoggedView) setHasUnsavedChanges(true);
    }
  };

  const handleMoveStepDown = (index) => {
    if (index < steps.length - 1) {
      const updatedSteps = [...steps];
      [updatedSteps[index], updatedSteps[index + 1]] = [updatedSteps[index + 1], updatedSteps[index]];
      setSteps(updatedSteps);
      setUserHasModified(true);
      if (recipe?.isLoggedView) setHasUnsavedChanges(true);
    }
  };

  // Search USDA FoodData Central API with debouncing
  const searchUSDAFoods = async (query, componentType = null) => {
    if (query.length < 3) {
      setUsdaResults([]);
      setUsdaError(null);
      return;
    }

    setUsdaLoading(true);
    setUsdaError(null);

    try {
      const apiKey = import.meta.env.VITE_USDA_API_KEY;
      const isProteinType = componentType === "Protein";
      const searchQuery = (isProteinType && !query.includes("raw")) ? query + ", raw" : query;
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchQuery)}&dataType=Foundation,SR%20Legacy&pageSize=20&api_key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Filter out Branded foods - only use Foundation and SR Legacy
      const filteredFoods = (data.foods || []).filter(food =>
        food.dataType === "Foundation" || food.dataType === "SR Legacy"
      );

      // Parse food results
      let foods = filteredFoods.map((food) => {
        const getNutrientValue = (nutrientName) => {
          const nutrient = food.foodNutrients?.find(n =>
            n.nutrientName && n.nutrientName.includes(nutrientName) && n.value !== null
          );
          return nutrient ? { value: nutrient?.value ?? 0, unit: nutrient?.unitName } : { value: 0, unit: null };
        };

        const energyData = getNutrientValue("Energy");
        const proteinData = getNutrientValue("Protein");
        const carbData = getNutrientValue("Carbohydrate");
        const fatData = getNutrientValue("Total lipid");

        // Convert kJ to kcal if needed
        let energyValue = energyData.value;
        if (energyData.unit && energyData.unit.toLowerCase().includes("kj")) {
          energyValue = energyValue / 4.184;
        }

        const proteinValue = proteinData.value;
        const carbValue = carbData.value;
        const fatValue = fatData.value;

        return {
          name: food.description || "Unknown",
          cal: Math.round(energyValue),
          protein: Math.round(proteinValue * 10) / 10,
          carbs: Math.round(carbValue * 10) / 10,
          fat: Math.round(fatValue * 10) / 10,
        };
      });

      // Filter based on component type
      let resultsToShow = foods;
      if (isProteinType) {
        const cookedKeywords = ["cooked", "broiled", "baked", "fried", "roasted", "grilled", "dried", "frozen, pasteurized"];
        const rawFoods = foods.filter(food => {
          const desc = food.name.toLowerCase();
          return !cookedKeywords.some(keyword => desc.includes(keyword));
        });
        resultsToShow = rawFoods.length > 0 ? rawFoods : foods;
        if (foods.length > 0 && rawFoods.length === 0) {
          setUsdaError("Showing all options — select raw where possible");
        }
      }

      setUsdaResults(resultsToShow.slice(0, 5));
    } catch (err) {
      console.error("USDA API error:", err);
      setUsdaError("Search unavailable — try a preset above");
      setUsdaResults([]);
    } finally {
      setUsdaLoading(false);
    }
  };

  // Debounced USDA search
  const handleUSDASearch = (query, componentType = null) => {
    if (usdaDebounceRef.current) clearTimeout(usdaDebounceRef.current);

    if (query.length < 3) {
      setUsdaResults([]);
      setUsdaError(null);
      return;
    }

    setUsdaLoading(true);
    usdaDebounceRef.current = setTimeout(() => {
      searchUSDAFoods(query, componentType);
    }, 500);
  };

  if (!recipe) return null;
  const r = recipe;

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in");
        setSaving(false);
        return;
      }

      const updateData = {
        recipe_name: recipeName,
        cal: Math.round(macros.cal),
        protein: Math.round(macros.protein),
        carbs: Math.round(macros.carbs),
        fat: Math.round(macros.fat),
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
          emoji: r.emoji,
          method: r.method,
          activeTime: r.activeTime,
          originalData: {
            components: originalComponents.current.map(comp => ({
              ...comp,
              cal: Math.round(comp.cal),
              protein: Math.round(comp.protein),
              carbs: Math.round(comp.carbs),
              fat: Math.round(comp.fat),
            })),
            steps: originalSteps.current,
            name: originalName.current,
          },
        }),
      };

      // Await the update fully
      const { error: updateError } = await supabase
        .from('meal_logs')
        .update(updateData)
        .eq('id', r.logId);

      // Check error before proceeding
      if (updateError) {
        setError("Failed to save changes: " + updateError.message);
        setSaving(false);
      } else {
        setHasChanges(false);

        // Call onSave after confirming update succeeded
        if (onSave) {
          onSave();
        }

        // Wait 800ms to give refresh time to complete
        await new Promise(resolve => setTimeout(resolve, 800));

        setSaving(false);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to save changes");
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (recipe?.isLoggedView && hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Close without saving?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

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
          recipe_name: recipeName,
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
            emoji: r.emoji,
            method: r.method,
            activeTime: r.activeTime,
            originalData: {
              components: originalComponents.current.map(comp => ({
                ...comp,
                cal: Math.round(comp.cal),
                protein: Math.round(comp.protein),
                carbs: Math.round(comp.carbs),
                fat: Math.round(comp.fat),
              })),
              steps: originalSteps.current,
              name: originalName.current,
            },
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
          <div style={{flex: 1}}>
            <div style={{fontSize: 32, marginBottom: 4}}>{r.emoji}</div>
            <div style={{fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 2}}>
              {recipeName.includes(" (Modified)") ? (
                <>
                  <span style={{color: "var(--cream)"}}>
                    {recipeName.split(" (Modified)")[0]}
                  </span>
                  <span style={{color: "var(--lime)", fontSize: "0.8em", fontStyle: "italic", marginLeft: 4}}>
                    (Modified)
                  </span>
                </>
              ) : (
                <span style={{color: "var(--cream)"}}>{recipeName}</span>
              )}
            </div>
            {r.spiceLevel > 0 && (
              <div style={{fontSize: 14, marginBottom: 4}}>
                {SPICE_LEVELS[r.spiceLevel].display} {SPICE_LEVELS[r.spiceLevel].label}
              </div>
            )}
            {!r.isLogged && !r.isLoggedView && r.method && (r.activeTime || r.activeMinutes) && r.stepCount && (
              <div style={{fontSize: 12, color: "var(--muted)", marginTop: 4}}>
                {r.method} · {r.activeTime || r.activeMinutes} min active · {r.stepCount} steps
              </div>
            )}
            {r.isLoggedView && r.method && (
              <div style={{fontSize: 12, color: "var(--muted)", marginTop: 4}}>
                {r.method}
              </div>
            )}
          </div>
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8}}>
            {toggleFavorite && (
              <div onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}>
                <StarIcon filled={isFavorited && isFavorited(r.id)} size={24} />
              </div>
            )}
            {r.isLoggedView && hasUnsavedChanges && (
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                style={{
                  background: "var(--lime)",
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  opacity: saving ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
            {userHasModified && r.hasResetButton !== false && (
              <button
                onClick={handleReset}
                style={{
                  background: resetConfirming ? "rgba(255, 77, 77, 0.2)" : "transparent",
                  border: "1px solid rgba(255, 77, 77, 0.5)",
                  color: resetConfirming ? "#ff4d4d" : "var(--muted)",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  transition: "all 0.15s",
                }}
              >
                {resetConfirming ? "Are you sure? Tap to confirm" : "↻ Reset to Default"}
              </button>
            )}
            <button onClick={handleClose} style={{background: "var(--s3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13}}>✕ Close</button>
          </div>
        </div>

        {/* Macros */}
        <div style={{marginBottom: 16}}>
          <div style={{background: "var(--s2)", borderRadius: 14, padding: 14, marginBottom: 8, border: "1px solid var(--border)"}}>
            <div style={{display: "flex", justifyContent: "space-around"}}>
              {[["cal", Math.round(macros.cal), "var(--orange)"],["protein", Math.round(macros.protein*10)/10 + "g", "var(--lime)"],
                ["carbs", Math.round(macros.carbs*10)/10 + "g", "var(--blue)"],["fat", Math.round(macros.fat*10)/10 + "g", "var(--muted)"]].map(([l,v,c]) => (
                <div key={l} style={{textAlign: "center"}}>
                  <div style={{fontSize: 22, fontWeight: 700, color: c, fontFamily: "'Clash Display',sans-serif"}}>{v}</div>
                  <div style={{fontSize: 10, color: "var(--muted)"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{fontSize: 11, color: "var(--muted)", textAlign: "center"}}>
            Macros are estimates based on USDA data. Actual values may vary.
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
              const isRemoved = removedComponentIndices.has(i);
              const substitutions = getSubstitutions(c.name);
              return (
                <div key={i} style={{opacity: isRemoved ? 0.4 : 1, transition: "opacity 0.15s"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid var(--border)"}}>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: 13, fontWeight: 600, color: c.userAdded ? "var(--lime)" : "var(--cream)", marginBottom: 4}}>{c.name}</div>
                      <div style={{display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap"}}>
                        <span style={{fontSize: 11, color: "var(--muted)"}}>{c.type}</span>
                        {isEggComponent(c.name, c.weighRaw) ? (
                          <div style={{display: "flex", alignItems: "center", gap: 4}}>
                            <span style={{fontSize: 11}}>🥚</span>
                            {editingGramIndex === i ? (
                              <input
                                type="number"
                                className="goals-modal-input"
                                value={editingGramValue}
                                onChange={(e) => setEditingGramValue(e.target.value)}
                                onBlur={() => handleEggCountChange(i, editingGramValue || Math.round(c.grams / 50))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEggCountChange(i, editingGramValue || Math.round(c.grams / 50));
                                }}
                                autoFocus
                                style={{width: 40, textAlign: "center", fontSize: 11}}
                              />
                            ) : (
                              <span
                                onClick={() => {
                                  setEditingGramIndex(i);
                                  setEditingGramValue(Math.round(c.grams / 50).toString());
                                }}
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: "var(--lime)",
                                  border: "1px solid var(--lime)",
                                  borderRadius: 6,
                                  padding: "2px 6px",
                                  backgroundColor: "rgba(0, 255, 100, 0.05)",
                                  cursor: "pointer",
                                  minWidth: 30,
                                  textAlign: "center",
                                }}
                              >
                                {Math.round(c.grams / 50)}
                              </span>
                            )}
                            <span style={{fontSize: 11, color: "var(--muted)"}}>eggs</span>
                          </div>
                        ) : (
                          <div style={{display: "flex", alignItems: "center", gap: 4}}>
                            <span style={{fontSize: 11}}>⚖️</span>
                            {editingGramIndex === i ? (
                              <input
                                type="number"
                                className="goals-modal-input"
                                value={editingGramValue}
                                onChange={(e) => setEditingGramValue(e.target.value)}
                                onBlur={() => handleGramChange(i, editingGramValue || c.grams)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleGramChange(i, editingGramValue || c.grams);
                                }}
                                autoFocus
                                style={{width: 60, textAlign: "center", fontSize: 11}}
                              />
                            ) : (
                              <span
                                onClick={() => {
                                  setEditingGramIndex(i);
                                  setEditingGramValue(c.grams.toString());
                                }}
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: "var(--lime)",
                                  border: "1px solid var(--lime)",
                                  borderRadius: 6,
                                  padding: "2px 6px",
                                  backgroundColor: "rgba(0, 255, 100, 0.05)",
                                  cursor: "pointer",
                                  minWidth: 40,
                                  textAlign: "center",
                                }}
                              >
                                {c.grams}
                              </span>
                            )}
                            <span style={{fontSize: 11, color: "var(--muted)"}}>g{shouldShowRawSuffix(c.name, c.weighRaw, c.type) ? " raw" : ""}</span>
                          </div>
                        )}
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: c.userAdded ? "var(--lime)" : "var(--muted)",
                          border: `1px solid ${c.userAdded ? "var(--lime)" : "var(--border)"}`,
                          borderRadius: 12,
                          padding: "2px 8px",
                          backgroundColor: c.userAdded ? "rgba(0, 255, 100, 0.05)" : "transparent",
                        }}>
                          {c.userAdded ? "✓ Your ingredient" : "staple"}
                        </span>
                      </div>
                    </div>
                    <div style={{display: "flex", gap: 12, alignItems: "flex-start", flexDirection: "column"}}>
                      <div style={{textAlign: "right", fontSize: 12, color: "var(--muted)"}}>
                        <div style={{color: "var(--orange)", fontWeight: 600}}>{Math.round(c.cal)} cal</div>
                        <div>{Math.round(((c.protein ?? c.p) || 0)*10)/10}g P</div>
                      </div>
                      <div style={{display: "flex", gap: 8}}>
                        <button
                          onClick={() => setExpandedSwap(expandedSwap === i ? null : i)}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--muted)",
                            borderRadius: 6,
                            padding: "4px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                            opacity: isRemoved ? 0.4 : 1,
                          }}
                          disabled={isRemoved}
                          onMouseEnter={(e) => {
                            if (!isRemoved) {
                              e.target.style.borderColor = "var(--lime)";
                              e.target.style.color = "var(--lime)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = "var(--border)";
                            e.target.style.color = "var(--muted)";
                          }}
                        >
                          Swap
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveComponent(i);
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: isRemoved ? "var(--lime)" : "var(--muted)",
                            borderRadius: 6,
                            padding: "4px 8px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                            borderColor: isRemoved ? "var(--lime)" : "var(--border)",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = "var(--lime)";
                            e.target.style.color = "var(--lime)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = isRemoved ? "var(--lime)" : "var(--border)";
                            e.target.style.color = isRemoved ? "var(--lime)" : "var(--muted)";
                          }}
                          title={isRemoved ? "Click to restore" : "Click to remove"}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Substitution Panel */}
                  {expandedSwap === i && (
                    <div style={{padding: "8px 0 12px 0", borderBottom: "1px solid var(--border)"}}>
                      {substitutions && (
                        <>
                          <div style={{fontSize: 10, color: "var(--muted)", marginBottom: 8}}>Alternatives:</div>
                          <div style={{display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12}}>
                            {substitutions.map((sub, j) => (
                              <button
                                key={j}
                                onClick={() => {
                                  handleSwapComponent(i, sub);
                                  setSearchQuery("");
                                  setSearchComponentIndex(null);
                                }}
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
                        </>
                      )}

                      {/* Custom Ingredient Search */}
                      <div style={{marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--s3)"}}>
                        <div style={{display: "flex", gap: 8, marginBottom: 8}}>
                          <input
                            type="text"
                            placeholder="Search 300,000+ foods..."
                            value={searchComponentIndex === i ? searchQuery : ""}
                            onChange={(e) => {
                              setSearchComponentIndex(i);
                              setSearchQuery(e.target.value);
                              handleUSDASearch(e.target.value, c.type);
                            }}
                            onFocus={() => setSearchComponentIndex(i)}
                            style={{
                              flex: 1,
                              background: "var(--s2)",
                              border: "1px solid var(--border)",
                              borderRadius: 8,
                              padding: "6px 10px",
                              color: "var(--cream)",
                              fontSize: 12,
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              outline: "none",
                              transition: "border-color 0.15s",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "var(--lime)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "var(--border)";
                            }}
                          />
                          <span style={{fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center"}}>
                            {usdaLoading && searchComponentIndex === i ? "⏳" : "🔍"}
                          </span>
                        </div>

                        {/* Search Results or Messages */}
                        {searchComponentIndex === i && searchQuery && (
                          <div>
                            {usdaError && (
                              <div style={{fontSize: 11, color: "var(--muted)", marginBottom: 8}}>
                                {usdaError}
                              </div>
                            )}
                            {usdaResults.length === 0 && !usdaLoading && !usdaError && (
                              <div style={{fontSize: 11, color: "var(--muted)", marginBottom: 8}}>
                                No results found for that ingredient
                              </div>
                            )}
                            {usdaResults.length > 0 && (
                              <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                                {usdaResults.map((item, j) => (
                                  <button
                                    key={j}
                                    onClick={() => {
                                      const updatedComponents = [...components];
                                      const originalComponent = updatedComponents[i];
                                      const newMacros = { cal: item.cal, protein: item.protein, carbs: item.carbs, fat: item.fat };
                                      const scaleFactor = originalComponent.grams / 100;
                                      const calcCal = newMacros.cal * scaleFactor;

                                      updatedComponents[i] = {
                                        ...originalComponent,
                                        name: item.name,
                                        cal: Math.round(calcCal),
                                        protein: Math.round((newMacros.protein * scaleFactor) * 10) / 10,
                                        carbs: Math.round((newMacros.carbs * scaleFactor) * 10) / 10,
                                        fat: Math.round((newMacros.fat * scaleFactor) * 10) / 10,
                                      };
                                      setComponents(updatedComponents);
                                      if (recipe?.isLoggedView) setHasUnsavedChanges(true);
                                      setSearchQuery("");
                                      setSearchComponentIndex(null);
                                      setUsdaResults([]);
                                    }}
                                    style={{
                                      background: "var(--s3)",
                                      border: "1px solid var(--border)",
                                      color: "var(--muted)",
                                      borderRadius: 20,
                                      padding: "6px 12px",
                                      fontSize: 11,
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      transition: "all 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = "var(--muted)";
                                      e.target.style.color = "var(--bg)";
                                      e.target.style.borderColor = "var(--muted)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = "var(--s3)";
                                      e.target.style.color = "var(--muted)";
                                      e.target.style.borderColor = "var(--border)";
                                    }}
                                  >
                                    <div>{item.name}</div>
                                    <div style={{fontSize: 10, color: "var(--muted)"}}>
                                      {item.cal} cal · {item.protein}g P
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                  background: updatedStepIndices.has(i) ? "var(--lime)" : "transparent",
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
                        color: updatedStepIndices.has(i) ? "#000" : "var(--muted)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "2px 6px",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => e.target.style.color = updatedStepIndices.has(i) ? "#333" : "var(--lime)"}
                      onMouseLeave={(e) => e.target.style.color = updatedStepIndices.has(i) ? "#000" : "var(--muted)"}
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
                        color: updatedStepIndices.has(i) ? "#000" : "var(--muted)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "2px 6px",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => e.target.style.color = updatedStepIndices.has(i) ? "#333" : "var(--lime)"}
                      onMouseLeave={(e) => e.target.style.color = updatedStepIndices.has(i) ? "#000" : "var(--muted)"}
                    >
                      ▼
                    </button>
                  )}
                </div>
                <div style={{width: 24, height: 24, minWidth: 24, background: updatedStepIndices.has(i) ? "#000" : "var(--lime)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: updatedStepIndices.has(i) ? "var(--lime)" : "#000"}}>{i+1}</div>
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
                    <div style={{display: "flex", gap: 8, justifyContent: "space-between", alignItems: "flex-start", width: "100%"}}>
                      <div style={{display: "flex", gap: 8, alignItems: "flex-start", flex: 1}}>
                        <input
                          type="checkbox"
                          checked={completedSteps[i] || false}
                          onChange={() => handleStepCheck(i)}
                          style={{
                            cursor: "pointer",
                            marginTop: "2px",
                            width: "18px",
                            height: "18px",
                            minWidth: "18px",
                          }}
                        />
                        <div style={{
                          fontSize: 13,
                          color: completedSteps[i] ? "var(--muted)" : (updatedStepIndices.has(i) ? "#000" : "var(--cream)"),
                          lineHeight: 1.5,
                          textDecoration: completedSteps[i] ? "line-through" : "none",
                          opacity: completedSteps[i] ? 0.6 : 1,
                          transition: "all 0.15s",
                        }}>
                          {s}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditStep(i)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: updatedStepIndices.has(i) ? "#000" : "var(--muted)",
                          fontSize: 14,
                          cursor: "pointer",
                          padding: "2px 6px",
                          marginLeft: 8,
                        }}
                        onMouseEnter={(e) => e.target.style.color = updatedStepIndices.has(i) ? "#333" : "var(--lime)"}
                        onMouseLeave={(e) => e.target.style.color = updatedStepIndices.has(i) ? "#000" : "var(--muted)"}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {Object.keys(completedSteps).length > 0 && (
              <button
                onClick={() => setCompletedSteps({})}
                style={{
                  marginTop: 8,
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
                Clear All Steps
              </button>
            )}
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

        {/* Removed Components Info */}
        {removedComponentIndices.size > 0 && (
          <div style={{marginBottom: 16, padding: 12, background: "rgba(255, 200, 0, 0.05)", border: "1px solid rgba(255, 200, 0, 0.2)", borderRadius: 8}}>
            <div style={{fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8}}>
              Removed: {Array.from(removedComponentIndices).map(i => components[i]?.name || "Unknown").join(", ")}
            </div>
            <button
              onClick={() => setRemovedComponentIndices(new Set())}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 200, 0, 0.3)",
                color: "var(--muted)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "var(--lime)";
                e.target.style.color = "var(--lime)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "rgba(255, 200, 0, 0.3)";
                e.target.style.color = "var(--muted)";
              }}
            >
              Restore All
            </button>
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
