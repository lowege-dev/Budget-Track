import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Printer } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="header header-container">
      <div>
        <h1>Budget Track</h1>
        <p>Master your finances with ease</p>
      </div>

      {user && (
        <div className="header-actions">
          <span className="header-greeting">Hello, {user.name}</span>
          <button onClick={() => window.print()} className="btn header-btn" title="Print Report (Ctrl+P)">
            <Printer size={16} />
            <span className="hide-on-mobile">Print</span>
          </button>
          <button onClick={logout} className="btn header-btn">
            <LogOut size={16} /> 
            <span className="hide-on-mobile">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
