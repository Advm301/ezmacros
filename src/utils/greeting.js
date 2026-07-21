// Header greeting -- dry, a little self-deprecating, never chipper. Picks a
// line based on time of day and whether *that specific meal* is already
// logged in today's Diary (morning checks breakfast, midday checks lunch,
// evening checks dinner) -- not just "is anything planned today," so the
// "still haven't figured out lunch" line only shows when lunch specifically
// is still unplanned.
//
// Important: the per-slot "planned" messages only ever claim that ONE meal
// is handled -- they must never say the whole day is "sorted," since only
// one of three meals is confirmed at that point. A separate full-day tier
// (FULL_DAY_PLANNED) is the only place "today's sorted" is allowed, and it
// only fires once breakfast, lunch, AND dinner are all logged.

const MORNING_EMPTY = [
  "Morning. Breakfast isn't going to make itself, unfortunately.",
  "Morning. Something's got to happen about food.",
  "No breakfast plan yet. The day marches on regardless.",
  "Still haven't figured out breakfast? No judgment.",
  "Breakfast: still theoretical.",
  "The kitchen's not going to walk itself to you.",
];

const MORNING_PLANNED = [
  "Morning. You're ahead of it for once.",
  "Breakfast's handled. Look at you.",
  "Breakfast's done. The rest of the day's still up for grabs.",
  "One meal down before most people are even up.",
  "Breakfast's locked in. Not bad for this early.",
  "You beat the day to it. Rare.",
];

const MIDDAY_EMPTY = [
  "Still haven't figured out lunch? No judgment.",
  "Nothing planned yet. Business as usual.",
  "Lunch remains a mystery. As does most of life.",
  "No lunch plan. The clock's not going to wait.",
  "Lunch is still a rumor at this point.",
  "The hunger's real. The plan is not.",
];

const MIDDAY_PLANNED = [
  "Lunch is handled. Look at that.",
  "Lunch: taken care of. You're welcome, past you.",
  "One meal down. Two to go, no rush.",
  "Lunch's sorted. Dinner's still anyone's guess.",
  "Lunch: figured out. Go you.",
  "That's lunch sorted. Dinner can wait its turn.",
];

const EVENING_EMPTY = [
  "Dinner's not going to make itself, unfortunately.",
  "Still no dinner plan. Let's fix that.",
  "No dinner plan yet. Hunger is not known for its patience.",
  "Dinner remains unsolved. Ball's in your court.",
  "Dinner's still a blank page.",
  "The evening's here. The plan isn't.",
];

const EVENING_PLANNED = [
  "Tonight's covered. Go relax.",
  "Dinner's sorted. You're welcome, past you.",
  "Tonight's handled. Rare, but nice.",
  "Dinner's taken care of. Go do something else.",
  "Dinner's locked in. Nicely done.",
  "Tonight's figured out. Everyone else is still guessing.",
];

// Only shown when breakfast, lunch, and dinner are ALL logged for today --
// this is the one tier allowed to claim the whole day is sorted.
const FULL_DAY_PLANNED = [
  "Today's sorted. Carry on with your day.",
  "All three meals logged. Show-off.",
  "Full day planned. Look at you, functioning like an adult.",
  "Breakfast, lunch, dinner -- all handled. Rare, but nice.",
  "Every meal's spoken for. Impressive, honestly.",
  "Breakfast, lunch, dinner -- a clean sweep.",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// filledSlots: array of meal_slot strings already logged for today (e.g.
// ['lunch', 'dinner']). Each time bucket only cares about its own slot --
// a filled dinner doesn't make the midday message claim lunch is handled --
// except when all three main meals are filled, which gets its own tier.
export function getGreeting(filledSlots = [], hour = new Date().getHours()) {
  const has = (slot) => filledSlots.includes(slot);

  if (has('breakfast') && has('lunch') && has('dinner')) {
    return pick(FULL_DAY_PLANNED);
  }

  if (hour < 11) return pick(has('breakfast') ? MORNING_PLANNED : MORNING_EMPTY);
  if (hour < 17) return pick(has('lunch') ? MIDDAY_PLANNED : MIDDAY_EMPTY);
  return pick(has('dinner') ? EVENING_PLANNED : EVENING_EMPTY);
}
