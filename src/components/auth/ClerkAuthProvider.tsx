import React, { createContext, useContext } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'

// Check for Clerk Publishable Key in Vite environment
const getClerkKey = (): string | undefined => {
  try {
    return (
      (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY ||
      (import.meta as any).env?.CLERK_PUBLISHABLE_KEY ||
      undefined
    )
  } catch (e) {
    return undefined
  }
}

const CLERK_PUBLISHABLE_KEY = getClerkKey()

interface ClerkAuthContextType {
  isClerkConfigured: boolean
}

const ClerkAuthContext = createContext<ClerkAuthContextType>({
  isClerkConfigured: false,
})

export const useClerkStatus = () => useContext(ClerkAuthContext)

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isKeyValid = Boolean(
    CLERK_PUBLISHABLE_KEY &&
    CLERK_PUBLISHABLE_KEY.trim().length > 0 &&
    (CLERK_PUBLISHABLE_KEY.startsWith('pk_test_') || CLERK_PUBLISHABLE_KEY.startsWith('pk_live_'))
  )

  if (isKeyValid && CLERK_PUBLISHABLE_KEY) {
    return (
      <ClerkAuthContext.Provider value={{ isClerkConfigured: true }}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
          {children}
        </ClerkProvider>
      </ClerkAuthContext.Provider>
    )
  }

  // Graceful fallback for development / before user sets up Clerk keys in .env
  return (
    <ClerkAuthContext.Provider value={{ isClerkConfigured: false }}>
      {children}
    </ClerkAuthContext.Provider>
  )
}
export default ClerkAuthProvider
