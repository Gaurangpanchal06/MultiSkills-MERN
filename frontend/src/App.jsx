// src/App.jsx

import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useSkills } from './hooks/useSkills';

import Navbar      from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import AuthPage    from './pages/AuthPage';
import HomePage    from './pages/HomePage';
import { CategoryPage }    from './pages/CategoryPage';
import { SkillDetailPage } from './pages/CategoryPage';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const { deleteSkill } = useSkills();

  const [screen,   setScreen]   = useState('welcome');
  const [category, setCategory] = useState(null);
  const [skill,    setSkill]    = useState(null);
  // Track whether the user was previously authenticated this session.
  // This lets us distinguish "just signed out" from "fresh page load".
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // Logged in — go to home from welcome or auth screens
      setWasAuthenticated(true);
      if (screen === 'auth' || screen === 'welcome') {
        setScreen('home');
      }
    } else if (wasAuthenticated) {
      // Was logged in this session, now signed out → go to auth
      setScreen('auth');
      setWasAuthenticated(false);
    }
    // If never authenticated (fresh visit), do nothing — stay on 'welcome'
  }, [isAuthenticated, loading]);

  if (loading) return <LoadingScreen />;

  // ── Route: Welcome ────────────────────────
  if (screen === 'welcome') {
    return (
      <WelcomePage
        onStart={() => setScreen(isAuthenticated ? 'home' : 'auth')}
      />
    );
  }

  // ── Route: Auth ───────────────────────────
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // ── Route: Category ───────────────────────
  if (screen === 'category' && category) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 72 }}>
          <CategoryPage
            category={category}
            onBack={() => setScreen('home')}
            onSelectSkill={(s) => { setSkill(s); setScreen('detail'); }}
          />
        </div>
      </>
    );
  }

  // ── Route: Skill Detail ───────────────────
  if (screen === 'detail' && skill) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 72 }}>
          <SkillDetailPage
            skill={skill}
            onBack={() => setScreen('category')}
            onDelete={async (id) => {
              await deleteSkill(id);
              setSkill(null);
              setScreen('category');
            }}
          />
        </div>
      </>
    );
  }

  // ── Route: Home ───────────────────────────
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 72 }}>
        <HomePage
          onViewCategory={(cat) => {
            setCategory(cat);
            setScreen('category');
          }}
        />
      </div>
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 13,
        letterSpacing: '0.2em', color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }}>
        Loading···
      </span>
    </div>
  );
}
