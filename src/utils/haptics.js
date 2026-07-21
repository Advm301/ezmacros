import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Fires native haptic feedback when this build is running inside the
// Capacitor iOS app. In the plain web/PWA build there's no native bridge,
// so calls either no-op or reject depending on the browser -- wrapped in
// try/catch so a missing haptics engine never breaks the actual click.
async function safeHaptic(fn) {
  try {
    await fn();
  } catch {
    // no native haptics engine available -- ignore
  }
}

// Light tap -- filter pills, nav, opening/closing things.
export function hapticLight() {
  return safeHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
}

// Slightly stronger tap -- primary actions (Find Recipes, Surprise Me).
export function hapticMedium() {
  return safeHaptic(() => Haptics.impact({ style: ImpactStyle.Medium }));
}

// Strongest impact -- reserved for the last of the three lightning strikes
// on the recipe-complete celebration (see RecipeModal's goNextCookPage),
// so the sequence visibly/physically escalates rather than repeating the
// same tap three times.
export function hapticHeavy() {
  return safeHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy }));
}

// iOS's "selection changed" tick -- toggles and picks within a group
// (pantry staples, star/save).
export function hapticSelection() {
  return safeHaptic(() => Haptics.selectionChanged());
}

// Positive confirmation -- rating submitted, recipe added to Diary.
export function hapticSuccess() {
  return safeHaptic(() => Haptics.notification({ type: NotificationType.Success }));
}
