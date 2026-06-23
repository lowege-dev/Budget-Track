import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

const TOAST_CONFIG = {
  success: { icon: CheckCircle2, color: '#00B894', bg: 'rgba(0,184,148,0.12)', border: 'rgba(0,184,148,0.3)' },
  error:   { icon: XCircle,      color: '#E74C3C', bg: 'rgba(231,76,60,0.12)',  border: 'rgba(231,76,60,0.3)' },
  warning: { icon: AlertTriangle, color: '#FDCB6E', bg: 'rgba(253,203,110,0.15)', border: 'rgba(253,203,110,0.35)' },
  info:    { icon: Info,          color: '#6C5CE7', bg: 'rgba(108,92,231,0.12)', border: 'rgba(108,92,231,0.3)' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }
    }, 300);
  }, []);

  const toast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        pointerEvents: 'none',
        maxWidth: '400px',
        width: 'calc(100% - 2rem)',
      }}>
        {toasts.map(t => {
          const cfg = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                background: 'var(--surface, #fff)',
                border: `1px solid ${cfg.border}`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                pointerEvents: 'auto',
                animation: t.exiting ? 'toastOut 0.3s forwards' : 'toastIn 0.35s ease',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: cfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} color={cfg.color} />
              </div>
              <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500, color: 'var(--text, #2D3436)', lineHeight: 1.3 }}>
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary, #8395A7)',
                  padding: '2px', display: 'flex', flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
