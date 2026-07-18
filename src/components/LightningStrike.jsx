import { useEffect, useState } from 'react';

// A quick, full-screen lightning strike fired each time the person taps
// Next in the cook wizard -- replaces the old persistent bolt icon that
// slowly grew in size across the whole wizard with one punchy hit per
// step instead, matching the app's "QuickPrep is about speed" theme: one
// strike per advance, not a slow build.
// Self-removing: calls onDone once its animation finishes (~450ms) so the
// parent doesn't need its own timer -- same pattern as SparkBurst.
export default function LightningStrike({ onDone }) {
  // Picked once per mount (this component is remounted fresh on every
  // strike via a changing `key` in RecipeModal), so every tap of Next
  // lands somewhere slightly different instead of always dead-center.
  // `left` is a percent of the strike column's own width (see
  // .lightning-strike-overlay, which is capped to the app's own max-width
  // the same way .tabbar is, not the full browser viewport) and `rotate`
  // adds a bit of natural-looking tilt. The wrapper div (not the bolt svg
  // itself) carries this static position/transform, since the svg's own
  // CSS animation drives `transform: scaleY(...)` for the strike-down
  // motion and would otherwise clobber an inline transform on the same
  // element.
  const [{ left, rotate }] = useState(() => ({
    left: 25 + Math.random() * 50, // 25%-75%, keeps the bolt on-screen
    rotate: -8 + Math.random() * 16, // -8deg to +8deg
  }));

  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lightning-strike-overlay" aria-hidden="true">
      <div className="lightning-strike-flash" />
      <div
        className="lightning-strike-bolt-wrap"
        style={{ left: `${left}%`, transform: `translateX(-50%) rotate(${rotate}deg)` }}
      >
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
    </div>
  );
}
