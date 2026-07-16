// A couple of faint gold sparkle accents for the Find Recipes button --
// deliberately more restrained than SurpriseSparkles (fewer sparkles, lower
// peak opacity, slower timing) so Find Recipes reads as a gentle shimmer
// rather than competing with Surprise Me's bolder animation.
// Parent must be `position: relative` (and ideally `overflow: visible`).
const SPARKLES = [
  { top: '-6px', left: '18%', delay: '0s', size: 9 },
  { bottom: '-5px', right: '16%', delay: '1.6s', size: 8 },
];

export default function FindRecipesSparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="find-sparkle"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            fontSize: s.size,
            animationDelay: s.delay,
          }}
        >
          ✦
        </span>
      ))}
    </>
  );
}
