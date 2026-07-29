import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 68;
const MAX_PULL = 96;
const RESISTANCE = 0.45;

// Walks up from the touch target to `boundary` looking for a
// position:fixed ancestor -- every modal/bottom-sheet in this app (recipe
// detail, Sunday Prep's sheet, the calendar, settings, etc.) is built as a
// position:fixed overlay, so this is a cheap, single check that keeps a
// swipe-down *inside* an open modal from also yanking the page underneath
// it, without needing to thread an `open` boolean in from every modal.
function startedInsideFixedOverlay(target, boundary) {
  let node = target;
  while (node && node !== boundary && node.nodeType === 1) {
    if (window.getComputedStyle(node).position === 'fixed') return true;
    node = node.parentElement;
  }
  return false;
}

// Native-feeling swipe-down-to-refresh, wrapping whichever tab is currently
// on screen (see App.jsx). The point isn't really pagination/data-staleness
// -- it's that checking for an app update currently means force-quitting
// and reopening QuickPrep, which is a bad habit to teach anyone. This gives
// people the gesture they already know from every other app (Mail, Twitter,
// Instagram...) to re-check for an update and pull in anything that may
// have changed server-side, without leaving the app.
//
// Only engages when the page itself is scrolled to the very top
// (window.scrollY === 0) -- this app has no independent inner scroll
// container (see globals.css's html/body comment), so that's the same
// "top of content" signal native pull-to-refresh relies on. Uses native
// (non-passive) touch listeners rather than React's synthetic touch props,
// since React attaches onTouchMove as passive by default and silently
// ignores preventDefault() there -- without preventDefault the page would
// both scroll natively AND show the pull indicator, fighting each other.
export default function PullToRefresh({ onRefresh, children }) {
  const [pullPx, setPullPx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef(null);
  const stateRef = useRef({ startY: null, pulling: false, distance: 0, refreshing: false });
  const onRefreshRef = useRef(onRefresh);
  // Assigning a ref belongs in an effect, not render (see React's own
  // "Cannot access refs during render" rule) -- runs after every render
  // (no deps array) purely to keep the touch handlers below always
  // calling the latest onRefresh, without re-attaching the listeners
  // themselves every time the caller passes a new function reference.
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    function handleStart(e) {
      const st = stateRef.current;
      if (st.refreshing || window.scrollY > 0) return;
      if (startedInsideFixedOverlay(e.target, node)) return;
      st.startY = e.touches[0].clientY;
      st.pulling = true;
    }

    function handleMove(e) {
      const st = stateRef.current;
      if (!st.pulling || st.startY == null) return;
      const dy = e.touches[0].clientY - st.startY;
      if (dy <= 0 || window.scrollY > 0) {
        st.distance = 0;
        setPullPx(0);
        return;
      }
      // Only now, once we know this is a genuine downward pull at the top
      // of the page, do we suppress the browser's own scroll/bounce --
      // an ordinary upward scroll never reaches this line.
      e.preventDefault();
      const resisted = Math.min(MAX_PULL, dy * RESISTANCE);
      st.distance = resisted;
      setPullPx(resisted);
    }

    async function handleEnd() {
      const st = stateRef.current;
      if (!st.pulling) return;
      st.pulling = false;
      st.startY = null;
      if (st.distance >= THRESHOLD && !st.refreshing) {
        st.refreshing = true;
        setRefreshing(true);
        setPullPx(THRESHOLD);
        try {
          await onRefreshRef.current?.();
        } finally {
          st.refreshing = false;
          st.distance = 0;
          setRefreshing(false);
          setPullPx(0);
        }
      } else {
        st.distance = 0;
        setPullPx(0);
      }
    }

    node.addEventListener('touchstart', handleStart, { passive: true });
    node.addEventListener('touchmove', handleMove, { passive: false });
    node.addEventListener('touchend', handleEnd, { passive: true });
    node.addEventListener('touchcancel', handleEnd, { passive: true });
    return () => {
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('touchmove', handleMove);
      node.removeEventListener('touchend', handleEnd);
      node.removeEventListener('touchcancel', handleEnd);
    };
  }, []);

  const progress = Math.min(1, pullPx / THRESHOLD);
  const settling = pullPx === 0 && !refreshing;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -44,
          left: '50%',
          width: 34,
          height: 34,
          marginLeft: -17,
          borderRadius: '50%',
          background: 'var(--s2)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pullPx > 4 || refreshing ? 1 : 0,
          transform: `translateY(${pullPx}px)`,
          transition: settling ? 'transform var(--dur-med) var(--ease-out), opacity var(--dur-fast) var(--ease-out)' : 'none',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: '50%',
            border: '2.5px solid var(--s3)',
            borderTopColor: 'var(--lime)',
            animation: refreshing ? 'spin .7s linear infinite' : 'none',
            transform: refreshing ? 'none' : `rotate(${progress * 320}deg)`,
          }}
        />
      </div>
      <div
        style={{
          transform: `translateY(${pullPx}px)`,
          transition: settling ? 'transform var(--dur-med) var(--ease-out)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
