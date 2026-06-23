import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { ChevronLeft, ChevronRight, Utensils, Car, Gamepad2, ShoppingBag, Zap, Briefcase, MoreHorizontal } from 'lucide-react';

const CATEGORY_ICONS = { Food: Utensils, Transport: Car, Entertainment: Gamepad2, Shopping: ShoppingBag, Utilities: Zap, Salary: Briefcase, Other: MoreHorizontal };
const CATEGORY_COLORS = { Food: '#f97316', Transport: '#6366f1', Entertainment: '#ec4899', Shopping: '#a855f7', Utilities: '#14b8a6', Salary: '#10b981', Other: '#8395A7' };

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

import { useCurrency } from '../hooks/useCurrency';

export const ExpensesTab = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [monthOffset, setMonthOffset] = useState(0);
  const { currency } = useCurrency();

  if (isLoading) return (
    <div style={{ padding: '0 1.25rem' }}>
      {/* Month picker skeleton */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 140, height: 24, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
      </div>
      {/* Summary cards skeleton */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 16 }} />
        <div className="skeleton" style={{ flex: 1, height: 80, borderRadius: 16 }} />
      </div>
      {/* Section header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div className="skeleton" style={{ width: 100, height: 18, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 80, height: 18, borderRadius: 8 }} />
      </div>
      {/* Category item skeletons */}
      <div className="skeleton" style={{ borderRadius: 18, padding: 16, height: 220 }} />
    </div>
  );

  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = `${MONTHS[targetMonth.getMonth()]} ${targetMonth.getFullYear()}`;

  const filtered = transactions?.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === targetMonth.getMonth() && d.getFullYear() === targetMonth.getFullYear();
  }) || [];

  const totalIncome = filtered.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalExpense = filtered.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);

  // Category breakdown
  const categories = {};
  filtered.filter(t => t.amount < 0).forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
  });

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <>
      {/* Month Picker */}
      <div className="month-picker">
        <button onClick={() => setMonthOffset(o => o - 1)}><ChevronLeft size={18} /></button>
        <span>{monthName}</span>
        <button onClick={() => setMonthOffset(o => o + 1)}><ChevronRight size={18} /></button>
      </div>

      {/* Summary Cards */}
      <div className="summary-row">
        <div className="summary-card income-card">
          <div className="summary-card-label">Total Salary</div>
          <div className="summary-card-amount">{currency}{totalIncome.toLocaleString()}</div>
        </div>
        <div className="summary-card expense-card">
          <div className="summary-card-label">Total Expense</div>
          <div className="summary-card-amount">{currency}{totalExpense.toLocaleString()}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="section-header">
        <span className="section-title">Expenses</span>
        <span className="section-link">{sorted.length} categories</span>
      </div>

      <div className="card" style={{ margin: '0 1.25rem' }}>
        {sorted.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0' }}>
            No expenses this month.
          </p>
        )}
        {sorted.map(([cat, amount]) => {
          const pct = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(0) : 0;
          const Icon = CATEGORY_ICONS[cat] || MoreHorizontal;
          const color = CATEGORY_COLORS[cat] || '#8395A7';

          return (
            <div key={cat} className="expense-item">
              <div className="txn-icon-box" style={{ background: `${color}18`, color, width: 40, height: 40, borderRadius: 12 }}>
                <Icon size={18} />
              </div>
              <div className="expense-info">
                <div className="expense-name">{cat}</div>
                <div className="expense-bar-track">
                  <div className="expense-bar-fill" style={{ width: `${pct}%`, background: color }}></div>
                </div>
              </div>
              <div className="expense-meta">
                <div className="expense-amount">{currency}{amount.toLocaleString()}</div>
                <div className="expense-pct">{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
