import React, { useState } from 'react'
import { useAddTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { PlusCircle } from 'lucide-react';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [accountId, setAccountId] = useState('');

  const { data: accounts } = useAccounts();
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const onSubmit = e => {
    e.preventDefault();

    const newTransaction = {
      text,
      amount: type === 'expense' ? -Math.abs(+amount) : Math.abs(+amount),
      category,
      type,
      account: accountId || null,
      tags: []
    }

    addTransaction(newTransaction, {
      onSuccess: () => {
        setText('');
        setAmount('');
      }
    });
  }

  return (
    <>
      <div className="card-title">Add new transaction</div>
      <form onSubmit={onSubmit}>
        <div className="form-control" style={{ display: 'flex', gap: '1rem' }}>
           <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
             <input type="radio" name="type" checked={type === 'expense'} onChange={() => setType('expense')} /> Expense
           </label>
           <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
             <input type="radio" name="type" checked={type === 'income'} onChange={() => setType('income')} /> Income
           </label>
        </div>

        <div className="form-control">
          <label htmlFor="text">Description</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter description..." required />
        </div>
        
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {accounts && accounts.length > 0 && (
          <div className="form-control">
            <label htmlFor="account">Account</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">None</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>{acc.name} ({acc.type})</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." required />
        </div>
        
        <button className="btn" disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
          <PlusCircle size={20} />
          {isPending ? 'Adding...' : 'Add transaction'}
        </button>
      </form>
    </>
  )
}
