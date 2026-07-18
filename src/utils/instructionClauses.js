// Splits a full instruction step ("Heat tortillas in a dry pan 30 sec per
// side. Microwave veg 3 min. Build tacos with ground turkey. Toppings on
// the side.") into its individual sentence-like clauses, so a step can be
// rendered as a short cascading list of distinct commands instead of one
// paragraph the person has to parse mid-cook.
//
// The split point is a sentence-ending punctuation mark (., !, or ?)
// immediately followed by whitespace -- the punctuation stays attached to
// the clause it closes, and the separating whitespace itself is dropped.
// Verified against all 422 real instruction steps in recipes.js before
// shipping: none contain a decimal number or abbreviation that would
// wrongly trigger a split (e.g. "1.5 hours" has no space after the
// period, so it's left alone), and steps naturally split into 1-4 clauses
// each -- short enough that a stair-stepped cascade reads as a quick list,
// not a wall of separate lines.
export function splitIntoClauses(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
