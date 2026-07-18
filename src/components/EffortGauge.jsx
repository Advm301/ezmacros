import LightningIcon from './LightningIcon';
import { getEffortLevel } from '../utils/effortLevel';

// "Quick Prep Gauge" -- 1 to 3 lightning bolts showing how this recipe's
// effort compares to the rest of the app (see utils/effortLevel.js for how
// the tier is actually computed). Everything in this app is already quick,
// so this is relative, not a warning label -- it's meant to help someone
// spot the absolute quickest grab-and-go options versus ones that ask a
// touch more of them, not to flag any recipe as "hard."
export default function EffortGauge({ recipe, size = 12, showLabel = false }) {
  const level = getEffortLevel(recipe);
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
      title={`${level.label} (Quick Prep gauge)`}
    >
      {[1, 2, 3].map((i) => (
        <LightningIcon key={i} id={`gauge-${recipe.id}-${i}`} size={size} muted={i > level.bolts} />
      ))}
      {showLabel && (
        <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 3 }}>{level.label}</span>
      )}
    </span>
  );
}
