// Small twinkling sparkle accents overlaid on the Surprise Me button --
// purely decorative, so the button reads as a fun "wildcard" pick rather
// than just another action. A single shared component so every place this
// button appears (Kitchen, Diary) gets exactly the same animation instead
// of drifting out of sync as bespoke copies.
// Parent must be `position: relative` (and ideally `overflow: visible`) for
// these to sit correctly at the button's edges.
const SPARKLES = [
  { top: '-7px', left: '12%', delay: '0s', size: 12 },
  { top: '0px', right: '8%', delay: '.9s', size: 9 },
  { bottom: '-6px', left: '48%', delay: '1.7s', size: 10 },
];

export default function SurpriseSparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="surprise-sparkle"
          aria-hidden="true"
          style={{
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
