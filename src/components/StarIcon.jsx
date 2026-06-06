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
        color: filled ? 'var(--lime)' : 'var(--muted)',
        transition: 'color 0.15s ease',
        minWidth: '44px',
        minHeight: '44px',
        borderRadius: '6px',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--lime)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = filled ? 'var(--lime)' : 'var(--muted)';
      }}
      title={filled ? 'Remove from favorites' : 'Add to favorites'}
    >
      {filled ? '★' : '☆'}
    </div>
  );
}
