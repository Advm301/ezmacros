# Ground Protein Recipes - Quick Reference

## TL;DR
Added 32 ground protein recipes (IDs 92-123): 8 beef, 8 chicken, 8 pork, 8 turkey.
All recipes: Skillet method, 6-7 min active, 3-4 steps, EZ Level 1-2, realistic macros.

## Recipe ID Ranges
- **Beef:** 92-99
- **Chicken:** 100-107
- **Pork:** 108-115
- **Turkey:** 116-123

## Flavor Options (All have all 4 proteins)
1. **Neutral** (12 total): Soy Garlic, Taco, Teriyaki
2. **Asian-Inspired** (4): Soy Garlic
3. **BBQ** (4): BBQ Hash Browns
4. **Saucy** (8): Tomato Bowl, Creamy Mushroom
5. **Spicy** (4): Gochujang Rice
6. **Italian** (4): Pasta Marinara

## Recipe Lookup Function

```javascript
import { pickRecipesByFlavorAndMethod } from '@/lib/generator.js';

// Get recipe IDs for a specific flavor+protein combo
const ids = pickRecipesByFlavorAndMethod('beef', ['Asian-Inspired'], 'Skillet');
// Returns: [92]

// Get all recipes of a protein
const allChicken = pickRecipesByFlavorAndMethod('chicken', [], 'Skillet');
// Returns: [100, 101, 102, 103, 104, 105, 106, 107]
```

## Common Flavor Combinations

| Protein | Neutral | Asian | BBQ | Saucy | Spicy | Italian |
|---------|---------|-------|-----|-------|-------|---------|
| Beef | 92,97,99 | 92 | 93 | 94,98 | 95 | 96 |
| Chicken | 100,105,107 | 100 | 101 | 102,106 | 103 | 104 |
| Pork | 108,113,115 | 108 | 109 | 110,114 | 111 | 112 |
| Turkey | 116,121,123 | 116 | 117 | 118,122 | 119 | 120 |

## Macro Ranges (Per Serving)

| Metric | Range |
|--------|-------|
| Calories | 450-540 |
| Protein | 37-46g |
| Carbs | 48-56g |
| Fat | 7-17g |
| Time | 6-7 min active |

## Component Template

Every recipe has:
1. **Protein:** 142g raw meat (beef/chicken/pork/turkey)
2. **Sauce/Seasoning:** 1-3 bottled or powder items
3. **Carb:** Rice (200g), pasta (200g), tortillas (52g), hash browns (150g), or noodles (200g)
4. **Vegetable:** 85g frozen (broccoli, spinach, or mixed)
5. **Optional:** Garnish/topping (sesame, green onion, etc.)

## EZ Compliance (All 32 Recipes)
- ✓ No knife work
- ✓ No fresh produce
- ✓ Bottled sauces only
- ✓ 3-4 steps
- ✓ 6-7 min active time
- ✓ Microwave carbs

## Files Modified

### `src/data/recipes.js`
- Added IDs 92-123
- Total recipes: 123 (was 91)

### `src/lib/generator.js`
- Added: `GROUND_BEEF_RECIPES`, `GROUND_CHICKEN_RECIPES`, `GROUND_PORK_RECIPES`, `GROUND_TURKEY_RECIPES`
- Added: `pickRecipesByFlavorAndMethod(protein, flavorTags, method)`
- Exported both

## Example: Getting Recipes in App

```javascript
// In Kitchen.jsx or generator call:
const recipes = generateLocalRecipes(
  ['ground beef'],
  1, // EZ level
  ['Asian-Inspired'],
  'Skillet'
);

// Will find and return recipes matching those criteria
// For this example: ID 92 "Skillet Beef Soy Garlic Rice"
```

## Common Queries

```javascript
// Beef Asian recipes
pickRecipesByFlavorAndMethod('beef', ['Asian-Inspired'], 'Skillet')
→ [92]

// All chicken recipes
pickRecipesByFlavorAndMethod('chicken', [], 'Skillet')
→ [100, 101, 102, 103, 104, 105, 106, 107]

// Pork Saucy options
pickRecipesByFlavorAndMethod('pork', ['Saucy'], 'Skillet')
→ [110, 114]

// Turkey Spicy
pickRecipesByFlavorAndMethod('turkey', ['Spicy'], 'Skillet')
→ [119]
```

## EZ Level Split

- **Level 1 (16 recipes):** Simpler flavors
  - Neutral, Asian, Tomato (saucy)
  - IDs: 92,97,99,100,105,107,108,113,115,116,121,123 + 4 tomato

- **Level 2 (16 recipes):** Complex flavors
  - BBQ, Spicy, Italian, Creamy (saucy)
  - IDs: 93,101,109,117 (BBQ) + 95,103,111,119 (Spicy) + 96,104,112,120 (Italian) + 98,106,114,122 (Creamy)

## Carb Options

| Carb | Recipes | Cal | Carbs |
|-----|---------|-----|-------|
| Rice | 12 | 260 | 56g |
| Pasta | 4 | 220 | 44g |
| Noodles | 4 | 220 | 44g |
| Tortillas | 4 | 104 | 17g |
| Hash Browns | 4 | 160 | 36g |

## Protein Macros Per 142g

| Protein | Cal | Protein | Fat |
|---------|-----|---------|-----|
| Beef | 195 | 30g | 8g |
| Chicken | 170 | 28g | 6g |
| Pork | 190 | 27g | 9g |
| Turkey | 175 | 28g | 7g |

## Bottled Sauces Used

- Soy Sauce (8g)
- Teriyaki (30g)
- BBQ Sauce (32g)
- Gochujang (30g)
- Marinara (100g)
- Honey (10g)
- Sour Cream (60g)

All from USDA_MACROS lookup table in generator.js.

## Testing Checklist

- [ ] Load recipes.js → 123 total recipes
- [ ] Load generator.js → pickRecipesByFlavorAndMethod exports
- [ ] Test Kitchen tab → ground meats show correct recipes
- [ ] Browse tab → all 32 recipes visible
- [ ] Flavor selection → correct recipe pools match
- [ ] Macros → within expected ranges
- [ ] EZ compliance → all checks pass

## Docs Location

All documentation in `/ezmacros/` root:
- `GROUND_PROTEIN_RECIPES.md` - Full spec
- `RECIPE_LOOKUP_TABLE.md` - Detailed tables
- `RECIPE_MACROS_VALIDATION.md` - Macro reference
- `IMPLEMENTATION_SUMMARY.md` - Complete overview
- `QUICK_REFERENCE.md` - This file

## Support

**Question?** Check the docs above.
**Found a bug?** The validation scripts are in the implementation files.
**Need to expand?** See "Future Enhancements" in IMPLEMENTATION_SUMMARY.md.
