// A simple open-palm outline -- used on the Easy Mode toggle (see
// utils/eyeballPortions.js), which describes ingredient amounts in
// hand-portion terms (palm, fist, cupped handful) instead of grams/ml.
// Matches the app's plain-custom-SVG icon convention (see LeafIcon.jsx)
// rather than a platform emoji glyph.
export default function HandIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12.5V5.5a1.5 1.5 0 0 1 3 0v5" />
      <path d="M11 10.2V4a1.5 1.5 0 0 1 3 0v6.2" />
      <path d="M14 10.3V5.2a1.5 1.5 0 0 1 3 0v7.3" />
      <path d="M17 12.5V8.8a1.5 1.5 0 0 1 3 0V15c0 3.9-2.7 7-7 7s-6.5-2.2-7.7-5.3L4 12.8c-.5-1 -.1-2.1.9-2.5.8-.3 1.7 0 2.2.8l1 1.6" />
    </svg>
  );
}
