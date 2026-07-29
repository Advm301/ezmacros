import SparkBurst from './SparkBurst';

// Same purple/pink pair .surprise-btn and RecipeModal's own Surprise Me
// reveal already use everywhere else in the app, so this reads as "the
// same magic," not a new one-off palette just for this moment.
const SURPRISE_COLORS = ['#b388ff', '#ff6baa', '#ffd6ec'];

const SLOT_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
const SLOT_ORDER = ['breakfast', 'lunch', 'dinner'];

// Full-screen takeover for Diary's Surprise Me, in three phases the caller
// (Saved.jsx) drives against the *real* async work -- each meal appears
// exactly when its own diary.addEntry call actually resolves, not on a
// fake fixed timer:
//   'generating' -- nothing picked yet, just the spinner + copy.
//   'revealing'  -- one meal card pops in (with a SparkBurst) each time a
//                   slot finishes, building up to all three.
//   'done'       -- headline flips to the arrival message, tap (or the
//                   caller's own timeout) to continue into the Diary.
// Full-screen, one-time celebration ("tap anywhere to continue" affordance)
// for the Diary's Surprise Me flow.
export default function SurpriseDayOverlay({ phase, meals, onDismiss }) {
  return (
    <div
      className="surprise-day-overlay"
      onClick={phase === 'done' ? onDismiss : undefined}
      role={phase === 'done' ? 'button' : undefined}
      tabIndex={phase === 'done' ? 0 : undefined}
      aria-label={phase === 'done' ? 'Dismiss surprise meals reveal' : undefined}
    >
      <div className="surprise-day-glow" aria-hidden="true" />

      {phase === 'generating' ? (
        <>
          <div className="surprise-day-spinner-ring" aria-hidden="true" />
          <div className="surprise-day-title">Generating meals…</div>
          <div className="surprise-day-sub">Cooking up something for breakfast, lunch, and dinner.</div>
        </>
      ) : (
        <>
          <div className="surprise-day-title">
            {phase === 'done' ? 'Your Surprise Meals Have Arrived!' : 'Generating meals…'}
          </div>
          <div className="surprise-day-meals">
            {SLOT_ORDER.map((slot) => {
              const meal = meals.find((m) => m.slot === slot);
              if (!meal) return null;
              return (
                <div key={meal.entryId || slot} className="surprise-day-meal-pop">
                  <SparkBurst intensity={0.7} colors={SURPRISE_COLORS} />
                  <div className="surprise-day-meal-slot">{SLOT_LABELS[slot]}</div>
                  <div className="surprise-day-meal-name">{meal.recipe.name}</div>
                </div>
              );
            })}
          </div>
          {phase === 'done' && <div className="surprise-day-tap">Tap anywhere to continue</div>}
        </>
      )}
    </div>
  );
}
