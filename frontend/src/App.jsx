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
import { Home, PieChart, PlusCircle, BarChart3, LogOut, Printer, Wallet, Lock, Settings } from 'lucide-react'

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  return isLogin
    ? <Login onSwitchToRegister={() => setIsLogin(false)} />
    : <Register onSwitchToLogin={() => setIsLogin(true)} />;
};

function App() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="skeleton" style={{ width: 60, height: 60 }}></div>
    </div>
  );

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
        <button className={`side-nav-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          <PlusCircle size={20} /> Add Transaction
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
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'add' && 'New Transaction'}
                {activeTab === 'settings' && 'Settings'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hello, {user.name}</div>
            </div>
          </div>
          <div className="top-bar-right">
            <button className="icon-btn" onClick={() => window.dispatchEvent(new Event('lock-app'))} title="Lock App"><Lock size={18} /></button>
            <button className="icon-btn" onClick={() => window.print()} title="Print"><Printer size={18} /></button>
            <button className="icon-btn" onClick={logout} title="Logout"><LogOut size={18} /></button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content-area">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'expenses' && <ExpensesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'add' && <AddTab onDone={() => setActiveTab('home')} />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>

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
          <button className={`nav-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
            <PlusCircle size={26} />
            <span>Add</span>
            {activeTab === 'add' && <div className="nav-dot" />}
          </button>
          <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <PieChart size={22} />
            <span>Analytics</span>
            {activeTab === 'analytics' && <div className="nav-dot" />}
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={22} />
            <span>Settings</span>
            {activeTab === 'settings' && <div className="nav-dot" />}
          </button>
        </div>
      </div>
    </PinLock>
  )
}

export default App
