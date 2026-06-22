import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Wallet } from 'lucide-react';

export const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Wallet size={32} color="white" />
          </div>
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn auth-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <span onClick={onSwitchToRegister} className="auth-link">
              Create one now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
