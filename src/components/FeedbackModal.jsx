import { useState } from 'react';

export default function FeedbackModal({ onClose, onSubmit }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Enter a message first.');
      return;
    }
    setError('');
    setSubmitting(true);
    const ok = await onSubmit(message.trim());
    setSubmitting(false);
    if (ok) setDone(true);
    else setError("Couldn't send -- try again.");
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, boxSizing: 'border-box' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', width: '100%', maxWidth: 400, maxHeight: '100%', overflowY: 'auto', borderRadius: 20, border: '1px solid var(--border)', padding: '18px 18px 20px', boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>Send Feedback</div>
          <div onClick={onClose} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
            ✕
          </div>
        </div>

        {done ? (
          <div style={{ fontSize: 14, color: 'var(--lime)', textAlign: 'center', padding: '20px 0' }}>
            Thanks — got it.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>
              Bug, confusing screen, idea -- whatever you noticed. This is a beta build, so nothing is too small.
            </div>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's going on?"
              style={{ width: '100%', minHeight: 100, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: 'var(--cream)', fontSize: 16, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }}
            />
            {error && (
              <div style={{ fontSize: 12, color: '#ff8080', marginBottom: 10 }}>{error}</div>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', borderRadius: 13, padding: 12, fontSize: 14, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Sending…' : 'Send'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
