import { splitActionWords } from '../utils/actionWords';

// Renders an instruction step with its recognized action verbs (see
// utils/actionWords.js -- "Heat", "Add", "Stir", "Microwave", etc.)
// highlighted in the app's animated-gold, Baloo 2 "action word" style
// (see .action-word in globals.css). The goal is a step that reads as a
// sequence of distinct commands rather than one paragraph you have to
// parse to figure out what to actually do -- the plain surrounding text
// (ingredient names, quantities, timing, asides) stays in the normal font
// so the highlighted words are the only thing that jumps out.
export default function InstructionText({ text }) {
  const segments = splitActionWords(text);
  return segments.map((seg, i) =>
    seg.action ? (
      <span key={i} className="action-word">{seg.text}</span>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  );
}
