import { useState } from 'react';

export default function ShoppingListModal({ mealPlan, onClose, checkedItems, setCheckedItems }) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Aggregate ingredients from meal plan
  const aggregateIngredients = () => {
    if (!mealPlan || !mealPlan.meals) return {};

    const ingredients = {};

    mealPlan.meals.forEach(meal => {
      if (!meal.recipe || !meal.recipe.components) return;

      meal.recipe.components.forEach(component => {
        const key = `${component.name}|${component.type}`;

        if (!ingredients[key]) {
          ingredients[key] = {
            name: component.name,
            type: component.type,
            quantity: 0,
            unit: component.unit || 'g',
          };
        }

        ingredients[key].quantity += component.grams || 0;
      });
    });

    console.log('[DEBUG] Aggregated ingredients:', ingredients);
    return ingredients;
  };

  // Format quantity for display based on unit type
  const getDisplayQuantity = (quantity, unit, name) => {
    if (!unit) unit = 'g';

    switch (unit) {
      case 'count':
        // Eggs: 50g = 1 egg
        const count = Math.round(quantity / 50);
        const eggLabel = name?.toLowerCase().includes('egg') ? 'egg' : 'item';
        console.log(`[DEBUG] getDisplayQuantity: ${name} grams=${quantity} unit=${unit} display=${count} ${eggLabel}${count > 1 ? 's' : ''}`);
        return `${count} ${eggLabel}${count > 1 ? 's' : ''}`;

      case 'ml':
        console.log(`[DEBUG] getDisplayQuantity: ${name} grams=${quantity} unit=${unit} display=${quantity}ml`);
        return `${Math.round(quantity)}ml`;

      case 'spray':
        console.log(`[DEBUG] getDisplayQuantity: ${name} grams=${quantity} unit=${unit} display=${quantity} spray`);
        return `${Math.round(quantity)} spray`;

      case 'each':
        console.log(`[DEBUG] getDisplayQuantity: ${name} grams=${quantity} unit=${unit} display=${quantity}`);
        return `${Math.round(quantity)}`;

      case 'g':
      default:
        console.log(`[DEBUG] getDisplayQuantity: ${name} grams=${quantity} unit=${unit} display=${quantity}g`);
        return `${Math.round(quantity)}g`;
    }
  };

  // Group ingredients by type
  const groupIngredients = () => {
    const ingredients = aggregateIngredients();
    const categoryOrder = ['Protein', 'Carb', 'Veg', 'Veg/Sauce', 'Sauce', 'Seasoning', 'Fat', 'Binder', 'Flavor', 'Packaged Meal'];
    const categoryEmojis = {
      'Protein': '🥩',
      'Carb': '🌾',
      'Veg': '🥬',
      'Veg/Sauce': '🥬',
      'Sauce': '🍯',
      'Seasoning': '🧂',
      'Fat': '🫒',
      'Binder': '⚪',
      'Flavor': '🌶️',
      'Packaged Meal': '📦',
    };

    const grouped = {};
    Object.values(ingredients).forEach(ing => {
      if (!grouped[ing.type]) {
        grouped[ing.type] = [];
      }
      grouped[ing.type].push(ing);
    });

    // Sort categories and items
    return categoryOrder
      .filter(cat => grouped[cat])
      .map(cat => ({
        category: cat,
        emoji: categoryEmojis[cat],
        items: grouped[cat].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  };

  const toggleItem = (itemKey) => {
    const newChecked = { ...checkedItems };
    if (newChecked[itemKey]) {
      delete newChecked[itemKey];
    } else {
      newChecked[itemKey] = true;
    }
    setCheckedItems(newChecked);
  };

  const formatIngredientKey = (name, type) => `${name}|${type}`;

  const copyToClipboard = async () => {
    const grouped = groupIngredients();
    const ingredients = aggregateIngredients();

    const lines = [];
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    lines.push(`SHOPPING LIST — ${today}\n`);

    grouped.forEach(group => {
      lines.push(`${group.emoji} ${group.category.toUpperCase()}`);
      group.items.forEach(item => {
        const displayQuantity = getDisplayQuantity(item.quantity, item.unit, item.name);
        lines.push(`- ${item.name} · ${displayQuantity}`);
      });
      lines.push('');
    });

    const totalItems = Object.keys(ingredients).length;
    const checkedCount = Object.keys(checkedItems).length;

    lines.push(`Total items: ${totalItems}`);
    lines.push(`Checked: ${checkedCount}`);

    const text = lines.join('\n');

    try {
      await navigator.clipboard.writeText(text);
      console.log('[DEBUG] Copied to clipboard - item count:', totalItems);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const grouped = groupIngredients();
  const ingredients = aggregateIngredients();

  console.log('[DEBUG] ShoppingListModal re-rendering - ingredient count:', Object.keys(ingredients).length);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--s1)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          width: '90%',
          maxWidth: 500,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>
            🛒 Shopping List
          </div>
        </div>

        {/* Scrollable ingredients list */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 20 }}>
          {grouped.length === 0 ? (
            <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
              No ingredients in meal plan
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  {group.emoji} {group.category}
                </div>

                {group.items.map((item) => {
                  const key = formatIngredientKey(item.name, item.type);
                  const isChecked = !!checkedItems[key];
                  const displayQuantity = getDisplayQuantity(item.quantity, item.unit, item.name);

                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'var(--s2)',
                        marginBottom: 6,
                        opacity: isChecked ? 0.6 : 1,
                        transition: 'opacity 0.15s',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        console.log('[DEBUG] Item checked:', item.name);
                        toggleItem(key);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(key)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          cursor: 'pointer',
                          width: 16,
                          height: 16,
                          accentColor: 'var(--lime)',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--cream)',
                            textDecoration: isChecked ? 'line-through' : 'none',
                          }}
                        >
                          {item.name}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {displayQuantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer with buttons */}
        <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button
            onClick={copyToClipboard}
            style={{
              flex: 1,
              background: 'var(--lime)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--bg)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {copyFeedback ? '✓ Copied!' : '📋 Copy to Clipboard'}
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--red)';
              e.target.style.color = 'var(--red)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--muted)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
