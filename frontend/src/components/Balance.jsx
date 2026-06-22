import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export const Balance = () => {
  const { data: transactions, isLoading, isError } = useTransactions();

  if (isLoading) return <div className="skeleton skeleton-title" style={{ margin: '0 auto', height: '200px', width: '100%', borderRadius: '20px' }}></div>;
  if (isError) return <div className="balance-amount">Error</div>;

  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  return (
    <div className="balance-hero">
      <div className="balance-hero-bg">
        <div className="balance-hero-circle c1"></div>
        <div className="balance-hero-circle c2"></div>
      </div>
      
      <div className="balance-hero-content">
        <div className="balance-hero-top">
          <div className="balance-hero-icon">
            <Wallet size={22} />
          </div>
          <span className="balance-hero-label">Total Balance</span>
        </div>
        
        <h1 className="balance-hero-amount">${total}</h1>
        
        <div className="balance-hero-stats">
          <div className="balance-hero-stat">
            <div className="stat-icon income">
              <TrendingUp size={14} />
            </div>
            <div>
              <span className="stat-label">Income</span>
              <span className="stat-value plus">+${income}</span>
            </div>
          </div>
          <div className="balance-hero-stat">
            <div className="stat-icon expense">
              <TrendingDown size={14} />
            </div>
            <div>
              <span className="stat-label">Expense</span>
              <span className="stat-value minus">-${expense}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
