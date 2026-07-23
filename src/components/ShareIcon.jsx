// A plain custom SVG share glyph (see InfoIcon.jsx's established
// convention) -- the classic three-dots-and-lines share icon. currentColor
// by default so it matches whatever it's dropped into.
export default function ShareIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5l6.8-3.9" />
      <path d="M8.6 13.5l6.8 3.9" />
    </svg>
  );
}
