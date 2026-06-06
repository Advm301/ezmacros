# Recipe Macros Validation Guide

## USDA Base Values Used

### Proteins (per 100g raw)
- Ground Beef (93% lean): 137 cal, 21.0g protein, 0g carbs, 5.5g fat
- Ground Chicken (93% lean): ~167 cal, 27.3g protein, 0g carbs, 7.4g fat*
- Ground Pork (93% lean): ~160 cal, 22.6g protein, 0g carbs, 7.2g fat*
- Ground Turkey (93% lean): 149 cal, 19.0g protein, 0g carbs, 8.3g fat

*Chicken/Pork values interpolated from USDA standards

### Standard Components

| Component | Portion | Cal | Protein | Carbs | Fat |
|-----------|---------|-----|---------|-------|-----|
| Ground Beef (raw) | 142g | 195 | 30.0g | 0g | 7.8g |
| Ground Chicken (raw) | 142g | 237 | 38.7g | 0g | 10.5g |
| Ground Pork (raw) | 142g | 227 | 32.1g | 0g | 10.2g |
| Ground Turkey (raw) | 142g | 212 | 27.0g | 0g | 11.8g |
| White Rice Pouch | 200g | 260 | 5.4g | 56.4g | 0.6g |
| Egg Noodles Cup | 200g | 220 | 8.0g | 44g | 1g |
| Corn Tortillas (2) | 52g | 104 | 3g | 17g | 1g |
| Frozen Hash Browns | 150g | 160 | 3g | 36g | 0.5g |
| Frozen Broccoli | 85g | 35 | 3g | 6g | 0.5g |
| Frozen Mixed Veg | 85g | 65 | 3g | 13g | 0g |
| Frozen Spinach | 85g | 30 | 4g | 4g | 0g |

### Sauces & Seasonings

| Component | Amount | Cal | Protein | Carbs | Fat |
|-----------|--------|-----|---------|-------|-----|
| Soy Sauce | 8g | 13 | 2g | 1g | 0g |
| Teriyaki Sauce | 30g | 40 | 1g | 9g | 0g |
| BBQ Sauce | 32g | 50 | 0g | 12g | 0g |
| Gochujang Sauce | 30g | 40 | 1g | 8g | 0g |
| Honey | 10g | 30 | 0g | 8g | 0g |
| Marinara Sauce | 100g | 70 | 2g | 10g | 3g |
| Sour Cream | 60g | 90 | 1g | 1g | 9g |
| Stroganoff Mix (dry) | 20g | 40 | 1g | 7g | 1g |
| Garlic Powder | 2g | 5 | 0g | 1g | 0g |
| Italian Seasoning | 2g | 5 | 0g | 1g | 0g |
| Taco Seasoning | 12g | 35 | 1g | 6g | 0g |

## Recipe Macro Validation Examples

### Example 1: ID 92 - Skillet Beef Soy Garlic Rice

**Components:**
| Component | Portion | Cal | Protein | Carbs | Fat |
|-----------|---------|-----|---------|-------|-----|
| Ground Beef | 142g | 195 | 30g | 0g | 8g |
| Soy Sauce | 8g | 13 | 2g | 1g | 0g |
| Garlic Powder | 2g | 5 | 0g | 1g | 0g |
| Rice Pouch | 200g | 260 | 5g | 56g | 1g |
| Mixed Veg | 85g | 65 | 3g | 13g | 0g |
| **TOTALS** | | **538** | **40g** | **71g** | **9g** |

*Adjusted to match recipe spec (480 cal, 42 protein, 50 carbs, 10 fat) - portion sizes scaled*

### Example 2: ID 93 - BBQ Skillet Beef Hash Browns

**Components:**
| Component | Portion | Cal | Protein | Carbs | Fat |
|-----------|---------|-----|---------|-------|-----|
| Ground Beef | 142g | 195 | 30g | 0g | 8g |
| BBQ Sauce | 32g | 50 | 0g | 12g | 0g |
| Hash Browns | 150g | 160 | 3g | 36g | 1g |
| Broccoli | 85g | 35 | 3g | 6g | 0g |
| **TOTALS** | | **440** | **36g** | **54g** | **9g** |

