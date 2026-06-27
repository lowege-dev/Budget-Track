import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Transaction } from './Transaction';
import { useTransactions, useAddTransaction } from '../hooks/useTransactions';
import { Search, Download, Upload, Calendar } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const TransactionList = () => {
  const { data: transactions, isLoading, isError } = useTransactions();
  const { mutate: addTransaction } = useAddTransaction();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd + K → focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // Ctrl/Cmd + E → export CSV
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportCSV();
      }
      // Ctrl/Cmd + P → print report
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Date preset logic
  const applyDatePreset = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    const fmt = (d) => d.toISOString().split('T')[0];

    switch (preset) {
      case '7d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 7);
        setDateFrom(fmt(from));
        setDateTo(fmt(today));
        break;
      }
      case '30d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 30);
        setDateFrom(fmt(from));
        setDateTo(fmt(today));
        break;
      }
      case '90d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 90);
        setDateFrom(fmt(from));
        setDateTo(fmt(today));
        break;
      }
      default:
        setDateFrom('');
        setDateTo('');
    }
  };

  if (isLoading) return (
    <>
      <div className="card-title">Recent Transactions</div>
      <div className="skeleton skeleton-text" style={{ height: '60px', borderRadius: '12px' }}></div>
      <div className="skeleton skeleton-text" style={{ height: '60px', borderRadius: '12px' }}></div>
      <div className="skeleton skeleton-text" style={{ height: '60px', borderRadius: '12px' }}></div>
    </>
  );

  if (isError) return <p>Error loading transactions.</p>;

  // Filter transactions with useMemo to avoid costly recalculations on every render
  const filteredTransactions = useMemo(() => {
    return transactions?.filter(t => {
      const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      
      // Date range filter
      let matchesDate = true;
      if (dateFrom) matchesDate = matchesDate && new Date(t.date) >= new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59);
        matchesDate = matchesDate && new Date(t.date) <= toDate;
      }
      
      return matchesSearch && matchesType && matchesDate;
    }) || [];
  }, [transactions, searchTerm, filterType, dateFrom, dateTo]);

  // Export CSV function
  const exportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) return;
    
    const headers = ['Date,Description,Category,Type,Amount'];
    const rows = filteredTransactions.map(t => {
      const date = new Date(t.date).toLocaleDateString();
      return `${date},"${t.text}",${t.category},${t.type},${t.amount}`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast(`Exported ${filteredTransactions.length} transactions`, 'success');
  };

  // Import CSV function
  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      let imported = 0;

      dataLines.forEach(line => {
        // Parse CSV: Date, Description, Category, Type, Amount
        const parts = line.match(/(".*?"|[^,]+)/g);
        if (!parts || parts.length < 5) return;

        const description = parts[1].replace(/"/g, '').trim();
        const category = parts[2].trim();
        const type = parts[3].trim().toLowerCase();
        const amount = parseFloat(parts[4]);

        if (description && !isNaN(amount)) {
          addTransaction({
            text: description,
            amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
            category: category || 'Other',
            type: type === 'income' ? 'income' : 'expense',
            tags: []
          });
          imported++;
        }
      });

      toast(`Imported ${imported} transactions`, 'success');
      e.target.value = ''; // Reset file input
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="card-title" style={{ margin: 0 }}>Recent Transactions</div>
        <div className="import-bar">
          <input type="file" ref={fileInputRef} accept=".csv" onChange={importCSV} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} className="import-btn" title="Import CSV">
            <Upload size={14} /> Import
          </button>
          <button onClick={exportCSV} className="import-btn" title="Export CSV (Ctrl+E)">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="date-range-bar">
        <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
        <button className={`date-chip ${datePreset === 'all' ? 'active' : ''}`} onClick={() => applyDatePreset('all')}>All</button>
        <button className={`date-chip ${datePreset === '7d' ? 'active' : ''}`} onClick={() => applyDatePreset('7d')}>7 Days</button>
        <button className={`date-chip ${datePreset === '30d' ? 'active' : ''}`} onClick={() => applyDatePreset('30d')}>30 Days</button>
        <button className={`date-chip ${datePreset === '90d' ? 'active' : ''}`} onClick={() => applyDatePreset('90d')}>90 Days</button>
        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setDatePreset('custom'); }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>to</span>
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setDatePreset('custom'); }} />
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
          <input 
            ref={searchRef}
            type="text" 
            placeholder="Search transactions... (Ctrl+K)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <ul className="list">
        {filteredTransactions?.map(transaction => (
          <Transaction key={transaction._id} transaction={transaction} />
        ))}
        {(!filteredTransactions || filteredTransactions.length === 0) && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
            No transactions found.
          </p>
        )}
      </ul>

      {/* Keyboard Shortcut Hints */}
      <div className="kbd-hint" style={{ marginTop: '1rem', justifyContent: 'center', display: 'flex', gap: '1.5rem' }}>
        <span><kbd>Ctrl</kbd>+<kbd>K</kbd> Search</span>
        <span><kbd>Ctrl</kbd>+<kbd>E</kbd> Export</span>
        <span><kbd>Ctrl</kbd>+<kbd>P</kbd> Print</span>
      </div>
    </>
  )
}
