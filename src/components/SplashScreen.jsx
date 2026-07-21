import { useEffect, useState } from 'react';
import quickPrepLogo from '../assets/quickprep-logo-header.png';

// The very first thing anyone sees after signing in -- and, per the
// product ask, every single time the app is freshly opened afterward too
// (not just the brand-new-user path before onboarding; see App.jsx, which
// gates on this before even checking whether onboarding is done), so this
// needed to read as a genuine "welcome" moment rather than a one-off
// intro screen. Two JS-timed beats rather than one long CSS animation
// (unlike the old single-fade splash this replaced): the QuickPrep logo
// fades/settles in large and centered with a soft pulsing glow behind it,
// holds for a beat, then a lightning bolt strikes straight down through
// it (see .welcome-strike-bolt in globals.css, styled to match
// LightningStrike's per-step cook-wizard hits) and the logo gets jolted
// and flung away -- ties the app's very first moment directly into its
// own lightning-bolt identity instead of a generic fade transition.
//
// Driving this with plain setTimeout calls rather than onAnimationEnd
// listeners means it advances reliably even under prefers-reduced-motion
// (where the CSS animations are swapped for static/no-op states) --
// nothing here depends on a CSS animation actually completing.
const HOLD_MS = 1300; // logo fade-in + settled hold, before the strike lands
const STRUCK_MS = 560; // strike + jolt-away, before handing off to what's next

export default function SplashScreen({ onFinish, returning = true }) {
  const [struck, setStruck] = useState(false);

  useEffect(() => {
    const strikeTimer = setTimeout(() => setStruck(true), HOLD_MS);
    return () => clearTimeout(strikeTimer);
  }, []);

  useEffect(() => {
    if (!struck) return undefined;
    const finishTimer = setTimeout(onFinish, STRUCK_MS);
    return () => clearTimeout(finishTimer);
  }, [struck, onFinish]);

  return (
    <div className="welcome-screen">
      <div className="app-bg" aria-hidden="true"></div>
      {!struck && <div className="welcome-glow" aria-hidden="true" />}
      <img
        src={quickPrepLogo}
        alt="QuickPrep"
        className={`welcome-logo${struck ? ' welcome-logo-struck' : ''}`}
      />
      <div className={`welcome-message${struck ? ' welcome-message-struck' : ''}`}>
        {returning ? 'Welcome back' : 'Welcome'}
      </div>
      {struck && (
        <div className="welcome-strike" aria-hidden="true">
          <div className="welcome-strike-flash" />
          <div className="welcome-strike-bolt-wrap">
            <svg className="welcome-strike-bolt" viewBox="0 0 100 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="welcomeStrikeGradient" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fff9d6" />
                  <stop offset="45%" stopColor="#ffe066" />
                  <stop offset="100%" stopColor="#ffb300" />
                </linearGradient>
              </defs>
              <path
                d="M52 0 L28 130 L48 130 L38 300 L82 145 L58 145 L70 0 Z"
                fill="url(#welcomeStrikeGradient)"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
