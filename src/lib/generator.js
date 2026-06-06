import { EZ, RECIPES, BANNED } from '../data/recipes.js';

export const SPICE_LEVELS = {
  0: { label: "No Heat", display: "–" },
  1: { label: "Mild", display: "🌶️" },
  2: { label: "Medium", display: "🌶️🌶️" },
  3: { label: "Hot", display: "🌶️🌶️🌶️" },
  4: { label: "Extra Hot", display: "🌶️🌶️🌶️🌶️" },
};

// USDA verified macros per 100g
const USDA_MACROS = {
  "ground turkey (93% lean)": { cal: 149, protein: 19.0, carbs: 0, fat: 8.3 },
  "chicken thighs (boneless, skinless)": { cal: 119, protein: 19.0, carbs: 0, fat: 4.3 },
  "chicken breast (boneless, skinless)": { cal: 110, protein: 23.0, carbs: 0, fat: 1.2 },
  "ground beef (93% lean)": { cal: 137, protein: 21.0, carbs: 0, fat: 5.5 },
  "salmon fillet": { cal: 142, protein: 19.8, carbs: 0, fat: 6.3 },
  "cod fillet": { cal: 82, protein: 17.8, carbs: 0, fat: 0.7 },
  "shrimp (raw)": { cal: 85, protein: 20.1, carbs: 0.9, fat: 0.5 },
  "egg whites (liquid)": { cal: 52, protein: 10.9, carbs: 0.7, fat: 0.2 },
  "whole egg": { cal: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  "white rice (cooked)": { cal: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
  "brown rice (cooked)": { cal: 112, protein: 2.6, carbs: 23.5, fat: 0.9 },
  "frozen broccoli": { cal: 35, protein: 2.8, carbs: 5.1, fat: 0.4 },
  "frozen green beans": { cal: 31, protein: 1.8, carbs: 7.1, fat: 0.1 },
  "frozen spinach": { cal: 23, protein: 2.9, carbs: 2.7, fat: 0.4 },
  "frozen mixed veg": { cal: 65, protein: 3.2, carbs: 13.0, fat: 0.4 },
  "olive oil": { cal: 884, protein: 0, carbs: 0, fat: 100 },
  "canned diced tomatoes": { cal: 24, protein: 1.1, carbs: 5.1, fat: 0.1 },
  "garlic herb seasoning": { cal: 325, protein: 12.7, carbs: 64.5, fat: 4.3 },
  "taco seasoning": { cal: 290, protein: 8.5, carbs: 54.3, fat: 6.4 },
  "teriyaki sauce": { cal: 89, protein: 5.2, carbs: 16.0, fat: 0.5 },
  "sriracha": { cal: 93, protein: 3.7, carbs: 17.8, fat: 0.9 },
  "soy sauce": { cal: 53, protein: 8.1, carbs: 4.9, fat: 0.6 },
  "honey": { cal: 304, protein: 0.3, carbs: 82.4, fat: 0 },
  "garlic powder": { cal: 331, protein: 16.6, carbs: 72.7, fat: 0.7 },
  "red pepper flakes": { cal: 314, protein: 12.0, carbs: 56.6, fat: 8.8 },
  "cayenne pepper": { cal: 318, protein: 12.0, carbs: 56.6, fat: 17.3 },
  "lemon pepper seasoning": { cal: 233, protein: 8.7, carbs: 41.5, fat: 5.4 },
};

// GROUND PROTEIN RECIPE POOLS
const GROUND_BEEF_RECIPES = {
  "Asian-Inspired,Skillet": [92],
  "BBQ,Skillet": [93],
  "Saucy,Skillet": [94],
  "Spicy,Skillet": [95],
  "Italian-Inspired,Skillet": [96],
  "Neutral,Skillet": [92, 99],
  "All": [92, 93, 94, 95, 96, 97, 98, 99],
};

const GROUND_CHICKEN_RECIPES = {
  "Asian-Inspired,Skillet": [100],
  "BBQ,Skillet": [101],
  "Saucy,Skillet": [102],
  "Spicy,Skillet": [103],
  "Italian-Inspired,Skillet": [104],
  "Neutral,Skillet": [100, 107],
  "All": [100, 101, 102, 103, 104, 105, 106, 107],
};

const GROUND_PORK_RECIPES = {
  "Asian-Inspired,Skillet": [108],
  "BBQ,Skillet": [109],
  "Saucy,Skillet": [110],
  "Spicy,Skillet": [111],
  "Italian-Inspired,Skillet": [112],
  "Neutral,Skillet": [108, 115],
  "All": [108, 109, 110, 111, 112, 113, 114, 115],
};

const GROUND_TURKEY_RECIPES = {
  "Asian-Inspired,Skillet": [116],
  "BBQ,Skillet": [117],
  "Saucy,Skillet": [118],
  "Spicy,Skillet": [119],
  "Italian-Inspired,Skillet": [120],
  "Neutral,Skillet": [116, 123],
  "All": [116, 117, 118, 119, 120, 121, 122, 123],
};

// Helper function to pick recipes from a pool based on flavor and method
function pickRecipesByFlavorAndMethod(proteinType, flavorTags, cookMethod) {
  const poolMap = {
    beef: GROUND_BEEF_RECIPES,
    chicken: GROUND_CHICKEN_RECIPES,
    pork: GROUND_PORK_RECIPES,
    turkey: GROUND_TURKEY_RECIPES,
  };

  const pool = poolMap[proteinType];
  if (!pool) return [];

  // Build flavor key based on flavorTags
  let flavorKey = flavorTags.length > 0 ? flavorTags[0] : "Neutral";
  if (flavorTags.includes("Saucy") && flavorTags.includes("Spicy")) {
    flavorKey = "Saucy,Spicy";
  } else if (flavorTags.includes("Saucy") && flavorTags.includes("Asian-Inspired")) {
    flavorKey = "Saucy,Asian-Inspired";
  } else if (flavorTags.includes("Saucy")) {
    flavorKey = "Saucy";
  } else if (flavorTags.includes("Spicy")) {
    flavorKey = "Spicy";
  } else if (flavorTags.includes("Asian-Inspired")) {
    flavorKey = "Asian-Inspired";
  } else if (flavorTags.includes("BBQ")) {
    flavorKey = "BBQ";
  } else if (flavorTags.includes("Italian-Inspired")) {
    flavorKey = "Italian-Inspired";
  } else {
    flavorKey = "Neutral";
  }

  // Build composite key with method
  const methodPart = cookMethod && cookMethod !== "Any" ? cookMethod : "Skillet";
  const compositeKey = `${flavorKey},${methodPart}`;

  // Try exact match first, then fallback to flavor only, then all
  return pool[compositeKey] || pool[flavorKey] || pool["All"] || [];
}

// Fallback macro values for missing ingredients
const FALLBACK_MACROS = {
  seasoning: { cal: 8, protein: 0, carbs: 1, fat: 0 },
  veg: { cal: 35, protein: 2, carbs: 6, fat: 0 },
  sauce: { cal: 20, protein: 1, carbs: 3, fat: 0 },
};

// Helper function to get macros from USDA table with fallback
function getUsdaMacros(ingredientName) {
  const key = ingredientName.toLowerCase();
  const macros = USDA_MACROS[key];

  if (!macros) {
    // Use fallback based on ingredient type
    const nameLower = ingredientName.toLowerCase();
    if (nameLower.includes("seasoning") || nameLower.includes("pepper") || nameLower.includes("garlic")) {
      console.warn(`USDA lookup fallback for: ${ingredientName} (seasoning)`);
      return FALLBACK_MACROS.seasoning;
    } else if (nameLower.includes("frozen") || nameLower.includes("broccoli") || nameLower.includes("spinach") || nameLower.includes("bean") || nameLower.includes("veg")) {
      console.warn(`USDA lookup fallback for: ${ingredientName} (veg)`);
      return FALLBACK_MACROS.veg;
    } else if (nameLower.includes("sauce") || nameLower.includes("ponzu") || nameLower.includes("marinara")) {
      console.warn(`USDA lookup fallback for: ${ingredientName} (sauce)`);
      return FALLBACK_MACROS.sauce;
    }
  }

  return macros;
}

// Helper function to create seasoning components with fixed macro values
function createSeasoningComponent(name, grams) {
  return {
    name,
    type: "Seasoning",
    grams,
    cal: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    weighRaw: false
  };
}

// Helper function to calculate component macros with proper rounding
function calcComponentMacros(usdaMacros, grams) {
  if (!usdaMacros) return null;
  return {
    cal: Math.round((usdaMacros.cal / 100) * grams),
    protein: Math.round((usdaMacros.protein / 100) * grams * 10) / 10,
    carbs: Math.round((usdaMacros.carbs / 100) * grams * 10) / 10,
    fat: Math.round((usdaMacros.fat / 100) * grams * 10) / 10,
  };
}

// Helper function to split combined sauce/seasoning components into individual components
function splitCombinedIngredient(combinedName) {
  const splits = {
    "Soy+Sriracha+Garlic+Honey": [
      {name:"Soy Sauce",type:"Sauce",grams:10,...calcComponentMacros(getUsdaMacros("Soy Sauce"),10),weighRaw:false},
      {name:"Sriracha",type:"Sauce",grams:5,...calcComponentMacros(getUsdaMacros("Sriracha"),5),weighRaw:false},
      createSeasoningComponent("Garlic Powder", 1),
      createSeasoningComponent("Honey", 5),
    ],
    "Sriracha+Soy (heavy)": [
      {name:"Sriracha",type:"Sauce",grams:15,...calcComponentMacros(getUsdaMacros("Sriracha"),15),weighRaw:false},
      {name:"Soy Sauce",type:"Sauce",grams:15,...calcComponentMacros(getUsdaMacros("Soy Sauce"),15),weighRaw:false},
    ],
    "Sriracha+Soy+Garlic+Honey (heavy)": [
      {name:"Sriracha",type:"Sauce",grams:15,...calcComponentMacros(getUsdaMacros("Sriracha"),15),weighRaw:false},
      {name:"Soy Sauce",type:"Sauce",grams:15,...calcComponentMacros(getUsdaMacros("Soy Sauce"),15),weighRaw:false},
      createSeasoningComponent("Garlic Powder", 1),
      createSeasoningComponent("Honey", 5),
    ],
    "Sriracha+Soy Sauce": [
      {name:"Sriracha",type:"Sauce",grams:10,...calcComponentMacros(getUsdaMacros("Sriracha"),10),weighRaw:false},
      {name:"Soy Sauce",type:"Sauce",grams:10,...calcComponentMacros(getUsdaMacros("Soy Sauce"),10),weighRaw:false},
    ],
    "Olive Oil+Lemon Pepper": [
      {name:"Olive Oil",type:"Fat",grams:4,...calcComponentMacros(getUsdaMacros("Olive Oil"),4),weighRaw:false},
      createSeasoningComponent("Lemon Pepper Seasoning", 2),
    ],
    "Ponzu+Honey": [
      {name:"Ponzu Sauce",type:"Sauce",grams:15,...calcComponentMacros(getUsdaMacros("Soy Sauce"),15),weighRaw:false},
      createSeasoningComponent("Honey", 5),
    ],
    "Ponzu+Soy (heavy)": [
      {name:"Ponzu Sauce",type:"Sauce",grams:20,...calcComponentMacros(getUsdaMacros("Soy Sauce"),20),weighRaw:false},
      {name:"Soy Sauce",type:"Sauce",grams:10,...calcComponentMacros(getUsdaMacros("Soy Sauce"),10),weighRaw:false},
    ],
  };

  // If not a combined ingredient, treat it as a single seasoning component
  if (!splits[combinedName]) {
    return [createSeasoningComponent(combinedName, 1)];
  }

  return splits[combinedName];
}

export function classifyIngredient(name) {
  const n = name.toLowerCase();
  if (/chicken|beef|turkey|salmon|cod|tuna|shrimp|egg|pork|tofu|fish/.test(n)) return "protein";
  if (/rice|pasta|bread|potato|quinoa|oat|bean|lentil|tortilla|noodle/.test(n)) return "carb";
  if (/broccoli|green bean|spinach|pepper|tomato|onion|zucchini|carrot|edamame|kale|veg|vegetable/.test(n)) return "veg";
  return "other";
}

// Helper function to provide appropriate prep instructions based on ingredient type and name
function getIngredientPrepNote(ingredientName) {
  if (!ingredientName) return "";
  const lower = ingredientName.toLowerCase();

  // Proteins
  if (lower.includes("salmon")) return "Bake at 425°F for 12–14 minutes until it flakes easily with a fork.";
  if (lower.includes("cod")) return "Bake at 425°F for 12–14 minutes until the fish flakes easily.";
  if (lower.includes("chicken breast")) return "Air fry at 400°F for 18–22 minutes, flipping once halfway.";
  if (lower.includes("chicken thigh")) return "Air fry at 400°F for 18–20 minutes, flipping once at 10 minutes.";
  if (lower.includes("ground beef")) return "Brown in a skillet over medium-high heat for 5–6 minutes, breaking it apart. Drain excess fat.";
  if (lower.includes("ground turkey")) return "Cook in a skillet over medium-high heat for 5–6 minutes, breaking apart until no pink remains.";
  if (lower.includes("shrimp")) return "Cook in a hot pan for 2 minutes per side until pink and curled. Do not overcook.";
  if (lower.includes("tuna")) return "Drain the can. No cooking needed.";

  // Vegetables
  if (lower.includes("baby spinach") || lower.includes("fresh spinach")) return "Heat a pan over medium with a small spray of oil. Add spinach and toss for 1–2 minutes until wilted. Season with salt.";
  if (lower.includes("frozen spinach")) return "Microwave frozen spinach for 2 minutes. Squeeze out all excess water using a paper towel.";
  if (lower.includes("broccoli")) return "Microwave the frozen broccoli bag for 4 minutes. Drain any water.";
  if (lower.includes("green bean")) return "Microwave the green beans steam bag for 3 minutes.";
  if (lower.includes("edamame")) return "Microwave the frozen edamame bag for 3 minutes. Season with a pinch of salt.";
  if (lower.includes("kale")) return "Heat a pan with a small spray of oil. Add kale and toss for 2–3 minutes until slightly wilted.";
  if (lower.includes("asparagus")) return "Air fry at 400°F for 6–8 minutes, or roast in oven at 425°F for 10 minutes.";
  if (lower.includes("zucchini")) return "Slice and air fry at 400°F for 8–10 minutes until golden.";
  if (lower.includes("brussels sprouts")) return "Air fry at 400°F for 12–15 minutes, shaking halfway.";
  if (lower.includes("cauliflower rice")) return "Microwave the frozen cauliflower rice bag for 4 minutes.";
  if (lower.includes("sweet potato")) return "Microwave whole for 5–6 minutes until soft, or air fry cubes at 400°F for 15 minutes.";
  if (lower.includes("mixed veg") || lower.includes("vegetable")) return "Microwave the frozen vegetable bag for 3–4 minutes following package directions.";

  // Carbs
  if (lower.includes("rice pouch") || (lower.includes("rice") && !lower.includes("cauliflower"))) return "Microwave the rice pouch for 90 seconds.";
  if (lower.includes("quinoa")) return "Cook quinoa per package directions (usually 2:1 water ratio, 15 minutes simmering) OR use a microwave quinoa pouch for 90 seconds.";
  if (lower.includes("pasta")) return "Cook pasta in boiling salted water per package directions. Drain well.";
  if (lower.includes("naan")) return "No cooking needed, or warm in air fryer at 350°F for 2 minutes.";
  if (lower.includes("tortilla")) return "No cooking needed, or warm in a dry pan for 30 seconds per side.";

  // Sauces/Condiments - bottled items need no prep
  if (lower.includes("sauce") || lower.includes("sriracha") || lower.includes("soy") || lower.includes("ponzu")) return "";

  return "";
}

// Helper function to provide appropriate veg prep instructions (legacy name, calls getIngredientPrepNote)
function getVegPrepInstruction(vegName) {
  return getIngredientPrepNote(vegName);
}

export function generateLocalRecipes(ingredients, ezLevel, flavorTags, cookMethod, goals, heatLevel = null) {
  const lev = EZ[ezLevel];
  const lower = ingredients.map(i => i.toLowerCase());
  const hasCod = lower.some(i => /cod/.test(i));
  const hasSalmon = lower.some(i => /salmon/.test(i));
  const hasChicken = lower.some(i => /chicken/.test(i));
  const hasChickenBreast = lower.some(i => /chicken breast/.test(i));
  const hasBeef = lower.some(i => /beef|ground beef/.test(i));
  const hasTurkey = lower.some(i => /turkey/.test(i));
  const hasShrimp = lower.some(i => /shrimp|prawn/.test(i));
  const hasEggs = lower.some(i => /egg/.test(i));
  const hasEggWhites = lower.some(i => /egg white|eggwhite/.test(i));
  const hasHashBrowns = lower.some(i => /hash brown|hashbrown|potato|potatoes/.test(i));
  const hasCheese = lower.some(i => /cheese|cheddar|mozzarella|cottage/.test(i));
  const hasOats = lower.some(i => /oat/.test(i));
  const hasTuna = lower.some(i => /tuna/.test(i));
  const hasYogurt = lower.some(i => /yogurt|yoghurt/.test(i));
  const hasRice = lower.some(i => /rice/.test(i));
  const hasPasta = lower.some(i => /pasta|noodle/.test(i));
  const hasBroccoli = lower.some(i => /broccoli/.test(i));
  const hasGreenBeans = lower.some(i => /green bean|beans/.test(i));
  const hasMixedVeg = lower.some(i => /mixed veg|vegetable/.test(i));
  const hasSpinach = lower.some(i => /spinach/.test(i));
  const hasEdamame = lower.some(i => /edamame/.test(i));
  const isSpicy = flavorTags.includes("Spicy");
  const isSaucy = flavorTags.includes("Saucy");
  const isAsian = flavorTags.includes("Asian-Inspired");
  const isItalian = flavorTags.includes("Italian-Inspired");
  const isMediterranean = flavorTags.includes("Mediterranean");
  const isNeutral = flavorTags.includes("Neutral") || flavorTags.length === 0;

  // Only set a default veg if we have a specific one detected, or if not cooking eggs
  const veg = hasGreenBeans ? "Green Beans (steam-bag)" : hasBroccoli ? "Frozen Broccoli (steam-bag)" : hasMixedVeg ? "Frozen Mixed Veg (steam-bag)" : hasSpinach ? "Frozen Spinach (microwave)" : null;
  const vegCal = 30; const vegP = 3; const vegC = 5; const vegF = 0; const vegGrams = 85;

  const carbName = hasRice ? "White Rice Pouch (microwave)" : hasPasta ? "Microwave Pasta Cup" : "White Rice Pouch (microwave)";
  const carbCal = 260; const carbP = 6; const carbC = 56; const carbF = 0; const carbGrams = 200;

  const results = [];

  if (hasCod) {
    const codSauce = isSpicy||isSpicy&&isAsian?"Soy+Sriracha+Garlic+Honey":
                     isSaucy&&isAsian?"Teriyaki Sauce":isSaucy?"Ponzu+Honey":
                     isAsian?"Teriyaki Sauce":isMediterranean?"Olive Oil+Lemon Pepper":"Lemon Pepper";
    const codName = isSpicy?"Spicy Cod Bowl":isSaucy&&isAsian?"Saucy Teriyaki Cod":
                    isSaucy?"Glazed Cod Bowl":isAsian?"Teriyaki Cod Bowl":
                    isMediterranean?"Mediterranean Cod":"Lemon Herb Cod";
    const spiceLevel = isSpicy ? (heatLevel || 1) : 0;

    const codMacros = calcComponentMacros(getUsdaMacros("Cod Fillet"), 170);
    const carbMacros = calcComponentMacros(getUsdaMacros(hasRice ? "White Rice (cooked)" : "White Rice (cooked)"), 200);
    const vegMacros = veg ? calcComponentMacros(getUsdaMacros(
      hasGreenBeans ? "Frozen Green Beans" : hasBroccoli ? "Frozen Broccoli" :
      hasMixedVeg ? "Frozen Mixed Veg" : hasSpinach ? "Frozen Spinach" : "Frozen Broccoli"
    ), 85) : { cal: 0, protein: 0, carbs: 0, fat: 0 };

    const sauceComponents = splitCombinedIngredient(codSauce) || [];

    const components = [
      {name:"Cod Fillet",type:"Protein",grams:170,...codMacros,weighRaw:true,userAdded:true},
      ...sauceComponents.map(c => ({...c, userAdded: false})),
      ...(isSpicy && spiceLevel >= 3 ? [createSeasoningComponent("Red Pepper Flakes", 1)] : []).map(c => ({...c, userAdded: false})),
      {name:carbName,type:"Carb",grams:200,...carbMacros,weighRaw:false,userAdded:false},
      ...(veg ? [{name:veg,type:"Veg",grams:85,...vegMacros,weighRaw:false,userAdded:false}] : []),
    ];

    const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
    const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
    const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
    const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

    results.push({
      name:codName, emoji:"🐟", method:cookMethod!=="Any"?cookMethod:"Bake", ezLevel,
      spiceLevel,
      tags:["High Protein","Omega-3","Low Fat",isSpicy?(heatLevel===3?"Hot":heatLevel===2?"Medium Heat":"Mild Heat"):"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Gluten-Free"].filter(Boolean),
      totalCal:Math.round(totalCal), totalProtein:Math.round(totalProtein*10)/10, totalCarbs:Math.round(totalCarbs*10)/10, totalFat:Math.round(totalFat*10)/10, activeMinutes:3, stepCount:4,
      components,
      toppings:isSpicy?[{name:"Extra sriracha",info:"1 tsp = 5 cal"},{name:"Lime squeeze",info:"5 cal"}]
              :[{name:"Lemon squeeze",info:"5 cal"},{name:"Parmesan",info:"1 tbsp = 22 cal"}],
      steps:[
        "Pat cod dry with paper towels. Place on foil-lined baking sheet.",
        isAsian||isSpicy?"Mix soy sauce, sriracha, garlic powder, and a small squeeze of honey in a small bowl. Brush the mixture over the cod.":"Drizzle "+codSauce+" over the cod and spread evenly.",
        "Bake at 425°F for 12–14 minutes until the fish flakes easily with a fork.",
        "While baking, microwave rice pouch for 90 seconds. "+getVegPrepInstruction(veg)+" Arrange rice on a plate, top with cod, and add vegetables to the side.",
      ],
    });
  }
  if (hasChicken) {
    const sauceLabel = isSaucy&&isSpicy ? "Sriracha+Soy (heavy)" :
                       isSaucy&&isAsian ? "Teriyaki Sauce" :
                       isSaucy ? "Teriyaki Sauce" :
                       isSpicy ? "Sriracha+Soy Sauce" :
                       isAsian ? "Teriyaki Sauce" : "Garlic Herb Seasoning";
    const spiceLevel = isSpicy ? (heatLevel || 1) : 0;

    const chickenMacros = calcComponentMacros(getUsdaMacros(hasChickenBreast ? "Chicken Breast (boneless, skinless)" : "Chicken Thighs (boneless, skinless)"), 170);
    const carbMacros = calcComponentMacros(getUsdaMacros(hasRice ? "White Rice (cooked)" : "White Rice (cooked)"), 200);
    const vegMacros = veg ? calcComponentMacros(getUsdaMacros(
      hasGreenBeans ? "Frozen Green Beans" : hasBroccoli ? "Frozen Broccoli" :
      hasMixedVeg ? "Frozen Mixed Veg" : hasSpinach ? "Frozen Spinach" : "Frozen Broccoli"
    ), 85) : { cal: 0, protein: 0, carbs: 0, fat: 0 };

    const sauceComponents = splitCombinedIngredient(sauceLabel) || [];

    const components = [
      {name:hasChickenBreast?"Chicken Breast (boneless, skinless)":"Chicken Thighs (boneless, skinless)",type:"Protein",grams:170,...chickenMacros,weighRaw:true,userAdded:true},
      ...sauceComponents.map(c => ({...c, userAdded: false})),
      ...(isSpicy && spiceLevel >= 3 ? [createSeasoningComponent("Red Pepper Flakes", 1)] : []).map(c => ({...c, userAdded: false})),
      {name:carbName,type:"Carb",grams:200,...carbMacros,weighRaw:false,userAdded:false},
      ...(veg ? [{name:veg,type:"Veg",grams:85,...vegMacros,weighRaw:false,userAdded:false}] : []),
    ];

    const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
    const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
    const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
    const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

    results.push({
      name: isSaucy&&isSpicy?"Spicy Saucy Chicken":isSaucy&&isAsian?"Saucy Teriyaki Chicken":
            isSaucy?"Saucy Baked Chicken":isSpicy?"Spicy Air Fryer Chicken":
            isAsian?"Teriyaki Chicken Bowl":"Garlic Herb Chicken",
      emoji:"🍗", method:cookMethod!=="Any"?cookMethod:"Air Fryer", ezLevel,
      spiceLevel,
      tags:["High Protein",isSpicy?(heatLevel===3?"Hot":heatLevel===2?"Medium Heat":"Mild Heat"):"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Gluten-Free","Keto"].filter(Boolean),
      totalCal:Math.round(totalCal), totalProtein:Math.round(totalProtein*10)/10, totalCarbs:Math.round(totalCarbs*10)/10, totalFat:Math.round(totalFat*10)/10,
      activeMinutes:4, stepCount:3,
      components,
      toppings: isSaucy?[{name:"Extra sauce over top",info:"go heavy"},{name:"Parmesan",info:"1 tbsp = 22 cal"}]
               :isSpicy?[{name:"Extra Hot Sauce",info:"1 tsp = 0 cal"},{name:"Lime squeeze",info:"5 cal"}]
               :[{name:"Hot Sauce",info:"1 tsp = 0 cal"},{name:"Parmesan",info:"1 tbsp = 22 cal"}],
      steps:[
        (isSaucy?"Generously coat the chicken":"Coat the chicken evenly")+" with "+sauceLabel+(isSaucy?" — don't hold back.":".")+" "+(cookMethod==="Bake"?"Place on a foil-lined baking sheet.":"Place in the air fryer basket."),
        cookMethod==="Bake"?"Bake at 400°F for 20–22 minutes until cooked through.":"Air fry at 400°F for 18–20 minutes, flipping halfway through at the 10-minute mark.",
        "While cooking, microwave rice pouch for 90 seconds. "+getVegPrepInstruction(veg)+(isSaucy?" Spoon extra sauce over the finished bowl.":""),
      ],
    });
  }
  if (hasBeef) {
    const beefSauce = isSaucy&&isSpicy?"Sriracha+Soy+Garlic+Honey (heavy)":
                      isSaucy&&isAsian?"Teriyaki Sauce":
                      isSaucy?"Canned Diced Tomatoes":
                      isAsian||isSpicy?"Soy+Sriracha+Garlic+Honey":"Canned Diced Tomatoes";
    const beefName = isSaucy&&isSpicy?"Spicy Saucy Beef Bowl":isSaucy&&isAsian?"Teriyaki Beef Bowl":
                     isSaucy?"Saucy Beef & Rice":isSpicy?"Spicy Garlic Beef Bowl":
                     isAsian?"Asian Beef Bowl":"Ground Beef Rice Bowl";
    const spiceLevel = isSpicy ? (heatLevel || 1) : 0;

    const beefMacros = calcComponentMacros(getUsdaMacros("Ground Beef (93% lean)"), 142);
    const carbMacros = calcComponentMacros(getUsdaMacros("White Rice (cooked)"), 200);
    const vegMacros = veg ? calcComponentMacros(getUsdaMacros(
      hasGreenBeans ? "Frozen Green Beans" : hasBroccoli ? "Frozen Broccoli" :
      hasMixedVeg ? "Frozen Mixed Veg" : hasSpinach ? "Frozen Spinach" : "Frozen Broccoli"
    ), 85) : { cal: 0, protein: 0, carbs: 0, fat: 0 };

    const sauceComponents = splitCombinedIngredient(beefSauce) || [];

    const components = [
      {name:"Ground Beef (93% lean)",type:"Protein",grams:142,...beefMacros,weighRaw:true,userAdded:true},
      ...sauceComponents.map(c => ({...c, userAdded: false})),
      ...(isSpicy && spiceLevel >= 3 ? [createSeasoningComponent("Red Pepper Flakes", 1)] : []).map(c => ({...c, userAdded: false})),
      {name:carbName,type:"Carb",grams:200,...carbMacros,weighRaw:false,userAdded:false},
      ...(veg ? [{name:veg,type:"Veg",grams:85,...vegMacros,weighRaw:false,userAdded:false}] : []),
    ];

    const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
    const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
    const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
    const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

    results.push({
      name:beefName, emoji:"🥩", method:cookMethod!=="Any"?cookMethod:"Slow Cooker", ezLevel,
      spiceLevel,
      tags:["High Protein",isSpicy?(heatLevel===3?"Hot":heatLevel===2?"Medium Heat":"Mild Heat"):"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Bulk Friendly","Meal Prep"].filter(Boolean),
      totalCal:Math.round(totalCal), totalProtein:Math.round(totalProtein*10)/10, totalCarbs:Math.round(totalCarbs*10)/10, totalFat:Math.round(totalFat*10)/10,
      activeMinutes:5, stepCount:4,
      components,
      toppings:isSaucy&&isSpicy?[{name:"Extra sriracha",info:"1 tsp = 5 cal"},{name:"Extra sauce",info:"pour liberally"}]
              :isSaucy?[{name:"Extra sauce",info:"go heavy"},{name:"Sour Cream",info:"2 tbsp = 60 cal"}]
              :isSpicy?[{name:"Extra Sriracha",info:"1 tsp = 5 cal"},{name:"Cheddar",info:"¼ cup = 110 cal"}]
              :[{name:"Cheddar",info:"¼ cup = 110 cal"},{name:"Sour Cream",info:"2 tbsp = 60 cal"}],
      steps:[
        isAsian||isSpicy?"In a small bowl, mix 2 tablespoons soy sauce, 1 tablespoon sriracha, 1 teaspoon garlic powder, and 1 teaspoon honey. Add beef and sauce to slow cooker and break up the beef with a wooden spoon."
          :"Add ground beef and "+(isSaucy?"2 tablespoons sauce":"1 can (14 oz) diced tomatoes")+" to slow cooker. Break up the beef with a spoon so it cooks evenly.",
        "Cover and cook on HIGH for 2 hours or LOW for 4 hours until beef is fully cooked and crumbly.",
        "While the slow cooker finishes, microwave rice pouch for 90 seconds. "+getVegPrepInstruction(veg),
        "Scoop rice into a bowl, top with beef mixture."+(isSaucy?" Spoon extra sauce over the top.":""),
      ],
    });
  }
  if (hasTurkey) {
    const turkeySauce = isSaucy&&isSpicy?"Sriracha+Soy (heavy)":isSaucy&&isAsian?"Teriyaki Sauce":
                        isSaucy?"Teriyaki Sauce":isAsian||isSpicy?"Soy+Sriracha+Garlic+Honey":"Garlic Herb Seasoning";
    const turkeyName = isSaucy&&isSpicy?"Spicy Saucy Ground Turkey":isSaucy&&isAsian?"Teriyaki Turkey Bowl":
                       isSaucy?"Saucy Ground Turkey":isSpicy?"Spicy Turkey Bowl":
                       isAsian?"Asian Turkey Bowl":"Garlic Herb Turkey Bowl";
    const spiceLevel = isSpicy ? (heatLevel || 1) : 0;

    const turkeyMacros = calcComponentMacros(getUsdaMacros("Ground Turkey (93% lean)"), 170);
    const carbMacros = calcComponentMacros(getUsdaMacros("White Rice (cooked)"), 200);
    const vegMacros = veg ? calcComponentMacros(getUsdaMacros(
      hasGreenBeans ? "Frozen Green Beans" : hasBroccoli ? "Frozen Broccoli" :
      hasMixedVeg ? "Frozen Mixed Veg" : hasSpinach ? "Frozen Spinach" : "Frozen Broccoli"
    ), 85) : { cal: 0, protein: 0, carbs: 0, fat: 0 };

    const sauceComponents = splitCombinedIngredient(turkeySauce) || [];

    const components = [
      {name:"Ground Turkey (93% lean)",type:"Protein",grams:170,...turkeyMacros,weighRaw:true,userAdded:true},
      ...sauceComponents.map(c => ({...c, userAdded: false})),
      ...(isSpicy && spiceLevel >= 3 ? [createSeasoningComponent("Red Pepper Flakes", 1)] : []).map(c => ({...c, userAdded: false})),
      {name:carbName,type:"Carb",grams:200,...carbMacros,weighRaw:false,userAdded:false},
      ...(veg ? [{name:veg,type:"Veg",grams:85,...vegMacros,weighRaw:false,userAdded:false}] : []),
    ];

    const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
    const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
    const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
    const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

    results.push({
      name:turkeyName, emoji:"🦃", method:cookMethod!=="Any"?cookMethod:"Skillet", ezLevel,
      spiceLevel,
      tags:["High Protein","Lean",isSpicy?(heatLevel===3?"Hot":heatLevel===2?"Medium Heat":"Mild Heat"):"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Bulk Friendly"].filter(Boolean),
      totalCal:Math.round(totalCal), totalProtein:Math.round(totalProtein*10)/10, totalCarbs:Math.round(totalCarbs*10)/10, totalFat:Math.round(totalFat*10)/10,
      activeMinutes:6, stepCount:4,
      components,
      toppings:isSaucy&&isSpicy?[{name:"Extra sriracha",info:"1 tsp = 5 cal"},{name:"Hot sauce",info:"pour liberally"}]
              :isSaucy?[{name:"Extra sauce",info:"go heavy"},{name:"Parmesan",info:"1 tbsp = 22 cal"}]
              :isSpicy?[{name:"Extra Sriracha",info:"1 tsp = 5 cal"},{name:"Black Pepper",info:"to taste"}]
              :[{name:"Parmesan",info:"1 tbsp = 22 cal"},{name:"Fresh Herbs",info:"basil or oregano"}],
      steps:[
        isAsian||isSpicy?"Heat a skillet over medium-high heat. Add ground turkey, break it apart with a spoon, and stir in soy sauce, sriracha, garlic powder, and honey. Cook 4–5 minutes until the turkey is browned.":"Heat a skillet over medium-high heat. Add ground turkey, breaking it apart with a spoon. Cook 5–6 minutes, stirring occasionally, until no pink remains. "+(isSaucy?"Stir in sauce generously.":"Add seasoning to taste."),
        "Stir "+(isSaucy?"frequently":"occasionally")+". Cook for 2–3 more minutes to finish cooking through.",
        "While the turkey finishes, microwave rice pouch for 90 seconds. "+getVegPrepInstruction(veg),
        "Spoon rice and turkey mixture into a bowl. Add vegetables to the side."+(isSaucy?" Drizzle extra sauce over the top.":""),
      ],
    });
  }

  if (hasSalmon) {
    const salmonSauce = isSaucy&&isSpicy?"Sriracha+Soy (heavy)":isSaucy&&isAsian?"Teriyaki Sauce":
                        isSaucy?"Ponzu+Soy (heavy)":isSpicy?"Sriracha+Soy":
                        isAsian?"Teriyaki Sauce":"Olive Oil+Lemon Pepper";
    const spiceLevel = isSpicy ? (heatLevel || 1) : 0;

    const salmonMacros = calcComponentMacros(getUsdaMacros("Salmon Fillet"), 170);
    const carbMacros = calcComponentMacros(getUsdaMacros("White Rice (cooked)"), 200);
    const vegMacros = veg ? calcComponentMacros(getUsdaMacros(
      hasGreenBeans ? "Frozen Green Beans" : hasBroccoli ? "Frozen Broccoli" :
      hasMixedVeg ? "Frozen Mixed Veg" : hasSpinach ? "Frozen Spinach" : "Frozen Broccoli"
    ), 85) : { cal: 0, protein: 0, carbs: 0, fat: 0 };

    const sauceComponents = splitCombinedIngredient(salmonSauce) || [];

    const components = [
      {name:"Salmon Fillet",type:"Protein",grams:170,...salmonMacros,weighRaw:true,userAdded:true},
      ...sauceComponents.map(c => ({...c, userAdded: false})),
      ...(isSpicy && spiceLevel >= 3 ? [createSeasoningComponent("Red Pepper Flakes", 1)] : []).map(c => ({...c, userAdded: false})),
      {name:carbName,type:"Carb",grams:200,...carbMacros,weighRaw:false,userAdded:false},
      ...(veg ? [{name:veg,type:"Veg",grams:85,...vegMacros,weighRaw:false,userAdded:false}] : []),
    ];

    const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
    const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
    const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
    const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

    results.push({
      name:isSaucy&&isSpicy?"Spicy Saucy Salmon":isSaucy&&isAsian?"Saucy Teriyaki Salmon":
           isSaucy?"Ponzu Glazed Salmon":isSpicy?"Spicy Sriracha Salmon":
           isAsian?"Teriyaki Salmon Bowl":"Lemon Herb Salmon",
      emoji:"🐠", method:cookMethod!=="Any"?cookMethod:"Bake", ezLevel,
      spiceLevel,
      tags:["High Protein","Omega-3",isSpicy?(heatLevel===3?"Hot":heatLevel===2?"Medium Heat":"Mild Heat"):"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Gluten-Free"].filter(Boolean),
      totalCal:Math.round(totalCal), totalProtein:Math.round(totalProtein*10)/10, totalCarbs:Math.round(totalCarbs*10)/10, totalFat:Math.round(totalFat*10)/10, activeMinutes:3, stepCount:3,
      components,
      toppings:isSaucy?[{name:"Pour pan drippings over bowl",info:"don't waste it"},{name:"Sesame seeds",info:"1 tsp = 17 cal"}]
              :[{name:"Sesame seeds",info:"1 tsp = 17 cal"},{name:isSpicy?"Extra Sriracha":"Lemon squeeze",info:"5 cal"}],
      steps:[
        "Place salmon skin-down on a foil-lined baking sheet. "+(isSaucy?"Generously pour":"Drizzle")+" "+salmonSauce+" over the fish.",
        "Bake at 425°F for 12–14 minutes until the salmon is cooked through and flakes easily.",
        "While baking, microwave rice pouch for 90 seconds. "+getVegPrepInstruction(veg)+" Arrange on a plate."+(isSaucy?" Save any pan drippings and drizzle over the bowl.":""),
      ],
    });
  }

  if (hasEggs || hasEggWhites) {
    const spiceLevel = isSpicy ? (heatLevel || 1) : 0;
    // Spicy eggs only
    if (isSpicy && ingredients.length === 1) {
      const eggsMacros = calcComponentMacros(getUsdaMacros("Whole Egg"), 150);
      const srirMacros = calcComponentMacros(getUsdaMacros("Sriracha"), 10);

      const components = [
        {name: "Whole Eggs (3 large)", type: "Protein", grams: 150, ...eggsMacros, weighRaw: false, userAdded: true},
        {name: "Butter", type: "Fat", grams: 14, cal: 100, protein: 0, carbs: 0, fat: 11, weighRaw: false, userAdded: false},
        {name: "Sriracha", type: "Sauce", grams: 10, ...srirMacros, weighRaw: false, userAdded: false},
        {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false, userAdded: false},
        ...(spiceLevel >= 3 ? [createSeasoningComponent("Red Pepper Flakes", 1)] : []).map(c => ({...c, userAdded: false})),
      ];
      const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
      const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
      const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
      const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

      results.push({
        name: "Spicy Scrambled Eggs",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        spiceLevel,
        tags: ["Breakfast", "High Protein", heatLevel===3?"Hot":heatLevel===2?"Medium Heat":"Mild Heat", "Quick"],
        totalCal: Math.round(totalCal),
        totalProtein: Math.round(totalProtein*10)/10,
        totalCarbs: Math.round(totalCarbs*10)/10,
        totalFat: Math.round(totalFat*10)/10,
        activeMinutes: 5,
        stepCount: 2,
        components,
        toppings: [{name: "Extra Sriracha", info: "1 tsp = 5 cal"}, {name: "Black Pepper", info: "pinch = 0 cal"}],
        steps: [
          "Melt butter in a non-stick pan over medium heat, swirling to coat the bottom.",
          "Crack 3 eggs into the pan. Stir gently and continuously with a spatula for 3–4 minutes until the eggs are mostly cooked but still slightly soft (they'll continue to cook off heat). Top with shredded cheese and sriracha to taste.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
    // Plain eggs only
    else if (ingredients.length === 1 && !isSpicy) {
      const eggsMacros = calcComponentMacros(getUsdaMacros("Whole Egg"), 150);

      const components = [
        {name: "Whole Eggs (3 large)", type: "Protein", grams: 150, ...eggsMacros, weighRaw: false, userAdded: true},
        {name: "Butter", type: "Fat", grams: 14, cal: 100, protein: 0, carbs: 0, fat: 11, weighRaw: false, userAdded: false},
        {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false, userAdded: false},
      ];
      const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
      const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
      const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
      const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

      results.push({
        name: "Classic Scrambled Eggs",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        spiceLevel: 0,
        tags: ["Breakfast", "High Protein", "Neutral", "Quick"],
        totalCal: Math.round(totalCal),
        totalProtein: Math.round(totalProtein*10)/10,
        totalCarbs: Math.round(totalCarbs*10)/10,
        totalFat: Math.round(totalFat*10)/10,
        activeMinutes: 5,
        stepCount: 2,
        components,
        toppings: [{name: "Sea Salt", info: "pinch = 0 cal"}, {name: "Black Pepper", info: "pinch = 0 cal"}],
        steps: [
          "Melt butter in a non-stick pan over medium heat, swirling to coat the bottom.",
          "Crack 3 eggs into the pan. Stir gently and continuously with a spatula for 3–4 minutes until the eggs are mostly cooked but still slightly soft (they'll continue to cook off heat). Top with shredded cheese, salt, and pepper to taste.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
    // Eggs + hash browns
    else if (hasHashBrowns) {
      const eggsMacros = calcComponentMacros(getUsdaMacros("Whole Egg"), 100);

      const components = [
        {name: "Whole Eggs (2 large)", type: "Protein", grams: 100, ...eggsMacros, weighRaw: false, userAdded: true},
        {name: "Frozen Hash Browns", type: "Carb", grams: 113, cal: 130, protein: 2, carbs: 22, fat: 4, weighRaw: false, userAdded: false},
        {name: "Butter", type: "Fat", grams: 14, cal: 100, protein: 0, carbs: 0, fat: 11, weighRaw: false, userAdded: false},
        {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false, userAdded: false},
      ];
      const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
      const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
      const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
      const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

      results.push({
        name: "Hash Brown Egg Skillet",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        spiceLevel: 0,
        tags: ["Breakfast", "High Protein", "Comfort", "Quick"],
        totalCal: Math.round(totalCal),
        totalProtein: Math.round(totalProtein*10)/10,
        totalCarbs: Math.round(totalCarbs*10)/10,
        totalFat: Math.round(totalFat*10)/10,
        activeMinutes: 8,
        stepCount: 3,
        components,
        toppings: [{name: "Hot Sauce", info: "1 tsp = 0 cal"}, {name: "Salsa", info: "2 tbsp = 10 cal"}],
        steps: [
          "Heat a skillet over medium-high heat with butter. Add frozen hash browns and cook for 3–4 minutes per side until they're golden brown and crispy. Set aside on a plate.",
          "In the same skillet, crack 2 eggs and scramble gently for 2–3 minutes until just cooked through.",
          "Transfer eggs to a plate. Top with shredded cheese and hash browns. Serve with hot sauce or salsa on the side.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
    // Eggs + spinach
    else if (hasSpinach) {
      const spinachMacros = calcComponentMacros(getUsdaMacros("Frozen Spinach"), 85);
      const eggsMacros = calcComponentMacros(getUsdaMacros("Whole Egg"), 150);

      const components = [
        {name: "Whole Eggs (3 large)", type: "Protein", grams: 150, ...eggsMacros, weighRaw: false, userAdded: true},
        {name: "Frozen Spinach (microwave bag)", type: "Veg", grams: 85, ...spinachMacros, weighRaw: false, userAdded: false},
        {name: "Butter", type: "Fat", grams: 10, cal: 80, protein: 0, carbs: 0, fat: 9, weighRaw: false, userAdded: false},
        {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false, userAdded: false},
      ];
      const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
      const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
      const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
      const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

      results.push({
        name: "Spinach & Egg Scramble",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        spiceLevel: 0,
        tags: ["Breakfast", "High Protein", "Neutral", "Quick"],
        totalCal: Math.round(totalCal),
        totalProtein: Math.round(totalProtein*10)/10,
        totalCarbs: Math.round(totalCarbs*10)/10,
        totalFat: Math.round(totalFat*10)/10,
        activeMinutes: 6,
        stepCount: 3,
        components,
        toppings: [{name: "Salt & Pepper", info: "pinch = 0 cal"}, {name: "Hot Sauce", info: "1 tsp = 0 cal"}],
        steps: [
          "Microwave frozen spinach in a microwave-safe container for 2 minutes. Once thawed, transfer to a kitchen towel or strainer and squeeze out all excess water (this is important for texture).",
          "Heat butter in a skillet over medium heat. Add the spinach and stir for about 1 minute. Crack 3 eggs directly into the pan and scramble everything together for 3–4 minutes until the eggs are cooked through.",
          "Transfer to a plate, top with shredded cheese, and season with salt and pepper. Serve hot with hot sauce on the side if desired.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }

    // Always offer Deviled Eggs as second option
    {
      const eggsMacros2 = calcComponentMacros(getUsdaMacros("Whole Egg"), 150);

      const components = [
        {name: "Pre-Boiled Eggs (6)", type: "Protein", grams: 150, ...eggsMacros2, weighRaw: false, userAdded: true},
        {name: "Hellmann's Light Mayo", type: "Fat", grams: 15, cal: 35, protein: 0, carbs: 0, fat: 3, weighRaw: false, userAdded: false},
        {name: "Yellow Mustard (squeeze bottle)", type: "Flavor", grams: 5, cal: 3, protein: 0, carbs: 0, fat: 0, weighRaw: false, userAdded: false},
      ];
      const totalCal = components.reduce((sum, c) => sum + c.cal, 0);
      const totalProtein = components.reduce((sum, c) => sum + c.protein, 0);
      const totalCarbs = components.reduce((sum, c) => sum + c.carbs, 0);
      const totalFat = components.reduce((sum, c) => sum + c.fat, 0);

      results.push({
        name: "Deviled Eggs",
        emoji: "🥚",
        method: "No Cook",
        ezLevel,
        spiceLevel: 0,
        tags: ["Breakfast", "High Protein", "Keto", "Low Carb", "Snack"],
        totalCal: Math.round(totalCal),
        totalProtein: Math.round(totalProtein*10)/10,
        totalCarbs: Math.round(totalCarbs*10)/10,
        totalFat: Math.round(totalFat*10)/10,
        activeMinutes: 5,
        stepCount: 3,
        components,
        toppings: [{name: "Paprika (shaker)", info: "pinch = 0 cal"}, {name: "Pickle Relish", info: "1 tsp = 5 cal"}],
        steps: [
          "Halve pre-boiled eggs lengthwise. Pop yolks into bowl.",
          "Mash yolks with mayo + mustard until smooth.",
          "Fill whites. Shake paprika on top.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
  }

  if (results.length === 0) {
    results.push({
      name: "No recipes matched",
      emoji: "🤔",
      method: "—",
      ezLevel,
      tags: ["Message"],
      totalCal: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      activeMinutes: 0,
      stepCount: 0,
      isMessage: true,
      components: [],
      toppings: [],
      steps: ["Try adding a protein like chicken, beef, turkey, salmon, eggs, or tuna to get a recipe"],
    });
  }

  return results.slice(0, 3);
}

// Export recipe pools and helper for reference/debugging
export { GROUND_BEEF_RECIPES, GROUND_CHICKEN_RECIPES, GROUND_PORK_RECIPES, GROUND_TURKEY_RECIPES, pickRecipesByFlavorAndMethod };
