// Icons for Kitchen's floating ingredient bubbles (see Kitchen.jsx). These
// are NOT hand-drawn -- every shape below is copied path-for-path from a
// real, permissively-licensed open-source icon set (Lucide, ISC license;
// Google Material Symbols, Apache-2.0), the same way every other vendored
// icon in a normal app gets sourced. `type` is a pantry staple id (see
// data/pantryStaples.js); anything not covered below returns null (Kitchen.jsx
// keeps its old first-letter fallback for that case).
//
// Most staples have an exact or near-exact Lucide match, so those render as
// plain stroke line-art matching every other icon in this app (drumstick,
// beef, egg, fish, shrimp are all literally named for what they depict).
// Three staples have no dedicated icon in ANY icon set checked (Lucide,
// Phosphor, Iconoir, Font Awesome Free, Healthicons, RemixIcon, Material
// Symbols) -- there is no "whole chicken," "rotisserie chicken," or "bowl of
// noodles/pasta" glyph in general-purpose UI icon libraries. For those three
// (chicken_breast, rotisserie_chicken, pasta) the closest real match is a
// filled Material Symbols glyph instead of a stroke one, so they render
// slightly differently (solid glyph vs. line art) rather than being invented
// from scratch.

const LUCIDE = {
  // https://lucide.dev/icons/bird -- closest real icon to "a chicken": no
  // icon set has a dedicated whole-chicken-as-food glyph.
  chicken_breast: (
    <>
      <path d="M16 7h.01" />
      <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
      <path d="m20 7 2 .5-2 .5" />
      <path d="M10 18v3" />
      <path d="M14 17.75V21" />
      <path d="M7 18a6 6 0 0 0 3.84-10.61" />
    </>
  ),
  // https://lucide.dev/icons/drumstick -- literally a chicken leg.
  chicken_thighs: (
    <>
      <path d="M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23" />
      <path d="m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59" />
    </>
  ),
  // https://lucide.dev/icons/beef
  ground_beef: (
    <>
      <path d="M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3" />
      <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5" />
      <circle cx="12.5" cy="8.5" r="2.5" />
    </>
  ),
  // https://lucide.dev/icons/ham -- no icon set has a turkey-specific glyph;
  // this is the closest real cut-of-meat shape distinct from beef/drumstick.
  ground_turkey: (
    <>
      <path d="M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856" />
      <path d="M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288" />
      <path d="M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025" />
      <path d="m8.5 16.5-1-1" />
    </>
  ),
  // https://lucide.dev/icons/egg
  eggs: <path d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" />,
  // https://lucide.dev/icons/fish
  salmon: (
    <>
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
      <path d="M18 12v.5" />
      <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
      <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
      <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
      <path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
    </>
  ),
  // https://lucide.dev/icons/shrimp
  shrimp: (
    <>
      <path d="M11 12h.01" />
      <path d="M13 22c.5-.5 1.12-1 2.5-1-1.38 0-2-.5-2.5-1" />
      <path d="M14 2a3.28 3.28 0 0 1-3.227 1.798l-6.17-.561A2.387 2.387 0 1 0 4.387 8H15.5a1 1 0 0 1 0 13 1 1 0 0 0 0-5H12a7 7 0 0 1-7-7V8" />
      <path d="M14 8a8.5 8.5 0 0 1 0 8" />
      <path d="M16 16c2 0 4.5-4 4-6" />
    </>
  ),
};

// https://fonts.google.com/icons -- Material Symbols Outlined, Apache-2.0.
// Native viewBox/fill differ from Lucide's, so these render as solid glyphs
// rather than stroke line-art (see file comment above for why).
const MATERIAL = {
  // "dinner_dining" -- a roasted drumstick on a plate; the closest real icon
  // to "rotisserie chicken" in any set checked.
  rotisserie_chicken:
    'm140-120-60-60h800l-60 60H140Zm-20-121q5-17 16-30.5t24-25.5v-325h-40v-50h40v-34h-40v-50h40v-34h-40v-50h290q24.75 0 42.38 17.62Q470-804.75 470-780v24h370v50H470v24q0 24.75-17.62 42.37Q434.75-622 410-622h-95v271q21 2 39.5 10t35.5 22q17-69 74-109.5T593-469q88 0 147.5 63.5T800-254v13H120Zm330-60h283q-10-49-49.5-78.5T593-409q-51 0-92 29t-51 79ZM315-756h105v-34H315v34Zm0 84h105v-34H315v34Zm-105-84h55v-34h-55v34Zm0 84h55v-34h-55v34Zm0 340q12-9 26-14t29-6v-270h-55v290Zm382 31Z',
  // "rice_bowl" -- exact match.
  rice: 'M320-80v-70q-105-42-172.5-130T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 112-67.5 200T640-150v70H320Zm70-399h180v-329q-22.33-6-44.67-9-22.33-3-45.08-3t-45.5 3Q412-814 390-808v329Zm-250 0h190v-306q-88 43-139 125.5T140-479Zm490 0h190q0-98-51-180.5T630-785v306ZM380-140h200v-51q79-34 143.5-90T811-419H149q23 82 87.5 138T380-191.23V-140Zm0 0h200-200Z',
  // "ramen_dining" -- a bowl of noodles with chopsticks; the closest real
  // icon to "pasta/noodles" in any set checked.
  pasta: 'M376-140h207v-56l36-15q74-31 121.5-80.5T808-400H152q20 59 68 109t120 80l36 15v56Zm-60 60v-78q-105-42-167-122T80-460h80v-340l720-80v50l-470 52v87h470v50H410v181h470q-6 100-69.5 180T643-158v78H316Zm-6-611h50v-82l-50 6v76Zm-100 0h50v-71l-50 6v65Zm100 231h50v-181h-50v181Zm-100 0h50v-181h-50v181Zm270 60Z',
};

export default function IngredientIcon({ type, size = 22, color = 'currentColor' }) {
  if (LUCIDE[type]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {LUCIDE[type]}
      </svg>
    );
  }
  if (MATERIAL[type]) {
    return (
      <svg width={size} height={size} viewBox="0 -960 960 960" fill={color}>
        <path d={MATERIAL[type]} />
      </svg>
    );
  }
  return null;
}
