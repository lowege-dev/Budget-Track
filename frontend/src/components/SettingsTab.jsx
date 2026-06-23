import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Save, Link as LinkIcon, Copy, Check, Moon, Sun, Lock, DownloadCloud, Target, Bot } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgetLimits, CATEGORIES as BUDGET_CATEGORIES } from '../hooks/useBudgetLimits';
import { useGemini } from '../hooks/useGemini';

export const SettingsTab = () => {
  const { user, updateGoogleSheet } = useAuth();
  const { currency, setCurrency, CURRENCIES } = useCurrency();
  const { toast } = useToast();
  const [sheetUrl, setSheetUrl] = useState(user?.googleSheetId || '');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const { data: transactions } = useTransactions();
  const { limits, updateLimit } = useBudgetLimits();

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

  const handleToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    toast(next ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ROBOT_EMAIL);
    setCopied(true);
    toast('Email copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus('');
    
    try {
      await updateGoogleSheet(sheetUrl);
      setStatus('Successfully linked spreadsheet!');
      toast('Spreadsheet linked successfully!', 'success');
    } catch (err) {
      setStatus('Failed to link spreadsheet.');
      toast('Failed to link spreadsheet', 'error');
    }
    
    setIsSaving(false);
    setTimeout(() => setStatus(''), 3000);
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast('No transactions to export', 'error');
      return;
    }
    
    const headers = ['Date', 'Name', 'Category', 'Amount', 'Notes'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      `"${t.text}"`,
      `"${t.category}"`,
      t.amount,
      `"${t.notes || ''}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_track_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Exported successfully!', 'success');
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
            onClick={handleToggle}
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

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--primary)' }}>{currency}</span>
            <span style={{ fontWeight: 600 }}>Currency</span>
          </div>
          <select 
            value={currency} 
            onChange={(e) => { setCurrency(e.target.value); toast(`Currency changed to ${e.target.value}`, 'info'); }}
            style={{ 
              padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', 
              background: 'var(--surface)', color: 'var(--text)', outline: 'none',
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            {CURRENCIES.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.label}</option>
            ))}
          </select>
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

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <DownloadCloud size={20} color="var(--primary)" /> Export Data
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Download all your recorded transactions as a CSV file.
          </p>
          <button onClick={handleExportCSV} className="submit-btn" style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            <DownloadCloud size={20} /> Export as CSV
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Target size={20} color="var(--primary)" /> Budget Limits
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Set a monthly spending limit for each category. Set to 0 to remove the limit.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {BUDGET_CATEGORIES.map(cat => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                <span style={{ fontWeight: 600 }}>{cat}</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 0.5rem', width: '120px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.2rem' }}>{currency}</span>
                  <input 
                    type="number" 
                    value={limits[cat] || ''} 
                    onChange={e => updateLimit(cat, e.target.value)}
                    placeholder="0"
                    style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: 600, padding: '0.4rem 0' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
