import { useState } from 'react';

// Backs the once-per-tab info banner (see components/FirstVisitTip.jsx)
// shown the first time someone opens Kitchen, Browse, or the Diary --
// each tab calls this with its own storageKey so they're tracked
// independently of each other and of the main onboarding gate in App.jsx.
//
// Returns `show` (whether the banner should currently render), `dismiss`
// (tapped the banner away -- writes the "seen it" flag so it won't
// auto-show again) and `reopen` (the page's own small info-icon button
// calls this to bring the tip back up on demand, without touching the
// localStorage flag -- so dismissing it again afterward doesn't change
// anything about whether it would've auto-shown next time regardless).
//
// The localStorage flag is only ever written by `dismiss`, never just
// because the tip rendered -- Kitchen/Browse/Saved all fully unmount on
// every tab switch (see App.jsx's tab === "..." conditional renders), so
// writing the flag on mount would mark a tip "seen" the moment it first
// appeared, even if someone switched away before ever tapping it.
export default function useFirstVisitTip(storageKey) {
  const [show, setShow] = useState(() => {
    try {
      return localStorage.getItem(storageKey) !== '1';
    } catch {
      return false; // storage unavailable -- err toward not nagging every visit
    }
  });

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(storageKey, '1');
    } catch {
      // Storage being unavailable just means this may show again next
      // visit -- not worth blocking on.
    }
  };

  const reopen = () => setShow(true);

  return { show, dismiss, reopen };
}
