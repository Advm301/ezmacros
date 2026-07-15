import { RECIPES } from '../data/recipes.js';
import StarIcon from '../components/StarIcon';

export default function Saved({ saved, isSaved, toggleSaved, onOpen, getRatingSummary }) {
  const savedIds = Object.keys(saved);
  const recipes = RECIPES.filter((r) => savedIds.includes(String(r.id)));

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="px pt">
        <div className="h1">Saved Recipes</div>
        <div className="sub" style={{ marginBottom: 14 }}>
          Recipes you've starred, saved, or customized.
        </div>
      </div>

      <div className="px">
        {recipes.length === 0 ? (
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
              Nothing saved yet. Tap the star or the Save Recipe button on any recipe to keep it here.
            </div>
          </div>
        ) : (
          recipes.map((r) => {
            const entry = saved[r.id];
            const hasNotes = entry && entry.notes && entry.notes.trim().length > 0;
            const hasOverrides = entry && (
              Object.keys(entry.ingredientOverrides || {}).length > 0 ||
              Object.keys(entry.instructionOverrides || {}).length > 0
            );
            return (
              <div
                key={r.id}
                style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 10, cursor: 'pointer' }}
                onClick={() => onOpen(r)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2 }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {r.method}{r.method && r.activeTime ? ' · ' : ''}{r.activeTime ? `${r.activeTime} min` : ''}
                      {getRatingSummary && getRatingSummary(r.id) && (
                        <> · ★ {getRatingSummary(r.id).avg.toFixed(1)} ({getRatingSummary(r.id).count})</>
                      )}
                    </div>
                    {(hasNotes || hasOverrides) && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
                        {hasNotes ? entry.notes.slice(0, 60) : 'Customized'}
                      </div>
                    )}
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }}>
                    <StarIcon filled={isSaved(r.id)} size={20} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
