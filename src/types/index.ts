export interface Product {
  id: string
  name: string
  category: string
  categorySlug: string
  price: number
  originalPrice?: number
  discount?: string
  rating: number
  reviewsCount: number
  unit: string
  image: string
  description: string
  inStock: boolean
  isLatest?: boolean
  isBestSeller?: boolean
  isSpecialOffer?: boolean
  origin?: string
  tags?: string[]
  nutrition?: {
    calories: string
    protein: string
    carbs: string
    fat: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  itemCount: number
  bgColor: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info' | 'cart'
}

export type OrderStatus = 'Pending' | 'Packing' | 'Out for Delivery' | 'Completed' | 'Cancelled'

export interface OrderItem {
  productName: string
  quantity: number
  price: number
  unit: string
  image?: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  zip: string
  items: OrderItem[]
  itemsCount: number
  total: number
  deliverySlot: string
  paymentMethod: string
  status: OrderStatus
  createdAt: string
}

