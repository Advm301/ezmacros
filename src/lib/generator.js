import { EZ, RECIPES, BANNED } from '../data/recipes.js';

export function classifyIngredient(name) {
  const n = name.toLowerCase();
  if (/chicken|beef|turkey|salmon|cod|tuna|shrimp|egg|pork|tofu|fish/.test(n)) return "protein";
  if (/rice|pasta|bread|potato|quinoa|oat|bean|lentil|tortilla|noodle/.test(n)) return "carb";
  if (/broccoli|green bean|spinach|pepper|tomato|onion|zucchini|carrot|edamame|kale|veg|vegetable/.test(n)) return "veg";
  return "other";
}

export function generateLocalRecipes(ingredients, ezLevel, flavorTags, cookMethod, goals) {
  const lev = EZ[ezLevel];
  const lower = ingredients.map(i => i.toLowerCase());
  const hasCod = lower.some(i => /cod/.test(i));
  const hasSalmon = lower.some(i => /salmon/.test(i));
  const hasChicken = lower.some(i => /chicken/.test(i));
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
  const vegCal = 40; const vegP = 2; const vegC = 8; const vegF = 0; const vegGrams = 85;

  const carbName = hasRice ? "White Rice Pouch (microwave)" : hasPasta ? "Microwave Pasta Cup" : "White Rice Pouch (microwave)";
  const carbCal = 200; const carbP = 4; const carbC = 44; const carbF = 1; const carbGrams = 200;

  const results = [];

  if (hasCod) {
    const codSauce = isSpicy||isSpicy&&isAsian?"Soy+Sriracha+Garlic+Honey":
                     isSaucy&&isAsian?"Teriyaki Sauce":isSaucy?"Ponzu+Honey":
                     isAsian?"Teriyaki Sauce":isMediterranean?"Olive Oil+Lemon Pepper":"Lemon Pepper";
    const codName = isSpicy?"Spicy Cod Bowl":isSaucy&&isAsian?"Saucy Teriyaki Cod":
                    isSaucy?"Glazed Cod Bowl":isAsian?"Teriyaki Cod Bowl":
                    isMediterranean?"Mediterranean Cod":"Lemon Herb Cod";
    const codSauceG = isSaucy?40:isAsian||isSpicy?20:3;
    const codSauceCal = isSaucy?45:isAsian||isSpicy?20:8;
    results.push({
      name:codName, emoji:"🐟", method:cookMethod!=="Any"?cookMethod:"Bake", ezLevel,
      tags:["High Protein","Omega-3","Low Fat",isSpicy?"Spicy":"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Gluten-Free"].filter(Boolean),
      totalCal:380, totalProtein:38, totalCarbs:44, totalFat:4, activeMinutes:3, stepCount:4,
      components:[
        {name:"Cod Fillet",type:"Protein",grams:170,cal:140,protein:30,carbs:0,fat:1,weighRaw:true},
        {name:codSauce,type:"Sauce",grams:codSauceG,cal:codSauceCal,protein:1,carbs:isAsian||isSpicy?4:2,fat:0,weighRaw:false},
        {name:carbName,type:"Carb",grams:carbGrams,cal:carbCal,protein:carbP,carbs:carbC,fat:carbF,weighRaw:false},
        ...(veg ? [{name:veg,type:"Veg",grams:vegGrams,cal:vegCal,protein:vegP,carbs:vegC,fat:vegF,weighRaw:false}] : []),
      ],
      toppings:isSpicy?[{name:"Extra sriracha",info:"1 tsp = 5 cal"},{name:"Lime squeeze",info:"5 cal"}]
              :[{name:"Lemon squeeze",info:"5 cal"},{name:"Parmesan",info:"1 tbsp = 22 cal"}],
      steps:[
        "Pat cod dry. Place on foil-lined baking sheet.",
        isAsian||isSpicy?"Mix soy+sriracha+garlic powder+a squeeze of honey. Brush over cod.":"Brush/drizzle "+codSauce+" over cod.",
        "Bake 425°F 12–14 min.",
        "Microwave rice 90 sec + steam veg 3 min. Build bowl.",
      ],
    });
  }
  if (hasChicken) {
    const sauceLabel = isSaucy&&isSpicy ? "Sriracha+Soy (heavy)" :
                       isSaucy&&isAsian ? "Teriyaki Sauce (generous)" :
                       isSaucy ? "Buffalo or Rao's Marinara (heavy)" :
                       isSpicy ? "Sriracha+Soy Sauce" :
                       isAsian ? "Teriyaki Sauce" : "Garlic Herb Seasoning";
    const sauceG = isSaucy?60:isAsian||isSpicy?25:3;
    const sauceCal = isSaucy&&isAsian?70:isSaucy?50:isAsian||isSpicy?20:10;
    results.push({
      name: isSaucy&&isSpicy?"Spicy Saucy Chicken":isSaucy&&isAsian?"Saucy Teriyaki Chicken":
            isSaucy?"Saucy Baked Chicken":isSpicy?"Spicy Air Fryer Chicken":
            isAsian?"Teriyaki Chicken Bowl":"Garlic Herb Chicken",
      emoji:"🍗", method:cookMethod!=="Any"?cookMethod:"Air Fryer", ezLevel,
      tags:["High Protein",isSpicy?"Spicy":"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Gluten-Free","Keto"].filter(Boolean),
      totalCal:isSaucy?370:340, totalProtein:40, totalCarbs:hasRice?44:4, totalFat:18,
      activeMinutes:4, stepCount:3,
      components:[
        {name:"Chicken Thighs (boneless, skinless)",type:"Protein",grams:170,cal:220,protein:35,carbs:0,fat:9,weighRaw:true},
        {name:sauceLabel,type:isAsian||isSpicy||isSaucy?"Sauce":"Seasoning",grams:sauceG,cal:sauceCal,protein:1,carbs:isSaucy?6:2,fat:0,weighRaw:false},
        ...(hasRice?[{name:carbName,type:"Carb",grams:carbGrams,cal:carbCal,protein:carbP,carbs:carbC,fat:carbF,weighRaw:false}]:[]),
        ...(veg ? [{name:veg,type:"Veg",grams:vegGrams,cal:vegCal,protein:vegP,carbs:vegC,fat:vegF,weighRaw:false}] : []),
      ],
      toppings: isSaucy?[{name:"Extra sauce over top",info:"go heavy"},{name:"Parmesan",info:"1 tbsp = 22 cal"}]
               :isSpicy?[{name:"Extra Hot Sauce",info:"1 tsp = 0 cal"},{name:"Lime squeeze",info:"5 cal"}]
               :[{name:"Hot Sauce",info:"1 tsp = 0 cal"},{name:"Parmesan",info:"1 tbsp = 22 cal"}],
      steps:[
        (isSaucy?"Generously coat":"Coat")+" chicken with "+sauceLabel+(isSaucy?" — don't be shy.":".")+" "+(cookMethod==="Bake"?"Place on foil-lined sheet.":"Place in air fryer."),
        cookMethod==="Bake"?"Bake 400°F 20–22 min.":"Air fry 400°F 18–20 min, flip at 10 min.",
        "Microwave rice 90 sec + steam veg 3 min."+(isSaucy?" Spoon extra sauce over bowl.":""),
      ],
    });
  }
  if (hasBeef) {
    const beefSauce = isSaucy&&isSpicy?"Sriracha+Soy+Garlic+Honey (heavy)":
                      isSaucy&&isAsian?"Teriyaki Sauce (generous)":
                      isSaucy?"Rao's Marinara (heavy)":
                      isAsian||isSpicy?"Soy+Sriracha+Garlic+Honey":"Canned Diced Tomatoes";
    const beefName = isSaucy&&isSpicy?"Spicy Saucy Beef Bowl":isSaucy&&isAsian?"Teriyaki Beef Bowl":
                     isSaucy?"Saucy Beef & Rice":isSpicy?"Spicy Garlic Beef Bowl":
                     isAsian?"Asian Beef Bowl":"Ground Beef Rice Bowl";
    const beefSauceG = isSaucy?80:isAsian||isSpicy?45:120;
    const beefSauceCal = isSaucy&&isAsian?90:isSaucy?80:isAsian||isSpicy?45:25;
    results.push({
      name:beefName, emoji:"🥩", method:cookMethod!=="Any"?cookMethod:"Slow Cooker", ezLevel,
      tags:["High Protein",isSpicy?"Spicy":"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Bulk Friendly","Meal Prep"].filter(Boolean),
      totalCal:isSaucy?560:520, totalProtein:45, totalCarbs:48, totalFat:isSaucy?16:14,
      activeMinutes:5, stepCount:4,
      components:[
        {name:"Ground Beef (93% lean)",type:"Protein",grams:142,cal:195,protein:30,carbs:0,fat:7,weighRaw:true},
        {name:beefSauce,type:isSaucy||isAsian||isSpicy?"Sauce":"Veg/Sauce",grams:beefSauceG,cal:beefSauceCal,protein:1,carbs:isSaucy?8:6,fat:0,weighRaw:false},
        {name:carbName,type:"Carb",grams:carbGrams,cal:carbCal,protein:carbP,carbs:carbC,fat:carbF,weighRaw:false},
        ...(veg ? [{name:veg,type:"Veg",grams:vegGrams,cal:vegCal,protein:vegP,carbs:vegC,fat:vegF,weighRaw:false}] : []),
      ],
      toppings:isSaucy&&isSpicy?[{name:"Extra sriracha",info:"1 tsp = 5 cal"},{name:"Extra sauce",info:"pour liberally"}]
              :isSaucy?[{name:"Extra sauce",info:"go heavy"},{name:"Sour Cream",info:"2 tbsp = 60 cal"}]
              :isSpicy?[{name:"Extra Sriracha",info:"1 tsp = 5 cal"},{name:"Cheddar",info:"¼ cup = 110 cal"}]
              :[{name:"Cheddar",info:"¼ cup = 110 cal"},{name:"Sour Cream",info:"2 tbsp = 60 cal"}],
      steps:[
        isAsian||isSpicy?"Mix: 2 tbsp soy + 1 tbsp sriracha + 1 tsp garlic powder + 1 tsp honey. Add beef + sauce to slow cooker."
          :"Add beef + "+(isSaucy?"generous sauce":"canned tomatoes")+" to slow cooker. Break up beef.",
        "Cook HIGH 2 hrs or LOW 4 hrs.",
        "Microwave rice 90 sec + steam veg 3 min.",
        "Build bowl."+(isSaucy?" Spoon extra sauce over top.":""),
      ],
    });
  }
  if (hasTurkey) {
    const turkeySauce = isSaucy&&isSpicy?"Sriracha+Soy (heavy)":isSaucy&&isAsian?"Teriyaki Sauce (generous)":
                        isSaucy?"Marinara (heavy)":isAsian||isSpicy?"Soy+Sriracha+Garlic+Honey":"Garlic Herb Seasoning";
    const turkeyName = isSaucy&&isSpicy?"Spicy Saucy Ground Turkey":isSaucy&&isAsian?"Teriyaki Turkey Bowl":
                       isSaucy?"Saucy Ground Turkey":isSpicy?"Spicy Turkey Bowl":
                       isAsian?"Asian Turkey Bowl":"Garlic Herb Turkey Bowl";
    const turkeySauceG = isSaucy?70:isAsian||isSpicy?35:3;
    const turkeySauceCal = isSaucy&&isAsian?80:isSaucy?60:isAsian||isSpicy?30:10;
    results.push({
      name:turkeyName, emoji:"🦃", method:cookMethod!=="Any"?cookMethod:"Skillet", ezLevel,
      tags:["High Protein","Lean",isSpicy?"Spicy":"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Bulk Friendly"].filter(Boolean),
      totalCal:isSaucy?580:540, totalProtein:46, totalCarbs:48, totalFat:isSaucy?18:16,
      activeMinutes:6, stepCount:4,
      components:[
        {name:"Ground Turkey (93% lean)",type:"Protein",grams:170,cal:200,protein:35,carbs:0,fat:6,weighRaw:true},
        {name:turkeySauce,type:isSaucy||isAsian||isSpicy?"Sauce":"Seasoning",grams:turkeySauceG,cal:turkeySauceCal,protein:1,carbs:isSaucy?8:2,fat:0,weighRaw:false},
        {name:carbName,type:"Carb",grams:carbGrams,cal:carbCal,protein:carbP,carbs:carbC,fat:carbF,weighRaw:false},
        ...(veg ? [{name:veg,type:"Veg",grams:vegGrams,cal:vegCal,protein:vegP,carbs:vegC,fat:vegF,weighRaw:false}] : []),
      ],
      toppings:isSaucy&&isSpicy?[{name:"Extra sriracha",info:"1 tsp = 5 cal"},{name:"Hot sauce",info:"pour liberally"}]
              :isSaucy?[{name:"Extra sauce",info:"go heavy"},{name:"Parmesan",info:"1 tbsp = 22 cal"}]
              :isSpicy?[{name:"Extra Sriracha",info:"1 tsp = 5 cal"},{name:"Black Pepper",info:"to taste"}]
              :[{name:"Parmesan",info:"1 tbsp = 22 cal"},{name:"Fresh Herbs",info:"basil or oregano"}],
      steps:[
        isAsian||isSpicy?"Heat skillet. Add ground turkey + mix in soy+sriracha+garlic+honey. Brown 4-5 min.":"Heat skillet over med-high. Add turkey, break it apart, and cook 5-6 min until no pink remains. "+(isSaucy?"Add sauce generously.":"Add seasoning."),
        "Stir "+(isSaucy?"frequently":"occasionally")+". Cook 2-3 min more.",
        "Microwave rice 90 sec + steam veg 3 min.",
        "Build bowl."+(isSaucy?" Spoon extra sauce over top.":""),
      ],
    });
  }

  if (hasSalmon) {
    const salmonSauce = isSaucy&&isSpicy?"Sriracha+Soy (heavy)":isSaucy&&isAsian?"Teriyaki (generous)":
                        isSaucy?"Ponzu+Soy (heavy)":isSpicy?"Sriracha+Soy":
                        isAsian?"Teriyaki Sauce":"Olive Oil+Lemon Pepper";
    const salmonG = isSaucy?55:25; const salmonCal = isSaucy?50:20;
    results.push({
      name:isSaucy&&isSpicy?"Spicy Saucy Salmon":isSaucy&&isAsian?"Saucy Teriyaki Salmon":
           isSaucy?"Ponzu Glazed Salmon":isSpicy?"Spicy Sriracha Salmon":
           isAsian?"Teriyaki Salmon Bowl":"Lemon Herb Salmon",
      emoji:"🐠", method:cookMethod!=="Any"?cookMethod:"Bake", ezLevel,
      tags:["High Protein","Omega-3",isSpicy?"Spicy":"Neutral",isSaucy?"Saucy":"",isAsian?"Asian-Inspired":"Gluten-Free"].filter(Boolean),
      totalCal:isSaucy?460:430, totalProtein:42, totalCarbs:44, totalFat:20, activeMinutes:3, stepCount:3,
      components:[
        {name:"Salmon Fillet",type:"Protein",grams:170,cal:280,protein:36,carbs:0,fat:14,weighRaw:true},
        {name:salmonSauce,type:"Sauce",grams:salmonG,cal:salmonCal,protein:1,carbs:isSaucy?6:2,fat:1,weighRaw:false},
        {name:carbName,type:"Carb",grams:carbGrams,cal:carbCal,protein:carbP,carbs:carbC,fat:carbF,weighRaw:false},
        ...(veg ? [{name:veg,type:"Veg",grams:vegGrams,cal:vegCal,protein:vegP,carbs:vegC,fat:vegF,weighRaw:false}] : []),
      ],
      toppings:isSaucy?[{name:"Pour pan drippings over bowl",info:"don't waste it"},{name:"Sesame seeds",info:"1 tsp = 17 cal"}]
              :[{name:"Sesame seeds",info:"1 tsp = 17 cal"},{name:isSpicy?"Extra Sriracha":"Lemon squeeze",info:"5 cal"}],
      steps:[
        "Place salmon skin-down on foil-lined sheet. "+(isSaucy?"Generously pour":"Drizzle")+" "+salmonSauce+" over top.",
        "Bake 425°F 12–14 min.",
        "Microwave rice 90 sec + steam veg 3 min."+(isSaucy?" Pour pan drippings over bowl.":""),
      ],
    });
  }

  if (hasEggs || hasEggWhites) {
    // Spicy eggs only
    if (isSpicy && ingredients.length === 1) {
      results.push({
        name: "Spicy Scrambled Eggs",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        tags: ["Breakfast", "High Protein", "Spicy", "Quick"],
        totalCal: 340,
        totalProtein: 32,
        totalCarbs: 2,
        totalFat: 24,
        activeMinutes: 5,
        stepCount: 2,
        components: [
          {name: "Whole Eggs (3 large)", type: "Protein", grams: 150, cal: 210, protein: 18, carbs: 2, fat: 15, weighRaw: false},
          {name: "Butter", type: "Fat", grams: 14, cal: 100, protein: 0, carbs: 0, fat: 11, weighRaw: false},
          {name: "Sriracha", type: "Sauce", grams: 10, cal: 15, protein: 0, carbs: 1, fat: 0, weighRaw: false},
          {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false},
        ],
        toppings: [{name: "Extra Sriracha", info: "1 tsp = 5 cal"}, {name: "Black Pepper", info: "pinch = 0 cal"}],
        steps: [
          "Heat butter in pan over medium heat.",
          "Crack 3 eggs, scramble until just set. Top with cheese and sriracha.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
    // Plain eggs only
    else if (ingredients.length === 1 && !isSpicy) {
      results.push({
        name: "Classic Scrambled Eggs",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        tags: ["Breakfast", "High Protein", "Neutral", "Quick"],
        totalCal: 310,
        totalProtein: 30,
        totalCarbs: 0,
        totalFat: 23,
        activeMinutes: 5,
        stepCount: 2,
        components: [
          {name: "Whole Eggs (3 large)", type: "Protein", grams: 150, cal: 210, protein: 18, carbs: 2, fat: 15, weighRaw: false},
          {name: "Butter", type: "Fat", grams: 14, cal: 100, protein: 0, carbs: 0, fat: 11, weighRaw: false},
          {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false},
        ],
        toppings: [{name: "Sea Salt", info: "pinch = 0 cal"}, {name: "Black Pepper", info: "pinch = 0 cal"}],
        steps: [
          "Heat butter in pan over medium heat.",
          "Crack 3 eggs, scramble until just set. Top with cheese, salt, and pepper.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
    // Eggs + hash browns
    else if (hasHashBrowns) {
      results.push({
        name: "Hash Brown Egg Skillet",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        tags: ["Breakfast", "High Protein", "Comfort", "Quick"],
        totalCal: 380,
        totalProtein: 28,
        totalCarbs: 28,
        totalFat: 18,
        activeMinutes: 8,
        stepCount: 3,
        components: [
          {name: "Frozen Hash Browns", type: "Carb", grams: 113, cal: 130, protein: 2, carbs: 22, fat: 4, weighRaw: false},
          {name: "Whole Eggs (2 large)", type: "Protein", grams: 100, cal: 140, protein: 12, carbs: 1, fat: 10, weighRaw: false},
          {name: "Butter", type: "Fat", grams: 14, cal: 100, protein: 0, carbs: 0, fat: 11, weighRaw: false},
          {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false},
        ],
        toppings: [{name: "Hot Sauce", info: "1 tsp = 0 cal"}, {name: "Salsa", info: "2 tbsp = 10 cal"}],
        steps: [
          "Cook hash browns in skillet 3–4 min per side until golden. Set aside.",
          "In same pan, crack eggs and scramble until just set.",
          "Top with cheese and hash browns. Serve with hot sauce.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }
    // Eggs + spinach
    else if (hasSpinach) {
      results.push({
        name: "Spinach & Egg Scramble",
        emoji: "🍳",
        method: "Stovetop",
        ezLevel,
        tags: ["Breakfast", "High Protein", "Neutral", "Quick"],
        totalCal: 290,
        totalProtein: 30,
        totalCarbs: 8,
        totalFat: 18,
        activeMinutes: 6,
        stepCount: 3,
        components: [
          {name: "Frozen Spinach (microwave bag)", type: "Veg", grams: 85, cal: 25, protein: 3, carbs: 3, fat: 0, weighRaw: false},
          {name: "Whole Eggs (3 large)", type: "Protein", grams: 150, cal: 210, protein: 18, carbs: 2, fat: 15, weighRaw: false},
          {name: "Butter", type: "Fat", grams: 10, cal: 80, protein: 0, carbs: 0, fat: 9, weighRaw: false},
          {name: "Shredded Cheddar (bagged)", type: "Cheese", grams: 28, cal: 110, protein: 7, carbs: 0, fat: 9, weighRaw: false},
        ],
        toppings: [{name: "Salt & Pepper", info: "pinch = 0 cal"}, {name: "Hot Sauce", info: "1 tsp = 0 cal"}],
        steps: [
          "Microwave spinach 2 min. Squeeze out all water.",
          "Heat butter in pan, add spinach, then crack eggs and scramble.",
          "Top with cheese and serve.",
        ],
        ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
      });
    }

    // Always offer Deviled Eggs as second option
    results.push({
      name: "Deviled Eggs",
      emoji: "🥚",
      method: "No Cook",
      ezLevel,
      tags: ["Breakfast", "High Protein", "Keto", "Low Carb", "Snack"],
      totalCal: 210,
      totalProtein: 18,
      totalCarbs: 2,
      totalFat: 14,
      activeMinutes: 5,
      stepCount: 3,
      components: [
        {name: "Pre-Boiled Eggs (6)", type: "Protein", grams: 150, cal: 210, protein: 18, carbs: 2, fat: 14, weighRaw: false},
        {name: "Hellmann's Light Mayo", type: "Fat", grams: 15, cal: 35, protein: 0, carbs: 0, fat: 3, weighRaw: false},
        {name: "Yellow Mustard (squeeze bottle)", type: "Flavor", grams: 5, cal: 3, protein: 0, carbs: 0, fat: 0, weighRaw: false},
      ],
      toppings: [{name: "Paprika (shaker)", info: "pinch = 0 cal"}, {name: "Pickle Relish", info: "1 tsp = 5 cal"}],
      steps: [
        "Halve pre-boiled eggs lengthwise. Pop yolks into bowl.",
        "Mash yolks with mayo + mustard until smooth.",
        "Fill whites. Shake paprika on top.",
      ],
      ezChecks: {stepsOk: true, noKnifeWork: true, microwaveCarbs: false, bottledSauces: true, noPeeling: true, noScratchSauce: true},
    });
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
