import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TrendingUp, TrendingDown, Utensils, Car, Gamepad2, ShoppingBag, Zap, Briefcase, MoreHorizontal, Trash2, Search, Wallet, ArrowDownRight } from 'lucide-react';
import { useDeleteTransaction, useUpdateTransaction } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { useToast } from '../hooks/useToast';

const CATEGORY_ICONS = { Food: Utensils, Transport: Car, Entertainment: Gamepad2, Shopping: ShoppingBag, Utilities: Zap, Salary: Briefcase, Other: MoreHorizontal };
const CATEGORY_COLORS = { Food: '#f97316', Transport: '#6366f1', Entertainment: '#ec4899', Shopping: '#a855f7', Utilities: '#14b8a6', Salary: '#10b981', Other: '#8395A7' };
const CATEGORIES = Object.keys(CATEGORY_ICONS);

const TxnItem = ({ t, currency }) => {
  const { mutate: del, isPending: isDeleting } = useDeleteTransaction();
  const { mutate: update, isPending: isUpdating } = useUpdateTransaction();
  const { toast } = useToast();
  const Icon = CATEGORY_ICONS[t.category] || MoreHorizontal;
  const color = CATEGORY_COLORS[t.category] || '#8395A7';
  const isPositive = t.amount >= 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(t.text);
  const [editAmount, setEditAmount] = useState(Math.abs(t.amount));
  const [editCategory, setEditCategory] = useState(t.category);

  const handleSave = () => {
    const finalAmount = isPositive ? Math.abs(editAmount) : -Math.abs(editAmount);
    update({ id: t._id, updates: { text: editText, amount: finalAmount, category: editCategory } }, {
      onSuccess: () => { setIsEditing(false); toast('Transaction updated successfully!', 'success'); },
      onError: () => toast('Failed to update transaction', 'error'),
    });
  };

  if (isEditing) {
    return (
      <li className="txn-item" style={{ opacity: isUpdating ? 0.4 : 1, flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch', background: 'var(--surface)', padding: '1rem', border: '1px solid var(--border)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            value={editText} 
            onChange={e => setEditText(e.target.value)} 
            className="form-input" 
            style={{ flex: 1, padding: '0.6rem 0.8rem', minHeight: '40px', fontSize: '0.9rem' }} 
            placeholder="Name" 
          />
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)', padding: '0 0.8rem', width: '120px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, marginRight: '0.2rem' }}>{currency}</span>
            <input 
              type="number" 
              value={editAmount} 
              onChange={e => setEditAmount(e.target.value)} 
              style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 600 }} 
              placeholder="Amount" 
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <select 
            value={editCategory} 
            onChange={e => setEditCategory(e.target.value)} 
            className="form-input" 
            style={{ width: '140px', padding: '0.6rem 0.8rem', minHeight: '40px', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setIsEditing(false)} 
              className="btn" 
              style={{ padding: '0.5rem 1rem', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="btn btn-primary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)' }} 
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="txn-item" style={{ opacity: isDeleting ? 0.4 : 1 }}>
      <div className="txn-icon-box" style={{ background: `${color}18`, color }}>
        <Icon size={20} />
      </div>
      <div className="txn-details">
        <div className="txn-name">{t.text}</div>
        <div className="txn-category">
          {t.category}
          {t.notes && <span style={{ opacity: 0.7 }}> • {t.notes}</span>}
        </div>
      </div>
      <div className="txn-right">
        <span className={`txn-amount ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : '-'}{currency}{Math.abs(t.amount).toLocaleString()}
        </span>
        <button className="txn-delete" onClick={() => setIsEditing(true)} disabled={isDeleting} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button className="txn-delete" onClick={() => del(t._id, { onSuccess: () => toast('Transaction deleted', 'info'), onError: () => toast('Failed to delete', 'error') })} disabled={isDeleting}>
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
};

export const HomeTab = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState('');
  const { currency } = useCurrency();

  if (isLoading) return (
    <div style={{ padding: '0 1.25rem' }}>
      {/* Balance card skeleton */}
      <div className="skeleton" style={{ height: 160, borderRadius: 22, marginBottom: 16 }} />
      {/* Summary row skeleton */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 16 }} />
        <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 16 }} />
      </div>
      {/* Section header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 150, height: 20, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 8 }} />
      </div>
      {/* Search bar skeleton */}
      <div className="skeleton" style={{ height: 44, borderRadius: 12, marginBottom: 16 }} />
      {/* Transaction item skeletons */}
      {[1,2,3,4].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: '35%', height: 12, borderRadius: 6 }} />
          </div>
          <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );

  const amounts = transactions?.map(t => t.amount) || [];
  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);
  
  const filteredTxns = transactions?.filter(t => 
    t.text.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()))
  ) || [];
  
  const displayList = search ? filteredTxns : (transactions?.slice(0, 10) || []);

  return (
    <>
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount">{currency}{total}</div>
        <div className="balance-row">
          <div className="balance-stat">
            <div className="stat-dot income"><TrendingUp size={14} /></div>
            <div className="stat-info">
              <span>Income</span>
              <span>+{currency}{income}</span>
            </div>
          </div>
          <div className="balance-stat">
            <div className="stat-dot expense"><TrendingDown size={14} /></div>
            <div className="stat-info">
              <span>Expense</span>
              <span>-{currency}{expense}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-row">
        <div className="summary-card income-card">
          <div className="summary-card-label">Total Income</div>
          <div className="summary-card-amount">{currency}{income}</div>
        </div>
        <div className="summary-card expense-card">
          <div className="summary-card-label">Total Expense</div>
          <div className="summary-card-amount">{currency}{expense}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="section-header">
        <span className="section-title">{search ? 'Search Results' : 'Recent Transactions'}</span>
        <span className="section-link">{filteredTxns.length} total</span>
      </div>

      <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Search size={18} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search by name, category, or note..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <ul className="txn-list">
        {displayList.map(t => <TxnItem key={t._id} t={t} currency={currency} />)}
        {displayList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)' }}>
            {search ? (
              <p>No matching transactions found.</p>
            ) : (
              <>
                <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '1.25rem', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1.25rem' }}>
                  <Wallet size={36} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Welcome to Budget Track!</h3>
                <p className="mobile-only-text" style={{ fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto 2rem' }}>
                  Your dashboard is looking a little empty. Tap the <strong style={{color: 'var(--primary)'}}>+</strong> button to add your first transaction.
                </p>
                <p className="desktop-only-text" style={{ fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
                  Your dashboard is looking a little empty. Click <strong>Add Transaction</strong> on the left to get started.
                </p>
                <div className="mobile-only-arrow" style={{ 
                  color: 'var(--primary)', 
                  opacity: 0.6,
                  transform: 'rotate(-15deg) translateX(40px)',
                  animation: 'bounceFloat 2s infinite ease-in-out'
                }}>
                  <ArrowDownRight size={48} strokeWidth={1.5} />
                </div>
                <style>{`
                  @keyframes bounceFloat {
                    0%, 100% { transform: rotate(-15deg) translateX(30px) translateY(0); }
                    50% { transform: rotate(-15deg) translateX(40px) translateY(10px); }
                  }
                `}</style>
              </>
            )}
          </div>
        )}
      </ul>
    </>
  );
};
