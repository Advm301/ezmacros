// Highlights the imperative cooking verbs in an instruction string ("Heat
// a skillet...", "Stir in tomato paste...") so a step reads as a sequence
// of distinct commands instead of one paragraph to parse. The word list
// below isn't a guess -- it was built by pulling every leading word of
// every comma/period-separated clause across all 144 recipes' real
// instructions and keeping the ones that were actual verbs (see the
// scratch script used to generate it, not checked in). That's also why
// this focuses on imperative/gerund forms ("stirring occasionally",
// "shaking the basket") rather than trying to catch every verb tense
// anywhere in a sentence -- those are the actual commands; a stray past
// tense buried mid-clause (e.g. "until the cheese melts") is describing a
// doneness cue, not telling you what to do, so it's left alone on purpose.
const ACTION_WORD_LIST = [
  'add', 'adds', 'added', 'adding',
  'microwave', 'microwaves', 'microwaved', 'microwaving',
  'cook', 'cooks', 'cooked', 'cooking',
  // Bare "heat" and "spoon"/"spoons" are excluded here on purpose -- both
  // are just as often nouns in this app's phrasing ("medium-high heat",
  // "breaking it apart with a spoon") as they are commands ("Heat a
  // skillet...", "Spoon batter into..."). Guarded, disambiguated versions
  // of both are added directly into the regex below instead of listed
  // here bare, so the noun uses don't light up along with the real verbs.
  'heats', 'heated', 'heating',
  // Bare "top" is guarded the same way -- "Top with cheese" (command) vs.
  // "drizzle sauce over top" / "squeeze lime on top" (the noun idiom,
  // always right after "on"/"over" in this app's phrasing).
  'tops', 'topped', 'topping',
  'build', 'builds', 'built', 'building',
  'mix', 'mixes', 'mixed', 'mixing',
  // "seasoning" (the -ing noun form, e.g. "Italian seasoning", "Greek
  // seasoning") is deliberately left out -- every occurrence in this app's
  // actual instructions is naming a seasoning-blend ingredient, never a
  // literal command, unlike "season"/"seasons"/"seasoned" which always are.
  'season', 'seasons', 'seasoned',
  'stir', 'stirs', 'stirred', 'stirring',
  'spread', 'spreads', 'spreading',
  'simmer', 'simmers', 'simmered', 'simmering',
  'break', 'breaks', 'broke', 'broken', 'breaking',
  'sprinkle', 'sprinkles', 'sprinkled', 'sprinkling',
  'toss', 'tosses', 'tossed', 'tossing',
  'pour', 'pours', 'poured', 'pouring',
  'place', 'places', 'placed', 'placing',
  'bake', 'bakes', 'baked', 'baking',
  'drizzle', 'drizzles', 'drizzled', 'drizzling',
  'spray', 'sprays', 'sprayed', 'spraying',
  'layer', 'layers', 'layered', 'layering',
  'toast', 'toasts', 'toasted', 'toasting',
  'serve', 'serves', 'served', 'serving',
  'combine', 'combines', 'combined', 'combining',
  'shake', 'shakes', 'shook', 'shaken', 'shaking',
  'roll', 'rolls', 'rolled', 'rolling',
  'spooned', 'spooning',
  'squeeze', 'squeezes', 'squeezed', 'squeezing',
  'brown', 'browns', 'browned', 'browning',
  'brush', 'brushes', 'brushed', 'brushing',
  'warm', 'warms', 'warmed', 'warming',
  'cover', 'covers', 'covered', 'covering',
  'bring', 'brings', 'brought', 'bringing',
  'scramble', 'scrambles', 'scrambled', 'scrambling',
  'remove', 'removes', 'removed', 'removing',
  'divide', 'divides', 'divided', 'dividing',
  'whisk', 'whisks', 'whisked', 'whisking',
  'cool', 'cools', 'cooled', 'cooling',
  'plate', 'plates', 'plated', 'plating',
  'scoop', 'scoops', 'scooped', 'scooping',
  'dust', 'dusts', 'dusted', 'dusting',
  'stack', 'stacks', 'stacked', 'stacking',
  'coat', 'coats', 'coated', 'coating',
  'pat', 'pats', 'patted', 'patting',
  'rest', 'rests', 'rested', 'resting',
  'fill', 'fills', 'filled', 'filling',
  'refrigerate', 'refrigerates', 'refrigerated', 'refrigerating',
  'thaw', 'thaws', 'thawed', 'thawing',
  'reheat', 'reheats', 'reheated', 'reheating',
  'return', 'returns', 'returned', 'returning',
  'lay', 'lays', 'laid', 'laying',
  'crack', 'cracks', 'cracked', 'cracking',
  'preheat', 'preheats', 'preheated', 'preheating',
  'wrap', 'wraps', 'wrapped', 'wrapping',
  'flip', 'flips', 'flipped', 'flipping',
  'melt', 'melts', 'melted', 'melting',
  'halve', 'halves', 'halved', 'halving',
  'mash', 'mashes', 'mashed', 'mashing',
  'fold', 'folds', 'folded', 'folding',
  'slice', 'slices', 'sliced', 'slicing',
  'boil', 'boils', 'boiled', 'boiling',
  'drain', 'drains', 'drained', 'draining',
  'dip', 'dips', 'dipped', 'dipping',
  'create', 'creates', 'created', 'creating',
  'crumble', 'crumbles', 'crumbled', 'crumbling',
  'grease', 'greases', 'greased', 'greasing',
  'fry', 'fries', 'fried', 'frying',
  'arrange', 'arranges', 'arranged', 'arranging',
  'pulse', 'pulses', 'pulsed', 'pulsing',
  'chop', 'chops', 'chopped', 'chopping',
  'shred', 'shreds', 'shredded', 'shredding',
  'cut', 'cuts', 'cutting',
  'transfer', 'transfers', 'transferred', 'transferring',
  'form', 'forms', 'formed', 'forming',
  'turn', 'turns', 'turned', 'turning',
  'poke', 'pokes', 'poked', 'poking',
  'split', 'splits', 'splitting',
  'stuff', 'stuffs', 'stuffed', 'stuffing',
  'blend', 'blends', 'blended', 'blending',
  'scatter', 'scatters', 'scattered', 'scattering',
  'empty', 'empties', 'emptied', 'emptying',
  'grab', 'grabs', 'grabbed', 'grabbing',
  'pierce', 'pierces', 'pierced', 'piercing',
  'repeat', 'repeats', 'repeated', 'repeating',
  'slide', 'slides', 'slid', 'sliding',
  'peel', 'peels', 'peeled', 'peeling',
  'dice', 'dices', 'diced', 'dicing',
  'marinate', 'marinates', 'marinated', 'marinating',
  'rinse', 'rinses', 'rinsed', 'rinsing',
  'chill', 'chills', 'chilled', 'chilling',
  'sear', 'sears', 'seared', 'searing',
  'knead', 'kneads', 'kneaded', 'kneading',
  'garnish', 'garnishes', 'garnished', 'garnishing',
];

