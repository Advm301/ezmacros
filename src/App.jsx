import { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import useSavedRecipes from './hooks/useSavedRecipes';
import useRecipeRatings from './hooks/useRecipeRatings';
import useDiary, { todayString } from './hooks/useDiary';
import { getGreeting } from './utils/greeting';
import { hapticSelection, hapticMedium, hapticSuccess } from './utils/haptics';
import Login from './pages/Login';
import Kitchen from './pages/Kitchen';
import Browse from './pages/Browse';
import Saved from './pages/Saved';
import RecipeModal from './components/RecipeModal';
import './styles/globals.css';

function KitchenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="13" r="7" />
      <line x1="17.5" y1="9" x2="22.5" y2="5" />
    </svg>
  );
}

function BrowseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5c2-1.4 5-1.4 7 0v14c-2-1.4-5-1.4-7 0V5z" />
      <path d="M22 5c-2-1.4-5-1.4-7 0v14c2-1.4 5-1.4 7 0V5z" />
    </svg>
  );
}

function SavedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4.5L6 21V3z" />
    </svg>
  );
}

// App icon glyph -- a meal-prep container with a lightning bolt (quick /
// ready-to-go). Used in the header logo slot; the same shape (on a solid
// teal square) is the iOS app icon, favicon, and PWA icons.
function AppIcon() {
  return (
    <svg width="22" height="14" viewBox="0 0 240 154" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="10" width="212" height="42" rx="21" />
      <path d="M104,52 L104,76 A10,10 0 0 0 114,86 L126,86 A10,10 0 0 0 136,76 L136,52" />
      <path d="M14,80 L226,80 L226,130 A14,14 0 0 1 212,144 L28,144 A14,14 0 0 1 14,130 Z" />
      <line x1="14" y1="118" x2="226" y2="118" />
      <path d="M129,86 L100,118 L115,118 L106,144 L140,109 L123,109 Z" fill="currentColor" stroke="none" />
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
  const {
    saved,
    isSaved,
    toggleSaved,
    getEntry,
    updateNotes,
    updateIngredientOverride,
    updateInstructionOverride,
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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
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

  const tabs = [
    {id: "kitchen", label: "Kitchen", Icon: KitchenIcon},
    {id: "browse", label: "Browse", Icon: BrowseIcon},
    {id: "saved", label: "Diary", Icon: SavedIcon},
  ];

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
              borderRadius: 10,
              background: "var(--s2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--lime)",
            }}>
              <AppIcon />
            </div>
            <div>
              <div style={{fontFamily: "'Manrope',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--cream)", lineHeight: 1.1}}>
                QuickPrep
              </div>
              <div style={{fontSize: 11, color: "var(--muted)", marginTop: 2}}>
                {greeting}
              </div>
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5}}>
            <button
              onClick={handleSignOut}
              style={{
                background: "var(--s2)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
            <div
              onClick={handleDeleteAccount}
              style={{ fontSize: 10, color: "var(--muted)", textDecoration: "underline", cursor: "pointer" }}
            >
              Delete Account
            </div>
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

        {/* Bottom nav */}
        <div style={{position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#000", borderTop: "1px solid var(--border)", display: "flex", zIndex: 20}}>
          {tabs.map(t => (
            <div key={t.id} onClick={() => { if (t.id !== tab) { hapticSelection(); setTab(t.id); } }}
              style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", cursor: "pointer", color: tab === t.id ? "var(--lime)" : "var(--muted)", borderTop: tab === t.id ? "2px solid var(--lime)" : "2px solid transparent", transition: "all .15s", position: "relative"}}>
              <t.Icon />
              <span style={{fontSize: 11, fontWeight: 600, marginTop: 2}}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 76,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--lime)",
              color: "#000",
              padding: "10px 18px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Manrope',sans-serif",
              zIndex: 60,
              boxShadow: "0 4px 14px rgba(0,0,0,.35)",
              whiteSpace: "nowrap",
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
          ratingSummary={getRatingSummary(openRecipe.id)}
          myRatingEntry={getMyRatingEntry(openRecipe.id)}
          onRate={rateRecipe}
          getPhotoSignedUrl={getPhotoSignedUrl}
          onAddToDiary={handleAddToDiary}
        />
      )}
    </>
  );
}
