export default function MacroSummaryTable({ loggedMeals = [], mealPlan, userGoals }) {
  const MACRO_COLORS = {
    calories: '#f97316',  // orange
    protein: '#a3e635',   // lime green
    carbs: '#60a5fa',     // blue
    fat: '#ef4444',       // red
  };

  // Calculate confirmed totals from logged meals
  const confirmedTotals = loggedMeals.reduce((acc, meal) => ({
    cal: acc.cal + (meal.cal || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  // Get planned totals
  const plannedTotals = mealPlan?.totalMacros || { cal: 0, protein: 0, carbs: 0, fat: 0 };

  // Get goal totals
  const goals = userGoals || { cal: 0, protein: 0, carbs: 0, fat: 0 };

  // Check if meal plan exists
  const showPlanned = mealPlan?.totalMacros;

  const macroData = [
    {
      name: 'Calories',
      key: 'calories',
      confirmed: Math.round(confirmedTotals.cal),
      planned: Math.round(plannedTotals.cal),
      goal: goals.cal,
      unit: '',
    },
    {
      name: 'Protein',
      key: 'protein',
      confirmed: Math.round(confirmedTotals.protein),
      planned: Math.round(plannedTotals.protein),
      goal: goals.protein,
      unit: 'g',
    },
    {
      name: 'Carbs',
      key: 'carbs',
      confirmed: Math.round(confirmedTotals.carbs),
      planned: Math.round(plannedTotals.carbs),
      goal: goals.carbs,
      unit: 'g',
    },
    {
      name: 'Fat',
      key: 'fat',
      confirmed: Math.round(confirmedTotals.fat),
      planned: Math.round(plannedTotals.fat),
      goal: goals.fat,
      unit: 'g',
    },
  ];

  const styles = `
    .macro-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 1.5rem;
      border: 1px solid var(--s1);
      border-radius: 8px;
      overflow: hidden;
      background: var(--s1);
    }

    .macro-table thead {
      background: var(--s2);
    }

    .macro-table th {
      padding: 10px 12px;
      text-align: right;
      font-weight: 700;
      font-size: 11px;
      color: #999;
      border-bottom: 2px solid var(--s1);
      letter-spacing: 0.5px;
    }

    .macro-table th:first-child {
      text-align: left;
    }

    .planned-column-header {
      color: #a3e635 !important;
    }

    .goal-column-header {
      color: #a78bfa !important;
    }

    .macro-table td {
      padding: 12px;
      border-bottom: 1px solid var(--s1);
      text-align: right;
      font-weight: 500;
    }

    .macro-table td:first-child {
      text-align: left;
    }

    .macro-label {
      font-weight: 700;
      font-size: 13px;
    }

    .macro-label.calories-label {
      color: ${MACRO_COLORS.calories};
    }

    .macro-label.protein-label {
      color: ${MACRO_COLORS.protein};
    }

    .macro-label.carbs-label {
      color: ${MACRO_COLORS.carbs};
    }

    .macro-label.fat-label {
      color: ${MACRO_COLORS.fat};
    }

    .confirmed-value {
      color: #7fb069;
      font-weight: 600;
    }

    .planned-value {
      color: #a3e635;
      font-weight: 600;
    }

    .goal-value {
      color: #a78bfa;
      font-weight: 500;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <table className="macro-table">
        <thead>
          <tr>
            <th>Macro</th>
            <th>Confirmed</th>
            {showPlanned && <th className="planned-column-header">Planned</th>}
            <th className="goal-column-header">Goal</th>
          </tr>
        </thead>
        <tbody>
          {macroData.map((macro) => (
            <tr key={macro.key}>
              <td className={`macro-label ${macro.key}-label`}>
                {macro.name}
              </td>
              <td className="confirmed-value">
                {macro.confirmed}{macro.unit}
              </td>
              {showPlanned && (
                <td className="planned-value">
                  {macro.planned}{macro.unit}
                </td>
              )}
              <td className="goal-value">
                {macro.goal}{macro.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
