import { useState } from 'react';
import { QUICK_PICKS } from '../data/pantryStaples.js';
import { ONBOARDING_GOALS, SERVING_PREFS, MEAL_TYPES, MEAL_TYPE_SURPRISE } from '../utils/onboardingGoals';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
import LightningIcon from './LightningIcon';
import OnboardingFinishSparkles from './OnboardingFinishSparkles';

// Per-card entrance stagger for a screen's choice list -- a fixed base
// delay (long enough for the icon/header/subtext's own fade-in sequence,
// see .onboarding-fade-1/2/3 in globals.css, to mostly clear first) plus
// a small per-index increment so cards visibly cascade in one after
// another instead of all popping in at once.
const CARD_BASE_DELAY = 0.36;
const CARD_STEP_DELAY = 0.08;
function cardDelay(i) {
  return `${(CARD_BASE_DELAY + i * CARD_STEP_DELAY).toFixed(2)}s`;
}

// mealType only applies to the "one meal" path -- a "full_day" plan
// already covers breakfast, lunch, and dinner by definition, so asking
// which one it is would be a pointless extra tap on that path. This is
// why STEPS is computed from mealCountPref below rather than being a
// fixed list.
const STEPS_ONE = ['goal', 'servings', 'mealCount', 'mealType', 'proteins'];
const STEPS_FULL_DAY = ['goal', 'servings', 'mealCount', 'proteins'];

// The "how many meals do you want lined up" question -- its own screen
// since it's not a recipe-ranking preference like goal/servingsPref (see
// utils/onboardingGoals.js), it's a decision about what onboarding itself
// produces: one recommended search (the existing behavior, handed to
// Kitchen as initialPicks) versus a whole day logged straight to the
// Diary (see utils/fullDayPlan.js + App.jsx's handleOnboardingComplete).
const MEAL_COUNT_OPTIONS = [
  { id: 'one', label: 'Just One Meal', description: 'Get one great recipe to start with' },
  { id: 'full_day', label: 'A Full Day', description: "Breakfast, lunch & dinner, planned and added to your Diary" },
];

