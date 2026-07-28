// A "photo slot" standing in for real food photography wherever a screen
// wants a hero-scale visual (see Saved.jsx's Sunday Prep card, the first
// place this is used). This app has no photo assets at all right now, and
// sourcing real ones (commissioned photography vs. AI-generated vs.
// licensed stock, plus a pipeline to serve 166 of them) is a real decision
// to make on its own -- this exists so hero-card layouts can be designed
// and proven out today without waiting on that decision, and without a
// second layout pass once photos do exist: swap this call for
// `recipe.photoUrl` (or whatever field that ends up being) and nothing
// else about the surrounding card needs to change, since callers already
// treat this as "the thing that fills the hero surface," not specifically
// "a gradient."
//
// First version of this keyed a different hue per cuisine (Mexican =
// orange/red, Italian = red, etc.) -- reads as more "food," but a handful
// of those (red especially) fought the app's actual palette, which never
// otherwise uses red for anything but danger/delete. Rather than trying to
// hand-pick a whole second palette of food-safe hues that still won't
// clash with anything, this reuses the app's own signature gradient
// family instead: the same teal-to-bright-blue-to-white progression as
// .app-header-bar and .app-bg in globals.css. Every hero card now shares
// one consistent, unmistakably-QuickPrep background rather than each
// recipe rolling its own color, which is also just a more honest
// placeholder -- a plain gradient was never going to read as "this specific
// dish" anyway, so it may as well read as "this app" instead.
const BRAND_GRADIENT = 'linear-gradient(155deg, #052e3d 0%, #0e5a76 32%, #1f8bb8 58%, #7fd4ff 82%, #e8f7ff 100%)';

export function getRecipeGradient() {
  return BRAND_GRADIENT;
}
