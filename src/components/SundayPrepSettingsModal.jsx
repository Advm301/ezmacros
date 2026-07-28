import { hapticSelection } from '../utils/haptics';

const OPTIONS = [
  { n: 3, note: null },
  { n: 4, note: null },
  { n: 5, note: 'Mon–Fri' },
  { n: 7, note: 'Every day' },
];

// One-time (then reachable-anytime-via-account-menu) prompt: how many days
// should the weekly Sunday Prep pick cover? Same centered-card modal
// convention as AboutModal (rgba backdrop, rounded card, ✕ close) rather
// than a full takeover, since it's a single quick choice. Reused for both
// the first-run prompt (Saved.jsx) and the account-menu "edit" entry point
// (App.jsx) -- same component, same current/onSave/onClose contract.
export default function SundayPrepSettingsModal({ current, onSave, onClose }) {
  const choose = (n) => {
    hapticSelection();
    onSave(n);
  };
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, boxSizing: 'border-box' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', width: '100%', maxWidth: 400, maxHeight: '100%', overflowY: 'auto', borderRadius: 20, border: '1px solid var(--border)', padding: '20px 18px', boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>Sunday Prep</div>
          <div onClick={onClose} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4, marginTop: -4 }}>
            ✕
          </div>
        </div>

        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
          Each week we'll suggest one batch-cook recipe that holds up well in the fridge. How many days should it cover?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {OPTIONS.map(({ n, note }) => {
            const active = current === n;
            return (
              <div
                key={n}
                onClick={() => choose(n)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${active ? 'var(--lime)' : 'var(--border)'}`,
                  background: active ? 'var(--lime)' : 'var(--s1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: active ? '#000' : 'var(--cream)' }}>{n} days</span>
                {note && <span style={{ fontSize: 11, color: active ? 'rgba(0,0,0,.62)' : 'var(--muted)' }}>{note}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
