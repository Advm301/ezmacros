// QuickPrep recipe data -- simple recipe suggestion app (no macros/nutrition info)
// Each recipe: id, name, description (a short 1-2 sentence appetizing summary --
// shown on the recipe modal's decide screen in place of the ingredients-table
// how-to text, which moved into the mandatory decide-screen tutorial instead;
// see components/RecipeModal.jsx), method, mealType (breakfast | lunch_dinner |
// snack), proteins (array of protein categories present), flavor (single
// flavor/cuisine tag), activeTime (minutes -- hands-on prep/cook time only),
// totalTime (minutes -- activeTime plus any passive time like baking, air
// frying, or slow cooking; equals activeTime for methods with no passive gap),
// components (ingredients: name/quantity/unit), toppings (optional garnish
// names), instructions (cooking steps), tags (optional array, e.g.
// 'high_protein', 'grab_and_go' -- used for quick-filter chips in Browse/Kitchen),
// pantryTags (array of common-staple ids from pantryStaples.js that this recipe's
// ingredients draw from -- used for "what can I make with what I have" matching).
// isNew (optional, true on recently-added trending recipes -- drives the gold
// "NEW" badge in Browse/Kitchen/Saved and the recipe modal; not meant to be
// permanent, just a launch-window highlight for a given batch of additions).
// isTrending (optional, true on recipes currently pulled into the weekly
// "Trending" rotation -- drives the flame badge in Browse/Kitchen/Saved and
// the recipe modal, plus the Trending filter chip and the Monday local
// notification, see useTrendingNotifications.js). Meant to be hand-curated
// and rotated weekly (swap which recipes carry the flag), not permanent --
// pick recipes that map to what's actually trending online right now
// (TikTok/Reddit etc.) but write/shoot them originally rather than copying
// someone else's text or photos.
// proteinOptions (optional, present on recipes that are the same dish across
// multiple proteins -- e.g. Saucy Tomato Bowl -- instead of separate near-
// duplicate recipes per protein. Each entry is { id, label, componentName };
// componentName replaces whichever components[] entry is flagged
// `proteinSlot: true`. description and instructions carry {{protein}} /
// {{Protein}} placeholder tokens, resolved to the chosen proteinOption's id
// (lowercase) / label (capitalized) at render time. See
// utils/proteinChoice.js for the picker's remembered-per-recipe device
// preference, and RecipeModal's resolveProteinText/resolveComponents.

export const MEAL_TYPES = ['breakfast', 'lunch_dinner', 'snack'];

export const PROTEINS = ['chicken', 'beef', 'turkey', 'fish', 'eggs', 'pork'];

export const FLAVORS = ['spicy', 'saucy', 'neutral', 'asian', 'italian', 'mediterranean', 'caribbean', 'bbq', 'american', 'mexican'];

