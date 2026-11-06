import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '../types'
import { useCart } from './CartContext'

interface WishlistContextType {
  wishlistIds: string[]
  toggleWishlist: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useCart()
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('grocerycart_wishlist')
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4']
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('grocerycart_wishlist', JSON.stringify(wishlistIds))
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e)
    }
  }, [wishlistIds])

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        addToast('Removed from Wishlist', product.name, 'info')
        return prev.filter((id) => id !== product.id)
      } else {
        addToast('Saved to Wishlist', product.name, 'success')
        return [...prev, product.id]
      }
    })
  }

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

