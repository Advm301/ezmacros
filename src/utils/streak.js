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

// Event-driven check for "is the streak-start celebration about to fire":
// given the entries already known BEFORE a proposed add, and the date that
// new entry would be logged under, simulates the add (a synthetic entry
// created right now, dated entryDate) and reports whether THAT specific
// addition is what would take the streak from 0 to 1.
//
// This is deliberately NOT a passive "watch the computed streak number and
// react when it changes" effect -- that approach fires on any reason the
// number changes, including ones that have nothing to do with a real new
// streak: diary_entries reloading after a cold app relaunch (entries
// starts empty while the fetch is in flight, so the streak briefly reads
// 0 before jumping to its real value the instant real data arrives) or a
// sign-out/sign-in cycle (entries clears to [] on sign-out, then repopulates
// on the next sign-in) both look identical to "a fresh streak just
// started" if you're only diffing the streak number. Tying the check
// directly to the moment of an actual, known-fresh add sidesteps all of
// that -- call this right before diary.addEntry, using whatever `entries`
// snapshot is already in hand, and it can't be fooled by a reload.
export function wouldStartNewStreak(entries, entryDate) {
  if (computeLoggingStreak(entries) > 0) return false;
  const simulated = [...(entries || []), { entry_date: entryDate, created_at: new Date().toISOString() }];
  return computeLoggingStreak(simulated) === 1;
}
