// Maps a recipe's protein(s) to a color, for the left-edge accent stripe on
// recipe cards (Browse tab, Kitchen results). Colors are deliberately muted
// / desaturated rather than the app's existing bright accents (orange for
// High Protein/streak, purple for Surprise Me, lime for saved) -- a full set
// of 9 saturated hues next to those badges would read as noisy. These read
// as a calmer, secondary layer of color instead of competing for attention.
export const PROTEIN_COLORS = {
  fish: '#5b8fa8',            // muted slate blue
  beef: '#a8574a',            // muted brick red
  pork: '#c98ba0',            // muted dusty rose
  turkey: '#9c7a52',          // muted tan/brown
  chicken: '#c9a227',         // muted mustard yellow
  eggs: '#d6c178',            // soft pale gold
  dairy: '#9fb8c4',           // soft cool blue-gray
  plant: '#7fa363',           // muted olive green
  protein_powder: '#a38fc4',  // muted lavender
};

// When a recipe lists more than one protein, this decides which one "wins"
// the accent color. Array order in the data doesn't reliably reflect intent
// (e.g. "Tuna Pasta Salad" lists plant before fish despite being a fish
// dish), so meats/fish are prioritized over eggs/dairy/plant/protein powder,
// which are more often a side ingredient than the headline protein.
const PRIORITY = ['fish', 'beef', 'pork', 'turkey', 'chicken', 'eggs', 'dairy', 'plant', 'protein_powder'];

export function getPrimaryProtein(proteins) {
  if (!proteins || proteins.length === 0) return null;
  for (const p of PRIORITY) {
    if (proteins.includes(p)) return p;
  }
  return proteins[0];
}

export function getProteinColor(proteins) {
  const primary = getPrimaryProtein(proteins);
  return primary ? PROTEIN_COLORS[primary] : null;
}
