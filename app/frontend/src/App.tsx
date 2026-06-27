import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Onboarding from './pages/Onboarding';

function NavBar() {
  const { user, setUser } = useAppStore();
  const location = useLocation();
  if (!user || !user.onboarding_complete) return null;

  const navLink = (to: string, label: string) => (
    <Link to={to} style={{
      color: location.pathname === to ? 'var(--accent-primary)' : 'var(--text-secondary)',
      textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
      borderBottom: location.pathname === to ? '2px solid var(--accent-primary)' : '2px solid transparent',
      paddingBottom: '2px', transition: 'all 0.2s',
    }}>
      {label}
    </Link>
  );

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1>Weallth PWM</h1>
        <div className="adv-disclaimer">Advisory simulation only — not financial advice</div>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/goals', 'Goals')}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {user.name} · <span style={{ color: 'var(--accent-primary)' }}>{user.segment}</span>
        </span>
        <button onClick={() => setUser(null)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
          color: 'var(--text-primary)', padding: '0.4rem 1rem', borderRadius: '6px',
          cursor: 'pointer', fontSize: '0.8rem',
        }}>
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const { user } = useAppStore();

  const requireAuth = (element: JSX.Element) => {
    if (!user) return <Navigate to="/login" replace />;
    if (!user.onboarding_complete) return <Navigate to="/onboarding" replace />;
    return element;
  };

  const requireOnboarding = (element: JSX.Element) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.onboarding_complete) return <Navigate to="/dashboard" replace />;
    return element;
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : user.onboarding_complete ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={requireOnboarding(<Onboarding />)} />
            <Route path="/dashboard" element={requireAuth(<Dashboard />)} />
            <Route path="/goals" element={requireAuth(<Goals />)} />
            <Route path="/" element={<Navigate to={user ? (user.onboarding_complete ? '/dashboard' : '/onboarding') : '/login'} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
