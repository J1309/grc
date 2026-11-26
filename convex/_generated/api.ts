import { anyApi, FunctionReference } from 'convex/server'

export interface ApiType {
  products: {
    list: FunctionReference<'query', 'public', Record<string, never>, any[]>
    add: FunctionReference<'mutation', 'public', {
      productId: string
      name: string
      category: string
      categorySlug: string
      price: number
      originalPrice?: number
      discount?: string
      unit: string
      image: string
      description: string
      inStock: boolean
      isLatest?: boolean
      isBestSeller?: boolean
      isSpecialOffer?: boolean
      origin?: string
      rating: number
      reviewsCount: number
    }, any>
    update: FunctionReference<'mutation', 'public', {
      productId: string
      updates: Record<string, any>
    }, any>
    remove: FunctionReference<'mutation', 'public', { productId: string }, any>
    toggleStock: FunctionReference<'mutation', 'public', { productId: string }, any>
    seedInitialProducts: FunctionReference<'mutation', 'public', { items: any[] }, any>
  }
  orders: {
    list: FunctionReference<'query', 'public', { customerEmail?: string }, any[]>
    add: FunctionReference<'mutation', 'public', {
      orderId: string
      customerName: string
      customerEmail: string
      customerPhone: string
      address: string
      city: string
      zip: string
      items: Array<{
        productName: string
        quantity: number
        price: number
        unit: string
        image?: string
      }>
      itemsCount: number
      total: number
      deliverySlot: string
      paymentMethod: string
      status: string
      createdAt: string
      trackingNumber?: string
      estimatedDelivery?: string
      deliveryUpdates?: Array<{
        id: string
        timestamp: string
        status: string
        message: string
        courierName?: string
        location?: string
      }>
    }, any>
    updateStatus: FunctionReference<'mutation', 'public', { orderId: string; status: string }, any>
    addDeliveryUpdate: FunctionReference<'mutation', 'public', {
      orderId: string
      status: string
      message: string
      courierName?: string
      location?: string
    }, any>
  }
}

export const api: ApiType = anyApi as unknown as ApiType
