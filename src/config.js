// Single flip to turn beta-only UI (feedback button, BETA badge) on or
// off. Flip to false before the real App Store release -- everything
// gated behind this constant should disappear cleanly.
export const BETA_MODE = true;

// Injected at build time (vite.config.js) from the git short SHA, so a
// feedback submission can be tied back to the exact deployed build.
// Falls back to 'dev' when running locally outside a build (e.g. `vite`
// dev server without the define applied for some reason).
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
