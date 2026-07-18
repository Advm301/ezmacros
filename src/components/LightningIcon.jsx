// Small inline lightning-bolt SVG (not the ⚡ emoji) so it renders
// identically across platforms and can flicker/spark via CSS animation --
// QuickPrep is about speed, so this bolt replaces every flame that used to
// appear across the app (Quick Prep effort gauge, Diary streak pill,
// cook-wizard progress indicator, the "you made it" flourish, and the High
// Protein badge). Built the same way the flame it replaces was: a gold
// bolt (outer, gradient-filled) plus a brighter pale-yellow shine streak
// down its leading edge (inner), each animated on its own loop, with a
// couple of tiny spark particles that crackle near the tips on their own
// staggered timers.
// `muted`: renders a flat, static, dim bolt instead of the lit gold one --
// used for the unfilled slots in the Quick Prep effort gauge (1-3 bolts),
// so it's visually obvious at a glance which bolts are "lit" (this recipe
// earned them) versus just placeholders completing the row of 3.
export default function LightningIcon({ size = 14, muted = false, id }) {
  // SVG gradients are looked up by id within the whole document, so with
  // several bolts on screen at once (the effort gauge alone renders three)
  // they'd all fight over one <linearGradient id="boltGradient">. Suffixing
  // with the size (and an optional explicit id) keeps each instance's
  // gradient unique enough in practice without needing a global counter.
  const gradientId = `boltGradient-${id ?? size}`;
  return (
    <svg
      className={muted ? 'bolt-icon bolt-icon-muted' : 'bolt-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: '-2px', overflow: 'visible' }}
      aria-hidden="true"
    >
      {!muted && (
        <defs>
          <linearGradient id={gradientId} x1="7" y1="2" x2="17" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff2a8" />
            <stop offset="55%" stopColor="#ffcc33" />
            <stop offset="100%" stopColor="#e6a400" />
          </linearGradient>
        </defs>
      )}
      <path
        className="bolt-outer"
        d="M7 2v11h3v9l7-12h-4l4-8z"
        fill={muted ? 'var(--muted2)' : `url(#${gradientId})`}
      />
      {!muted && (
        <>
          <line
            className="bolt-inner"
            x1="8.3" y1="3.6" x2="8.3" y2="11.4"
            stroke="#fff9d6"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity=".85"
          />
          <circle className="bolt-spark bolt-spark-1" cx="19" cy="3" r="1" fill="#fff2a8" />
          <circle className="bolt-spark bolt-spark-2" cx="4.5" cy="19.5" r=".8" fill="#fff2a8" />
        </>
      )}
    </svg>
  );
}
