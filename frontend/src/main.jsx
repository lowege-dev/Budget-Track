import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './skeleton.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/AuthContext'
import axios from 'axios'

// Set default base URL for API requests. 
// Locally, it falls back to empty string (which uses the vite.config.js proxy to localhost:5000)
// On Vercel, it uses the VITE_API_URL environment variable.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
// Removed artificial network delay to improve performance

const queryClient = new QueryClient()

import { GoogleOAuthProvider } from '@react-oauth/google'

import { ToastProvider } from './hooks/useToast.jsx'

const GOOGLE_CLIENT_ID = '967279769061-gd9j9e1hn55bs7e0ibkkjl55cc5rkfc5.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
