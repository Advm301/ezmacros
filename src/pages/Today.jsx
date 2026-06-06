import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RECIPES } from '../data/recipes.js';
import RecipeModal from '../components/RecipeModal';
import StarIcon from '../components/StarIcon';

export default function Today({goals: propsGoals, onTabFocus, onUpdateEzLevel, favorites, isFavorited, toggleFavorite}) {
  const [goals, setGoals] = useState(propsGoals || null);
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ cal: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [deleteConfirmTime, setDeleteConfirmTime] = useState(null);
  const [goalsSavedNotification, setGoalsSavedNotification] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [loggedDates, setLoggedDates] = useState(new Set());

  const formatDateLabel = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateString === today) return 'Today';

    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handlePreviousDay = () => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    const newDate = current.toISOString().split('T')[0];
    // Don't allow going past today
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const handlePreviousMonth = () => {
    const prev = new Date(calendarMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCalendarMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(calendarMonth);
    next.setMonth(next.getMonth() + 1);
    setCalendarMonth(next);
  };

  const handleSelectDate = (day) => {
    const year = calendarMonth.getFullYear();
    const month = String(calendarMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;

    // Don't allow selecting future dates
    const today = new Date().toISOString().split('T')[0];
    if (dateStr <= today) {
      setSelectedDate(dateStr);
      setShowCalendar(false);
    }
  };

  const fetchLoggedDatesForMonth = async (userId) => {
    if (!userId) return;

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
    const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];

    try {
      const { data } = await supabase
        .from('meal_logs')
        .select('logged_at')
        .eq('user_id', userId)
        .gte('logged_at', `${startOfMonth}T00:00:00`)
        .lte('logged_at', `${endOfMonth}T23:59:59`);

      // Extract unique dates
      const dates = new Set();
      if (data) {
        data.forEach(meal => {
          const date = meal.logged_at.split('T')[0];
          dates.add(date);
        });
      }
      setLoggedDates(dates);
    } catch (err) {
      console.error('Error fetching logged dates:', err);
    }
  };

  const loadData = async (dateString = null) => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser) return;

      // Fetch user's goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      const userGoals = (goalsData && !goalsError) ? goalsData : {
        cal: 2200,
        protein: 180,
        carbs: 220,
        fat: 60,
      };
      setGoals(userGoals);

      // Use provided date or default to today
      const targetDate = dateString || new Date().toISOString().split('T')[0];
      const { data: mealsData } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', currentUser.id)
        .gte('logged_at', `${targetDate}T00:00:00`)
        .lte('logged_at', `${targetDate}T23:59:59`)
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

  useEffect(() => {
    setLoading(true);
    loadData(selectedDate);

    // Listen for visibility changes to refresh data when tab comes back into focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData(selectedDate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedDate]);

  useEffect(() => {
    // Call onTabFocus when tab becomes active
    if (onTabFocus) {
      onTabFocus();
    }
  }, [onTabFocus]);


  useEffect(() => {
    // Fetch logged dates for the calendar month when month changes or user changes
    if (user?.id && showCalendar) {
      fetchLoggedDatesForMonth(user.id);
    }
  }, [calendarMonth, user?.id, showCalendar]);

  // Sync local goals state when goals are updated from parent (App.jsx)
  useEffect(() => {
    if (propsGoals && (propsGoals.protein !== goals?.protein || propsGoals.carbs !== goals?.carbs || propsGoals.fat !== goals?.fat || propsGoals.cal !== goals?.cal)) {
      console.log('[DEBUG] Today.jsx syncing goals from parent:', { protein: propsGoals.protein, carbs: propsGoals.carbs, fat: propsGoals.fat, cal: propsGoals.cal });
      setGoals(propsGoals);
    }
  }, [propsGoals?.protein, propsGoals?.carbs, propsGoals?.fat, propsGoals?.cal]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteMeal = async (mealId) => {
    // If already in confirmation state, delete the meal
    if (deletingMealId === mealId && deleteConfirmTime) {
      try {
        const { error } = await supabase
          .from('meal_logs')
          .delete()
          .eq('id', mealId);

        if (!error) {
          // Remove meal from list
          const updatedMeals = meals.filter(m => m.id !== mealId);
          setMeals(updatedMeals);

          // Recalculate totals
          if (updatedMeals.length > 0) {
            const newTotals = updatedMeals.reduce(
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
        }
        setDeletingMealId(null);
        setDeleteConfirmTime(null);
      } catch (err) {
        console.error('Error deleting meal:', err);
      }
    } else {
      // First click - show confirmation for 2 seconds
      setDeletingMealId(mealId);
      setDeleteConfirmTime(Date.now());

      // Reset confirmation state after 2 seconds if not confirmed
      setTimeout(() => {
        if (deletingMealId === mealId) {
          setDeletingMealId(null);
          setDeleteConfirmTime(null);
        }
      }, 2000);
    }
  };

  // Check if a meal is modified by comparing with original data
  const isMealModified = (meal) => {
    if (!meal.recipe_data) return false;
    let recipeData;
    try {
      recipeData = typeof meal.recipe_data === 'string' ? JSON.parse(meal.recipe_data) : meal.recipe_data;
    } catch (e) {
      return false;
    }

    // If originalData exists, compare current components with original
    if (recipeData.originalData && recipeData.originalData.components) {
      const original = recipeData.originalData.components;
      const current = recipeData.components || [];
      if (original.length !== current.length) return true;
      for (let i = 0; i < original.length; i++) {
        if (original[i].name !== current[i].name) return true;
      }
      return false;
    }

    // If no originalData, check if name contains " (Modified)"
    return meal.recipe_name && meal.recipe_name.includes(" (Modified)");
  };

  // Get the original recipe data for a meal (for reset functionality)
  const getOriginalRecipeData = (meal) => {
    if (!meal.recipe_data) return null;
    let recipeData;
    try {
      recipeData = typeof meal.recipe_data === 'string' ? JSON.parse(meal.recipe_data) : meal.recipe_data;
    } catch (e) {
      return null;
    }

    // If originalData exists, use it
    if (recipeData.originalData) {
      return recipeData.originalData;
    }

    // Otherwise try to find matching recipe in RECIPES array
    const mealNameClean = meal.recipe_name ? meal.recipe_name.replace(" (Modified)", "") : "";
    const matchedRecipe = RECIPES.find(r => r.name === mealNameClean);
    if (matchedRecipe) {
      return {
        components: matchedRecipe.components,
        steps: matchedRecipe.steps,
        name: matchedRecipe.name,
      };
    }

    return null;
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
      {/* Header with goals and sign out */}
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
          Journal
        </div>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
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
      </div>

      <div className="px pt">
        {/* Date Navigation */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20}}>
          <button
            onClick={handlePreviousDay}
            style={{
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              color: 'var(--cream)',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--lime)';
              e.target.style.color = 'var(--lime)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--cream)';
            }}
          >
            ←
          </button>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            style={{fontSize: 13, fontWeight: 600, color: 'var(--cream)', minWidth: 60, textAlign: 'center', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'all 0.15s', background: showCalendar ? 'var(--s3)' : 'transparent'}}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--s3)';
              e.target.style.color = 'var(--lime)';
            }}
            onMouseLeave={(e) => {
              if (!showCalendar) {
                e.target.style.background = 'transparent';
              }
              e.target.style.color = 'var(--cream)';
            }}
          >
            {formatDateLabel(selectedDate)}
          </div>
          <button
            onClick={handleNextDay}
            disabled={selectedDate === new Date().toISOString().split('T')[0]}
            style={{
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              color: selectedDate === new Date().toISOString().split('T')[0] ? 'var(--muted)' : 'var(--cream)',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 14,
              cursor: selectedDate === new Date().toISOString().split('T')[0] ? 'default' : 'pointer',
              transition: 'all 0.15s',
              opacity: selectedDate === new Date().toISOString().split('T')[0] ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (selectedDate !== new Date().toISOString().split('T')[0]) {
                e.target.style.borderColor = 'var(--lime)';
                e.target.style.color = 'var(--lime)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDate !== new Date().toISOString().split('T')[0]) {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.color = 'var(--cream)';
              }
            }}
          >
            →
          </button>
        </div>

        {/* Calendar Modal */}
        {showCalendar && (
          <div style={{background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20}}>
            {/* Month/Year Navigation */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <button
                onClick={handlePreviousMonth}
                style={{background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s'}}
                onMouseEnter={(e) => {e.target.style.borderColor = 'var(--lime)'; e.target.style.color = 'var(--lime)';}}
                onMouseLeave={(e) => {e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--cream)';}}
              >
                ←
              </button>
              <div style={{fontSize: 14, fontWeight: 700, color: 'var(--cream)', minWidth: 150, textAlign: 'center'}}>
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button
                onClick={handleNextMonth}
                style={{background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s'}}
                onMouseEnter={(e) => {e.target.style.borderColor = 'var(--lime)'; e.target.style.color = 'var(--lime)';}}
                onMouseLeave={(e) => {e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--cream)';}}
              >
                →
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8}}>
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)', paddingBottom: 4}}>
                  {day}
                </div>
              ))}

              {/* Days */}
              {(() => {
                const year = calendarMonth.getFullYear();
                const month = calendarMonth.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const today = new Date().toISOString().split('T')[0];
                const days = [];

                // Empty cells before first day
                for (let i = 0; i < firstDay; i++) {
                  days.push(null);
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  days.push(day);
                }

                return days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} />;
                  }

                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;
                  const isFuture = dateStr > today;
                  const hasLoggedMeal = loggedDates.has(dateStr);

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => !isFuture && handleSelectDate(day)}
                      style={{
                        padding: '8px 4px',
                        textAlign: 'center',
                        borderRadius: 6,
                        cursor: isFuture ? 'default' : 'pointer',
                        background: isSelected ? 'var(--lime)' : isFuture ? 'transparent' : 'var(--s2)',
                        color: isSelected ? 'var(--bg)' : isFuture ? 'var(--muted)' : 'var(--cream)',
                        border: isToday ? '2px solid var(--lime)' : 'none',
                        opacity: isFuture ? 0.4 : 1,
                        fontSize: 12,
                        fontWeight: 600,
                        position: 'relative',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isFuture) {
                          e.target.style.background = 'var(--s3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !isFuture) {
                          e.target.style.background = 'var(--s2)';
                        }
                      }}
                    >
                      {day}
                      {hasLoggedMeal && !isSelected && (
                        <div style={{position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, background: 'var(--lime)', borderRadius: '50%'}} />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

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
              {selectedDate === new Date().toISOString().split('T')[0]
                ? 'Nothing logged yet today. Head to Kitchen to generate a meal.'
                : `Nothing logged on this day.`}
            </div>
          ) : (
            meals.map((meal, i) => (
              <div
                key={meal.id || i}
                style={{
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  marginBottom: 10,
                  overflow: 'hidden',
                }}
              >
                {/* Clickable card area */}
                <div
                  onClick={() => {
                    const modified = isMealModified(meal);
                    const originalData = getOriginalRecipeData(meal);

                    let recipeData = {
                      name: meal.recipe_name || 'Logged Meal',
                      emoji: '🍽️',
                      cal: meal.cal,
                      totalCal: meal.cal,
                      protein: meal.protein,
                      totalProtein: meal.protein,
                      carbs: meal.carbs,
                      totalCarbs: meal.carbs,
                      fat: meal.fat,
                      totalFat: meal.fat,
                      loggedTime: meal.logged_at,
                      logId: meal.id,
                      isLoggedView: true,
                      wasModified: modified,
                      hasResetButton: originalData !== null,
                    };

                    // Parse recipe_data if available
                    if (meal.recipe_data) {
                      try {
                        const parsed = JSON.parse(meal.recipe_data);
                        if (parsed.components) recipeData.components = parsed.components;
                        if (parsed.steps) recipeData.steps = parsed.steps;
                        if (parsed.toppings) recipeData.toppings = parsed.toppings;
                        if (parsed.emoji) recipeData.emoji = parsed.emoji;
                        if (parsed.method) recipeData.method = parsed.method;
                        if (parsed.activeTime) recipeData.activeTime = parsed.activeTime;
                        // Store originalData for reset comparison in RecipeModal
                        if (parsed.originalData) {
                          recipeData.originalRecipeData = parsed.originalData;
                        }
                      } catch (e) {
                        console.error('Error parsing recipe_data:', e);
                      }
                    }

                    // Set stepCount based on steps array
                    if (recipeData.steps && Array.isArray(recipeData.steps)) {
                      recipeData.stepCount = recipeData.steps.length;
                    }

                    setOpenRecipe(recipeData);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--s2)';
                    e.currentTarget.parentElement.style.borderColor = 'var(--lime)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.parentElement.style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Left side: emoji, name, time */}
                  <div style={{display: 'flex', gap: 10, flex: 1}}>
                    <div style={{fontSize: 20}}>🍽️</div>
                    <div>
                      <div style={{fontWeight: 700, fontSize: 14, color: 'var(--cream)', marginBottom: 4}}>
                        {(meal.recipe_name || 'Logged Meal') + (!meal.recipe_name?.includes('(Modified)') && isMealModified(meal) ? ' (Modified)' : '')}
                      </div>
                      <div style={{fontSize: 11, color: 'var(--muted)'}}>
                        {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Right side: macros and star */}
                  <div style={{textAlign: 'right', marginLeft: 12, display: 'flex', alignItems: 'center', gap: 8}}>
                    <div>
                      <div style={{fontSize: 12, color: 'var(--orange)', fontWeight: 700}}>
                        {meal.cal} cal
                      </div>
                      <div style={{fontSize: 11, color: 'var(--lime)', marginTop: 2}}>
                        {meal.protein}g P
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); toggleFavorite(meal.id); }}>
                      <StarIcon filled={isFavorited(meal.id)} size={20} />
                    </div>
                  </div>
                </div>

                {/* Delete button - separate from clickable area */}
                <div style={{display: 'flex', justifyContent: 'flex-end', paddingRight: 12, paddingBottom: 8}}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMeal(meal.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: deletingMealId === meal.id ? 'var(--red)' : 'var(--muted)',
                      fontSize: 16,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (deletingMealId !== meal.id) {
                        e.target.style.color = 'var(--red)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingMealId !== meal.id) {
                        e.target.style.color = 'var(--muted)';
                      }
                    }}
                  >
                    {deletingMealId === meal.id ? 'Remove?' : '✕'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {openRecipe && <RecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} onSave={loadData} isFavorited={isFavorited} toggleFavorite={toggleFavorite} />}


      {/* Goals Saved Notification */}
      {goalsSavedNotification && (
        <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--s1)', border: '2px solid var(--lime)', borderRadius: 16, padding: 24, textAlign: 'center', zIndex: 100}}>
          <div style={{fontSize: 32, color: 'var(--lime)', marginBottom: 12}}>✓</div>
          <div style={{fontSize: 18, fontWeight: 700, color: 'var(--cream)'}}>Goals Saved ✓</div>
        </div>
      )}
    </div>
  );
}
