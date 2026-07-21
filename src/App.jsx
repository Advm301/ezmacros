import { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import useSavedRecipes from './hooks/useSavedRecipes';
import useRecipeRatings from './hooks/useRecipeRatings';
import useDiary, { todayString } from './hooks/useDiary';
import { getGreeting } from './utils/greeting';
import { hapticSelection, hapticLight, hapticMedium, hapticSuccess } from './utils/haptics';
import { BETA_MODE, APP_VERSION } from './config';
import quickPrepLogo from './assets/quickprep-logo-header.png';
import Login from './pages/Login';
import Kitchen from './pages/Kitchen';
import Browse from './pages/Browse';
import Saved from './pages/Saved';
import RecipeModal from './components/RecipeModal';
import FeedbackModal from './components/FeedbackModal';
import Onboarding from './components/Onboarding';
import SplashScreen from './components/SplashScreen';
import GeneratingScreen from './components/GeneratingScreen';
import { RECIPES } from './data/recipes.js';
import { filterRecipes } from './utils/pantryMatch';
import { rankForPreferences, pickBestMatch } from './utils/onboardingGoals';
import { buildFullDayPlan } from './utils/fullDayPlan';
import { now } from './utils/timing';
import './styles/globals.css';

// Set once onboarding finishes (however it finishes -- picks made, or
// skipped) so it never shows again on this device/browser. A plain
// localStorage flag rather than a Supabase profile column -- no backend
// work needed to ship this, and it doesn't need to survive a device
// switch to do its job (show the flow exactly once per install).
const ONBOARDED_KEY = 'quickprep_onboarded';

// Persists Kitchen's pantry selections + search results (see
// kitchenStaples/kitchenResults/kitchenJustOnboarded below) across a full
// page reload / app relaunch, not just across tab switches -- lifting that
// state up to App.jsx (see the comment there) only kept it alive as long
// as the in-memory session did, so refreshing the page (or force-quitting
// the app) still wiped out someone's first generated meal. Stores the
// actual result recipe objects rather than just their ids, since re-
// deriving them would mean re-running whichever of filterRecipes/
// rankForPreferences/pickBestMatch originally produced them -- simpler and
// just as correct to store the already-computed output directly, since
// it's plain, serializable data either way.
const KITCHEN_STATE_KEY = 'quickprep_kitchen_state';

function loadKitchenState() {
  try {
    const raw = localStorage.getItem(KITCHEN_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

// Persists the full-day onboarding hand-off's highlighted Diary entry ids
// (see onboardingHighlightedEntryIds below) the same way KITCHEN_STATE_KEY
// persists Kitchen's -- so the pulsing highlight/banner on those entries
// survives a page refresh or app relaunch, not just a tab switch, and
// keeps showing indefinitely until those entries are actually removed
// (Saved.jsx is what decides "still active" by checking these ids against
// what's still in the diary; this key just needs to remember the ids
// themselves across reloads).
const DIARY_ONBOARDING_HIGHLIGHT_KEY = 'quickprep_diary_onboarding_highlight';

function loadOnboardingHighlightIds() {
  try {
    const raw = localStorage.getItem(DIARY_ONBOARDING_HIGHLIGHT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Minimum time GeneratingScreen stays up after onboarding finishes (see
// handleOnboardingComplete) -- matched to .generating-bolt-fill's own
// animation-duration in globals.css so the bolt reads as freshly "full"
// right around when this screen gets swapped out, regardless of how
// long the real work underneath it actually took. Bumped up from 1.8s so
// the stuttering bolt-charge animation (globals.css) has room to actually
// read as irregular rather than rushing by.
const GENERATING_MIN_MS = 3600;

// Bottom-nav icons: bigger and always their own brand color now (no text
// label alongside them any more, so the icon alone has to carry the tab's
// identity, Duolingo-style). Kitchen keeps its stroke-outline "magnifying
// glass" look since filling it wouldn't read as anything; Browse and Saved
// switch to solid fills for a bolder, more prominent shape at this size.
function KitchenIcon({ size = 28, color = 'var(--orange)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="13" r="7" />
      <line x1="17.5" y1="9" x2="22.5" y2="5" />
    </svg>
  );
}

function BrowseIcon({ size = 28, color = 'var(--blue)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round">
      <path d="M2 5c2-1.4 5-1.4 7 0v14c-2-1.4-5-1.4-7 0V5z" />
      <path d="M22 5c-2-1.4-5-1.4-7 0v14c2-1.4 5-1.4 7 0V5z" />
    </svg>
  );
}

function SavedIcon({ size = 28, color = 'var(--pink)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4.5L6 21V3z" />
    </svg>
  );
}

// Speech-bubble icon for the floating beta feedback button.
function FeedbackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4V5z" />
    </svg>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("kitchen");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [toast, setToast] = useState(null);
  const [savedDate, setSavedDate] = useState(todayString());
  // Tracks the most recent diary entry added from inside the currently-open
  // recipe modal (see handleAddToDiary) -- Add to Diary itself no longer
  // closes the modal or jumps to the Diary tab; it just confirms via toast
  // and stays put, so someone can keep cooking/rating afterward. Only when
  // they explicitly hit Finish (see handleFinishCooking) does the app
  // navigate to Diary and briefly highlight whichever entry this was --
  // and only if something actually got added this session, otherwise
  // Finish just closes the modal like normal. Cleared whenever a new
  // recipe is opened (see handleOpenRecipe) so a stale add from a
  // previous recipe can't leak into this one.
  const [lastAddedDiaryEntry, setLastAddedDiaryEntry] = useState(null); // { date, entryId } | null
  // Handed to Saved.jsx so it can apply a few-seconds-long highlight to the
  // specific entry Finish just confirmed, rather than just landing on a
  // Diary full of entries with no indication which one is new. Separate
  // from onboardingHighlightedEntryIds below -- an ordinary "I just cooked
  // this" add doesn't deserve a permanent glow, only a brief one.
  const [highlightedDiaryEntryId, setHighlightedDiaryEntryId] = useState(null);
  // The full-day onboarding hand-off's entries (breakfast/lunch/dinner all
  // added at once) -- drives the same pulsing highlight, plus a "Your Day
  // Is Ready!" banner, on Saved.jsx. Unlike highlightedDiaryEntryId above,
  // this deliberately does NOT auto-clear on a timer: it's meant to keep
  // glowing for as long as those original onboarding picks are still
  // sitting in the Diary, mirroring Kitchen's justOnboarded hero-card
  // treatment (see Kitchen.jsx's own comment on the exact same reasoning).
  // Seeded from localStorage (see loadOnboardingHighlightIds/
  // DIARY_ONBOARDING_HIGHLIGHT_KEY above) and re-saved below any time it
  // changes, so it survives a page refresh or full app relaunch too --
  // Saved.jsx is what actually lets it "clear" itself, by only treating an
  // id as still-active if that entry still exists (see its
  // activeOnboardingHighlightIds).
  const [onboardingHighlightedEntryIds, setOnboardingHighlightedEntryIds] = useState(() => loadOnboardingHighlightIds());

  useEffect(() => {
    try {
      localStorage.setItem(DIARY_ONBOARDING_HIGHLIGHT_KEY, JSON.stringify(onboardingHighlightedEntryIds));
    } catch {
      // Storage being unavailable just means this won't survive a refresh
      // this session -- not worth blocking on.
    }
  }, [onboardingHighlightedEntryIds]);

  // Every onOpen prop (Kitchen/Browse/Saved) goes through this now instead
  // of calling setOpenRecipe directly, so opening any new recipe always
  // starts that modal's "was anything added to Diary this session" state
  // fresh.
  const handleOpenRecipe = (recipe) => {
    setLastAddedDiaryEntry(null);
    setOpenRecipe(recipe);
  };
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  // Whether the one-time first-session onboarding (see components/
  // Onboarding.jsx) still needs to run. Read from localStorage once at
  // mount -- a returning user with the flag already set skips straight
  // past it, same as today.
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDED_KEY) === '1';
    } catch {
      return true; // if storage is unavailable for some reason, don't block the app on it
    }
  });
  // Kitchen's pantry selections + search results now live up here rather
  // than as Kitchen's own local state -- Kitchen fully unmounts every time
  // you switch tabs away from it (see the tab === "kitchen" conditional
  // render below), so state that lived inside Kitchen itself was getting
  // wiped out on every tab switch, including a just-onboarded person's
  // very first generated meal. Lifting it here means it survives exactly
  // as long as the rest of the app's state does. `kitchenJustOnboarded`
  // drives Kitchen's one-time "Your First Picks Are Ready!" banner; it's
  // lifted too so a quick tab-away-and-back right after onboarding doesn't
  // lose the flag along with everything else. Seeded from localStorage
  // (see loadKitchenState/KITCHEN_STATE_KEY above) and re-saved below any
  // time it changes, so a page refresh or a fully-quit-and-reopened app
  // doesn't lose it either -- only Clear (reset) or a fresh search
  // actually replaces it, same as an ordinary in-session tab switch.
  const [kitchenStaples, setKitchenStaples] = useState(() => loadKitchenState()?.staples || []);
  const [kitchenResults, setKitchenResults] = useState(() => loadKitchenState()?.results ?? null);
  const [kitchenJustOnboarded, setKitchenJustOnboarded] = useState(() => loadKitchenState()?.justOnboarded || false);

  useEffect(() => {
    try {
      localStorage.setItem(KITCHEN_STATE_KEY, JSON.stringify({
        staples: kitchenStaples,
        results: kitchenResults,
        justOnboarded: kitchenJustOnboarded,
      }));
    } catch {
      // Storage being unavailable just means this won't survive a refresh
      // this session -- not worth blocking on.
    }
  }, [kitchenStaples, kitchenResults, kitchenJustOnboarded]);
  // Gates the animated welcome screen (see components/SplashScreen.jsx) --
  // shown after every sign-in, and after every fresh app open, not just
  // the brand-new-user path before onboarding (see the render gate below,
  // which checks this before even looking at `onboarded`). Deliberately
  // plain useState (not localStorage-backed) so it resets -- and the
  // welcome screen plays again -- on every real app launch/reload, while
  // still only playing once per already-running session (switching tabs
  // or reopening a recipe modal doesn't remount App, so it won't replay
  // mid-session).
  const [splashDone, setSplashDone] = useState(false);
  // Whether the post-onboarding GeneratingScreen (see components/
  // GeneratingScreen.jsx) should render instead of the tab it's about to
  // land on. Only relevant for the "picks were actually made" path below
  // -- a full skip has nothing to generate, so it's never set there. As
  // a side benefit, this also fully guarantees Kitchen can't render
  // during the full-day path's diary inserts (belt-and-suspenders on top
  // of setTab('saved') below), since nothing gets past this gate at all
  // until generatingMeals flips back to false.
  const [generatingMeals, setGeneratingMeals] = useState(false);

  // Called with either { staples, goal, servingsPref, mealCountPref } or
  // null (full skip) from Onboarding. Either way, marks onboarding done so
  // it never shows again on this device. What happens next branches on
  // mealCountPref: "one" hands the picks to Kitchen (same as before this
  // question existed) so it shows a real search result immediately;
  // "full_day" skips Kitchen entirely and logs a whole day -- Breakfast,
  // Lunch, and Dinner -- straight to today's Diary instead, landing on the
  // Saved tab (which doubles as the Diary view) so the very first thing a
  // new user sees is their day already planned. Either path reuses exactly
  // the same pantry-match + preference-ranking logic Kitchen's own search
  // uses (see utils/pantryMatch.js + utils/onboardingGoals.js), just fed
  // into utils/fullDayPlan.js's per-slot picker for the full-day case.
  //
  // Whenever picks were actually made (not a full skip), GeneratingScreen
  // covers this whole function's work -- the single-recipe path has no
  // real async work of its own, so GENERATING_MIN_MS below is what gives
  // the loading screen something to actually show; the full-day path's
  // real diary inserts count against that same minimum instead of adding
  // on top of it, so the wait never stacks needlessly.
  const handleOnboardingComplete = async (picks) => {
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      // Storage being unavailable just means onboarding may show again
      // next visit -- not worth blocking on.
    }
    setOnboarded(true);

    if (!picks) return; // full skip -- land on the normal empty Kitchen tab, same as always.

    setGeneratingMeals(true);
    const start = now();

    if (picks.mealCountPref === 'full_day') {
      // Set before the first `await` below, in the same synchronous pass
      // as setOnboarded(true)/setGeneratingMeals(true) above, so tab is
      // already "saved" (and generatingMeals is already covering the
      // screen) the instant Kitchen's default tab state would otherwise
      // have rendered.
      setTab('saved');
      const preferredPool = rankForPreferences(filterRecipes(RECIPES, picks.staples), picks);
      const plan = buildFullDayPlan(preferredPool, picks);
      const date = todayString();
      const addedEntryIds = [];
      for (const slot of ['breakfast', 'lunch', 'dinner']) {
        const recipe = plan[slot];
        if (!recipe) continue;
        // Sequential (not Promise.all) -- three inserts for one person's
        // onboarding, not a hot loop; sequential keeps addedEntryIds in a
        // predictable order.
        const entryRow = await diary.addEntry(date, slot, recipe.id, true);
        if (entryRow) addedEntryIds.push(entryRow.id);
      }
      if (addedEntryIds.length > 0) {
        hapticSuccess();
        // No toast here any more -- instead of a white-text popup, the
        // three newly-added entries themselves get the same pulsing
        // blue-gold highlight (and a "Your Day Is Ready!" banner) that
        // Kitchen's single-meal onboarding hand-off already uses, so the
        // celebration lives right on the actual Diary entries rather than
        // in a transient toast. Unlike the ordinary Finish-cooking
        // highlight, this one persists until those entries are removed --
        // see onboardingHighlightedEntryIds above, consumed by Saved.jsx.
        setOnboardingHighlightedEntryIds(addedEntryIds);
      }
    } else {
      // The single-meal path always seeds Kitchen now, even when no
      // pantry staples were selected ("I'll Add These Later") -- falling
      // back to a single random pick matching whatever goal/servingsPref/
      // mealType WERE chosen in that case (see utils/onboardingGoals.js's
      // pickBestMatch), rather than landing on the ordinary empty Kitchen
      // state just because no specific ingredients were picked. This used
      // to be handed to Kitchen as a raw `initialPicks` prop for Kitchen
      // itself to seed from on mount; now that Kitchen's staples/results
      // state lives up here (see kitchenStaples/kitchenResults above), the
      // same seeding logic runs right here instead.
      setKitchenStaples(picks.staples || []);
      let seededResults;
      if (picks.staples?.length) {
        seededResults = rankForPreferences(filterRecipes(RECIPES, picks.staples), picks);
      } else {
        const pool = picks.mealType
          ? RECIPES.filter((r) => r.mealType === picks.mealType)
          : RECIPES;
        const pick = pickBestMatch(pool, picks);
        seededResults = pick ? [pick] : null;
      }
      setKitchenResults(seededResults);
      setKitchenJustOnboarded(seededResults !== null);
    }

    // Pads the rest of GeneratingScreen's minimum display time -- without
    // this, the single-recipe path (no awaits above at all) would finish
    // instantly and the loading screen would flash by too fast to read,
    // and even the full-day path's real diary-insert time varies with
    // network conditions rather than reliably matching the bolt-charge
    // animation's duration.
    const elapsed = now() - start;
    const remaining = GENERATING_MIN_MS - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    setGeneratingMeals(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const {
    saved,
    isSaved,
    toggleSaved,
    getEntry,
    updateNotes,
    updateIngredientOverride,
    updateInstructionOverride,
    updateStepNote,
  } = useSavedRecipes();
  const { getRatingSummary, getMyRatingEntry, rateRecipe, getPhotoSignedUrl } = useRecipeRatings(session?.user?.id);
  const diary = useDiary(session?.user?.id);

  // Only re-picks a greeting line when today's set of filled meal slots
  // actually changes (a stable string key), not on every unrelated render
  // -- otherwise it would reshuffle mid-session, which reads as glitchy
  // rather than fresh. A full app reload remounts everything, so it always
  // picks a new random line then regardless.
  const todayFilledSlotsKey = diary
    .getEntriesForDate(todayString())
    .map((e) => e.meal_slot)
    .sort()
    .join(',');
  const greeting = useMemo(
    () => getGreeting(todayFilledSlotsKey ? todayFilledSlotsKey.split(',') : []),
    [todayFilledSlotsKey]
  );

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Calls the delete-account Edge Function, which removes the user's diary
  // entries, ratings, and uploaded photos server-side before deleting the
  // auth account itself. Saved recipes/customizations are device-local
  // (localStorage), so those are cleared here rather than server-side.
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This permanently deletes your account, diary, ratings, and any photos you've uploaded. This can't be undone. Continue?"
    );
    if (!confirmed) return;
    hapticMedium();
    const { error } = await supabase.functions.invoke('delete-account');
    if (error) {
      showToast("Couldn't delete account -- try again.");
      return;
    }
    try {
      localStorage.removeItem('quickprep_saved_recipes');
      localStorage.removeItem('quickprep_recipe_customizations');
    } catch (err) {
      console.error('Error clearing local recipe data:', err);
    }
    await supabase.auth.signOut();
  };

  // Bridges RecipeModal's (recipeId, date, slot) call shape to useDiary's
  // addEntry(entryDate, mealSlot, recipeId) shape -- keeping the argument
  // reordering in one place instead of relying on both sides agreeing on it.
  //
  // Deliberately does NOT switch tabs or close the modal any more -- doing
  // both immediately, right when someone taps a date/slot, meant Add to
  // Diary always ended the whole recipe session on the spot, even if they
  // were just planning ahead and still meant to keep reading or start
  // cooking. Now it just confirms via toast and stays put; navigating to
  // Diary only happens later, when Finish is explicitly clicked (see
  // handleFinishCooking below), and only because something was actually
  // added this session.
  const handleAddToDiary = async (recipeId, date, slot) => {
    const entryRow = await diary.addEntry(date, slot, recipeId);
    if (entryRow) {
      hapticSuccess();
      showToast("Added to Diary!");
      setLastAddedDiaryEntry({ date, entryId: entryRow.id });
    }
    return !!entryRow;
  };

  // Called when Finish is clicked on the recipe modal's closing rating
  // page (as opposed to the plain "✕ Close" button/backdrop, which just
  // closes -- see RecipeModal's onClose vs onFinish props). Only navigates
  // to Diary (and briefly highlights whatever was added -- see
  // highlightedDiaryEntryId, consumed by Saved.jsx) if this particular
  // modal session actually added something; otherwise Finish behaves
  // exactly like closing normally.
  const handleFinishCooking = () => {
    if (lastAddedDiaryEntry) {
      setSavedDate(lastAddedDiaryEntry.date);
      setHighlightedDiaryEntryId(lastAddedDiaryEntry.entryId);
      setTab("saved");
      setLastAddedDiaryEntry(null);
    }
    setOpenRecipe(null);
  };

  // Beta-only: writes a feedback submission tied to the signed-in user,
  // whichever tab they were on, and the deployed build's git short SHA
  // (APP_VERSION) so a report can be matched to the exact build it came
  // from. Returns true/false so the modal can show success or let the
  // person retry.
  const handleSendFeedback = async (message) => {
    if (!session?.user) return false;
    const { error } = await supabase.from('feedback').insert({
      user_id: session.user.id,
      user_email: session.user.email,
      message,
      screen: tab,
      app_version: APP_VERSION,
    });
    if (error) {
      console.error('Error sending feedback:', error);
      return false;
    }
    hapticSuccess();
    return true;
  };

  if (loading) {
    return <GeneratingScreen text="Loading…" />;
  }

  if (!session) {
    return <Login />;
  }

  // The animated welcome screen (see components/SplashScreen.jsx) plays
  // right after every sign-in and every fresh app open -- checked before
  // `onboarded` so it's the very first thing anyone sees, whether this is
  // a brand-new account about to land on "What are you after?" or a
  // returning user headed straight back into their own Kitchen/Diary.
  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  // Shown once, right after a brand-new sign-in -- before the very first
  // Kitchen tab a person ever sees, not layered on top of it. See
  // ONBOARDED_KEY/handleOnboardingComplete above for how this gate clears
  // itself permanently once finished (or skipped).
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Covers the moment right after onboarding finishes while
  // handleOnboardingComplete above is still doing its work (or just
  // padding out to its minimum display time) -- see
  // components/GeneratingScreen.jsx. Checked after the !onboarded branch
  // so it only ever applies on that one handoff, never on an ordinary
  // tab switch later.
  if (generatingMeals) {
    return <GeneratingScreen />;
  }

  // softColor backs the sliding highlight pill behind the active tab (see
  // the bottom nav below) -- a literal rgba rather than deriving one from
  // the `color` CSS var, since you can't append an alpha channel to a var()
  // that already resolves to a full hex string.
  const tabs = [
    {id: "kitchen", Icon: KitchenIcon, color: 'var(--orange)', softColor: 'rgba(255,133,51,0.22)'},
    {id: "browse", Icon: BrowseIcon, color: 'var(--blue)', softColor: 'rgba(77,184,255,0.22)'},
    {id: "saved", Icon: SavedIcon, color: 'var(--pink)', softColor: 'rgba(255,107,170,0.22)'},
  ];
  const activeTabIndex = tabs.findIndex((t) => t.id === tab);

  return (
    <>
      <div className="app-bg" aria-hidden="true"></div>
      <div className="app">
        {/* Header -- background is the animated blue metallic bar (see
            .app-header-bar in globals.css); layout/spacing stays inline. */}
        <div className="app-header-bar" style={{padding: "calc(14px + env(safe-area-inset-top)) 18px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <div>
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                {/* The designed "QuickPrep" wordmark (white text + gold
                    lightning bolt, glow baked in) replaces the old plain-text
                    wordmark + separate bolt icon -- see
                    src/assets/quickprep-logo-header.png, cropped down from
                    Images/quickprep_logo2_headerlogo.png (a much larger
                    canvas with a lot of surrounding transparent margin) to
                    just the glyph + its glow so it isn't tiny inside the
                    header row. Sized by height, same as the icon it
                    replaces, so the header's overall height doesn't shift. */}
                <img
                  src={quickPrepLogo}
                  alt="QuickPrep"
                  style={{ height: 32, width: "auto", display: "block" }}
                />
                {BETA_MODE && (
                  <span style={{fontSize: 10, fontWeight: 700, color: "#000", background: "var(--lime)", borderRadius: 100, padding: "2px 7px", letterSpacing: 0.5}}>
                    BETA
                  </span>
                )}
              </div>
              {/* Daily message set in the same playful Baloo 2 used for the
                  three page headers (see .page-h1), rather than the app's
                  usual Manrope -- a small consistent touch of personality
                  right where it's first seen. */}
              <div style={{fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: 12, color: "rgba(255,255,255,.85)", textShadow: "0 1px 2px rgba(0,0,0,.35)", marginTop: 3}}>
                {greeting}
              </div>
            </div>
          </div>
          <div style={{position: "relative"}}>
            <button
              onClick={() => { hapticSelection(); setShowMenu((v) => !v); }}
              aria-label="Account menu"
              style={{
                // var(--s2)/s3 are translucent white overlays meant to sit
                // on the app's near-black background -- against the solid
                // teal header they read as barely-there. The first retry
                // used an opaque dark teal-blue, but that's still close
                // enough in hue/brightness to the header's own teal to
                // look like a faint shadow rather than a distinct button.
                // Pure near-black (matching the bottom nav's solid #000)
                // gives real contrast against the teal.
                background: "#000",
                border: "1px solid var(--border)",
                color: "var(--cream)",
                borderRadius: 8,
                width: 32,
                height: 32,
                fontSize: 18,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ⋯
            </button>
            {showMenu && (
              <>
                <div onClick={() => setShowMenu(false)} style={{position: "fixed", inset: 0, zIndex: 29}} />
                <div style={{
                  position: "absolute",
                  top: 38,
                  right: 0,
                  // var(--s1) is an 8%-opacity white overlay -- fine on the
                  // app's near-black background, but over the teal header
                  // (or bleeding through to it) it reads as translucent,
                  // same root cause as the ellipsis button above. Solid
                  // black matches that fix and the bottom nav.
                  background: "#000",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  overflow: "hidden",
                  zIndex: 30,
                  minWidth: 150,
                  boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                }}>
                  <div
                    onClick={() => { setShowMenu(false); handleSignOut(); }}
                    style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "var(--cream)", cursor: "pointer", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}
                  >
                    Sign Out
                  </div>
                  <div
                    onClick={() => { setShowMenu(false); handleDeleteAccount(); }}
                    style={{ padding: "10px 14px", fontSize: 12, color: "#ff8080", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Delete Account
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Page content */}
        {tab === "kitchen" && (
          <Kitchen
            onOpen={handleOpenRecipe}
            getRatingSummary={getRatingSummary}
            selectedStaples={kitchenStaples}
            setSelectedStaples={setKitchenStaples}
            results={kitchenResults}
            setResults={setKitchenResults}
            justOnboarded={kitchenJustOnboarded}
            onDismissJustOnboarded={() => setKitchenJustOnboarded(false)}
          />
        )}
        {tab === "browse" && <Browse onOpen={handleOpenRecipe} isSaved={isSaved} toggleSaved={toggleSaved} getRatingSummary={getRatingSummary} />}
        {tab === "saved" && (
          <Saved
            saved={saved}
            isSaved={isSaved}
            toggleSaved={toggleSaved}
            onOpen={handleOpenRecipe}
            getRatingSummary={getRatingSummary}
            getEntry={getEntry}
            diary={diary}
            selectedDate={savedDate}
            onDateChange={setSavedDate}
            highlightedEntryId={highlightedDiaryEntryId}
            onConsumeHighlightedEntry={() => setHighlightedDiaryEntryId(null)}
            onboardingHighlightedEntryIds={onboardingHighlightedEntryIds}
          />
        )}

        {/* Bottom nav -- MyFitnessPal-style floating pill: a frosted-glass
            bar (translucent fill + backdrop blur, so scrolled content
            underneath reads as softly blurred rather than either fully
            see-through or a flat opaque block) sitting with a gap above the
            true screen edge, in a heavily rounded/pill-shaped container.
            The active tab is marked by a sliding soft-colored pill behind
            its icon (each tab's own color at low opacity, see `softColor`
            above) instead of the old top border line -- it animates its
            position with a slight bounce (cubic-bezier overshoot) whenever
            the tab changes, rather than snapping instantly. */}
        <div style={{position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 24px)", maxWidth: 406, zIndex: 20}}>
          <div style={{
            position: "relative",
            display: "flex",
            background: "rgba(4,20,26,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 32,
            padding: 6,
            boxShadow: "0 10px 30px rgba(0,0,0,.4)",
          }}>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 6,
                bottom: 6,
                left: `calc(6px + (100% - 12px) / 3 * ${activeTabIndex})`,
                width: "calc((100% - 12px) / 3)",
                background: tabs[activeTabIndex]?.softColor,
                borderRadius: 26,
                transition: "left .4s cubic-bezier(.34,1.56,.64,1), background .25s ease",
              }}
            />
            {tabs.map(t => (
              <div key={t.id} onClick={() => { if (t.id !== tab) { hapticSelection(); setTab(t.id); } }}
                style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0", cursor: "pointer", position: "relative", zIndex: 1}}>
                <t.Icon color={tab === t.id ? t.color : "var(--muted)"} />
              </div>
            ))}
          </div>
        </div>

        {/* Beta feedback button -- floating, above the bottom nav, visible
            on every tab since it lives in the persistent app shell rather
            than any one page. Aligned to the same centered column as the
            bottom nav so it lines up correctly on wide viewports too. */}
        {BETA_MODE && (
          <div style={{position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, height: 0, zIndex: 50, pointerEvents: "none"}}>
            <button
              onClick={() => { hapticLight(); setShowFeedback(true); }}
              title="Send feedback"
              style={{
                position: "absolute",
                right: 18,
                // Bottom nav is now a floating pill sitting 14px above the
                // true screen edge (see the nav block above) rather than
                // flush at bottom:0, so this shifted up to clear it. Kitchen
                // tab has its own sticky action bar just above that floating
                // nav (see Kitchen.jsx) -- push the feedback button up
                // further there so it doesn't sit on top of it.
                bottom: tab === "kitchen" ? 172 : 90,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--lime)",
                color: "#000",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <FeedbackIcon />
            </button>
          </div>
        )}

        {/* Toast -- centered on screen rather than anchored to the bottom
            nav area. It was easy to miss down there, and worse, its
            z-index (60) sat BELOW the recipe modal's overlay (100), so any
            toast fired while a recipe was open (e.g. "Saved to Favorites"
            after adding a note) was rendered completely behind the modal's
            dark backdrop -- invisible, not just low. Centering it and
            raising it above every modal in the app (highest z-index used
            elsewhere is 110) fixes both at once. */}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--lime)",
              color: "#000",
              padding: "14px 22px",
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Manrope',sans-serif",
              zIndex: 200,
              boxShadow: "0 8px 28px rgba(0,0,0,.45)",
              maxWidth: 300,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {toast}
          </div>
        )}
      </div>

      {openRecipe && (
        <RecipeModal
          key={openRecipe.id}
          recipe={openRecipe}
          onClose={() => setOpenRecipe(null)}
          onFinish={handleFinishCooking}
          isSaved={isSaved}
          toggleSaved={toggleSaved}
          entry={getEntry(openRecipe.id)}
          onUpdateNotes={updateNotes}
          onUpdateIngredientOverride={updateIngredientOverride}
          onUpdateInstructionOverride={updateInstructionOverride}
          onUpdateStepNote={updateStepNote}
          ratingSummary={getRatingSummary(openRecipe.id)}
          myRatingEntry={getMyRatingEntry(openRecipe.id)}
          onRate={rateRecipe}
          getPhotoSignedUrl={getPhotoSignedUrl}
          onAddToDiary={handleAddToDiary}
          onFavoriteAutoSaved={() => showToast('★ Saved to Favorites')}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          onClose={() => setShowFeedback(false)}
          onSubmit={handleSendFeedback}
        />
      )}
    </>
  );
}
