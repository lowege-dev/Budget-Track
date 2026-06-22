import React from 'react';
import { useDeleteTransaction } from '../hooks/useTransactions';
import { Trash2, Utensils, Car, Gamepad2, ShoppingBag, Zap, Briefcase, MoreHorizontal } from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Utilities: Zap,
  Salary: Briefcase,
  Other: MoreHorizontal,
};

const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#6366f1',
  Entertainment: '#ec4899',
  Shopping: '#a855f7',
  Utilities: '#14b8a6',
  Salary: '#10b981',
  Other: '#64748b',
};

export const Transaction = ({ transaction }) => {
  const { mutate: deleteTransaction, isPending } = useDeleteTransaction();

  const sign = transaction.amount < 0 ? '-' : '+';
  const Icon = CATEGORY_ICONS[transaction.category] || MoreHorizontal;
  const color = CATEGORY_COLORS[transaction.category] || '#64748b';

  return (
    <li className={transaction.type === 'expense' ? 'minus' : 'plus'} style={{ opacity: isPending ? 0.5 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="txn-icon" style={{ background: `${color}20`, color: color }}>
          <Icon size={18} />
        </div>
        <div className="transaction-info">
          <span className="transaction-text">{transaction.text}</span>
          <span className="transaction-category">{transaction.category}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className={`transaction-amount ${transaction.amount < 0 ? 'minus' : 'plus'}`}>
          {sign}${Math.abs(transaction.amount).toLocaleString()}
        </span>
        <button 
          onClick={() => deleteTransaction(transaction._id)} 
          className="delete-btn"
          disabled={isPending}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}
