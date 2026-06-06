import { useState } from 'react';

export default function MealSwapModal({ mealType, alternatives, onSwapConfirm, onCancel }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      lunch_dinner: 'Lunch/Dinner',
      dinner: 'Dinner',
      snack: 'Snack',
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleSwap = () => {
    if (selectedRecipe) {
      onSwapConfirm(selectedRecipe);
      onCancel();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 50,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        background: 'var(--s1)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cream)' }}>
            Swap {getMealTypeLabel(mealType)}
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Alternatives list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 18px',
        }}>
          {alternatives && alternatives.length > 0 ? (
            alternatives.map((alt, idx) => {
              const recipe = alt.recipe || alt;
              const isSelected = selectedRecipe?.id === recipe.id;
              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  style={{
                    background: isSelected ? 'var(--s2)' : 'var(--bg)',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                    border: isSelected ? '2px solid var(--lime)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => !isSelected && (e.currentTarget.style.borderColor = 'var(--lime)')}
                  onMouseLeave={(e) => !isSelected && (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {/* Recipe name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 20 }}>{recipe.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)' }}>
                        {recipe.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {recipe.activeTime} min · {recipe.method}
                      </div>
                    </div>
                    {isSelected && <div style={{ fontSize: 18, color: 'var(--lime)' }}>✓</div>}
                  </div>

                  {/* Macros */}
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                    {recipe.cal} cal · {recipe.protein}g P · {recipe.carbs}g C · {recipe.fat}g F
                  </div>

                  {/* Distance from target (if available) */}
                  {alt.distance !== undefined && (
                    <div style={{ fontSize: 11, color: 'var(--orange)' }}>
                      Macro distance: {Math.round(alt.distance)} pts
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
              No alternatives available
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--cream)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = 'var(--orange)')}
            onMouseLeave={(e) => (e.target.style.borderColor = 'var(--border)')}
          >
            Cancel
          </button>
          <button
            onClick={handleSwap}
            disabled={!selectedRecipe}
            style={{
              flex: 1,
              background: selectedRecipe ? 'var(--lime)' : 'var(--s2)',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontSize: 14,
              fontWeight: 600,
              color: selectedRecipe ? 'var(--bg)' : 'var(--muted)',
              cursor: selectedRecipe ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              opacity: selectedRecipe ? 1 : 0.5,
            }}
            onMouseEnter={(e) => selectedRecipe && (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => selectedRecipe && (e.target.style.opacity = '1')}
          >
            Swap Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
