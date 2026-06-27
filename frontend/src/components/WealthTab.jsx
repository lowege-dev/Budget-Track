import React, { useState } from 'react';
import { useGoals, useAddGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useGoals';
import { useCurrency } from '../hooks/useCurrency';
import { useToast } from '../hooks/useToast';
import { Target, ShieldAlert, CreditCard, TrendingUp, Plus, Trash2, PlusCircle, CheckCircle2, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'savings',    label: 'Savings Goals',  color: '#6C5CE7', bg: 'rgba(108,92,231,0.1)',  icon: Target },
  { id: 'emergency',  label: 'Emergency Fund',  color: '#FDCB6E', bg: 'rgba(253,203,110,0.15)', icon: ShieldAlert },
  { id: 'debt',       label: 'Debt Tracker',    color: '#E74C3C', bg: 'rgba(231,76,60,0.1)',   icon: CreditCard },
  { id: 'investment', label: 'Investments',     color: '#00B894', bg: 'rgba(0,184,148,0.1)',   icon: TrendingUp },
];

const ProgressBar = ({ percentage, color }) => (
  <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
    <div style={{
      width: `${percentage}%`,
      height: '100%',
      borderRadius: '99px',
      background: percentage >= 100 ? '#00B894' : color,
      transition: 'width 0.5s cubic-bezier(.4,0,.2,1)'
    }} />
  </div>
);

