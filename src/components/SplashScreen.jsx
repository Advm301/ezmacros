import { useEffect } from 'react';
import quickPrepLogo from '../assets/quickprep-logo-header.png';

// Shown once, for a couple of seconds, right after a brand-new sign-in
// and before the very first onboarding question -- see App.jsx, which
// renders this instead of jumping straight from Login into "What are
// you after?" the instant a session appears. Purely cosmetic: masks
// what would otherwise be an abrupt, jarring screen swap with a brief,
// branded moment instead.
//
// Timing is entirely CSS-driven (see .splash-logo/@keyframes
// splash-logo-life in globals.css) -- this component just waits for
// that animation to finish before telling App.jsx to move on. The
// setTimeout below is a fallback only, in case prefers-reduced-motion
// strips the animation (so animationend never fires) or the event is
// missed for any other reason -- it never leaves someone stuck here.
const FALLBACK_MS = 2400;

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="app-bg" aria-hidden="true"></div>
      <img
        src={quickPrepLogo}
        alt="QuickPrep"
        className="splash-logo"
        onAnimationEnd={onFinish}
      />
    </div>
  );
}
