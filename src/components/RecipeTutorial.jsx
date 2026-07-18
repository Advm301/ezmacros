import { useEffect, useState } from 'react';
import { hapticSelection, hapticLight } from '../utils/haptics';
import LightningIcon from './LightningIcon';

// Guided, click-through walkthrough of one screen of the recipe modal --
// RecipeModal.jsx renders two different instances of this, each with its
// own `steps` array (one for the decide screen, one for the first cook
// step), both launched automatically the very first time their screen is
// ever reached (see RecipeModal's activeTutorial state) and, on that first
// pass, `mandatory` -- no Skip link, the only way through is Next. The
// same tour can also be replayed voluntarily later via the info button
// next to Let's Make It, which passes `mandatory={false}` so Skip shows.
//
// Each step names a CSS selector for the real, already-on-screen element
// it's explaining -- all of one tour's targets live on the same screen, so
// no screen navigation happens mid-tour. A full-screen click-catcher
// blocks interaction with anything underneath while the tour is active,
// and a `box-shadow: 0 0 0 9999px` spotlight ring is drawn around
// whichever element the current step targets, without needing an SVG mask.
function measure(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function RecipeTutorial({ steps, mandatory, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

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

      {/* Solid, fully-opaque panel -- var(--s1)/var(--s2) etc. are all
          translucent white tints meant to sit on top of the app's own
          solid background (see globals.css), NOT to stand alone over
          arbitrary content. Using one here let the ingredients table
          underneath show right through the tooltip, making the text
          unreadable. var(--bg) is the one genuinely solid color the app
          uses (same as the All Steps bottom sheet). */}
      <div
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: TOOLTIP_WIDTH,
          background: 'var(--bg)',
          border: '1px solid rgba(255,193,58,.5)',
          borderRadius: 14,
          padding: 14,
          boxShadow: '0 10px 30px rgba(0,0,0,.6)',
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
            {stepIndex + 1} / {steps.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!mandatory && (
              <div onClick={skip} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', padding: '8px 4px' }}>
                Skip
              </div>
            )}
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
