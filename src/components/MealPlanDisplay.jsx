import MealPlanCard from './MealPlanCard';
import AccuracyIndicator from './AccuracyIndicator';

export default function MealPlanDisplay({
  mealPlan,
  goals,
  onSwapMeal,
  onViewRecipe,
  onRegeneratePlan,
  onClearPlan,
  isGenerating,
}) {
  if (!mealPlan || !mealPlan.meals) {
    return (
      <div style={{
        background: 'var(--s2)',
        borderRadius: 12,
        padding: 20,
        textAlign: 'center',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 24, marginBottom: 10 }}>📋</div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
          No meal plan generated. Click the button below to start.
        </div>
        <button
          onClick={onRegeneratePlan}
          disabled={isGenerating}
          style={{
            background: 'var(--lime)',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--bg)',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => !isGenerating && (e.target.style.opacity = '0.8')}
          onMouseLeave={(e) => !isGenerating && (e.target.style.opacity = '1')}
        >
          {isGenerating ? 'Generating...' : '⊕ Generate Meal Plan'}
        </button>
      </div>
    );
  }

  // Count confirmed meals
  const confirmedCount = mealPlan.meals.filter(m => m.confirmed)?.length || 0;
  const totalMeals = mealPlan.meals.length;

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Header with status and action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)' }}>Your Meal Plan</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {confirmedCount === 0 ? 'No meals confirmed' : confirmedCount === totalMeals ? '✓ Fully confirmed' : `${confirmedCount}/${totalMeals} confirmed`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClearPlan}
            style={{
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--orange)';
              e.target.style.color = 'var(--orange)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--muted)';
            }}
          >
            Clear Plan
          </button>
        </div>
      </div>

      {/* Confirmed Meals Summary */}
      {confirmedCount > 0 && (
        <div style={{
          background: 'var(--s3)',
          borderRadius: 12,
          padding: 14,
          marginBottom: 12,
          border: '1px solid rgba(0, 255, 100, 0.2)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>
            Confirmed Meals ({confirmedCount}/{totalMeals})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Cal', value: Math.round(mealPlan.meals.filter(m => m.confirmed && m.recipe).reduce((sum, m) => sum + (m.recipe.cal || 0), 0)) },
              { label: 'Protein', value: Math.round(mealPlan.meals.filter(m => m.confirmed && m.recipe).reduce((sum, m) => sum + (m.recipe.protein || 0), 0)), unit: 'g' },
              { label: 'Carbs', value: Math.round(mealPlan.meals.filter(m => m.confirmed && m.recipe).reduce((sum, m) => sum + (m.recipe.carbs || 0), 0)), unit: 'g' },
              { label: 'Fat', value: Math.round(mealPlan.meals.filter(m => m.confirmed && m.recipe).reduce((sum, m) => sum + (m.recipe.fat || 0), 0)), unit: 'g' },
            ].map((macro) => (
              <div key={macro.label} style={{ fontSize: 11 }}>
                <div style={{ color: 'var(--muted)', marginBottom: 2 }}>{macro.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--lime)' }}>
                  {macro.value}{macro.unit || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy Indicator */}
      <AccuracyIndicator
        planMacros={mealPlan.totalMacros}
        goalMacros={goals}
        accuracy={mealPlan.accuracy}
      />

      {/* Meal Cards */}
      <div>
        {mealPlan.meals && mealPlan.meals.filter(m => m && m.recipe).map((meal) => (
          <MealPlanCard
            key={meal.mealType}
            meal={meal}
            onSwap={onSwapMeal}
            onViewRecipe={onViewRecipe}
          />
        ))}
      </div>

      {/* Regenerate button at bottom */}
      <button
        onClick={onRegeneratePlan}
        disabled={isGenerating || confirmedCount > 0}
        style={{
          width: '100%',
          background: confirmedCount > 0 ? 'var(--s2)' : 'var(--s1)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '12px',
          fontSize: 13,
          fontWeight: 600,
          color: confirmedCount > 0 ? 'var(--muted)' : 'var(--cream)',
          cursor: confirmedCount > 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginTop: 12,
        }}
        onMouseEnter={(e) => confirmedCount === 0 && (e.target.style.borderColor = 'var(--lime)')}
        onMouseLeave={(e) => (e.target.style.borderColor = 'var(--border)')}
      >
        {isGenerating ? 'Regenerating...' : '🔄 Generate New Plan'}
      </button>
      {confirmedCount > 0 && (
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
          Confirm remaining meals to regenerate
        </div>
      )}
    </div>
  );
}
