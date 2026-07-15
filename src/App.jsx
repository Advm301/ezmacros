import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import useSavedRecipes from './hooks/useSavedRecipes';
import useRecipeRatings from './hooks/useRecipeRatings';
import useDiary, { todayString } from './hooks/useDiary';
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

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("kitchen");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [toast, setToast] = useState(null);
  const [savedView, setSavedView] = useState("saved");
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
  const { getRatingSummary, getMyRatingEntry, rateRecipe } = useRecipeRatings(session?.user?.id);
  const diary = useDiary(session?.user?.id);

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
      setSavedView("diary");
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
        <div style={{padding: "14px 18px 10px", position: "sticky", top: 0, background: "var(--teal)", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{fontFamily: "'Manrope',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--cream)"}}>
            QuickPrep
          </div>
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
            view={savedView}
            onViewChange={setSavedView}
            selectedDate={savedDate}
            onDateChange={setSavedDate}
          />
        )}

        {/* Bottom nav */}
        <div style={{position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#000", borderTop: "1px solid var(--border)", display: "flex", zIndex: 20}}>
          {tabs.map(t => (
            <div key={t.id} onClick={() => setTab(t.id)}
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
          onAddToDiary={handleAddToDiary}
        />
      )}
    </>
  );
}
