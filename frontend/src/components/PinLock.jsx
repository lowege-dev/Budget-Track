import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PinLock = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? (user.id || user._id) : 'guest';
  const pinKey = `budget_pin_${userId}`;
  const isPinSet = !!localStorage.getItem(pinKey);
  const actualStoredPin = localStorage.getItem(pinKey);

  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) { setPin(p => p + num); setError(false); }
  };

  const handleDelete = () => { setPin(p => p.slice(0, -1)); setError(false); };

  useEffect(() => {
    if (pin.length === 4) {
      if (!isPinSet) {
        localStorage.setItem(pinKey, pin);
        setIsLocked(false);
        setPin('');
      } else {
        if (pin === actualStoredPin) {
          setIsLocked(false);
          setPin('');
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  }, [pin, isPinSet, actualStoredPin, pinKey]);

  useEffect(() => {
    const handleLockEvent = () => setIsLocked(true);
    window.addEventListener('lock-app', handleLockEvent);
    return () => window.removeEventListener('lock-app', handleLockEvent);
  }, []);

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ maxWidth: 320, textAlign: 'center', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(108,92,231,0.3)' }}>
            <Lock size={28} color="white" />
          </div>
        </div>

        <h2 style={{ marginBottom: '0.4rem', fontSize: '1.4rem', fontWeight: 700 }}>
          {isPinSet ? 'Enter PIN' : 'Create 4-Digit PIN'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {isPinSet ? 'Unlock your financial dashboard.' : 'Secure your data with a lock code.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: '2rem' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              background: i < pin.length ? 'var(--primary)' : 'var(--border)',
              border: '2px solid var(--primary)',
              transition: 'all 0.2s',
              animation: error ? 'shake 0.4s' : 'none'
            }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 240, margin: '0 auto' }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => handleKeyPress(n.toString())}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: 14, fontSize: '1.15rem', fontWeight: 600, borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {n}
            </button>
          ))}
          <div />
          <button onClick={() => handleKeyPress('0')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: 14, fontSize: '1.15rem', fontWeight: 600, borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>0</button>
          <button onClick={handleDelete} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: 14, fontSize: '1.15rem', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>⌫</button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
};
