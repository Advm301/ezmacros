import { useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const STORAGE_KEY = 'quickprep_sunday_prep_notifications_enabled';
// Own id, distinct from Trending Alerts' 9001 (see useTrendingNotifications.js)
// -- re-scheduling with the same id replaces rather than stacks.
const NOTIFICATION_ID = 9002;

// Same local (on-device), opt-in-only pattern as useTrendingNotifications.js
// -- see that file's comment for why permission is only requested on an
// explicit toggle-on, never automatically. This one fires Sunday morning
// (weekday: 1 in Capacitor's native 1-indexed-from-Sunday convention, vs.
// Trending's weekday: 2 for Monday) as a nudge to open Diary and pick/adjust
// this week's Sunday Prep batch-cook recipe before the week gets away.
export default function useSundayPrepNotifications() {
  const [enabled, setEnabledState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const setEnabled = useCallback(async (turnOn) => {
    if (!isNative) return;
    setLoading(true);
    try {
      let actual = false;
      if (turnOn) {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [{
              id: NOTIFICATION_ID,
              title: 'Time for Sunday Prep',
              body: "Pick (or swap) this week's batch-cook recipe in QuickPrep and get ahead of the week.",
              schedule: { on: { weekday: 1, hour: 9, minute: 0 }, allowWhileIdle: true },
            }],
          });
          actual = true;
        }
      } else {
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
        actual = false;
      }
      setEnabledState(actual);
      try { localStorage.setItem(STORAGE_KEY, String(actual)); } catch { /* ignore */ }
    } catch (err) {
      console.error('Error updating Sunday Prep notification schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [isNative]);

  return { enabled, setEnabled, loading, isNative };
}
