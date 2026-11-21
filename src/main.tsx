import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClerkAuthProvider } from './components/auth/ClerkAuthProvider'
import { ConvexClientProvider } from './context/ConvexClientProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkAuthProvider>
      <ConvexClientProvider>
        <App />
      </ConvexClientProvider>
    </ClerkAuthProvider>
  </React.StrictMode>,
)