// Five-screen (four on the "full day" path), skippable flow shown once,
// right after a brand-new sign-in -- see App.jsx, which gates this
// behind a localStorage flag so it never shows again after the first
// pass (or after Skip). Replaces dropping someone straight onto an empty
// Kitchen tab with a handful of ~5-second taps that (a) set expectations
// for what this app actually does and (b) collect just enough signal --
// what matters most, how meals should be sized, how many meals to plan,
// what kind of meal (when on the single-meal path), and a few proteins
// you actually have -- to hand off a real, personalized result the
// instant this finishes, instead of making a first-time visitor do that
// work themselves before seeing any payoff. `onComplete` is called with
// either `{ staples, goal, servingsPref, mealCountPref, mealType }` or
// `null` (full skip) -- see App.jsx for how that feeds into either
// Kitchen's initialPicks prop or a full day logged directly to the
// Diary.
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('goal');
  const [goal, setGoal] = useState(null);
  const [servingsPref, setServingsPref] = useState(null);
  const [mealCountPref, setMealCountPref] = useState(null);
  // undefined (not null!) means "not answered yet" -- null is reserved for
  // an explicit "Surprise Me / doesn't matter" pick (see MEAL_TYPE_SURPRISE
  // in utils/onboardingGoals.js), so the two states stay distinguishable
  // for highlighting which card is active; matchesMealType downstream
  // treats both the same way (no preference), so this distinction only
  // matters here in the UI, not to any ranking logic.
  const [mealType, setMealType] = useState(undefined);
  const [proteins, setProteins] = useState([]);

  // Defaults to the longer, 5-step list before mealCount is answered --
  // once someone picks "full_day" the mealType dot simply drops out,
  // which reads as the progress bar naturally shortening rather than
  // anything broken.
  const steps = mealCountPref === 'full_day' ? STEPS_FULL_DAY : STEPS_ONE;
  const stepIndex = steps.indexOf(step);

  // Single-select screens auto-advance on tap -- each is a single,
  // single-purpose question, so a separate "Next" button would just be
  // one more tap for no benefit.
  const chooseGoal = (id) => {
    hapticSelection();
    setGoal(id);
    setStep('servings');
  };

  const chooseServingsPref = (id) => {
    hapticSelection();
    setServingsPref(id);
    setStep('mealCount');
  };

  const chooseMealCount = (id) => {
    hapticSelection();
    setMealCountPref(id);
    setStep(id === 'full_day' ? 'proteins' : 'mealType');
  };

  const chooseMealType = (id) => {
    hapticSelection();
    setMealType(id);
    setStep('proteins');
  };

  // Lets someone revisit and change an earlier answer -- every screen
  // auto-advances forward on tap (see the choose* handlers above), so
  // without this the flow would be entirely one-way. Steps back within
  // whichever list is currently active (see `steps` above), which is
  // exactly right even on the "full day" path where `mealType` isn't
  // part of the sequence at all.
  const goBack = () => {
    hapticLight();
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const toggleProtein = (id) => {
    hapticSelection();
    setProteins((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const finish = () => {
    hapticMedium();
    onComplete({ staples: proteins, goal, servingsPref, mealCountPref, mealType });
  };

  const skipAll = () => {
    hapticLight();
    onComplete(null);
  };

  const finishLabel = mealCountPref === 'full_day'
    ? 'Plan My Day'
    : (proteins.length > 0 ? 'Show Me Recipes' : "I'll Add These Later");

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
      <div className="app-bg" aria-hidden="true"></div>
      <div style={{ maxWidth: 430, width: '100%', maxHeight: '100%' }}>
        {/* Step dots -- just enough progress signal to make a handful of
            quick screens feel like a short flow rather than an open-ended
            form. */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
          {steps.map((s, i) => (
            <div
              key={s}
              style={{ width: 22, height: 4, borderRadius: 100, background: i <= stepIndex ? 'var(--blue)' : 'var(--s2)' }}
            />
          ))}
        </div>

        {/* Revisit-and-edit escape hatch -- every screen but the very
            first (nothing to go back to from "goal"). See goBack above. */}
        {stepIndex > 0 && (
          <div className="onboarding-back" onClick={goBack}>‹ Back</div>
        )}

        {/* key={step} forces a full remount of everything below on every
            step change (even between two screens that happen to share the
            same DOM shape) -- without it, React would just patch the
            existing elements in place and none of the fade-in animations
            below would ever replay past the very first screen. */}
        <div key={step}>
          {step === 'goal' && (
            <>
              <div className="onboarding-fade-1" style={{ textAlign: 'center', marginBottom: 6 }}>
                <LightningIcon size={40} id="onboarding-goal" />
              </div>
              <div className="onboarding-h1 onboarding-fade-2" style={{ textAlign: 'center' }}>What are you after?</div>
              <div className="onboarding-sub onboarding-fade-3" style={{ textAlign: 'center', marginBottom: 22 }}>
                Tell us what you've got, we'll tell you what to make -- no more staring into the fridge.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ONBOARDING_GOALS.map((g, i) => (
                  <div
                    key={g.id}
                    onClick={() => chooseGoal(g.id)}
                    className={`onboarding-card onboarding-card-enter${goal === g.id ? ' onboarding-card-active' : ''}`}
                    style={{ animationDelay: cardDelay(i) }}
                  >
                    <div className="onboarding-card-title">{g.label}</div>
                    <div className="onboarding-card-desc">{g.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 'servings' && (
            <>
              <div className="onboarding-h1 onboarding-fade-1" style={{ textAlign: 'center' }}>How do you want your meals sized?</div>
              <div className="onboarding-sub onboarding-fade-2" style={{ textAlign: 'center', marginBottom: 22 }}>
                This just changes portion sizing -- you can mix and match either way later.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SERVING_PREFS.map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => chooseServingsPref(s.id)}
                    className={`onboarding-card onboarding-card-enter${servingsPref === s.id ? ' onboarding-card-active' : ''}`}
                    style={{ animationDelay: cardDelay(i) }}
                  >
                    <div className="onboarding-card-title">{s.label}</div>
                    <div className="onboarding-card-desc">{s.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 'mealCount' && (
            <>
              <div className="onboarding-h1 onboarding-fade-1" style={{ textAlign: 'center' }}>How many meals should we line up?</div>
              <div className="onboarding-sub onboarding-fade-2" style={{ textAlign: 'center', marginBottom: 22 }}>
                A full day goes straight into your Diary, ready to cook through.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MEAL_COUNT_OPTIONS.map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => chooseMealCount(m.id)}
                    className={`onboarding-card onboarding-card-enter${mealCountPref === m.id ? ' onboarding-card-active' : ''}`}
                    style={{ animationDelay: cardDelay(i) }}
                  >
                    <div className="onboarding-card-title">{m.label}</div>
                    <div className="onboarding-card-desc">{m.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 'mealType' && (
            <>
              <div className="onboarding-h1 onboarding-fade-1" style={{ textAlign: 'center' }}>What kind of meal?</div>
              <div className="onboarding-sub onboarding-fade-2" style={{ textAlign: 'center', marginBottom: 22 }}>
                Just for this one -- doesn't limit what you can search for later.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MEAL_TYPES.map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => chooseMealType(m.id)}
                    className={`onboarding-card onboarding-card-enter${mealType === m.id ? ' onboarding-card-active' : ''}`}
                    style={{ animationDelay: cardDelay(i) }}
                  >
                    <div className="onboarding-card-title">{m.label}</div>
                    <div className="onboarding-card-desc">{m.description}</div>
                  </div>
                ))}
                {/* Surprise Me sits one beat after the real meal types
                    (see cardDelay(MEAL_TYPES.length)) and its own purple
                    tint (see .onboarding-card-surprise) so it visually
                    reads as "no strong opinion" rather than a fourth,
                    equally-weighted meal type. */}
                <div
                  onClick={() => chooseMealType(MEAL_TYPE_SURPRISE.id)}
                  className={`onboarding-card onboarding-card-enter onboarding-card-surprise${mealType === MEAL_TYPE_SURPRISE.id ? ' onboarding-card-active' : ''}`}
                  style={{ animationDelay: cardDelay(MEAL_TYPES.length) }}
                >
                  <div className="onboarding-card-title">✦ {MEAL_TYPE_SURPRISE.label}</div>
                  <div className="onboarding-card-desc">{MEAL_TYPE_SURPRISE.description}</div>
                </div>
              </div>
            </>
          )}

          {step === 'proteins' && (
            <>
              <div className="onboarding-h1 onboarding-fade-1" style={{ textAlign: 'center' }}>What do you usually have?</div>
              <div className="onboarding-sub onboarding-fade-2" style={{ textAlign: 'center', marginBottom: 18 }}>
                Pick a few -- we'll find recipes that use them right away. You can always add more later.
              </div>
              <div className="onboarding-fade-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 26 }}>
                {QUICK_PICKS.map((s) => (
                  <div
                    key={s.id}
                    className={`pill ${proteins.includes(s.id) ? 'active' : ''}`}
                    onClick={() => toggleProtein(s.id)}
                  >
                    {proteins.includes(s.id) ? `✓ ${s.label}` : s.label}
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <button className="gen-kitchen-btn onboarding-finish-btn" style={{ marginBottom: 12 }} onClick={finish}>
                  {finishLabel}
                </button>
                <OnboardingFinishSparkles />
              </div>
            </>
          )}
        </div>

        <div
          onClick={skipAll}
          style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', marginTop: 4 }}
        >
          Skip for now
        </div>
      </div>
    </div>
  );
}
