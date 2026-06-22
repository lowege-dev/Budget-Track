import React, { useState } from 'react';
import { useAddTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { PlusCircle, Check } from 'lucide-react';

export const AddTab = ({ onDone }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [accountId, setAccountId] = useState('');
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
      account: accountId || null,
      tags: []
    }, {
      onSuccess: () => {
        setText('');
        setAmount('');
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onDone(); }, 1200);
      }
    });
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.25rem', gap: '1rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e6fff7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={32} color="var(--success)" />
        </div>
        <h3 style={{ fontWeight: 700 }}>Transaction Added!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting to Home...</p>
      </div>
    );
  }

  return (
    <div className="add-form" style={{ paddingTop: '0.5rem' }}>
      <form onSubmit={onSubmit}>
        {/* Type Toggle */}
        <div className="type-toggle">
          <button type="button" className={`type-btn ${type === 'expense' ? 'active-expense' : ''}`} onClick={() => setType('expense')}>Expense</button>
          <button type="button" className={`type-btn ${type === 'income' ? 'active-income' : ''}`} onClick={() => setType('income')}>Income</button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Coffee at Starbucks" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input className="form-input" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {accounts && accounts.length > 0 && (
          <div className="form-group">
            <label className="form-label">Account</label>
            <select className="form-input" value={accountId} onChange={e => setAccountId(e.target.value)}>
              <option value="">None</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>{acc.name} ({acc.type})</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isPending}>
          <PlusCircle size={20} />
          {isPending ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};
