import { useState } from 'react';
import { hapticSelection, hapticLight } from '../utils/haptics';
import { formatDateString, todayString } from '../hooks/useDiary';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Local-time month/day arithmetic throughout (no UTC conversion) -- entry
// dates are plain 'YYYY-MM-DD' strings keyed to whatever day it was for the
// person when they logged it, so this has to build/compare dates the same
// local way Saved.jsx's own shiftDateString/displayDate already do.
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d, delta) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

// Builds a flat 6x7 grid of cells for the given month, padded with the
// trailing days of the previous month and leading days of the next month so
// every week row is always full -- the standard calendar-grid layout trick.
function buildMonthGrid(monthStart) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    const date = new Date(year, month, 1 - (firstWeekday - i));
    cells.push({ date, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }
  return cells;
}

// Full month-grid calendar for the Diary tab -- replaces the native
// input[type=date] picker specifically because native date pickers (iOS's
// spinning wheel included) give no way to mark which dates already have
// something logged. Dates with at least one diary entry get a small dot
// underneath the day number so someone can actually see, at a glance,
// which days they've already filled in and jump back to any of them --
// the whole point of the feature request this was built for.
export default function DiaryCalendarModal({ selectedDate, entryDates, onSelectDate, onClose }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return startOfMonth(d);
  });

  const today = todayString();
  const cells = buildMonthGrid(viewMonth);
  const monthLabel = viewMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const goMonth = (delta) => {
    hapticSelection();
    setViewMonth((m) => addMonths(m, delta));
  };

  const pickDay = (date) => {
    hapticLight();
    onSelectDate(formatDateString(date));
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', padding: '18px 18px 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div
            onClick={() => goMonth(-1)}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cream)', fontSize: 15 }}
          >
            ‹
          </div>
          <div className="h1" style={{ marginBottom: 0, fontSize: 16 }}>{monthLabel}</div>
          <div
            onClick={() => goMonth(1)}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cream)', fontSize: 15 }}
          >
            ›
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
          {WEEKDAY_LABELS.map((w, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)', padding: '4px 0' }}>
              {w}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4 }}>
          {cells.map(({ date, inMonth }, i) => {
            const dateStr = formatDateString(date);
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const hasEntries = entryDates.has(dateStr);
            return (
              <div
                key={i}
                onClick={() => pickDay(date)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  padding: '6px 0',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: isSelected ? 800 : 600,
                    background: isSelected ? 'var(--lime)' : 'transparent',
                    color: isSelected ? '#000' : inMonth ? 'var(--cream)' : 'var(--muted)',
                    border: isToday && !isSelected ? '1.5px solid var(--lime)' : '1.5px solid transparent',
                    opacity: inMonth ? 1 : 0.4,
                  }}
                >
                  {date.getDate()}
                </div>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: hasEntries ? (isSelected ? 'var(--lime)' : 'var(--gold)') : 'transparent',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)' }} />
          Days with something logged
        </div>
      </div>
    </div>
  );
}
