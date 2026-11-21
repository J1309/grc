import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, Order, OrderStatus, DeliveryUpdate } from '../types'
import { PRODUCTS } from '../data/products'
import { INITIAL_ORDERS } from '../data/orders'
import { useConvexStatus } from './ConvexClientProvider'
import { api } from '../../convex/_generated/api'

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

const PRODUCTS_STORAGE_KEY = 'grocery_cart_products_v3'
const ORDERS_STORAGE_KEY = 'grocery_cart_orders_v3'

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConvexConfigured, convexClient } = useConvexStatus()

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

  // Real-time synchronization with Convex Cloud Database
  useEffect(() => {
    if (!isConvexConfigured || !convexClient) return

    try {
      const productsWatch = convexClient.watchQuery(api.products.list, {})
      const handleProductsUpdate = () => {
        const remoteProducts = productsWatch.localQueryResult()
        if (Array.isArray(remoteProducts)) {
          if (remoteProducts.length > 0) {
            const formatted: Product[] = remoteProducts.map((p: any) => ({
              id: p.productId || p._id,
              name: p.name,
              category: p.category,
              categorySlug: p.categorySlug,
              price: p.price,
              originalPrice: p.originalPrice,
              discount: p.discount,
              unit: p.unit,
              image: p.image,
              description: p.description,
              inStock: p.inStock,
              isLatest: p.isLatest ?? true,
              isBestSeller: p.isBestSeller ?? false,
              isSpecialOffer: p.isSpecialOffer ?? false,
              origin: p.origin ?? 'Farm Direct',
              rating: p.rating ?? 4.8,
              reviewsCount: p.reviewsCount ?? 12,
            }))
            setProducts(formatted)
          } else {
            // Seed initial catalog to Convex cloud database so the store is pre-populated
            convexClient
              .mutation(api.products.seedInitialProducts, { items: PRODUCTS })
              .catch(console.warn)
          }
        }
      }
      const unsubscribeProducts = productsWatch.onUpdate(handleProductsUpdate)
      handleProductsUpdate()

      const ordersWatch = convexClient.watchQuery(api.orders.list, {})
      const handleOrdersUpdate = () => {
        const remoteOrders = ordersWatch.localQueryResult()
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          const formatted: Order[] = remoteOrders.map((o: any) => ({
            id: o.orderId || o._id,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone,
            address: o.address,
            city: o.city,
            zip: o.zip,
            items: o.items,
            itemsCount: o.itemsCount,
            total: o.total,
            deliverySlot: o.deliverySlot,
            paymentMethod: o.paymentMethod,
            status: o.status as OrderStatus,
            createdAt: o.createdAt,
            trackingNumber: o.trackingNumber,
            estimatedDelivery: o.estimatedDelivery,
            deliveryUpdates: o.deliveryUpdates || [],
          }))
          setOrders(formatted)
        }
      }
      const unsubscribeOrders = ordersWatch.onUpdate(handleOrdersUpdate)
      handleOrdersUpdate()

      return () => {
        unsubscribeProducts()
        unsubscribeOrders()
      }
    } catch (e) {
      console.warn('Convex live sync error:', e)
    }
  }, [isConvexConfigured, convexClient])

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch (e) {
      console.warn('Could not save products to storage', e)
    }
  }, [products])

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch (e) {
      console.warn('Could not save orders to storage', e)
    }
  }, [orders])

  // CRUD: Add Product (Instantly visible in live website)
  const addProduct = (newProductData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...newProductData,
      id: 'prod-' + Date.now(),
      isLatest: true,
      rating: newProductData.rating || 4.8,
      reviewsCount: newProductData.reviewsCount || 12,
    }
    setProducts((prev) => [newProduct, ...prev])

    // Sync to Convex Cloud
    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.products.add, {
          productId: newProduct.id,
          name: newProduct.name,
          category: newProduct.category,
          categorySlug: newProduct.categorySlug,
          price: newProduct.price,
          originalPrice: newProduct.originalPrice,
          discount: newProduct.discount,
          unit: newProduct.unit,
          image: newProduct.image,
          description: newProduct.description,
          inStock: newProduct.inStock,
          isLatest: true,
          isBestSeller: newProduct.isBestSeller ?? false,
          isSpecialOffer: newProduct.isSpecialOffer ?? false,
          origin: newProduct.origin ?? 'Farm Direct',
          rating: newProduct.rating,
          reviewsCount: newProduct.reviewsCount,
        })
        .catch(console.error)
    }

    return newProduct
  }

  // CRUD: Update Product
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )

    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.products.update, { productId: id, updates })
        .catch(console.error)
    }
  }

  // CRUD: Delete Product (Instantly removed from live website)
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))

    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.products.remove, { productId: id })
        .catch(console.error)
    }
  }

  // Fast stock toggle
  const toggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    )

    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.products.toggleStock, { productId: id })
        .catch(console.error)
    }
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

    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.orders.add, {
          orderId: orderWithTimeline.id,
          customerName: orderWithTimeline.customerName,
          customerEmail: orderWithTimeline.customerEmail,
          customerPhone: orderWithTimeline.customerPhone,
          address: orderWithTimeline.address,
          city: orderWithTimeline.city,
          zip: orderWithTimeline.zip,
          items: orderWithTimeline.items,
          itemsCount: orderWithTimeline.itemsCount,
          total: orderWithTimeline.total,
          deliverySlot: orderWithTimeline.deliverySlot,
          paymentMethod: orderWithTimeline.paymentMethod,
          status: orderWithTimeline.status,
          createdAt: orderWithTimeline.createdAt,
          trackingNumber: orderWithTimeline.trackingNumber,
          estimatedDelivery: orderWithTimeline.estimatedDelivery,
          deliveryUpdates: orderWithTimeline.deliveryUpdates,
        })
        .catch(console.error)
    }
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

    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.orders.updateStatus, { orderId: id, status })
        .catch(console.error)
    }
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

    if (isConvexConfigured && convexClient) {
      convexClient
        .mutation(api.orders.addDeliveryUpdate, {
          orderId,
          status,
          message: message.trim() || `Delivery status changed to ${status}`,
          courierName,
          location,
        })
        .catch(console.error)
    }
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
