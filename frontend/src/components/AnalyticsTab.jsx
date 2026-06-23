import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTransactions } from '../hooks/useTransactions';
import { ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = { Food: '#f97316', Transport: '#6366f1', Entertainment: '#ec4899', Shopping: '#a855f7', Utilities: '#14b8a6', Salary: '#10b981', Other: '#8395A7' };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

import { useCurrency } from '../hooks/useCurrency';

export const AnalyticsTab = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [monthOffset, setMonthOffset] = useState(0);
  const { currency } = useCurrency();

  if (isLoading) return (
    <div style={{ padding: '0 1.25rem' }}>
      {/* Month picker skeleton */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 140, height: 24, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
      </div>
      {/* Donut chart skeleton */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 220, height: 220, borderRadius: '50%' }} />
      </div>
      {/* Info card skeleton */}
      <div className="skeleton" style={{ height: 50, borderRadius: 16, marginBottom: 16 }} />
      {/* Legend items skeleton */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton" style={{ width: 90, height: 28, borderRadius: 8 }} />
        ))}
      </div>
    </div>
  );

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = `${MONTHS[target.getMonth()]} ${target.getFullYear()}`;

  const filtered = transactions?.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
  }) || [];

  const expenses = filtered.filter(t => t.amount < 0);
  const totalExpense = expenses.reduce((a, t) => a + Math.abs(t.amount), 0);

  const cats = {};
  expenses.forEach(t => { cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount); });

  const labels = Object.keys(cats);
  const values = Object.values(cats);
  const colors = labels.map(c => CATEGORY_COLORS[c] || '#8395A7');

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderWidth: 0,
      cutout: '70%',
      borderRadius: 6,
      spacing: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2D3436',
        titleFont: { family: "'Outfit'" },
        bodyFont: { family: "'Outfit'" },
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${currency}${ctx.raw.toFixed(2)} (${((ctx.raw / totalExpense) * 100).toFixed(0)}%)`
        }
      }
    }
  };

  const centerText = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#2D3436';
      ctx.font = "700 1.3rem 'Outfit', sans-serif";
      ctx.fillText(`${currency}${totalExpense.toFixed(0)}`, width / 2, height / 2 - 8);
      ctx.fillStyle = '#8395A7';
      ctx.font = "400 0.75rem 'Outfit', sans-serif";
      ctx.fillText('Total Spent', width / 2, height / 2 + 14);
      ctx.restore();
    }
  };

  return (
    <>
      {/* Month Picker */}
      <div className="month-picker">
        <button onClick={() => setMonthOffset(o => o - 1)}><ChevronLeft size={18} /></button>
        <span>{monthName}</span>
        <button onClick={() => setMonthOffset(o => o + 1)}><ChevronRight size={18} /></button>
      </div>

      {/* Info */}
      <div className="card" style={{ margin: '0 1.25rem 0.75rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          You have spent <strong style={{ color: 'var(--accent)' }}>{currency}{totalExpense.toLocaleString()}</strong> this month
        </p>
      </div>

      {/* Donut Chart */}
      <div className="section-header">
        <span className="section-title">Analytics</span>
      </div>

      <div className="card" style={{ margin: '0 1.25rem' }}>
        {labels.length > 0 ? (
          <>
            <div className="chart-wrap">
              <Doughnut data={data} options={options} plugins={[centerText]} />
            </div>
            <div className="chart-legend-custom">
              {labels.map((cat, i) => {
                const pct = totalExpense > 0 ? ((values[i] / totalExpense) * 100).toFixed(0) : 0;
                return (
                  <div key={cat} className="legend-row">
                    <div className="legend-left">
                      <div className="legend-dot" style={{ background: colors[i] }}></div>
                      <span className="legend-label">{cat}</span>
                    </div>
                    <div className="legend-right">
                      <span className="legend-pct">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
            No expense data for this month.
          </p>
        )}
      </div>
    </>
  );
};
