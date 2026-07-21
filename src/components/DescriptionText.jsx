import { splitIngredientWords } from '../utils/ingredientWords';

// Renders a recipe's short description (see recipe.description in
// data/recipes.js) with its recognized key ingredients picked out in the
// app's gold/metallic highlight style (see utils/ingredientWords.js +
// .ingredient-highlight in globals.css) -- e.g. "...ground beef bowl with
// black beans, rice, and salsa" renders with each of those four food terms
// glowing gold while the connecting prose stays plain. Mirrors
// InstructionText.jsx's Clause component, which does the same thing for
// command verbs within a cooking step.
export default function DescriptionText({ text }) {
  const segments = splitIngredientWords(text);
  return segments.map((seg, i) =>
    seg.ingredient ? (
      <span key={i} className="ingredient-highlight">{seg.text}</span>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  );
}
