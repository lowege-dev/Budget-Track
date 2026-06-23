import { useState, useEffect } from 'react';

const CURRENCIES = [
  { symbol: '$', label: 'Dollar (USD)' },
  { symbol: '₱', label: 'Peso (PHP)' },
  { symbol: '€', label: 'Euro (EUR)' },
  { symbol: '£', label: 'Pound (GBP)' },
  { symbol: '¥', label: 'Yen (JPY)' }
];

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('budget_currency') || '$';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('budget_currency') || '$';
      if (stored !== currency) {
        setCurrencyState(stored);
      }
    };
    window.addEventListener('currency-change', handleStorageChange);
    return () => window.removeEventListener('currency-change', handleStorageChange);
  }, [currency]);

  const setCurrency = (symbol) => {
    localStorage.setItem('budget_currency', symbol);
    setCurrencyState(symbol);
    window.dispatchEvent(new Event('currency-change'));
  };

  return { currency, setCurrency, CURRENCIES };
};
