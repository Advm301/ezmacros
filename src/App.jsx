import { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import useSavedRecipes from './hooks/useSavedRecipes';
import useRecipeRatings from './hooks/useRecipeRatings';
import useDiary, { todayString } from './hooks/useDiary';
import { getGreeting } from './utils/greeting';
import { hapticSelection, hapticLight, hapticMedium, hapticSuccess } from './utils/haptics';
import { BETA_MODE, APP_VERSION } from './config';
import appIconImg from './assets/app-icon.png';
import Login from './pages/Login';
import Kitchen from './pages/Kitchen';
import Browse from './pages/Browse';
import Saved from './pages/Saved';
import RecipeModal from './components/RecipeModal';
import FeedbackModal from './components/FeedbackModal';
import './styles/globals.css';

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

// App icon -- the real designed icon (meal-prep container with a
// lightning bolt), used in the header logo slot as a white silhouette so
// it blends directly into the teal header instead of sitting in a boxed
// tile. The iOS app icon, favicon, and PWA icons use a separate,
// full-color version composited onto an opaque background (those can't
// be transparent) -- see src/assets/app-icon.png for this one.
function AppIcon() {
  return <img src={appIconImg} alt="" style={{ width: 30, height: 'auto', display: 'block' }} />;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("kitchen");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [toast, setToast] = useState(null);
  const [savedDate, setSavedDate] = useState(todayString());
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
  } = useSavedRecipes(() => showToast('★ Saved to Favorites'));
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
  const handleAddToDiary = async (recipeId, date, slot) => {
    const ok = await diary.addEntry(date, slot, recipeId);
    if (ok) {
      hapticSuccess();
      setSavedDate(date);
      setTab("saved");
      showToast("Recipe added to Diary!");
      setOpenRecipe(null);
    }
    return ok;
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
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{color: "var(--muted)"}}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
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
        {/* Header */}
        <div style={{padding: "14px 18px 10px", position: "sticky", top: 0, background: "var(--teal)", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <div style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <AppIcon />
            </div>
            <div>
              <div style={{display: "flex", alignItems: "center", gap: 6}}>
                <div style={{fontFamily: "'Manrope',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--cream)", lineHeight: 1.1}}>
                  QuickPrep
                </div>
                {BETA_MODE && (
                  <span style={{fontSize: 10, fontWeight: 700, color: "#000", background: "var(--lime)", borderRadius: 100, padding: "2px 7px", letterSpacing: 0.5}}>
                    BETA
                  </span>
                )}
              </div>
              <div style={{fontSize: 11, color: "var(--muted)", marginTop: 2}}>
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
        {tab === "kitchen" && <Kitchen onOpen={setOpenRecipe} getRatingSummary={getRatingSummary} />}
        {tab === "browse" && <Browse onOpen={setOpenRecipe} isSaved={isSaved} toggleSaved={toggleSaved} getRatingSummary={getRatingSummary} />}
        {tab === "saved" && (
          <Saved
            saved={saved}
            isSaved={isSaved}
            toggleSaved={toggleSaved}
            onOpen={setOpenRecipe}
            getRatingSummary={getRatingSummary}
            getEntry={getEntry}
            diary={diary}
            selectedDate={savedDate}
            onDateChange={setSavedDate}
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
