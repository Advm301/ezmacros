export default function GenerateMealPlanModal({ isGenerating, onGenerate, onCancel }) {
  console.log('[DEBUG] GenerateMealPlanModal rendering with isGenerating:', isGenerating);
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 1.0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: 'var(--s1)',
        borderRadius: 16,
        padding: 24,
        maxWidth: 320,
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      }}>
        {isGenerating ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 16, animation: 'spin 1s linear infinite' }}>
              ⚙️
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cream)', marginBottom: 8 }}>
              Generating Your Plan
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Finding recipes that match your goals...
            </div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </>
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cream)', marginBottom: 8 }}>
              Generate Meal Plan?
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
              We'll create a personalized meal plan for today based on your goals and preferences.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  console.log('[DEBUG] Modal [Cancel] button clicked');
                  onCancel();
                }}
                style={{
                  flex: 1,
                  background: 'var(--s2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 13,
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
                onClick={() => {
                  console.log('[DEBUG] Modal [Generate] button clicked');
                  onGenerate();
                }}
                style={{
                  flex: 1,
                  background: 'var(--lime)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                Generate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
