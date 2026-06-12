export default function MealPlanCard({ meal, onViewRecipe, onUnlog, onRemove }) {
  // Safety check: verify meal and recipe exist
  if (!meal) {
    console.error('[DEBUG] MealPlanCard: meal prop is undefined');
    return null;
  }

  if (!meal.recipe) {
    console.error('[DEBUG] MealPlanCard: meal.recipe is undefined', { meal });
    return null;
  }

  const { mealType, recipe, targetMacros, confirmed } = meal;

  // Verify recipe has required properties
  if (!recipe.name || recipe.cal === undefined) {
    console.error('[DEBUG] MealPlanCard: recipe missing required properties', { recipe });
    return null;
  }

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'BREAKFAST',
      lunch: 'LUNCH',
      lunch_dinner: 'LUNCH/DINNER',
      dinner: 'DINNER',
      snack: 'SNACK',
    };
    return labels[type] || type.toUpperCase();
  };

  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: 'var(--orange)',
      lunch: 'var(--lime)',
      lunch_dinner: 'var(--lime)',
      dinner: 'var(--cream)',
      snack: 'var(--orange)',
    };
    return colors[type] || 'var(--cream)';
  };

  return (
    <div
      style={{
        background: 'var(--s2)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        border: confirmed ? '2px solid var(--lime)' : '1px solid var(--border)',
        transition: 'all 0.2s',
        opacity: confirmed ? 0.7 : 1,
      }}
    >
      {/* Header: Meal type + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: getMealTypeColor(mealType), letterSpacing: 0.5 }}>
            {getMealTypeLabel(mealType)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: confirmed ? 'var(--muted)' : 'var(--cream)', textDecoration: confirmed ? 'line-through' : 'none', transition: 'all 0.2s' }}>
              {recipe?.name || 'Meal'}
            </div>
            {confirmed && (
              <>
                <div style={{ fontSize: 16, color: 'var(--lime)', fontWeight: 700 }}>✓</div>
                {onUnlog && (
                  <button
                    onClick={() => onUnlog(mealType)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '2px 6px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'underline',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--orange)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--muted)';
                    }}
                  >
                    Unlog
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Macros line */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: recipe?.scaled ? 6 : 12 }}>
        {Math.round(recipe?.cal || 0)} cal · {Math.round(recipe?.protein || 0)}g P · {Math.round(recipe?.carbs || 0)}g C · {Math.round(recipe?.fat || 0)}g F
      </div>

      {/* Scaled portion note */}
      {recipe?.scaled && (
        <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 12 }}>
          Portions adjusted to meet your goals ({recipe?.scaleRatio?.toFixed(2)}x)
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => {
            if (recipe) {
              onViewRecipe(recipe);
            } else {
              console.error('[DEBUG] Cannot view recipe: recipe is undefined');
            }
          }}
          style={{
            flex: 1,
            background: 'var(--s1)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--cream)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--s2)';
            e.target.style.borderColor = 'var(--lime)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--s1)';
            e.target.style.borderColor = 'var(--border)';
          }}
        >
          View Recipe
        </button>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={() => {
            if (confirm('Remove this meal from the plan? This action cannot be undone.')) {
              console.log('[DEBUG] User confirmed meal removal for mealType:', mealType);
              onRemove(mealType);
            }
          }}
          style={{
            width: '100%',
            background: 'var(--s2)',
            border: '1px solid #ef4444',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2a2a2a';
            e.currentTarget.style.borderColor = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--s2)';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          title="Remove this meal from the plan (cannot be re-added)"
        >
          🗑️ Remove
        </button>
      )}
    </div>
  );
}
