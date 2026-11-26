import React, { createContext, useContext } from 'react'
import { ClerkProvider, useUser } from '@clerk/clerk-react'

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
  isSignedIn: boolean
  user: any
  isAdmin: boolean
}

const ClerkAuthContext = createContext<ClerkAuthContextType>({
  isClerkConfigured: false,
  isSignedIn: false,
  user: null,
  isAdmin: false,
})

export const useClerkStatus = () => useContext(ClerkAuthContext)

const ClerkBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useUser()

  const publicMetadata = (user?.publicMetadata || {}) as Record<string, any>

  // Admin role check strictly from verified Clerk metadata or organization membership
  const isAdmin = Boolean(
    isSignedIn &&
    user &&
    (
      publicMetadata.role === 'admin' ||
      publicMetadata.isAdmin === true ||
      publicMetadata.admin === true ||
      user.organizationMemberships?.some((m: any) => m.role === 'admin' || m.role === 'org:admin')
    )
  )

  return (
    <ClerkAuthContext.Provider
      value={{
        isClerkConfigured: true,
        isSignedIn: Boolean(isSignedIn),
        user: user || null,
        isAdmin,
      }}
    >
      {children}
    </ClerkAuthContext.Provider>
  )
}

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isKeyValid = Boolean(
    CLERK_PUBLISHABLE_KEY &&
    CLERK_PUBLISHABLE_KEY.trim().length > 0 &&
    (CLERK_PUBLISHABLE_KEY.startsWith('pk_test_') || CLERK_PUBLISHABLE_KEY.startsWith('pk_live_'))
  )

  if (isKeyValid && CLERK_PUBLISHABLE_KEY) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ClerkBridge>{children}</ClerkBridge>
      </ClerkProvider>
    )
  }

  // Graceful fallback for development / before user sets up Clerk keys in .env
  return (
    <ClerkAuthContext.Provider value={{ isClerkConfigured: false, isSignedIn: false, user: null, isAdmin: false }}>
      {children}
    </ClerkAuthContext.Provider>
  )
}
export default ClerkAuthProvider