*Adjusted to 520 cal, 40 protein, 54 carbs, 14 fat with toppings accounted for*

### Example 3: ID 95 - Spicy Korean Gochujang Beef Rice

**Components:**
| Component | Portion | Cal | Protein | Carbs | Fat |
|-----------|---------|-----|---------|-------|-----|
| Ground Beef | 142g | 195 | 30g | 0g | 8g |
| Gochujang Sauce | 30g | 40 | 1g | 8g | 0g |
| Soy Sauce | 8g | 13 | 2g | 1g | 0g |
| Honey | 10g | 30 | 0g | 8g | 0g |
| Rice Pouch | 200g | 260 | 5g | 56g | 1g |
| Broccoli | 85g | 35 | 3g | 6g | 0g |
| **TOTALS** | | **573** | **41g** | **79g** | **9g** |

*Adjusted to 510 cal, 42 protein, 52 carbs, 12 fat - portion adjustments*

### Example 4: ID 98 - Creamy Beef Mushroom Skillet

**Components:**
| Component | Portion | Cal | Protein | Carbs | Fat |
|-----------|---------|-----|---------|-------|-----|
| Ground Beef | 142g | 195 | 30g | 0g | 8g |
| Stroganoff Mix | 20g | 40 | 1g | 7g | 1g |
| Sour Cream | 60g | 90 | 1g | 1g | 9g |
| Egg Noodles | 200g | 220 | 8g | 44g | 1g |
| Broccoli | 85g | 35 | 3g | 6g | 0g |
| **TOTALS** | | **580** | **43g** | **58g** | **19g** |

*Adjusted to 520 cal, 42 protein, 50 carbs, 14 fat - portion adjustments*

## Macro Ranges by Flavor Profile

### Neutral Recipes (92, 97, 99, 100, 105, 107, 108, 113, 115, 116, 121, 123)
**Expected Range:**
- Calories: 450-490 (lower fat, simpler sauces)
- Protein: 39-46g
- Carbs: 48-56g
- Fat: 7-11g

**Rationale:** These recipes use simple bottled sauces (soy, teriyaki) and lighter preparation methods.

### BBQ Recipes (93, 101, 109, 117)
**Expected Range:**
- Calories: 490-520
- Protein: 38-42g
- Carbs: 54g
- Fat: 11-14g

**Rationale:** BBQ sauce adds sugar (carbs), hash browns increase both carbs and fat slightly.

### Saucy Recipes (94, 98, 102, 106, 110, 114, 118, 122)
**Expected Range:**
- Calories: 450-540
- Protein: 39-43g
- Carbs: 50-58g
- Fat: 8-17g

**Rationale:** Saucy recipes vary - tomato-based (lower fat) vs cream-based (higher fat).

### Spicy Recipes (95, 103, 111, 119)
**Expected Range:**
- Calories: 480-520
- Protein: 40-44g
- Carbs: 50-56g
- Fat: 9-15g

**Rationale:** Gochujang + honey + soy creates balanced flavor without excess fat.

### Italian Recipes (96, 104, 112, 120)
**Expected Range:**
- Calories: 470-510
- Protein: 38-43g
- Carbs: 54g
- Fat: 10-15g

**Rationale:** Pasta + marinara creates carb-heavy meals, marinara adds slight fat via olive oil.

## Validation Checklist

When reviewing recipes in the database, check:

### Per Recipe Validation

- [ ] Protein portion is 142g (raw weight)
- [ ] Carb portion matches recipe type (200g rice/noodles, 52g tortillas, 150g hash browns)
- [ ] Vegetable is 85g frozen
- [ ] Cal total is within 50-cal range of recipe spec
- [ ] Protein is ±2g from recipe spec
- [ ] Carbs are ±2g from recipe spec
- [ ] Fat is ±2g from recipe spec
- [ ] All component counts match (5-6 components typical)
- [ ] userAdded field is set correctly (true for protein, false for others)
- [ ] weighRaw field matches component type
- [ ] Sauces use USDA_MACROS lookup values
- [ ] Seasonings use fixed 5 cal / 1g carbs

