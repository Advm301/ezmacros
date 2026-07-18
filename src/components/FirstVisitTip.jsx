import { useState } from 'react';
import LightningIcon from './LightningIcon';

// Bold, self-contained "here's what this tab does" banner, shown exactly
// once per device/browser the very first time someone opens a given tab
// (see Kitchen.jsx and Browse.jsx). Gated by its own localStorage flag
// (storageKey) rather than the main onboarding gate in App.jsx (see
// components/Onboarding.jsx) -- these are a separate, per-tab concern, so
// this still shows on someone's first real visit to Kitchen/Browse even
// if they skipped onboarding entirely, and each tab tracks its own
// "have I seen this" state independently.
//
// No auto-dismiss timer -- an earlier version disappeared on its own
// after a few seconds, which meant a first-time tip could vanish before
// someone even finished reading it. It now stays up until deliberately
// tapped away (either the whole banner or the explicit close icon), with
// a "tap to dismiss" hint so that's obvious.
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

  if (!show) return null;

  return (
    <div className="first-visit-tip" onClick={() => setShow(false)}>
      <LightningIcon size={22} id="first-visit-tip" />
      <div className="first-visit-tip-body">
        <span className="first-visit-tip-text">{children}</span>
        <span className="first-visit-tip-hint">Tap to dismiss</span>
      </div>
      <div className="first-visit-tip-close">✕</div>
    </div>
  );
}
