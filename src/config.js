// Single flip to turn beta-only UI (feedback button, BETA badge) on or
// off. Flip to false before the real App Store release -- everything
// gated behind this constant should disappear cleanly.
export const BETA_MODE = true;

// Injected at build time (vite.config.js) from the git short SHA, so a
// feedback submission can be tied back to the exact deployed build.
// Falls back to 'dev' when running locally outside a build (e.g. `vite`
// dev server without the define applied for some reason).
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';

// Public App Store Connect numeric app id (same value as codemagic.yaml's
// APP_STORE_APPLE_ID build var) -- not a secret, it's the same id visible
// in the app's own App Store/TestFlight URL. Used to deep-link straight
// into this app's TestFlight page when an update is available (see
// useAppVersion.js / the update banner in App.jsx).
export const APP_STORE_APPLE_ID = '6791809412';

// Shopping-list "Shop This List" handoff button (Saved.jsx) -- built
// against Instacart's Developer Platform API (see
// utils/instacartShoppingList.js + the instacart-shopping-list Supabase
// Edge Function), but Instacart isn't currently accepting new developer
// applications (checked July 2026, no waitlist offered). The edge
// function and client code are left in place and ready to go -- flip this
// to true once a working key/backend actually exists (Instacart reopening,
// Kroger's API, or whatever else pans out) rather than shipping a button
// that always errors with no ETA in the meantime.
export const SHOPPING_LINK_ENABLED = false;
