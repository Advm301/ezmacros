import { useState } from 'react';
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

// The editable value for an ingredient -- eggs are edited as whole eggs,
// everything else is edited as its raw stored quantity.
function getEditableAmount(quantity, unit, name) {
  if (unit === 'count' && name && name.toLowerCase().includes('egg')) {
    return Math.round(quantity / 50);
  }
  return Math.round(quantity);
}

function amountToQuantity(amount, unit, name) {
  if (unit === 'count' && name && name.toLowerCase().includes('egg')) {
    return amount * 50;
  }
  return amount;
}

export default function RecipeModal({
  recipe,
  onClose,
  isSaved,
  toggleSaved,
  entry,
  onUpdateNotes,
  onUpdateIngredientOverride,
  onUpdateInstructionOverride,
}) {
  // Rendered with key={recipe.id} by the parent, so this component remounts
  // fresh (and all local state below resets naturally) whenever a different
  // recipe is opened -- no reset effect needed.
  const [completedSteps, setCompletedSteps] = useState({});
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingIngredientValue, setEditingIngredientValue] = useState('');
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [editingStepValue, setEditingStepValue] = useState('');
  const [notesValue, setNotesValue] = useState(entry?.notes || '');

  if (!recipe) return null;
  const r = recipe;
  const saved = isSaved ? isSaved(r.id) : false;

  const components = (r.components || []).map((c, i) => {
    const override = entry?.ingredientOverrides?.[i];
    return override ? { ...c, quantity: override.quantity, unit: override.unit ?? c.unit, edited: true } : c;
  });

  const instructions = (r.instructions || []).map((step, i) => {
    const override = entry?.instructionOverrides?.[i];
    return { text: override !== undefined ? override : step, edited: override !== undefined };
  });

  const toggleStepDone = (i) => {
    setCompletedSteps((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const startEditingIngredient = (i, comp) => {
    setEditingIngredientIndex(i);
    setEditingIngredientValue(String(getEditableAmount(comp.quantity, comp.unit, comp.name)));
  };

  const commitIngredientEdit = (i, comp) => {
    const amount = parseFloat(editingIngredientValue);
    if (!isNaN(amount) && amount > 0) {
      const quantity = amountToQuantity(amount, comp.unit, comp.name);
      onUpdateIngredientOverride(r.id, i, { quantity, unit: comp.unit });
    }
    setEditingIngredientIndex(null);
  };

  const startEditingStep = (i, text) => {
    setEditingStepIndex(i);
    setEditingStepValue(text);
  };

  const commitStepEdit = (i) => {
    if (editingStepValue.trim().length > 0) {
      onUpdateInstructionOverride(r.id, i, editingStepValue);
    }
    setEditingStepIndex(null);
  };

  const commitNotes = () => {
    if (onUpdateNotes) onUpdateNotes(r.id, notesValue);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 100, overflowY: 'auto' }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #08677B 0%, #08677B 20%, #041A20 65%, #000000 100%)',
          margin: '20px auto',
          maxWidth: 430,
          borderRadius: 20,
          padding: 24,
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
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
            {toggleSaved && (
              <div onClick={(e) => { e.stopPropagation(); toggleSaved(r.id); }}>
                <StarIcon filled={saved} size={24} />
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
        {components.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              Ingredients
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Tap a quantity to edit it.</div>
            {components.map((c, i) => {
              const isEditing = editingIngredientIndex === i;
              return (
                <div
                  key={i}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < components.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <span style={{ fontSize: 13, color: 'var(--cream)' }}>{c.name}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      autoFocus
                      value={editingIngredientValue}
                      onChange={(e) => setEditingIngredientValue(e.target.value)}
                      onBlur={() => commitIngredientEdit(i, c)}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                      style={{ width: 64, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 6px', color: 'var(--cream)', fontSize: 13, textAlign: 'right' }}
                    />
                  ) : (
                    <span
                      onClick={() => startEditingIngredient(i, c)}
                      style={{ fontSize: 13, color: c.edited ? 'var(--lime)' : 'var(--muted)', marginLeft: 12, whiteSpace: 'nowrap', cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                    >
                      {formatQuantity(c.quantity, c.unit, c.name)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        {instructions.length > 0 && (
          <div style={{ marginBottom: r.toppings && r.toppings.length > 0 ? 16 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              Instructions
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Tap the number to check off a step, tap the text to edit it.</div>
            {instructions.map((step, i) => {
              const done = Boolean(completedSteps[i]);
              const isEditingStep = editingStepIndex === i;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div
                    onClick={() => toggleStepDone(i)}
                    style={{
                      flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                      background: done ? 'var(--lime)' : 'var(--s2)',
                      border: '1px solid var(--border)', color: done ? '#000' : 'var(--lime)', fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, cursor: 'pointer',
                    }}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  {isEditingStep ? (
                    <textarea
                      autoFocus
                      value={editingStepValue}
                      onChange={(e) => setEditingStepValue(e.target.value)}
                      onBlur={() => commitStepEdit(i)}
                      style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--cream)', fontSize: 13, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', minHeight: 50 }}
                    />
                  ) : (
                    <div
                      onClick={() => startEditingStep(i, step.text)}
                      style={{
                        fontSize: 13, lineHeight: 1.5, cursor: 'pointer', flex: 1,
                        color: done ? 'var(--muted)' : (step.edited ? 'var(--lime)' : 'var(--cream)'),
                        textDecoration: done ? 'line-through' : 'none',
                      }}
                    >
                      {step.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Optional toppings */}
        {r.toppings && r.toppings.length > 0 && (
          <div style={{ marginBottom: 16 }}>
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

        {/* Notes */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Notes
          </div>
          <textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            onBlur={commitNotes}
            placeholder="Add your own notes -- substitutions, timing tweaks, anything worth remembering."
            style={{ width: '100%', minHeight: 64, background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: 'var(--cream)', fontSize: 13, fontFamily: "'Manrope',sans-serif", lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        {/* Save Recipe */}
        {toggleSaved && (
          <button
            onClick={() => toggleSaved(r.id)}
            style={{
              width: '100%',
              background: saved ? 'transparent' : '#fff',
              color: saved ? 'var(--cream)' : '#000',
              border: saved ? '1px solid var(--border)' : 'none',
              borderRadius: 13,
              padding: 14,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Manrope',sans-serif",
              cursor: 'pointer',
            }}
          >
            {saved ? 'Saved — tap to remove' : 'Save Recipe'}
          </button>
        )}
      </div>
    </div>
  );
}
