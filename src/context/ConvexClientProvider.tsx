import React, { createContext, useContext, useMemo } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const getConvexUrl = (): string | undefined => {
  try {
    return (
      (import.meta as any).env?.VITE_CONVEX_URL ||
      (import.meta as any).env?.CONVEX_URL ||
      undefined
    )
  } catch (e) {
    return undefined
  }
}

interface ConvexStatusContextType {
  isConvexConfigured: boolean
  convexUrl?: string
  convexClient: ConvexReactClient | null
}

const ConvexStatusContext = createContext<ConvexStatusContextType>({
  isConvexConfigured: false,
  convexClient: null,
})

export const useConvexStatus = () => useContext(ConvexStatusContext)

export const ConvexClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const convexUrl = getConvexUrl()

  const isValidUrl = Boolean(
    convexUrl &&
    convexUrl.trim().length > 0 &&
    (convexUrl.startsWith('https://') || convexUrl.startsWith('http://'))
  )

  const client = useMemo(() => {
    if (isValidUrl && convexUrl) {
      try {
        return new ConvexReactClient(convexUrl)
      } catch (e) {
        console.warn('Could not initialize Convex client:', e)
        return null
      }
    }
    return null
  }, [isValidUrl, convexUrl])

  if (client) {
    return (
      <ConvexProvider client={client}>
        <ConvexStatusContext.Provider
          value={{ isConvexConfigured: true, convexUrl, convexClient: client }}
        >
          {children}
        </ConvexStatusContext.Provider>
      </ConvexProvider>
    )
  }

  return (
    <ConvexStatusContext.Provider
      value={{ isConvexConfigured: false, convexUrl, convexClient: null }}
    >
      {children}
    </ConvexStatusContext.Provider>
  )
}
export default ConvexClientProvider
