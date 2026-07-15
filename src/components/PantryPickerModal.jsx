import { useState } from 'react';
import { PANTRY_CATEGORIES } from '../data/pantryStaples.js';
import { hapticLight } from '../utils/haptics';

// Bottom-sheet drawer for picking pantry items -- pulled out of the Kitchen
// tab's main flow so the always-visible page doesn't have to render all
// ~30+ pantry chips across 5 categories up front. Kitchen just shows a
// compact summary row and opens this on tap.
export default function PantryPickerModal({ selectedStaples, toggleStaple, onClose }) {
  const [search, setSearch] = useState('');

  const searchLower = search.trim().toLowerCase();
  const visibleCategories = PANTRY_CATEGORIES.map((cat) => ({
    category: cat.category,
    items: searchLower
      ? cat.items.filter((s) => s.label.toLowerCase().includes(searchLower))
      : cat.items,
  })).filter((cat) => cat.items.length > 0);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg)', width: '100%', maxWidth: 430, height: '82vh', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', padding: '18px 18px 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="h1" style={{ marginBottom: 0, fontSize: 18 }}>What Do You Have?</div>
          <div onClick={onClose} style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
            ✕
          </div>
        </div>

        <input
          type="text"
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your pantry (e.g. rice, eggs, salsa)..."
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--cream)', fontSize: 13, padding: '10px 12px', marginBottom: 12, fontFamily: "'Manrope',sans-serif" }}
        />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 12 }}>
          {visibleCategories.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              No pantry items match "{search}".
            </div>
          ) : (
            visibleCategories.map((cat) => (
              <div key={cat.category} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>
                  {cat.category}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {cat.items.map((s) => (
                    <div
                      key={s.id}
                      className={`pill ${selectedStaples.includes(s.id) ? 'active' : ''}`}
                      onClick={() => toggleStaple(s.id)}
                    >
                      {selectedStaples.includes(s.id) ? `✓ ${s.label}` : s.label}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '12px 0 18px', borderTop: '1px solid var(--border)' }}>
          <button
            className="gen-kitchen-btn"
            style={{ marginBottom: 0 }}
            onClick={() => { hapticLight(); onClose(); }}
          >
            Done{selectedStaples.length > 0 ? ` (${selectedStaples.length} selected)` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
