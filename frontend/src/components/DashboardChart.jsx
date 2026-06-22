import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTransactions } from '../hooks/useTransactions';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#6366f1',
  Entertainment: '#ec4899',
  Shopping: '#a855f7',
  Utilities: '#14b8a6',
  Salary: '#10b981',
  Other: '#64748b'
};

export const DashboardChart = () => {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) return (
    <>
      <div className="card-title"><PieChart size={20} /> Expense Breakdown</div>
      <div className="skeleton skeleton-card" style={{ height: '280px', borderRadius: '20px' }}></div>
    </>
  );

  const expenses = transactions?.filter(t => t.amount < 0) || [];
  
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
    return acc;
  }, {});

  const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(c => CATEGORY_COLORS[c] || '#64748b'),
        borderWidth: 0,
        cutout: '72%',
        borderRadius: 6,
        spacing: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: "'Outfit', sans-serif", size: 14 },
        bodyFont: { family: "'Outfit', sans-serif", size: 13 },
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` $${ctx.raw.toFixed(2)} (${((ctx.raw / totalExpenses) * 100).toFixed(1)}%)`
        }
      }
    }
  };

  // Center text plugin
  const centerText = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8fafc';
      ctx.font = "600 1.4rem 'Outfit', sans-serif";
      ctx.fillText(`$${totalExpenses.toFixed(0)}`, width / 2, height / 2 - 8);
      ctx.fillStyle = '#94a3b8';
      ctx.font = "400 0.8rem 'Outfit', sans-serif";
      ctx.fillText('Total Spent', width / 2, height / 2 + 16);
      ctx.restore();
    }
  };

  return (
    <>
      <div className="card-title"><PieChart size={20} /> Total Expense</div>
      {expenses.length > 0 ? (
        <>
          <div style={{ height: '220px', marginBottom: '1.5rem' }}>
            <Doughnut data={data} options={options} plugins={[centerText]} />
          </div>
          
          <div className="chart-legend">
            {Object.entries(categoryTotals).map(([cat, amount]) => (
              <div key={cat} className="chart-legend-item">
                <div className="chart-legend-left">
                  <div className="chart-legend-dot" style={{ background: CATEGORY_COLORS[cat] || '#64748b' }}></div>
                  <span>{cat}</span>
                </div>
                <div className="chart-legend-right">
                  <span className="chart-legend-amount">${amount.toFixed(0)}</span>
                  <span className="chart-legend-percent">{((amount / totalExpenses) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No expenses to display.</p>
      )}
    </>
  );
}
