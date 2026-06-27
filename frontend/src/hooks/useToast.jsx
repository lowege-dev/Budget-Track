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
  const [isHovered, setIsHovered] = useState(false);
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
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
          maxWidth: '400px',
          width: 'calc(100% - 2rem)',
          minHeight: toasts.length > 0 ? (isHovered ? `${toasts.length * 60}px` : '80px') : '0px',
          transition: 'min-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {toasts.map((t, index) => {
          const cfg = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
          const Icon = cfg.icon;
          
          // Calculate reverse index relative to the newest toast (last in array)
          const idx = toasts.length - 1 - index;
          
          let transform = '';
          let opacity = 1;
          let pointerEvents = 'auto';

          if (t.exiting) {
            transform = 'translateX(120%) scale(0.9)';
            opacity = 0;
            pointerEvents = 'none';
          } else if (!isHovered) {
            // Stacked state
            if (idx === 0) {
              transform = 'scale(1) translateY(0px)';
              opacity = 1;
            } else if (idx === 1) {
              transform = 'scale(0.95) translateY(10px)';
              opacity = 0.9;
            } else if (idx === 2) {
              transform = 'scale(0.9) translateY(20px)';
              opacity = 0.75;
            } else {
              transform = 'scale(0.85) translateY(30px)';
              opacity = 0;
              pointerEvents = 'none';
            }
          } else {
            // Expanded state
            transform = `scale(1) translateY(${idx * 58}px)`;
            opacity = 1;
          }

          return (
            <div
              key={t.id}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                background: 'var(--surface, #fff)',
                border: `1px solid ${cfg.border}`,
                boxShadow: idx === 0 || isHovered 
                  ? '0 10px 30px rgba(0,0,0,0.12)' 
                  : '0 4px 12px rgba(0,0,0,0.06)',
                pointerEvents: pointerEvents,
                transform: transform,
                opacity: opacity,
                zIndex: toasts.length - idx,
                animation: t.exiting ? 'none' : idx === 0 ? 'toastInStack 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
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
