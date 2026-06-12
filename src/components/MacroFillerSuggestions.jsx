import { useState } from 'react';

export default function MacroFillerSuggestions({ macroFillers = [], totalMacros, goals, onFillerUpdate, onSelectedFillersChange }) {
  const [selectedFillers, setSelectedFillers] = useState([]);

  if (!macroFillers || macroFillers.length === 0) {
    return null;
  }

  const getDisplayQuantity = (quantity) => {
    if (quantity % 1 === 0) return `${quantity}x`;
    return `${quantity.toFixed(2)}x`;
  };

  const toggleFiller = (index) => {
    setSelectedFillers(prev => {
      const updated = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];

      // Notify parent of selected fillers
      if (onSelectedFillersChange) {
        onSelectedFillersChange(updated);
      }

      // Notify parent of updated macros
      const fillerMacros = updated.reduce(
        (acc, idx) => ({
          protein: acc.protein + (macroFillers[idx].totalMacros.protein || 0),
          carbs: acc.carbs + (macroFillers[idx].totalMacros.carbs || 0),
          fat: acc.fat + (macroFillers[idx].totalMacros.fat || 0),
          cal: acc.cal + (macroFillers[idx].totalMacros.cal || 0),
        }),
        { protein: 0, carbs: 0, fat: 0, cal: 0 }
      );

      const newTotalMacros = {
        cal: Math.round(totalMacros.cal + fillerMacros.cal),
        protein: Math.round(totalMacros.protein + fillerMacros.protein),
        carbs: Math.round(totalMacros.carbs + fillerMacros.carbs),
        fat: Math.round(totalMacros.fat + fillerMacros.fat),
      };

      if (onFillerUpdate) {
        onFillerUpdate(newTotalMacros);
      }

      console.log('[DEBUG] Filler selection updated - selected:', updated, 'new macros:', newTotalMacros);
      return updated;
    });
  };

  // Calculate macros with selected fillers
  const fillerMacros = selectedFillers.reduce(
    (acc, idx) => ({
      protein: acc.protein + (macroFillers[idx].totalMacros.protein || 0),
      carbs: acc.carbs + (macroFillers[idx].totalMacros.carbs || 0),
      fat: acc.fat + (macroFillers[idx].totalMacros.fat || 0),
      cal: acc.cal + (macroFillers[idx].totalMacros.cal || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, cal: 0 }
  );

  const finalMacros = {
    protein: Math.round(totalMacros.protein + fillerMacros.protein),
    carbs: Math.round(totalMacros.carbs + fillerMacros.carbs),
    fat: Math.round(totalMacros.fat + fillerMacros.fat),
    cal: Math.round(totalMacros.cal + fillerMacros.cal),
  };

  return (
    <div style={{
      background: 'var(--s2)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      border: '1px solid var(--border)',
    }}>
      <div style={{
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--cream)',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        🎯 Close Your Macro Gaps
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {macroFillers.map((filler, idx) => (
          <label
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: selectedFillers.includes(idx) ? 'var(--s1)' : 'var(--bg)',
              border: selectedFillers.includes(idx) ? '1px solid var(--lime)' : '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <input
              type="checkbox"
              checked={selectedFillers.includes(idx)}
              onChange={() => toggleFiller(idx)}
              style={{ cursor: 'pointer', width: 18, height: 18, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cream)' }}>
                {getDisplayQuantity(filler.quantity)} {filler.filler.name} ({filler.filler.unit})
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                Closes {filler.gap}g {filler.macro} gap
              </div>
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--muted)',
              textAlign: 'right',
              flexShrink: 0,
              minWidth: 60,
            }}>
              {filler.totalMacros.cal ? `+${Math.round(filler.totalMacros.cal)} cal` : ''}
            </div>
          </label>
        ))}
      </div>

      {selectedFillers.length > 0 && (
        <div style={{
          background: 'var(--bg)',
          borderRadius: 8,
          padding: 12,
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>
            Final Macros with Selected Fillers
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8,
            fontSize: 12,
          }}>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: 10 }}>Protein</div>
              <div style={{ color: 'var(--cream)', fontWeight: 700 }}>
                {finalMacros.protein}g
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 9, marginTop: 2 }}>
                Goal: {Math.round(goals.protein)}g
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: 10 }}>Carbs</div>
              <div style={{ color: 'var(--cream)', fontWeight: 700 }}>
                {finalMacros.carbs}g
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 9, marginTop: 2 }}>
                Goal: {Math.round(goals.carbs)}g
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: 10 }}>Fat</div>
              <div style={{ color: 'var(--cream)', fontWeight: 700 }}>
                {finalMacros.fat}g
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 9, marginTop: 2 }}>
                Goal: {Math.round(goals.fat)}g
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: 10 }}>Calories</div>
              <div style={{ color: 'var(--cream)', fontWeight: 700 }}>
                {finalMacros.cal}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 9, marginTop: 2 }}>
                Goal: {Math.round(goals.cal)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
