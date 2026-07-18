import { useEffect, useState } from 'react';
import { hapticSelection, hapticLight } from '../utils/haptics';
import LightningIcon from './LightningIcon';

// Guided, click-through walkthrough of the recipe modal's "decide" screen --
// launched manually via the small info button next to Let's Make It (see
// RecipeModal.jsx), unlike the one-time automatic coach callouts elsewhere
// in that file (useFirstVisitTip-backed, shown once and never again). This
// is meant to be revisitable any time someone wants a refresher, so it's
// not gated by localStorage at all.
//
// Each step names a CSS selector for the real, already-on-screen element
// it's explaining (Add to Diary, the effort gauge, etc.) -- all six live on
// the decide screen, so no screen navigation is needed mid-tour. A
// full-screen click-catcher blocks interaction with anything underneath
// while the tour is active ("can only proceed by clicking Next"), and a
// `box-shadow: 0 0 0 9999px` spotlight ring is drawn around whichever
// element the current step targets, without needing an SVG mask.
const RECIPE_TUTORIAL_STEPS = [
  {
    selector: '#tour-add-to-diary',
    title: 'Add to Diary',
    text: "Log this meal to a specific day in your Diary -- track what you're eating, or plan ahead for later in the week.",
  },
  {
    selector: '#tour-effort-gauge',
    title: 'Quick Prep Gauge',
    text: 'These bolts show how much effort a recipe takes relative to the rest of the app -- 1 lit bolt is the easiest, 3 is more involved.',
  },
  {
    selector: '#tour-ingredients-check',
    title: 'Check What You Have',
    text: "Tap the checkbox next to any ingredient or seasoning to mark it off as something you've already got -- handy for a quick reality check before you shop or start cooking.",
  },
  {
    selector: '#tour-quantity-edit',
    title: 'Customize Amounts',
    text: "Tap any quantity to edit it -- and once you're cooking, tap any instruction step the same way to rewrite it. Make it match your own kitchen.",
  },
  {
    selector: '#tour-favorite-star',
    title: 'Save to Favorites',
    text: "Tap the star to save a recipe to your Favorites -- or just leave a note anywhere on it, and it'll save itself automatically.",
  },
  {
    selector: '#tour-view-all-steps',
    title: 'View All Steps',
    text: 'See every instruction at once instead of one at a time -- a quick way to read through the whole recipe before you dive in.',
  },
];

function measure(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function RecipeTutorial({ onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const step = RECIPE_TUTORIAL_STEPS[stepIndex];
  const isLast = stepIndex === RECIPE_TUTORIAL_STEPS.length - 1;

  useEffect(() => {
    let cancelled = false;
    const el = document.querySelector(step.selector);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // Scrolling is async/animated -- a short delay lets it settle before
    // measuring, so the spotlight doesn't briefly appear in the wrong spot
    // and then jump. Re-measured a couple of times over that window rather
    // than once, since smooth-scroll duration varies with distance.
    const timers = [80, 220, 420].map((ms) =>
      setTimeout(() => {
        if (!cancelled) setRect(measure(step.selector));
      }, ms)
    );
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [step.selector]);

  useEffect(() => {
    const onScrollOrResize = () => setRect(measure(step.selector));
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [step.selector]);

  const goNext = () => {
    hapticLight();
    if (isLast) {
      onClose();
    } else {
      hapticSelection();
      setStepIndex((i) => i + 1);
    }
  };

  const skip = () => {
    hapticLight();
    onClose();
  };

  // Tooltip prefers sitting just below the target; if that would run off
  // the bottom of the viewport, it flips to sit above it instead.
  const PAD = 8;
  const TOOLTIP_WIDTH = 280;
  const spaceBelow = rect ? window.innerHeight - (rect.top + rect.height) : 0;
  const showBelow = !rect || spaceBelow > 190;
  const tooltipTop = rect
    ? (showBelow ? rect.top + rect.height + PAD + 10 : Math.max(12, rect.top - PAD - 10 - 160))
    : window.innerHeight / 2 - 80;
  const tooltipLeft = rect
    ? Math.min(Math.max(12, rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2), window.innerWidth - TOOLTIP_WIDTH - 12)
    : window.innerWidth / 2 - TOOLTIP_WIDTH / 2;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Full-screen click-catcher + dimmed backdrop with a spotlight cutout
          around the current target, drawn via a giant box-shadow rather
          than an SVG mask -- simpler, and the highlight box itself can
          double as a glowing on-brand ring around whatever's being
          explained. */}
      <div style={{ position: 'fixed', inset: 0, background: rect ? 'transparent' : 'rgba(0,0,0,.72)' }} />
      {rect && (
        <div
          className="recipe-tutorial-spotlight"
          style={{
            position: 'fixed',
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            borderRadius: 12,
          }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: TOOLTIP_WIDTH,
          background: 'var(--s1)',
          border: '1px solid rgba(255,193,58,.5)',
          borderRadius: 14,
          padding: 14,
          boxShadow: '0 10px 30px rgba(0,0,0,.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <LightningIcon size={15} id={`recipe-tutorial-${stepIndex}`} />
          <span style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 14, fontWeight: 800, color: 'var(--cream)' }}>
            {step.title}
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>
          {step.text}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {stepIndex + 1} / {RECIPE_TUTORIAL_STEPS.length}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div onClick={skip} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', padding: '8px 4px' }}>
              Skip
            </div>
            <button
              onClick={goNext}
              style={{ background: 'var(--lime)', color: '#000', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}
            >
              {isLast ? 'Done' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
