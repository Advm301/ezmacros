// Small circular "i" info button -- lets someone bring back a tab's
// FirstVisitTip banner on demand after they've dismissed it (see
// hooks/useFirstVisitTip.js), rather than it only ever being visible on
// that very first visit with no way to see it again. A plain custom SVG
// rather than an emoji or icon-font glyph, matching how every other icon
// in the app is built (LightningIcon, StarIcon, the tab bar icons, etc).
export default function InfoIcon({ size = 15, color = 'var(--muted)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="7.3" r="0.6" fill={color} stroke="none" />
    </svg>
  );
}
