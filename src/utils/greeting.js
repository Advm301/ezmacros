// Header greeting -- dry, a little self-deprecating, never chipper. Picks a
// line based on time of day and whether *that specific meal* is already
// logged in today's Diary (morning checks breakfast, midday checks lunch,
// evening checks dinner) -- not just "is anything planned today," so the
// "still haven't figured out lunch" line only shows when lunch specifically
// is still unplanned.

const MORNING_EMPTY = [
  "Morning. Breakfast isn't going to make itself, unfortunately.",
  "Morning. Something's got to happen about food.",
  "No breakfast plan yet. The day marches on regardless.",
  "Still haven't figured out breakfast? No judgment.",
];

const MORNING_PLANNED = [
  "Morning. Today's already sorted.",
  "Morning. You're ahead of it for once.",
  "Breakfast's handled. Look at you.",
  "Already sorted. Rare, but nice.",
];

const MIDDAY_EMPTY = [
  "Still haven't figured out lunch? No judgment.",
  "Nothing planned yet. Business as usual.",
  "Lunch remains a mystery. As does most of life.",
  "No lunch plan. The clock's not going to wait.",
];

const MIDDAY_PLANNED = [
  "Lunch is handled. Look at that.",
  "Today's sorted. Carry on with your day.",
  "Lunch: taken care of. You're welcome, past you.",
  "Already figured out. Unusually organized of you.",
];

const EVENING_EMPTY = [
  "Dinner's not going to make itself, unfortunately.",
  "Still no dinner plan. Let's fix that.",
  "No dinner plan yet. Hunger is not known for its patience.",
  "Dinner remains unsolved. Ball's in your court.",
];

const EVENING_PLANNED = [
  "Tonight's covered. Go relax.",
  "Dinner's sorted. You're welcome, past you.",
  "Tonight's handled. Rare, but nice.",
  "Dinner's taken care of. Go do something else.",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// filledSlots: array of meal_slot strings already logged for today (e.g.
// ['lunch', 'dinner']). Each time bucket only cares about its own slot --
// a filled dinner doesn't make the midday message claim lunch is handled.
export function getGreeting(filledSlots = [], hour = new Date().getHours()) {
  const has = (slot) => filledSlots.includes(slot);
  if (hour < 11) return pick(has('breakfast') ? MORNING_PLANNED : MORNING_EMPTY);
  if (hour < 17) return pick(has('lunch') ? MIDDAY_PLANNED : MIDDAY_EMPTY);
  return pick(has('dinner') ? EVENING_PLANNED : EVENING_EMPTY);
}
