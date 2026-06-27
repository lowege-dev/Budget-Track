import React, { useState } from 'react';
import { useAccounts, useAddAccount, useDeleteAccount } from '../hooks/useAccounts';
import { useCurrency } from '../hooks/useCurrency';
import { PlusCircle, Trash2, Wallet } from 'lucide-react';

export const AccountManagement = () => {
  const { data: accounts, isLoading } = useAccounts();
  const { mutate: addAccount, isPending: isAdding } = useAddAccount();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const { currency } = useCurrency();

  const [name, setName] = useState('');
  const [type, setType] = useState('Bank');
  const [balance, setBalance] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addAccount({ name, type, balance: +balance }, {
      onSuccess: () => {
        setName('');
        setBalance('');
      }
    });
  };

  if (isLoading) return <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>;

  return (
    <div className="card">
      <div className="card-title">
        <Wallet size={20} /> My Accounts
      </div>
      
      <ul className="list" style={{ marginBottom: '1.5rem' }}>
        {accounts?.map(acc => (
          <li key={acc._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', opacity: isDeleting ? 0.7 : 1 }}>
            <div>
              <strong style={{ display: 'block' }}>{acc.name}</strong>
              <small style={{ color: 'var(--text-secondary)' }}>{acc.type}</small>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <strong>{currency}{acc.balance.toFixed(2)}</strong>
              <button onClick={() => deleteAccount(acc._id)} className="delete-btn" style={{ opacity: 1, transform: 'none' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
        {(!accounts || accounts.length === 0) && <p style={{ color: 'var(--text-secondary)' }}>No accounts yet.</p>}
      </ul>

      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Name (e.g. Chase)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}
            required
          />
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}
          >
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
            <option value="Credit Card">Credit Card</option>
            <option value="E-Wallet">E-Wallet</option>
          </select>
          <input 
            type="number" 
            placeholder={`Starting ${currency}`} 
            value={balance} 
            onChange={(e) => setBalance(e.target.value)} 
            style={{ width: '80px', padding: '0.5rem', borderRadius: '5px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}
          />
        </div>
        <button type="submit" className="btn" disabled={isAdding} style={{ padding: '0.5rem' }}>
           <PlusCircle size={18} /> {isAdding ? 'Adding...' : 'Add Account'}
        </button>
      </form>
    </div>
  );
};
