// A simple flame outline -- replaces the 🔥 emoji on the cook wizard's
// preheat-oven tip, matching the app's plain-custom-SVG icon convention
// (see InfoIcon.jsx) instead of a colorful platform emoji glyph.
export default function FlameIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c1.2 2.4 3.5 4 3.5 7.2a3.5 3.5 0 0 1-7 0c0-.9.3-1.6.7-2.3-1.7 1-2.7 2.9-2.7 5a5.5 5.5 0 0 0 11 0c0-5-3-6.9-5.5-9.9Z" />
    </svg>
  );
}
