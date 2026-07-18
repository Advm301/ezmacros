import LightningIcon from './LightningIcon';

// Small twinkling lightning-bolt accents overlaid on onboarding's final
// button (see Onboarding.jsx) -- same idea as SurpriseSparkles, but bolts
// instead of stars, since this is the one moment onboarding hands off to
// the rest of the app and deserves its own distinct, on-brand flourish
// rather than reusing Surprise Me's sparkle.
// Parent must be `position: relative` (and ideally `overflow: visible`)
// for these to sit correctly at the button's edges.
const SPARKLES = [
  { top: '-8px', left: '10%', delay: '0s', size: 16 },
  { top: '-4px', right: '9%', delay: '.9s', size: 12 },
  { bottom: '-8px', left: '46%', delay: '1.7s', size: 14 },
];

export default function OnboardingFinishSparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="onboarding-finish-sparkle"
          aria-hidden="true"
          style={{
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            animationDelay: s.delay,
          }}
        >
          <LightningIcon size={s.size} id={`onboarding-finish-sparkle-${i}`} />
        </span>
      ))}
    </>
  );
}
