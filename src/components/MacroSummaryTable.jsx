export default function MacroSummaryTable({ loggedMeals = [], mealPlan, userGoals }) {
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

  const macroData = [
    {
      name: 'Calories',
      confirmed: Math.round(confirmedTotals.cal),
      planned: Math.round(plannedTotals.cal),
      goal: goals.cal,
      unit: '',
    },
    {
      name: 'Protein',
      confirmed: Math.round(confirmedTotals.protein),
      planned: Math.round(plannedTotals.protein),
      goal: goals.protein,
      unit: 'g',
    },
    {
      name: 'Carbs',
      confirmed: Math.round(confirmedTotals.carbs),
      planned: Math.round(plannedTotals.carbs),
      goal: goals.carbs,
      unit: 'g',
    },
    {
      name: 'Fat',
      confirmed: Math.round(confirmedTotals.fat),
      planned: Math.round(plannedTotals.fat),
      goal: goals.fat,
      unit: 'g',
    },
  ];

  const headerStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--cream)',
    background: 'var(--s2)',
    padding: '10px 8px',
    textAlign: 'left',
    borderBottom: '2px solid var(--s1)',
  };

  const cellStyle = {
    fontSize: 13,
    padding: '8px',
    color: 'var(--cream)',
    borderBottom: '1px solid var(--border)',
    textAlign: 'right',
  };

  const firstColStyle = {
    ...cellStyle,
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--cream)',
  };

  const firstHeaderStyle = {
    ...headerStyle,
    textAlign: 'left',
  };

  return (
    <div style={{
      background: 'var(--s1)',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 20,
      border: '1px solid var(--border)',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
      }}>
        <thead>
          <tr>
            <th style={firstHeaderStyle}>Macro</th>
            <th style={headerStyle}>Confirmed</th>
            <th style={headerStyle}>Planned</th>
            <th style={headerStyle}>Goal</th>
          </tr>
        </thead>
        <tbody>
          {macroData.map((macro) => (
            <tr key={macro.name}>
              <td style={firstColStyle}>{macro.name}</td>
              <td style={cellStyle}>{macro.confirmed}{macro.unit}</td>
              <td style={cellStyle}>{macro.planned}{macro.unit}</td>
              <td style={cellStyle}>{macro.goal}{macro.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
