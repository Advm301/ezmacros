// Filled state is gold (var(--gold)) rather than the app's usual --lime
// accent -- a favorited star reads as "starred"/"gold star" the way it
// would anywhere else, instead of blending in with every other selected/
// active element in the app that also happens to use --lime.
export default function StarIcon({ filled = false, onClick, size = 24 }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size,
        cursor: 'pointer',
        color: filled ? 'var(--gold)' : 'var(--muted)',
        transition: 'color 0.15s ease',
        minWidth: '44px',
        minHeight: '44px',
        borderRadius: '6px',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--gold)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = filled ? 'var(--gold)' : 'var(--muted)';
      }}
      title={filled ? 'Remove from favorites' : 'Add to favorites'}
    >
      {filled ? '★' : '☆'}
    </div>
  );
}
