import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RECIPES } from '../data/recipes.js';
import RecipeModal from '../components/RecipeModal';

export default function Today({onTabFocus, onUpdateEzLevel}) {
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ cal: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [deleteConfirmTime, setDeleteConfirmTime] = useState(null);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goalsSavedNotification, setGoalsSavedNotification] = useState(false);

  const loadData = async () => {
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

  useEffect(() => {
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

  useEffect(() => {
    // Call onTabFocus when tab becomes active
    if (onTabFocus) {
      onTabFocus();
    }
  }, [onTabFocus]);

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
          Today's Progress
        </div>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <button
            onClick={() => setShowGoalsModal(true)}
            style={{
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              borderRadius: 8,
              padding: '6px 10px',
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
              e.target.style.color = 'var(--muted)';
            }}
          >
            🎯
          </button>
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

                  {/* Right side: macros */}
                  <div style={{textAlign: 'right', marginLeft: 12}}>
                    <div style={{fontSize: 12, color: 'var(--orange)', fontWeight: 700}}>
                      {meal.cal} cal
                    </div>
                    <div style={{fontSize: 11, color: 'var(--lime)', marginTop: 2}}>
                      {meal.protein}g P
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

      {openRecipe && <RecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} onSave={loadData} />}

      {showGoalsModal && (
        <GoalsModal
          goals={goals}
          user={user}
          onClose={() => setShowGoalsModal(false)}
          onSave={(newGoals) => {
            setGoals(newGoals);
            if (onUpdateEzLevel && newGoals.ez_level) {
              onUpdateEzLevel(newGoals.ez_level);
            }
            setGoalsSavedNotification(true);
            setTimeout(() => setGoalsSavedNotification(false), 2000);
          }}
        />
      )}

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

function GoalsModal({ goals, user, onClose, onSave }) {
  // Personal stats
  const [sex, setSex] = useState(goals?.sex || 'Male');
  const [age, setAge] = useState(goals?.age || 30);
  const [weightLbs, setWeightLbs] = useState(goals?.weight_lbs || 180);
  const [heightCm, setHeightCm] = useState(goals?.height_cm || 180);
  const [activityLevel, setActivityLevel] = useState(goals?.activity_level || 'Moderately Active');
  const [isMetric, setIsMetric] = useState(false);

  // Macro goals
  const [protein, setProtein] = useState(goals?.protein || 180);
  const [carbs, setCarbs] = useState(goals?.carbs || 220);
  const [fat, setFat] = useState(goals?.fat || 60);
  const [ezLevel, setEzLevel] = useState(goals?.ez_level || 'Easy');
  const [saving, setSaving] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showEzInfo, setShowEzInfo] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const ACTIVITY_MULTIPLIERS = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
  };

  const ACTIVITY_DESCRIPTIONS = {
    'Sedentary': 'Desk job, little or no exercise',
    'Lightly Active': 'Exercise 1-3 days/week',
    'Moderately Active': 'Exercise 3-5 days/week',
    'Very Active': 'Hard exercise 6-7 days/week or physical job',
  };

  // Convert between metric and imperial
  const getLbsValue = () => isMetric ? Math.round(heightCm * 2.205) : weightLbs;
  const getKgValue = () => isMetric ? weightLbs : Math.round(weightLbs / 2.205);
  const getCmValue = () => isMetric ? weightLbs : Math.round(heightCm);
  const getFeetInches = () => {
    const cm = getCmValue();
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return { feet, inches };
  };

  // Calculate TDEE
  const calculateTDEE = () => {
    const kg = getKgValue();
    const cm = getCmValue();
    let bmr;

    if (sex === 'Male') {
      bmr = (10 * kg) + (6.25 * cm) - (5 * age) + 5;
    } else {
      bmr = (10 * kg) + (6.25 * cm) - (5 * age) - 161;
    }

    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
  };

  const tdee = calculateTDEE();
  const lbs = getLbsValue();

  // Calculate carbs from remaining calories
  const calculateCarbs = (calTotal, proteinG, fatG) => {
    const proteinCal = proteinG * 4;
    const fatCal = fatG * 9;
    const remaining = calTotal - proteinCal - fatCal;
    return Math.round(Math.max(0, remaining / 4));
  };

  // Calculate presets based on TDEE with corrected formulas
  const PRESETS = {
    cut: {
      cal: Math.round(tdee - 500),
      protein: Math.round(lbs * 1.0),
      fat: Math.round((tdee - 500) * 0.22 / 9),
    },
    maintain: {
      cal: tdee,
      protein: Math.round(lbs * 0.85),
      fat: Math.round(tdee * 0.25 / 9),
    },
    bulk: {
      cal: Math.round(tdee + 300),
      protein: Math.round(lbs * 0.75),
      fat: Math.round((tdee + 300) * 0.25 / 9),
    },
  };

  // Calculate carbs for each preset
  const presetsWithCarbs = Object.entries(PRESETS).reduce((acc, [key, preset]) => {
    acc[key] = {
      ...preset,
      carbs: calculateCarbs(preset.cal, preset.protein, preset.fat),
    };
    return acc;
  }, {});

  const calculatedCal = (protein * 4) + (carbs * 4) + (fat * 9);

  const applyPreset = (presetName) => {
    const preset = presetsWithCarbs[presetName];
    setProtein(preset.protein);
    setFat(preset.fat);
    setCarbs(preset.carbs);
    setSelectedPreset(presetName);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      const goalsData = {
        user_id: user.id,
        cal: calculatedCal,
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fat: parseInt(fat),
        ez_level: ezLevel,
        sex,
        age: parseInt(age),
        weight_lbs: lbs,
        height_cm: getCmValue(),
        activity_level: activityLevel,
      };

      const { data, error } = await supabase
        .from('goals')
        .upsert(goalsData, { onConflict: 'user_id' });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to save goals');
      }

      // Success - notify parent and close
      onSave(goalsData);
      onClose();
    } catch (err) {
      console.error('Error saving goals:', err);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const { feet, inches } = getFeetInches();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '20px 0',
    }}>
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 24,
        maxWidth: 500,
        width: '95%',
        margin: 'auto',
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <div style={{fontSize: 18, fontWeight: 700, color: 'var(--cream)'}}>My Goals</div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--muted)',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Personal Stats Section */}
        <div style={{background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 24}}>
          <div style={{fontSize: 12, fontWeight: 700, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12}}>
            Personal Stats
          </div>

          {/* Unit Toggle */}
          <div style={{display: 'flex', gap: 6, marginBottom: 12}}>
            {['Imperial', 'Metric'].map((unit) => (
              <button
                key={unit}
                onClick={() => setIsMetric(unit === 'Metric')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  background: (isMetric && unit === 'Metric') || (!isMetric && unit === 'Imperial') ? 'var(--lime)' : 'var(--s2)',
                  color: (isMetric && unit === 'Metric') || (!isMetric && unit === 'Imperial') ? '#000' : 'var(--cream)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {unit}
              </button>
            ))}
          </div>

          {/* Stats Inputs - 2 column grid */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12}}>
            {/* Sex */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                Sex
              </label>
              <div style={{display: 'flex', gap: 6}}>
                {['Male', 'Female'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    style={{
                      flex: 1,
                      padding: '8px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: sex === s ? 'var(--lime)' : 'var(--s2)',
                      color: sex === s ? '#000' : 'var(--cream)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                Age
              </label>
              <input
                type="number"
                min="15"
                max="80"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--cream)',
                  fontSize: 12,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Weight */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                {isMetric ? 'Weight (kg)' : 'Weight (lbs)'}
              </label>
              <input
                type="number"
                value={isMetric ? Math.round(weightLbs / 2.205) : weightLbs}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setWeightLbs(isMetric ? Math.round(val * 2.205) : val);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--cream)',
                  fontSize: 12,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Height */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                {isMetric ? 'Height (cm)' : 'Height'}
              </label>
              {isMetric ? (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 180)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--cream)',
                    fontSize: 12,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div style={{display: 'flex', gap: 6}}>
                  <input
                    type="number"
                    min="4"
                    max="7"
                    placeholder="ft"
                    value={feet}
                    onChange={(e) => {
                      const newFeet = parseInt(e.target.value) || 0;
                      setHeightCm(Math.round(newFeet * 30.48 + inches * 2.54));
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--cream)',
                      fontSize: 12,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="in"
                    value={inches}
                    onChange={(e) => {
                      const newInches = parseInt(e.target.value) || 0;
                      setHeightCm(Math.round(feet * 30.48 + newInches * 2.54));
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--cream)',
                      fontSize: 12,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8}}>
              Activity Level
            </label>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
              {Object.keys(ACTIVITY_MULTIPLIERS).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivityLevel(level)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: activityLevel === level ? 'var(--lime)' : 'var(--s2)',
                    color: activityLevel === level ? '#000' : 'var(--cream)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{fontSize: 11, fontWeight: 600}}>
                    {level}
                  </div>
                  <div style={{fontSize: 9, opacity: 0.7}}>
                    {ACTIVITY_DESCRIPTIONS[level]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TDEE Display */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--lime)',
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
            textAlign: 'center',
          }}>
            <div style={{fontSize: 10, color: 'var(--muted)', marginBottom: 4}}>Estimated Daily Energy Expenditure</div>
            <div style={{fontSize: 20, fontWeight: 700, color: 'var(--lime)'}}>
              {tdee} cal
            </div>
          </div>
        </div>

        {/* EZ Level Selector */}
        <div style={{marginBottom: 20, position: 'relative'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8}}>
            <div style={{fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1}}>
              EZ Level
            </div>
            <button
              onClick={() => setShowEzInfo(!showEzInfo)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 14,
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: 0,
              }}
            >
              ℹ️
            </button>
          </div>

          {showEzInfo && (
            <div style={{
              background: 'var(--s1)',
              border: '1px solid var(--lime)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              fontSize: 11,
              color: 'var(--cream)',
              lineHeight: 1.5,
            }}>
              <div style={{marginBottom: 8}}>
                <div style={{fontWeight: 600, color: 'var(--lime)', marginBottom: 2}}>⚡ Effortless</div>
                <div>Max 3 steps, 5 min active time. Microwave only, zero prep.</div>
              </div>
              <div style={{marginBottom: 8}}>
                <div style={{fontWeight: 600, color: 'var(--lime)', marginBottom: 2}}>⚡⚡ Easy</div>
                <div>Max 5 steps, 10 min active time. Simple cooking, bottled sauces.</div>
              </div>
              <div>
                <div style={{fontWeight: 600, color: 'var(--lime)', marginBottom: 2}}>⚡⚡⚡ Relaxed</div>
                <div>Max 5 steps, 15 min active time. Light prep, more variety.</div>
              </div>
            </div>
          )}

          <div style={{display: 'flex', gap: 8}}>
            {['Effortless', 'Easy', 'Relaxed'].map((level, idx) => (
              <button
                key={level}
                onClick={() => {
                  setEzLevel(level);
                  setShowEzInfo(false);
                }}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: ezLevel === level ? 'var(--lime)' : 'var(--s2)',
                  color: ezLevel === level ? '#000' : 'var(--cream)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {'⚡'.repeat(idx + 1)} {level}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Pills with Calculated Calories & Selection Tracking */}
        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8}}>
            {selectedPreset ? `${selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1)} Goal` : 'Custom Macros'}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6}}>
            {Object.keys(presetsWithCarbs).map((presetKey) => {
              const preset = presetsWithCarbs[presetKey];
              const displayName = presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
              return (
                <button
                  key={presetKey}
                  onClick={() => applyPreset(presetKey)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 12,
                    border: selectedPreset === presetKey ? '2px solid var(--lime)' : '1px solid var(--lime)',
                    background: selectedPreset === presetKey ? 'var(--lime)' : 'var(--s2)',
                    color: selectedPreset === presetKey ? '#000' : 'var(--lime)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPreset !== presetKey) {
                      e.currentTarget.style.background = 'var(--lime)';
                      e.currentTarget.style.color = '#000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPreset !== presetKey) {
                      e.currentTarget.style.background = 'var(--s2)';
                      e.currentTarget.style.color = 'var(--lime)';
                    }
                  }}
                >
                  <div style={{fontSize: 12, fontWeight: 700}}>{displayName}</div>
                  <div style={{fontSize: 10, opacity: 0.8}}>{preset.cal} cal</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Macro Inputs - Protein, Carbs, Fat (Calories calculated) */}
        <div style={{marginBottom: 20}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12}}>
            {[
              { label: '💪 Protein (g)', value: protein, setValue: setProtein, color: 'var(--lime)' },
              { label: '🍚 Carbs (g)', value: carbs, setValue: setCarbs, color: 'var(--blue)' },
              { label: '🥑 Fat (g)', value: fat, setValue: setFat, color: 'var(--muted)' },
            ].map((macro) => (
              <div key={macro.label}>
                <label style={{fontSize: 11, fontWeight: 600, color: macro.color, display: 'block', marginBottom: 6}}>
                  {macro.label}
                </label>
                <input
                  type="number"
                  value={macro.value}
                  onChange={(e) => {
                    setSelectedPreset(null);
                    macro.setValue(parseInt(e.target.value) || 0);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--s1)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--cream)',
                    fontSize: 14,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Calculated Calories Display */}
          <div style={{
            background: 'var(--s1)',
            border: '1px solid var(--orange)',
            borderRadius: 8,
            padding: 12,
            textAlign: 'center',
            marginBottom: 12,
          }}>
            <div style={{fontSize: 10, color: 'var(--muted)', marginBottom: 4}}>🔥 Calculated Total</div>
            <div style={{fontSize: 18, fontWeight: 700, color: 'var(--orange)'}}>
              {calculatedCal} cal
            </div>
            <div style={{fontSize: 9, color: 'var(--muted)', marginTop: 6}}>
              ({protein}g × 4) + ({carbs}g × 4) + ({fat}g × 9)
            </div>
          </div>

          {/* Error Message */}
          {saveError && (
            <div style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid var(--red)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              fontSize: 12,
              color: 'var(--red)',
              textAlign: 'center',
            }}>
              {saveError}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--lime)',
            border: 'none',
            borderRadius: 8,
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!saving) e.target.style.background = 'rgba(0, 255, 100, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--lime)';
          }}
        >
          {saving ? 'Saving...' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
}
