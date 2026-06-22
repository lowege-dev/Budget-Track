import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './skeleton.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/AuthContext'
import axios from 'axios'

// Add a global delay to simulate real-world network latency (so loading animations look good!)
axios.interceptors.response.use(
  async (response) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
