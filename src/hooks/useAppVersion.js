import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { supabase } from '../lib/supabase';

// Reads this device's actual installed build number via @capacitor/app's
// App.getInfo(), which reflects the native CFBundleVersion /
// CFBundleShortVersionString at runtime -- deliberately not the JS-bundle-
// baked APP_VERSION git SHA (see config.js), since the web build happens
// BEFORE Codemagic's agvtool increments the real build number
// (codemagic.yaml runs "Build web app and sync Capacitor iOS project"
// first, then "Increment build number" after), so the JS bundle never
// actually knows the final number. Reading it natively at runtime is the
// only way to get the true installed value.
//
// Compared against `app_config.latest_build_number` in Supabase -- a
// public, non-sensitive singleton row that Codemagic's publish step bumps
// (via the bump_app_version RPC, see the app_config migration) right
// after a build actually goes out to TestFlight. If this device's build is
// behind that number, `updateAvailable` flips true so the app can show a
// banner.
//
// Web/dev builds have no native build info and no real "TestFlight" to be
// behind on, so this just resolves to isNative: false with nothing to
// check.
export default function useAppVersion() {
  const [info, setInfo] = useState({
    loading: true,
    isNative: Capacitor.isNativePlatform(),
    version: null,
    build: null,
    latestBuild: null,
    latestVersion: null,
    updateAvailable: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!Capacitor.isNativePlatform()) {
        if (!cancelled) setInfo((prev) => ({ ...prev, loading: false }));
        return;
      }
      try {
        const [appInfo, configResult] = await Promise.all([
          App.getInfo(),
          supabase.from('app_config').select('latest_build_number, latest_version').eq('id', 1).single(),
        ]);
        if (cancelled) return;
        const currentBuild = parseInt(appInfo.build, 10);
        const latestBuild = configResult.error ? null : configResult.data?.latest_build_number ?? null;
        setInfo({
          loading: false,
          isNative: true,
          version: appInfo.version,
          build: appInfo.build,
          latestBuild,
          latestVersion: configResult.error ? null : configResult.data?.latest_version ?? null,
          updateAvailable: Boolean(latestBuild && !Number.isNaN(currentBuild) && latestBuild > currentBuild),
        });
      } catch (err) {
        // Network hiccup or the table/RPC not reachable yet -- fails
        // silently into "no update known," never blocks the app or shows
        // a false banner over a failed check.
        console.error('Error checking app version:', err);
        if (!cancelled) setInfo((prev) => ({ ...prev, loading: false }));
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return info;
}
