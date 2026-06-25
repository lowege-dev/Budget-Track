import React, { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
const TIPS = [
  'Tracking expenses builds better habits.',
  'Small savings add up to big dreams.',
  'Your financial story starts here.',
  'Wealth is built one transaction at a time.',
];

export function LoadingScreen() {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animated progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Stall at 90% until real load finishes
        return prev + Math.random() * 12;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ls-backdrop">
      {/* Ambient blobs */}
      <div className="ls-blob ls-blob-1" />
      <div className="ls-blob ls-blob-2" />
      <div className="ls-blob ls-blob-3" />

      <div className="ls-card">
        {/* Logo */}
        <div className="ls-logo-ring">
          <div className="ls-logo-inner">
            <Wallet size={32} color="white" strokeWidth={1.8} />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="ls-title">Budget Track</h1>
        <p className="ls-subtitle">Your smart finance companion</p>

        {/* Animated coins/bars decoration */}
        <div className="ls-bars">
          {[0.4, 0.7, 1, 0.6, 0.85].map((h, i) => (
            <div
              key={i}
              className="ls-bar"
              style={{
                height: `${h * 44}px`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="ls-progress-track">
          <div
            className="ls-progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Status text */}
        <p className="ls-status">Loading{dots}</p>

        {/* Tip */}
        <p className="ls-tip">💡 {tip}</p>
      </div>
    </div>
  );
}
