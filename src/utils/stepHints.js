// Small heuristics that make the cook wizard feel like it's read ahead.

const OVEN_ACTION_RE = /\b(bake|baking|roast|roasting|broil|broiling|air fry|air frying)\b[^.]{0,60}?(\d{2,3})\s*°?\s*F\b/i;
const PREHEAT_RE = /\bpreheat/i;

// If some later instruction bakes/roasts/broils/air-fries at a set
// temperature and nothing earlier in the recipe already mentions
// preheating, returns a heads-up string to show as early as possible
// (step 1) -- otherwise null. This targets one specific, reliably
// detectable gap (a fixed pattern: verb + temperature with no earlier
// "preheat") rather than trying to infer every kind of advance-prep need
// from inconsistent free text.
export function detectPreheatTip(instructions) {
  if (!instructions || instructions.length === 0) return null;
  for (let i = 0; i < instructions.length; i++) {
    const match = instructions[i].match(OVEN_ACTION_RE);
    if (!match) continue;
    const alreadyMentionsPreheat = instructions.slice(0, i + 1).some((t) => PREHEAT_RE.test(t));
    if (alreadyMentionsPreheat) return null;
    const temp = match[2];
    const appliance = /air fry/i.test(match[1]) ? 'air fryer' : 'oven';
    return `Before you start: preheat your ${appliance} to ${temp}°F now, so it's ready by the time you need it.`;
  }
  return null;
}

// A short, always-literal preview of the next instruction -- just the
// first sentence, trimmed to ~10 words. No attempt to rephrase or
// summarize (that's what the recipe-level stepsSummary heuristic is for);
// this just gives a quick look at what's coming without risk of
// mischaracterizing it.
export function previewNextStep(instructions, currentIndex) {
  const next = instructions[currentIndex + 1];
  if (!next) return null;
  const firstSentence = next.split(/\.\s+/)[0].trim();
  const words = firstSentence.split(/\s+/);
  if (words.length <= 10) return firstSentence.replace(/\.$/, '');
  return `${words.slice(0, 10).join(' ')}…`;
}
