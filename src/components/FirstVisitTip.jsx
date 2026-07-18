import { useState } from 'react';
import LightningIcon from './LightningIcon';

// Bold, self-contained "here's what this tab does" banner, shown until
// deliberately dismissed the very first time someone opens a given tab
// (see Kitchen.jsx, Browse.jsx, Saved.jsx). Gated by its own localStorage
// flag (storageKey) rather than the main onboarding gate in App.jsx (see
// components/Onboarding.jsx) -- these are a separate, per-tab concern, so
// this still shows on someone's first real visit even if they skipped
// onboarding entirely, and each tab tracks its own "have I seen this"
// state independently.
//
// Important: the localStorage flag is only written when the tip is
// actually dismissed (the onClick below), never just because it rendered.
// Kitchen/Browse/Saved all fully unmount on every tab switch (see
// App.jsx's tab === "..." conditional renders), so this component remounts
// fresh each time its tab is revisited -- if the flag were set as soon as
// the tip *appeared* (what an earlier version did), switching away before
// tapping it would still mark it "seen" and it would never show again,
// even though nobody actually dismissed it. Reading the flag on mount but
// only writing it on dismiss is what makes it genuinely persist across
// tab switches until someone taps it away.
export default function FirstVisitTip({ storageKey, children }) {
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

  if (!show) return null;

  return (
    <div className="first-visit-tip" onClick={dismiss}>
      <LightningIcon size={22} id="first-visit-tip" />
      <div className="first-visit-tip-body">
        <span className="first-visit-tip-text">{children}</span>
        <span className="first-visit-tip-hint">Tap to dismiss</span>
      </div>
      <div className="first-visit-tip-close">✕</div>
    </div>
  );
}
