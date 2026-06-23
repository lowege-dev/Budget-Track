import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Other'];

export const useBudgetLimits = () => {
  const { user } = useAuth();
  const userId = user ? (user.id || user._id) : 'guest';
  const storageKey = `budget_limits_${userId}`;

  const [limits, setLimits] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(limits));
  }, [limits, storageKey]);

  const updateLimit = (category, amount) => {
    setLimits(prev => ({
      ...prev,
      [category]: Number(amount)
    }));
  };

  return { limits, updateLimit };
};
