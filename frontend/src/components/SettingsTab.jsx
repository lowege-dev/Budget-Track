import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Save, Link as LinkIcon, Copy, Check, Moon, Sun, Lock } from 'lucide-react';

export const SettingsTab = () => {
  const { user, updateGoogleSheet } = useAuth();
  const [sheetUrl, setSheetUrl] = useState(user?.googleSheetId || '');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const ROBOT_EMAIL = 'sheet-sync-robot@budget-tracker-500302.iam.gserviceaccount.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(ROBOT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus('');
    
    try {
      await updateGoogleSheet(sheetUrl);
      setStatus('Successfully linked spreadsheet!');
    } catch (err) {
      setStatus('Failed to link spreadsheet.');
    }
    
    setIsSaving(false);
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="tab-container slide-up">
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Settings size={24} color="var(--primary)" /> App Settings
        </h2>

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isDarkMode ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--accent)" />}
            <span style={{ fontWeight: 600 }}>Dark Mode</span>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ 
              width: '50px', height: '28px', borderRadius: '14px', border: 'none', 
              background: isDarkMode ? 'var(--primary)' : 'var(--border)', 
              position: 'relative', cursor: 'pointer', transition: 'background 0.3s' 
            }}
          >
            <div style={{ 
              width: '22px', height: '22px', borderRadius: '50%', background: 'white', 
              position: 'absolute', top: '3px', left: isDarkMode ? '25px' : '3px', 
              transition: 'left 0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
            }} />
          </button>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={20} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>App PIN Lock</span>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new Event('lock-app'))}
            className="submit-btn"
            style={{ padding: '0.5rem 1rem', width: 'auto', margin: 0, fontSize: '0.85rem', boxShadow: 'none' }}
          >
            Manage PIN
          </button>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Personal Google Sheet Sync</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
            Want your transactions backed up instantly? Paste the link to your personal Google Sheet below. 
            <br/><br/>
            <strong>Important:</strong> You MUST share your spreadsheet as an Editor to the app's robot email: 
            <br/>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem', background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: '8px', maxWidth: '100%' }}>
              <code style={{ fontSize: '0.85rem', wordBreak: 'break-all', flex: 1 }}>
                {ROBOT_EMAIL}
              </code>
              <button 
                type="button" 
                onClick={handleCopy}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', flexShrink: 0 }}
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} color="var(--text-secondary)" />}
              </button>
            </div>
          </p>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LinkIcon size={16} /> Google Sheet URL
              </label>
              <input 
                className="form-input"
                type="text" 
                placeholder="https://docs.google.com/spreadsheets/d/..." 
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSaving} style={{ marginTop: '1rem' }}>
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Spreadsheet Link'}
            </button>
            
            {status && (
              <div style={{ color: status.includes('Failed') ? 'var(--danger)' : 'var(--success)', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