// "Air fry" is the one common two-word command in this app's instructions
// ("air" on its own isn't a verb) -- matched as its own phrase, with an
// optional hyphen/space and -ing, ahead of the single-word list.
const PHRASE_PATTERN = 'air[- ]?fry(?:ing)?';

// Guarded versions of "heat", "spoon(s)", and "top" -- only match the
// command use ("Heat a skillet", "Spoon batter into...", "Top with
// cheese") and not the everyday-object/idiom use ("medium-high heat",
// "with a spoon", "drizzle sauce over top").
const HEAT_PATTERN = '(?<!medium-high )(?<!medium-low )(?<!medium )(?<!high )(?<!low )heat';
const SPOON_PATTERN = '(?<!a )(?<!an )(?<!the )spoons?';
const TOP_PATTERN = '(?<!on )(?<!over )top';

const ACTION_WORDS_REGEX = new RegExp(
  `\\b(${PHRASE_PATTERN}|${HEAT_PATTERN}|${SPOON_PATTERN}|${TOP_PATTERN}|${ACTION_WORD_LIST.join('|')})\\b`,
  'gi'
);

// Splits an instruction string into an array of { text, action } segments,
// in order, that concatenate back into the original string -- `action:
// true` segments are the recognized command verbs to render highlighted.
export function splitActionWords(text) {
  if (!text) return [{ text: text || '', action: false }];
  const parts = text.split(ACTION_WORDS_REGEX);
  // String.split with a single capture group in the pattern returns
  // [nonMatch, match, nonMatch, match, ..., nonMatch] -- odd indices are
  // always the captured verb matches, even indices are the text between.
  // Tag by that original index parity BEFORE filtering out empty strings,
  // since filtering first would shift indices and break the odd/even test.
  return parts
    .map((s, i) => ({ text: s, action: i % 2 === 1 }))
    .filter((seg) => seg.text !== undefined && seg.text !== '');
}
