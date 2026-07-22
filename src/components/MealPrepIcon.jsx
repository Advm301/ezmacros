// A meal-prep container (the divided plastic box people actually batch-
// cook into) -- replaces the plain 📦 package emoji on the "Meal Prep ·
// Makes N" badge. A generic shipping box read as "package," not "food you
// portioned out," and didn't match the app's plain-custom-SVG icon
// convention (see InfoIcon.jsx). currentColor by default so it always
// matches whatever badge/text color it's dropped into.
export default function MealPrepIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M3 13h18" />
      <path d="M12 7v6" />
      <path d="M8 7V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V7" />
    </svg>
  );
}
