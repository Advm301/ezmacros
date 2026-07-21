import { useState, useEffect } from 'react';

// A short-lived burst of glowing gold particles, fired each time the person
// taps "Next" in the cook wizard -- meant to make advancing through a
// recipe feel like it's building a charge that peaks as they get further
// along (matching the app's lightning-bolt motif -- see LightningIcon).
// `intensity` (0-1, how far through the wizard this click landed) scales
// both the particle count and how far/big they fly, so the very first click
// gives a small crackle and the last few feel like a proper surge.
// Self-removing: renders nothing once its longest-lived particle finishes
// (reported via onDone) so the parent doesn't need its own timers.
// `colors` defaults to the cook-wizard's usual gold, but is overridable --
// e.g. RecipeModal's Surprise Me reveal passes the same purple/pink
// gradient as .surprise-btn so the burst reads as "surprise magic" rather
// than the wizard's own charge-building gold.
const DEFAULT_COLORS = ['#ffd700', '#fff3b0', '#ffb300'];

export default function SparkBurst({ intensity = 0.3, onDone, colors = DEFAULT_COLORS }) {
  const clamped = Math.max(0, Math.min(1, intensity));
  const [particles] = useState(() => {
    const count = Math.round(4 + clamped * 6); // 4 at the start, up to 10 near the end
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const distance = 22 + Math.random() * 16 + clamped * 16;
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 8 - clamped * 6, // slight upward drift, more as intensity grows
        size: 5 + Math.random() * 3 + clamped * 3,
        delay: Math.round(Math.random() * 60),
        duration: Math.round(460 + Math.random() * 200),
        color: colors[i % colors.length],
      };
    });
  });

  useEffect(() => {
    const total = Math.max(...particles.map((p) => p.delay + p.duration));
    const t = setTimeout(() => onDone && onDone(), total + 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            animation: `spark-burst ${p.duration}ms ease-out ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
