import StarIcon from './StarIcon';

// Format an ingredient quantity for display based on its unit.
function formatQuantity(quantity, unit, name) {
  const u = unit || 'g';
  switch (u) {
    case 'count': {
      // Eggs are stored as 50g per egg.
      if (name && name.toLowerCase().includes('egg')) {
        const eggCount = Math.round(quantity / 50);
        return `${eggCount} egg${eggCount === 1 ? '' : 's'}`;
      }
      return `${Math.round(quantity)}`;
    }
    case 'ml':
      return `${Math.round(quantity)}ml`;
    case 'spray':
      return `${Math.round(quantity)} spray${quantity === 1 ? '' : 's'}`;
    case 'each':
      return `${Math.round(quantity)}`;
    case 'g':
    default:
      return `${Math.round(quantity)}g`;
  }
}

export default function RecipeModal({ recipe, onClose, isFavorited, toggleFavorite }) {
  if (!recipe) return null;
  const r = recipe;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 100, overflowY: 'auto' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--s1)', margin: '20px auto', maxWidth: 430, borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {r.emoji ? `${r.emoji} ` : ''}
              <span style={{ color: 'var(--cream)' }}>{r.name}</span>
            </div>
            {(r.method || r.activeTime) && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {r.method}
                {r.method && r.activeTime ? ' · ' : ''}
                {r.activeTime ? `${r.activeTime} min` : ''}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {toggleFavorite && (
              <div onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}>
                <StarIcon filled={isFavorited && isFavorited(r.id)} size={24} />
              </div>
            )}
            <button
              onClick={onClose}
              style={{ background: 'var(--s3)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Ingredients */}
        {r.components && r.components.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Ingredients
            </div>
            {r.components.map((c, i) => (
              <div
                key={i}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < r.components.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <span style={{ fontSize: 13, color: 'var(--cream)' }}>{c.name}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 12, whiteSpace: 'nowrap' }}>
                  {formatQuantity(c.quantity, c.unit, c.name)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {r.instructions && r.instructions.length > 0 && (
          <div style={{ marginBottom: r.toppings && r.toppings.length > 0 ? 16 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Instructions
            </div>
            {r.instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'var(--s2)',
                    border: '1px solid var(--border)', color: 'var(--lime)', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: 'var(--cream)', lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>
        )}

        {/* Optional toppings */}
        {r.toppings && r.toppings.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Optional Toppings
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {r.toppings.map((t, i) => (
                <span
                  key={i}
                  style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 100, padding: '4px 10px', fontSize: 12 }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