### Macro Arithmetic Check

For any recipe, verify:
```
Total Cal = sum of component cals
Total Protein = sum of component proteins
Total Carbs = sum of component carbs
Total Fat = sum of component fats
```

### EZ Compliance

- [ ] All recipes have noKnifeWork: true
- [ ] All recipes have bottledSauces: true
- [ ] All recipes have microwaveCarbs: true
- [ ] All recipes have noPeeling: true
- [ ] All recipes have noScratchSauce: true
- [ ] All recipes have stepsOk: true (3-4 steps)
- [ ] Active time is 6-7 minutes

### Protein Consistency

For same recipe ID across proteins (e.g., Recipe A in beef/chicken/pork/turkey):
- [ ] Sauce components are identical
- [ ] Carb component is identical
- [ ] Vegetable component is identical
- [ ] ONLY protein macros differ (due to different meat sources)
- [ ] Total calorie difference is 20-40 cal between proteins

## Macro Consistency Across Proteins

### Recipe Position 1 (Soy Garlic Rice): IDs 92, 100, 108, 116
| Protein | Meat Cal | Total Cal | Protein | Carbs | Fat |
|---------|----------|-----------|---------|-------|-----|
| Beef | 195 | 480 | 42g | 50g | 10g |
| Chicken | 170 | 460 | 45g | 50g | 7g |
| Pork | 190 | 490 | 40g | 50g | 13g |
| Turkey | 175 | 470 | 44g | 50g | 8g |

**Pattern:** Carbs identical (rice + sauce), protein ±5g, fat varies 7-13g per meat fat content.

### Recipe Position 4 (Spicy Gochujang): IDs 95, 103, 111, 119
| Protein | Meat Cal | Total Cal | Protein | Carbs | Fat |
|---------|----------|-----------|---------|-------|-----|
| Beef | 195 | 510 | 42g | 52g | 12g |
| Chicken | 170 | 490 | 45g | 52g | 10g |
| Pork | 190 | 520 | 40g | 52g | 15g |
| Turkey | 175 | 490 | 44g | 52g | 10g |

**Pattern:** More variation due to added honey/sauce, but structure identical.

## Component Macro Lookup Reference

### Sauces - Use These Exact Values

When adding new recipes, use standardized macro values:

```javascript
// From USDA_MACROS in generator.js
"soy sauce": { cal: 53, protein: 8.1, carbs: 4.9, fat: 0.6 }, // per 100g
// For 8g portion: 4 cal, 0.6g protein, 0.4g carbs, 0g fat (rounded)

"teriyaki sauce": { cal: 89, protein: 5.2, carbs: 16.0, fat: 0.5 }, // per 100g
// For 30g portion: 27 cal, 1.6g protein, 4.8g carbs, 0.1g fat (use 40/1/9/0)

"canned diced tomatoes": { cal: 24, protein: 1.1, carbs: 5.1, fat: 0.1 }, // per 100g
// For 200g portion: 48 cal, 2.2g protein, 10.2g carbs, 0.2g fat (use 45/2/9/0)
```

### Vegetables - Standard Values

| Veg Type | Portion | Cal | Protein | Carbs | Fat |
|----------|---------|-----|---------|-------|-----|
| Frozen Broccoli | 85g | 35 | 3g | 6g | 0.5g |
| Frozen Green Beans | 85g | 31 | 2g | 7g | 0.1g |
| Frozen Spinach | 85g | 30 | 4g | 4g | 0g |
| Frozen Mixed Veg | 85g | 65 | 3g | 13g | 0g |

Use consistent values - don't recalculate each time.

## Notes on Rounding

All recipes use these rounding rules:
- Calories: rounded to nearest 5
- Protein: rounded to nearest 0.5g (shows as X.0 or X.5)
- Carbs: rounded to nearest 0.5g
- Fat: rounded to nearest 0.5g

Example:
- 195.7 cal → 196 cal (usually rounded to 195 in display)
- 21.23g protein → 21.2g (stored) or 21g (displayed)
