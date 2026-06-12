import MealPlanCard from './MealPlanCard';

export default function MealPlanDisplay({
  mealPlan,
  goals,
  onSwapMeal,
  onViewRecipe,
  onRegeneratePlan,
  onClearPlan,
  onUnlogMeal,
  onRemoveMeal,
  isGenerating,
  onShowShoppingList,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)' }}>Your Meal Plan</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {confirmedCount === 0 ? 'No meals confirmed' : confirmedCount === totalMeals ? '✓ Fully confirmed' : `${confirmedCount}/${totalMeals} confirmed`}
            </div>
          </div>
          {mealPlan && (
            <button
              onClick={onShowShoppingList}
              title="Shopping List"
              style={{
                background: 'var(--s1)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                borderRadius: 6,
                width: 24,
                height: 24,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--lime)';
                e.target.style.color = 'var(--lime)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.color = 'var(--muted)';
              }}
            >
              🛒
            </button>
          )}
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



      {/* Meal Cards - sorted by timing order */}
      <div>
        {mealPlan.meals && (() => {
          // Sort meals by timing: Breakfast → Snack → Lunch → Snack → Dinner → Snack
          const mealOrder = ['breakfast', 'lunch', 'dinner'];
          const timingOrder = ['after_breakfast', 'after_lunch', 'after_dinner'];

          const sortedMeals = mealPlan.meals
            .filter(m => m && m.recipe)
            .sort((a, b) => {
              // If both are snacks, sort by timing
              if (a.mealType === 'snack' && b.mealType === 'snack') {
                return timingOrder.indexOf(a.timing) - timingOrder.indexOf(b.timing);
              }

              // If one is snack, position it after its corresponding meal
              if (a.mealType === 'snack' && b.mealType !== 'snack') {
                const bIndex = mealOrder.indexOf(b.mealType);
                const aTimingIndex = timingOrder.indexOf(a.timing);
                if (aTimingIndex === bIndex) return 1; // snack comes after this meal
                if (aTimingIndex < bIndex) return -1;
                return 1;
              }

              if (b.mealType === 'snack' && a.mealType !== 'snack') {
                const aIndex = mealOrder.indexOf(a.mealType);
                const bTimingIndex = timingOrder.indexOf(b.timing);
                if (bTimingIndex === aIndex) return -1; // snack comes after this meal
                if (bTimingIndex < aIndex) return 1;
                return -1;
              }

              // Both are regular meals, sort by meal order
              return mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType);
            });

          console.log('[DEBUG] Sorted meals for display:', sortedMeals.map(m => `${m.mealType}${m.timing ? ':' + m.timing : ''}`).join(' → '));

          return sortedMeals.map((meal) => (
            <MealPlanCard
              key={meal.mealType + (meal.timing || '')}
              meal={meal}
              onSwap={onSwapMeal}
              onViewRecipe={onViewRecipe}
              onUnlog={onUnlogMeal}
              onRemove={onRemoveMeal}
            />
          ));
        })()}
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
