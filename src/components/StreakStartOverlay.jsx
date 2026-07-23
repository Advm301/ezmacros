import { useEffect, useState } from 'react';
import SparkBurst from './SparkBurst';
import { hapticSuccess } from '../utils/haptics';

// Flame-tinted version of SparkBurst's default gold, so the burst reads as
// "streak caught fire" rather than the cook wizard's usual charge-up gold.
const FLAME_COLORS = ['#ff4d4d', '#ff8533', '#ffcc33'];

// Full-screen, one-time celebration fired the moment a logging streak
// actually starts (0 -> 1, live -- see App.jsx's prevStreakRef check,
// which only fires on a real transition during this app session, never on
// cold load just because yesterday's streak happens to already be 1).
//
// Deliberately built as its own distinct animation (a flame igniting,
// not a reused LightningStrike/logo-struck moment) since this is meant to
// be a unique beat, not a recolor of an existing one. The flame silhouette
// itself is a bigger, filled/gradient version of FlameIcon's path rather
// than that component directly -- FlameIcon is a small stroke-only utility
// icon everywhere else in the app (badges, filter chips), and stays that
// way; this is a one-off hero rendering just for this moment.
//
// What starts/keeps the streak is unchanged from the small pill shown in
// Saved.jsx: any diary entry created the same calendar day as its date
// (see utils/streak.js) -- meal prep already works fine here, since
// re-adding today's leftover meal to the Diary is one tap, not a fresh
// cook. That's why the subtext below says "log," not "cook."
export default function StreakStartOverlay({ streak, onDone }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    hapticSuccess();
    const t = setTimeout(() => setClosing(true), 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!closing) return;
    // Matches .streak-start-overlay-out's fade duration in globals.css --
    // unmounts only once that animation has actually finished playing.
    const t = setTimeout(() => onDone && onDone(), 320);
    return () => clearTimeout(t);
  }, [closing, onDone]);

  const dismiss = () => {
    if (!closing) setClosing(true);
  };

  return (
    <div
      className={`streak-start-overlay${closing ? ' streak-start-overlay-out' : ''}`}
      onClick={dismiss}
      role="button"
      tabIndex={0}
      aria-label="Dismiss streak celebration"
    >
      <div className="streak-start-glow" aria-hidden="true" />

      <div className="streak-start-flame-wrap" aria-hidden="true">
        <SparkBurst intensity={1} colors={FLAME_COLORS} />
        <svg className="streak-start-flame" width="112" height="112" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="streakFlameGradient" x1="12" y1="1.5" x2="12" y2="22.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fff2a8" />
              <stop offset="35%" stopColor="#ffcc33" />
              <stop offset="70%" stopColor="#ff8533" />
              <stop offset="100%" stopColor="#ff4d4d" />
            </linearGradient>
          </defs>
          <path
            d="M12 1.5c1.6 3.1 4.5 5.2 4.5 9.4a4.5 4.5 0 0 1-9 0c0-1.1.35-2 .85-2.9-2.15 1.3-3.45 3.7-3.45 6.4a7 7 0 0 0 14 0c0-6.4-3.9-8.9-6.9-12.9Z"
            fill="url(#streakFlameGradient)"
          />
        </svg>
      </div>

      <div className="streak-start-title">Your streak has started!</div>
      <div className="streak-start-count">Day {streak}</div>
      <div className="streak-start-sub">
        Log something to your Diary each day to keep it going -- meal prepping? Re-adding the same meal counts too.
      </div>
      <div className="streak-start-tap">Tap anywhere to continue</div>
    </div>
  );
}
