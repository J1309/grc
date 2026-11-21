import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, Order, OrderStatus, DeliveryUpdate } from '../types'
import { PRODUCTS } from '../data/products'
import { INITIAL_ORDERS } from '../data/orders'

interface StoreContextType {
  products: Product[]
  orders: Order[]
  currentView: 'storefront' | 'admin'
  setCurrentView: (view: 'storefront' | 'admin') => void
  addProduct: (product: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleStock: (id: string) => void
  resetProductsToDefault: () => void
  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  addDeliveryUpdate: (
    orderId: string,
    status: OrderStatus,
    message: string,
    courierName?: string,
    location?: string
  ) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const PRODUCTS_STORAGE_KEY = 'grocery_cart_products_v2'
const ORDERS_STORAGE_KEY = 'grocery_cart_orders_v2'

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync view with URL hash (#admin / #storefront)
  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'storefront'
  })

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin')
      } else if (window.location.hash === '#storefront' || window.location.hash === '') {
        setCurrentView('storefront')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const setViewWithHash = (view: 'storefront' | 'admin') => {
    setCurrentView(view)
    window.location.hash = view === 'admin' ? '#admin' : '#storefront'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Load products with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Could not load products from storage', e)
    }
    return PRODUCTS
  })

  // Load orders with localStorage fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Could not load orders from storage', e)
    }
    return INITIAL_ORDERS
  })

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch (e) {
      console.warn('Could not save products to storage', e)
    }
  }, [products])

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch (e) {
      console.warn('Could not save orders to storage', e)
    }
  }, [orders])

  // CRUD: Add Product
  const addProduct = (newProductData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...newProductData,
      id: 'prod-' + Date.now(),
      rating: newProductData.rating || 4.8,
      reviewsCount: newProductData.reviewsCount || 12,
    }
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  // CRUD: Update Product
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  // CRUD: Delete Product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))
  }

  // Fast stock toggle
  const toggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    )
  }

  // Reset to original default data
  const resetProductsToDefault = () => {
    setProducts(PRODUCTS)
    setOrders(INITIAL_ORDERS)
    try {
      localStorage.removeItem(PRODUCTS_STORAGE_KEY)
      localStorage.removeItem(ORDERS_STORAGE_KEY)
    } catch (e) {
      // ignore
    }
  }

  // Order Management: Add Order (from checkout)
  const addOrder = (order: Order) => {
    const orderWithTimeline: Order = {
      ...order,
      trackingNumber: order.trackingNumber || `TRK-${Math.floor(10000 + Math.random() * 90000)}-NY`,
      estimatedDelivery: order.estimatedDelivery || 'Today within 2 hours',
      deliveryUpdates: order.deliveryUpdates || [
        {
          id: 'upd-' + Date.now(),
          timestamp: 'Just now',
          status: 'Pending',
          message: 'Order placed successfully. Awaiting fulfillment team assignment.',
          location: 'Online Store Checkout',
        },
      ],
    }
    setOrders((prev) => [orderWithTimeline, ...prev])
  }

  // Order Management: Update Order Status
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== id) return ord
        const newUpdate: DeliveryUpdate = {
          id: 'upd-' + Date.now(),
          timestamp: 'Just now',
          status,
          message: `Status updated to ${status} by Store Operations.`,
          location: 'Dispatch Central',
        }
        return {
          ...ord,
          status,
          deliveryUpdates: [newUpdate, ...(ord.deliveryUpdates || [])],
        }
      })
    )
  }

  // Order Management: Add Delivery Update with custom note and courier details
  const addDeliveryUpdate = (
    orderId: string,
    status: OrderStatus,
    message: string,
    courierName?: string,
    location?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord
        const newUpdate: DeliveryUpdate = {
          id: 'upd-' + Date.now(),
          timestamp: 'Just now',
          status,
          message: message.trim() || `Delivery status changed to ${status}`,
          courierName: courierName?.trim() || undefined,
          location: location?.trim() || 'Central Distribution Hub',
        }
        return {
          ...ord,
          status,
          deliveryUpdates: [newUpdate, ...(ord.deliveryUpdates || [])],
        }
      })
    )
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        currentView,
        setCurrentView: setViewWithHash,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        resetProductsToDefault,
        addOrder,
        updateOrderStatus,
        addDeliveryUpdate,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
