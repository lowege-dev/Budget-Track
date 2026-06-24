import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { PinLock } from './components/PinLock'
import { HomeTab } from './components/HomeTab'
import { ExpensesTab } from './components/ExpensesTab'
import { AnalyticsTab } from './components/AnalyticsTab'
import { AddTab } from './components/AddTab'
import { SettingsTab } from './components/SettingsTab'
import { NotesTab } from './components/NotesTab'
import { WealthTab } from './components/WealthTab'
import { useNotes } from './hooks/useNotes'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Home, PieChart, PlusCircle, Plus, BarChart3, LogOut, Printer, Wallet, Lock, Settings, BookOpen, Target, DownloadCloud } from 'lucide-react'

function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered');
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      padding: '1.25rem', borderRadius: '18px', zIndex: 9999,
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)', width: '90%', maxWidth: '380px',
      display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center'
    }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '0.5rem' }}>
        <DownloadCloud size={24} />
      </div>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Update Available</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.75rem' }}>
        A new version of the app is ready. Refresh to apply changes!
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
        <button onClick={() => setNeedRefresh(false)} className="btn" style={{ flex: 1, padding: '0.7rem' }}>Later</button>
        <button onClick={() => updateServiceWorker(true)} className="btn btn-primary" style={{ flex: 1, padding: '0.7rem' }}>Update Now</button>
      </div>
    </div>
  );
}

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  return isLogin
    ? <Login onSwitchToRegister={() => setIsLogin(false)} />
    : <Register onSwitchToLogin={() => setIsLogin(true)} />;
};

const AppSkeleton = () => (
  <>
    {/* Desktop Sidebar Skeleton */}
    <nav className="side-nav">
      <div className="side-nav-brand">
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10 }}></div>
        <div className="skeleton" style={{ width: 120, height: 24, borderRadius: 6 }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="skeleton" style={{ height: 44, borderRadius: 12 }}></div>
        ))}
      </div>
      <div className="side-nav-bottom">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 44, borderRadius: 12 }}></div>
          ))}
        </div>
      </div>
    </nav>

    <div className="app-shell">
      {/* Top Bar Skeleton */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 14 }}></div>
          <div>
            <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4, marginBottom: 6 }}></div>
            <div className="skeleton" style={{ width: 60, height: 12, borderRadius: 4 }}></div>
          </div>
        </div>
        <div className="top-bar-right">
          <div className="skeleton icon-btn" style={{ border: 'none' }}></div>
          <div className="skeleton icon-btn" style={{ border: 'none' }}></div>
          <div className="skeleton icon-btn" style={{ border: 'none' }}></div>
        </div>
      </div>

      {/* Tab Content (Home Tab Skeleton) */}
      <div className="tab-content-area" style={{ padding: '0 1.25rem' }}>
        <div className="skeleton" style={{ height: 160, borderRadius: 22, marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 16 }} />
          <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 16 }} />
        </div>
        <div className="skeleton" style={{ height: 44, borderRadius: 12, marginBottom: 16 }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: '35%', height: 12, borderRadius: 6 }} />
            </div>
            <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 6 }} />
          </div>
        ))}
      </div>

      {/* Bottom Nav Skeleton */}
      <div className="bottom-nav">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="nav-item">
            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%', marginBottom: 4 }} />
            <div className="skeleton" style={{ width: 40, height: 8, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  </>
);

function App() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  
  // Background prefetch for Vercel cold-starts
  useNotes({ enabled: !!user });

  if (loading) return <AppSkeleton />;

  if (!user) return <AuthScreen />;

  const initial = user.name?.charAt(0).toUpperCase() || '?';

  return (
    <PinLock>
      {/* Desktop Sidebar — hidden on mobile via CSS */}
      <nav className="side-nav">
        <div className="side-nav-brand">
          <div className="avatar" style={{ width: 36, height: 36, borderRadius: 10, fontSize: '0.95rem' }}>
            <Wallet size={18} />
          </div>
          <h2>Budget Track</h2>
        </div>

        <button className={`side-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={20} /> Home
        </button>
        <button className={`side-nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
          <BarChart3 size={20} /> Expenses
        </button>
        <button className={`side-nav-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
          <BookOpen size={20} /> Diary
        </button>
        <button className={`side-nav-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          <PlusCircle size={20} /> Add Transaction
        </button>
        <button className={`side-nav-item ${activeTab === 'wealth' ? 'active' : ''}`} onClick={() => setActiveTab('wealth')}>
          <Target size={20} /> Wealth
        </button>
        <button className={`side-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <PieChart size={20} /> Analytics
        </button>

        <div className="side-nav-bottom">
          <button className={`side-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </button>
          <button className="side-nav-item" onClick={() => window.dispatchEvent(new Event('lock-app'))}>
            <Lock size={20} /> Lock App
          </button>
          <button className="side-nav-item" onClick={() => window.print()}>
            <Printer size={20} /> Print Report
          </button>
          <button className="side-nav-item" onClick={logout} style={{ color: 'var(--danger)' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      <div className="app-shell">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="avatar">{initial}</div>
            <div>
              <div className="top-bar-title">
                {activeTab === 'home' && 'Home'}
                {activeTab === 'expenses' && 'Expenses'}
                {activeTab === 'notes' && 'My Diary'}
                {activeTab === 'wealth' && 'Wealth & Goals'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'add' && 'New Transaction'}
                {activeTab === 'settings' && 'Settings'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hello, {user.name}</div>
            </div>
          </div>
          <div className="top-bar-right">
            <button className="icon-btn" onClick={() => window.dispatchEvent(new Event('lock-app'))} title="Lock App"><Lock size={18} /></button>
            <button className="icon-btn" onClick={() => setActiveTab('settings')} title="Settings"><Settings size={18} /></button>
            <button className="icon-btn" onClick={logout} title="Logout"><LogOut size={18} /></button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content-area">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'expenses' && <ExpensesTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'wealth' && <WealthTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'add' && <AddTab onDone={() => setActiveTab('home')} />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>

        {/* Mobile Floating Action Button (FAB) */}
        {activeTab !== 'add' && (
          <button className="mobile-fab" onClick={() => setActiveTab('add')} title="Add Transaction">
            <Plus size={28} />
          </button>
        )}

        {/* Bottom Nav — hidden on desktop via CSS */}
        <div className="bottom-nav">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={22} />
            <span>Home</span>
            {activeTab === 'home' && <div className="nav-dot" />}
          </button>
          <button className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
            <BarChart3 size={22} />
            <span>Expenses</span>
            {activeTab === 'expenses' && <div className="nav-dot" />}
          </button>
          <button className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
            <BookOpen size={22} />
            <span>Diary</span>
            {activeTab === 'notes' && <div className="nav-dot" />}
          </button>
          <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <PieChart size={22} />
            <span>Analytics</span>
            {activeTab === 'analytics' && <div className="nav-dot" />}
          </button>
          <button className={`nav-item ${activeTab === 'wealth' ? 'active' : ''}`} onClick={() => setActiveTab('wealth')}>
            <Target size={22} />
            <span>Wealth</span>
            {activeTab === 'wealth' && <div className="nav-dot" />}
          </button>
        </div>
      </div>
      <ReloadPrompt />
    </PinLock>
  )
}

export default App
