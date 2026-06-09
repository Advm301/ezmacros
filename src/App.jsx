import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import useFavorites from './hooks/useFavorites';
import useMealPlanner from './hooks/useMealPlanner';
import Login from './pages/Login';
import Today from './pages/Today';
import Kitchen from './pages/Kitchen';
import Browse from './pages/Browse';
import RecipeModal from './components/RecipeModal';
import GoalsModal from './components/GoalsModal';
import './styles/globals.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [goals, setGoals] = useState({cal: 2200, protein: 180, carbs: 220, fat: 60, goal_weight_lbs: null});
  const [mealLoggedNotification, setMealLoggedNotification] = useState(false);
  const [todayBadge, setTodayBadge] = useState(false);
  const [ezLevel, setEzLevel] = useState(2);
  const [openGoalsModal, setOpenGoalsModal] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedGoalsTab, setSelectedGoalsTab] = useState("calculate");
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const mealPlanner = useMealPlanner();

  const ezLevelNames = {
    1: { name: 'Effortless', icon: '⚡', bolts: '⚡' },
    2: { name: 'Easy', icon: '⚡⚡', bolts: '⚡⚡' },
    3: { name: 'Relaxed', icon: '⚡⚡⚡', bolts: '⚡⚡⚡' },
  };

  const updateEzLevel = (levelName) => {
    console.log('[DEBUG] updateEzLevel called with:', levelName);
    // Convert levelName to numeric level: Effortless->1, Easy->2, Relaxed->3
    const levelMap = { 'Effortless': 1, 'Easy': 2, 'Relaxed': 3 };
    const level = levelMap[levelName];
    if (level) {
      console.log('[DEBUG] Setting ezLevel to:', level);
      setEzLevel(level);
    } else {
      console.warn('[DEBUG] Invalid levelName:', levelName, '- levelMap:', levelMap);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('[DEBUG] Session check:', currentSession ? 'logged in' : 'logged out');
        setSession(currentSession);
        if (currentSession?.user) {
          console.log('[DEBUG] Setting user:', currentSession.user.email);
          setUser(currentSession.user);
        }
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
        if (currentSession?.user) {
          setUser(currentSession.user);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch saved ez_level from Supabase on mount
  useEffect(() => {
    const fetchSavedEzLevel = async () => {
      if (!session?.user?.id) {
        console.log('[DEBUG] No session yet, skipping ez_level fetch');
        return;
      }

      try {
        const { data: goalsData } = await supabase
          .from('goals')
          .select('ez_level')
          .eq('user_id', session.user.id)
          .maybeSingle();

        console.log('[DEBUG] Fetched goals data:', goalsData);

        if (goalsData?.ez_level !== null && goalsData?.ez_level !== undefined) {
          const level = goalsData.ez_level;
          console.log('[DEBUG] Found saved ez_level:', level);
          // Database stores 1, 2, 3 - check if valid
          if (level >= 1 && level <= 3) {
            console.log('[DEBUG] Setting ezLevel to:', level);
            setEzLevel(level);
          } else {
            console.warn('[DEBUG] Invalid ez_level from DB:', level);
          }
        } else {
          console.log('[DEBUG] No saved ez_level found, using default');
        }
      } catch (err) {
        console.error('Error fetching ez_level:', err);
      }
    };

    fetchSavedEzLevel();
  }, [session]);

  const handleMealLogged = () => {
    setMealLoggedNotification(true);
    setTodayBadge(true);
    setTimeout(() => {
      setMealLoggedNotification(false);
    }, 2000);
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
    {id: "today", label: "Journal", icon: "📊"},
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
          <div
            onClick={() => {
              console.log('[DEBUG] EZ selector button clicked. Current openGoalsModal:', openGoalsModal, 'Current ezLevel:', ezLevel);
              setOpenGoalsModal(true);
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--s1)";
              e.target.style.borderColor = "var(--lime)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--s2)";
              e.target.style.borderColor = "var(--lime)";
            }}
            style={{background: "var(--s2)", border: "1px solid var(--lime)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "var(--lime)", cursor: "pointer", transition: "all 0.15s"}}>
            {ezLevelNames[ezLevel]?.icon || '⚡⚡'} {ezLevelNames[ezLevel]?.name || 'Easy'}
          </div>
        </div>

        {/* Page content */}
        {tab === "today" && <Today mealPlanner={mealPlanner} goals={goals} onTabFocus={() => setTodayBadge(false)} onUpdateEzLevel={updateEzLevel} onUpdateGoals={(fetchedGoals) => {
          console.log('[DEBUG] App.jsx onUpdateGoals called with:', fetchedGoals);
          setGoals(fetchedGoals);
        }} favorites={favorites} isFavorited={isFavorited} toggleFavorite={toggleFavorite}/>}
        {tab === "kitchen" && <Kitchen ezLevel={ezLevel} goals={goals} onOpen={setOpenRecipe}/>}
        {tab === "browse" && <Browse ezLevel={ezLevel} onOpen={setOpenRecipe} favorites={favorites} isFavorited={isFavorited} toggleFavorite={toggleFavorite}/>}

        {/* Bottom nav */}
        <div style={{position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--s1)", borderTop: "1px solid var(--border)", display: "flex", zIndex: 20}}>
          {tabs.map(t => (
            <div key={t.id} onClick={() => {
              setTab(t.id);
              if (t.id === "today") setTodayBadge(false);
            }}
              style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", cursor: "pointer", color: tab === t.id ? "var(--lime)" : "var(--muted)", borderTop: tab === t.id ? "2px solid var(--lime)" : "2px solid transparent", transition: "all .15s", position: "relative"}}>
              <span style={{fontSize: 20, position: "relative"}}>
                {t.icon}
                {todayBadge && t.id === "today" && (
                  <div style={{position: "absolute", top: 0, right: -8, width: 8, height: 8, background: "var(--lime)", borderRadius: "50%"}} />
                )}
              </span>
              <span style={{fontSize: 11, fontWeight: 600, marginTop: 2}}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Meal Logged Notification */}
        {mealLoggedNotification && (
          <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "var(--s1)", border: "2px solid var(--lime)", borderRadius: 16, padding: 24, textAlign: "center", zIndex: 100, animation: "fadeInOut 2s ease-in-out"}}>
            <div style={{fontSize: 32, color: "var(--lime)", marginBottom: 12}}>✓</div>
            <div style={{fontSize: 18, fontWeight: 700, color: "var(--cream)"}}>Meal Logged!</div>
          </div>
        )}
        <style>{`@keyframes fadeInOut { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }`}</style>
      </div>

      {openRecipe && <RecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} onMealLogged={handleMealLogged} isFavorited={isFavorited} toggleFavorite={toggleFavorite}/>}

      {openGoalsModal && (
        <>
          {console.log('[DEBUG] GoalsModal rendering with props:', { goals, ezLevel, user: !!user, openGoalsModal })}
          <GoalsModal
            goals={{...goals, ez_level: ezLevel}}
            user={user}
            selectedTab={selectedGoalsTab}
            onTabChange={(tab) => {
              console.log('[DEBUG] GoalsModal tab changed to:', tab);
              setSelectedGoalsTab(tab);
            }}
            onClose={() => {
              console.log('[DEBUG] GoalsModal onClose called');
              setOpenGoalsModal(false);
            }}
            onSave={(newGoals) => {
              console.log('[DEBUG] GoalsModal onSave called with:', newGoals);
              console.log('[DEBUG] Updated goals with goal_weight_lbs:', newGoals.goal_weight_lbs);
              setGoals(newGoals);
              if (newGoals.ez_level) {
                const levelNames = { 1: 'Effortless', 2: 'Easy', 3: 'Relaxed' };
                const levelName = levelNames[newGoals.ez_level] || 'Easy';
                console.log('[DEBUG] Calling updateEzLevel with levelName:', levelName);
                updateEzLevel(levelName);
              }
            }}
          />
        </>
      )}
    </>
  );
}
