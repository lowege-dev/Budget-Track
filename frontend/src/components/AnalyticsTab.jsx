import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTransactions } from '../hooks/useTransactions';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Bot, RefreshCw } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { useBudgetLimits } from '../hooks/useBudgetLimits';
import { useGemini } from '../hooks/useGemini';

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx } = chart;
    const centerTextConfig = chart.options.plugins?.centerText;
    if (!centerTextConfig) return;
    
    const { text, subtext, color, subtextColor } = centerTextConfig;
    const width = chart.width;
    const height = chart.height;
    
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = "700 1.3rem 'Outfit', sans-serif";
    ctx.fillText(text, width / 2, height / 2 - 8);
    ctx.fillStyle = subtextColor;
    ctx.font = "400 0.75rem 'Outfit', sans-serif";
    ctx.fillText(subtext, width / 2, height / 2 + 14);
    ctx.restore();
  }
};

ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin);

const CATEGORY_COLORS = { Food: '#f97316', Transport: '#6366f1', Entertainment: '#ec4899', Shopping: '#a855f7', Utilities: '#14b8a6', Salary: '#10b981', Other: '#8395A7' };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const AnalyticsTab = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [monthOffset, setMonthOffset] = useState(0);
  const { currency } = useCurrency();
  const { limits } = useBudgetLimits();
  const { generateInsight, loading, error } = useGemini();
  const [aiInsight, setAiInsight] = useState('');

  const handleGenerateAiInsight = async () => {
    const summary = `Total Spent: ${currency}${totalExpense.toFixed(2)}. Categories breakdown: ${Object.entries(cats).map(([k,v]) => `${k}: ${currency}${v}`).join(', ')}. Last Month Spent: ${currency}${lastMonthExpense.toFixed(2)}.`;
    
    try {
      const text = await generateInsight(summary);
      setAiInsight(text);
    } catch(e) {
      console.error(e);
    }
  };

  if (isLoading) return (
    <div style={{ padding: '0 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 140, height: 24, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 220, height: 220, borderRadius: '50%' }} />
      </div>
      <div className="skeleton" style={{ height: 50, borderRadius: 16, marginBottom: 16 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton" style={{ width: 90, height: 28, borderRadius: 8 }} />
        ))}
      </div>
    </div>
  );

  const { chartData, insights, totalExpense, labels, values, colors, monthName, cats, lastMonthExpense } = React.useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const monthName = `${MONTHS[target.getMonth()]} ${target.getFullYear()}`;

    const lastMonthTarget = new Date(now.getFullYear(), now.getMonth() + monthOffset - 1, 1);

    const filtered = transactions?.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    }) || [];

    const lastMonthFiltered = transactions?.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonthTarget.getMonth() && d.getFullYear() === lastMonthTarget.getFullYear();
    }) || [];

    const expenses = filtered.filter(t => t.amount < 0);
    const totalExpense = expenses.reduce((a, t) => a + Math.abs(t.amount), 0);
    
    const lastMonthExpense = lastMonthFiltered.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);

    const cats = {};
    expenses.forEach(t => { cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount); });

    const labels = Object.keys(cats);
    const values = Object.values(cats);
    const colors = labels.map(c => CATEGORY_COLORS[c] || '#8395A7');

    const insights = [];
    
    if (lastMonthExpense > 0 && totalExpense > 0) {
      const diff = totalExpense - lastMonthExpense;
      const pct = Math.abs((diff / lastMonthExpense) * 100).toFixed(0);
      if (diff > 0) {
        insights.push({ icon: TrendingUp, color: 'var(--danger)', text: `You've spent ${pct}% more this month compared to last month.` });
      } else if (diff < 0) {
        insights.push({ icon: TrendingDown, color: 'var(--success)', text: `Great job! You've spent ${pct}% less this month than last month.` });
      }
    }

    if (labels.length > 0) {
      const topCategory = labels.reduce((a, b) => cats[a] > cats[b] ? a : b);
      insights.push({ icon: Sparkles, color: 'var(--primary)', text: `Your highest expense is ${topCategory}, making up ${((cats[topCategory]/totalExpense)*100).toFixed(0)}% of your spending.` });
    }

    let limitExceeded = false;
    let closeToLimit = false;
    Object.keys(limits).forEach(cat => {
      if (limits[cat] > 0 && cats[cat]) {
        const pct = (cats[cat] / limits[cat]) * 100;
        if (pct >= 100) limitExceeded = true;
        else if (pct >= 80) closeToLimit = true;
      }
    });

    if (limitExceeded) {
      insights.push({ icon: AlertTriangle, color: 'var(--danger)', text: `Warning: You have exceeded your budget limit in one or more categories.` });
    } else if (closeToLimit) {
      insights.push({ icon: AlertTriangle, color: 'var(--warning)', text: `Careful! You are approaching your budget limit in some categories.` });
    } else if (Object.keys(limits).length > 0 && labels.length > 0) {
      insights.push({ icon: CheckCircle2, color: 'var(--success)', text: `You are currently within all your set budget limits. Keep it up!` });
    }

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

    return { chartData: data, insights, totalExpense, labels, values, colors, monthName, cats, lastMonthExpense };
  }, [transactions, monthOffset, limits]);

  const options = React.useMemo(() => {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#2D3436';
    const textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#8395A7';
    return {
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
        },
        centerText: {
          text: `${currency}${totalExpense.toFixed(0)}`,
          subtext: 'Total Spent',
          color: textColor,
          subtextColor: textSecondaryColor
        }
      }
    };
  }, [currency, totalExpense]);

  return (
    <>
      <div className="month-picker">
        <button onClick={() => setMonthOffset(o => o - 1)}><ChevronLeft size={18} /></button>
        <span>{monthName}</span>
        <button onClick={() => setMonthOffset(o => o + 1)}><ChevronRight size={18} /></button>
      </div>

      <div className="card" style={{ margin: '0 1.25rem 0.75rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          You have spent <strong style={{ color: 'var(--accent)' }}>{currency}{totalExpense.toLocaleString()}</strong> this month
        </p>
      </div>

      {insights.length > 0 && (
        <>
          <div className="section-header" style={{ paddingBottom: '0.5rem' }}>
            <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="var(--primary)" /> Smart Insights
            </span>
          </div>
          <div className="card" style={{ margin: '0 1.25rem 0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {insights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ background: `${insight.color}15`, color: insight.color, padding: '0.4rem', borderRadius: '8px', flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.4, margin: 0, marginTop: '0.15rem' }}>
                    {insight.text}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Gemini AI Advisor */}
      <div className="section-header" style={{ paddingBottom: '0.5rem', marginTop: '1rem' }}>
        <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bot size={18} color="var(--primary)" /> Gemini AI Advisor
        </span>
      </div>
      <div className="card" style={{ margin: '0 1.25rem 0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!aiInsight && !loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Ask Gemini to analyze your monthly spending and give you personalized financial advice.</p>
            <button onClick={handleGenerateAiInsight} className="submit-btn" style={{ background: 'var(--primary)', margin: '0 auto', display: 'inline-flex', width: 'auto', padding: '0.6rem 1.2rem', gap: '0.5rem' }}>
              <Sparkles size={16} /> Generate AI Insight
            </button>
          </div>
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', padding: '1rem 0' }}>
            <RefreshCw size={18} /> Analyzing your finances...
          </div>
        )}
        {aiInsight && !loading && (
          <div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0, color: 'var(--text)', fontStyle: 'italic' }}>
              "{aiInsight}"
            </p>
            <button onClick={handleGenerateAiInsight} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', marginTop: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}>
              <RefreshCw size={12} /> Regenerate
            </button>
          </div>
        )}
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', margin: 0, marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
      </div>

      <div className="section-header">
        <span className="section-title">Analytics</span>
      </div>

      <div className="card" style={{ margin: '0 1.25rem' }}>
        {labels.length > 0 ? (
          <>
            <div className="chart-wrap">
              <Doughnut data={chartData} options={options} />
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
