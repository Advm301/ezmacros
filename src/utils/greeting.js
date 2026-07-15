// Header greeting -- dry, a little self-deprecating, never chipper. Picks
// a line based on time of day and whether today's Diary already has
// anything planned, so it reads as reactive rather than a canned banner.

const MORNING_EMPTY = [
  "Morning. Breakfast isn't going to make itself, unfortunately.",
  "Morning. Something's got to happen about food.",
];

const MORNING_PLANNED = [
  "Morning. Today's already sorted.",
  "Morning. You're ahead of it for once.",
];

const MIDDAY_EMPTY = [
  "Still haven't figured out lunch? No judgment.",
  "Nothing planned yet. Business as usual.",
];

const MIDDAY_PLANNED = [
  "Today's handled. Look at that.",
  "Meals sorted. Carry on with your day.",
];

const EVENING_EMPTY = [
  "Dinner's not going to make itself, unfortunately.",
  "Still no dinner plan. Let's fix that.",
];

const EVENING_PLANNED = [
  "Tonight's covered. Go relax.",
  "Dinner's sorted. You're welcome, past you.",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getGreeting(hasTodayEntries, hour = new Date().getHours()) {
  if (hour < 11) return pick(hasTodayEntries ? MORNING_PLANNED : MORNING_EMPTY);
  if (hour < 17) return pick(hasTodayEntries ? MIDDAY_PLANNED : MIDDAY_EMPTY);
  return pick(hasTodayEntries ? EVENING_PLANNED : EVENING_EMPTY);
}
