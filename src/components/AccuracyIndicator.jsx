export default function AccuracyIndicator({ planMacros, goalMacros, accuracy }) {
  if (!planMacros || !goalMacros || !accuracy) {
    return null;
  }

  const getMacroAccuracy = (planned, goal) => {
    if (goal === 0) return 100;
    return Math.max(0, 100 - Math.abs((planned - goal) / goal * 100));
  };

  // Get color based on actual vs target ratio (not accuracy percentage)
  // Green: 95-110% of target (ideal range)
  // Orange: <95% of target (under target)
  // Blue: >110% of target (over target)
  const getMacroColor = (actual, target) => {
    if (!target || target === 0) return 'var(--muted)';
    const ratio = actual / target;
    if (ratio >= 0.95 && ratio <= 1.10) return 'var(--lime)';     // Green: on target
    if (ratio < 0.95) return 'var(--orange)';                      // Orange: under target
    if (ratio > 1.10) return '#60a5fa';                            // Blue: over target
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
              <span style={{ fontSize: 12, fontWeight: 700, color: getMacroColor(planMacros.cal, goalMacros.cal) }}>
                {Math.round((planMacros.cal / goalMacros.cal) * 100)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.cal} / {goalMacros.cal}
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getMacroColor(planMacros.cal, goalMacros.cal),
                  width: `${Math.min((planMacros.cal / goalMacros.cal) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Protein */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Protein</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getMacroColor(planMacros.protein, goalMacros.protein) }}>
                {Math.round((planMacros.protein / goalMacros.protein) * 100)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.protein}g / {goalMacros.protein}g
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getMacroColor(planMacros.protein, goalMacros.protein),
                  width: `${Math.min((planMacros.protein / goalMacros.protein) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Carbs</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getMacroColor(planMacros.carbs, goalMacros.carbs) }}>
                {Math.round((planMacros.carbs / goalMacros.carbs) * 100)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.carbs}g / {goalMacros.carbs}g
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getMacroColor(planMacros.carbs, goalMacros.carbs),
                  width: `${Math.min((planMacros.carbs / goalMacros.carbs) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Fat</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getMacroColor(planMacros.fat, goalMacros.fat) }}>
                {Math.round((planMacros.fat / goalMacros.fat) * 100)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              {planMacros.fat}g / {goalMacros.fat}g
            </div>
            <div style={{ background: 'var(--s1)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: getMacroColor(planMacros.fat, goalMacros.fat),
                  width: `${Math.min((planMacros.fat / goalMacros.fat) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
        🟢 Green = 95-110% of target · 🟠 Orange = Under 95% · 🔵 Blue = Over 110%
      </div>
    </div>
  );
}
