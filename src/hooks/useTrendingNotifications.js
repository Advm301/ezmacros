import { useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const STORAGE_KEY = 'quickprep_trending_notifications_enabled';
// Arbitrary stable id -- re-scheduling with the same id replaces the
// existing notification instead of stacking a second one, so toggling
// on/off/on repeatedly can't end up with duplicates firing.
const NOTIFICATION_ID = 9001;

// Local (on-device) notifications only -- no push server, no APNs
// entitlement, nothing to add to Codemagic. Schedules a single repeating
// weekly notification (Monday, 10am local time) pointing back at whatever
// recipes currently carry recipes.js's `isTrending` flag (see that field's
// doc comment) -- a lightweight nudge to open the app and see this week's
// picks, not a data channel, so there's nothing to keep in sync server-side
// as the Trending rotation changes week to week.
//
// iOS only lets an app ask for notification permission once per install
// (a denial can only be reversed from Settings, not re-prompted), so this
// is opt-in via a toggle in the account menu rather than requested
// automatically on launch -- asking only when someone has actually chosen
// "yes, remind me" gives a real permission dialog its best shot.
export default function useTrendingNotifications() {
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
    if (!isNative) return; // nothing to schedule outside the native app
    setLoading(true);
    try {
      let actual = false;
      if (turnOn) {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [{
              id: NOTIFICATION_ID,
              title: "This week's Trending recipes are up",
              body: "New Trending picks just landed in QuickPrep -- come take a look.",
              schedule: { on: { weekday: 2, hour: 10, minute: 0 }, allowWhileIdle: true },
            }],
          });
          actual = true;
        }
        // Permission denied: leave actual = false, toggle snaps back off.
      } else {
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
        actual = false;
      }
      setEnabledState(actual);
      try { localStorage.setItem(STORAGE_KEY, String(actual)); } catch { /* ignore */ }
    } catch (err) {
      console.error('Error updating trending notification schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [isNative]);

  return { enabled, setEnabled, loading, isNative };
}
