import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function GoalsModal({ goals, user, onClose, onSave, selectedTab = "calculate", onTabChange = () => {} }) {
  // Personal stats
  const [sex, setSex] = useState(goals?.sex || 'Male');
  const [age, setAge] = useState(goals?.age || 30);
  const [weightLbs, setWeightLbs] = useState(goals?.weight_lbs || 180);
  const [heightCm, setHeightCm] = useState(goals?.height_cm || 180);
  const [goalWeightLbs, setGoalWeightLbs] = useState(goals?.goal_weight_lbs || null);
  const [activityLevel, setActivityLevel] = useState(goals?.activity_level || 'Moderately Active');
  const [isMetric, setIsMetric] = useState(false);

  // Macro goals
  const [protein, setProtein] = useState(goals?.protein || 180);
  const [carbs, setCarbs] = useState(goals?.carbs || 220);
  const [fat, setFat] = useState(goals?.fat || 60);
  // Convert ez_level from integer to string: 1→'Effortless', 2→'Easy', 3→'Relaxed'
  const [ezLevel, setEzLevel] = useState(() => {
    const storedEzLevel = goals?.ez_level;
    console.log('[DEBUG] GoalsModal initializing ezLevel from props.goals.ez_level:', storedEzLevel);
    if (storedEzLevel === 1 || storedEzLevel === '1') {
      console.log('[DEBUG] Mapping ez_level 1 → Effortless');
      return 'Effortless';
    }
    if (storedEzLevel === 3 || storedEzLevel === '3') {
      console.log('[DEBUG] Mapping ez_level 3 → Relaxed');
      return 'Relaxed';
    }
    console.log('[DEBUG] Defaulting to Easy (either ez_level is 2 or undefined)');
    return 'Easy'; // Default to Easy (2)
  });
  const [saving, setSaving] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showEzInfo, setShowEzInfo] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isCustomMode, setIsCustomMode] = useState(selectedTab === "custom");
  const [customMacros, setCustomMacros] = useState({ protein: '', carbs: '', fat: '' });

  const ACTIVITY_MULTIPLIERS = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
  };

  const ACTIVITY_DESCRIPTIONS = {
    'Sedentary': 'Little or no exercise, desk job',
    'Lightly Active': 'Light exercise 1-3 days/week or walking daily',
    'Moderately Active': 'Gym 3-5 days/week, active lifestyle',
    'Very Active': 'Physical job, or training twice daily, competitive athlete',
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

  // ISSN evidence-based formulas using TDEE
  // Cut: TDEE - 500, Maintain: TDEE, Bulk: TDEE + 250
  const cutCal = tdee - 500;
  const maintainCal = tdee;
  const bulkCal = tdee + 250;

  // Build presets using ISSN methodology
  // All protein/fat based on current weight (lbs), not goal weight
  const PRESETS = {
    cut: {
      cal: cutCal,
      protein: Math.round(lbs * 1.0),
      fat: Math.round(lbs * 0.35),
    },
    maintain: {
      cal: maintainCal,
      protein: Math.round(lbs * 0.8),
      fat: Math.round(lbs * 0.4),
    },
    bulk: {
      cal: bulkCal,
      protein: Math.round(lbs * 0.75),
      fat: Math.round(lbs * 0.45),
    },
  };

  // Calculate carbs for each preset with realistic caps
  // Carbs fill remainder but capped to prevent unrealistic targets
  const presetsWithCarbs = Object.entries(PRESETS).reduce((acc, [key, preset]) => {
    const proteinCal = preset.protein * 4;
    const fatCal = preset.fat * 9;
    const remaining = preset.cal - proteinCal - fatCal;

    // Carb caps: Cut 200g, Maintain 280g, Bulk 350g
    const minCarbs = key === 'bulk' ? 150 : key === 'maintain' ? 100 : 50;
    const maxCarbs = key === 'bulk' ? 350 : key === 'maintain' ? 280 : 200;
    const carbs = Math.min(maxCarbs, Math.max(minCarbs, Math.round(remaining / 4)));

    acc[key] = {
      ...preset,
      carbs,
    };
    return acc;
  }, {});

  const calculatedCal = (protein * 4) + (carbs * 4) + (fat * 9);

  // Determine which preset(s) to show based on goal weight
  const getVisiblePresets = () => {
    if (!goalWeightLbs || goalWeightLbs === null) {
      // No goal weight set: show all three
      return ['cut', 'maintain', 'bulk'];
    }

    const goalWtFloat = parseFloat(goalWeightLbs);
    const currWtFloat = parseFloat(lbs);

    // Within 1 lb = maintaining
    if (Math.abs(goalWtFloat - currWtFloat) <= 1) {
      return ['maintain'];
    }

    // Losing weight
    if (goalWtFloat < currWtFloat) {
      return ['cut'];
    }

    // Gaining weight
    return ['bulk'];
  };

  const visiblePresets = getVisiblePresets();

  // Auto-apply preset if only one is visible
  useEffect(() => {
    if (visiblePresets.length === 1) {
      const presetName = visiblePresets[0];
      const preset = presetsWithCarbs[presetName];
      if (preset) {
        setProtein(preset.protein);
        setFat(preset.fat);
        setCarbs(preset.carbs);
        setSelectedPreset(presetName);
      }
    }
  }, [visiblePresets, presetsWithCarbs]);

  const applyPreset = (presetName) => {
    const preset = presetsWithCarbs[presetName];
    setProtein(preset.protein);
    setFat(preset.fat);
    setCarbs(preset.carbs);
    setSelectedPreset(presetName);
  };

  const [validationErrors, setValidationErrors] = useState({});

  const handleSave = async () => {
    // Validation
    const errors = {};
    if (!age || age < 15 || age > 80) errors.age = 'Age is required (15-80)';
    if (!lbs || lbs < 50) errors.weight = 'Weight is required';
    if (!goalWeightLbs || goalWeightLbs < 50) errors.goalWeight = 'Goal weight is required';
    if (!heightCm || heightCm < 100) errors.height = 'Height is required';

    // Validate custom macros if in custom mode
    if (isCustomMode) {
      const proteinVal = parseInt(customMacros.protein) || 0;
      const carbsVal = parseInt(customMacros.carbs) || 0;
      const fatVal = parseInt(customMacros.fat) || 0;

      if (!customMacros.protein || proteinVal === 0) errors.protein = 'Protein is required';
      if (!customMacros.carbs || carbsVal === 0) errors.carbs = 'Carbs are required';
      if (!customMacros.fat || fatVal === 0) errors.fat = 'Fat is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (!user) return;
    setSaving(true);
    setSaveError(null);
    setValidationErrors({});

    try {
      // Get fresh user data
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      if (!freshUser) {
        throw new Error('User session expired');
      }

      // Convert ez_level to integer: 'Effortless'→1, 'Easy'→2, 'Relaxed'→3
      const ezLevelInt = ezLevel === 'Effortless' ? 1 : ezLevel === 'Relaxed' ? 3 : 2;

      // Use custom macros if in custom mode, else use suggested macros
      const finalProtein = isCustomMode ? parseInt(customMacros.protein) || 0 : parseInt(protein);
      const finalCarbs = isCustomMode ? parseInt(customMacros.carbs) || 0 : parseInt(carbs);
      const finalFat = isCustomMode ? parseInt(customMacros.fat) || 0 : parseInt(fat);
      const finalCal = (finalProtein * 4) + (finalCarbs * 4) + (finalFat * 9);

      const goalsData = {
        user_id: freshUser.id,
        cal: finalCal,
        protein: finalProtein,
        carbs: finalCarbs,
        fat: finalFat,
        ez_level: ezLevelInt,
        sex,
        age: parseInt(age),
        weight_lbs: lbs,
        height_cm: getCmValue(),
        activity_level: activityLevel,
        goal_weight_lbs: goalWeightLbs,
      };

      // Check if goals record exists
      const { data: existingGoals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', freshUser.id)
        .maybeSingle();

      let error;
      if (existingGoals) {
        // Update existing record (don't include user_id in update)
        const updateData = { ...goalsData };
        delete updateData.user_id;
        const result = await supabase
          .from('goals')
          .update(updateData)
          .eq('user_id', freshUser.id);
        error = result.error;
      } else {
        // Insert new record
        const result = await supabase
          .from('goals')
          .insert(goalsData);
        error = result.error;
      }

      if (error) {
        console.error('Error saving goals:', error.message);
        throw new Error(error.message || 'Failed to save goals to database');
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
    <>
      <style>{`
        .goals-modal-input::-webkit-outer-spin-button,
        .goals-modal-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .goals-modal-input[type=number] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
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

        {/* Macro Mode Selector */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24}}>
          <button
            onClick={() => {
              setIsCustomMode(false);
              onTabChange("calculate");
            }}
            style={{
              padding: '12px 16px',
              borderRadius: 20,
              border: isCustomMode ? '1px solid var(--border)' : '1px solid var(--lime)',
              background: isCustomMode ? 'var(--s2)' : 'var(--lime)',
              color: isCustomMode ? 'var(--lime)' : '#000',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (isCustomMode) {
                e.target.style.background = 'var(--lime)';
                e.target.style.color = '#000';
              }
            }}
            onMouseLeave={(e) => {
              if (isCustomMode) {
                e.target.style.background = 'var(--s2)';
                e.target.style.color = 'var(--lime)';
              }
            }}
          >
            📊 Calculate for me
          </button>
          <button
            onClick={() => {
              setIsCustomMode(true);
              onTabChange("custom");
            }}
            style={{
              padding: '12px 16px',
              borderRadius: 20,
              border: !isCustomMode ? '1px solid var(--border)' : '1px solid var(--lime)',
              background: !isCustomMode ? 'var(--s2)' : 'var(--lime)',
              color: !isCustomMode ? 'var(--lime)' : '#000',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isCustomMode) {
                e.target.style.background = 'var(--lime)';
                e.target.style.color = '#000';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCustomMode) {
                e.target.style.background = 'var(--s2)';
                e.target.style.color = 'var(--lime)';
              }
            }}
          >
            ✏️ Set my own macros
          </button>
        </div>

        {/* EZ Level Selector - Always visible */}
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

          <div style={{fontSize: 9, color: 'var(--muted)', marginBottom: 12}}>
            Controls the complexity of recipes generated in the Kitchen tab. Change anytime.
          </div>

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

        {/* Personal Stats Section - Only shown in calculate mode */}
        {!isCustomMode && (
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
                Age <span style={{color: 'var(--red)'}}>*</span>
              </label>
              <input
                type="number"
                min="15"
                max="80"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                className="goals-modal-input"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: validationErrors.age ? '1px solid var(--red)' : '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--cream)',
                  fontSize: 12,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
              {validationErrors.age && <div style={{fontSize: 9, color: 'var(--red)', marginTop: 4}}>{validationErrors.age}</div>}
            </div>

            {/* Weight */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                {isMetric ? 'Weight (kg)' : 'Weight (lbs)'} <span style={{color: 'var(--red)'}}>*</span>
              </label>
              <input
                type="number"
                value={isMetric ? Math.round(weightLbs / 2.205) : weightLbs}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setWeightLbs(isMetric ? Math.round(val * 2.205) : val);
                }}
                className="goals-modal-input"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: validationErrors.weight ? '1px solid var(--red)' : '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--cream)',
                  fontSize: 12,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
              {validationErrors.weight && <div style={{fontSize: 9, color: 'var(--red)', marginTop: 4}}>{validationErrors.weight}</div>}
            </div>

            {/* Goal Weight */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                {isMetric ? 'Goal Wt (kg)' : 'Goal Wt (lbs)'} — for protein target <span style={{color: 'var(--red)'}}>*</span>
              </label>
              <input
                type="number"
                placeholder={isMetric ? Math.round(lbs * 0.9 / 2.205) : Math.round(lbs * 0.9)}
                value={isMetric && goalWeightLbs ? Math.round(goalWeightLbs / 2.205) : goalWeightLbs || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val) {
                    setGoalWeightLbs(isMetric ? Math.round(val * 2.205) : val);
                  } else {
                    setGoalWeightLbs(null);
                  }
                }}
                className="goals-modal-input"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: validationErrors.goalWeight ? '1px solid var(--red)' : '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--cream)',
                  fontSize: 12,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
              {validationErrors.goalWeight && <div style={{fontSize: 9, color: 'var(--red)', marginTop: 4}}>{validationErrors.goalWeight}</div>}
              <div style={{fontSize: 9, color: 'var(--muted)', marginTop: 4}}>Your target bodyweight used to set protein goals</div>
            </div>

            {/* Height */}
            <div>
              <label style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6}}>
                {isMetric ? 'Height (cm)' : 'Height'} <span style={{color: 'var(--red)'}}>*</span>
              </label>
              {isMetric ? (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 180)}
                  className="goals-modal-input"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'var(--bg)',
                    border: validationErrors.height ? '1px solid var(--red)' : '1px solid var(--border)',
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
                    className="goals-modal-input"
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      background: 'var(--bg)',
                      border: validationErrors.height ? '1px solid var(--red)' : '1px solid var(--border)',
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
                    className="goals-modal-input"
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      background: 'var(--bg)',
                      border: validationErrors.height ? '1px solid var(--red)' : '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--cream)',
                      fontSize: 12,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
              {validationErrors.height && <div style={{fontSize: 9, color: 'var(--red)', marginTop: 4}}>{validationErrors.height}</div>}
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
            <div style={{fontSize: 11, fontWeight: 600, color: 'var(--lime)', marginBottom: 2}}>Your TDEE (Total Daily Energy Expenditure)</div>
            <div style={{fontSize: 9, color: 'var(--muted)', marginBottom: 8}}>Calories your body burns daily at your activity level</div>
            <div style={{fontSize: 24, fontWeight: 700, color: 'var(--lime)'}}>
              {tdee} cal
            </div>
          </div>
        </div>
        )}

        {/* Macro Inputs - Only shown in custom mode */}
        {isCustomMode && (
        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6}}>
            <span>Custom Macros</span>
            <span style={{fontSize: 10, fontWeight: 400, color: 'var(--muted)'}}>
              ✏️ Custom
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12}}>
            {[
              {
                key: 'protein',
                label: '💪 Protein (g)',
                value: customMacros.protein,
                setValue: (val) => setCustomMacros(prev => ({...prev, protein: val})),
                color: 'var(--lime)'
              },
              {
                key: 'carbs',
                label: '🍚 Carbs (g)',
                value: customMacros.carbs,
                setValue: (val) => setCustomMacros(prev => ({...prev, carbs: val})),
                color: 'var(--blue)'
              },
              {
                key: 'fat',
                label: '🥑 Fat (g)',
                value: customMacros.fat,
                setValue: (val) => setCustomMacros(prev => ({...prev, fat: val})),
                color: 'var(--muted)'
              },
            ].map((macro) => (
              <div key={macro.key}>
                <label style={{fontSize: 11, fontWeight: 600, color: macro.color, display: 'block', marginBottom: 6}}>
                  {macro.label}
                </label>
                <input
                  type="number"
                  value={macro.value}
                  onChange={(e) => {
                    macro.setValue(e.target.value);
                  }}
                  className="goals-modal-input"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--s1)',
                    border: validationErrors[macro.key] ? '1px solid var(--red)' : '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--cream)',
                    fontSize: 14,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    opacity: 1,
                    cursor: 'text',
                    transition: 'all 0.15s',
                  }}
                />
                {validationErrors[macro.key] && <div style={{fontSize: 9, color: 'var(--red)', marginTop: 4}}>{validationErrors[macro.key]}</div>}
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
            {(() => {
              const p = parseInt(customMacros.protein) || 0;
              const c = parseInt(customMacros.carbs) || 0;
              const f = parseInt(customMacros.fat) || 0;
              const totalCal = (p * 4) + (c * 4) + (f * 9);
              return (
                <>
                  <div style={{fontSize: 18, fontWeight: 700, color: 'var(--orange)'}}>
                    {totalCal} cal
                  </div>
                  <div style={{fontSize: 9, color: 'var(--muted)', marginTop: 6}}>
                    ({p}g × 4) + ({c}g × 4) + ({f}g × 9)
                  </div>
                </>
              );
            })()}
          </div>
        </div>
        )}

        {/* Suggested Macros Display - Only shown in calculate mode */}
        {!isCustomMode && (
        <div style={{marginBottom: 20}}>
          {/* Preset Pills - Simplified based on goal weight */}
          <div style={{marginBottom: 20}}>
            <div style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8}}>
              {visiblePresets.length === 1 ? `${visiblePresets[0].charAt(0).toUpperCase() + visiblePresets[0].slice(1)} (Auto-applied)` : 'Select Goal'}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: visiblePresets.length === 3 ? '1fr 1fr 1fr' : '1fr', gap: 6}}>
              {visiblePresets.map((presetKey) => {
                const preset = presetsWithCarbs[presetKey];
                const displayName = presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
                const isSelected = selectedPreset === presetKey;

                return (
                  <button
                    key={presetKey}
                    onClick={() => applyPreset(presetKey)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 12,
                      border: isSelected ? '2px solid var(--lime)' : '1px solid var(--lime)',
                      background: isSelected ? 'var(--lime)' : 'var(--s2)',
                      color: isSelected ? '#000' : 'var(--lime)',
                      cursor: visiblePresets.length === 1 ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      opacity: visiblePresets.length === 1 ? 1 : 0.8,
                    }}
                    onMouseEnter={(e) => {
                      if (visiblePresets.length > 1 && !isSelected) {
                        e.currentTarget.style.background = 'var(--lime)';
                        e.currentTarget.style.color = '#000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (visiblePresets.length > 1 && !isSelected) {
                        e.currentTarget.style.background = 'var(--s2)';
                        e.currentTarget.style.color = 'var(--lime)';
                      }
                    }}
                  >
                    <div style={{fontSize: 12, fontWeight: 700}}>{displayName}</div>
                    <div style={{fontSize: 10, opacity: 0.8}}>{Math.round(preset.cal)} cal</div>
                  </button>
                );
              })}
            </div>
            <div style={{fontSize: 10, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic', textAlign: 'center'}}>
              {visiblePresets.length === 1 ? 'Based on your goal weight' : 'These are starting point estimates. Adjust based on your progress.'}
            </div>
          </div>

          {/* Suggested Macros Inputs - Read-only display */}
          <div style={{marginTop: 20}}>
            <div style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6}}>
              <span>Suggested Macros</span>
              <span style={{fontSize: 10, fontWeight: 400, color: 'var(--muted)'}}>
                🔒 auto-calculated
              </span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12}}>
              {[
                {
                  key: 'protein',
                  label: '💪 Protein (g)',
                  value: protein,
                  color: 'var(--lime)'
                },
                {
                  key: 'carbs',
                  label: '🍚 Carbs (g)',
                  value: carbs,
                  color: 'var(--blue)'
                },
                {
                  key: 'fat',
                  label: '🥑 Fat (g)',
                  value: fat,
                  color: 'var(--muted)'
                },
              ].map((macro) => (
                <div key={macro.key}>
                  <label style={{fontSize: 11, fontWeight: 600, color: macro.color, display: 'block', marginBottom: 6}}>
                    {macro.label}
                  </label>
                  <input
                    type="number"
                    value={macro.value}
                    readOnly
                    className="goals-modal-input"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--s1)',
                      border: '1px solid var(--muted)',
                      borderRadius: 8,
                      color: 'var(--muted)',
                      fontSize: 14,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      opacity: 0.5,
                      cursor: 'not-allowed',
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
              {(() => {
                const p = protein;
                const c = carbs;
                const f = fat;
                const totalCal = (p * 4) + (c * 4) + (f * 9);
                return (
                  <>
                    <div style={{fontSize: 18, fontWeight: 700, color: 'var(--orange)'}}>
                      {totalCal} cal
                    </div>
                    <div style={{fontSize: 9, color: 'var(--muted)', marginTop: 6}}>
                      ({p}g × 4) + ({c}g × 4) + ({f}g × 9)
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
        )}

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
    </>
  );
}

export default GoalsModal;