export const RECIPES = [
  {
    "name": "Teriyaki Cod Bowl",
    "description": "A light, Asian-inspired baked cod bowl glazed in sweet-savory teriyaki, served over fluffy white rice with tender green beans.",
    "id": 1,
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
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
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
      "Pat cod dry with paper towels. Place on foil-lined baking sheet. Dust with garlic powder, then drizzle teriyaki sauce over the fish.",
      "Bake at 425°F for 12–14 minutes until the fish flakes easily with a fork.",
      "While the oven heats, microwave rice pouch for 90 seconds. Microwave green beans steam-bag for 3 minutes. Season the green beans with a pinch of garlic powder and sesame seeds. Arrange rice on a plate, top with cod, and add green beans to the side."
    ],
    "totalTime": 17,
    "pantryTags": [
      "frozen_veg",
      "rice",
      "soy_sauce",
      "teriyaki_sauce",
      "white_fish"
    ]
  },
  {
    "name": "Spicy Asian Cod Bowl",
    "description": "A bright, spicy-sweet baked cod bowl finished with a soy-sriracha glaze and honey, paired with rice and crisp green beans.",
    "id": 2,
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
      "frozen_veg",
      "hot_sauce",
      "onion_garlic",
      "rice",
      "soy_sauce",
      "white_fish"
    ]
  },
  {
    "name": "Air Fryer Chicken Thighs",
    "description": "Simple, juicy air-fried chicken thighs seasoned with garlic herb and finished in butter for an easy weeknight protein.",
    "id": 3,
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
      "butter",
      "chicken_thighs",
      "onion_garlic"
    ]
  },
  {
    "name": "Deviled Eggs",
    "description": "Classic creamy deviled eggs with a tangy mustard-mayo filling -- a quick, no-cook protein snack.",
    "id": 5,
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
      "eggs",
      "mayo",
      "mustard"
    ]
  },
  {
    "name": "Slow Cooker Beef Rice Bowl",
    "description": "A hands-off, slow-simmered beef and tomato rice bowl built on garlic, Italian seasoning, and a splash of Worcestershire.",
    "id": 6,
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
        "name": "Minced Garlic (jarred, 6 tsp)",
        "quantity": 30,
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
      "Add beef, canned tomatoes, tomato paste, Worcestershire, minced garlic, Italian seasoning, and salt to the slow cooker. Break up beef roughly and stir to combine.",
      "Cook HIGH 2 hrs or LOW 4 hrs.",
      "Divide the beef mixture evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave a rice pouch 90 sec + a steam-bag veg 3 min. Build bowl with beef mixture. Toppings on the side."
    ],
    "totalTime": 245,
    "pantryTags": [
      "bbq_sauce",
      "canned_tomatoes",
      "frozen_veg",
      "ground_beef",
      "onion_garlic",
      "rice"
    ]
  },
  {
    "name": "Sheet Pan Turkey Meatballs",
    "description": "Baked Italian-style turkey meatballs tossed in marinara and melted mozzarella, sized for easy weekly meal prep.",
    "id": 7,
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "turkey",
      "eggs"
    ],
    "flavor": "italian",
    "activeTime": 10,
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
        "name": "Panko Breadcrumbs",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Egg White (carton pour)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Italian Seasoning (1 tbsp)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "Grated Parmesan (2 tbsp)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Salt (pinch)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (jarred, ⅓ cup)",
        "quantity": 320,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Shredded Mozzarella"
    ],
    "instructions": [
      "Mix turkey, breadcrumbs, egg white, Italian seasoning, minced garlic, parmesan, and salt in a bowl until just combined.",
      "Roll into ~1.5-inch balls (about 20-24 total) onto foil-lined baking sheet(s).",
      "Bake 400°F for 18–20 min.",
      "Warm the marinara (microwave 2-3 min) and toss the meatballs in it. Top with mozzarella. Divide evenly into 4 containers and refrigerate (up to 4 days) or freeze. To serve one portion: reheat in the microwave until hot throughout."
    ],
    "totalTime": 30,
    "pantryTags": [
      "canned_tomatoes",
      "cheese",
      "eggs",
      "ground_turkey",
      "marinara",
      "onion_garlic"
    ]
  },
  {
    "name": "Salmon Lemon Herb Bake",
    "description": "A simple baked salmon with buttery lemon-pepper seasoning, served alongside tender broccoli.",
    "id": 8,
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
      "butter",
      "frozen_veg",
      "salmon"
    ]
  },
  {
    "name": "Greek Yogurt Power Bowl",
    "description": "A quick no-cook breakfast bowl of Greek yogurt swirled with honey, blueberries, and vanilla protein powder.",
    "id": 9,
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
      "fruit",
      "greek_yogurt"
    ]
  },
  {
    "name": "Egg White Scramble",
    "description": "A light, high-protein egg white scramble with melty cheddar and fresh baby spinach.",
    "id": 10,
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
    "name": "Protein Pancakes",
    "description": "Fluffy protein pancakes made from a quick mix, egg, and almond milk, finished with a drizzle of honey.",
    "id": 11,
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
    "name": "PB Banana Protein Shake",
    "description": "A creamy, no-cook peanut butter banana protein shake blended with chocolate protein powder and almond milk.",
    "id": 12,
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
      "fruit",
      "milk"
    ]
  },
  {
    "name": "Smoked Salmon Bagel",
    "description": "A classic no-cook smoked salmon bagel with light cream cheese and briny capers.",
    "id": 13,
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
      "buns_rolls",
      "canned_fish",
      "cheese",
      "cream_cheese",
      "salmon"
    ]
  },
  {
    "name": "Cottage Cheese Toast",
    "description": "Whole grain toast piled with cottage cheese, everything bagel seasoning, and a drizzle of honey.",
    "id": 14,
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
    "name": "Protein Overnight Oats",
    "description": "Creamy make-ahead overnight oats blended with Greek yogurt and chocolate protein powder, ready to grab all week.",
    "id": 15,
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 4,
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
        "quantity": 180,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt",
        "quantity": 680,
        "unit": "ml"
      },
      {
        "name": "Chocolate Protein Powder (1 scoop)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Almond Milk (unsweetened)",
        "quantity": 480,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 28,
        "unit": "ml"
      },
      {
        "name": "16 oz Mason Jars or Lidded Containers (1 per serving)",
        "quantity": 4,
        "unit": "count"
      }
    ],
    "toppings": [
      "Frozen Blueberries",
      "Chia Seeds"
    ],
    "instructions": [
      "Divide oats, yogurt, protein powder, almond milk, and honey evenly among 4 jars or containers and stir each to combine.",
      "Refrigerate overnight (keeps up to 4-5 days). Stir before eating. Top with berries and seeds."
    ],
    "totalTime": 3,
    "pantryTags": [
      "greek_yogurt",
      "oats",
      "milk"
    ]
  },
  {
    "name": "Scrambled Eggs & Turkey Sausage",
    "description": "A hearty, high-protein stovetop breakfast of cheesy scrambled eggs with savory turkey sausage links.",
    "id": 16,
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
    "name": "High Protein Bagel",
    "description": "A no-cook everything bagel piled with deli turkey, light cream cheese, and a tangy Greek yogurt mustard spread.",
    "id": 17,
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
      "buns_rolls",
      "cheese",
      "cream_cheese",
      "deli_meat",
      "greek_yogurt",
      "mustard"
    ]
  },
  {
    "name": "Avocado Egg Toast",
    "description": "Creamy guacamole and boiled egg piled onto whole grain toast with a sprinkle of everything bagel seasoning.",
    "id": 18,
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
      "avocado",
      "bread",
      "eggs"
    ]
  },
  {
    "name": "Greek Yogurt Parfait",
    "description": "A no-cook parfait layering Greek yogurt, mixed berries, crunchy granola, and honey.",
    "id": 19,
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
      "fruit",
      "greek_yogurt"
    ]
  },
  {
    "name": "Microwave Egg Mug",
    "description": "A fast microwave egg mug with melty cheddar and salsa -- breakfast in under two minutes.",
    "id": 20,
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
    "name": "Buffalo Chicken Rice Bowl",
    "description": "A spicy air-fried buffalo chicken bowl over rice with steamed broccoli to cool things down.",
    "id": 21,
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
        "name": "Buffalo Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
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
      "Spray chicken with butter and dust with garlic powder. Air fry 400°F for 16–18 min, shaking halfway.",
      "Microwave rice 90 sec. Microwave broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Toss chicken in buffalo sauce.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 22,
    "pantryTags": [
      "butter",
      "chicken_breast",
      "frozen_veg",
      "hot_sauce",
      "rice"
    ]
  },
  {
    "name": "BBQ Chicken Rice Bowl",
    "description": "Smoky, garlic-seasoned air-fried BBQ chicken thighs served over rice.",
    "id": 22,
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
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Onion Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
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
      "Corn (frozen, thawed)"
    ],
    "instructions": [
      "Spray chicken with olive oil and rub with garlic powder and onion powder. Air fry 400°F for 18–20 min, shaking at 10 min.",
      "Microwave rice 90 sec. Brush BBQ sauce on cooked chicken.",
      "Build bowl — extra sauce on the side."
    ],
    "totalTime": 24,
    "pantryTags": [
      "bbq_sauce",
      "chicken_thighs",
      "rice"
    ]
  },
  {
    "name": "Canned Chicken Rice Bowl",
    "description": "A fast, no-cook soy-garlic chicken and rice bowl built from pantry staples.",
    "id": 23,
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
      "frozen_veg",
      "onion_garlic",
      "rice",
      "rotisserie_chicken",
      "soy_sauce"
    ]
  },
  {
    "name": "Rotisserie Chicken Bowl",
    "description": "A no-cook rotisserie chicken bowl with rice, broccoli, and a buffalo-style kick of Frank's RedHot.",
    "id": 24,
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
        "name": "Frank's RedHot Sauce (1 tbsp)",
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
      "Mix chicken with Frank's RedHot. Build bowl — toppings separate."
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
    "name": "Salmon Poke Bowl",
    "description": "A no-cook, poke-inspired smoked salmon bowl marinated in a classic soy-sesame-rice vinegar sauce, served over rice with edamame.",
    "id": 25,
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
        "name": "Smoked Salmon Pouch (drained, 6 oz, flaked or cubed)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Toasted Sesame Oil (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Rice Vinegar (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Frozen Edamame (steam-bag)",
        "quantity": 113,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Nori Strips",
      "Green Onion (dried)",
      "Spicy Mayo (mayo + sriracha, if available)"
    ],
    "instructions": [
      "Microwave rice 90 sec. Microwave edamame 3 min. Thaw salmon 1 min if frozen.",
      "Whisk soy sauce, sesame oil, and rice vinegar in a bowl. Add flaked salmon and toss to coat -- this is the real poke-style marinade, so let it sit 2-3 min while the rice and edamame finish if you have time.",
      "Build bowl with marinated salmon on rice and edamame. Toppings separate."
    ],
    "totalTime": 4,
    "pantryTags": [
      "canned_fish",
      "frozen_veg",
      "mayo",
      "rice",
      "salmon",
      "soy_sauce"
    ]
  },
  {
    "name": "Honey Garlic Cod Bowl",
    "description": "Baked cod glazed in a sticky honey-garlic soy sauce, served over rice with green beans.",
    "id": 26,
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
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
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
      "Mix honey + soy sauce + minced garlic. Place cod on foil. Drizzle sauce over top.",
      "Bake 425°F for 12–14 min. Microwave rice 90 sec + green beans 3 min.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 18,
    "pantryTags": [
      "frozen_veg",
      "onion_garlic",
      "rice",
      "soy_sauce",
      "white_fish"
    ]
  },
  {
    "name": "Ground Beef Taco Bowl",
    "description": "A spicy, high-protein taco-seasoned ground beef bowl with black beans, rice, and salsa.",
    "id": 27,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 12,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (about 3 packets)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Water (¼ cup)",
        "quantity": 240,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Canned Black Beans (½ can, drained)",
        "quantity": 540,
        "unit": "g"
      },
      {
        "name": "Olive Oil (½ tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Salsa (fresh, ¼ cup)",
        "quantity": 256,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Shredded Cheddar"
    ],
    "instructions": [
      "Heat oil in a large skillet over medium-high. Brown beef 10-12 min, breaking it up as it cooks.",
      "Add taco seasoning + water. Simmer 3-4 min, then stir in the salsa and black beans. Divide the beef mixture evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave rice pouch 90 sec + reheat a portion of the beef mixture. Build bowl -- toppings on side."
    ],
    "totalTime": 12,
    "pantryTags": [
      "rice",
      "canned_beans",
      "ground_beef",
      "salsa"
    ]
  },
  {
    "name": "Pork Tenderloin Bowl",
    "description": "Air-fried pork tenderloin glazed in honey mustard, served over rice with mixed veg.",
    "id": 28,
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
      "frozen_veg",
      "mustard",
      "pork",
      "rice"
    ]
  },
  {
    "name": "Lemon Pepper Shrimp Bowl",
    "description": "Buttery lemon-pepper air-fried shrimp over rice with steamed broccoli.",
    "id": 29,
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
      "butter",
      "frozen_veg",
      "rice",
      "shrimp"
    ]
  },
  {
    "name": "Greek Chicken Bowl",
    "description": "A Mediterranean-style air-fried Greek chicken bowl with rice, a quick cucumber-tomato salad, and cooling tzatziki.",
    "id": 30,
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mediterranean",
    "activeTime": 7,
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
        "name": "Mini Cucumber (diced, ¼ cup)",
        "quantity": 35,
        "unit": "g"
      },
      {
        "name": "Cherry Tomatoes (halved, ¼ cup)",
        "quantity": 35,
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
      "Toss diced cucumber and halved cherry tomatoes with a pinch of salt while the chicken cooks -- this quick salad is what makes a Greek bowl taste like one, not just seasoned chicken and rice.",
      "Build bowl with rice, chicken, and the cucumber-tomato salad. Drizzle tzatziki over the chicken. Toppings on side."
    ],
    "totalTime": 26,
    "pantryTags": [
      "chicken_thighs",
      "rice"
    ]
  },
  {
    "name": "Slow Cooker Chicken Thighs",
    "description": "Slow-cooked chicken thighs in a garlicky broth, finished bright with butter and lemon juice.",
    "id": 31,
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
        "name": "Minced Garlic (jarred, 6 tsp)",
        "quantity": 30,
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
      "broth",
      "butter",
      "chicken_thighs",
      "onion_garlic"
    ]
  },
  {
    "name": "Tuna Pasta Salad",
    "description": "A no-cook, high-protein chickpea pasta salad with tuna in a creamy Greek yogurt-mayo dressing with celery, dill, and lemon.",
    "id": 32,
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 5,
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
        "name": "Nonfat Greek Yogurt (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Light Mayo (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Pre-Cut Celery (diced, ⅓ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Fresh Dill (or ¼ tsp dried)",
      "Red Onion (finely diced, if available)",
      "Black Pepper"
    ],
    "instructions": [
      "Combine cooked pasta + drained tuna + diced celery in bowl.",
      "Whisk Greek yogurt, mayo, Dijon, and lemon juice together -- the yogurt keeps this creamy without drowning it in mayo. Fold into the pasta and season to taste."
    ],
    "totalTime": 5,
    "pantryTags": [
      "canned_fish",
      "mayo",
      "mustard",
      "pasta",
      "greek_yogurt"
    ]
  },
  {
    "name": "Black Bean Quesadilla",
    "description": "A Mexican-style black bean and cheese quesadilla, filling seasoned with cumin, chili powder, and garlic before it hits the skillet.",
    "id": 33,
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
      },
      {
        "name": "Ground Cumin (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Chili Powder (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sour Cream"
    ],
    "instructions": [
      "Mix black beans with the salsa, cumin, chili powder, and garlic powder in a small bowl -- this is what gives the filling real flavor instead of tasting like plain beans and cheese.",
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
    "name": "Microwave Salmon Pouch Bowl",
    "description": "A grab-and-go microwave salmon pouch bowl with rice and a dash of Louisiana-style hot sauce.",
    "id": 34,
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
        "name": "Louisiana-Style Hot Sauce (1 tbsp)",
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
      "Build bowl. Season salmon with lemon pepper + Louisiana-style hot sauce. Toppings separate."
    ],
    "totalTime": 2,
    "pantryTags": [
      "canned_fish",
      "hot_sauce",
      "rice",
      "salmon"
    ]
  },
  {
    "name": "High Protein Chili",
    "description": "A hearty, slow-cooked turkey chili loaded with kidney beans and a warming chili seasoning blend.",
    "id": 35,
    "method": "Slow Cooker",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "turkey"
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
      "canned_tomatoes",
      "ground_turkey"
    ]
  },
  {
    "name": "Honey Sriracha Salmon",
    "description": "Baked salmon glazed in a sweet-and-spicy honey sriracha garlic sauce, served with broccoli.",
    "id": 36,
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
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
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
      "Mix sriracha + honey + minced garlic. Place salmon on foil-lined sheet.",
      "Brush sauce over salmon. Bake 425°F for 12–14 min. Microwave broccoli 3 min.",
      "Plate together — extra sauce on side."
    ],
    "totalTime": 19,
    "pantryTags": [
      "frozen_veg",
      "hot_sauce",
      "onion_garlic",
      "salmon"
    ]
  },
  {
    "name": "Egg Fried Rice",
    "description": "Classic Asian-style egg fried rice with garlic, sesame oil, peas, and a hit of white pepper.",
    "id": 37,
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
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "White Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat sesame oil in large skillet over high heat. Scramble eggs 2 min, remove to plate.",
      "Add minced garlic to the same skillet and stir 20-30 seconds until fragrant, being careful not to let it burn. Add rice to skillet, break up clumps. Stir 2 min. Add peas + soy sauce + white pepper -- the white pepper especially is what makes fried rice taste like fried rice instead of just rice with soy sauce.",
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
    "name": "Chipotle Style Chicken Bowl",
    "description": "A smoky chipotle-seasoned chicken bowl with black beans, rice, salsa, and chipotle mayo.",
    "id": 38,
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
      "canned_beans",
      "chicken_thighs",
      "mayo",
      "rice",
      "salsa"
    ]
  },
  {
    "name": "Turkey Lettuce Wraps",
    "description": "Light, no-cook turkey lettuce wraps with guacamole and a tangy Dijon kick.",
    "id": 39,
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
      "avocado",
      "deli_meat",
      "mustard",
      "salad_greens"
    ]
  },
  {
    "name": "Teriyaki Salmon Bowl",
    "description": "Baked teriyaki-glazed salmon over rice with edamame -- an easy Asian-inspired dinner.",
    "id": 40,
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
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 1,
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
      "Spray salmon with oil. Place on foil-lined sheet. Dust with garlic powder, then brush teriyaki sauce over top.",
      "Bake 425°F for 12–14 min. Microwave rice 90 sec + edamame 3 min.",
      "Build bowl — toppings separate."
    ],
    "totalTime": 18,
    "pantryTags": [
      "frozen_veg",
      "rice",
      "salmon",
      "soy_sauce",
      "teriyaki_sauce"
    ]
  },
  {
    "name": "Beef Jerky & Rice Cakes",
    "description": "A grab-and-go snack of teriyaki beef jerky and rice cakes with almond butter.",
    "id": 41,
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
      "soy_sauce",
      "teriyaki_sauce"
    ]
  },
  {
    "name": "String Cheese & Turkey Roll-Ups",
    "description": "A simple no-cook snack of deli turkey rolled around string cheese with a dab of Dijon.",
    "id": 42,
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
      "deli_meat",
      "mustard"
    ]
  },
  {
    "name": "Cottage Cheese & Pineapple",
    "description": "Sweet and creamy cottage cheese with pineapple chunks and a drizzle of honey.",
    "id": 43,
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
    "name": "Hard Boiled Eggs with Hot Sauce",
    "description": "Boiled eggs with a Louisiana-style hot sauce kick and everything bagel seasoning.",
    "id": 44,
    "method": "No Cook",
    "mealType": "snack",
    "servings": 4,
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
        "quantity": 400,
        "unit": "count"
      },
      {
        "name": "Louisiana-Style Hot Sauce (2 tbsp)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Everything Bagel Seasoning (½ tsp)",
        "quantity": 4,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper",
      "Sea Salt"
    ],
    "instructions": [
      "Boil a batch of 8 eggs at once: place in a pot, cover with about an inch of water, bring to a boil, then cover and remove from heat for 10-12 minutes. Cool in ice water before peeling. Keeps in the fridge (in shell, unpeeled) for up to a week.",
      "For one serving: peel and halve 2 eggs. Pour Louisiana-style hot sauce over. Sprinkle seasoning on top."
    ],
    "totalTime": 2,
    "pantryTags": [
      "bread",
      "eggs",
      "hot_sauce"
    ]
  },
  {
    "name": "Sardines on Toast",
    "description": "Savory sardines in olive oil on whole grain toast with Dijon and lemon.",
    "id": 45,
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
      "canned_fish",
      "mustard"
    ]
  },
  {
    "name": "Skyr & Berries",
    "description": "A protein-packed no-cook snack of skyr with mixed berries and honey.",
    "id": 46,
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
      "fruit",
      "greek_yogurt"
    ]
  },
  {
    "name": "Chicken & Salsa Wrap",
    "description": "A spicy, no-cook rotisserie chicken wrap with salsa and melty cheddar.",
    "id": 47,
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
    "name": "Protein Pudding",
    "description": "A creamy, high-protein chocolate pudding made from Greek yogurt, cocoa, and protein powder.",
    "id": 48,
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
    "name": "Edamame Bowl",
    "description": "A spicy, Asian-style steamed edamame snack tossed in soy sauce, sesame oil, and red pepper flakes.",
    "id": 49,
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
    "name": "Canned Chicken & Crackers",
    "description": "A simple grab-and-go snack of canned chicken with crackers, Dijon, and a buffalo-style kick of Frank's RedHot.",
    "id": 50,
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
        "name": "Frank's RedHot Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Lemon Pepper Seasoning",
      "Celery Powder"
    ],
    "instructions": [
      "Mix canned chicken with mustard + Frank's RedHot.",
      "Spoon onto crackers. Season lightly."
    ],
    "totalTime": 2,
    "pantryTags": [
      "hot_sauce",
      "mustard",
      "rotisserie_chicken"
    ]
  },
  {
    "name": "Classic Smash Burger",
    "description": "A classic diner-style smash burger with melted American cheese, ketchup, mustard, and pickles.",
    "id": 51,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
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
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "American Cheese Slices (1 per burger)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Brioche Buns (1 per burger)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Ketchup (2 tbsp per burger)",
        "quantity": 128,
        "unit": "ml"
      },
      {
        "name": "Yellow Mustard (1 tbsp per burger)",
        "quantity": 20,
        "unit": "ml"
      },
      {
        "name": "Pickle Slices (jar, 2 tbsp per burger)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Salt (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Black Pepper (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Onion Powder (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mayonnaise"
    ],
    "instructions": [
      "Roll beef into 4 balls (about 142g/5oz each) and season all over with salt, pepper, and onion powder.",
      "Heat cast iron skillet screaming hot (~400°F). Working in batches, smash each ball flat with a spatula. Cook 2 min without moving, then flip and cook 1 min more.",
      "Refrigerate the cooked patties (up to 4 days) or freeze -- they reheat great.",
      "To serve one: reheat a patty in a hot skillet about 1 min per side, melting a cheese slice on top in the last minute. Toast a bun, build with ketchup, mustard, and pickles."
    ],
    "totalTime": 6,
    "pantryTags": [
      "bread",
      "buns_rolls",
      "cheese",
      "ground_beef",
      "mustard",
      "onion_garlic"
    ]
  },
  {
    "name": "BBQ Bacon Burger",
    "description": "A smoky BBQ bacon cheeseburger stacked with cheddar and a brush of BBQ sauce.",
    "id": 52,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
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
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Pre-Cooked Bacon (microwave, 3 strips per burger)",
        "quantity": 168,
        "unit": "g"
      },
      {
        "name": "BBQ Sauce (2 tbsp per burger)",
        "quantity": 136,
        "unit": "ml"
      },
      {
        "name": "Cheddar Slices (1 per burger)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Brioche Buns (1 per burger)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Salt (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Black Pepper (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Onion Powder (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (pinch per burger)",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lettuce Leaf"
    ],
    "instructions": [
      "Season beef all over with salt, pepper, onion powder, and garlic powder, then divide and form into 4 patties (~142g/5oz each).",
      "Heat skillet medium-high. Cook patties in batches, 3–4 min per side (~160°F internal). Microwave bacon strips 2 min.",
      "Refrigerate the cooked patties and bacon (up to 4 days) or freeze.",
      "To serve one: reheat a patty in a hot pan, melting cheese on top in the last minute. Toast a bun, brush BBQ sauce on the inside, stack burger + bacon."
    ],
    "totalTime": 8,
    "pantryTags": [
      "bacon",
      "bbq_sauce",
      "bread",
      "buns_rolls",
      "cheese",
      "ground_beef"
    ]
  },
  {
    "name": "Turkey Burger",
    "description": "A leaner turkey burger seasoned with garlic and Worcestershire, topped with mustard and pickles.",
    "id": 53,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
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
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp per patty)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Worcestershire Sauce (1 tbsp per patty)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Brioche Buns (1 per burger)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Yellow Mustard (2 tbsp per burger)",
        "quantity": 40,
        "unit": "ml"
      },
      {
        "name": "Dill Pickle Slices (jar, 2 tbsp per burger)",
        "quantity": 120,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mayonnaise",
      "Hot Sauce"
    ],
    "instructions": [
      "Mix ground turkey with minced garlic + Worcestershire in a bowl. Divide and form into 4 patties.",
      "Heat skillet medium-high. Cook patties in batches, 4–5 min per side (~165°F internal).",
      "Refrigerate the cooked patties (up to 4 days) or freeze.",
      "To serve one: reheat a patty in a hot pan. Toast a bun, spread mustard, build burger with pickles + toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "bbq_sauce",
      "bread",
      "buns_rolls",
      "ground_turkey",
      "mustard",
      "onion_garlic"
    ]
  },
  {
    "name": "Spicy Chicken Sandwich",
    "description": "A crispy, cayenne-garlic-seasoned air-fried spicy chicken sandwich tossed in Frank's RedHot, with pickles and an optional swipe of light mayo.",
    "id": 54,
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
        "name": "Frank's RedHot Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Brioche Bun",
        "quantity": 80,
        "unit": "g"
      },
      {
        "name": "Dill Pickle Slices (jar, 2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Paprika (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Cayenne Pepper (¼ tsp)",
        "quantity": 1,
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
      }
    ],
    "toppings": [
      "Frank's RedHot, Extra Drizzle",
      "Light Mayo (2 tbsp)",
      "Celery Powder"
    ],
    "instructions": [
      "Season chicken breast all over with garlic powder, paprika, cayenne, salt, and pepper. Air fry 400°F for 16–18 min.",
      "Toss the cooked chicken in Frank's RedHot. Toast bun.",
      "Stack chicken + pickles on the bun. Spread light mayo on top if using."
    ],
    "totalTime": 23,
    "pantryTags": [
      "bread",
      "buns_rolls",
      "chicken_breast",
      "hot_sauce",
      "mayo"
    ]
  },
  {
    "name": "Tuna Melt",
    "description": "A classic air-fried tuna melt with mayo, mustard, and melted cheddar on toasted bread.",
    "id": 55,
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
      "canned_fish",
      "cheese",
      "mayo",
      "mustard"
    ]
  },
  {
    "name": "Egg & Cheese Breakfast Sandwich",
    "description": "A hearty egg and cheddar breakfast sandwich on an English muffin with savory turkey sausage.",
    "id": 56,
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
      "buns_rolls",
      "cheese",
      "eggs",
      "sausage"
    ]
  },
  {
    "name": "Rotisserie Chicken Wrap",
    "description": "A no-cook rotisserie chicken wrap with cheddar, salsa, and a tangy Greek yogurt drizzle.",
    "id": 57,
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
    "name": "BLT Protein Wrap",
    "description": "A no-cook turkey bacon lettuce tomato wrap with a light mayo spread -- a protein-forward take on a real BLT.",
    "id": 58,
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "neutral",
    "activeTime": 4,
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
        "name": "Tomato (sliced, 3 slices)",
        "quantity": 45,
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
      "Spread mayo on tortilla. Layer turkey + bacon + lettuce + tomato slices -- a real BLT needs the tomato. Roll tightly."
    ],
    "totalTime": 4,
    "pantryTags": [
      "bacon",
      "deli_meat",
      "mayo",
      "salad_greens",
      "tortillas"
    ]
  },
  {
    "name": "Air Fryer Protein Pizza",
    "description": "A quick air-fried naan pizza topped with marinara, mozzarella, and turkey pepperoni.",
    "id": 59,
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
      "marinara",
      "onion_garlic"
    ]
  },
  {
    "name": "Cottage Cheese Pizza Bowl",
    "description": "A fun microwave cottage cheese \"pizza bowl\" with marinara, mozzarella, and turkey pepperoni.",
    "id": 60,
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
      "cottage_cheese",
      "marinara"
    ]
  },
  {
    "name": "BBQ Chicken Flatbread",
    "description": "A smoky BBQ chicken flatbread topped with melty mozzarella on crispy air-fried naan.",
    "id": 61,
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
      "bbq_sauce",
      "cheese",
      "rotisserie_chicken"
    ]
  },
  {
    "name": "Pesto Chicken Flatbread",
    "description": "A Mediterranean-style pesto chicken flatbread with sun-dried tomatoes and melty mozzarella.",
    "id": 62,
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
    "name": "Beef & Rice Power Bowl",
    "description": "An Asian-inspired ground beef and rice bowl in a garlicky honey-soy glaze, served with broccoli.",
    "id": 63,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef"
    ],
    "flavor": "asian",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp per bowl)",
        "quantity": 90,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 3 tsp per bowl)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Honey (1 tbsp per bowl)",
        "quantity": 80,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Olive Oil (1 tsp per bowl)",
        "quantity": 20,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat oil in a large skillet over medium-high. Add ground beef, breaking it apart with a spoon. Cook 10-12 minutes, stirring occasionally, until browned throughout.",
      "Add soy sauce, garlic, and honey. Simmer 2-3 minutes, stirring, until the glaze coats the beef.",
      "Divide the beef evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave rice pouch 90 sec + steam-bag broccoli 3 min. Build bowl with rice, top with a portion of beef, broccoli on side. Toppings on side."
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
    "name": "Chicken Teriyaki Noodles",
    "description": "Asian-style teriyaki chicken and noodles tossed with stir-fry vegetables.",
    "id": 64,
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
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Fresh Ginger (minced, 1 tsp)",
        "quantity": 3,
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
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Boil water in pot. Add noodles, cook per package directions (usually 2–4 min). Add frozen veg, cook 2 min more. Drain.",
      "Season chicken with salt and pepper. Heat skillet. Cook chicken 5 min per side.",
      "Push chicken to one side, add garlic and ginger to the skillet, and stir 20-30 seconds until fragrant -- this is what actually builds real teriyaki flavor, not just the bottled sauce. Add teriyaki sauce and simmer 1 min, turning chicken to coat.",
      "Add the drained noodles and veg to the skillet and toss everything together in the glaze. Plate. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "chicken_thighs",
      "frozen_veg",
      "pasta",
      "soy_sauce",
      "teriyaki_sauce"
    ]
  },
  {
    "name": "Shrimp Fried Rice",
    "description": "Classic Asian-style shrimp fried rice with egg, garlic, sesame oil, and peas.",
    "id": 65,
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
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "White Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat sesame oil in large skillet over high. Scramble eggs, remove to plate.",
      "Add minced garlic to the same skillet and stir 20-30 seconds until fragrant, being careful not to let it burn. Add rice, break up clumps, stir 2 min. Add peas + soy sauce + white pepper + shrimp.",
      "Return eggs, toss everything 1 min. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "eggs",
      "frozen_veg",
      "rice",
      "shrimp",
      "soy_sauce"
    ]
  },
  {
    "name": "Loaded Baked Potato",
    "description": "A hearty microwave loaded baked potato topped with chili, cheddar, crumbled center-cut bacon, and a dollop of Greek yogurt.",
    "id": 66,
    "method": "Microwave",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "spicy",
    "activeTime": 6,
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
        "name": "Center-Cut Bacon (cooked and crumbled, 2 slices)",
        "quantity": 18,
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
      "Microwave chili 2 min in separate bowl. Split potato open. Top with chili, cheese, crumbled bacon, and yogurt -- the bacon is what makes a baked potato actually \"loaded.\""
    ],
    "totalTime": 6,
    "pantryTags": [
      "cheese",
      "greek_yogurt",
      "potatoes",
      "sour_cream",
      "bacon"
    ]
  },
  {
    "name": "Protein French Toast",
    "description": "High-protein cinnamon French toast made with egg whites and vanilla protein powder.",
    "id": 67,
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
    "name": "Turkey Meatball Sub",
    "description": "A classic Italian-style turkey meatball sub loaded with marinara and melted mozzarella.",
    "id": 68,
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
      "buns_rolls",
      "cheese",
      "marinara",
      "sausage"
    ]
  },
  {
    "name": "Canned Salmon Caesar Wrap",
    "description": "A no-cook Caesar-style salmon wrap with romaine, parmesan, and creamy Caesar dressing.",
    "id": 70,
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
      "canned_fish",
      "cheese",
      "salad_dressing",
      "salad_greens",
      "salmon",
      "tortillas"
    ]
  },
  {
    "name": "Sweet Potato Cottage Cheese Power Bowl",
    "description": "A spicy, high-protein bowl of taco-seasoned ground beef, sweet potato, and cottage cheese finished with guacamole and hot honey.",
    "id": 71,
    "isTrending": true,
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 4,
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
        "name": "Frozen Sweet Potato Cubes (pre-cut)",
        "quantity": 900,
        "unit": "g"
      },
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Cottage Cheese",
        "quantity": 448,
        "unit": "g"
      },
      {
        "name": "Guacamole (2 tbsp per bowl)",
        "quantity": 224,
        "unit": "g"
      },
      {
        "name": "Hot Honey (2 tbsp per bowl)",
        "quantity": 136,
        "unit": "ml"
      },
      {
        "name": "Taco Seasoning (1 tbsp per bowl)",
        "quantity": 32,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Microwave the frozen sweet potato cubes in batches, about 5 min per batch (or air fry 12 min at 400°F), until tender.",
      "Heat a large skillet over medium-high. Brown ground beef 10-12 min, breaking it apart. Stir in taco seasoning + ¼ cup water, simmer 2 minutes.",
      "Divide the sweet potato and seasoned beef evenly into 4 containers, each with a dollop of cottage cheese, and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: reheat, then squeeze fresh guacamole and drizzle hot honey on top -- adding these fresh at serving time keeps them from browning or separating in storage. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "avocado",
      "cottage_cheese",
      "ground_beef",
      "potatoes"
    ]
  },
  {
    "name": "Baked Feta Pasta",
    "description": "A viral-style baked feta pasta with blistered cherry tomatoes, Italian seasoning, and a touch of chili and honey, tossed with chickpea pasta.",
    "id": 72,
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
      },
      {
        "name": "Red Pepper Flakes (¼ tsp)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Basil (dried)",
      "Black Pepper"
    ],
    "instructions": [
      "Place feta block in small baking dish. Pour canned cherry tomatoes around it (don't drain completely). Drizzle honey over the tomatoes -- it caramelizes in the oven and balances their acidity.",
      "Spray feta lightly with olive oil. Shake Italian seasoning + garlic powder + red pepper flakes over top.",
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
    "name": "Cottage Cheese Flatbread",
    "description": "A savory baked flatbread of cottage cheese and eggs topped with deli turkey and spinach.",
    "id": 73,
    "isTrending": true,
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
      "cottage_cheese",
      "deli_meat",
      "eggs",
      "mustard",
      "salad_greens"
    ]
  },
  {
    "name": "Bang Bang Shrimp Bowl",
    "description": "Crispy air-fried shrimp tossed in a spicy-sweet bang bang sauce, served over rice with cucumber.",
    "id": 74,
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
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
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
      }
    ],
    "toppings": [
      "Sriracha (1 tsp mixed into sauce)",
      "Sesame Seeds"
    ],
    "instructions": [
      "Mix mayo + sweet chili sauce + ½ tsp sriracha in bowl.",
      "Toss thawed shrimp with garlic powder, salt, and pepper. Air fry 380°F for 8–10 min, shaking halfway. Toss in bang bang sauce.",
      "Microwave rice 90 sec. Build bowl with shrimp, cucumber slices. Toppings on side."
    ],
    "totalTime": 15,
    "pantryTags": [
      "cucumber",
      "hot_sauce",
      "mayo",
      "rice",
      "shrimp"
    ]
  },
  {
    "name": "Creamy Sun-Dried Tomato Chicken",
    "description": "A slow-cooked, Italian-style creamy sun-dried tomato chicken with parmesan and a hit of red pepper flakes.",
    "id": 75,
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
        "name": "Minced Garlic (jarred, 6 tsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Red Pepper Flakes (½ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Basil (dried)",
      "Black Pepper"
    ],
    "instructions": [
      "Add chicken, sun-dried tomatoes, broth, Italian seasoning, minced garlic, and red pepper flakes to slow cooker -- the red pepper flakes are what push this from a mild cream sauce toward a real Tuscan-style flavor.",
      "Cook LOW 5–6 hrs or HIGH 2–3 hrs. Stir in heavy cream + parmesan in last 30 min.",
      "Divide chicken and sauce evenly into 4 containers. Refrigerate up to 4 days.",
      "Reheat one portion at a time. Serve over a fresh white rice pouch."
    ],
    "totalTime": 365,
    "pantryTags": [
      "broth",
      "cheese",
      "chicken_thighs",
      "onion_garlic"
    ]
  },
  {
    "name": "Cucumber Tuna Salad",
    "description": "A no-cook, Asian-inspired spicy tuna and cucumber salad with rice vinegar, sesame oil, and chili crisp.",
    "id": 76,
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
      "cucumber",
      "hot_sauce",
      "soy_sauce"
    ]
  },
  {
    "name": "High Protein Sushi Bake",
    "description": "A baked, sushi-inspired rice casserole with a creamy spicy crab-and-cream-cheese layer and melted mozzarella, scooped up with nori.",
    "id": 77,
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "White Rice Pouch (cooked)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Rice Vinegar (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Imitation Crab (package, 6 oz, shredded)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Cream Cheese (2 tbsp, softened)",
        "quantity": 30,
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
      "Nori Sheets (for scooping)",
      "Pre-Cut Cucumber Rounds",
      "Furikake (if available)",
      "Extra Sriracha"
    ],
    "instructions": [
      "Stir rice vinegar through the cooked rice. Press half into a small baking dish.",
      "Mix shredded crab with cream cheese, mayo, soy sauce, and sriracha until creamy -- this is the real sushi-bake filling, not just seasoned rice. Layer over the rice, then top with remaining rice and the mozzarella.",
      "Bake 375°F for 15 min until the cheese melts and the top is bubbling. Top with cucumber + extra sriracha. Scoop onto nori sheets to eat, sushi-hand-roll style, if using."
    ],
    "totalTime": 22,
    "pantryTags": [
      "cheese",
      "cream_cheese",
      "hot_sauce",
      "mayo",
      "rice",
      "shrimp",
      "soy_sauce"
    ]
  },
  {
    "name": "Smoked Salmon Everything Bites",
    "description": "No-cook smoked salmon and cottage cheese bites on cucumber rounds with everything bagel seasoning and dill.",
    "id": 78,
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
      "canned_fish",
      "cottage_cheese",
      "cucumber",
      "salmon"
    ]
  },
  {
    "name": "Egg White Fried Rice",
    "description": "A lighter, Asian-style egg white fried rice with garlic, sesame oil, and peas.",
    "id": 79,
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
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "White Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "Heat sesame oil in large skillet over high heat. Scramble egg whites 2 min until just set. Remove to plate.",
      "Add minced garlic to the same skillet and stir 20-30 seconds until fragrant, being careful not to let it burn. Add rice to skillet, break up clumps, stir 2 min. Add peas + soy sauce + white pepper.",
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
    "name": "High Protein Birria Tacos",
    "description": "Spicy, Mexican-style birria-inspired beef tacos in a rich enchilada-broth sauce with melty cheese.",
    "id": 80,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
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
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (1 packet per serving)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Red Enchilada Sauce (canned, ¼ cup per serving)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Beef Broth (1 large carton, ~6 cups)",
        "quantity": 1440,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (2 medium per serving)",
        "quantity": 208,
        "unit": "g"
      },
      {
        "name": "Shredded Mexican Cheese (½ cup per serving)",
        "quantity": 224,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp per serving)",
        "quantity": 20,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (fresh or dried)"
    ],
    "instructions": [
      "Heat oil in a large pot. Brown beef 10-12 min, breaking it apart. Add taco seasoning, beef broth, and enchilada sauce. Simmer 10-12 minutes -- the enchilada sauce gives the broth real birria-style depth instead of relying on the seasoning packet alone.",
      "Divide the beef and about ½ cup of broth per portion into 4 containers, and refrigerate (up to 4 days) or freeze. Save the rest of the broth separately for dipping.",
      "To serve one portion: reheat that portion's broth in a small pot. Dip 2 corn tortillas in the hot broth until crispy (~20 sec per side).",
      "Fill the dipped tortillas with cheese + shredded beef from that portion + lime + cilantro. Serve with extra broth for dipping."
    ],
    "totalTime": 10,
    "pantryTags": [
      "broth",
      "cheese",
      "ground_beef",
      "salsa",
      "tortillas"
    ]
  },
  {
    "name": "Hot Honey Salmon",
    "description": "Baked salmon glazed in sweet-spicy hot honey and garlic, brightened with a squeeze of lemon.",
    "id": 81,
    "isTrending": true,
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
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
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
      "Mix hot honey and minced garlic in a small bowl. Place salmon skin-down on foil-lined sheet and brush generously with the mixture.",
      "Bake 425°F for 12–14 min. Microwave broccoli 3 min. Squeeze lemon over salmon."
    ],
    "totalTime": 18,
    "pantryTags": [
      "frozen_veg",
      "onion_garlic",
      "salmon"
    ]
  },
  {
    "name": "Spicy Garlic Shrimp Bowl",
    "description": "A spicy garlic shrimp bowl in a sriracha-honey-soy sauce, served over rice with broccoli.",
    "id": 82,
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
        "name": "Minced Garlic (jarred, 3 tsp)",
        "quantity": 15,
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
      "Mix sriracha + soy sauce + honey in a bowl. Add the sauce and minced garlic to the pan with the shrimp; toss and cook 30 seconds more until fragrant and the shrimp is coated.",
      "Microwave rice 90 sec + broccoli 3 min. Build bowl — toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "frozen_veg",
      "hot_sauce",
      "onion_garlic",
      "rice",
      "shrimp",
      "soy_sauce"
    ]
  },
  {
    "name": "Nashville Hot Chicken Tenders",
    "description": "Crispy air-fried Nashville-style hot chicken tenders tossed in Frank's RedHot, cayenne, and a touch of brown sugar, served on a bun with pickles.",
    "id": 83,
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
        "name": "Frank's RedHot Sauce (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Cayenne Powder (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Brown Sugar (1 tsp)",
        "quantity": 4,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
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
      "Frank's RedHot, Extra Drizzle",
      "Black Pepper"
    ],
    "instructions": [
      "Mix Frank's RedHot, cayenne, brown sugar, and minced garlic -- the brown sugar balances the heat the way real Nashville hot chicken does. Toss chicken strips in the mixture.",
      "Air fry 400°F for 12–14 min, shaking halfway. Toast bun lightly.",
      "Spread mayo on bun. Stack chicken tenders + pickles."
    ],
    "totalTime": 20,
    "pantryTags": [
      "bread",
      "buns_rolls",
      "chicken_breast",
      "hot_sauce",
      "mayo",
      "onion_garlic"
    ]
  },
  {
    "name": "Spicy Salmon Bowl",
    "description": "Baked salmon in a spicy gochujang-soy glaze over rice with edamame and a drizzle of mayo.",
    "id": 84,
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
      "frozen_veg",
      "hot_sauce",
      "mayo",
      "rice",
      "salmon",
      "soy_sauce"
    ]
  },
  {
    "name": "Chili Lime Shrimp Tacos",
    "description": "Zesty chili-lime air-fried shrimp tacos with a cooling Greek yogurt and salsa verde crema.",
    "id": 85,
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
      "greek_yogurt",
      "salsa",
      "shrimp",
      "sour_cream",
      "tortillas"
    ]
  },
  {
    "name": "Spicy Turkey Taco Bowl",
    "description": "A smoky chipotle ground turkey taco bowl with black beans, rice, and salsa verde.",
    "id": 86,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "turkey"
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
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Chipotle Seasoning Powder (1 tbsp per bowl)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Canned Black Beans (2 cans, drained)",
        "quantity": 540,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Salsa Verde (jarred, 3 tbsp per bowl)",
        "quantity": 192,
        "unit": "ml"
      },
      {
        "name": "Olive Oil (1 tsp per bowl)",
        "quantity": 20,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lime Squeeze",
      "Cilantro (dried)"
    ],
    "instructions": [
      "Heat oil in a large skillet. Brown turkey 10-12 min, breaking it apart.",
      "Add chipotle seasoning, black beans, and salsa verde. Simmer 3-4 minutes.",
      "Divide the turkey mixture evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave rice pouch 90 sec. Build bowl with rice, top with a portion of the turkey mixture. Toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "canned_beans",
      "ground_turkey",
      "rice",
      "salsa"
    ]
  },
  {
    "name": "Quick Dan Dan Noodles",
    "description": "A quick, spicy Sichuan-inspired dan dan noodle bowl with chili crisp, peanut, and sesame flavors.",
    "id": 87,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "turkey"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "components": [
      {
        "name": "Ramen-Style Noodles (dried or fresh, any brand -- no seasoning packet, 1 serving at a time)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Ground Pork or Turkey (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Chili Crisp (2 tbsp per serving)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Low-Sodium Soy Sauce (1.5 tbsp per serving)",
        "quantity": 90,
        "unit": "g"
      },
      {
        "name": "PB2 Peanut Butter Powder (2 tbsp per serving)",
        "quantity": 64,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (½ tsp per serving)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Water (for boiling noodles, about 4 cups per serving)",
        "quantity": 960,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion (dried)"
    ],
    "instructions": [
      "In a large skillet, brown the ground meat 10-12 min, breaking it apart. Add soy sauce, PB2, chili crisp, and sesame oil. Stir to combine and simmer 2 minutes.",
      "Divide the meat sauce evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: boil water and cook one serving of noodles (about 56g) per package directions, usually 2-4 min. Drain.",
      "Toss the noodles with a reheated portion of meat sauce. Toppings on side."
    ],
    "totalTime": 8,
    "pantryTags": [
      "ground_pork",
      "ground_turkey",
      "hot_sauce",
      "pasta",
      "peanut_butter",
      "soy_sauce"
    ]
  },
  {
    "name": "Spicy Beef & Broccoli",
    "description": "A spicy beef and broccoli stir-fry in a garlicky stir-fry sauce, served over rice.",
    "id": 88,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef"
    ],
    "flavor": "spicy",
    "activeTime": 7,
    "components": [
      {
        "name": "Ground Beef (93% lean)",
        "quantity": 568,
        "unit": "g"
      },
      {
        "name": "Beef & Broccoli Stir-Fry Sauce (bottled, 3 tbsp per bowl)",
        "quantity": 180,
        "unit": "ml"
      },
      {
        "name": "Sriracha (1 tbsp per bowl)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Olive Oil (1 tsp per bowl)",
        "quantity": 20,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp per bowl)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Extra Red Pepper Flakes"
    ],
    "instructions": [
      "Heat oil in a large skillet over medium-high. Add ground beef, breaking it apart with a spoon. Cook 10-12 minutes, stirring occasionally, until browned throughout.",
      "Add stir-fry sauce, sriracha, and minced garlic -- the sriracha is what actually makes this \"spicy\" beef and broccoli instead of just a mild garlicky one. Simmer 3-4 minutes, stirring, until the sauce thickens slightly and coats the beef.",
      "Divide the beef evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave rice pouch 90 sec + steam-bag broccoli 3 min. Build bowl with rice, top with a portion of beef, broccoli on side. Toppings on side."
    ],
    "totalTime": 7,
    "pantryTags": [
      "rice",
      "frozen_veg",
      "ground_beef",
      "onion_garlic",
      "hot_sauce"
    ]
  },
  {
    "name": "Buffalo Shrimp Rice Bowl",
    "description": "Crispy air-fried buffalo shrimp over rice with broccoli and a cooling ranch drizzle.",
    "id": 89,
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
        "name": "Buffalo Sauce (3 tbsp)",
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
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
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
      }
    ],
    "toppings": [
      "Celery Powder",
      "Parmesan"
    ],
    "instructions": [
      "Spray shrimp with olive oil and season with garlic powder, salt, and pepper. Air fry 380°F for 8–10 min. Toss in buffalo sauce.",
      "Microwave rice 90 sec + broccoli 3 min. Season the broccoli with garlic powder, onion powder, and a pinch of chili flakes. Build bowl.",
      "Drizzle ranch dressing over shrimp. Toppings on side."
    ],
    "totalTime": 15,
    "pantryTags": [
      "frozen_veg",
      "hot_sauce",
      "rice",
      "salad_dressing",
      "shrimp"
    ]
  },
  {
    "name": "Easy Shakshuka",
    "description": "A quick, spiced shakshuka of eggs poached in a garlicky bell pepper marinara sauce with cumin and smoked paprika.",
    "id": 90,
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 14,
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
        "name": "Bell Pepper (diced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Onion Powder (seasoning)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
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
      "Heat pan over medium. Add jar onions and diced bell pepper, cook 4-5 min until softened -- the bell pepper is what makes this taste like real shakshuka, not just eggs in marinara.",
      "Pour in the marinara sauce. Stir in minced garlic, onion powder, cumin, and smoked paprika. Simmer 3 min.",
      "Create 4 wells in the sauce using a spoon. Crack one egg into each well.",
      "Cover pan with lid. Cook 5-7 min until whites are set but yolks still slightly runny. Crumble feta over top. Serve with sourdough for dipping."
    ],
    "totalTime": 14,
    "pantryTags": [
      "eggs",
      "marinara",
      "onion_garlic"
    ]
  },
  {
    "name": "Shakshuka from Scratch",
    "description": "A from-scratch spiced shakshuka -- eggs poached in a garlicky, cumin-and-paprika crushed tomato and bell pepper sauce with a touch of heat.",
    "id": 91,
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 17,
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
        "name": "Bell Pepper (diced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Olive Oil",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
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
      "Heat olive oil in pan over medium. Add jar onions and diced bell pepper, cook 5 min until softened -- real shakshuka builds its base on bell pepper and onion together, not onion alone.",
      "Add minced garlic, cumin, smoked paprika, red pepper flakes. Stir 30 seconds to bloom spices.",
      "Pour in crushed tomatoes. Season with salt. Simmer 5 min, stirring occasionally, until sauce thickens slightly.",
      "Create 4 wells in sauce. Crack one egg into each well.",
      "Cover and cook 5-7 min until whites are set, yolks runny. Crumble feta over top. Serve with sourdough."
    ],
    "totalTime": 17,
    "pantryTags": [
      "eggs",
      "canned_tomatoes",
      "onion_garlic"
    ]
  },
  {
    "name": "Soy Garlic Rice Skillet",
    "description": "An Asian-inspired ground {{protein}} and rice skillet in a garlic-ginger soy glaze with a touch of brown sugar and sesame oil.",
    "id": 92,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Oyster Sauce (1 tbsp)",
            "quantity": 15,
            "unit": "ml"
          }
        ],
        "instructions": {
          "2": "Stir in soy sauce, brown sugar, sesame oil, oyster sauce, and red pepper flakes for extra depth. Simmer 2-3 minutes, stirring occasionally, until the sauce thickens slightly and coats the {{protein}}."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Rice Vinegar (1 tsp)",
            "quantity": 5,
            "unit": "ml"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet or pot over medium-high heat. Add ground {{protein}}, breaking it apart with a spoon. Cook 8-10 minutes, stirring occasionally, until browned throughout -- ground chicken cooks faster than beef, so keep an eye on it. Drain excess fat if needed.",
          "2": "Stir in soy sauce, brown sugar, sesame oil, rice vinegar, and red pepper flakes -- the vinegar brightens the glaze against chicken's milder flavor. Simmer 2-3 minutes, stirring occasionally, until the sauce thickens slightly and coats the {{protein}}."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Five-Spice Powder (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "2": "Stir in soy sauce, brown sugar, sesame oil, five-spice powder, and red pepper flakes -- five-spice is a classic match for pork. Simmer 2-3 minutes, stirring occasionally, until the sauce thickens slightly and coats the {{protein}}."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Minced Garlic, extra (1 tsp)",
            "quantity": 5,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet or pot over medium-high heat. Add ground {{protein}}, breaking it apart with a spoon. Cook 8-10 minutes, stirring occasionally, until browned throughout -- ground turkey cooks faster than beef, so keep an eye on it. Drain excess fat if needed.",
          "2": "Stir in soy sauce, brown sugar, sesame oil, the extra garlic, and red pepper flakes -- the extra garlic gives turkey's milder flavor more to hold onto. Simmer 2-3 minutes, stirring occasionally, until the sauce thickens slightly and coats the {{protein}}."
        }
      }
    ],
    "flavor": "asian",
    "activeTime": 14,
    "components": [
      {
        "name": "Soy Sauce (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Minced Garlic (jarred, 4 tsp)",
        "quantity": 20,
        "unit": "g"
      },
      {
        "name": "Ground Ginger (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Brown Sugar (3 tbsp, packed)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (1 tbsp)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Red Pepper Flakes (¼ tsp)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a large skillet or pot over medium-high heat. Add ground {{protein}}, breaking it apart with a spoon. Cook 10-12 minutes, stirring occasionally, until browned throughout. Drain excess fat if needed.",
      "Push the {{protein}} to one side, add minced garlic and ground ginger to the cleared space, and cook 30-45 seconds, stirring, until fragrant.",
      "Stir in soy sauce, brown sugar, sesame oil, and red pepper flakes. Simmer 2-3 minutes, stirring occasionally, until the sauce thickens slightly and coats the {{protein}}.",
      "Divide the {{protein}} evenly into 4 containers and refrigerate (up to 4 days) or freeze. To serve one portion: microwave rice pouch 90 sec + steam-bag veg 3 min. Build bowl with rice, top with {{protein}}. Toppings on the side."
    ],
    "totalTime": 14,
    "pantryTags": [
      "frozen_veg",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "onion_garlic",
      "rice",
      "soy_sauce"
    ]
  },
  {
    "name": "BBQ Skillet Hash Browns",
    "description": "A smoky BBQ ground {{protein}} and hash brown skillet with garlic and a side of seasoned broccoli.",
    "id": 93,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Worcestershire Sauce (1 tsp)",
            "quantity": 5,
            "unit": "ml"
          }
        ],
        "instructions": {
          "1": "Stir in BBQ sauce and Worcestershire sauce generously -- the Worcestershire adds a savory backbone that stands up to beef. Cook 2-3 minutes more."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Smoked Paprika (½ tsp)",
            "quantity": 2,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high heat. Add ground {{protein}}, minced garlic, onion powder, salt, and pepper, breaking the meat apart with a spoon. Cook 8-10 minutes until browned throughout -- ground chicken cooks faster than beef.",
          "1": "Stir in BBQ sauce and smoked paprika generously -- the extra smokiness makes up for chicken's milder flavor. Cook 2-3 minutes more."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Apple Cider Vinegar (1 tsp)",
            "quantity": 5,
            "unit": "ml"
          }
        ],
        "instructions": {
          "1": "Stir in BBQ sauce and apple cider vinegar generously -- classic pulled-pork tang. Cook 2-3 minutes more."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Brown Sugar (1 tsp)",
            "quantity": 4,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high heat. Add ground {{protein}}, minced garlic, onion powder, salt, and pepper, breaking the meat apart with a spoon. Cook 8-10 minutes until browned throughout -- ground turkey cooks faster than beef.",
          "1": "Stir in BBQ sauce and brown sugar generously -- the extra sweetness rounds out turkey's leaner flavor. Cook 2-3 minutes more."
        }
      }
    ],
    "flavor": "spicy",
    "activeTime": 13,
    "components": [
      {
        "name": "BBQ Sauce (bottled)",
        "quantity": 128,
        "unit": "ml"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "Onion Powder (½ tsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Salt (pinch)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Black Pepper (pinch)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Frozen Hash Browns (shredded, bagged, 1 portion per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Cheddar Cheese",
      "Fried Onions (canned)"
    ],
    "instructions": [
      "Heat a large skillet over medium-high heat. Add ground {{protein}}, minced garlic, onion powder, salt, and pepper, breaking the meat apart with a spoon. Cook 10-12 minutes until browned throughout.",
      "Stir in BBQ sauce generously. Cook 2-3 minutes more.",
      "Divide the {{protein}} mixture evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave a portion of hash browns per package directions (usually 2-3 min), or air fry/bake if you'd rather have them crispy. Steam-bag broccoli 3 min, season with a pinch of onion powder and chili flakes. Plate hash browns, top with a portion of the {{protein}} mixture, broccoli on the side. Toppings on the side."
    ],
    "totalTime": 13,
    "pantryTags": [
      "bbq_sauce",
      "frozen_veg",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "potatoes"
    ]
  },
  {
    "name": "Saucy Tomato Bowl",
    "description": "A saucy, well-spiced ground {{protein}} and tomato skillet with cumin, oregano, and smoked paprika, finished with butter and spinach over rice.",
    "id": 94,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Balsamic Vinegar (1 tbsp)",
            "quantity": 15,
            "unit": "ml"
          }
        ],
        "instructions": {
          "1": "Stir in tomato paste, minced garlic, onion powder, cumin, oregano, red pepper flakes, smoked paprika, salt, and balsamic vinegar, cooking 1 minute until fragrant -- the balsamic adds richness that pairs well with beef. Add canned tomatoes (with liquid) and spinach. Simmer 4-5 minutes, stirring until the spinach wilts and the sauce thickens slightly."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fresh Basil, chopped (2 tbsp)",
            "quantity": 5,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet or pot over medium-high heat. Add ground {{protein}} and break apart. Cook 8-10 minutes until mostly browned throughout -- ground chicken cooks faster than beef.",
          "1": "Stir in tomato paste, minced garlic, onion powder, cumin, oregano, red pepper flakes, smoked paprika, and salt, cooking 1 minute until fragrant. Add canned tomatoes (with liquid) and spinach. Simmer 4-5 minutes, stirring until the spinach wilts. Off heat, stir in fresh basil for a brighter finish that suits chicken."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fennel Seed (½ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Stir in tomato paste, minced garlic, onion powder, cumin, oregano, red pepper flakes, smoked paprika, salt, and fennel seed -- fennel is the classic Italian-sausage pairing with pork and tomato. Cook 1 minute until fragrant. Add canned tomatoes (with liquid) and spinach. Simmer 4-5 minutes, stirring until the spinach wilts and the sauce thickens slightly."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Red Pepper Flakes, extra (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet or pot over medium-high heat. Add ground {{protein}} and break apart. Cook 8-10 minutes until mostly browned throughout -- ground turkey cooks faster than beef.",
          "1": "Stir in tomato paste, minced garlic, onion powder, cumin, oregano, red pepper flakes (plus the extra pinch), smoked paprika, and salt -- a little more heat helps turkey's milder flavor stand out. Cook 1 minute until fragrant. Add canned tomatoes (with liquid) and spinach. Simmer 4-5 minutes, stirring until the spinach wilts and the sauce thickens slightly."
        }
      }
    ],
    "flavor": "saucy",
    "activeTime": 12,
    "components": [
      {
        "name": "Canned Diced Tomatoes",
        "quantity": 800,
        "unit": "ml"
      },
      {
        "name": "Tomato Paste (1 tbsp)",
        "quantity": 64,
        "unit": "g"
      },
      {
        "name": "Minced Garlic (jarred, 3 tsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Onion Powder (1 tsp)",
        "quantity": 12,
        "unit": "g"
      },
      {
        "name": "Ground Cumin (1 tsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Dried Oregano (1 tsp)",
        "quantity": 4,
        "unit": "g"
      },
      {
        "name": "Red Pepper Flakes (½ tsp)",
        "quantity": 4,
        "unit": "g"
      },
      {
        "name": "Smoked Paprika (½ tsp)",
        "quantity": 4,
        "unit": "g"
      },
      {
        "name": "Salt (¼ tsp)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 340,
        "unit": "g"
      }
    ],
    "toppings": [
      "Parmesan Cheese",
      "Fresh Basil (if available)"
    ],
    "instructions": [
      "Heat a large skillet or pot over medium-high heat. Add ground {{protein}} and break apart. Cook 10-12 minutes until mostly browned throughout.",
      "Stir in tomato paste, minced garlic, onion powder, cumin, oregano, red pepper flakes, smoked paprika, and salt, cooking 1 minute until fragrant -- this is where the real flavor comes from, not just the tomatoes. Add canned tomatoes (with liquid) and spinach. Simmer 4-5 minutes, stirring until the spinach wilts and the sauce thickens slightly.",
      "Stir in butter off heat for a glossy, rich sauce. Divide the {{protein}} and tomato sauce evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave a rice pouch 90 sec. Build bowl with rice, top with a portion of the {{protein}} & tomato sauce."
    ],
    "totalTime": 12,
    "pantryTags": [
      "butter",
      "canned_tomatoes",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "rice"
    ]
  },
  {
    "name": "Spicy Gochujang Rice",
    "description": "A spicy Korean-style gochujang {{protein}} and rice skillet with a touch of honey.",
    "id": 95,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Sesame Oil (1 tsp)",
            "quantity": 5,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "In a bowl, mix gochujang, soy sauce, honey, and sesame oil for extra richness. Pour over {{protein}} and stir well. Cook 2 minutes more."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Rice Vinegar (1 tsp)",
            "quantity": 5,
            "unit": "ml"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high heat. Add ground {{protein}}, break apart with a spoon. Cook 8-10 minutes until browned throughout -- ground chicken cooks faster than beef.",
          "1": "In a bowl, mix gochujang, soy sauce, honey, and rice vinegar -- the vinegar brightens the glaze against chicken's milder flavor. Pour over {{protein}} and stir well. Cook 2 minutes more."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fresh Ginger, grated (½ tsp)",
            "quantity": 2,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "In a bowl, mix gochujang, soy sauce, honey, and grated ginger -- ginger and gochujang are a classic match for pork. Pour over {{protein}} and stir well. Cook 2 minutes more."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Honey, extra (1 tsp)",
            "quantity": 7,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high heat. Add ground {{protein}}, break apart with a spoon. Cook 8-10 minutes until browned throughout -- ground turkey cooks faster than beef.",
          "1": "In a bowl, mix gochujang, soy sauce, and honey (plus the extra honey) -- a little more sweetness balances turkey's milder flavor against the heat. Pour over {{protein}} and stir well. Cook 2 minutes more."
        }
      }
    ],
    "flavor": "spicy",
    "activeTime": 13,
    "components": [
      {
        "name": "Gochujang Sauce (bottled)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce",
        "quantity": 32,
        "unit": "ml"
      },
      {
        "name": "Honey (squeeze bottle)",
        "quantity": 40,
        "unit": "ml"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a large skillet over medium-high heat. Add ground {{protein}}, break apart with a spoon. Cook 10-12 minutes until browned throughout.",
      "In a bowl, mix gochujang, soy sauce, and honey. Pour over {{protein}} and stir well. Cook 2 minutes more.",
      "Divide the spicy {{protein}} evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave rice pouch 90 sec + steam-bag broccoli 3 min, season broccoli with a pinch of garlic powder and chili flakes. Build bowl with rice, top with a portion of the {{protein}}, broccoli on side. Sesame & onion on top."
    ],
    "totalTime": 13,
    "pantryTags": [
      "frozen_veg",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "hot_sauce",
      "rice",
      "soy_sauce"
    ]
  },
  {
    "name": "Pasta Marinara Skillet",
    "description": "A quick Italian-style ground {{protein}} and marinara pasta skillet with wilted spinach.",
    "id": 96,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Red Wine Vinegar (1 tsp)",
            "quantity": 5,
            "unit": "ml"
          }
        ],
        "instructions": {
          "2": "Add marinara sauce, spinach, and red wine vinegar to the meat -- the vinegar brightens a rich beef ragu. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 3-4 minutes until the spinach wilts. Combine with the cooked pasta."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fresh Basil, chopped (2 tbsp)",
            "quantity": 5,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Meanwhile, heat a large skillet over medium-high. Add ground {{protein}}, break apart. Cook 8-10 minutes until browned throughout -- ground chicken cooks faster than beef.",
          "2": "Add marinara sauce and spinach to the meat. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 3-4 minutes until the spinach wilts. Off heat, stir in fresh basil for a bright, cacciatore-style finish. Combine with the cooked pasta."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fennel Seed (½ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "2": "Add marinara sauce, spinach, and fennel seed to the meat -- fennel is the classic Italian-sausage pairing with pork. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 3-4 minutes until the spinach wilts. Combine with the cooked pasta."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Italian Seasoning, extra (1 tsp)",
            "quantity": 3,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Meanwhile, heat a large skillet over medium-high. Add ground {{protein}}, break apart. Cook 8-10 minutes until browned throughout -- ground turkey cooks faster than beef.",
          "2": "Add marinara sauce, spinach, and the extra Italian seasoning to the meat -- it gives turkey's milder flavor more to hold onto. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 3-4 minutes until the spinach wilts. Combine with the cooked pasta."
        }
      }
    ],
    "flavor": "saucy",
    "activeTime": 15,
    "components": [
      {
        "name": "Marinara Sauce (bottled)",
        "quantity": 400,
        "unit": "ml"
      },
      {
        "name": "Pasta (dry, protein pasta recommended)",
        "quantity": 340,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (pre-washed bag)",
        "quantity": 340,
        "unit": "g"
      }
    ],
    "toppings": [
      "Mozzarella Cheese",
      "Parmesan"
    ],
    "instructions": [
      "Bring a large pot of water to a boil. Add pasta and cook per package directions (usually 8-10 min) until al dente, then drain.",
      "Meanwhile, heat a large skillet over medium-high. Add ground {{protein}}, break apart. Cook 10-12 minutes until browned throughout.",
      "Add marinara sauce and spinach to the meat. Season the spinach with a pinch of garlic powder and onion powder. Stir and simmer 3-4 minutes until the spinach wilts. Combine with the cooked pasta.",
      "Divide the pasta and sauce evenly into 4 containers and refrigerate (up to 4 days) or freeze. To serve one portion: reheat in the microwave until hot throughout. Cheese on top."
    ],
    "totalTime": 15,
    "pantryTags": [
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "marinara",
      "pasta"
    ]
  },
  {
    "name": "Taco Tortilla Skillet",
    "description": "A Mexican-style taco {{protein}} and tortilla skillet with salsa and mixed veg.",
    "id": 97,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Chipotle Powder (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Sprinkle taco seasoning and chipotle powder over the meat and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat, not just a dry-seasoned crumble. Simmer 2-3 minutes."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fresh Lime Juice (1 tbsp)",
            "quantity": 15,
            "unit": "ml"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high. Add ground {{protein}} and break apart. Cook 8-10 minutes until browned throughout -- ground chicken cooks faster than beef.",
          "1": "Sprinkle taco seasoning over the meat and stir in the salsa and lime juice (instead of water) -- it cooks down into a real sauce that coats the meat, brightened for chicken. Simmer 2-3 minutes."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Ground Cinnamon (⅛ tsp)",
            "quantity": 0.5,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Sprinkle taco seasoning and a pinch of cinnamon over the meat (al pastor-inspired) and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat. Simmer 2-3 minutes."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Smoked Paprika (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high. Add ground {{protein}} and break apart. Cook 8-10 minutes until browned throughout -- ground turkey cooks faster than beef.",
          "1": "Sprinkle taco seasoning and smoked paprika over the meat -- the extra smokiness gives turkey's milder flavor more depth -- and stir in the salsa (instead of water). Simmer 2-3 minutes."
        }
      }
    ],
    "flavor": "spicy",
    "activeTime": 12,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Taco Seasoning (packet)",
        "quantity": 48,
        "unit": "g"
      },
      {
        "name": "Salsa (bottled, 3 tbsp)",
        "quantity": 192,
        "unit": "ml"
      },
      {
        "name": "Corn Tortillas (2 per meal, warmed)",
        "quantity": 8,
        "unit": "each"
      },
      {
        "name": "Frozen Mixed Veg (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Shredded Cheddar",
      "Sour Cream"
    ],
    "instructions": [
      "Heat a large skillet over medium-high. Add ground {{protein}} and break apart. Cook 10-12 minutes until browned throughout.",
      "Sprinkle taco seasoning over the meat and stir in the salsa (instead of water) -- it cooks down into a real sauce that coats the meat, not just a dry-seasoned crumble. Simmer 2-3 minutes.",
      "Divide the taco {{protein}} evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: heat 2 tortillas in a dry pan 30 sec per side. Microwave veg 3 min. Build tacos with a portion of the {{protein}}. Toppings on the side."
    ],
    "totalTime": 12,
    "pantryTags": [
      "frozen_veg",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "salsa",
      "tortillas"
    ]
  },
  {
    "name": "Creamy Mushroom Skillet",
    "description": "A creamy, high-protein {{protein}} stroganoff-style skillet with real sautéed mushrooms and sour cream over egg noodles.",
    "id": 98,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Beef Stroganoff Sauce Mix (powder)",
            "quantity": 80,
            "unit": "ml"
          },
          {
            "name": "Cracked Black Pepper, extra (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Mix the stroganoff sauce powder with 2 cups water per package, then add to the meat along with the extra black pepper -- classic peppery beef stroganoff. Simmer 4-5 minutes. Remove from heat and stir in sour cream."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Chicken Gravy Mix (powder)",
            "quantity": 80,
            "unit": "ml"
          },
          {
            "name": "Fresh Thyme (½ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high. Add ground {{protein}} and break apart. Cook 8-10 minutes until browned throughout -- ground chicken cooks faster than beef. Add the sliced mushrooms in the last 3-4 minutes and cook until softened and lightly browned.",
          "1": "Mix the chicken gravy mix with 2 cups water per package, then add to the meat along with fresh thyme -- a classic creamy chicken herb pairing. Simmer 4-5 minutes. Remove from heat and stir in sour cream."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Brown Gravy Mix (powder)",
            "quantity": 80,
            "unit": "ml"
          },
          {
            "name": "Smoked Paprika (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Mix the brown gravy mix with 2 cups water per package, then add to the meat along with smoked paprika for a goulash-style warmth that suits pork. Simmer 4-5 minutes. Remove from heat and stir in sour cream."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Turkey Gravy Mix (powder)",
            "quantity": 80,
            "unit": "ml"
          },
          {
            "name": "Fresh Sage (½ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high. Add ground {{protein}} and break apart. Cook 8-10 minutes until browned throughout -- ground turkey cooks faster than beef. Add the sliced mushrooms in the last 3-4 minutes and cook until softened and lightly browned.",
          "1": "Mix the turkey gravy mix with 2 cups water per package, then add to the meat along with fresh sage -- a classic turkey herb pairing. Simmer 4-5 minutes. Remove from heat and stir in sour cream."
        }
      }
    ],
    "flavor": "saucy",
    "activeTime": 14,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Cremini Mushrooms (sliced, 3 cups)",
        "quantity": 270,
        "unit": "g"
      },
      {
        "name": "Sour Cream",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Egg Noodles (microwave cup, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Parmesan",
      "Fresh Dill (if available)"
    ],
    "instructions": [
      "Heat a large skillet over medium-high. Add ground {{protein}} and break apart. Cook 10-12 minutes until browned throughout. Add the sliced mushrooms in the last 3-4 minutes and cook until softened and lightly browned -- real stroganoff is built on browned mushrooms, not just gravy.",
      "Mix stroganoff sauce powder with 2 cups water per package, then add to the meat. Simmer 4-5 minutes. Remove from heat and stir in sour cream.",
      "Divide the {{protein}} stroganoff evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave egg noodles per package + microwave broccoli 3 min, season broccoli with a pinch of garlic powder and onion powder. Combine noodles with a portion of the stroganoff. Broccoli on side."
    ],
    "totalTime": 14,
    "pantryTags": [
      "frozen_veg",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "pasta",
      "sour_cream",
      "mushroom"
    ]
  },
  {
    "name": "Teriyaki Broccoli Bowl",
    "description": "An Asian-inspired teriyaki ground {{protein}} and broccoli bowl over rice.",
    "id": 99,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "beef",
      "chicken",
      "pork",
      "turkey"
    ],
    "proteinOptions": [
      {
        "id": "beef",
        "label": "Beef",
        "components": [
          {
            "name": "Ground Beef (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Sesame Oil (1 tsp)",
            "quantity": 5,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Drizzle teriyaki sauce and sesame oil over {{protein}} and stir well -- the sesame oil adds richness that suits beef. Cook 2 minutes more."
        }
      },
      {
        "id": "chicken",
        "label": "Chicken",
        "components": [
          {
            "name": "Ground Chicken (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Rice Vinegar (1 tsp)",
            "quantity": 5,
            "unit": "ml"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high heat. Add ground {{protein}} and minced garlic, breaking the meat apart. Cook 8-10 minutes until browned throughout -- ground chicken cooks faster than beef.",
          "1": "Drizzle teriyaki sauce and rice vinegar over {{protein}} and stir well -- the vinegar brightens the glaze against chicken's milder flavor. Cook 2 minutes more."
        }
      },
      {
        "id": "pork",
        "label": "Pork",
        "components": [
          {
            "name": "Ground Pork (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Fresh Ginger, grated (½ tsp)",
            "quantity": 2,
            "unit": "g"
          }
        ],
        "instructions": {
          "1": "Drizzle teriyaki sauce over {{protein}} and stir in the grated ginger -- ginger and teriyaki are a classic match for pork. Cook 2 minutes more."
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "components": [
          {
            "name": "Ground Turkey (93% lean)",
            "quantity": 568,
            "unit": "g"
          },
          {
            "name": "Cracked Black Pepper (¼ tsp)",
            "quantity": 1,
            "unit": "g"
          }
        ],
        "instructions": {
          "0": "Heat a large skillet over medium-high heat. Add ground {{protein}} and minced garlic, breaking the meat apart. Cook 8-10 minutes until browned throughout -- ground turkey cooks faster than beef.",
          "1": "Drizzle teriyaki sauce over {{protein}} and stir in the cracked black pepper for a little extra punch against turkey's milder flavor. Cook 2 minutes more."
        }
      }
    ],
    "flavor": "asian",
    "activeTime": 12,
    "components": [
      {
        "name": "Teriyaki Sauce (bottled)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Minced Garlic (jarred, 1½ tsp)",
        "quantity": 7.5,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Frozen Broccoli (steam-bag, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Sesame Seeds",
      "Green Onion"
    ],
    "instructions": [
      "Heat a large skillet over medium-high heat. Add ground {{protein}} and minced garlic, breaking the meat apart. Cook 10-12 minutes until browned throughout.",
      "Drizzle teriyaki sauce over {{protein}} and stir well. Cook 2 minutes more.",
      "Divide the teriyaki {{protein}} evenly into 4 containers and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave rice pouch 90 sec + steam-bag broccoli 3 min, season broccoli with sesame seeds. Build bowl with rice, top with a portion of the {{protein}}, broccoli on side. Toppings on top."
    ],
    "totalTime": 12,
    "pantryTags": [
      "frozen_veg",
      "ground_beef",
      "ground_chicken",
      "ground_pork",
      "ground_turkey",
      "rice",
      "soy_sauce",
      "teriyaki_sauce"
    ]
  },
  {
    "name": "Sweet Potato Black Bean Enchiladas",
    "description": "Mexican-style baked enchiladas filled with black beans and sweet potato, smothered in enchilada sauce and cheese.",
    "id": 124,
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
      },
      {
        "name": "Ground Cumin (1 tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Chili Powder (1 tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
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
      "In a bowl, mix black beans, sweet potato, cumin, chili powder, garlic powder, and ¼ cup of the enchilada sauce -- seasoning the filling directly keeps it from tasting like plain beans under sauce.",
      "Spoon filling onto tortillas, roll, and place seam-down in a baking dish. Pour remaining sauce over the top, then sprinkle with cheese.",
      "Bake 20 minutes until the cheese is melted and the edges are bubbling."
    ],
    "totalTime": 30,
    "pantryTags": [
      "canned_beans",
      "cheese",
      "potatoes",
      "salsa",
      "tortillas"
    ]
  },
  {
    "name": "Air Fryer Salmon with Arugula Berry Salad",
    "description": "Mediterranean-style air-fried lemon-pepper salmon over a peppery arugula and berry salad with feta and balsamic.",
    "id": 125,
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
      "fruit",
      "salad_dressing",
      "salad_greens",
      "salmon"
    ]
  },
  {
    "name": "Egg & Sausage Casserole",
    "description": "A hearty baked egg and sausage casserole with hash browns, cheddar, and milk -- great for meal prep.",
    "id": 126,
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
    "name": "Jamaican Jerk Chicken with Sweet Potato Zoodles",
    "description": "Caribbean-style jerk chicken thighs air-fried and served over bright lime-kissed sweet potato noodles.",
    "id": 127,
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
      "chicken_thighs",
      "pasta",
      "potatoes"
    ]
  },
  {
    "name": "Slow Cooker Chicken & Sausage Gumbo",
    "description": "A slow-cooked Cajun-style gumbo with andouille sausage, rotisserie chicken, and a dark roux, served over rice.",
    "id": 128,
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
    "name": "Air Fryer Turkey Meatballs with Marinara",
    "description": "Air-fried Italian-style turkey meatballs in marinara with mozzarella, served over spaghetti.",
    "id": 129,
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 4,
    "proteins": [
      "turkey"
    ],
    "flavor": "italian",
    "activeTime": 6,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Turkey Meatballs (pre-formed)",
        "quantity": 1120,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (jarred)",
        "quantity": 800,
        "unit": "ml"
      },
      {
        "name": "Shredded Mozzarella (bagged)",
        "quantity": 240,
        "unit": "g"
      },
      {
        "name": "Spaghetti Pouch (microwaveable, pre-cooked, 1 per meal)",
        "quantity": 4,
        "unit": "each"
      }
    ],
    "toppings": [
      "Grated Parmesan",
      "Red Pepper Flakes"
    ],
    "instructions": [
      "Air fry frozen turkey meatballs in batches at 400°F for 10–12 minutes each, shaking the basket halfway.",
      "Microwave the meatballs with the marinara sauce to warm through, about 3-4 minutes total.",
      "Divide the meatballs and sauce evenly into 4 containers, top with mozzarella, and refrigerate (up to 4 days) or freeze.",
      "To serve one portion: microwave a spaghetti pouch 90 sec. Reheat a portion of meatballs and sauce until hot and the cheese melts. Combine with the pasta."
    ],
    "totalTime": 20,
    "pantryTags": [
      "cheese",
      "marinara",
      "pasta",
      "sausage"
    ]
  },
  {
    "name": "Air Fryer BBQ Pork Chops with Coleslaw",
    "description": "Smoky air-fried BBQ pork chops with smoked paprika, served alongside creamy coleslaw.",
    "id": 130,
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
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Smoked Paprika (½ tsp)",
        "quantity": 2,
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
      }
    ],
    "toppings": [
      "Extra BBQ Sauce"
    ],
    "instructions": [
      "Season pork chops all over with garlic powder, smoked paprika, salt, and pepper, then brush with half the BBQ sauce.",
      "Air fry 380°F for 12–14 minutes, flipping halfway, until internal temp reaches 145°F. Brush with remaining sauce for the last 2 minutes.",
      "Toss coleslaw mix with dressing in a bowl. Serve alongside the pork chops."
    ],
    "totalTime": 19,
    "pantryTags": [
      "bbq_sauce",
      "pork",
      "salad_dressing"
    ]
  },
  {
    "name": "Air Fryer Buffalo Chicken Bites",
    "description": "Crispy air-fried breaded chicken bites tossed in spicy buffalo sauce -- a fast snack.",
    "id": 131,
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
    "name": "Cottage Cheese Protein Bowl",
    "description": "A simple no-cook cottage cheese bowl with berries, granola, and honey.",
    "id": 132,
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
      "cottage_cheese",
      "fruit"
    ]
  },
  {
    "name": "Turkey & Egg Breakfast Wrap",
    "description": "A grab-and-go microwave breakfast wrap with eggs, turkey sausage, and melted cheddar.",
    "id": 133,
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
    "name": "Greek Yogurt Protein Parfait",
    "description": "The classic Greek breakfast of yiaourti me meli -- thick Greek yogurt swirled with vanilla protein powder, honey, cinnamon, and crushed pistachios or walnuts.",
    "id": 134,
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "mediterranean",
    "activeTime": 3,
    "tags": [
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Greek Yogurt (plain, tub)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Vanilla Protein Powder (½ scoop)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Honey (drizzle)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Cinnamon (pinch)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Pistachios or Walnuts (crushed, 2 tbsp)",
        "quantity": 15,
        "unit": "g"
      }
    ],
    "toppings": [],
    "instructions": [
      "Stir the protein powder into the yogurt until smooth -- this is the classic Greek yiaourti me meli, built on yogurt and honey rather than granola and fruit.",
      "Spoon into a cup or jar. Drizzle with honey, dust with cinnamon, and top with crushed pistachios or walnuts. Cover and grab it on the way out."
    ],
    "totalTime": 3,
    "pantryTags": [
      "greek_yogurt",
      "protein_powder"
    ]
  },
  {
    "name": "Rotisserie Chicken Caesar Grab Bowl",
    "description": "A no-cook rotisserie chicken Caesar salad bowl, ready straight from the kit.",
    "id": 135,
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
    "name": "Overnight Oats with Protein Powder",
    "description": "Make-ahead vanilla protein overnight oats with chia seeds, ready to grab all week.",
    "id": 136,
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 4,
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
        "quantity": 240,
        "unit": "g"
      },
      {
        "name": "Milk (or milk of choice)",
        "quantity": 720,
        "unit": "ml"
      },
      {
        "name": "Vanilla Protein Powder (scoop)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Chia Seeds",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "16 oz Mason Jars or Lidded Containers (1 per serving)",
        "quantity": 4,
        "unit": "count"
      }
    ],
    "toppings": [
      "Fresh Berries"
    ],
    "instructions": [
      "Divide oats, milk, protein powder, and chia seeds evenly among 4 jars and stir each together.",
      "Cover and refrigerate overnight (keeps up to 4-5 days). Grab one from the fridge each morning -- eat cold or warm 60 seconds in the microwave."
    ],
    "totalTime": 3,
    "pantryTags": [
      "oats",
      "milk"
    ]
  },
  {
    "name": "Tuna Salad Lettuce Wraps",
    "description": "Light, no-cook tuna salad lettuce wraps with Dijon and dill.",
    "id": 137,
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
      },
      {
        "name": "Dijon Mustard (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Dill (dried, pinch)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Black Pepper (pinch)",
        "quantity": 0.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Black Pepper"
    ],
    "instructions": [
      "Mix tuna with mayo, dijon mustard, dill, and pepper in a bowl.",
      "Spoon into lettuce leaves and fold like a taco."
    ],
    "totalTime": 4,
    "pantryTags": [
      "butter",
      "canned_fish",
      "mayo",
      "salad_greens"
    ]
  },
  {
    "name": "Buffalo Chicken Ranch Wrap",
    "description": "A spicy microwave buffalo chicken wrap with cooling ranch and crisp lettuce.",
    "id": 138,
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
      "hot_sauce",
      "salad_dressing",
      "salad_greens",
      "tortillas"
    ]
  },
  {
    "name": "Air Fryer Sourdough Pizza",
    "description": "A crispy air-fried sourdough pizza topped with marinara, mozzarella, and turkey pepperoni.",
    "id": 139,
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
      "marinara",
      "onion_garlic"
    ]
  },
  {
    "name": "Chorizo Scrambled Eggs",
    "description": "Spicy Mexican-style chorizo scrambled eggs with melty pepper jack.",
    "id": 140,
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 4,
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
        "quantity": 452,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (16 large)",
        "quantity": 800,
        "unit": "count"
      },
      {
        "name": "Shredded Pepper Jack (bagged)",
        "quantity": 224,
        "unit": "g"
      }
    ],
    "toppings": [
      "Salsa (fresh or jarred)",
      "Fresh Cilantro"
    ],
    "instructions": [
      "Heat a large skillet over medium-high. Add chorizo and break apart. Cook 8-10 minutes until browned and cooked through.",
      "Whisk all the eggs together in a large bowl. Pour into the skillet with the chorizo and scramble until just set.",
      "Top with pepper jack and let it melt. Divide evenly into 4 portions.",
      "Refrigerate (up to 3 days) or freeze; reheat gently in the microwave. Serve with salsa and cilantro."
    ],
    "totalTime": 8,
    "pantryTags": [
      "cheese",
      "eggs",
      "sausage"
    ]
  },
  {
    "name": "Spicy Breakfast Burrito",
    "description": "A spicy Mexican-style chorizo and egg breakfast burrito with pepper jack and salsa.",
    "id": 141,
    "method": "Stovetop",
    "mealType": "breakfast",
    "servings": 4,
    "proteins": [
      "pork",
      "eggs"
    ],
    "flavor": "spicy",
    "activeTime": 10,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Ground Mexican Chorizo (raw, casing removed)",
        "quantity": 452,
        "unit": "g"
      },
      {
        "name": "Whole Eggs (3 large)",
        "quantity": 600,
        "unit": "count"
      },
      {
        "name": "Shredded Pepper Jack (bagged)",
        "quantity": 168,
        "unit": "g"
      },
      {
        "name": "Flour Tortilla (burrito-size)",
        "quantity": 4,
        "unit": "each"
      },
      {
        "name": "Salsa (jarred)",
        "quantity": 120,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Fresh Cilantro"
    ],
    "instructions": [
      "Heat a large skillet over medium-high. Add chorizo and break apart. Cook 8-10 minutes until browned throughout.",
      "Whisk eggs and pour into the skillet. Scramble together with the chorizo until just set.",
      "Sprinkle in pepper jack and let it melt. Divide the chorizo-egg mixture evenly among 4 tortillas with salsa, roll each into a burrito.",
      "Wrap each burrito individually in foil or plastic wrap and refrigerate (up to 4 days) or freeze -- a classic grab-and-go freezer burrito. To reheat: microwave 1-2 minutes (longer from frozen), flipping halfway."
    ],
    "totalTime": 10,
    "pantryTags": [
      "cheese",
      "eggs",
      "salsa",
      "sausage",
      "tortillas"
    ]
  },
  {
    "name": "Jalapeño Popper Egg Muffins",
    "description": "Baked jalapeño popper egg muffins with cream cheese, bacon, and cheddar -- a spicy grab-and-go breakfast.",
    "id": 142,
    "method": "Bake",
    "mealType": "breakfast",
    "servings": 6,
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
      "Bake 18–20 minutes until puffed and set in the center. Cool 2 minutes before removing. Keeps in the fridge for grab-and-go mornings -- 1 muffin per serving."
    ],
    "totalTime": 28,
    "pantryTags": [
      "bacon",
      "cheese",
      "cream_cheese",
      "eggs"
    ]
  },
  {
    "name": "Spicy Kimchi Fried Rice with Egg",
    "description": "A tangy, spicy kimchi fried rice topped with a fried egg and a drizzle of gochujang.",
    "id": 143,
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
      "eggs",
      "hot_sauce",
      "rice"
    ]
  },
  {
    "name": "Easy Huevos Rancheros",
    "description": "Mexican-style huevos rancheros with warmed refried beans, fried eggs, salsa, and cheese on tortillas.",
    "id": 144,
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
      },
      {
        "name": "Ground Cumin (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Chili Powder (½ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Hot Sauce",
      "Fresh Cilantro",
      "Sliced Avocado (pre-cut)"
    ],
    "instructions": [
      "Microwave refried beans with cumin, chili powder, and garlic powder in a bowl 1–2 minutes until warmed through and stirred in -- plain refried beans need this to taste like a real ranchero-style base instead of just canned beans.",
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
    "name": "Sriracha Egg & Cheese Breakfast Sandwich",
    "description": "A spicy sriracha egg and cheese breakfast sandwich on a toasted English muffin.",
    "id": 145,
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
      "buns_rolls",
      "cheese",
      "eggs",
      "hot_sauce",
      "mayo"
    ]
  },
  {
    "name": "Marry Me Chicken",
    "description": "A viral, creamy garlic-parmesan chicken skillet with sun-dried tomatoes and basil in a sauce so good it earned its name.",
    "id": 200,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "italian",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, pounded thin)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Sun-Dried Tomatoes (jarred, oil-packed, chopped, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Heavy Cream (½ cup)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Low-Sodium Chicken Broth (½ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Parmesan (grated, ¼ cup)",
        "quantity": 25,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 2 cloves)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Fresh Basil, torn",
      "Extra Parmesan"
    ],
    "instructions": [
      "Season the chicken with salt, pepper, and half the Italian seasoning. Spray a skillet with oil and sear over medium-high 4–5 minutes per side until golden and cooked through. Remove and set aside.",
      "In the same skillet, add garlic and sun-dried tomatoes. Cook 1 minute until fragrant.",
      "Stir in broth, cream, parmesan, and remaining Italian seasoning. Simmer 3–4 minutes until slightly thickened.",
      "Return the chicken to the skillet, spoon sauce over the top, and simmer 2 more minutes. Top with basil and extra parmesan."
    ],
    "totalTime": 15,
    "pantryTags": [
      "chicken_breast",
      "cheese",
      "canned_tomatoes"
    ]
  },
  {
    "name": "Marry Me Salmon",
    "description": "The viral Marry Me sauce — creamy sun-dried tomato and parmesan — poured over a pan-seared salmon fillet.",
    "id": 201,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "italian",
    "activeTime": 14,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Salmon Fillet (1 fillet)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Sun-Dried Tomatoes (jarred, oil-packed, chopped, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Heavy Cream (½ cup)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Low-Sodium Chicken Broth (¼ cup)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Parmesan (grated, ¼ cup)",
        "quantity": 25,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 2 cloves)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Fresh Basil, torn"
    ],
    "instructions": [
      "Pat the salmon dry and season with salt, pepper, and half the Italian seasoning. Spray a skillet with oil and sear skin-side down over medium-high 4 minutes, flip, and cook 3 more minutes. Remove and set aside.",
      "In the same skillet, add garlic and sun-dried tomatoes. Cook 1 minute until fragrant.",
      "Stir in broth, cream, parmesan, and remaining Italian seasoning. Simmer 2–3 minutes until slightly thickened.",
      "Return the salmon to the skillet, spoon sauce over the top, and simmer 1 more minute. Top with basil."
    ],
    "totalTime": 14,
    "pantryTags": [
      "salmon",
      "cheese",
      "canned_tomatoes"
    ]
  },
  {
    "name": "Marry Me Chicken Tacos",
    "description": "A viral mashup — creamy sun-dried tomato Marry Me chicken folded into warm tortillas for a fusion taco night.",
    "id": 202,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mexican",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, diced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Sun-Dried Tomatoes (jarred, oil-packed, chopped, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Heavy Cream (⅓ cup)",
        "quantity": 80,
        "unit": "ml"
      },
      {
        "name": "Parmesan (grated, 2 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 2 cloves)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (1 tbsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (3 small)",
        "quantity": 78,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Fresh Cilantro, chopped",
      "Lime Wedge"
    ],
    "instructions": [
      "Season diced chicken with taco seasoning. Spray a skillet with oil and cook over medium-high 6–7 minutes until browned and cooked through. Remove and set aside.",
      "In the same skillet, add garlic and sun-dried tomatoes. Cook 1 minute until fragrant.",
      "Stir in cream and parmesan. Simmer 2 minutes until slightly thickened, then return the chicken to the skillet and toss to coat.",
      "Warm the tortillas, fill with the creamy chicken, and top with cilantro and a squeeze of lime."
    ],
    "totalTime": 15,
    "pantryTags": [
      "chicken_breast",
      "cheese",
      "tortillas",
      "canned_tomatoes"
    ]
  },
  {
    "name": "Smash Burger Tacos",
    "description": "The viral smash burger taco — a thin, crispy-edged smashed beef patty melted with cheese and folded right into a warm tortilla.",
    "id": 203,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "american",
    "activeTime": 12,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Lean Ground Beef (93/7, ¼ lb)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (2 small)",
        "quantity": 52,
        "unit": "g"
      },
      {
        "name": "Cheddar Slices (2)",
        "quantity": 42,
        "unit": "g"
      },
      {
        "name": "Yellow Onion (finely diced, 2 tbsp)",
        "quantity": 20,
        "unit": "g"
      },
      {
        "name": "Burger Seasoning (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Special Sauce: Mayo + Ketchup + Pickle Relish (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Lettuce",
      "Diced Pickles"
    ],
    "instructions": [
      "Divide beef into 2 balls. Place a tortilla in a hot dry skillet, top with a beef ball, and smash flat with a spatula right onto the tortilla. Sprinkle with onion and seasoning.",
      "Cook 2–3 minutes until the edges are crispy and browned, then flip the whole tortilla-patty stack.",
      "Add cheese on top of the meat, cover, and cook 1 more minute until melted. Repeat with the second taco.",
      "Spread special sauce on the cheese side, fold the tortilla over the meat, and top with lettuce and pickles."
    ],
    "totalTime": 12,
    "pantryTags": [
      "ground_beef",
      "tortillas",
      "cheese",
      "onion_garlic",
      "mayo"
    ]
  },
  {
    "name": "Chicken Banh Mi Rice Bowl",
    "description": "A Vietnamese-inspired banh mi bowl with garlicky chicken, quick-pickled carrots and cucumber, and a sriracha mayo drizzle.",
    "id": 204,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 14,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thigh (boneless, skinless, 1 thigh, diced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Carrot (shredded, ½ cup)",
        "quantity": 55,
        "unit": "g"
      },
      {
        "name": "Cucumber (thinly sliced, ½ cup)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Rice Vinegar (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Mayo + Sriracha (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Cilantro",
      "Sliced Jalapeño"
    ],
    "instructions": [
      "Toss carrot and cucumber with rice vinegar and a pinch of salt. Set aside to quick-pickle while you cook the chicken.",
      "Season diced chicken with garlic, salt, and pepper. Cook in a skillet over medium-high 6–7 minutes until browned and cooked through.",
      "Stir soy sauce into the chicken and cook 1 more minute to glaze.",
      "Microwave the rice per package instructions. Build the bowl with rice, chicken, and drained pickled veg. Drizzle with sriracha mayo and top with cilantro and jalapeño."
    ],
    "totalTime": 14,
    "pantryTags": [
      "chicken_thighs",
      "rice",
      "soy_sauce",
      "mayo"
    ]
  },
  {
    "name": "Crispy Rice Spicy Salmon Bites",
    "description": "The viral sushi-restaurant favorite at home — crispy air-fried rice squares topped with spicy salmon and a drizzle of spicy mayo.",
    "id": 205,
    "isNew": true,
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "asian",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "White Rice Pouch (cooked, pressed and chilled)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Raw Sushi-Grade Salmon (diced, ½ cup)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Sriracha (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Sesame Seeds"
    ],
    "instructions": [
      "Press the cooked rice firmly into a small dish lined with plastic wrap, chill 10 minutes (or freeze 5), then cut into bite-sized squares.",
      "Spray rice squares with oil on both sides and air fry at 400°F for 8–10 minutes, flipping halfway, until golden and crispy.",
      "Meanwhile, mix diced salmon with soy sauce and sesame oil. Mix mayo and sriracha for the spicy mayo.",
      "Top each crispy rice square with spicy salmon, a drizzle of spicy mayo, scallions, and sesame seeds."
    ],
    "totalTime": 15,
    "pantryTags": [
      "rice",
      "salmon",
      "mayo",
      "soy_sauce",
      "hot_sauce"
    ]
  },
  {
    "name": "Gochujang Butter Chicken Noodles",
    "description": "The viral gochujang butter noodles, leveled up with seared chicken — sweet, spicy, and glossy in a butter-soy sauce.",
    "id": 206,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, sliced thin)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Pasta & Noodles (spaghetti or ramen, dry)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled, 2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Garlic (minced, 2 cloves)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Sesame Seeds"
    ],
    "instructions": [
      "Boil the noodles per package directions, reserving ¼ cup pasta water before draining.",
      "Meanwhile, season chicken with salt and pepper and sear in a skillet over medium-high 5–6 minutes until cooked through. Remove and set aside.",
      "In the same skillet, melt butter, add garlic, gochujang, soy sauce, and honey. Stir in a splash of reserved pasta water to loosen into a glossy sauce.",
      "Add the noodles and chicken back to the skillet and toss to coat. Top with scallions and sesame seeds."
    ],
    "totalTime": 15,
    "pantryTags": [
      "chicken_breast",
      "pasta",
      "soy_sauce"
    ]
  },
  {
    "name": "Mediterranean Salmon Bowl",
    "description": "A high-protein salmon bowl dressed Mediterranean-style with a creamy tahini-lemon sauce, cucumber, and feta.",
    "id": 207,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "mediterranean",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Salmon Fillet (1 fillet)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Cucumber (diced, ½ cup)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Feta Cheese (crumbled, ¼ cup)",
        "quantity": 38,
        "unit": "g"
      },
      {
        "name": "Tahini (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Fresh Parsley, chopped",
      "Kalamata Olives"
    ],
    "instructions": [
      "Season salmon with salt, pepper, and a squeeze of lemon. Spray a skillet with oil and sear 4 minutes per side until cooked through.",
      "Whisk tahini and remaining lemon juice with a splash of water until smooth and pourable.",
      "Microwave the rice per package instructions. Build the bowl with rice, salmon, cucumber, and feta.",
      "Drizzle with tahini-lemon sauce and top with parsley and olives."
    ],
    "totalTime": 12,
    "pantryTags": [
      "salmon",
      "rice",
      "cucumber",
      "cheese"
    ]
  },
  {
    "name": "Southwest Chipotle Salmon Bowl",
    "description": "A smoky chipotle-lime salmon bowl with black beans, corn, and avocado — a high-protein twist on a Southwest burrito bowl.",
    "id": 208,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "mexican",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Salmon Fillet (1 fillet)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Black Beans (canned, drained, ½ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Corn (frozen or canned, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Chipotle Peppers in Adobo (minced, 1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Lime Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Diced Avocado",
      "Fresh Cilantro"
    ],
    "instructions": [
      "Rub salmon with chipotle, lime juice, salt, and pepper. Spray a skillet with oil and sear 4 minutes per side until cooked through.",
      "Warm the black beans and corn together in a small pan 2–3 minutes.",
      "Microwave the rice per package instructions. Build the bowl with rice, beans and corn, and salmon.",
      "Top with avocado and cilantro."
    ],
    "totalTime": 12,
    "pantryTags": [
      "salmon",
      "rice",
      "canned_beans"
    ]
  },
  {
    "name": "High Protein Chicken Burrito Bowl",
    "description": "A loaded chicken burrito bowl with seasoned rice, black beans, corn, and salsa — a quick, high-protein Chipotle copycat.",
    "id": 209,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mexican",
    "activeTime": 14,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, diced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Black Beans (canned, drained, ½ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Corn (frozen or canned, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (1 tbsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Salsa (¼ cup)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Shredded Cheese (¼ cup)",
        "quantity": 28,
        "unit": "g"
      }
    ],
    "toppings": [
      "Diced Avocado",
      "Fresh Cilantro",
      "Sour Cream"
    ],
    "instructions": [
      "Season diced chicken with taco seasoning and cook in a skillet over medium-high 6–7 minutes until browned and cooked through.",
      "Warm the black beans and corn together in a small pan 2–3 minutes.",
      "Microwave the rice per package instructions. Build the bowl with rice, beans and corn, chicken, and salsa.",
      "Top with cheese, avocado, cilantro, and a dollop of sour cream."
    ],
    "totalTime": 14,
    "pantryTags": [
      "chicken_breast",
      "rice",
      "canned_beans",
      "salsa",
      "cheese"
    ]
  },
  {
    "name": "Mexican Street Corn Chicken Skillet",
    "description": "Charred elote-style corn folded into a creamy, chili-lime chicken skillet — all the flavor of Mexican street corn in one pan.",
    "id": 210,
    "isNew": true,
    "isTrending": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mexican",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, diced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Corn (frozen or canned, ¾ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Cotija or Feta Cheese (crumbled, ¼ cup)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Chili Powder (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Lime Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Fresh Cilantro",
      "Extra Chili Powder"
    ],
    "instructions": [
      "Season chicken with chili powder, salt, and pepper. Spray a skillet with oil and cook over medium-high 6–7 minutes until browned and cooked through. Remove and set aside.",
      "In the same skillet, char the corn over medium-high 3–4 minutes until lightly browned.",
      "Stir mayo, lime juice, and half the cheese into the corn. Return chicken to the skillet and toss to coat.",
      "Top with remaining cheese and cilantro."
    ],
    "totalTime": 15,
    "pantryTags": [
      "chicken_breast",
      "cheese",
      "mayo"
    ]
  },
  {
    "name": "Bang Bang Chicken Bake",
    "description": "Crispy baked chicken bites tossed in the viral sweet-and-spicy bang bang sauce — a baked, high-protein spin on the wing-bar favorite.",
    "id": 211,
    "isNew": true,
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 10,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, cubed)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Panko Breadcrumbs (½ cup)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Egg White (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Sweet Chili Sauce (2 tbsp)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Sriracha (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sliced Scallions"
    ],
    "instructions": [
      "Preheat oven to 425°F. Dip chicken cubes in egg white, then coat in panko.",
      "Arrange on a lined sheet pan, spray with oil, and bake 15–18 minutes until golden and cooked through.",
      "Whisk mayo, sweet chili sauce, and sriracha together for the bang bang sauce.",
      "Toss the baked chicken in the sauce and top with scallions."
    ],
    "totalTime": 20,
    "pantryTags": [
      "chicken_breast",
      "mayo",
      "hot_sauce"
    ]
  },
  {
    "name": "Dumpling Skillet Bake",
    "description": "The viral 'dumpling lasagna' — layers of potstickers, marinara, and melted cheese baked into one cozy, fusion skillet.",
    "id": 212,
    "isNew": true,
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "pork"
    ],
    "flavor": "asian",
    "activeTime": 10,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Frozen Pork Potstickers (8 count)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Marinara Sauce (¾ cup)",
        "quantity": 180,
        "unit": "g"
      },
      {
        "name": "Shredded Mozzarella (¾ cup)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Basil, torn",
      "Red Pepper Flakes"
    ],
    "instructions": [
      "Preheat oven to 400°F. Stir garlic and Italian seasoning into the marinara.",
      "Spread a thin layer of marinara in a small oven-safe skillet or dish. Arrange the frozen potstickers in a single layer on top.",
      "Cover with the remaining marinara, then top with mozzarella.",
      "Bake 20–22 minutes until the cheese is bubbly and golden and the potstickers are cooked through. Top with basil and red pepper flakes."
    ],
    "totalTime": 22,
    "pantryTags": [
      "marinara",
      "cheese"
    ]
  },
  {
    "name": "Protein Gochujang Ramen",
    "description": "Instant ramen leveled way up — gochujang broth, a soft egg, and seared chicken turn a dorm-room staple into a real meal.",
    "id": 213,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken",
      "eggs"
    ],
    "flavor": "asian",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, sliced thin)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Instant Ramen Noodles (1 block, seasoning packet discarded)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled, 1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Whole Egg (1 large, soft-boiled)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Frozen Vegetables (stir-fry blend, ½ cup)",
        "quantity": 75,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Sesame Seeds"
    ],
    "instructions": [
      "Soft-boil the egg 6–7 minutes, cool in cold water, then peel and halve.",
      "Season chicken with salt and pepper and sear in a pot over medium-high 5 minutes until cooked through. Remove and set aside.",
      "In the same pot, add 2 cups water, gochujang, and soy sauce. Bring to a boil, add frozen vegetables and noodles, and cook 3 minutes until the noodles are tender.",
      "Ladle into a bowl, top with chicken, the soft-boiled egg, scallions, and sesame seeds."
    ],
    "totalTime": 12,
    "pantryTags": [
      "chicken_breast",
      "eggs",
      "soy_sauce",
      "frozen_veg"
    ]
  },
  {
    "name": "Chili Crisp Fried Rice",
    "description": "Day-old rice fried with egg and crunchy, spicy chili crisp — a viral pantry-staple dish that's ready faster than delivery.",
    "id": 214,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
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
        "name": "White Rice Pouch (day-old cooked or microwaved and cooled)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Whole Egg (2 large)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Chili Crisp (bottled, 2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Frozen Peas & Carrots (½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Sesame Oil (½ tsp)",
        "quantity": 2.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sliced Scallions"
    ],
    "instructions": [
      "Heat sesame oil in a skillet over medium-high. Add peas and carrots and cook 2 minutes.",
      "Push vegetables to one side, crack in the eggs, and scramble until just set.",
      "Add rice and soy sauce, breaking up clumps, and stir-fry 3–4 minutes until heated through.",
      "Remove from heat and stir in chili crisp to taste. Top with scallions."
    ],
    "totalTime": 8,
    "pantryTags": [
      "rice",
      "eggs",
      "soy_sauce",
      "frozen_veg"
    ]
  },
  {
    "name": "Air Fryer Smashed Potato Breakfast Bowl",
    "description": "Crispy air-fried smashed potatoes topped with fried eggs and melty cheese — a viral breakfast side turned into the whole meal.",
    "id": 215,
    "isNew": true,
    "method": "Air Fryer",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "american",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Baby Potatoes (boiled until fork-tender, 8 oz)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Whole Egg (2 large, fried)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Shredded Cheddar (¼ cup)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 4,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Hot Sauce"
    ],
    "instructions": [
      "Boil potatoes until fork-tender, about 12 minutes, then drain and let cool slightly.",
      "Spread potatoes on the air fryer tray and smash each one flat with a fork or cup. Spray with oil and season with garlic powder, salt, and pepper.",
      "Air fry at 400°F for 12–14 minutes, flipping halfway, until crispy and golden. Sprinkle cheese on top for the last minute to melt.",
      "Fry the eggs while the potatoes finish. Plate the smashed potatoes topped with fried eggs, scallions, and hot sauce."
    ],
    "totalTime": 15,
    "pantryTags": [
      "potatoes",
      "eggs",
      "cheese"
    ]
  },
  {
    "name": "Air Fryer Orange Chicken Bites",
    "description": "Crispy air-fried chicken bites glazed in a sticky-sweet orange sauce — a lighter, viral take on the takeout classic.",
    "id": 216,
    "isNew": true,
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, cubed)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Cornstarch (2 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Orange Juice (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tbsp)",
        "quantity": 21,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 4,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Sesame Seeds"
    ],
    "instructions": [
      "Toss chicken cubes in cornstarch to coat. Arrange in the air fryer basket, spray with oil, and air fry at 400°F for 10–12 minutes, shaking halfway, until crispy and cooked through.",
      "Meanwhile, whisk orange juice, soy sauce, honey, and garlic in a small saucepan. Simmer over medium 3–4 minutes until thickened into a glaze.",
      "Toss the crispy chicken in the orange glaze until coated.",
      "Top with scallions and sesame seeds."
    ],
    "totalTime": 14,
    "pantryTags": [
      "chicken_breast",
      "soy_sauce"
    ]
  },
  {
    "name": "Korean Corn Cheese Chicken Skillet",
    "description": "Bar-food favorite Korean corn cheese folded into a garlicky chicken skillet — sweet, savory, and stretchy with melted cheese.",
    "id": 217,
    "isNew": true,
    "isTrending": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "asian",
    "activeTime": 14,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thigh (boneless, skinless, 1 thigh, diced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Corn (frozen or canned, ¾ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Mayo (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Shredded Mozzarella (½ cup)",
        "quantity": 56,
        "unit": "g"
      },
      {
        "name": "Butter (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Sugar (½ tsp)",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sliced Scallions"
    ],
    "instructions": [
      "Season chicken with salt and pepper and cook in a skillet over medium-high 6–7 minutes until browned and cooked through. Remove and set aside.",
      "In the same skillet, melt butter and add garlic and corn. Cook 3 minutes, then stir in mayo and sugar.",
      "Return chicken to the skillet, top everything with mozzarella, cover, and cook 2–3 minutes until the cheese is melted.",
      "Top with scallions."
    ],
    "totalTime": 14,
    "pantryTags": [
      "chicken_thighs",
      "cheese",
      "mayo"
    ]
  },
  {
    "name": "Chicken Shawarma Bowl",
    "description": "Warmly spiced shawarma-style chicken over rice with a cool, tangy garlic yogurt sauce — a fast take on the food-cart favorite.",
    "id": 218,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mediterranean",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thigh (boneless, skinless, 1 thigh, sliced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Shawarma Seasoning: Cumin, Paprika, Turmeric, Cinnamon (1 tbsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Diced Cucumber",
      "Diced Tomato",
      "Fresh Parsley"
    ],
    "instructions": [
      "Toss chicken with shawarma seasoning, salt, and pepper. Spray a skillet with oil and cook over medium-high 7–8 minutes until browned and cooked through.",
      "Whisk yogurt, garlic, lemon juice, and a pinch of salt for the garlic sauce.",
      "Microwave the rice per package instructions. Build the bowl with rice and chicken.",
      "Drizzle with garlic yogurt sauce and top with cucumber, tomato, and parsley."
    ],
    "totalTime": 15,
    "pantryTags": [
      "chicken_thighs",
      "rice",
      "greek_yogurt"
    ]
  },
  {
    "name": "Spicy Tuna Crispy Rice Bites",
    "description": "The other viral crispy rice — spicy tuna piled onto crunchy air-fried rice squares, sushi-restaurant style at home.",
    "id": 219,
    "isNew": true,
    "method": "Air Fryer",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "asian",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "White Rice Pouch (cooked, pressed and chilled)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Canned Tuna (drained, ½ cup)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Mayo (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Sriracha (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Sesame Seeds"
    ],
    "instructions": [
      "Press the cooked rice firmly into a small dish lined with plastic wrap, chill 10 minutes (or freeze 5), then cut into bite-sized squares.",
      "Spray rice squares with oil on both sides and air fry at 400°F for 8–10 minutes, flipping halfway, until golden and crispy.",
      "Mix tuna, mayo, sriracha, and soy sauce in a bowl until well combined.",
      "Top each crispy rice square with spicy tuna, scallions, and sesame seeds."
    ],
    "totalTime": 15,
    "pantryTags": [
      "rice",
      "canned_fish",
      "mayo",
      "soy_sauce"
    ]
  },
  {
    "name": "Protein Baked Oats",
    "description": "The viral single-serve baked oats — cakey, protein-packed, and ready in one bowl and a microwave or oven.",
    "id": 220,
    "isNew": true,
    "method": "Bake",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "protein_powder",
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rolled Oats (½ cup)",
        "quantity": 45,
        "unit": "g"
      },
      {
        "name": "Vanilla Protein Powder (1 scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Whole Egg (1 large)",
        "quantity": 50,
        "unit": "count"
      },
      {
        "name": "Banana (½, mashed)",
        "quantity": 60,
        "unit": "g"
      },
      {
        "name": "Milk (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Baking Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sliced Banana",
      "Peanut Butter Drizzle"
    ],
    "instructions": [
      "Preheat oven to 350°F (or have a microwave ready).",
      "Mash the banana in a small oven-safe ramekin or bowl. Whisk in the egg, milk, protein powder, oats, and baking powder until smooth.",
      "Bake 20–22 minutes until set and golden on top (or microwave 2–2.5 minutes until just set).",
      "Top with sliced banana and a peanut butter drizzle."
    ],
    "totalTime": 22,
    "pantryTags": [
      "oats",
      "eggs",
      "milk"
    ]
  },
  {
    "name": "Blueberry Protein Smoothie",
    "description": "A thick, no-cook blueberry protein smoothie with Greek yogurt — a fast, viral grab-and-go breakfast.",
    "id": 221,
    "isNew": true,
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "protein_powder",
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
        "name": "Frozen Blueberries (1 cup)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (½ cup)",
        "quantity": 120,
        "unit": "ml"
      },
      {
        "name": "Vanilla Protein Powder (1 scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Milk (¾ cup)",
        "quantity": 180,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "g"
      }
    ],
    "toppings": [
      "Granola",
      "Extra Blueberries"
    ],
    "instructions": [
      "Add blueberries, yogurt, protein powder, milk, and honey to a blender.",
      "Blend on high 30–45 seconds until thick and smooth, adding a splash more milk if needed.",
      "Pour into a glass or bowl and top with granola and extra blueberries."
    ],
    "totalTime": 3,
    "pantryTags": [
      "fruit",
      "greek_yogurt",
      "milk"
    ]
  },
  {
    "name": "Cottage Cheese Alfredo Pasta",
    "description": "The viral blended-cottage-cheese pasta sauce — silky, high-protein, and just as creamy as a classic Alfredo.",
    "id": 222,
    "isNew": true,
    "method": "Stovetop",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "italian",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Pasta & Noodles (dry)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Cottage Cheese (¾ cup)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Parmesan (grated, ¼ cup)",
        "quantity": 25,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Butter (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Black Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Parsley",
      "Extra Parmesan"
    ],
    "instructions": [
      "Boil the pasta per package directions, reserving ¼ cup pasta water before draining.",
      "Blend cottage cheese, parmesan, garlic, and black pepper until completely smooth, about 1 minute.",
      "Melt butter in the empty pasta pot over low heat, pour in the blended sauce, and warm gently 2–3 minutes (don't boil). Thin with reserved pasta water as needed.",
      "Toss the pasta in the sauce and top with parsley and extra parmesan."
    ],
    "totalTime": 12,
    "pantryTags": [
      "pasta",
      "cottage_cheese",
      "cheese"
    ]
  },
  {
    "name": "Cottage Cheese Breakfast Bake Rounds",
    "description": "Viral blended cottage cheese and egg 'rounds' baked into a savory, portable, high-protein breakfast puck.",
    "id": 223,
    "isNew": true,
    "method": "Bake",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "dairy",
      "eggs"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese (½ cup)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Whole Egg (2 large)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Everything Bagel Seasoning (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Shredded Cheddar (2 tbsp)",
        "quantity": 14,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Everything Bagel Seasoning"
    ],
    "instructions": [
      "Preheat oven to 350°F and line a small pan with parchment.",
      "Blend cottage cheese and eggs together until completely smooth.",
      "Pour onto the lined pan, sprinkle with cheese and seasoning, and bake 20–22 minutes until set and lightly golden.",
      "Let cool slightly, then slice into rounds."
    ],
    "totalTime": 22,
    "pantryTags": [
      "cottage_cheese",
      "eggs",
      "cheese"
    ]
  },
  {
    "name": "High Protein Cottage Cheese Ice Cream",
    "description": "The viral blended cottage cheese 'ice cream' — frozen, creamy, and surprisingly close to soft-serve, with way more protein.",
    "id": 224,
    "isNew": true,
    "isTrending": true,
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Cottage Cheese (1 cup)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Frozen Berries (½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Honey (1 tbsp)",
        "quantity": 21,
        "unit": "g"
      },
      {
        "name": "Vanilla Extract (½ tsp)",
        "quantity": 2,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Extra Berries",
      "Granola"
    ],
    "instructions": [
      "Add cottage cheese, frozen berries, honey, and vanilla to a blender or food processor.",
      "Blend on high 1–2 minutes, scraping down the sides, until completely smooth and creamy.",
      "Freeze 20–30 minutes for a soft-serve texture (or eat right away for a thick shake-like texture).",
      "Top with extra berries and granola."
    ],
    "totalTime": 25,
    "pantryTags": [
      "cottage_cheese",
      "fruit"
    ]
  },
  {
    "name": "Baked Cottage Cheese Chips",
    "description": "The viral baked cottage cheese chips — crispy, savory, high-protein crisps made from just cottage cheese and seasoning.",
    "id": 225,
    "isNew": true,
    "method": "Bake",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 5,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese (small curd, ¾ cup)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Everything Bagel Seasoning (1 tsp)",
        "quantity": 3,
        "unit": "g"
      }
    ],
    "toppings": [],
    "instructions": [
      "Preheat oven to 375°F and line a sheet pan with parchment.",
      "Spoon small, thin mounds of cottage cheese onto the parchment, spacing well apart, and spread each into a thin round.",
      "Sprinkle with seasoning and bake 25–30 minutes until deep golden and fully dried out and crisp.",
      "Let cool completely on the pan — they crisp up further as they cool."
    ],
    "totalTime": 30,
    "pantryTags": [
      "cottage_cheese"
    ]
  },
  {
    "name": "Ground Beef Crunchwrap Bowl",
    "description": "Everything you love about the drive-thru crunchwrap — seasoned beef, crispy tostada, cheese, and sour cream — deconstructed into a bowl.",
    "id": 226,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "beef"
    ],
    "flavor": "mexican",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Lean Ground Beef (93/7, ¼ lb)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Taco Seasoning (1 tbsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Corn Tortilla (1, torn and crisped)",
        "quantity": 26,
        "unit": "g"
      },
      {
        "name": "Shredded Cheese (¼ cup)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (2 tbsp, sour cream sub)",
        "quantity": 30,
        "unit": "ml"
      },
      {
        "name": "Salsa (¼ cup)",
        "quantity": 60,
        "unit": "g"
      }
    ],
    "toppings": [
      "Shredded Lettuce",
      "Diced Tomato"
    ],
    "instructions": [
      "Brown the beef in a skillet over medium-high 5–6 minutes, breaking it up, then stir in taco seasoning with a splash of water.",
      "In a dry pan, crisp the torn tortilla pieces 2–3 minutes until golden, like tostada chips.",
      "Build the bowl with beef, cheese, and salsa. Top with the crispy tortilla pieces, a dollop of Greek yogurt, lettuce, and tomato."
    ],
    "totalTime": 12,
    "pantryTags": [
      "ground_beef",
      "tortillas",
      "cheese",
      "salsa",
      "greek_yogurt"
    ]
  },
  {
    "name": "Chicken Al Pastor Tacos",
    "description": "Pineapple and smoky chili-spiced chicken standing in for the classic street-taco spit — sweet, tangy, and fast.",
    "id": 227,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mexican",
    "activeTime": 13,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Thigh (boneless, skinless, 1 thigh, diced)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Pineapple (diced, ¼ cup)",
        "quantity": 55,
        "unit": "g"
      },
      {
        "name": "Chili Powder (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Paprika (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (3 small)",
        "quantity": 78,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Diced Onion",
      "Fresh Cilantro",
      "Lime Wedge"
    ],
    "instructions": [
      "Season chicken with chili powder, paprika, salt, and pepper. Spray a skillet with oil and cook over medium-high 6–7 minutes until browned.",
      "Add pineapple and cook 2 more minutes, letting it caramelize slightly.",
      "Warm the tortillas and fill with the chicken and pineapple.",
      "Top with onion, cilantro, and a squeeze of lime."
    ],
    "totalTime": 13,
    "pantryTags": [
      "chicken_thighs",
      "tortillas"
    ]
  },
  {
    "name": "Honey Pepper Chicken Bites",
    "description": "The viral 'boom boom' honey pepper chicken — crispy air-fried bites tossed in a sticky, peppery hot honey glaze.",
    "id": 228,
    "isNew": true,
    "method": "Air Fryer",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "spicy",
    "activeTime": 13,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Breast (1 breast, cubed)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Cornstarch (2 tbsp)",
        "quantity": 16,
        "unit": "g"
      },
      {
        "name": "Hot Honey (2 tbsp)",
        "quantity": 42,
        "unit": "g"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Black Pepper (½ tsp, coarse)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 4,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Sliced Scallions"
    ],
    "instructions": [
      "Toss chicken cubes in cornstarch to coat. Arrange in the air fryer basket, spray with oil, and air fry at 400°F for 10–12 minutes, shaking halfway, until crispy and cooked through.",
      "Whisk hot honey, soy sauce, and black pepper in a small saucepan and warm over low 1–2 minutes.",
      "Toss the crispy chicken in the honey pepper glaze until coated.",
      "Top with scallions."
    ],
    "totalTime": 13,
    "pantryTags": [
      "chicken_breast",
      "soy_sauce"
    ]
  },
  {
    "name": "Green Goddess Chicken Salad Wrap",
    "description": "Shredded chicken tossed in the viral herby, tangy green goddess dressing and wrapped up for a fast, high-protein lunch.",
    "id": 229,
    "isNew": true,
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "mediterranean",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Rotisserie Chicken (shredded, 1 cup)",
        "quantity": 140,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (¼ cup)",
        "quantity": 60,
        "unit": "ml"
      },
      {
        "name": "Fresh Herbs: Parsley, Chives, Basil (¼ cup, chopped)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Garlic (minced, ½ clove)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Tortillas (1 large)",
        "quantity": 45,
        "unit": "g"
      }
    ],
    "toppings": [
      "Salad Greens",
      "Sliced Cucumber"
    ],
    "instructions": [
      "Blend or finely mince the herbs, yogurt, lemon juice, and garlic into a smooth green goddess dressing.",
      "Toss the shredded chicken with the dressing until well coated.",
      "Lay the tortilla flat, add greens and cucumber, then top with the chicken salad.",
      "Roll tightly into a wrap and slice in half."
    ],
    "totalTime": 8,
    "pantryTags": [
      "rotisserie_chicken",
      "greek_yogurt",
      "tortillas"
    ]
  },
  {
    "name": "Protein Chia Pudding",
    "description": "The viral overnight protein chia pudding — set it before bed and wake up to a thick, creamy, high-protein breakfast.",
    "id": 230,
    "isNew": true,
    "method": "No Cook",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "protein_powder",
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Chia Seeds (3 tbsp)",
        "quantity": 36,
        "unit": "g"
      },
      {
        "name": "Milk (1 cup)",
        "quantity": 240,
        "unit": "ml"
      },
      {
        "name": "Vanilla Protein Powder (1 scoop)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Berries",
      "Granola"
    ],
    "instructions": [
      "Whisk chia seeds, milk, protein powder, and honey together in a jar until the powder is fully dissolved.",
      "Cover and refrigerate at least 4 hours, or overnight, stirring once after the first 10 minutes to prevent clumping.",
      "Stir before eating and top with berries and granola."
    ],
    "totalTime": 4,
    "pantryTags": [
      "milk"
    ]
  },
  {
    "name": "Turkish Menemen Eggs",
    "description": "The viral Turkish breakfast eggs — soft-scrambled with blistered tomatoes, peppers, and feta for a saucy, high-protein skillet.",
    "id": 231,
    "isNew": true,
    "method": "Skillet",
    "mealType": "breakfast",
    "servings": 1,
    "proteins": [
      "eggs"
    ],
    "flavor": "mediterranean",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Whole Egg (2 large)",
        "quantity": 100,
        "unit": "count"
      },
      {
        "name": "Canned Diced Tomatoes (½ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "Bell Pepper (diced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Feta Cheese (crumbled, 2 tbsp)",
        "quantity": 19,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      }
    ],
    "toppings": [
      "Fresh Parsley",
      "Crusty Bread"
    ],
    "instructions": [
      "Spray a skillet with oil and cook bell pepper over medium-high 4 minutes until softened. Add garlic and cook 30 seconds.",
      "Stir in the diced tomatoes and simmer 4–5 minutes until slightly reduced.",
      "Crack the eggs directly into the skillet, season with salt and pepper, and gently stir into soft, saucy curds, 2–3 minutes.",
      "Top with feta and parsley."
    ],
    "totalTime": 12,
    "pantryTags": [
      "eggs",
      "canned_tomatoes",
      "bell_peppers",
      "cheese"
    ]
  },
  {
    "name": "Whipped Cottage Cheese Dip",
    "description": "The viral whipped cottage cheese dip — blended silky-smooth and topped everything-bagel style for a high-protein snack.",
    "id": 232,
    "isNew": true,
    "method": "No Cook",
    "mealType": "snack",
    "servings": 1,
    "proteins": [
      "dairy"
    ],
    "flavor": "neutral",
    "activeTime": 4,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Cottage Cheese (1 cup)",
        "quantity": 225,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Everything Bagel Seasoning (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Cucumber, Carrots & Bell Pepper Sticks (for dipping, 1 cup)",
        "quantity": 120,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Everything Bagel Seasoning",
      "Drizzle of Olive Oil"
    ],
    "instructions": [
      "Add cottage cheese and lemon juice to a blender or food processor.",
      "Blend 1–2 minutes, scraping down the sides, until completely smooth and whipped.",
      "Spread onto a plate, top with seasoning and a drizzle of olive oil.",
      "Serve with cucumber, carrot, and bell pepper sticks for dipping."
    ],
    "totalTime": 4,
    "pantryTags": [
      "cottage_cheese",
      "cucumber",
      "bell_peppers"
    ]
  },
  {
    "name": "Ground Turkey Gochujang Bowl",
    "description": "Sweet, spicy gochujang ground turkey over rice — a fast, trending Korean-inspired bowl with minimal cleanup.",
    "id": 233,
    "isNew": true,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "asian",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Ground Turkey (93/7, ¼ lb)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      },
      {
        "name": "Gochujang Sauce (bottled, 1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Soy Sauce (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Honey (1 tsp)",
        "quantity": 7,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Frozen Vegetables (stir-fry blend, ½ cup)",
        "quantity": 75,
        "unit": "g"
      }
    ],
    "toppings": [
      "Sliced Scallions",
      "Sesame Seeds"
    ],
    "instructions": [
      "Brown the turkey in a skillet over medium-high 5–6 minutes, breaking it up as it cooks.",
      "Add garlic and frozen vegetables, cook 3 minutes until the vegetables are heated through.",
      "Stir in gochujang, soy sauce, and honey. Simmer 2 minutes until glossy and well coated.",
      "Microwave the rice per package instructions and serve the turkey over rice, topped with scallions and sesame seeds."
    ],
    "totalTime": 12,
    "pantryTags": [
      "ground_turkey",
      "rice",
      "soy_sauce",
      "frozen_veg"
    ]
  },
  {
    "name": "High Protein Chicken Caesar Pasta Salad",
    "description": "The viral high-protein pasta salad trend — chicken, pasta, and a lightened-up Caesar dressing, perfect for meal prep.",
    "id": 234,
    "isNew": true,
    "method": "No Cook",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "italian",
    "activeTime": 12,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Pasta & Noodles (dry, small shape)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Rotisserie Chicken (shredded, 1 cup)",
        "quantity": 140,
        "unit": "g"
      },
      {
        "name": "Nonfat Greek Yogurt (3 tbsp)",
        "quantity": 45,
        "unit": "ml"
      },
      {
        "name": "Caesar Dressing (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Parmesan (grated, 2 tbsp)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "Salad Greens (romaine, chopped, 1 cup)",
        "quantity": 47,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Parmesan",
      "Black Pepper"
    ],
    "instructions": [
      "Boil the pasta per package directions, then drain and rinse under cold water to cool.",
      "Whisk Greek yogurt, Caesar dressing, and parmesan together in a large bowl.",
      "Add the cooled pasta, chicken, and romaine, and toss until everything is well coated.",
      "Chill 10 minutes before serving, or pack straight into a container for meal prep."
    ],
    "totalTime": 12,
    "pantryTags": [
      "pasta",
      "rotisserie_chicken",
      "greek_yogurt",
      "salad_greens",
      "cheese"
    ]
  },
  {
    "name": "Lemon Garlic Butter Baked Tilapia",
    "description": "Tender baked tilapia in a rich lemon-garlic butter sauce -- adapted from one of the most popular baked-fish formulas online, ready in under 20 minutes.",
    "id": 300,
    "method": "Bake",
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
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Butter (2 tbsp)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 3 cloves)",
        "quantity": 9,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Lemon Zest (1 tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Paprika (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Salt (¼ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Black Pepper (pinch)",
        "quantity": 0.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Parsley, chopped",
      "Lemon Wedge"
    ],
    "instructions": [
      "Preheat oven to 400°F. Pat the tilapia dry and place in a small baking dish.",
      "Melt the butter and mix with garlic, lemon juice, lemon zest, Italian seasoning, paprika, salt, and pepper. Pour evenly over the fillet.",
      "Bake 12–15 min until the fish flakes easily with a fork. Spoon the pan sauce back over the top before serving."
    ],
    "totalTime": 17,
    "pantryTags": [
      "white_fish",
      "butter",
      "onion_garlic"
    ]
  },
  {
    "name": "Broiled Parmesan Tilapia",
    "description": "A crispy, golden parmesan-mayo crust broiled onto tilapia -- adapted from one of Allrecipes' highest-rated fish recipes, ready in about 10 minutes.",
    "id": 301,
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "italian",
    "activeTime": 4,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Parmesan (grated, 3 tbsp)",
        "quantity": 24,
        "unit": "g"
      },
      {
        "name": "Mayo, Light (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp, melted)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      },
      {
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Paprika (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Parsley, chopped",
      "Lemon Wedge"
    ],
    "instructions": [
      "Preheat the broiler on high. Pat tilapia dry and place on a foil-lined baking sheet.",
      "Mix parmesan, mayo, melted butter, lemon juice, garlic powder, and paprika into a thick paste. Spread evenly over the fillet.",
      "Broil 6–8 min (watching closely) until the topping is golden and the fish flakes easily with a fork."
    ],
    "totalTime": 12,
    "pantryTags": [
      "white_fish",
      "cheese",
      "mayo"
    ]
  },
  {
    "name": "Blackened Tilapia",
    "description": "Cajun-spiced blackened tilapia seared in a screaming-hot skillet for a crackly, smoky crust -- the classic technique, done in under 10 minutes.",
    "id": 302,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "spicy",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Paprika (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Cayenne Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Onion Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Dried Thyme (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Dried Oregano (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Salt (¼ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Black Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 14,
        "unit": "g"
      }
    ],
    "toppings": [
      "Lemon Wedge"
    ],
    "instructions": [
      "Mix paprika, cayenne, garlic powder, onion powder, thyme, oregano, salt, and pepper. Coat the tilapia fillet evenly on both sides.",
      "Heat a skillet over high heat with the butter until just smoking. Sear the fillet 2–3 min per side until a dark, blackened crust forms and the fish flakes easily."
    ],
    "totalTime": 8,
    "pantryTags": [
      "white_fish",
      "butter"
    ]
  },
  {
    "name": "Blackened Tilapia Tacos",
    "description": "Blackened tilapia piled into warm tortillas with crunchy slaw and a quick lime crema -- a popular fish taco format, ready fast.",
    "id": 303,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "mexican",
    "activeTime": 10,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Blackening Seasoning: Paprika, Cayenne, Garlic & Onion Powder (1 tbsp)",
        "quantity": 8,
        "unit": "g"
      },
      {
        "name": "Corn Tortillas (3 small)",
        "quantity": 78,
        "unit": "g"
      },
      {
        "name": "Coleslaw Mix (bagged)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Mayo, Light (2 tbsp)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Lime Juice (1 tbsp)",
        "quantity": 15,
        "unit": "ml"
      },
      {
        "name": "Butter (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Cilantro",
      "Extra Lime Wedge",
      "Hot Sauce"
    ],
    "instructions": [
      "Coat the tilapia in blackening seasoning. Heat butter in a skillet over high heat and sear the fillet 2–3 min per side until blackened and flaky. Flake into large chunks.",
      "Mix mayo and lime juice for a quick crema. Toss the coleslaw mix with half the crema.",
      "Warm the tortillas. Fill with the slaw and blackened tilapia. Drizzle with the remaining crema and top with cilantro."
    ],
    "totalTime": 10,
    "pantryTags": [
      "white_fish",
      "tortillas",
      "mayo"
    ]
  },
  {
    "name": "Lemon Pepper Tilapia",
    "description": "Zesty lemon pepper tilapia, air-fried until flaky -- a popular ready-in-under-30-minutes weeknight staple.",
    "id": 304,
    "method": "Air Fryer",
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
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Lemon Pepper Seasoning (1 tsp)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 3,
        "unit": "spray"
      },
      {
        "name": "Lemon Juice (1 tsp)",
        "quantity": 5,
        "unit": "ml"
      }
    ],
    "toppings": [
      "Lemon Wedge",
      "Fresh Parsley"
    ],
    "instructions": [
      "Pat the tilapia dry, spray with oil, and season both sides with lemon pepper seasoning.",
      "Air fry at 400°F for 8–10 min until the fish flakes easily with a fork. Squeeze fresh lemon juice over the top before serving."
    ],
    "totalTime": 10,
    "pantryTags": [
      "white_fish"
    ]
  },
  {
    "name": "Garlic Butter Pan-Seared Tilapia",
    "description": "Golden pan-seared tilapia basted in garlic butter -- a fast, simple stovetop method that's become a go-to weeknight favorite.",
    "id": 305,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "neutral",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "grab_and_go"
    ],
    "components": [
      {
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Butter (2 tbsp)",
        "quantity": 28,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 2 cloves)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Lemon Juice (1 tsp)",
        "quantity": 5,
        "unit": "ml"
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
      }
    ],
    "toppings": [
      "Fresh Parsley, chopped"
    ],
    "instructions": [
      "Pat the tilapia dry and season with salt and pepper. Heat olive oil in a skillet over medium-high.",
      "Sear the tilapia 3 min per side until golden. Add butter and garlic to the pan, then tilt and spoon the melted garlic butter over the fish for 1 minute.",
      "Finish with a squeeze of lemon juice."
    ],
    "totalTime": 8,
    "pantryTags": [
      "white_fish",
      "butter",
      "onion_garlic"
    ]
  },
  {
    "name": "Tilapia a la Mexicana",
    "description": "A viral TikTok favorite -- tilapia seasoned with cayenne and smoked paprika, simmered in a quick tomato, onion, and serrano salsa.",
    "id": 306,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "mexican",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
        "unit": "g"
      },
      {
        "name": "Cayenne Pepper (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Smoked Paprika (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Onion Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Garlic Powder (¼ tsp)",
        "quantity": 1,
        "unit": "g"
      },
      {
        "name": "Butter (1 tbsp)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Canned Diced Tomatoes (½ cup)",
        "quantity": 120,
        "unit": "g"
      },
      {
        "name": "White Onion (diced, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Serrano or Jalapeño Pepper (sliced, 1)",
        "quantity": 10,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Cilantro",
      "Lime Wedge"
    ],
    "instructions": [
      "Season the tilapia with cayenne, smoked paprika, onion powder, and garlic powder.",
      "Melt butter in a skillet over medium-high. Sauté the diced onion, minced garlic, and sliced serrano 2 min until fragrant.",
      "Add the seasoned tilapia to the skillet along with the diced tomatoes. Simmer 6–8 min, spooning sauce over the fish, until it flakes easily.",
      "Microwave the rice 90 sec. Serve the tilapia and sauce over rice, topped with cilantro and a squeeze of lime."
    ],
    "totalTime": 12,
    "pantryTags": [
      "white_fish",
      "canned_tomatoes",
      "onion_garlic",
      "butter",
      "rice"
    ]
  },
  {
    "name": "Creamy Garlic Parmesan Tilapia with Green Beans",
    "description": "Flaky tilapia in a quick creamy garlic-parmesan sauce with green beans -- inspired by the viral creamy skillet-fish trend, done in one pan.",
    "id": 307,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "fish"
    ],
    "flavor": "saucy",
    "activeTime": 12,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Tilapia Fillet (1 fillet, ~6 oz)",
        "quantity": 170,
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
        "name": "Butter (1 tbsp)",
        "quantity": 14,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 2 cloves)",
        "quantity": 6,
        "unit": "g"
      },
      {
        "name": "Heavy Cream (⅓ cup)",
        "quantity": 80,
        "unit": "ml"
      },
      {
        "name": "Parmesan (grated, 3 tbsp)",
        "quantity": 24,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "Green Beans (steam-bag)",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Parsley",
      "Extra Parmesan"
    ],
    "instructions": [
      "Season the tilapia with salt and pepper. Melt butter in a skillet over medium-high and sear the fillet 3 min per side until golden. Remove and set aside.",
      "In the same skillet, add garlic and cook 30 sec. Stir in heavy cream, parmesan, and Italian seasoning. Simmer 2–3 min until slightly thickened.",
      "Return the tilapia to the skillet, spoon sauce over the top, and simmer 1 more minute.",
      "Meanwhile, microwave the green beans steam-bag 3 min. Season with a pinch of garlic powder. Serve alongside."
    ],
    "totalTime": 12,
    "pantryTags": [
      "white_fish",
      "cheese",
      "butter",
      "frozen_veg"
    ]
  },
  {
    "name": "Kielbasa & Peppers Skillet",
    "description": "Smoky, seared turkey kielbasa with sweet bell peppers and onions in a garlicky paprika skillet -- a lean take on the classic diner-cart favorite, over rice.",
    "id": 310,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "savory",
    "activeTime": 14,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Turkey Kielbasa (sliced into rounds, 4 oz)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Bell Pepper (sliced, 1 cup)",
        "quantity": 150,
        "unit": "g"
      },
      {
        "name": "Onion (sliced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Smoked Paprika (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      },
      {
        "name": "White Rice Pouch (microwaveable)",
        "quantity": 200,
        "unit": "g"
      }
    ],
    "toppings": [
      "Fresh Parsley",
      "Extra Paprika"
    ],
    "instructions": [
      "Heat oil in a skillet over medium-high. Add the sliced kielbasa in a single layer and cook 3-4 minutes per side until browned and slightly crisp at the edges. Remove and set aside.",
      "In the same skillet, add the peppers and onion. Sauté 5-7 minutes until softened and starting to caramelize. Add garlic and smoked paprika, cook 1 minute more until fragrant.",
      "Return the kielbasa to the skillet and toss with the peppers for 2-3 minutes to heat through. Season with salt and pepper to taste.",
      "Microwave the rice 90 sec. Serve the kielbasa and peppers over rice. Toppings on side."
    ],
    "totalTime": 14,
    "pantryTags": [
      "sausage",
      "rice",
      "onion_garlic",
      "bell_peppers"
    ]
  },
  {
    "name": "Chicken Sausage & Mushroom Skillet",
    "description": "Italian-style chicken sausage seared with garlicky mushrooms and wilted spinach, tossed with pasta and parmesan -- a lighter spin on sausage and mushroom pasta.",
    "id": 311,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "savory",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Sausage (Italian-style link, sliced, 3 oz)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Cremini Mushrooms (sliced, 1 cup)",
        "quantity": 70,
        "unit": "g"
      },
      {
        "name": "Fresh Baby Spinach (1 cup)",
        "quantity": 30,
        "unit": "g"
      },
      {
        "name": "Garlic (minced, 1 clove)",
        "quantity": 3,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      },
      {
        "name": "Red Pepper Flakes (pinch)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Pasta & Noodles (dry)",
        "quantity": 85,
        "unit": "g"
      },
      {
        "name": "Parmesan (grated, 2 tbsp)",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Parmesan",
      "Black Pepper"
    ],
    "instructions": [
      "Boil the pasta per package directions, reserving ¼ cup pasta water before draining.",
      "Meanwhile, heat oil in a skillet over medium-high. Add sliced chicken sausage and cook 4-5 minutes until browned.",
      "Add mushrooms and cook 4 minutes until softened and browned -- letting them sit undisturbed for the first minute or two helps them brown instead of steam. Add garlic and red pepper flakes, stir 30 seconds until fragrant.",
      "Add spinach and toss until just wilted, about 1 minute. Add the pasta and parmesan, tossing with a splash of the reserved pasta water until glossy and coated."
    ],
    "totalTime": 15,
    "pantryTags": [
      "sausage",
      "mushroom",
      "pasta",
      "cheese"
    ]
  },
  {
    "name": "Bratwurst & Sauerkraut Skillet",
    "description": "Seared chicken bratwurst simmered with tangy sauerkraut, sweet apple, and Dijon mustard -- a lean, one-skillet take on the classic German pairing.",
    "id": 312,
    "method": "Skillet",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "chicken"
    ],
    "flavor": "savory",
    "activeTime": 15,
    "tags": [
      "high_protein"
    ],
    "components": [
      {
        "name": "Chicken Bratwurst (1 link, sliced)",
        "quantity": 84,
        "unit": "g"
      },
      {
        "name": "Sauerkraut (jarred, drained, ¾ cup)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Apple (sliced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Onion (sliced, ¼ cup)",
        "quantity": 40,
        "unit": "g"
      },
      {
        "name": "Dijon Mustard (1 tbsp)",
        "quantity": 15,
        "unit": "g"
      },
      {
        "name": "Caraway Seeds (¼ tsp)",
        "quantity": 0.5,
        "unit": "g"
      },
      {
        "name": "Olive Oil (1 tsp)",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Extra Dijon Mustard",
      "Fresh Parsley"
    ],
    "instructions": [
      "Heat oil in a skillet over medium-high. Add the sliced bratwurst and cook 4-5 minutes until browned. Remove and set aside.",
      "In the same skillet, add onion and apple and cook 4-5 minutes until softened -- the apple's sweetness is what balances the sauerkraut's tang in a real bratwurst-and-kraut skillet.",
      "Stir in the sauerkraut, caraway seeds, and Dijon mustard. Return the bratwurst to the skillet, cover, and simmer 3-4 minutes until heated through and the flavors meld.",
      "Serve with extra Dijon on the side."
    ],
    "totalTime": 15,
    "pantryTags": [
      "sausage",
      "onion_garlic"
    ]
  },
  {
    "name": "Sheet Pan Turkey Sausage & Veggies",
    "description": "Smoked turkey sausage roasted with sweet potato, broccoli, and bell pepper on one pan -- a hands-off, high-protein dinner with minimal cleanup.",
    "id": 313,
    "method": "Bake",
    "mealType": "lunch_dinner",
    "servings": 1,
    "proteins": [
      "turkey"
    ],
    "flavor": "savory",
    "activeTime": 8,
    "tags": [
      "high_protein",
      "meal_prep"
    ],
    "components": [
      {
        "name": "Turkey Smoked Sausage (sliced into rounds, 4 oz)",
        "quantity": 113,
        "unit": "g"
      },
      {
        "name": "Sweet Potato (diced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Broccoli Florets (fresh or frozen, 1 cup)",
        "quantity": 100,
        "unit": "g"
      },
      {
        "name": "Bell Pepper (sliced, ½ cup)",
        "quantity": 75,
        "unit": "g"
      },
      {
        "name": "Olive Oil Spray",
        "quantity": 4,
        "unit": "spray"
      },
      {
        "name": "Garlic Powder (½ tsp)",
        "quantity": 2,
        "unit": "g"
      },
      {
        "name": "Italian Seasoning (½ tsp)",
        "quantity": 1.5,
        "unit": "g"
      }
    ],
    "toppings": [
      "Red Pepper Flakes",
      "Fresh Parsley"
    ],
    "instructions": [
      "Preheat oven to 425°F. Toss the sweet potato with olive oil spray, garlic powder, and Italian seasoning on a sheet pan. Roast 10 minutes to give it a head start -- it takes longer to cook through than the other vegetables.",
      "Add the sliced sausage, broccoli, and bell pepper to the pan. Toss everything together with a bit more oil spray and seasoning.",
      "Roast 15-18 minutes more until the vegetables are tender and the sausage is browned at the edges."
    ],
    "totalTime": 26,
    "pantryTags": [
      "sausage",
      "frozen_veg",
      "potatoes",
      "bell_peppers"
    ]
  }
];
