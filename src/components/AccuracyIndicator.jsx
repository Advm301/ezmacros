export default function AccuracyIndicator({ planMacros, goalMacros, accuracy }) {
  if (!planMacros || !goalMacros || !accuracy) {
    return null;
  }

  const getMacroAccuracy = (planned, goal) => {
    if (goal === 0) return 100;
    return Math.max(0, 100 - Math.abs((planned - goal) / goal * 100));
  };

  const getAccuracyColor = (percent) => {
    if (percent >= 95) return 'var(--lime)';
    if (percent >= 85) return 'var(--orange)';
    return 'var(--orange)';
  };

  const calorieAccuracy = getMacroAccuracy(planMacros.cal, goalMacros.cal);
  const proteinAccuracy = getMacroAccuracy(planMacros.protein, goalMacros.protein);
  const carbAccuracy = getMacroAccuracy(planMacros.carbs, goalMacros.carbs);
  const fatAccuracy = getMacroAccuracy(planMacros.fat, goalMacros.fat);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Overall accuracy header */}
      <div style={{
        background: 'var(--s2)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        border: `2px solid ${getAccuracyColor(accuracy.overall)}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 24 }}>📊</div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Plan Accuracy</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: getAccuracyColor(accuracy.overall) }}>
              {Math.round(accuracy.overall)}%
            </div>
          </div>
        </div>

        {/* Macro breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Calories */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Calories</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getAccuracyColor(calorieAccuracy) }}>
                {Math.round(calorieAccuracy)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.cal} / {goalMacros.cal}
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getAccuracyColor(calorieAccuracy),
                  width: `${Math.min((planMacros.cal / goalMacros.cal) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Protein */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Protein</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getAccuracyColor(proteinAccuracy) }}>
                {Math.round(proteinAccuracy)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.protein}g / {goalMacros.protein}g
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getAccuracyColor(proteinAccuracy),
                  width: `${Math.min((planMacros.protein / goalMacros.protein) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Carbs</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getAccuracyColor(carbAccuracy) }}>
                {Math.round(carbAccuracy)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.carbs}g / {goalMacros.carbs}g
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getAccuracyColor(carbAccuracy),
                  width: `${Math.min((planMacros.carbs / goalMacros.carbs) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Fat</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getAccuracyColor(fatAccuracy) }}>
                {Math.round(fatAccuracy)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.fat}g / {goalMacros.fat}g
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getAccuracyColor(fatAccuracy),
                  width: `${Math.min((planMacros.fat / goalMacros.fat) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
        ✓ Green = 95%+ accuracy · ⚠ Orange = Below target
      </div>
    </div>
  );
}
