import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Wallet } from 'lucide-react';

export const Register = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      onSwitchToLogin(); // Send them back to the login screen
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
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
          <h2>Create Account</h2>
          <p>Join Budget Track to master your finances</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

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
              placeholder="Password (min 6 chars)" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              minLength="6" 
              required 
            />
          </div>

          <button type="submit" className="btn auth-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <span onClick={onSwitchToLogin} className="auth-link">
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
