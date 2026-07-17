// QuickPrep recipe data -- simple recipe suggestion app (no macros/nutrition info)
// Each recipe: id, name, method, mealType (breakfast | lunch_dinner | snack),
// proteins (array of protein categories present), flavor (single flavor/cuisine tag),
// activeTime (minutes -- hands-on prep/cook time only), totalTime (minutes -- activeTime
// plus any passive time like baking, air frying, or slow cooking; equals activeTime for
// methods with no passive gap), components (ingredients: name/quantity/unit), toppings
// (optional garnish names), instructions (cooking steps), tags (optional array, e.g.
// 'high_protein', 'grab_and_go' -- used for quick-filter chips in Browse/Kitchen),
// pantryTags (array of common-staple ids from pantryStaples.js that this recipe's
// ingredients draw from -- used for "what can I make with what I have" matching).

export const MEAL_TYPES = ['breakfast', 'lunch_dinner', 'snack'];

export const PROTEINS = ['chicken', 'beef', 'turkey', 'fish', 'eggs', 'pork'];

export const FLAVORS = ['spicy', 'saucy', 'neutral', 'asian', 'italian', 'mediterranean', 'caribbean', 'bbq', 'american', 'mexican'];

export const RECIPES = [
  {
    "id": 1,
    "name": "Teriyaki Cod Bowl",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "asian",
    "activeTime": 3,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Cod Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Green Beans (steam-bag frozen)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Sriracha"
    ],
    "instructions": [
      "Pat cod dry with paper towels. Place on foil-lined baking sheet. Drizzle teriyaki sauce over the fish.",
      "Bake at 425°F for 12–14 minutes until the fish flakes easily with a fork.",
      "While the oven heats, microwave rice pouch for 90 seconds. Microwave green beans steam-bag for 3 minutes. Season the green beans with a pinch of garlic powder and sesame seeds. Arrange rice on a plate, top with cod, and add green beans to the side."
    ],
    "totalTime": 17,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 2,
    "name": "Spicy Asian Cod Bowl",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Cod Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Soy Sauce + Sriracha",
        "quantity": 25,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Green Beans (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Sriracha",
      "Sesame Seeds"
    ],
    "instructions": [
      "Pat cod dry with paper towel.",
      "Mix soy sauce + sriracha + a small squeeze of honey in small bowl. Honey rounds the heat and prevents the sauce tasting flat. Brush over cod on foil-lined sheet. Dust with garlic powder.",
      "Bake 425°F 12–14 min.",
      "Rest cod 1 min.",
      "Microwave rice 90 sec + steam-bag beans 3 min. Build bowl — toppings separate."
    ],
    "totalTime": 19,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "hot_sauce",
      "soy_sauce"
    ]
  },
  {
    "id": 3,
    "name": "Air Fryer Chicken Thighs",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 5,
        "unit": "spray"
      },
      {
        "name": "Garlic Herb Seasoning (shaker)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Parmesan"
    ],
    "instructions": [
      "Spray chicken with olive oil spray. Shake seasoning over both sides.",
      "Air fry 400°F for 18–20 min, flip once at 10 min.",
      "Melt butter and brush over the hot chicken right out of the air fryer -- it picks up the garlic-herb flavor and keeps the chicken from tasting dry. Rest 2 min.",
      "Add toppings on the side."
    ],
    "totalTime": 24,
    "pantryTags": [
      "onion_garlic",
      "butter"
    ]
  },
  {
    "id": 5,
    "name": "Deviled Eggs",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Pre-Boiled Eggs",
        "quantity": 150,
        "unit": "count"
      },
      {
        "name": "Light Mayo",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Yellow Mustard (squeeze bottle)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Paprika (shaker)",
      "Pickle Relish"
    ],
    "instructions": [
      "If your eggs aren't already boiled: place them in a pot, cover with about an inch of water, bring to a boil, then cover and remove from heat for 10-12 minutes. Cool in ice water before peeling.",
      "Halve pre-boiled eggs lengthwise. Pop yolks into bowl.",
      "Mash yolks with mayo + mustard until smooth.",
      "Fill whites. Shake paprika on top."
    ],
    "totalTime": 5,
    "pantryTags": [
      "eggs"
    ]
  },
  {
    "id": 6,
    "name": "Slow Cooker Beef Rice Bowl",
    "method": "Slow Cooker",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes",
        "quantity": 480,
        "unit": "ml"
      },
      {
        "name": "Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Garlic Powder (2 tsp)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (4 tsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Salt (¼ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Tomato Paste (2 tbsp)",
        "quantity": 32,
        "unit": "g"
      },
      {
        "name": "Worcestershire Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream",
      "Hot Sauce"
    ],
    "instructions": [
      "Add beef, canned tomatoes, tomato paste, Worcestershire, garlic powder, Italian seasoning, and salt to the slow cooker. Break up beef roughly and stir to combine.",
      "Cook HIGH 2 hrs or LOW 4 hrs.",
      "Divide the beef mixture evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave a rice pouch 90 sec + a steam-bag veg 3 min. Build bowl with beef mixture. Toppings on the side."
    ],
    "totalTime": 245,
    "pantryTags": [
      "rice",
      "canned_tomatoes",
      "frozen_veg",
      "ground_beef",
      "onion_garlic"
    ]
  },
  {
    "id": 7,
    "name": "Sheet Pan Turkey Meatballs",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey",
      "eggs"
    ],
    "flavor": "italian",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Panko Breadcrumbs",
        "quantity": 20,
        "unit": "g"
      },
      {
        "name": "Egg White (carton pour)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Italian Seasoning (1 tbsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Grated Parmesan (2 tbsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Salt (pinch)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (jarred, ⅓ cup)",
        "quantity": 80,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Shredded Mozzarella"
    ],
    "instructions": [
      "Mix turkey, breadcrumbs, egg white, Italian seasoning, garlic powder, parmesan, and salt in a bowl until just combined.",
      "Roll into ~1.5-inch balls onto foil-lined baking sheet.",
      "Bake 400°F for 18–20 min.",
      "Warm the marinara (microwave 60 sec) and toss the meatballs in it right on the sheet pan. Top with mozzarella."
    ],
    "totalTime": 28,
    "pantryTags": [
      "eggs",
      "cheese",
      "onion_garlic",
      "canned_tomatoes"
    ]
  },
  {
    "id": 8,
    "name": "Salmon Lemon Herb Bake",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "components": [
      {
        "name": "Salmon Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Lemon Pepper Seasoning (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Squeeze",
      "Hot Sauce"
    ],
    "instructions": [
      "Melt butter and mix with the lemon pepper seasoning. Brush over the salmon on a foil-lined sheet.",
      "Bake 425°F for 12–14 min.",
      "Microwave steam-bag broccoli 4 min. Plate together — toppings separate."
    ],
    "totalTime": 17,
    "pantryTags": [
      "frozen_veg",
      "butter"
    ]
  },
  {
    "id": 9,
    "name": "Greek Yogurt Power Bowl",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Nonfat Greek Yogurt",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Frozen Blueberries (thawed)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Vanilla Whey Protein (1 scoop)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Granola (2 tbsp)",
      "Chia Seeds (1 tsp)"
    ],
    "instructions": [
      "Mix protein powder into yogurt with a spoon until smooth.",
      "Spoon blueberries over top. Drizzle honey. Add toppings to taste."
    ],
    "totalTime": 2,
    "pantryTags": [
      "greek_yogurt"
    ]
  },
  {
    "id": 10,
    "name": "Egg White Scramble",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "components": [
      {
        "name": "Egg White Carton (liquid)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Shredded Cheddar (bagged)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Everything Bagel Seasoning"
    ],
    "instructions": [
      "Spray pan with cooking spray on medium heat. Add spinach and cook 1 minute until just wilted. Season the spinach with a pinch of garlic powder and onion powder.",
      "Pour in egg whites. Scramble until just set.",
      "Top with cheese. Slide onto plate — hot sauce on the side."
    ],
    "totalTime": 5,
    "pantryTags": [
      "eggs",
      "cheese"
    ]
  },
  {
    "id": 11,
    "name": "Protein Pancakes",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 8,
    "components": [
      {
        "name": "Protein Pancake Mix (dry 1 cup)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Whole Egg",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Almond Milk (unsweetened)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 10,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Allulose Syrup",
      "Nut Butter (1 tbsp)"
    ],
    "instructions": [
      "Mix pancake mix + egg + almond milk + honey in bowl until smooth.",
      "Spray skillet and heat medium. Pour ⅓ cup batter per pancake. Cook 2 min per side.",
      "Stack on plate — syrup on the side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "eggs",
      "milk"
    ]
  },
  {
    "id": 12,
    "name": "PB Banana Protein Shake",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "protein_powder"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Chocolate Protein Powder (1 scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Frozen Banana (medium)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "PB2 Powder (2 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Almond Milk (unsweetened)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Ice Cubes",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra PB2 on top",
      "Cocoa Nibs"
    ],
    "instructions": [
      "Add protein powder, frozen banana, PB2, and almond milk to blender.",
      "Pulse until smooth. Add ice and blend again. Pour into glass."
    ],
    "totalTime": 2,
    "pantryTags": [
      "milk"
    ]
  },
  {
    "id": 13,
    "name": "Smoked Salmon Bagel",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Bagel Thin",
        "quantity": 45,
        "unit": "g"
      },
      {
        "name": "Light Cream Cheese (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Smoked Salmon (sliced)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Capers (drained)",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Squeeze",
      "Dill (fresh or dried)"
    ],
    "instructions": [
      "Toast bagel thin. Spread cream cheese evenly.",
      "Layer smoked salmon + capers. Squeeze lemon over top."
    ],
    "totalTime": 3,
    "pantryTags": [
      "bread",
      "cheese",
      "canned_fish"
    ]
  },
  {
    "id": 14,
    "name": "Cottage Cheese Toast",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Whole Grain Toast (2 slices)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Cottage Cheese",
        "quantity": 112,
        "unit": "g"
      },
      {
        "name": "Everything Bagel Seasoning",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 12,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Black Pepper",
      "Red Pepper Flakes"
    ],
    "instructions": [
      "Toast bread until golden. Spread cottage cheese on each slice.",
      "Sprinkle everything seasoning, drizzle honey, season with pepper."
    ],
    "totalTime": 3,
    "pantryTags": [
      "bread",
      "cottage_cheese"
    ]
  },
  {
    "id": 15,
    "name": "Protein Overnight Oats",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy",
      "protein_powder"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rolled Oats (dry ½ cup)",
        "quantity": 45,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt",
        "quantity": 170,
        "unit": "ml"
      },
      {
        "name": "Chocolate Protein Powder (1 scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Almond Milk (unsweetened)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Frozen Blueberries",
      "Chia Seeds"
    ],
    "instructions": [
      "Mix oats, yogurt, protein powder, almond milk, honey in container.",
      "Refrigerate overnight. Stir before eating. Top with berries and seeds."
    ],
    "totalTime": 3,
    "pantryTags": [
      "greek_yogurt",
      "oats",
      "milk"
    ]
  },
  {
    "id": 16,
    "name": "Scrambled Eggs & Turkey Sausage",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs",
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Whole Eggs (3 large)",
        "quantity": 150,
        "unit": "count"
      },
      {
        "name": "Turkey Sausage Links (pre-cooked, microwave)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Shredded Cheddar (bagged)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Butter (for pan)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper",
      "Hot Sauce"
    ],
    "instructions": [
      "Microwave turkey sausage 90 sec per package. Heat butter in skillet over medium.",
      "Whisk eggs, pour into skillet. Scramble until just set (~3 min).",
      "Top with cheddar. Chop sausage on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "eggs",
      "cheese",
      "sausage",
      "butter"
    ]
  },
  {
    "id": 17,
    "name": "High Protein Bagel",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "turkey",
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Everything Bagel Thin",
        "quantity": 45,
        "unit": "g"
      },
      {
        "name": "Deli Turkey (4 slices)",
        "quantity": 112,
        "unit": "g"
      },
      {
        "name": "Light Cream Cheese (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Nonfat Greek Yogurt (1 tbsp)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Whole Grain Mustard (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Pepper Seasoning",
      "Cucumber Slices"
    ],
    "instructions": [
      "Toast bagel thin. Mix cream cheese + Greek yogurt spread on both halves.",
      "Layer turkey + mustard. Squeeze lemon pepper, add cucumber."
    ],
    "totalTime": 3,
    "pantryTags": [
      "bread",
      "cheese",
      "greek_yogurt",
      "deli_meat"
    ]
  },
  {
    "id": 18,
    "name": "Avocado Egg Toast",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Whole Grain Toast (2 slices)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Guacamole (2 tbsp)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Pre-Boiled Eggs (2 large, sliced)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Everything Bagel Seasoning",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Lemon Squeeze"
    ],
    "instructions": [
      "If your eggs aren't already boiled: place them in a pot, cover with about an inch of water, bring to a boil, then cover and remove from heat for 10-12 minutes. Cool in ice water before peeling.",
      "Toast bread. Squeeze guac evenly on both slices.",
      "Top with sliced eggs. Season with everything bagel seasoning + pepper flakes."
    ],
    "totalTime": 3,
    "pantryTags": [
      "bread",
      "eggs"
    ]
  },
  {
    "id": 19,
    "name": "Greek Yogurt Parfait",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Nonfat Greek Yogurt",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Frozen Mixed Berries (thawed)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Granola (low-sugar 2 tbsp)",
        "quantity": 20,
        "unit": "g"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Chia Seeds",
      "Flax Seeds"
    ],
    "instructions": [
      "Thaw berries 2 min if needed. Spoon yogurt into bowl.",
      "Layer berries, granola, honey. Top with seeds."
    ],
    "totalTime": 2,
    "pantryTags": [
      "greek_yogurt"
    ]
  },
  {
    "id": 20,
    "name": "Microwave Egg Mug",
    "method": "Microwave",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Egg Whites (carton, ¾ cup)",
        "quantity": 180,
        "unit": "ml"
      },
      {
        "name": "Whole Egg (1 large)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Shredded Cheddar (bagged ¼ cup)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh or jarred 2 tbsp)",
        "quantity": 32,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Chives (dried pinch)"
    ],
    "instructions": [
      "Whisk egg whites + whole egg in microwave-safe mug. Add cheese + salsa. Stir.",
      "Microwave 90 sec. Stir. Microwave 30 sec more until set."
    ],
    "totalTime": 3,
    "pantryTags": [
      "eggs",
      "cheese",
      "salsa"
    ]
  },
  {
    "id": 21,
    "name": "Buffalo Chicken Rice Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 4,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Butter (to coat)",
        "quantity": 3,
        "unit": "g"
      }
    ],
    "toppings": [
      "Blue Cheese Crumbles",
      "Celery Powder"
    ],
    "instructions": [
      "Spray chicken with butter. Air fry 400°F for 16–18 min, shaking halfway.",
      "Microwave rice 90 sec. Microwave broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Toss chicken in hot sauce.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 22,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "butter",
      "hot_sauce"
    ]
  },
  {
    "id": 22,
    "name": "BBQ Chicken Rice Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (3 tbsp)",
        "quantity": 51,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Corn (frozen, thawed)",
      "Red Onion (powder)"
    ],
    "instructions": [
      "Spray chicken with olive oil. Air fry 400°F for 18–20 min, shaking at 10 min.",
      "Microwave rice 90 sec. Brush BBQ sauce on cooked chicken.",
      "Build bowl — extra sauce on the side."
    ],
    "totalTime": 24,
    "pantryTags": [
      "rice"
    ]
  },
  {
    "id": 23,
    "name": "Canned Chicken Rice Bowl",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Canned Chicken (drained, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (microwave bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Sriracha"
    ],
    "instructions": [
      "Microwave rice 90 sec. Microwave frozen veg 3 min.",
      "Mix canned chicken with soy sauce + garlic powder. Build bowl — toppings on side."
    ],
    "totalTime": 2,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 24,
    "name": "Rotisserie Chicken Bowl",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rotisserie Chicken (pre-shredded, 6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (fresh or dried)"
    ],
    "instructions": [
      "Microwave rice 90 sec. Microwave broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Heat rotisserie chicken 60 sec in microwave if cold.",
      "Mix chicken with hot sauce. Build bowl — toppings separate."
    ],
    "totalTime": 3,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "rotisserie_chicken",
      "hot_sauce"
    ]
  },
  {
    "id": 25,
    "name": "Salmon Poke Bowl",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Smoked Salmon Pouch (drained, 6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Frozen Edamame (steam-bag)",
        "quantity": 113,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Nori Strips"
    ],
    "instructions": [
      "Microwave rice 90 sec. Microwave edamame 3 min. Thaw salmon 1 min if frozen.",
      "Mix mayo + soy sauce. Build bowl with salmon on rice. Toppings separate."
    ],
    "totalTime": 3,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "canned_fish",
      "soy_sauce"
    ]
  },
  {
    "id": 26,
    "name": "Honey Garlic Cod Bowl",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Cod Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Honey (1 tbsp)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Green Beans (steam-bag)",
        "quantity": 75,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Oil Drizzle",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Mix honey + soy sauce + garlic powder. Place cod on foil. Drizzle sauce over top.",
      "Bake 425°F for 12–14 min. Microwave rice 90 sec + green beans 3 min.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 18,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 27,
    "name": "Ground Beef Taco Bowl",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (1 packet)",
        "quantity": 25,
        "unit": "g"
      },
      {
        "name": "Water (¼ cup)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Canned Black Beans (½ can, drained)",
        "quantity": 135,
        "unit": "g"
      },
      {
        "name": "Olive Oil (½ tbsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh, ¼ cup)",
        "quantity": 64,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Shredded Cheddar"
    ],
    "instructions": [
      "Heat oil in skillet over medium-high. Brown beef 4–5 min, breaking it up as it cooks.",
      "Add taco seasoning + water. Simmer 2 min, then stir in the salsa. Microwave rice 90 sec + beans 60 sec.",
      "Build bowl — toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "rice",
      "canned_beans",
      "ground_beef",
      "salsa"
    ]
  },
  {
    "id": 28,
    "name": "Pork Tenderloin Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "neutral",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Pork Tenderloin",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (1 tbsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Honey (1 tbsp)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (microwave bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Squeeze",
      "Black Pepper"
    ],
    "instructions": [
      "Mix dijon mustard and honey in a small bowl. Coat the pork tenderloin with half the mixture, reserving the rest.",
      "Spray with oil. Air fry 400°F for 16–18 min, shaking at 9 min. Rest 2 min. Slice.",
      "Drizzle the reserved honey mustard over the sliced pork. Microwave rice 90 sec + veg 3 min. Build bowl."
    ],
    "totalTime": 24,
    "pantryTags": [
      "rice",
      "frozen_veg"
    ]
  },
  {
    "id": 29,
    "name": "Lemon Pepper Shrimp Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Shrimp (16/20 count, thawed)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Lemon Pepper Seasoning (1 tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Squeeze",
      "Parmesan"
    ],
    "instructions": [
      "Pat shrimp dry. Toss with melted butter and lemon pepper seasoning.",
      "Air fry 380°F for 8–10 min, shaking halfway. Microwave rice 90 sec + broccoli 3 min.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 15,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "butter"
    ]
  },
  {
    "id": 30,
    "name": "Greek Chicken Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mediterranean",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Greek Seasoning (1½ tsp)",
        "quantity": 4,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Store-Bought Tzatziki (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Feta Crumbles",
      "Kalamata Olives"
    ],
    "instructions": [
      "Spray chicken with oil. Dust evenly with Greek seasoning.",
      "Air fry 400°F for 18–20 min, shaking at 10 min. Microwave rice 90 sec.",
      "Build bowl with tzatziki drizzled on chicken. Toppings on side."
    ],
    "totalTime": 26,
    "pantryTags": [
      "rice"
    ]
  },
  {
    "id": 31,
    "name": "Slow Cooker Chicken Thighs",
    "method": "Slow Cooker",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "chicken"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless, 4 thighs)",
        "quantity": 680,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Chicken Broth (4 cups)",
        "quantity": 960,
        "unit": "g"
      },
      {
        "name": "Italian Herb Seasoning (4 tbsp)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (2 tsp)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Butter (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Parmesan"
    ],
    "instructions": [
      "Add chicken, broth, and seasonings to slow cooker.",
      "Cook LOW 6–7 hrs or HIGH 3–4 hrs. Shred all the chicken.",
      "Stir in butter and lemon juice until the butter melts into the broth for a richer, brighter sauce.",
      "Divide shredded chicken evenly into 4 containers with a bit of the sauce spooned over each to keep it moist. Refrigerate up to 4 days, or freeze.",
      "Reheat one portion at a time. Serve with toppings on the side."
    ],
    "totalTime": 425,
    "pantryTags": [
      "onion_garlic",
      "broth",
      "butter"
    ]
  },
  {
    "id": 32,
    "name": "Tuna Pasta Salad",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "plant",
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Banza Chickpea Pasta (cooked, 1.5 cups)",
        "quantity": 210,
        "unit": "g"
      },
      {
        "name": "Canned Tuna in Water (drained, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Light Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Yellow Mustard (2 tsp)",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Celery Powder",
      "Black Pepper"
    ],
    "instructions": [
      "Combine cooked pasta + drained tuna in bowl.",
      "Mix mayo + mustard. Fold into pasta. Season to taste."
    ],
    "totalTime": 4,
    "pantryTags": [
      "pasta",
      "canned_fish"
    ]
  },
  {
    "id": 33,
    "name": "Black Bean Quesadilla",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "plant"
    ],
    "flavor": "mexican",
    "activeTime": 8,
    "components": [
      {
        "name": "Flour Tortillas (2 large)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Canned Black Beans (½ can, drained)",
        "quantity": 135,
        "unit": "g"
      },
      {
        "name": "Shredded Mexican Cheese (1 cup)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh, 2 tbsp)",
        "quantity": 32,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sour Cream"
    ],
    "instructions": [
      "Mix black beans with the salsa in a small bowl.",
      "Heat oil in skillet over medium. Place 1 tortilla down. Spread bean mixture + cheese on half.",
      "Fold in half. Cook 2 min per side until golden + cheese melts. Repeat with second tortilla.",
      "Cut into triangles. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "tortillas",
      "canned_beans",
      "cheese",
      "salsa"
    ]
  },
  {
    "id": 34,
    "name": "Microwave Salmon Pouch Bowl",
    "method": "Microwave",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Salmon Pouch (6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Lemon Pepper Seasoning (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Lime Squeeze"
    ],
    "instructions": [
      "Microwave rice 90 sec. Warm salmon pouch in microwave 60 sec.",
      "Build bowl. Season salmon with lemon pepper + hot sauce. Toppings separate."
    ],
    "totalTime": 2,
    "pantryTags": [
      "rice",
      "canned_fish",
      "hot_sauce"
    ]
  },
  {
    "id": 35,
    "name": "High Protein Chili",
    "method": "Slow Cooker",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "turkey",
      "plant"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Canned Red Kidney Beans (4 cans, drained)",
        "quantity": 1080,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes (4 cans, undrained)",
        "quantity": 960,
        "unit": "ml"
      },
      {
        "name": "Chili Seasoning Packet (4 packets)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Olive Oil (4 tsp)",
        "quantity": 20,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream"
    ],
    "instructions": [
      "Heat oil in skillet. Brown turkey in batches if needed, breaking it up, 6–8 min. Transfer to slow cooker.",
      "Add beans, tomatoes, and chili seasoning. Stir well.",
      "Cook LOW 5–6 hrs or HIGH 2–3 hrs. Stir occasionally.",
      "Divide into 4 containers and refrigerate up to 4 days, or freeze. Reheat one portion at a time, topped with cheese + sour cream."
    ],
    "totalTime": 368,
    "pantryTags": [
      "canned_beans",
      "canned_tomatoes"
    ]
  },
  {
    "id": 36,
    "name": "Honey Sriracha Salmon",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "components": [
      {
        "name": "Salmon Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Sriracha Sauce (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tbsp)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Oil Drizzle",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Mix sriracha + honey + garlic powder. Place salmon on foil-lined sheet.",
      "Brush sauce over salmon. Bake 425°F for 12–14 min. Microwave broccoli 3 min.",
      "Plate together — extra sauce on side."
    ],
    "totalTime": 19,
    "pantryTags": [
      "frozen_veg",
      "onion_garlic",
      "hot_sauce"
    ]
  },
  {
    "id": 37,
    "name": "Egg Fried Rice",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "asian",
    "activeTime": 8,
    "components": [
      {
        "name": "White Rice Pouch (cooked, day-old or microwaved 90 sec + cooled)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (3 large, beaten)",
        "quantity": 150,
        "unit": "count"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp)",
        "quantity": 22.5,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Frozen Peas (microwave bag, ¾ cup)",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat sesame oil in large skillet over high heat. Scramble eggs 2 min, remove to plate.",
      "Add rice to skillet, break up clumps. Stir 2 min. Add peas + soy sauce.",
      "Return eggs to skillet, toss everything 1 min. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "rice",
      "eggs",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 38,
    "name": "Chipotle Style Chicken Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken",
      "plant"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Chipotle Seasoning Powder (1 tbsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Canned Black Beans (½ can, drained, microwaved)",
        "quantity": 135,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Chipotle Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Lime Squeeze"
    ],
    "instructions": [
      "Spray chicken with oil. Coat with chipotle seasoning.",
      "Air fry 400°F for 18–20 min, shaking at 10 min. Microwave rice 90 sec + beans 60 sec.",
      "Build bowl with salsa drizzled on chicken, then finish with the chipotle mayo -- the seasoning alone is milder than the name suggests, and this is where the real chipotle flavor comes from. Cheese + lime on side."
    ],
    "totalTime": 26,
    "pantryTags": [
      "rice",
      "canned_beans",
      "salsa"
    ]
  },
  {
    "id": 39,
    "name": "Turkey Lettuce Wraps",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Deli Turkey (6 slices)",
        "quantity": 112,
        "unit": "g"
      },
      {
        "name": "Romaine Lettuce Leaves (4 large)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Guacamole (2 tbsp)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (1 tbsp)",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Pepper Seasoning",
      "Red Onion (powder)"
    ],
    "instructions": [
      "Lay lettuce leaves flat. Spread 1 tsp dijon on each.",
      "Layer turkey on lettuce. Add small squeeze of guac. Roll tightly."
    ],
    "totalTime": 3,
    "pantryTags": [
      "salad_greens",
      "deli_meat"
    ]
  },
  {
    "id": 40,
    "name": "Teriyaki Salmon Bowl",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "asian",
    "activeTime": 4,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Salmon Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (3 tbsp)",
        "quantity": 51,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Edamame (steam-bag)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 2,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Spray salmon with oil. Place on foil-lined sheet. Brush teriyaki sauce over top.",
      "Bake 425°F for 12–14 min. Microwave rice 90 sec + edamame 3 min.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 18,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 41,
    "name": "Beef Jerky & Rice Cakes",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "neutral",
    "activeTime": 1,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Teriyaki Beef Jerky (1 oz)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Plain Rice Cakes (2 large)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Almond Butter Squeeze Pack (1 tbsp)",
        "quantity": 16,
        "unit": "g"
      }
    ],
    "toppings": [
      "Honey Drizzle",
      "Sea Salt"
    ],
    "instructions": [
      "Spread almond butter on rice cakes. Top with beef jerky. Drizzle honey."
    ],
    "totalTime": 1,
    "pantryTags": [
      "rice",
      "soy_sauce"
    ]
  },
  {
    "id": 42,
    "name": "String Cheese & Turkey Roll-Ups",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Deli Turkey (4 slices)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Part-Skim String Cheese (1 stick)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (2 tsp)",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Everything Bagel Seasoning",
      "Hot Sauce"
    ],
    "instructions": [
      "Spread mustard on turkey slice. Place string cheese stick at edge and roll tightly."
    ],
    "totalTime": 2,
    "pantryTags": [
      "cheese",
      "deli_meat"
    ]
  },
  {
    "id": 43,
    "name": "Cottage Cheese & Pineapple",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese",
        "quantity": 112,
        "unit": "g"
      },
      {
        "name": "Canned Pineapple Chunks in Juice (drained, ½ cup)",
        "quantity": 90,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Coconut Flakes (unsweetened)",
      "Chia Seeds"
    ],
    "instructions": [
      "Spoon cottage cheese into bowl. Top with drained pineapple and honey. Add toppings to taste."
    ],
    "totalTime": 2,
    "pantryTags": [
      "cottage_cheese"
    ]
  },
  {
    "id": 44,
    "name": "Hard Boiled Eggs with Hot Sauce",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Pre-Boiled Eggs (2 large)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Hot Sauce (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Everything Bagel Seasoning (½ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper",
      "Sea Salt"
    ],
    "instructions": [
      "If your eggs aren't already boiled: place them in a pot, cover with about an inch of water, bring to a boil, then cover and remove from heat for 10-12 minutes. Cool in ice water before peeling.",
      "Halve pre-boiled eggs. Pour hot sauce over. Sprinkle seasoning on top."
    ],
    "totalTime": 2,
    "pantryTags": [
      "bread",
      "eggs",
      "hot_sauce"
    ]
  },
  {
    "id": 45,
    "name": "Sardines on Toast",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Sardines in Olive Oil (1 tin, drained)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Whole Grain Toast (2 slices)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (2 tsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Capers",
      "Black Pepper"
    ],
    "instructions": [
      "Toast bread. Spread mustard on both slices.",
      "Lay sardines on toast. Squeeze lemon + add capers."
    ],
    "totalTime": 3,
    "pantryTags": [
      "bread",
      "canned_fish"
    ]
  },
  {
    "id": 46,
    "name": "Skyr & Berries",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Plain Skyr (5.3 oz)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Berries (thawed, ½ cup)",
        "quantity": 70,
        "unit": "g"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Almonds (sliced, 1 tbsp)",
      "Granola Cluster"
    ],
    "instructions": [
      "Thaw berries 1 min if frozen. Spoon skyr into bowl. Top with berries and honey."
    ],
    "totalTime": 2,
    "pantryTags": [
      "greek_yogurt"
    ]
  },
  {
    "id": 47,
    "name": "Chicken & Salsa Wrap",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rotisserie Chicken (pre-shredded, 4 oz)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Flour Tortilla (1 large)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Shredded Cheddar (¼ cup)",
        "quantity": 28,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Warm tortilla 30 sec in microwave. Spread salsa down center.",
      "Layer chicken + cheese. Roll tightly. Squeeze lime on top."
    ],
    "totalTime": 3,
    "pantryTags": [
      "tortillas",
      "cheese",
      "rotisserie_chicken",
      "salsa"
    ]
  },
  {
    "id": 48,
    "name": "Protein Pudding",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy",
      "protein_powder"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Nonfat Greek Yogurt",
        "quantity": 170,
        "unit": "ml"
      },
      {
        "name": "Chocolate Protein Powder (1 scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Cocoa Powder (unsweetened, 1 tbsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Almond Milk (unsweetened, ¼ cup)",
        "quantity": 60,
        "unit": "g"
      }
    ],
    "toppings": [
      "Allulose Syrup",
      "Cocoa Nibs"
    ],
    "instructions": [
      "Combine yogurt, protein powder, cocoa powder, and almond milk in bowl.",
      "Whisk until smooth and pudding-like. Top with syrup + cocoa nibs."
    ],
    "totalTime": 2,
    "pantryTags": [
      "greek_yogurt",
      "milk"
    ]
  },
  {
    "id": 49,
    "name": "Edamame Bowl",
    "method": "Microwave",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "plant"
    ],
    "flavor": "spicy",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Frozen Edamame (steam-bag)",
        "quantity": 227,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      },
      {
        "name": "Red Pepper Flakes (pinch)",
        "quantity": 0.1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Sea Salt"
    ],
    "instructions": [
      "Microwave edamame steam-bag 3 min. Pour into bowl.",
      "Drizzle soy sauce + sesame oil. Sprinkle pepper flakes + seeds."
    ],
    "totalTime": 3,
    "pantryTags": [
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 50,
    "name": "Canned Chicken & Crackers",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Canned Chicken (drained, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Whole Grain Crackers (6 crackers)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (1 tbsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Lemon Pepper Seasoning",
      "Celery Powder"
    ],
    "instructions": [
      "Mix canned chicken with mustard + hot sauce.",
      "Spoon onto crackers. Season lightly."
    ],
    "totalTime": 2,
    "pantryTags": [
      "hot_sauce"
    ]
  },
  {
    "id": 51,
    "name": "Classic Smash Burger",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "neutral",
    "activeTime": 6,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Beef (80/20)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "American Cheese Slice",
        "quantity": 21,
        "unit": "g"
      },
      {
        "name": "Brioche Bun",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Ketchup (2 tbsp)",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "Yellow Mustard (1 tbsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Pickle Slices (jar, 2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Salt (pinch)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Black Pepper (pinch)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Onion Powder (pinch)",
        "quantity": 0.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mayonnaise"
    ],
    "instructions": [
      "Heat cast iron skillet screaming hot (~400°F).",
      "Roll beef into a ball and season all over with salt, pepper, and onion powder. Place on skillet and immediately smash flat with spatula.",
      "Cook 2 min without moving. Flip, add cheese, cook 1 min.",
      "Toast bun lightly. Build burger with ketchup, mustard, pickles."
    ],
    "totalTime": 6,
    "pantryTags": [
      "bread",
      "cheese",
      "ground_beef",
      "onion_garlic"
    ]
  },
  {
    "id": 52,
    "name": "BBQ Bacon Burger",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "bbq",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Pre-Cooked Bacon (microwave, 3 strips)",
        "quantity": 42,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (2 tbsp)",
        "quantity": 34,
        "unit": "ml"
      },
      {
        "name": "Cheddar Slice",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Brioche Bun",
        "quantity": 80,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lettuce Leaf",
      "Onion Powder"
    ],
    "instructions": [
      "Heat skillet medium-high. Form beef into patty. Cook 3–4 min per side (~160°F internal).",
      "Microwave bacon strips 2 min. Add cheese to burger last min.",
      "Toast bun. Brush BBQ sauce on inside.",
      "Stack burger + bacon on bun."
    ],
    "totalTime": 8,
    "pantryTags": [
      "bread",
      "cheese",
      "ground_beef",
      "bacon"
    ]
  },
  {
    "id": 53,
    "name": "Turkey Burger",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 7,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Worcestershire Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Brioche Bun",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Yellow Mustard (2 tbsp)",
        "quantity": 10,
        "unit": "ml"
      },
      {
        "name": "Dill Pickle Slices (jar, 2 tbsp)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mayonnaise",
      "Hot Sauce"
    ],
    "instructions": [
      "Mix ground turkey with garlic powder + Worcestershire in bowl.",
      "Form into patty. Heat skillet medium-high. Cook 4–5 min per side (~165°F internal).",
      "Toast bun. Spread mustard. Build burger with pickles + toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "bread",
      "onion_garlic"
    ]
  },
  {
    "id": 54,
    "name": "Spicy Chicken Sandwich",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Chicken Breast (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Brioche Bun",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Light Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Dill Pickle Slices (jar, 2 tbsp)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce Extra",
      "Celery Powder"
    ],
    "instructions": [
      "Air fry chicken breast 400°F for 16–18 min.",
      "Toss cooked chicken in hot sauce. Toast bun.",
      "Spread mayo on bun. Stack chicken + pickles."
    ],
    "totalTime": 23,
    "pantryTags": [
      "bread",
      "hot_sauce"
    ]
  },
  {
    "id": 55,
    "name": "Tuna Melt",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Canned Tuna in Water (drained, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Light Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Yellow Mustard (2 tsp)",
        "quantity": 10,
        "unit": "ml"
      },
      {
        "name": "Whole Grain Bread (2 slices)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Cheddar Slice",
        "quantity": 28,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Juice",
      "Dill (dried)"
    ],
    "instructions": [
      "Mix drained tuna with mayo + mustard in bowl. Spread on bread slices.",
      "Top with cheese slice. Place on foil in air fryer basket.",
      "Air fry 350°F for 6–8 min until cheese melts. Squeeze lemon on top."
    ],
    "totalTime": 14,
    "pantryTags": [
      "bread",
      "cheese",
      "canned_fish"
    ]
  },
  {
    "id": 56,
    "name": "Egg & Cheese Breakfast Sandwich",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs",
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 6,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Egg Whites (carton, ½ cup)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Whole Egg (1 large)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "English Muffin (whole wheat)",
        "quantity": 57,
        "unit": "g"
      },
      {
        "name": "Cheddar Slice",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Turkey Sausage Patty (frozen, pre-cooked)",
        "quantity": 28,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper",
      "Hot Sauce"
    ],
    "instructions": [
      "Microwave sausage patty 60 sec. Toast English muffin.",
      "Scramble egg whites + whole egg in skillet with butter 3 min.",
      "Top muffin with eggs + cheese + sausage."
    ],
    "totalTime": 6,
    "pantryTags": [
      "bread",
      "eggs",
      "cheese",
      "sausage"
    ]
  },
  {
    "id": 57,
    "name": "Rotisserie Chicken Wrap",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken",
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rotisserie Chicken (pre-shredded, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Large Flour Tortilla",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Shredded Cheddar (¼ cup)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Nonfat Greek Yogurt (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Warm tortilla 30 sec in microwave. Spread yogurt down center.",
      "Layer chicken + cheese + salsa. Roll tightly. Squeeze lime on top."
    ],
    "totalTime": 3,
    "pantryTags": [
      "tortillas",
      "cheese",
      "greek_yogurt",
      "rotisserie_chicken",
      "salsa"
    ]
  },
  {
    "id": 58,
    "name": "BLT Protein Wrap",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Deli Turkey (5 slices)",
        "quantity": 94,
        "unit": "g"
      },
      {
        "name": "Pre-Cooked Bacon (microwave, 3 strips)",
        "quantity": 42,
        "unit": "g"
      },
      {
        "name": "Romaine Lettuce (pre-washed, 4 leaves)",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Large Flour Tortilla",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Light Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper",
      "Dijon Mustard"
    ],
    "instructions": [
      "Microwave bacon 2 min. Warm tortilla 30 sec in microwave.",
      "Spread mayo on tortilla. Layer turkey + bacon + lettuce. Roll tightly."
    ],
    "totalTime": 3,
    "pantryTags": [
      "tortillas",
      "salad_greens",
      "bacon",
      "deli_meat"
    ]
  },
  {
    "id": 59,
    "name": "Air Fryer Protein Pizza",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "components": [
      {
        "name": "Naan Flatbread",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Shredded Mozzarella (¾ cup)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Turkey Pepperoni (20 slices)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 0.75,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Extra Parmesan"
    ],
    "instructions": [
      "Place naan on foil in air fryer basket. Spread marinara evenly.",
      "Top with mozzarella + pepperoni. Sprinkle with Italian seasoning and garlic powder.",
      "Air fry 375°F for 8 min until cheese bubbles."
    ],
    "totalTime": 13,
    "pantryTags": [
      "cheese",
      "onion_garlic"
    ]
  },
  {
    "id": 60,
    "name": "Cottage Cheese Pizza Bowl",
    "method": "Microwave",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy",
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese",
        "quantity": 112,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Shredded Mozzarella (½ cup)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Turkey Pepperoni (15 slices)",
        "quantity": 21,
        "unit": "g"
      }
    ],
    "toppings": [
      "Italian Seasoning",
      "Basil (dried)"
    ],
    "instructions": [
      "Spoon cottage cheese into microwave-safe bowl.",
      "Top with marinara + mozzarella + pepperoni. Microwave 2 min until cheese melts. Sprinkle seasonings."
    ],
    "totalTime": 3,
    "pantryTags": [
      "cheese",
      "cottage_cheese"
    ]
  },
  {
    "id": 61,
    "name": "BBQ Chicken Flatbread",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "bbq",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Naan Flatbread",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (3 tbsp)",
        "quantity": 51,
        "unit": "ml"
      },
      {
        "name": "Rotisserie Chicken (pre-shredded, 4 oz)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Shredded Mozzarella (½ cup)",
        "quantity": 56,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Onion Powder",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Place naan on foil in air fryer. Spread BBQ sauce evenly.",
      "Top with shredded chicken + mozzarella. Sprinkle seasonings.",
      "Air fry 375°F for 8 min until cheese melts."
    ],
    "totalTime": 13,
    "pantryTags": [
      "cheese",
      "rotisserie_chicken"
    ]
  },
  {
    "id": 62,
    "name": "Pesto Chicken Flatbread",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mediterranean",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Naan Flatbread",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Jarred Basil Pesto (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Rotisserie Chicken (pre-shredded, 4 oz)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Shredded Mozzarella (½ cup)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Sun-Dried Tomatoes (jarred, 2 tbsp)",
        "quantity": 16,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan",
      "Black Pepper"
    ],
    "instructions": [
      "Place naan on foil in air fryer. Spread pesto evenly.",
      "Top with chicken + mozzarella + sun-dried tomatoes.",
      "Air fry 375°F for 8 min until cheese melts."
    ],
    "totalTime": 13,
    "pantryTags": [
      "cheese",
      "rotisserie_chicken"
    ]
  },
  {
    "id": 63,
    "name": "Beef & Rice Power Bowl",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "asian",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp)",
        "quantity": 22.5,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Honey (1 tbsp)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat oil in skillet over medium-high. Brown beef 4–5 min, breaking it up.",
      "Add soy sauce + garlic + honey. Simmer 2 min. Microwave rice 90 sec + broccoli 3 min.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "ground_beef",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 64,
    "name": "Chicken Teriyaki Noodles",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 8,
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (3 tbsp)",
        "quantity": 51,
        "unit": "g"
      },
      {
        "name": "Ramen-Style Noodles (dried or fresh, any brand -- no seasoning packet)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Frozen Stir Fry Vegetables (1 cup)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Water (3 cups)",
        "quantity": 720,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Boil water in pot. Add noodles, cook per package directions (usually 2–4 min). Add frozen veg, cook 2 min more. Drain.",
      "Heat skillet. Cook chicken 5 min per side. Brush teriyaki sauce on chicken.",
      "Plate noodles + veg, top with chicken. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "pasta",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 65,
    "name": "Shrimp Fried Rice",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish",
      "eggs"
    ],
    "flavor": "asian",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Shrimp (16/20 count, thawed)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (cooked, day-old or cooled)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (2 large, beaten)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp)",
        "quantity": 22.5,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      },
      {
        "name": "Frozen Peas (½ cup)",
        "quantity": 65,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat sesame oil in large skillet over high. Scramble eggs, remove to plate.",
      "Add rice, break up clumps, stir 2 min. Add peas + soy sauce + shrimp.",
      "Return eggs, toss everything 1 min. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "rice",
      "eggs",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 66,
    "name": "Loaded Baked Potato",
    "method": "Microwave",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Russet Potato (medium)",
        "quantity": 180,
        "unit": "g"
      },
      {
        "name": "Canned Chili (condensed, ¾ can)",
        "quantity": 214,
        "unit": "g"
      },
      {
        "name": "Shredded Cheddar (½ cup)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (2 tbsp, sour cream sub)",
        "quantity": 30,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Chives (dried)"
    ],
    "instructions": [
      "Poke potato with fork. Microwave on HIGH 8–10 min until tender.",
      "Microwave chili 2 min in separate bowl. Split potato open. Top with chili, cheese, yogurt."
    ],
    "totalTime": 5,
    "pantryTags": [
      "cheese",
      "potatoes",
      "greek_yogurt"
    ]
  },
  {
    "id": 67,
    "name": "Protein French Toast",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs",
      "protein_powder"
    ],
    "flavor": "neutral",
    "activeTime": 7,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Whole Grain Bread (2 slices)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Egg Whites (carton, ¾ cup)",
        "quantity": 180,
        "unit": "count"
      },
      {
        "name": "Whole Egg (1 large)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Vanilla Protein Powder (½ scoop)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Cinnamon (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Butter (for pan, 1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Allulose Syrup",
      "Cinnamon Powder"
    ],
    "instructions": [
      "Mix egg whites + whole egg + protein powder + cinnamon in shallow bowl.",
      "Heat butter in skillet medium heat. Dip bread slices in mixture, coat both sides.",
      "Cook 2–3 min per side until golden. Serve with sugar-free syrup."
    ],
    "totalTime": 7,
    "pantryTags": [
      "bread",
      "eggs",
      "butter"
    ]
  },
  {
    "id": 68,
    "name": "Turkey Meatball Sub",
    "method": "Microwave",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "italian",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Frozen Turkey Meatballs (6 oz bag)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (½ cup)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Hoagie Roll (6 inch)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Shredded Mozzarella (¼ cup)",
        "quantity": 28,
        "unit": "g"
      }
    ],
    "toppings": [
      "Italian Seasoning (dried)",
      "Parmesan"
    ],
    "instructions": [
      "Microwave frozen meatballs 3–4 min. Microwave marinara 90 sec.",
      "Toss meatballs in sauce. Warm hoagie roll 30 sec in microwave.",
      "Stuff roll with meatballs, sauce, and mozzarella. Top with seasonings."
    ],
    "totalTime": 5,
    "pantryTags": [
      "bread",
      "cheese"
    ]
  },
  {
    "id": 69,
    "name": "Spicy Korean Ground Beef Bowl",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled, 2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat oil in skillet. Brown beef 4–5 min, breaking it up.",
      "Add gochujang + soy + honey + garlic powder. Simmer 2 min. Microwave rice 90 sec.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "ground_beef",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 70,
    "name": "Canned Salmon Caesar Wrap",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Canned Salmon (drained, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Romaine Lettuce (pre-washed bag, 2 cups)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Caesar Dressing (bottled, 3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Parmesan (shredded, 2 tbsp)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Large Flour Tortilla",
        "quantity": 60,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Pepper Seasoning",
      "Black Pepper"
    ],
    "instructions": [
      "Mix canned salmon with 2 tbsp Caesar dressing in bowl.",
      "Lay tortilla flat. Place romaine on top. Add salmon mixture + remaining dressing + parmesan. Roll tightly."
    ],
    "totalTime": 3,
    "pantryTags": [
      "tortillas",
      "cheese",
      "canned_fish",
      "salad_greens"
    ]
  },
  {
    "id": 71,
    "name": "Sweet Potato Cottage Cheese Power Bowl",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "beef",
      "dairy"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Sweet Potato Cubes (pre-cut, 1.5 cups)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Cottage Cheese",
        "quantity": 112,
        "unit": "g"
      },
      {
        "name": "Guacamole (2 tbsp)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Hot Honey (2 tbsp)",
        "quantity": 34,
        "unit": "ml"
      },
      {
        "name": "Taco Seasoning (1 tbsp)",
        "quantity": 8,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Microwave frozen sweet potato cubes 5 min (or air fry 12 min at 400°F if using pre-cut frozen).",
      "Heat skillet over medium-high. Brown ground beef 4–5 min, breaking it up. Stir in taco seasoning + 2 tbsp water, simmer 1 minute.",
      "Build bowl: sweet potato base, seasoned beef on top, cottage cheese dollop.",
      "Squeeze avocado + drizzle hot honey generously over top. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "potatoes",
      "cottage_cheese",
      "ground_beef"
    ]
  },
  {
    "id": 72,
    "name": "Baked Feta Pasta",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "plant"
    ],
    "flavor": "italian",
    "activeTime": 8,
    "components": [
      {
        "name": "Banza Chickpea Pasta (dry, 1.5 cups uncooked)",
        "quantity": 210,
        "unit": "g"
      },
      {
        "name": "Block Feta Cheese",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Canned Cherry Tomatoes (1 can, 14 oz)",
        "quantity": 400,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      },
      {
        "name": "Italian Seasoning (1 tbsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Basil (dried)",
      "Black Pepper"
    ],
    "instructions": [
      "Place feta block in small baking dish. Pour canned cherry tomatoes around it (don't drain completely).",
      "Spray feta lightly with olive oil. Shake Italian seasoning + garlic powder over top.",
      "Bake 400°F for 25 min. Mash feta and tomatoes together until creamy. Toss with cooked pasta."
    ],
    "totalTime": 33,
    "pantryTags": [
      "pasta",
      "canned_tomatoes",
      "cheese",
      "onion_garlic"
    ]
  },
  {
    "id": 73,
    "name": "Cottage Cheese Flatbread",
    "method": "Bake",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy",
      "eggs",
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese (1 cup)",
        "quantity": 224,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (2 large)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Deli Turkey (4 slices)",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Baby Spinach (1 cup)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (1 tbsp)",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Everything Bagel Seasoning",
      "Hot Sauce (optional)"
    ],
    "instructions": [
      "Blend cottage cheese + eggs in blender until completely smooth (no lumps).",
      "Pour onto parchment-lined sheet pan. Spread evenly to ~¼ inch thick. Bake at 350°F for 25–30 minutes until golden brown and set. Cool 5 minutes, then peel off the parchment.",
      "Spread dijon mustard over the flatbread. Layer turkey and spinach over one half, then roll or fold it up like a wrap."
    ],
    "totalTime": 33,
    "pantryTags": [
      "eggs",
      "cottage_cheese",
      "deli_meat",
      "salad_greens"
    ]
  },
  {
    "id": 74,
    "name": "Bang Bang Shrimp Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Shrimp (16/20 count, thawed)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Sweet Chili Sauce (2 tbsp)",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Pre-Cut Cucumber Slices (½ cup)",
        "quantity": 80,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sriracha (1 tsp mixed into sauce)",
      "Sesame Seeds"
    ],
    "instructions": [
      "Mix mayo + sweet chili sauce + ½ tsp sriracha in bowl.",
      "Air fry thawed shrimp 380°F for 8–10 min, shaking halfway. Toss in bang bang sauce.",
      "Microwave rice 90 sec. Build bowl with shrimp, cucumber slices. Toppings on side."
    ],
    "totalTime": 15,
    "pantryTags": [
      "rice"
    ]
  },
  {
    "id": 75,
    "name": "Creamy Sun-Dried Tomato Chicken",
    "method": "Slow Cooker",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "chicken"
    ],
    "flavor": "italian",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless, 4 thighs)",
        "quantity": 680,
        "unit": "g"
      },
      {
        "name": "Sun-Dried Tomatoes (jarred, oil-packed, ¾ cup)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Low-Sodium Chicken Broth (4 cups)",
        "quantity": 960,
        "unit": "g"
      },
      {
        "name": "Heavy Cream (1 cup)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Italian Seasoning (4 tbsp)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Parmesan (½ cup shaker)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (2 tsp)",
        "quantity": 6,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Basil (dried)",
      "Black Pepper"
    ],
    "instructions": [
      "Add chicken, sun-dried tomatoes, broth, Italian seasoning, and garlic powder to slow cooker.",
      "Cook LOW 5–6 hrs or HIGH 2–3 hrs. Stir in heavy cream + parmesan in last 30 min.",
      "Divide chicken and sauce evenly into 4 containers. Refrigerate up to 4 days.",
      "Reheat one portion at a time. Serve over a fresh white rice pouch."
    ],
    "totalTime": 365,
    "pantryTags": [
      "cheese",
      "onion_garlic",
      "broth"
    ]
  },
  {
    "id": 76,
    "name": "Cucumber Tuna Salad",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 4,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Canned Tuna in Water (drained, 5 oz)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Mini Cucumber Slices (pre-cut bag, 1 cup)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Rice Vinegar (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Sesame Seeds (1 tbsp)",
        "quantity": 9,
        "unit": "g"
      },
      {
        "name": "Chili Crisp (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Green Onion (dried)",
      "Extra Sesame Seeds"
    ],
    "instructions": [
      "Mix drained tuna with soy sauce + rice vinegar + sesame oil in bowl.",
      "Add cucumber slices + chili crisp + sesame seeds. Toss gently. Serve cold."
    ],
    "totalTime": 4,
    "pantryTags": [
      "canned_fish",
      "soy_sauce"
    ]
  },
  {
    "id": 77,
    "name": "High Protein Sushi Bake",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "components": [
      {
        "name": "White Rice Pouch (cooked)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Imitation Crab (package, 6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Mayo (3 tbsp)",
        "quantity": 45,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Sriracha (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      },
      {
        "name": "Shredded Mozzarella (¾ cup)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Pre-Cut Cucumber Rounds",
      "Extra Sriracha"
    ],
    "instructions": [
      "Mix cooked rice with mayo + soy sauce + sriracha. Spread half in baking dish.",
      "Layer crab, then remaining rice mixture. Top with mozzarella.",
      "Bake 375°F for 15 min until cheese melts. Top with cucumber + extra sriracha."
    ],
    "totalTime": 21,
    "pantryTags": [
      "rice",
      "cheese",
      "hot_sauce",
      "soy_sauce"
    ]
  },
  {
    "id": 78,
    "name": "Smoked Salmon Everything Bites",
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy",
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Pre-Cut Cucumber Rounds (bag, 12 rounds)",
        "quantity": 180,
        "unit": "g"
      },
      {
        "name": "Cottage Cheese (¼ cup)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Smoked Salmon (sliced, 3 oz)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Everything Bagel Seasoning (½ tsp per bite)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Dill (dried, ½ tsp)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (squeeze)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Capers (2 tbsp)",
      "Black Pepper"
    ],
    "instructions": [
      "Top each cucumber round with 1 tsp cottage cheese. Layer salmon piece on top. Sprinkle everything seasoning + dill. Drizzle lemon."
    ],
    "totalTime": 3,
    "pantryTags": [
      "bread",
      "cottage_cheese",
      "canned_fish"
    ]
  },
  {
    "id": 79,
    "name": "Egg White Fried Rice",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "asian",
    "activeTime": 7,
    "components": [
      {
        "name": "Egg White Carton (liquid, 1 cup)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (day-old cooked, chilled preferred)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp)",
        "quantity": 22.5,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      },
      {
        "name": "Frozen Peas (½ cup)",
        "quantity": 65,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat sesame oil in large skillet over high heat. Scramble egg whites 2 min until just set. Remove to plate.",
      "Add rice to skillet, break up clumps, stir 2 min. Add peas + soy sauce + garlic powder.",
      "Return eggs, toss everything 1 min. Toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "eggs",
      "frozen_veg",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 80,
    "name": "High Protein Birria Tacos",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 10,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (1 packet)",
        "quantity": 25,
        "unit": "g"
      },
      {
        "name": "Red Enchilada Sauce (canned, ¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Beef Broth (small can, 1.5 cups)",
        "quantity": 360,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (2 medium)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Shredded Mexican Cheese (½ cup)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (fresh or dried)"
    ],
    "instructions": [
      "Heat oil in skillet. Brown beef 4–5 min. Add taco seasoning + beef broth + enchilada sauce. Simmer 5 min -- the enchilada sauce gives the broth real birria-style depth instead of relying on the seasoning packet alone.",
      "Dip corn tortillas in the hot broth until crispy (~20 sec per side).",
      "Fill dipped tortillas with cheese + shredded beef from the pan + lime + cilantro. Serve with extra broth for dipping."
    ],
    "totalTime": 10,
    "pantryTags": [
      "tortillas",
      "cheese",
      "ground_beef",
      "broth"
    ]
  },
  {
    "id": 81,
    "name": "Hot Honey Salmon",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 4,
    "components": [
      {
        "name": "Salmon Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Hot Honey (3 tbsp)",
        "quantity": 51,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 2,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Sesame Seeds"
    ],
    "instructions": [
      "Place salmon skin-down on foil-lined sheet. Brush generously with hot honey.",
      "Sprinkle garlic powder. Bake 425°F for 12–14 min. Microwave broccoli 3 min. Squeeze lemon over salmon."
    ],
    "totalTime": 18,
    "pantryTags": [
      "frozen_veg",
      "onion_garlic"
    ]
  },
  {
    "id": 82,
    "name": "Spicy Garlic Shrimp Bowl",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Shrimp (16/20 count, thawed)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Sriracha Sauce (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Sesame Seeds"
    ],
    "instructions": [
      "Heat oil in skillet over high heat. Add shrimp, cook 2–3 min per side.",
      "Mix sriracha + soy sauce + garlic powder + honey. Toss cooked shrimp in sauce.",
      "Microwave rice 90 sec + broccoli 3 min. Build bowl — toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "hot_sauce",
      "soy_sauce"
    ]
  },
  {
    "id": 83,
    "name": "Nashville Hot Chicken Tenders",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (boneless, skinless, sliced into strips)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Cayenne Powder (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Brioche Bun",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Light Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Pickle Slices (jar)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce Extra",
      "Black Pepper"
    ],
    "instructions": [
      "Mix hot sauce + cayenne + garlic powder. Toss chicken strips in mixture.",
      "Air fry 400°F for 12–14 min, shaking halfway. Toast bun lightly.",
      "Spread mayo on bun. Stack chicken tenders + pickles."
    ],
    "totalTime": 20,
    "pantryTags": [
      "bread",
      "onion_garlic",
      "hot_sauce"
    ]
  },
  {
    "id": 84,
    "name": "Spicy Salmon Bowl",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Salmon Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled, 2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Low-Sodium Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Edamame (steam-bag)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Mayo (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Mix gochujang + soy sauce. Place salmon on foil-lined sheet. Brush sauce over top.",
      "Bake 425°F for 12–14 min. Microwave rice 90 sec + edamame 3 min.",
      "Build bowl. Drizzle mayo on salmon. Toppings on side."
    ],
    "totalTime": 19,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 85,
    "name": "Chili Lime Shrimp Tacos",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish",
      "dairy"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Frozen Shrimp (16/20 count, thawed)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Tajin Chili Lime Seasoning (2 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      },
      {
        "name": "Corn Tortillas (2 medium)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (3 tbsp, sour cream sub)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Salsa Verde (jarred, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (fresh or dried)"
    ],
    "instructions": [
      "Spray shrimp with oil. Season with Tajin. Air fry 380°F for 8–10 min.",
      "Warm tortillas 30 sec in microwave. Fill with shrimp.",
      "Top with yogurt + salsa verde + lime + cilantro."
    ],
    "totalTime": 16,
    "pantryTags": [
      "tortillas",
      "greek_yogurt",
      "salsa"
    ]
  },
  {
    "id": 86,
    "name": "Spicy Turkey Taco Bowl",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey",
      "plant"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Chipotle Seasoning Powder (1 tbsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Canned Black Beans (½ can, drained)",
        "quantity": 135,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Salsa Verde (jarred, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Heat oil in skillet. Brown turkey 4–5 min, breaking it up.",
      "Add chipotle seasoning + beans + salsa verde. Simmer 2 min. Microwave rice 90 sec.",
      "Build bowl — toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "canned_beans",
      "salsa"
    ]
  },
  {
    "id": 87,
    "name": "Quick Dan Dan Noodles",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "components": [
      {
        "name": "Ramen-Style Noodles (dried or fresh, any brand -- no seasoning packet)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Ground Pork or Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Chili Crisp (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp)",
        "quantity": 22.5,
        "unit": "g"
      },
      {
        "name": "PB2 Peanut Butter Powder (2 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      },
      {
        "name": "Water (4 cups)",
        "quantity": 960,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Boil water in pot. Add noodles, cook per package directions (usually 2–4 min). Drain.",
      "In skillet, brown ground meat 4–5 min. Add soy sauce + PB2 + chili crisp + sesame oil. Toss noodles into mixture.",
      "Cook 1 min more. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "pasta",
      "soy_sauce",
      "peanut_butter"
    ]
  },
  {
    "id": 88,
    "name": "Spicy Beef & Broccoli",
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Beef & Broccoli Stir-Fry Sauce (bottled, 3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 cup)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Red Pepper Flakes"
    ],
    "instructions": [
      "Heat oil in skillet over medium-high. Brown beef 4–5 min, breaking it up.",
      "Add stir-fry sauce + frozen broccoli + garlic powder. Simmer 3 min.",
      "Microwave rice 90 sec. Build bowl — toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "ground_beef",
      "onion_garlic"
    ]
  },
  {
    "id": 89,
    "name": "Buffalo Shrimp Rice Bowl",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Shrimp (16/20 count, thawed)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Hot Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Ranch Dressing (bottled, 2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 2,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Celery Powder",
      "Parmesan"
    ],
    "instructions": [
      "Spray shrimp with olive oil. Air fry 380°F for 8–10 min. Toss in hot sauce.",
      "Microwave rice 90 sec + broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Build bowl.",
      "Drizzle ranch dressing over shrimp. Toppings on side."
    ],
    "totalTime": 15,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "hot_sauce"
    ]
  },
  {
    "id": 90,
    "name": "Easy Shakshuka",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 12,
    "components": [
      {
        "name": "Marinara Sauce (jar)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Whole Eggs",
        "quantity": 200,
        "unit": "count"
      },
      {
        "name": "Diced Onions (jar, drained)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Onion Powder (seasoning)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (seasoning)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Cumin (shaker)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Smoked Paprika (shaker)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Crumbled Feta",
      "Fresh Parsley (optional)",
      "Sourdough bread for dipping"
    ],
    "instructions": [
      "Heat pan over medium. Add jar onions and cook 2 min until softened and fragrant.",
      "Pour in the marinara sauce. Stir in garlic powder, onion powder, cumin, and smoked paprika. Simmer 3 min.",
      "Create 4 wells in the sauce using a spoon. Crack one egg into each well.",
      "Cover pan with lid. Cook 5-7 min until whites are set but yolks still slightly runny. Crumble feta over top. Serve with sourdough for dipping."
    ],
    "totalTime": 12,
    "pantryTags": [
      "eggs",
      "onion_garlic"
    ]
  },
  {
    "id": 91,
    "name": "Shakshuka from Scratch",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 15,
    "components": [
      {
        "name": "Canned Crushed Tomatoes",
        "quantity": 400,
        "unit": "ml"
      },
      {
        "name": "Whole Eggs",
        "quantity": 200,
        "unit": "count"
      },
      {
        "name": "Diced Onions (jar, drained)",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Olive Oil",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Garlic Powder",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Cumin (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Smoked Paprika (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Red Pepper Flakes (shaker)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Crumbled Feta",
      "Sourdough for dipping",
      "Extra red pepper flakes"
    ],
    "instructions": [
      "Heat olive oil in pan over medium. Add jar onions, cook 3 min until softened.",
      "Add garlic powder, cumin, smoked paprika, red pepper flakes. Stir 30 seconds to bloom spices.",
      "Pour in crushed tomatoes. Season with salt. Simmer 5 min, stirring occasionally, until sauce thickens slightly.",
      "Create 4 wells in sauce. Crack one egg into each well.",
      "Cover and cook 5-7 min until whites are set, yolks runny. Crumble feta over top. Serve with sourdough."
    ],
    "totalTime": 15,
    "pantryTags": [
      "eggs",
      "canned_tomatoes",
      "onion_garlic"
    ]
  },
  {
    "id": 92,
    "name": "Skillet Beef Soy Garlic Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (fresh)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground beef, breaking it apart with a spoon. Cook 5-6 minutes, stirring occasionally, until browned.",
      "Sprinkle garlic powder over beef and stir in soy sauce. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag veg 3 min. Build bowl with rice, top with beef. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "ground_beef",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 93,
    "name": "BBQ Skillet Beef Hash Browns",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (bottled)",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "Frozen Hash Browns (microwaved)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Cheddar Cheese",
      "Fried Onions (canned)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground beef and break apart with a spoon. Cook 5-6 minutes until browned.",
      "Stir in BBQ sauce generously. Cook 1-2 minutes more.",
      "Microwave hash browns per package directions (usually 2-3 min) and steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes.",
      "Scoop hash browns onto plate, top with beef mixture. Add broccoli to the side. Toppings on the side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "frozen_veg",
      "potatoes",
      "ground_beef"
    ]
  },
  {
    "id": 94,
    "name": "Saucy Tomato Beef Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "saucy",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Tomato Paste (1 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan Cheese",
      "Fresh Basil (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground beef and break apart. Cook 4-5 minutes until mostly browned.",
      "Stir in tomato paste and garlic powder, cook 30 sec until fragrant. Add canned tomatoes (with liquid), Italian seasoning, and spinach. Simmer 2 minutes, stirring until the spinach wilts.",
      "Stir in butter off heat for a glossy, rich sauce. Microwave rice 90 sec. Build bowl with rice, top with ground beef & tomato sauce (spinach mixed in)."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "canned_tomatoes",
      "ground_beef",
      "butter"
    ]
  },
  {
    "id": 95,
    "name": "Spicy Korean Gochujang Beef Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 10,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground beef, break apart with a spoon. Cook 5-6 minutes until browned.",
      "In a small bowl, mix gochujang, soy sauce, and honey. Pour over beef and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Build bowl with rice, top with spicy beef, broccoli on side. Sesame & onion on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "ground_beef",
      "soy_sauce"
    ]
  },
  {
    "id": 96,
    "name": "Beef Pasta Marinara Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (bottled)",
        "quantity": 100,
        "unit": "ml"
      },
      {
        "name": "Pasta (dry, protein pasta recommended)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mozzarella Cheese",
      "Parmesan"
    ],
    "instructions": [
      "Bring a pot of water to a boil. Add pasta and cook per package directions (usually 8–10 min) until al dente, then drain.",
      "Meanwhile, heat a skillet over medium-high. Add ground beef, break apart. Cook 5 minutes until browned.",
      "Add marinara sauce and spinach to the meat. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 2 minutes until the spinach wilts.",
      "Combine pasta with the beef sauce on a plate. Cheese on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta",
      "ground_beef"
    ]
  },
  {
    "id": 97,
    "name": "Taco Beef Tortilla Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (packet)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Salsa (bottled, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Corn Tortillas (2, warmed)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground beef and break apart. Cook 5 minutes until browned.",
      "Sprinkle taco seasoning over the meat and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat, not just a dry-seasoned crumble. Simmer 1 minute.",
      "Heat tortillas in a dry pan 30 sec per side. Microwave veg 3 min. Build tacos with ground beef. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "tortillas",
      "frozen_veg",
      "ground_beef",
      "salsa"
    ]
  },
  {
    "id": 98,
    "name": "Creamy Beef Mushroom Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef",
      "eggs"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Beef Stroganoff Sauce Mix (powder)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Sour Cream",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Egg Noodles (microwave cup)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan",
      "Fresh Dill (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground beef and break apart. Cook 5 minutes until browned.",
      "Mix stroganoff sauce powder with ½ cup water per package, then add to beef. Simmer 2 minutes. Remove from heat and stir in sour cream.",
      "Microwave egg noodles per package + microwave broccoli 3 min. Season the broccoli with a pinch of garlic powder and onion powder. Combine noodles with beef stroganoff on plate. Broccoli on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta",
      "frozen_veg",
      "ground_beef"
    ]
  },
  {
    "id": 99,
    "name": "Teriyaki Beef Broccoli Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground beef and break apart. Cook 5 minutes until browned.",
      "Drizzle teriyaki sauce over beef and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with a pinch of garlic powder and sesame seeds. Build bowl with rice, top with beef, broccoli on side. Toppings on top."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "ground_beef",
      "soy_sauce"
    ]
  },
  {
    "id": 100,
    "name": "Skillet Chicken Soy Garlic Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground chicken, breaking it apart with a spoon. Cook 5-6 minutes, stirring occasionally, until cooked through.",
      "Sprinkle garlic powder over chicken and stir in soy sauce. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag veg 3 min. Build bowl with rice, top with chicken. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 101,
    "name": "BBQ Skillet Chicken Hash Browns",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (bottled)",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "Frozen Hash Browns (microwaved)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Cheddar Cheese",
      "Fried Onions (canned)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground chicken and break apart with a spoon. Cook 5-6 minutes until cooked through.",
      "Stir in BBQ sauce generously. Cook 1-2 minutes more.",
      "Microwave hash browns per package (usually 2-3 min) and steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes.",
      "Scoop hash browns onto plate, top with chicken BBQ mixture. Add broccoli to the side. Toppings on the side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "frozen_veg",
      "potatoes"
    ]
  },
  {
    "id": 102,
    "name": "Saucy Tomato Chicken Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "saucy",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Tomato Paste (1 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan Cheese",
      "Fresh Basil (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground chicken and break apart. Cook 4-5 minutes until mostly cooked through.",
      "Stir in tomato paste and garlic powder, cook 30 sec until fragrant. Add canned tomatoes (with liquid), Italian seasoning, and spinach. Simmer 2 minutes, stirring until the spinach wilts.",
      "Stir in butter off heat for a glossy, rich sauce. Microwave rice 90 sec. Build bowl with rice, top with ground chicken & tomato sauce (spinach mixed in)."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "canned_tomatoes",
      "butter"
    ]
  },
  {
    "id": 103,
    "name": "Spicy Gochujang Chicken Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 10,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground chicken, break apart with a spoon. Cook 5-6 minutes until cooked through.",
      "In a small bowl, mix gochujang, soy sauce, and honey. Pour over chicken and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Build bowl with rice, top with spicy chicken, broccoli on side. Sesame & onion on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 104,
    "name": "Chicken Pasta Marinara Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (bottled)",
        "quantity": 100,
        "unit": "ml"
      },
      {
        "name": "Pasta (dry, protein pasta recommended)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mozzarella Cheese",
      "Parmesan"
    ],
    "instructions": [
      "Bring a pot of water to a boil. Add pasta and cook per package directions (usually 8–10 min) until al dente, then drain.",
      "Meanwhile, heat a skillet over medium-high. Add ground chicken, break apart. Cook 5 minutes until cooked through.",
      "Add marinara sauce and spinach to the meat. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 2 minutes until the spinach wilts.",
      "Combine pasta with the chicken sauce on a plate. Cheese on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta"
    ]
  },
  {
    "id": 105,
    "name": "Chicken Taco Tortilla Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (packet)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Salsa (bottled, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Corn Tortillas (2, warmed)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground chicken and break apart. Cook 5 minutes until cooked through.",
      "Sprinkle taco seasoning over the meat and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat, not just a dry-seasoned crumble. Simmer 1 minute.",
      "Heat tortillas in a dry pan 30 sec per side. Microwave veg 3 min. Build tacos with ground chicken. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "tortillas",
      "frozen_veg",
      "salsa"
    ]
  },
  {
    "id": 106,
    "name": "Creamy Chicken Mushroom Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken",
      "eggs"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Beef Stroganoff Sauce Mix (powder)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Sour Cream",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Egg Noodles (microwave cup)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan",
      "Fresh Dill (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground chicken and break apart. Cook 5 minutes until cooked through.",
      "Mix stroganoff sauce powder with ½ cup water per package, then add to chicken. Simmer 2 minutes. Remove from heat and stir in sour cream.",
      "Microwave egg noodles per package + microwave broccoli 3 min. Season the broccoli with a pinch of garlic powder and onion powder. Combine noodles with chicken stroganoff on plate. Broccoli on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta",
      "frozen_veg"
    ]
  },
  {
    "id": 107,
    "name": "Teriyaki Chicken Broccoli Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Chicken (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground chicken and break apart. Cook 5 minutes until cooked through.",
      "Drizzle teriyaki sauce over chicken and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with a pinch of garlic powder and sesame seeds. Build bowl with rice, top with chicken, broccoli on side. Toppings on top."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 108,
    "name": "Skillet Pork Soy Garlic Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground pork, breaking it apart with a spoon. Cook 5-6 minutes, stirring occasionally, until browned.",
      "Sprinkle garlic powder over pork and stir in soy sauce. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag veg 3 min. Build bowl with rice, top with pork. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 109,
    "name": "BBQ Skillet Pork Hash Browns",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (bottled)",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "Frozen Hash Browns (microwaved)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Cheddar Cheese",
      "Fried Onions (canned)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground pork and break apart with a spoon. Cook 5-6 minutes until browned.",
      "Stir in BBQ sauce generously. Cook 1-2 minutes more.",
      "Microwave hash browns per package (usually 2-3 min) and steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes.",
      "Scoop hash browns onto plate, top with pork BBQ mixture. Add broccoli to the side. Toppings on the side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "frozen_veg",
      "potatoes"
    ]
  },
  {
    "id": 110,
    "name": "Saucy Tomato Pork Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "saucy",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Tomato Paste (1 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan Cheese",
      "Fresh Basil (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground pork and break apart. Cook 4-5 minutes until mostly browned.",
      "Stir in tomato paste and garlic powder, cook 30 sec until fragrant. Add canned tomatoes (with liquid), Italian seasoning, and spinach. Simmer 2 minutes, stirring until the spinach wilts.",
      "Stir in butter off heat for a glossy, rich sauce. Microwave rice 90 sec. Build bowl with rice, top with ground pork & tomato sauce (spinach mixed in)."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "canned_tomatoes",
      "butter"
    ]
  },
  {
    "id": 111,
    "name": "Spicy Gochujang Pork Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 10,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground pork, break apart with a spoon. Cook 5-6 minutes until browned.",
      "In a small bowl, mix gochujang, soy sauce, and honey. Pour over pork and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Build bowl with rice, top with spicy pork, broccoli on side. Sesame & onion on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 112,
    "name": "Pork Pasta Marinara Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (bottled)",
        "quantity": 100,
        "unit": "ml"
      },
      {
        "name": "Pasta (dry, protein pasta recommended)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mozzarella Cheese",
      "Parmesan"
    ],
    "instructions": [
      "Bring a pot of water to a boil. Add pasta and cook per package directions (usually 8–10 min) until al dente, then drain.",
      "Meanwhile, heat a skillet over medium-high. Add ground pork, break apart. Cook 5 minutes until browned.",
      "Add marinara sauce and spinach to the meat. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 2 minutes until the spinach wilts.",
      "Combine pasta with the pork sauce on a plate. Cheese on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta"
    ]
  },
  {
    "id": 113,
    "name": "Pork Taco Tortilla Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (packet)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Salsa (bottled, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Corn Tortillas (2, warmed)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground pork and break apart. Cook 5 minutes until browned.",
      "Sprinkle taco seasoning over the meat and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat, not just a dry-seasoned crumble. Simmer 1 minute.",
      "Heat tortillas in a dry pan 30 sec per side. Microwave veg 3 min. Build tacos with ground pork. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "tortillas",
      "frozen_veg",
      "salsa"
    ]
  },
  {
    "id": 114,
    "name": "Creamy Pork Mushroom Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork",
      "eggs"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Beef Stroganoff Sauce Mix (powder)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Sour Cream",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Egg Noodles (microwave cup)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan",
      "Fresh Dill (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground pork and break apart. Cook 5 minutes until browned.",
      "Mix stroganoff sauce powder with ½ cup water per package, then add to pork. Simmer 2 minutes. Remove from heat and stir in sour cream.",
      "Microwave egg noodles per package + microwave broccoli 3 min. Season the broccoli with a pinch of garlic powder and onion powder. Combine noodles with pork stroganoff on plate. Broccoli on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta",
      "frozen_veg"
    ]
  },
  {
    "id": 115,
    "name": "Teriyaki Pork Broccoli Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Pork (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground pork and break apart. Cook 5 minutes until browned.",
      "Drizzle teriyaki sauce over pork and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with a pinch of garlic powder and sesame seeds. Build bowl with rice, top with pork, broccoli on side. Toppings on top."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 116,
    "name": "Skillet Turkey Soy Garlic Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground turkey, breaking it apart with a spoon. Cook 5-6 minutes, stirring occasionally, until cooked through.",
      "Sprinkle garlic powder over turkey and stir in soy sauce. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag veg 3 min. Build bowl with rice, top with turkey. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "onion_garlic",
      "soy_sauce"
    ]
  },
  {
    "id": 117,
    "name": "BBQ Skillet Turkey Hash Browns",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (bottled)",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "Frozen Hash Browns (microwaved)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Cheddar Cheese",
      "Fried Onions (canned)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground turkey and break apart with a spoon. Cook 5-6 minutes until cooked through.",
      "Stir in BBQ sauce generously. Cook 1-2 minutes more.",
      "Microwave hash browns per package (usually 2-3 min) and steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes.",
      "Scoop hash browns onto plate, top with turkey BBQ mixture. Add broccoli to the side. Toppings on the side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "frozen_veg",
      "potatoes"
    ]
  },
  {
    "id": 118,
    "name": "Saucy Tomato Turkey Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "saucy",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Tomato Paste (1 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan Cheese",
      "Fresh Basil (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground turkey and break apart. Cook 4-5 minutes until mostly cooked through.",
      "Stir in tomato paste and garlic powder, cook 30 sec until fragrant. Add canned tomatoes (with liquid), Italian seasoning, and spinach. Simmer 2 minutes, stirring until the spinach wilts.",
      "Stir in butter off heat for a glossy, rich sauce. Microwave rice 90 sec. Build bowl with rice, top with ground turkey & tomato sauce (spinach mixed in)."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "canned_tomatoes",
      "butter"
    ]
  },
  {
    "id": 119,
    "name": "Spicy Gochujang Turkey Rice",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce",
        "quantity": 8,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 10,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground turkey, break apart with a spoon. Cook 5-6 minutes until cooked through.",
      "In a small bowl, mix gochujang, soy sauce, and honey. Pour over turkey and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Build bowl with rice, top with spicy turkey, broccoli on side. Sesame & onion on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 120,
    "name": "Turkey Pasta Marinara Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (bottled)",
        "quantity": 100,
        "unit": "ml"
      },
      {
        "name": "Pasta (dry, protein pasta recommended)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mozzarella Cheese",
      "Parmesan"
    ],
    "instructions": [
      "Bring a pot of water to a boil. Add pasta and cook per package directions (usually 8–10 min) until al dente, then drain.",
      "Meanwhile, heat a skillet over medium-high. Add ground turkey, break apart. Cook 5 minutes until cooked through.",
      "Add marinara sauce and spinach to the meat. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 2 minutes until the spinach wilts.",
      "Combine pasta with the turkey sauce on a plate. Cheese on top."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta"
    ]
  },
  {
    "id": 121,
    "name": "Turkey Taco Tortilla Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 6,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (packet)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Salsa (bottled, 3 tbsp)",
        "quantity": 48,
        "unit": "ml"
      },
      {
        "name": "Corn Tortillas (2, warmed)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground turkey and break apart. Cook 5 minutes until cooked through.",
      "Sprinkle taco seasoning over the meat and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat, not just a dry-seasoned crumble. Simmer 1 minute.",
      "Heat tortillas in a dry pan 30 sec per side. Microwave veg 3 min. Build tacos with ground turkey. Toppings on the side."
    ],
    "totalTime": 6,
    "pantryTags": [
      "tortillas",
      "frozen_veg",
      "salsa"
    ]
  },
  {
    "id": 122,
    "name": "Creamy Turkey Mushroom Skillet",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey",
      "eggs"
    ],
    "flavor": "saucy",
    "activeTime": 7,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Beef Stroganoff Sauce Mix (powder)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Sour Cream",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Egg Noodles (microwave cup)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan",
      "Fresh Dill (if available)"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add ground turkey and break apart. Cook 5 minutes until cooked through.",
      "Mix stroganoff sauce powder with ½ cup water per package, then add to turkey. Simmer 2 minutes. Remove from heat and stir in sour cream.",
      "Microwave egg noodles per package + microwave broccoli 3 min. Season the broccoli with a pinch of garlic powder and onion powder. Combine noodles with turkey stroganoff on plate. Broccoli on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "pasta",
      "frozen_veg"
    ]
  },
  {
    "id": 123,
    "name": "Teriyaki Turkey Broccoli Bowl",
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "asian",
    "activeTime": 6,
    "components": [
      {
        "name": "Ground Turkey (93% lean)",
        "quantity": 142,
        "unit": "g"
      },
      {
        "name": "Teriyaki Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Frozen Broccoli (steam-bag)",
        "quantity": 85,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a skillet over medium-high heat. Add ground turkey and break apart. Cook 5 minutes until cooked through.",
      "Drizzle teriyaki sauce over turkey and stir well. Cook 1 minute more.",
      "Microwave rice 90 sec + steam-bag broccoli 3 min. Season the broccoli with a pinch of garlic powder and sesame seeds. Build bowl with rice, top with turkey, broccoli on side. Toppings on top."
    ],
    "totalTime": 6,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "soy_sauce"
    ]
  },
  {
    "id": 124,
    "name": "Sweet Potato Black Bean Enchiladas",
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "plant"
    ],
    "flavor": "mexican",
    "activeTime": 10,
    "components": [
      {
        "name": "Canned Black Beans (1 can, drained & rinsed)",
        "quantity": 425,
        "unit": "g"
      },
      {
        "name": "Frozen Diced Sweet Potato (steam-bag, pre-cut)",
        "quantity": 300,
        "unit": "g"
      },
      {
        "name": "Red Enchilada Sauce (canned)",
        "quantity": 280,
        "unit": "ml"
      },
      {
        "name": "Corn Tortillas (6-inch)",
        "quantity": 6,
        "unit": "each"
      },
      {
        "name": "Shredded Mexican Cheese Blend (bagged)",
        "quantity": 120,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sour Cream",
      "Diced Avocado (pre-cut)",
      "Fresh Cilantro"
    ],
    "instructions": [
      "Preheat oven to 375°F. Microwave the steam-bag sweet potato 5 minutes until fork-tender.",
      "In a bowl, mix black beans, sweet potato, and ¼ cup of the enchilada sauce.",
      "Spoon filling onto tortillas, roll, and place seam-down in a baking dish. Pour remaining sauce over the top, then sprinkle with cheese.",
      "Bake 20 minutes until the cheese is melted and the edges are bubbling."
    ],
    "totalTime": 30,
    "pantryTags": [
      "tortillas",
      "canned_beans",
      "cheese",
      "potatoes"
    ]
  },
  {
    "id": 125,
    "name": "Air Fryer Salmon with Arugula Berry Salad",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "mediterranean",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Salmon Fillet",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 4,
        "unit": "spray"
      },
      {
        "name": "Lemon Pepper Seasoning (shaker)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Baby Arugula (bagged, pre-washed)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Mixed Berries (fresh, pre-washed)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Feta Crumbles (pre-crumbled bag)",
        "quantity": 20,
        "unit": "g"
      },
      {
        "name": "Balsamic Vinaigrette (bottled)",
        "quantity": 30,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Extra Balsamic Drizzle"
    ],
    "instructions": [
      "Spray salmon with olive oil and season with lemon pepper.",
      "Air fry 400°F for 8–10 minutes until it flakes easily with a fork.",
      "Toss arugula, berries, and feta in a bowl with the balsamic vinaigrette.",
      "Plate the salad and top with the salmon."
    ],
    "totalTime": 15,
    "pantryTags": [
      "cheese",
      "salad_greens"
    ]
  },
  {
    "id": 126,
    "name": "Egg & Sausage Casserole",
    "method": "Bake",
    "mealType": "breakfast",
    "servings": 6,
    "proteins": [
      "eggs",
      "pork"
    ],
    "flavor": "neutral",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Liquid Egg Substitute (carton)",
        "quantity": 500,
        "unit": "ml"
      },
      {
        "name": "Fully Cooked Breakfast Sausage Crumbles (refrigerated)",
        "quantity": 340,
        "unit": "g"
      },
      {
        "name": "Frozen Diced Hash Browns",
        "quantity": 300,
        "unit": "g"
      },
      {
        "name": "Shredded Cheddar (bagged)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Milk (splash)",
        "quantity": 60,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Black Pepper"
    ],
    "instructions": [
      "Preheat oven to 375°F. Grease a baking dish (or use a disposable foil pan).",
      "Pour liquid eggs and milk into the dish and whisk with a fork.",
      "Scatter the hash browns, sausage crumbles, and half the cheese evenly over the eggs.",
      "Bake 35–40 minutes until the eggs are set and the center no longer jiggles. Top with remaining cheese for the last 5 minutes.",
      "Slice into portions."
    ],
    "totalTime": 48,
    "pantryTags": [
      "eggs",
      "cheese",
      "potatoes",
      "sausage",
      "milk"
    ]
  },
  {
    "id": 127,
    "name": "Jamaican Jerk Chicken with Sweet Potato Zoodles",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "caribbean",
    "activeTime": 5,
    "components": [
      {
        "name": "Chicken Thighs (boneless, skinless)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Jerk Marinade Paste (jarred, wet, 1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Lime Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Sweet Potato Noodles (pre-spiralized, steam-bag)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Lime Wedge",
      "Fresh Cilantro",
      "Sliced Scallions (pre-sliced bag)"
    ],
    "instructions": [
      "Mix jerk marinade paste with lime juice. Coat chicken thighs on both sides.",
      "Air fry 380°F for 16–18 minutes, flipping halfway, until internal temp reaches 165°F.",
      "Microwave the sweet potato noodle pouch 3–4 minutes until just tender.",
      "Plate chicken over the zoodles. Add toppings."
    ],
    "totalTime": 23,
    "pantryTags": [
      "pasta",
      "potatoes"
    ]
  },
  {
    "id": 128,
    "name": "Slow Cooker Chicken & Sausage Gumbo",
    "method": "Slow Cooker",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "chicken",
      "pork"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Seasoning Blend \"Holy Trinity\" (onion, celery, bell pepper, pre-chopped)",
        "quantity": 1200,
        "unit": "g"
      },
      {
        "name": "Andouille Sausage (pre-cooked, sliced)",
        "quantity": 800,
        "unit": "g"
      },
      {
        "name": "Rotisserie Chicken (shredded, pre-cooked)",
        "quantity": 800,
        "unit": "g"
      },
      {
        "name": "Instant Dark Roux (jarred)",
        "quantity": 240,
        "unit": "g"
      },
      {
        "name": "Chicken Broth (carton)",
        "quantity": 2000,
        "unit": "ml"
      },
      {
        "name": "Cajun Seasoning (shaker)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Hot Sauce"
    ],
    "instructions": [
      "Add the seasoning blend, sausage, roux, broth, and cajun seasoning to the slow cooker. Stir until the roux dissolves.",
      "Cook on LOW 6 hours or HIGH 3 hours.",
      "Stir in the shredded rotisserie chicken for the last 30 minutes to warm through.",
      "Divide the gumbo evenly into 4 containers and refrigerate up to 4 days, or freeze.",
      "To serve one portion: microwave a rice pouch 90 seconds. Serve the gumbo over rice."
    ],
    "totalTime": 368,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "rotisserie_chicken",
      "sausage",
      "onion_garlic",
      "bell_peppers",
      "broth"
    ]
  },
  {
    "id": 129,
    "name": "Air Fryer Turkey Meatballs with Marinara",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "italian",
    "activeTime": 3,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Turkey Meatballs (pre-formed)",
        "quantity": 280,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (jarred)",
        "quantity": 200,
        "unit": "ml"
      },
      {
        "name": "Shredded Mozzarella (bagged)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Spaghetti Pouch (microwaveable, pre-cooked)",
        "quantity": 200,
        "unit": "g"
      }
    ],
    "toppings": [
      "Grated Parmesan",
      "Red Pepper Flakes"
    ],
    "instructions": [
      "Air fry frozen turkey meatballs 400°F for 10–12 minutes, shaking the basket halfway.",
      "Microwave marinara sauce and spaghetti pouch together for 2–3 minutes.",
      "Combine meatballs with sauce and pasta, top with mozzarella and let it melt from the heat."
    ],
    "totalTime": 15,
    "pantryTags": [
      "pasta",
      "cheese"
    ]
  },
  {
    "id": 130,
    "name": "Air Fryer BBQ Pork Chops with Coleslaw",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "bbq",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Boneless Pork Chops",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (bottled)",
        "quantity": 40,
        "unit": "ml"
      },
      {
        "name": "Coleslaw Mix (bagged, shredded)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Coleslaw Dressing (bottled)",
        "quantity": 30,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Extra BBQ Sauce"
    ],
    "instructions": [
      "Brush pork chops with half the BBQ sauce.",
      "Air fry 380°F for 12–14 minutes, flipping halfway, until internal temp reaches 145°F. Brush with remaining sauce for the last 2 minutes.",
      "Toss coleslaw mix with dressing in a bowl. Serve alongside the pork chops."
    ],
    "totalTime": 19,
    "pantryTags": []
  },
  {
    "id": 131,
    "name": "Air Fryer Buffalo Chicken Bites",
    "method": "Air Fryer",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 2,
    "components": [
      {
        "name": "Frozen Breaded Chicken Bites",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Buffalo Sauce (bottled)",
        "quantity": 40,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Ranch Dressing",
      "Sliced Celery (pre-cut bag)"
    ],
    "instructions": [
      "Air fry frozen chicken bites 400°F for 10–12 minutes, shaking the basket halfway.",
      "Toss the hot bites in buffalo sauce. Serve with ranch and celery."
    ],
    "totalTime": 14,
    "pantryTags": [
      "hot_sauce"
    ]
  },
  {
    "id": 132,
    "name": "Cottage Cheese Protein Bowl",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese (tub)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Mixed Berries (fresh, pre-washed)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Granola (bagged)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Honey (drizzle)",
        "quantity": 10,
        "unit": "ml"
      }
    ],
    "toppings": [],
    "instructions": [
      "Scoop cottage cheese into a bowl.",
      "Top with berries, granola, and a drizzle of honey."
    ],
    "totalTime": 2,
    "pantryTags": [
      "cottage_cheese"
    ]
  },
  {
    "id": 133,
    "name": "Turkey & Egg Breakfast Wrap",
    "method": "Microwave",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "turkey",
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Liquid Egg Substitute (carton)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Turkey Breakfast Sausage Links (pre-cooked, sliced)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Flour Tortilla (burrito-size)",
        "quantity": 1,
        "unit": "each"
      },
      {
        "name": "Shredded Cheddar (bagged)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce"
    ],
    "instructions": [
      "Microwave liquid eggs in a mug 60–90 seconds, stirring halfway, until set.",
      "Microwave turkey sausage links 60 seconds.",
      "Layer eggs, sausage, and cheese onto the tortilla and roll into a wrap. Wrap in foil to take on the go."
    ],
    "totalTime": 4,
    "pantryTags": [
      "tortillas",
      "eggs",
      "cheese",
      "sausage"
    ]
  },
  {
    "id": 134,
    "name": "Greek Yogurt Protein Parfait",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "mediterranean",
    "activeTime": 2,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Greek Yogurt (plain or vanilla, tub)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Granola (bagged)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Frozen Berries (thawed)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Honey (drizzle)",
        "quantity": 10,
        "unit": "ml"
      }
    ],
    "toppings": [],
    "instructions": [
      "Layer yogurt, berries, and granola in a cup or jar.",
      "Drizzle with honey. Cover and grab it on the way out."
    ],
    "totalTime": 2,
    "pantryTags": [
      "greek_yogurt"
    ]
  },
  {
    "id": 135,
    "name": "Rotisserie Chicken Caesar Grab Bowl",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "italian",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rotisserie Chicken (shredded, pre-cooked)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Caesar Salad Kit (bagged, with dressing & croutons)",
        "quantity": 140,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Parmesan"
    ],
    "instructions": [
      "Empty the salad kit into a bowl and toss with its dressing and croutons.",
      "Top with shredded rotisserie chicken."
    ],
    "totalTime": 3,
    "pantryTags": [
      "rotisserie_chicken",
      "salad_greens"
    ]
  },
  {
    "id": 136,
    "name": "Overnight Oats with Protein Powder",
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 3,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rolled Oats",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Milk (or milk of choice)",
        "quantity": 180,
        "unit": "ml"
      },
      {
        "name": "Vanilla Protein Powder (scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Chia Seeds",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Berries"
    ],
    "instructions": [
      "Stir oats, milk, protein powder, and chia seeds together in a jar.",
      "Cover and refrigerate overnight. Grab it from the fridge in the morning — eat cold or warm 60 seconds in the microwave."
    ],
    "totalTime": 3,
    "pantryTags": [
      "oats",
      "milk"
    ]
  },
  {
    "id": 137,
    "name": "Tuna Salad Lettuce Wraps",
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Tuna Pouch (no drain)",
        "quantity": 140,
        "unit": "g"
      },
      {
        "name": "Mayo Packet (or light mayo)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Butter Lettuce Leaves (bagged, pre-washed)",
        "quantity": 60,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper"
    ],
    "instructions": [
      "Mix tuna with mayo in a bowl.",
      "Spoon into lettuce leaves and fold like a taco."
    ],
    "totalTime": 4,
    "pantryTags": [
      "canned_fish",
      "salad_greens",
      "butter"
    ]
  },
  {
    "id": 138,
    "name": "Buffalo Chicken Ranch Wrap",
    "method": "Microwave",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 4,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Frozen Grilled Chicken Strips (pre-cooked)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Buffalo Sauce (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Ranch Dressing (bottled)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Flour Tortilla (burrito-size)",
        "quantity": 1,
        "unit": "each"
      },
      {
        "name": "Shredded Lettuce (bagged)",
        "quantity": 40,
        "unit": "g"
      }
    ],
    "toppings": [],
    "instructions": [
      "Microwave chicken strips 2–3 minutes until hot, then toss in buffalo sauce.",
      "Layer chicken, ranch, and lettuce onto the tortilla and roll into a wrap. Wrap in foil to take on the go."
    ],
    "totalTime": 4,
    "pantryTags": [
      "tortillas",
      "salad_greens",
      "hot_sauce"
    ]
  },
  {
    "id": 139,
    "name": "Air Fryer Sourdough Pizza",
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "components": [
      {
        "name": "Thick-Cut Sourdough Bread (2 slices)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Shredded Mozzarella (¾ cup)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Turkey Pepperoni (20 slices)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 0.75,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Extra Parmesan"
    ],
    "instructions": [
      "Place sourdough slices on foil in air fryer basket. Spread marinara evenly over both.",
      "Top with mozzarella + pepperoni. Sprinkle with Italian seasoning and garlic powder.",
      "Air fry 375°F for 6–7 min, watching closely near the end, until the cheese bubbles and bread edges are golden."
    ],
    "totalTime": 12,
    "pantryTags": [
      "bread",
      "cheese",
      "onion_garlic"
    ]
  },
  {
    "id": 140,
    "name": "Chorizo Scrambled Eggs",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "pork",
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Mexican Chorizo (raw, casing removed)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (4 large)",
        "quantity": 200,
        "unit": "count"
      },
      {
        "name": "Shredded Pepper Jack (bagged)",
        "quantity": 56,
        "unit": "g"
      }
    ],
    "toppings": [
      "Salsa (fresh or jarred)",
      "Fresh Cilantro"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add chorizo and break apart. Cook 4–5 minutes until browned and cooked through.",
      "Whisk eggs in a bowl. Pour into the skillet with the chorizo and scramble until just set.",
      "Top with pepper jack and let it melt. Serve with salsa and cilantro."
    ],
    "totalTime": 8,
    "pantryTags": [
      "eggs",
      "cheese"
    ]
  },
  {
    "id": 141,
    "name": "Spicy Breakfast Burrito",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "pork",
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Mexican Chorizo (raw, casing removed)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (3 large)",
        "quantity": 150,
        "unit": "count"
      },
      {
        "name": "Shredded Pepper Jack (bagged)",
        "quantity": 42,
        "unit": "g"
      },
      {
        "name": "Flour Tortilla (burrito-size)",
        "quantity": 1,
        "unit": "each"
      },
      {
        "name": "Salsa (jarred)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Fresh Cilantro"
    ],
    "instructions": [
      "Heat a skillet over medium-high. Add chorizo and break apart. Cook 4–5 minutes until browned.",
      "Whisk eggs and pour into the skillet. Scramble together with the chorizo until just set.",
      "Sprinkle in pepper jack and let it melt. Spoon onto the tortilla with salsa, roll into a burrito. Wrap in foil to take on the go."
    ],
    "totalTime": 8,
    "pantryTags": [
      "tortillas",
      "eggs",
      "cheese",
      "salsa"
    ]
  },
  {
    "id": 142,
    "name": "Jalapeño Popper Egg Muffins",
    "method": "Bake",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs",
      "pork"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Whole Eggs (6 large)",
        "quantity": 300,
        "unit": "count"
      },
      {
        "name": "Light Cream Cheese (softened)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Jarred Jalapeño Slices (chopped, drained)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Pre-Cooked Bacon Crumbles (microwave)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Shredded Cheddar (bagged)",
        "quantity": 40,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Extra Jalapeño Slices"
    ],
    "instructions": [
      "Preheat oven to 350°F. Grease a 6-cup muffin tin (or use silicone liners).",
      "Whisk eggs and cream cheese together until mostly smooth (small lumps are fine). Stir in jalapeños, bacon, and half the cheddar.",
      "Divide the mixture evenly among the muffin cups. Top with the remaining cheddar.",
      "Bake 18–20 minutes until puffed and set in the center. Cool 2 minutes before removing. Keeps in the fridge for grab-and-go mornings."
    ],
    "totalTime": 28,
    "pantryTags": [
      "eggs",
      "cheese",
      "bacon"
    ]
  },
  {
    "id": 143,
    "name": "Spicy Kimchi Fried Rice with Egg",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "components": [
      {
        "name": "White Rice Pouch (day-old cooked or microwaved and cooled)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Kimchi (jarred, chopped)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Whole Egg (1 large, fried)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Gochujang Sauce (bottled)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Sliced Scallions"
    ],
    "instructions": [
      "Heat sesame oil in a skillet over medium-high. Add kimchi and cook 2 minutes until fragrant.",
      "Add rice and gochujang. Stir-fry 3–4 minutes, breaking up clumps, until heated through.",
      "In a separate small pan, fry the egg to your liking (sunny-side up works well).",
      "Top the rice with the fried egg. Toppings on top."
    ],
    "totalTime": 8,
    "pantryTags": [
      "rice",
      "eggs"
    ]
  },
  {
    "id": 144,
    "name": "Easy Huevos Rancheros",
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "components": [
      {
        "name": "Canned Refried Beans",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (2, warmed)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (2 large, fried)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Salsa (jarred)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Shredded Mexican Cheese Blend (bagged)",
        "quantity": 40,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Fresh Cilantro",
      "Sliced Avocado (pre-cut)"
    ],
    "instructions": [
      "Microwave refried beans in a bowl 1–2 minutes until warmed through.",
      "Warm tortillas in a dry pan 30 seconds per side. Fry eggs in the same pan to your liking.",
      "Spread beans over the tortillas, top with fried eggs, salsa, and cheese."
    ],
    "totalTime": 8,
    "pantryTags": [
      "tortillas",
      "eggs",
      "canned_beans",
      "cheese",
      "salsa"
    ]
  },
  {
    "id": 145,
    "name": "Sriracha Egg & Cheese Breakfast Sandwich",
    "method": "Microwave",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 5,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "English Muffin (whole wheat)",
        "quantity": 57,
        "unit": "g"
      },
      {
        "name": "Whole Egg (1 large)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Cheddar Slice",
        "quantity": 21,
        "unit": "g"
      },
      {
        "name": "Mayo (1 tbsp)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Sriracha (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Extra Sriracha"
    ],
    "instructions": [
      "Mix mayo and sriracha together in a small bowl to make sriracha mayo.",
      "Crack the egg into a microwave-safe mug, pierce the yolk, and microwave 45–60 seconds until just set.",
      "Toast the English muffin. Spread sriracha mayo on both halves, add cheese and egg, and assemble the sandwich."
    ],
    "totalTime": 5,
    "pantryTags": [
      "bread",
      "eggs",
      "cheese",
      "hot_sauce"
    ]
  }
];
