export default function MealPlanCard({ meal, isConfirmed, onConfirm, onSwap, onViewRecipe }) {
  const { mealType, recipe, targetMacros } = meal;

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

  const macroAccuracy = targetMacros ? {
    calPercent: Math.round((recipe.cal / targetMacros.cal) * 100),
    proteinPercent: Math.round((recipe.protein / targetMacros.protein) * 100),
  } : null;

  return (
    <div
      style={{
        background: 'var(--s2)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        border: isConfirmed ? '2px solid var(--lime)' : '1px solid var(--border)',
        transition: 'all 0.2s',
      }}
    >
      {/* Header: Meal type + Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => onConfirm(mealType, e.target.checked)}
          style={{
            width: 20,
            height: 20,
            cursor: 'pointer',
            minWidth: 44,
            minHeight: 44,
            margin: -12,
            padding: 12,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: getMealTypeColor(mealType), letterSpacing: 0.5 }}>
            {getMealTypeLabel(mealType)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)', marginTop: 2 }}>
            {recipe.emoji} {recipe.name}
          </div>
        </div>
      </div>

      {/* Macros line */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
        {recipe.cal} cal · {recipe.protein}g P · {recipe.carbs}g C · {recipe.fat}g F
      </div>

      {/* Accuracy bars (if target exists) */}
      {macroAccuracy && (
        <div style={{ display: 'flex', gap: 8, fontSize: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--muted)', marginBottom: 3 }}>Cals</div>
            <div style={{ background: 'var(--s1)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: macroAccuracy.calPercent > 105 ? 'var(--orange)' : macroAccuracy.calPercent < 95 ? 'var(--orange)' : 'var(--lime)',
                  width: `${Math.min(macroAccuracy.calPercent, 100)}%`,
                }}
              />
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 2 }}>{macroAccuracy.calPercent}%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--muted)', marginBottom: 3 }}>Protein</div>
            <div style={{ background: 'var(--s1)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: macroAccuracy.proteinPercent > 105 ? 'var(--lime)' : macroAccuracy.proteinPercent < 95 ? 'var(--orange)' : 'var(--lime)',
                  width: `${Math.min(macroAccuracy.proteinPercent, 100)}%`,
                }}
              />
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 2 }}>{macroAccuracy.proteinPercent}%</div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onSwap(mealType)}
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
          Swap
        </button>
        <button
          onClick={() => onViewRecipe(recipe)}
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
    </div>
  );
}
