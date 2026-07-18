import { useEffect, useState } from 'react';

// Small, self-contained "here's what this tab does" banner, shown
// exactly once per device/browser the very first time someone opens a
// given tab (see Kitchen.jsx and Browse.jsx). Gated by its own
// localStorage flag (storageKey) rather than the main onboarding gate in
// App.jsx (see components/Onboarding.jsx) -- these are a separate,
// per-tab concern, so this still shows on someone's first real visit to
// Kitchen/Browse even if they skipped onboarding entirely, and each tab
// tracks its own "have I seen this" state independently.
//
// Auto-dismisses after a few seconds -- no fade-out animation, just a
// plain disappear, matching App.jsx's own toast (setToast/setTimeout)
// rather than inventing a second dismissal style for one-off UI text.
const AUTO_DISMISS_MS = 6000;

export default function FirstVisitTip({ storageKey, children }) {
  const [show, setShow] = useState(() => {
    try {
      if (localStorage.getItem(storageKey) === '1') return false;
      localStorage.setItem(storageKey, '1');
      return true;
    } catch {
      return false; // storage unavailable -- err toward not nagging every visit
    }
  });

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className="first-visit-tip">
      <span className="first-visit-tip-text">{children}</span>
      <div className="first-visit-tip-close" onClick={() => setShow(false)}>✕</div>
    </div>
  );
}
