import { formatDateString } from '../hooks/useDiary';

// A day counts toward the logging streak only if it has at least one diary
// entry that was *created* on that same calendar day as its entry_date.
// This is deliberate: if someone opens the date picker and adds an entry
// for a past day they missed, that's a backfill, not a same-day log, so it
// must not retroactively extend the streak for that day. The same check
// also means planning ahead for a future date doesn't count until that
// day actually arrives and something gets logged on it.
function getCountedDates(entries) {
  const counted = new Set();
  for (const e of entries || []) {
    if (!e.created_at || !e.entry_date) continue;
    const createdDateStr = formatDateString(new Date(e.created_at));
    if (createdDateStr === e.entry_date) {
      counted.add(e.entry_date);
    }
  }
  return counted;
}

// Walks backward from today counting consecutive counted days. If today
// hasn't been logged yet, that's not a broken streak -- the day just isn't
// over -- so the walk starts from yesterday instead. The first gap (a day
// with no same-day entry) stops the count.
export function computeLoggingStreak(entries) {
  const countedDates = getCountedDates(entries);

  const cursor = new Date();
  const todayStr = formatDateString(cursor);
  if (!countedDates.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (countedDates.has(formatDateString(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
