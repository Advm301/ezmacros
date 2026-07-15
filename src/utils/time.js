// Shared time-formatting helper for recipe cards/modal. activeTime is
// hands-on time; totalTime includes passive time (baking, air frying, slow
// cooking). When they're equal (most stovetop/skillet/no-cook/microwave
// recipes), just show one number instead of a redundant "X active - X total".
function formatMinutes(mins) {
  if (mins < 60) return `${mins} min`;
  const hrs = mins / 60;
  const rounded = Math.round(hrs * 10) / 10;
  return `${rounded % 1 === 0 ? rounded : rounded.toFixed(1)} hr`;
}

export function formatTime(activeTime, totalTime) {
  if (!activeTime) return '';
  if (!totalTime || totalTime === activeTime) {
    return `${activeTime} min`;
  }
  return `${activeTime} min active · ${formatMinutes(totalTime)} total`;
}
