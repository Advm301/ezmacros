import { useState } from 'react';

// A row of 5 tappable stars. In interactive mode (readOnly=false, onRate
// provided) it reflects hover state and calls onRate(1-5) on click. In
// read-only mode it just renders `value` filled stars (rounded) for
// displaying the community average.
export default function StarRating({ value = 0, onRate, size = 20, readOnly = false }) {
  const [hoverValue, setHoverValue] = useState(0);
  const display = readOnly ? Math.round(value) : (hoverValue || value);

  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => { if (!readOnly && onRate) onRate(n); }}
          onMouseEnter={() => { if (!readOnly) setHoverValue(n); }}
          onMouseLeave={() => { if (!readOnly) setHoverValue(0); }}
          style={{
            fontSize: size,
            lineHeight: 1,
            cursor: readOnly ? 'default' : 'pointer',
            color: n <= display ? 'var(--lime)' : 'var(--muted)',
            transition: 'color 0.1s ease',
            userSelect: 'none',
          }}
        >
          {n <= display ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
