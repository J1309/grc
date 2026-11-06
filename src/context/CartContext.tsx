import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem, ToastMessage } from '../types'

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  couponCode: string
  couponDiscountPercent: number
  applyCoupon: (code: string) => boolean
  isCheckoutOpen: boolean
  setIsCheckoutOpen: (open: boolean) => void
  quickViewProduct: Product | null
  setQuickViewProduct: (product: Product | null) => void
  toasts: ToastMessage[]
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'cart') => void
  removeToast: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const FREE_SHIPPING_THRESHOLD = 35.0

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('grocerycart_items')
      return saved ? JSON.parse(saved) : [
        // Preload 1 sample item so user immediately feels the live cart
        {
          product: {
            id: 'prod-1',
            name: 'Premium Aged Basmati Rice',
            category: 'Rice',
            categorySlug: 'rice',
            price: 24.99,
            originalPrice: 29.99,
            discount: '15% Off',
            rating: 4.8,
            reviewsCount: 120,
            unit: '1 kg bag',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
            description: 'Long grain extra-fluffy Royal Himalayan aged basmati rice.',
            inStock: true,
          },
          quantity: 1
        }
      ]
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    try {
      localStorage.setItem('grocerycart_items', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [cart])

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'cart' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
    addToast(`Added to Cart`, `${product.name} (${quantity} ${product.unit})`, 'cart')
  }

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId)
    setCart((prev) => prev.filter((i) => i.product.id !== productId))
    if (item) {
      addToast(`Removed from Cart`, item.product.name, 'info')
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase()
    if (normalized === 'SAVE10' || normalized === 'GROCERY10') {
      setCouponCode(normalized)
      setCouponDiscountPercent(10)
      addToast('Promo Code Applied!', '10% discount applied to your order', 'success')
      return true
    } else if (normalized === 'WELCOME15') {
      setCouponCode(normalized)
      setCouponDiscountPercent(15)
      addToast('Promo Code Applied!', '15% new shopper discount applied', 'success')
      return true
    } else {
      addToast('Invalid Promo Code', 'Try using code "SAVE10" or "WELCOME15"', 'info')
      return false
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = (subtotal * couponDiscountPercent) / 100
  const deliveryFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99
  const total = Math.max(0, subtotal - discount + deliveryFee)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        couponDiscountPercent,
        applyCoupon,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

