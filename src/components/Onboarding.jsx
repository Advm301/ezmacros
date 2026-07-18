import { useState } from 'react';
import { QUICK_PICKS } from '../data/pantryStaples.js';
import { ONBOARDING_GOALS } from '../utils/onboardingGoals';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import LightningIcon from './LightningIcon';

// Two-screen, skippable flow shown once, right after a brand-new sign-in --
// see App.jsx, which gates this behind a localStorage flag so it never
// shows again after the first pass (or after Skip). Replaces dropping
// someone straight onto an empty Kitchen tab with two ~10-second taps that
// (a) set expectations for what this app actually does and (b) collect
// just enough signal -- a goal and a few proteins you actually have -- to
// hand Kitchen a real, personalized set of recipes the instant this
// finishes, instead of making a first-time visitor do that work themselves
// before seeing any payoff. `onComplete` is called with either
// `{ staples, goal }` or `null` (full skip) -- see App.jsx for how that
// feeds into Kitchen's initialPicks prop.
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('goal'); // 'goal' | 'proteins'
  const [goal, setGoal] = useState(null);
  const [proteins, setProteins] = useState([]);

  const chooseGoal = (id) => {
    hapticSelection();
    setGoal(id);
    // Auto-advance -- this is a single-select, single-purpose screen, so a
    // separate "Next" button would just be one more tap for no benefit.
    setStep('proteins');
  };

  const toggleProtein = (id) => {
    hapticSelection();
    setProteins((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const finish = () => {
    hapticMedium();
    onComplete({ staples: proteins, goal });
  };

  const skipAll = () => {
    hapticLight();
    onComplete(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 430, width: '100%' }}>
        {/* Step dots -- just enough progress signal to make two quick
            screens feel like a short flow rather than an open-ended form. */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
          <div style={{ width: 22, height: 4, borderRadius: 100, background: 'var(--lime)' }} />
          <div style={{ width: 22, height: 4, borderRadius: 100, background: step === 'proteins' ? 'var(--lime)' : 'var(--s2)' }} />
        </div>

        {step === 'goal' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              <LightningIcon size={40} id="onboarding-goal" />
            </div>
            <div className="page-h1" style={{ textAlign: 'center' }}>What are you after?</div>
            <div className="sub" style={{ textAlign: 'center', marginBottom: 22 }}>
              Tell us what you've got, we'll tell you what to make -- no more staring into the fridge.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ONBOARDING_GOALS.map((g) => (
                <div
                  key={g.id}
                  onClick={() => chooseGoal(g.id)}
                  style={{
                    background: 'var(--s1)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cream)', marginBottom: 2 }}>
                    {g.label}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                    {g.description}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="page-h1" style={{ textAlign: 'center' }}>What do you usually have?</div>
            <div className="sub" style={{ textAlign: 'center', marginBottom: 18 }}>
              Pick a few -- we'll find recipes that use them right away. You can always add more later.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 26 }}>
              {QUICK_PICKS.map((s) => (
                <div
                  key={s.id}
                  className={`pill ${proteins.includes(s.id) ? 'active' : ''}`}
                  onClick={() => toggleProtein(s.id)}
                >
                  {proteins.includes(s.id) ? `✓ ${s.label}` : s.label}
                </div>
              ))}
            </div>
            <button
              className="gen-kitchen-btn"
              style={{ marginBottom: 12 }}
              onClick={finish}
            >
              {proteins.length > 0 ? 'Show Me Recipes' : "I'll Add These Later"}
            </button>
          </>
        )}

        <div
          onClick={skipAll}
          style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', marginTop: 4 }}
        >
          Skip for now
        </div>
      </div>
    </div>
  );
}
