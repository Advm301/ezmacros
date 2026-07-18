import { useEffect } from 'react';

// A quick, full-screen lightning strike fired each time the person taps
// Next in the cook wizard -- replaces the old persistent bolt icon that
// slowly grew in size across the whole wizard with one punchy hit per
// step instead, matching the app's "QuickPrep is about speed" theme: one
// strike per advance, not a slow build.
// Self-removing: calls onDone once its animation finishes (~450ms) so the
// parent doesn't need its own timer -- same pattern as SparkBurst.
export default function LightningStrike({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lightning-strike-overlay" aria-hidden="true">
      <div className="lightning-strike-flash" />
      <svg
        className="lightning-strike-bolt"
        viewBox="0 0 100 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lightningStrikeGradient" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff9d6" />
            <stop offset="45%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#ffb300" />
          </linearGradient>
        </defs>
        <path
          d="M52 0 L28 130 L48 130 L38 300 L82 145 L58 145 L70 0 Z"
          fill="url(#lightningStrikeGradient)"
        />
      </svg>
    </div>
  );
}
