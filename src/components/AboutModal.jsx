import quickPrepLogo from '../assets/quickprep-logo-header.png';
import { BETA_MODE } from '../config';

// Short, static "what is this app" explainer -- reachable from the
// account menu (see App.jsx's ⋯ dropdown). Same centered-card modal
// convention as FeedbackModal (rgba backdrop, rounded card, ✕ close)
// rather than a full-screen takeover, since this is a quick reference,
// not a moment that deserves its own big beat.
export default function AboutModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, boxSizing: 'border-box' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', width: '100%', maxWidth: 400, maxHeight: '100%', overflowY: 'auto', borderRadius: 20, border: '1px solid var(--border)', padding: '20px 18px', boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <img src={quickPrepLogo} alt="QuickPrep" style={{ height: 30, width: 'auto' }} />
          <div onClick={onClose} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4, marginTop: -4 }}>
            ✕
          </div>
        </div>

        {/* Same tagline treatment used in the header and onboarding --
            see .onboarding-tagline/-tagline-done in globals.css. */}
        <div className="onboarding-tagline" style={{ marginTop: 0, marginBottom: 14 }}>
          Meal. Prep. <span className="onboarding-tagline-done">Done</span>
        </div>

        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--cream)', marginBottom: 12 }}>
          QuickPrep helps you figure out what to cook with what you've already got. Pick a few ingredients in Kitchen and get real, fast recipes back -- no macros, no nutrition tracking, no 20-item grocery run, just food you can actually make tonight.
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--cream)', marginBottom: 12 }}>
          Browse the full recipe catalog any time, or use Diary to plan your days, track a logging streak, and build a shopping list as you go.
        </div>

        {BETA_MODE && (
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            This is a beta build -- if something looks off or you've got an idea, use the feedback button to let us know.
          </div>
        )}
      </div>
    </div>
  );
}
