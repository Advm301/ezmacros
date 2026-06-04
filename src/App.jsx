import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Today from './pages/Today';
import Kitchen from './pages/Kitchen';
import Browse from './pages/Browse';
import RecipeModal from './components/RecipeModal';
import './styles/globals.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [goals] = useState({cal: 2200, protein: 180, carbs: 220, fat: 60});
  const ezLevel = 2;

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
    {id: "today", label: "Today", icon: "📊"},
    {id: "kitchen", label: "Kitchen", icon: "🍳"},
    {id: "browse", label: "Browse", icon: "📖"},
  ];

  return (
    <>
      <div className="app">
        {/* Header */}
        <div style={{padding: "14px 18px 10px", position: "sticky", top: 0, background: "var(--bg)", borderBottom: "1px solid var(--border)", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{fontFamily: "'Clash Display',sans-serif", fontSize: 20, fontWeight: 700}}>
            <span style={{color: "var(--lime)"}}>EZ</span><span style={{color: "var(--cream)"}}>Macros</span>
          </div>
          <div style={{background: "var(--s2)", border: "1px solid var(--lime)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "var(--lime)"}}>
            ⚡⚡ Easy
          </div>
        </div>

        {/* Page content */}
        {tab === "today" && <Today/>}
        {tab === "kitchen" && <Kitchen ezLevel={ezLevel} goals={goals} onOpen={setOpenRecipe}/>}
        {tab === "browse" && <Browse ezLevel={ezLevel} onOpen={setOpenRecipe}/>}

        {/* Bottom nav */}
        <div style={{position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--s1)", borderTop: "1px solid var(--border)", display: "flex", zIndex: 20}}>
          {tabs.map(t => (
            <div key={t.id} onClick={() => setTab(t.id)}
              style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", cursor: "pointer", color: tab === t.id ? "var(--lime)" : "var(--muted)", borderTop: tab === t.id ? "2px solid var(--lime)" : "2px solid transparent", transition: "all .15s"}}>
              <span style={{fontSize: 20}}>{t.icon}</span>
              <span style={{fontSize: 11, fontWeight: 600, marginTop: 2}}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {openRecipe && <RecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)}/>}
    </>
  );
}
