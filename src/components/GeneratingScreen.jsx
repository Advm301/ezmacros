import quickPrepLogo from '../assets/quickprep-logo-header.png';
import LightningIcon from './LightningIcon';

// Shown right after onboarding finishes (see App.jsx's generatingMeals
// state) while the real work happens behind it -- ranking/filtering
// recipes for the single-meal path, or logging a full day to the Diary
// for the "plan my day" path (see utils/fullDayPlan.js). App.jsx pads
// that work out to a consistent minimum display time so this never
// flashes by too fast to register, regardless of how quick the actual
// work turns out to be.
//
// Rather than a generic progress bar, the "loading" indicator is a bolt
// that visually charges up from empty to full -- a dim, static bolt sits
// underneath as the empty "track", and an identical bright bolt on top
// is revealed from the bottom up via an animated CSS clip-path, like a
// battery filling. Ties the wait itself to the same lightning-bolt motif
// used everywhere else in the app (LightningIcon, the header wordmark,
// the cook-complete flourish) instead of a plain bar that could belong
// to any app. Timing is purely presentational here -- see
// .generating-bolt-fill's animation-duration in globals.css, tuned to
// roughly match App.jsx's own minimum display duration so the bolt reads
// as "full" right around when this screen is swapped out.
export default function GeneratingScreen({ text = "Generating your meals…" }) {
  return (
    <div className="generating-screen">
      <div className="app-bg" aria-hidden="true"></div>
      <img src={quickPrepLogo} alt="QuickPrep" className="generating-logo" />
      <div className="generating-bolt-wrap">
        <div className="generating-bolt-track">
          <LightningIcon size={72} muted id="generating-track" />
        </div>
        <div className="generating-bolt-fill">
          <LightningIcon size={72} id="generating-fill" />
        </div>
      </div>
      <div className="generating-text">{text}</div>
    </div>
  );
}
