import React, { useState } from 'react';
import { useAddTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import {
  PlusCircle, Check, Utensils, Car, Gamepad2,
  ShoppingBag, Zap, Briefcase, MoreHorizontal,
  TrendingDown, TrendingUp, FileText, Wallet
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Food',          icon: Utensils,      color: '#f97316' },
  { label: 'Transport',     icon: Car,            color: '#6366f1' },
  { label: 'Entertainment', icon: Gamepad2,       color: '#ec4899' },
  { label: 'Shopping',      icon: ShoppingBag,    color: '#a855f7' },
  { label: 'Utilities',     icon: Zap,            color: '#14b8a6' },
  { label: 'Salary',        icon: Briefcase,      color: '#10b981' },
  { label: 'Other',         icon: MoreHorizontal, color: '#8395A7' },
];
import { useCurrency } from '../hooks/useCurrency';

export const AddTab = ({ onDone }) => {
  const { currency } = useCurrency();
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [accountId, setAccountId] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: accounts } = useAccounts();
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      text,
      amount: type === 'expense' ? -Math.abs(+amount) : Math.abs(+amount),
      category,
      type,
      notes,
      account: accountId || null,
      tags: []
    }, {
      onSuccess: () => {
        setText(''); setAmount(''); setNotes('');
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onDone(); }, 1400);
      }
    });
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.25rem', gap: '1rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 12px rgba(0,184,148,0.1)',
          animation: 'fadeUp 0.4s ease'
        }}>
          <Check size={36} color="var(--success)" strokeWidth={2.5} />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Transaction Added!</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Redirecting to Home...</p>
      </div>
    );
  }

  const selectedCat = CATEGORIES.find(c => c.label === category);

  return (
    <div style={{ padding: '0.5rem 1.25rem 100px' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Type Toggle */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
          background: 'var(--bg)', borderRadius: '16px', padding: '0.4rem'
        }}>
          {[
            { value: 'expense', label: 'Expense', icon: TrendingDown, color: '#E74C3C', activeColor: 'rgba(231,76,60,0.12)' },
            { value: 'income',  label: 'Income',  icon: TrendingUp,   color: '#00B894', activeColor: 'rgba(0,184,148,0.12)' },
          ].map(({ value, label, icon: Icon, color, activeColor }) => {
            const active = type === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: active ? `2px solid ${color}` : '2px solid transparent',
                  background: active ? activeColor : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 700,
                  color: active ? color : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Amount — big and prominent */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '18px',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Amount
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{currency}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              required
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: type === 'expense' ? 'var(--danger)' : 'var(--success)',
                width: '160px',
                textAlign: 'center',
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <FileText size={13} /> Description
          </label>
          <input
            className="form-input"
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g. Coffee at Starbucks"
            required
          />
        </div>

        {/* Category — icon pill grid */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
            Category
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const selected = category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '99px',
                    border: `2px solid ${selected ? cat.color : 'var(--border)'}`,
                    background: selected ? `${cat.color}18` : 'var(--surface)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
                    color: selected ? cat.color : 'var(--text-secondary)',
                    transition: 'all 0.18s',
                  }}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(Optional)</span>
          </label>
          <textarea
            className="form-input"
            rows="2"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add extra details..."
            style={{ resize: 'none' }}
          />
        </div>

        {/* Account */}
        {accounts && accounts.length > 0 && (
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              <Wallet size={13} /> Account
            </label>
            <select className="form-input" value={accountId} onChange={e => setAccountId(e.target.value)}>
              <option value="">None</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>{acc.name} ({acc.type})</option>
              ))}
            </select>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '16px',
            border: 'none',
            background: type === 'expense'
              ? 'linear-gradient(135deg, #E74C3C, #e17055)'
              : 'linear-gradient(135deg, #00B894, #55efc4)',
            color: 'white',
            fontFamily: 'inherit',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isPending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            opacity: isPending ? 0.7 : 1,
            boxShadow: type === 'expense'
              ? '0 6px 20px rgba(231,76,60,0.3)'
              : '0 6px 20px rgba(0,184,148,0.3)',
            transition: 'all 0.2s',
          }}
        >
          <PlusCircle size={20} />
          {isPending ? 'Adding...' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
        </button>
      </form>
    </div>
  );
};
