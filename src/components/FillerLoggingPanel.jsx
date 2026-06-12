import { useState } from 'react';

export default function FillerLoggingPanel({ selectedFillers, fillers, totalMacros, onLog, onRemove }) {
  const [isLogging, setIsLogging] = useState(false);
  const [loggedFillers, setLoggedFillers] = useState([]);

  if (selectedFillers.length === 0) {
    return null;
  }

  const getLogSummary = () => {
    return selectedFillers.map(idx => {
      const filler = fillers[idx];
      const displayQuantity = filler.quantity % 1 === 0 ? `${filler.quantity}x` : `${filler.quantity.toFixed(2)}x`;
      return `${displayQuantity} ${filler.filler.name}`;
    }).join(', ');
  };

  const handleLog = async () => {
    if (selectedFillers.length === 0) {
      alert('Select at least one filler to log');
      return;
    }

    try {
      const logData = {
        fillers: selectedFillers.map(idx => ({
          name: fillers[idx].filler.name,
          quantity: fillers[idx].quantity,
          macros: fillers[idx].totalMacros,
        })),
        totalMacros: totalMacros,
        timestamp: new Date().toISOString(),
      };

      console.log('[DEBUG] Logging fillers:', logData);

      if (onLog) {
        await onLog(logData);
      }

      setLoggedFillers([...loggedFillers, logData]);
      setIsLogging(true);
      setTimeout(() => setIsLogging(false), 2000);
    } catch (error) {
      console.error('[ERROR] Failed to log fillers:', error);
      alert('Failed to log fillers: ' + error.message);
    }
  };

  const handleRemoveLogged = async (logIndex) => {
    try {
      const logData = loggedFillers[logIndex];
      console.log('[DEBUG] Removing logged filler entry:', logData);

      if (onRemove) {
        await onRemove(logData);
      }

      setLoggedFillers(prev => prev.filter((_, i) => i !== logIndex));
    } catch (error) {
      console.error('[ERROR] Failed to remove filler log:', error);
      alert('Failed to remove filler log: ' + error.message);
    }
  };

  return (
    <div style={{
      background: 'var(--s2)',
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      marginBottom: 20,
      border: '1px solid var(--lime)',
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--lime)',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        ✓ Ready to Log
      </div>

      <div style={{
        fontSize: 12,
        color: 'var(--cream)',
        marginBottom: 12,
        padding: 10,
        background: 'var(--bg)',
        borderRadius: 8,
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Selected Fillers:</div>
        <div>{getLogSummary()}</div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          Final Macros: {Math.round(totalMacros.protein)}g P · {Math.round(totalMacros.carbs)}g C · {Math.round(totalMacros.fat)}g F · {Math.round(totalMacros.cal)} cal
        </div>
      </div>

      <button
        onClick={handleLog}
        disabled={isLogging}
        style={{
          width: '100%',
          background: isLogging ? 'var(--s1)' : 'var(--lime)',
          border: 'none',
          borderRadius: 8,
          padding: '12px',
          fontSize: 13,
          fontWeight: 700,
          color: isLogging ? 'var(--muted)' : 'var(--bg)',
          cursor: isLogging ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: isLogging ? 0.6 : 1,
        }}
        onMouseEnter={(e) => !isLogging && (e.target.style.opacity = '0.8')}
        onMouseLeave={(e) => !isLogging && (e.target.style.opacity = '1')}
      >
        {isLogging ? '✓ Logged!' : '📝 Log These Fillers'}
      </button>

      {loggedFillers.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
            Logged Entries ({loggedFillers.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {loggedFillers.map((log, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 11,
                  padding: 8,
                  background: 'var(--bg)',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: 'var(--cream)' }}>
                  {log.fillers.map(f => f.name).join(', ')}
                </div>
                <button
                  onClick={() => handleRemoveLogged(idx)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ef4444';
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