export const WealthTab = () => {
  const { currency } = useCurrency();
  const { data: goals, isLoading } = useGoals();
  const { mutate: addGoal, isPending: isAdding } = useAddGoal();
  const { mutate: updateGoal } = useUpdateGoal();
  const { mutate: deleteGoal } = useDeleteGoal();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'savings', targetAmount: '', deadline: '' });
  const [addingFundsId, setAddingFundsId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');

  const totalSaved = (goals || [])
    .filter(g => g.type !== 'debt')
    .reduce((s, g) => s + g.currentAmount, 0);
  const totalDebt = (goals || [])
    .filter(g => g.type === 'debt')
    .reduce((s, g) => s + (g.targetAmount - g.currentAmount), 0);

  if (isLoading) return (
    <div style={{ paddingTop: '1rem', paddingRight: '1.25rem', paddingBottom: '90px', paddingLeft: '1.25rem' }}>
      {/* Summary banner skeleton */}
      <div className="skeleton" style={{ height: 100, borderRadius: 22, marginBottom: 20 }} />
      {/* Section header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 160, height: 20, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 100, height: 36, borderRadius: 99 }} />
      </div>
      {/* Goal card skeletons */}
      {[1,2,3].map(i => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div className="skeleton" style={{ height: 160, borderRadius: 18 }} />
        </div>
      ))}
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;
    addGoal({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    }, { onSuccess: () => {
      toast('Goal created successfully!', 'success');
      setFormData({ name: '', type: 'savings', targetAmount: '', deadline: '' });
      setIsFormOpen(false);
    }, onError: () => toast('Failed to create goal', 'error') });
  };

  const handleAddFunds = (goal) => {
    const amt = Number(fundAmount);
    if (!fundAmount || isNaN(amt) || amt <= 0) return;
    updateGoal({ id: goal._id, updates: { currentAmount: goal.currentAmount + amt } }, {
      onSuccess: () => toast(`Added ${currency}${amt} to goal!`, 'success'),
      onError: () => toast('Failed to add funds', 'error'),
    });
    setAddingFundsId(null);
    setFundAmount('');
  };

  return (
    <div style={{ paddingBottom: '90px' }}>
      {/* Summary Banner */}
      <div style={{
        margin: '1rem 1.25rem',
        padding: '1.5rem',
        borderRadius: '22px',
        background: 'linear-gradient(135deg, #2D1B69 0%, #11998E 100%)',
        color: 'white',
        display: 'flex',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(45,27,105,0.3)',
      }}>
        <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -50, right: -30 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Saved</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{currency}{totalSaved.toFixed(2)}</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ flex: 1, paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining Debt</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{currency}{totalDebt.toFixed(2)}</div>
        </div>
      </div>

      {/* Header */}
      <div className="section-header">
        <span className="section-title">My Financial Goals</span>
        <button
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '99px' }}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Goal</>}
        </button>
      </div>

      {/* Create Form */}
      {isFormOpen && (
        <div style={{ padding: '0 1.25rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{
            background: 'var(--surface)',
            borderRadius: '18px',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create New Goal</h3>

            {/* Category Selector - icon grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const selected = formData.type === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({...formData, type: cat.id})}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${selected ? cat.color : 'var(--border)'}`,
                      background: selected ? cat.bg : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: selected ? cat.color : 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={16} color={selected ? cat.color : 'var(--text-secondary)'} />
                    {cat.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Goal name (e.g. Vacation Fund)"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="number"
                className="form-input"
                placeholder="Target amount (e.g. 5000)"
                value={formData.targetAmount}
                onChange={e => setFormData({...formData, targetAmount: e.target.value})}
                required
                min="1"
              />
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                style={{ color: formData.deadline ? 'var(--text)' : 'var(--text-secondary)' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              disabled={isAdding}
            >
              {isAdding ? 'Creating...' : '+ Create Goal'}
            </button>
          </form>
        </div>
      )}

      {/* Goal cards per category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1.25rem' }}>
        {CATEGORIES.map(cat => {
          const catGoals = (goals || []).filter(g => g.type === cat.id);
          if (!catGoals.length) return null;
          const Icon = cat.icon;

          return (
            <div key={cat.id} style={{ marginBottom: '1rem' }}>
              {/* Category label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                paddingLeft: '0.25rem',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: cat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={cat.color} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: cat.color }}>
                  {cat.label}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {catGoals.map(goal => {
                  const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                  const isComplete = percentage >= 100;
                  const isEditing = addingFundsId === goal._id;

                  return (
                    <div
                      key={goal._id}
                      style={{
                        background: 'var(--surface)',
                        borderRadius: '18px',
                        padding: '1.25rem',
                        border: '1px solid var(--border)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        position: 'relative',
                      }}
                    >
                      {/* Delete button */}
                      <button
                        onClick={() => { if(window.confirm('Delete this goal?')) deleteGoal(goal._id, { onSuccess: () => toast('Goal deleted', 'info'), onError: () => toast('Failed to delete goal', 'error') }); }}
                        style={{
                          position: 'absolute',
                          top: '1rem', right: '1rem',
                          width: 30, height: 30,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'var(--bg)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.color = 'var(--danger)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Goal header */}
                      <div style={{ paddingRight: '2.5rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{goal.name}</div>
                        {goal.deadline && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            🎯 Deadline: {new Date(goal.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>

                      {/* Amounts */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: cat.color }}>
                          {currency}{goal.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, alignSelf: 'flex-end' }}>
                          / {currency}{goal.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: '1rem' }}>
                        <ProgressBar percentage={percentage} color={cat.color} />
                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>

                      {/* Action row */}
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="Enter amount..."
                            value={fundAmount}
                            onChange={e => setFundAmount(e.target.value)}
                            autoFocus
                            min="0"
                            style={{ flex: 1, padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                          />
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddFunds(goal)}
                            style={{ padding: '0.6rem 1rem', whiteSpace: 'nowrap', fontSize: '0.9rem' }}
                          >
                            Add
                          </button>
                          <button
                            className="btn"
                            onClick={() => { setAddingFundsId(null); setFundAmount(''); }}
                            style={{ padding: '0.6rem 0.75rem', fontSize: '0.9rem' }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {isComplete ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00B894', fontWeight: 700, fontSize: '0.9rem' }}>
                              <CheckCircle2 size={18} /> Completed!
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              {currency}{(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining
                            </span>
                          )}
                          <button
                            className="btn"
                            onClick={() => { setAddingFundsId(goal._id); setFundAmount(''); }}
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              color: cat.color,
                              borderColor: cat.color,
                              fontWeight: 600,
                            }}
                          >
                            <PlusCircle size={15} /> Update
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {(goals || []).length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <Target size={36} style={{ opacity: 0.3 }} />
            </div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No goals yet</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Tap "+ New Goal" to start tracking your savings, emergency fund, debts, or investments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
