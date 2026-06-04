import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Today() {
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ cal: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (!currentUser) return;

        // Fetch user's goals
        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        const userGoals = goalsData || {
          cal: 2200,
          protein: 180,
          carbs: 220,
          fat: 60,
        };
        setGoals(userGoals);

        // Fetch today's meal logs
        const today = new Date().toISOString().split('T')[0];
        const { data: mealsData } = await supabase
          .from('meal_logs')
          .select('*')
          .eq('user_id', currentUser.id)
          .gte('logged_at', `${today}T00:00:00`)
          .lt('logged_at', `${today}T23:59:59`)
          .order('logged_at', { ascending: false });

        setMeals(mealsData || []);

        // Calculate totals
        if (mealsData && mealsData.length > 0) {
          const newTotals = mealsData.reduce(
            (acc, meal) => ({
              cal: acc.cal + (meal.cal || 0),
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fat: acc.fat + (meal.fat || 0),
            }),
            { cal: 0, protein: 0, carbs: 0, fat: 0 }
          );
          setTotals(newTotals);
        } else {
          setTotals({ cal: 0, protein: 0, carbs: 0, fat: 0 });
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for visibility changes to refresh data when tab comes back into focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const getProgress = (consumed, goal) => {
    return goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  };

  const macroData = [
    { label: 'Calories', key: 'cal', color: 'var(--orange)', consumed: totals.cal, goal: goals?.cal || 2200 },
    { label: 'Protein', key: 'protein', color: 'var(--lime)', consumed: totals.protein, goal: goals?.protein || 180, unit: 'g' },
    { label: 'Carbs', key: 'carbs', color: 'var(--blue)', consumed: totals.carbs, goal: goals?.carbs || 220, unit: 'g' },
    { label: 'Fat', key: 'fat', color: 'var(--pink)', consumed: totals.fat, goal: goals?.fat || 60, unit: 'g' },
  ];

  if (loading) {
    return (
      <div style={{paddingBottom: 20, padding: '20px', textAlign: 'center', color: 'var(--muted)'}}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{paddingBottom: 20}}>
      {/* Header with sign out */}
      <div style={{
        padding: '14px 18px 10px',
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{fontFamily: "'Clash Display',sans-serif", fontSize: 18, fontWeight: 700}}>
          Today's Progress
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: 'var(--s2)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--red)';
            e.target.style.color = 'var(--red)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.color = 'var(--muted)';
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="px pt">
        {/* Macro Progress Bars */}
        <div style={{marginBottom: 24}}>
          {macroData.map((macro) => {
            const progress = getProgress(macro.consumed, macro.goal);
            return (
              <div key={macro.key} style={{marginBottom: 20}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                  <div style={{fontSize: 13, fontWeight: 600, color: 'var(--cream)'}}>
                    {macro.label}
                  </div>
                  <div style={{fontSize: 13, fontWeight: 700, color: macro.color}}>
                    {Math.round(macro.consumed)}{macro.unit || ''} / {macro.goal}{macro.unit || ''}
                  </div>
                </div>
                <div style={{
                  height: 8,
                  background: 'var(--s3)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      height: '100%',
                      background: macro.color,
                      width: `${progress}%`,
                      transition: 'width 0.3s ease',
                      borderRadius: 10,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Logged Meals */}
        <div style={{marginTop: 28}}>
          <div style={{fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12}}>
            Logged Meals ({meals.length})
          </div>

          {meals.length === 0 ? (
            <div style={{
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 16,
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: 13,
              lineHeight: 1.6,
            }}>
              Nothing logged yet today. Head to Kitchen to generate a meal.
            </div>
          ) : (
            meals.map((meal, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: 14, color: 'var(--cream)', marginBottom: 4}}>
                    {meal.recipe_name || 'Logged Meal'}
                  </div>
                  <div style={{fontSize: 11, color: 'var(--muted)'}}>
                    {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{textAlign: 'right', marginLeft: 12}}>
                  <div style={{fontSize: 12, color: 'var(--orange)', fontWeight: 700}}>
                    {meal.cal} cal
                  </div>
                  <div style={{fontSize: 11, color: 'var(--lime)', marginTop: 2}}>
                    {meal.protein}g P
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
