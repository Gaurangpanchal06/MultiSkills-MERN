// src/App.jsx

import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useSkills } from './hooks/useSkills';

import Navbar      from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import AuthPage    from './pages/AuthPage';
import HomePage    from './pages/HomePage';
import { CategoryPage, SkillDetailPage } from './pages/CategoryPage';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const { deleteSkill } = useSkills();

  const [screen,   setScreen]   = useState('welcome');
  const [category, setCategory] = useState(null);
  const [skill,    setSkill]    = useState(null);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  useEffect(() => {
    // Check for password reset link: /reset-password?token=xxx
    const params   = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const pathname = window.location.pathname;

    if (pathname === '/reset-password' && token) {
      // Rewrite URL to pass token to AuthPage via query param it expects
      window.history.replaceState({}, '', `/?token=${token}&page=reset`);
      setScreen('auth');
      return;
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      setWasAuthenticated(true);
      if (screen === 'auth' || screen === 'welcome') {
        setScreen('home');
      }
    } else if (wasAuthenticated) {
      setScreen('auth');
      setWasAuthenticated(false);
    }
  }, [isAuthenticated, loading]);

  if (loading) return <LoadingScreen />;

  if (screen === 'welcome') {
    return (
      <WelcomePage
        onStart={() => setScreen(isAuthenticated ? 'home' : 'auth')}
      />
    );
  }

  if (!isAuthenticated) return <AuthPage />;

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
