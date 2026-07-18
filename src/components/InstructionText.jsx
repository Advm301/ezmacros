import { splitActionWords } from '../utils/actionWords';
import { splitIntoClauses } from '../utils/instructionClauses';

// A single sentence-like clause of a step ("Heat tortillas in a dry pan
// 30 sec per side."), with its recognized action verbs highlighted (see
// utils/actionWords.js) in the app's animated-gold, Baloo 2 "action word"
// style (see .action-word in globals.css).
function Clause({ text }) {
  const segments = splitActionWords(text);
  return segments.map((seg, i) =>
    seg.action ? (
      <span key={i} className="action-word">{seg.text}</span>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  );
}

// Renders an instruction step as a short cascading list of its individual
// clauses (see utils/instructionClauses.js) rather than one solid
// paragraph -- each clause gets its own line, stair-stepped with a little
// extra indent the further down the list it sits, and slides/fades in a
// beat after the one before it (see .instruction-clause in globals.css).
// The goal is a step that reads as a sequence of distinct commands you
// glance at one at a time mid-cook, not a block of text you have to parse
// up front to figure out what to actually do. Indent is capped at 3 steps
// (stairStep below) so a rare 4-clause step doesn't run its last line off
// the edge of the card. Steps that are just one clause (no real sentence
// break) skip the list wrapper entirely and render as a plain line, same
// as before.
export default function InstructionText({ text }) {
  const clauses = splitIntoClauses(text);
  if (clauses.length <= 1) return <Clause text={text} />;

  return (
    <div className="instruction-clauses">
      {clauses.map((clause, i) => {
        const stairStep = Math.min(i, 3);
        return (
          <div
            key={i}
            className="instruction-clause"
            style={{ marginLeft: stairStep * 16, '--clause-delay': `${i * 0.12}s` }}
          >
            <Clause text={clause} />
          </div>
        );
      })}
    </div>
  );
}
