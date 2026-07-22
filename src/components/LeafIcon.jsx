// A simple leaf outline -- replaces the 🌱/🥦 emoji on the Prefer Fresh
// toggle and its matching cook-step substitution notes (see
// utils/freshAltTips.js), matching the app's plain-custom-SVG icon
// convention (see InfoIcon.jsx) instead of a colorful platform emoji glyph.
export default function LeafIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4c-9 0-16 5-16 14 9 0 16-5 16-14Z" />
      <path d="M5 19c3-5 6.5-8.5 12-11.5" />
    </svg>
  );
}
