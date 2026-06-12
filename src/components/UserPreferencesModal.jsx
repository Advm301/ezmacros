import { useState, useEffect } from 'react';

export default function UserPreferencesModal({ preferences, onSave, onCancel }) {
  const [spiceLevel, setSpiceLevel] = useState(preferences?.spice_level || 'any');
  const [varietyLevel, setVarietyLevel] = useState(preferences?.variety_level || 'some_repeat');
  const [includeShakes, setIncludeShakes] = useState(preferences?.include_shakes !== false);
  const [proteinPrefs, setProteinPrefs] = useState(preferences?.protein_preferences || []);
  const [includeSnacks, setIncludeSnacks] = useState(preferences?.include_snacks === true);
  const [snackTiming, setSnackTiming] = useState(preferences?.snack_timing || []);
  const [saving, setSaving] = useState(false);

  const PROTEIN_OPTIONS = [
    { key: 'chicken', label: '🍗 Chicken' },
    { key: 'beef', label: '🥩 Beef' },
    { key: 'fish', label: '🐟 Fish' },
    { key: 'pork', label: '🐷 Pork' },
    { key: 'ground_beef', label: '🍔 Ground Beef' },
    { key: 'ground_chicken', label: '🍗 Ground Chicken' },
    { key: 'ground_pork', label: '🐷 Ground Pork' },
    { key: 'ground_turkey', label: '🦃 Ground Turkey' },
    { key: 'vegetarian', label: '🥬 Vegetarian' },
    { key: 'eggs', label: '🥚 Eggs' },
  ];

  const toggleProtein = (key) => {
    setProteinPrefs(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const toggleSnackTiming = (timing) => {
    setSnackTiming(prev =>
      prev.includes(timing) ? prev.filter(t => t !== timing) : [...prev, timing]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave({
      spice_level: spiceLevel,
      variety_level: varietyLevel,
      include_shakes: includeShakes,
      protein_preferences: proteinPrefs,
      include_snacks: includeSnacks,
      snack_timing: snackTiming,
    });
    setSaving(false);
    if (result?.success !== false) {
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
      zIndex: 40,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        background: 'var(--s1)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '90vh',
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
            Meal Planner Preferences
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

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
          {/* Spice Level */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)', marginBottom: 10 }}>
              Spice Level
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['low', 'medium', 'high', 'any'].map(level => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="spice"
                    value={level}
                    checked={spiceLevel === level}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    style={{ cursor: 'pointer', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--cream)' }}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Protein Preferences */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)', marginBottom: 10 }}>
              Protein Preferences
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PROTEIN_OPTIONS.map(option => (
                <label
                  key={option.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 10px',
                    background: proteinPrefs.includes(option.key) ? 'var(--s2)' : 'var(--bg)',
                    borderRadius: 8,
                    border: proteinPrefs.includes(option.key) ? '2px solid var(--lime)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={proteinPrefs.includes(option.key)}
                    onChange={() => toggleProtein(option.key)}
                    style={{ cursor: 'pointer', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--cream)' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Variety Level */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)', marginBottom: 10 }}>
              Recipe Variety
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'some_repeat', label: 'Allow repeats for better macro matching' },
                { key: 'always_different', label: 'Always different' },
              ].map(option => (
                <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="variety"
                    value={option.key}
                    checked={varietyLevel === option.key}
                    onChange={(e) => setVarietyLevel(e.target.value)}
                    style={{ cursor: 'pointer', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--cream)' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Shakes */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeShakes}
                onChange={(e) => setIncludeShakes(e.target.checked)}
                style={{ cursor: 'pointer', width: 18, height: 18 }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>
                Include Shakes in Snack Slots
              </span>
            </label>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, marginLeft: 26 }}>
              Auto-generate protein shakes for snack meals
            </div>
          </div>

          {/* Snacks (Optional) */}
          <div style={{ marginBottom: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={includeSnacks}
                onChange={(e) => {
                  setIncludeSnacks(e.target.checked);
                  if (!e.target.checked) {
                    setSnackTiming([]);
                  }
                }}
                style={{ cursor: 'pointer', width: 18, height: 18 }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>
                Include Snacks in Meal Plan
              </span>
            </label>

            {includeSnacks && (
              <>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, marginLeft: 26 }}>
                  Select when to add snacks (~300-350 cal each)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 26 }}>
                  {[
                    { key: 'after_breakfast', label: '🥣 After Breakfast' },
                    { key: 'after_lunch', label: '🥗 After Lunch' },
                    { key: 'after_dinner', label: '🍽️ After Dinner' },
                  ].map(option => (
                    <label
                      key={option.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 10px',
                        background: snackTiming.includes(option.key) ? 'var(--s2)' : 'var(--bg)',
                        borderRadius: 8,
                        border: snackTiming.includes(option.key) ? '2px solid var(--orange)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={snackTiming.includes(option.key)}
                        onChange={() => toggleSnackTiming(option.key)}
                        style={{ cursor: 'pointer', width: 16, height: 16 }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--cream)' }}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
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
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              background: 'var(--lime)',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--bg)',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: saving ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !saving && (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => !saving && (e.target.style.opacity = '1')}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
