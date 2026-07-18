import LightningIcon from './LightningIcon';

// Bold "here's what this tab does" banner (see Kitchen.jsx, Browse.jsx,
// Saved.jsx). Purely presentational now -- show/dismiss state lives in
// useFirstVisitTip (see hooks/useFirstVisitTip.js), which each page also
// wires up to its own small info-icon button so the tip can be brought
// back on demand after being dismissed, not just on that very first visit.
export default function FirstVisitTip({ show, onDismiss, children }) {
  if (!show) return null;

  return (
    <div className="first-visit-tip" onClick={onDismiss}>
      <LightningIcon size={22} id="first-visit-tip" />
      <div className="first-visit-tip-body">
        <span className="first-visit-tip-text">{children}</span>
        <span className="first-visit-tip-hint">Tap to dismiss</span>
      </div>
      <div className="first-visit-tip-close">✕</div>
    </div>
  );
}
