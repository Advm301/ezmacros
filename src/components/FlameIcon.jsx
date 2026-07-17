// Small inline flame SVG (not the 🔥 emoji) so it renders identically across
// platforms and can flicker via CSS animation -- an emoji character can't be
// animated piece-by-piece (no separate inner/outer layers to move). Two
// overlapping paths (outer flame + brighter inner core) using the app's
// existing orange/amber accents, each animated on its own subtle loop so the
// movement doesn't look perfectly synced/mechanical.
// `muted`: renders a dim, static (non-flickering) flame instead of the
// usual lit orange/amber one -- used for the unfilled slots in the Quick
// Prep effort gauge (1-3 flames), so it's visually obvious which flames
// are "lit" (this recipe earned them) versus just placeholders completing
// the row of 3.
export default function FlameIcon({ size = 14, muted = false }) {
  return (
    <svg
      className={muted ? 'flame-icon flame-icon-muted' : 'flame-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: '-2px' }}
      aria-hidden="true"
    >
      <path
        className="flame-outer"
        d="M12 2c-.3 2.6-1.8 4.6-3.4 6.4C6.9 10.4 5.5 12.3 5.5 15c0 3.6 2.9 7 6.5 7s6.5-3.4 6.5-7c0-2.2-.9-3.8-1.8-5.1-.2.9-.7 1.8-1.5 2.3-.3-2.7-1.3-4.6-2.3-6.2C12.6 4.8 12.2 3.4 12 2z"
        fill={muted ? 'var(--muted2)' : '#ff8533'}
      />
      <path
        className="flame-inner"
        d="M12 9.5c.4 1.3.9 2.3 1.5 3.3.5.9.9 1.8.9 2.9 0 1.8-1.1 3.3-2.4 3.3s-2.4-1.5-2.4-3.3c0-1.6.9-2.7 1.6-3.7.3-.5.6-1.4.8-2.5z"
        fill={muted ? 'var(--muted2)' : '#ffc13a'}
      />
    </svg>
  );
}
