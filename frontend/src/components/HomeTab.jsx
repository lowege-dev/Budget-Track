import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TrendingUp, TrendingDown, Utensils, Car, Gamepad2, ShoppingBag, Zap, Briefcase, MoreHorizontal, Trash2, Search } from 'lucide-react';
import { useDeleteTransaction } from '../hooks/useTransactions';

const CATEGORY_ICONS = { Food: Utensils, Transport: Car, Entertainment: Gamepad2, Shopping: ShoppingBag, Utilities: Zap, Salary: Briefcase, Other: MoreHorizontal };
const CATEGORY_COLORS = { Food: '#f97316', Transport: '#6366f1', Entertainment: '#ec4899', Shopping: '#a855f7', Utilities: '#14b8a6', Salary: '#10b981', Other: '#8395A7' };

const TxnItem = ({ t }) => {
  const { mutate: del, isPending } = useDeleteTransaction();
  const Icon = CATEGORY_ICONS[t.category] || MoreHorizontal;
  const color = CATEGORY_COLORS[t.category] || '#8395A7';
  const isPositive = t.amount >= 0;

  return (
    <li className="txn-item" style={{ opacity: isPending ? 0.4 : 1 }}>
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
          {isPositive ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
        </span>
        <button className="txn-delete" onClick={() => del(t._id)} disabled={isPending}>
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
};

export const HomeTab = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState('');

  if (isLoading) return (
    <div style={{ padding: '0 1.25rem' }}>
      <div className="skeleton" style={{ height: 160, marginBottom: 12 }}></div>
      <div className="skeleton" style={{ height: 70, marginBottom: 8 }}></div>
      <div className="skeleton" style={{ height: 70, marginBottom: 8 }}></div>
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
        <div className="balance-amount">${total}</div>
        <div className="balance-row">
          <div className="balance-stat">
            <div className="stat-dot income"><TrendingUp size={14} /></div>
            <div className="stat-info">
              <span>Income</span>
              <span>+${income}</span>
            </div>
          </div>
          <div className="balance-stat">
            <div className="stat-dot expense"><TrendingDown size={14} /></div>
            <div className="stat-info">
              <span>Expense</span>
              <span>-${expense}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-row">
        <div className="summary-card income-card">
          <div className="summary-card-label">Total Income</div>
          <div className="summary-card-amount">${income}</div>
        </div>
        <div className="summary-card expense-card">
          <div className="summary-card-label">Total Expense</div>
          <div className="summary-card-amount">${expense}</div>
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
        {displayList.map(t => <TxnItem key={t._id} t={t} />)}
        {displayList.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
            {search ? 'No matching transactions found.' : 'No transactions yet. Tap + to add one!'}
          </p>
        )}
      </ul>
    </>
  );
};
