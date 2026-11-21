import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    productId: v.string(),
    name: v.string(),
    category: v.string(),
    categorySlug: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.string()),
    unit: v.string(),
    image: v.string(),
    description: v.string(),
    inStock: v.boolean(),
    isLatest: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isSpecialOffer: v.optional(v.boolean()),
    origin: v.optional(v.string()),
    rating: v.number(),
    reviewsCount: v.number(),
  })
    .index('by_productId', ['productId'])
    .index('by_categorySlug', ['categorySlug']),

  orders: defineTable({
    orderId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    address: v.string(),
    city: v.string(),
    zip: v.string(),
    items: v.array(
      v.object({
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
        unit: v.string(),
        image: v.optional(v.string()),
      })
    ),
    itemsCount: v.number(),
    total: v.number(),
    deliverySlot: v.string(),
    paymentMethod: v.string(),
    status: v.string(),
    createdAt: v.string(),
    trackingNumber: v.optional(v.string()),
    estimatedDelivery: v.optional(v.string()),
    deliveryUpdates: v.optional(
      v.array(
        v.object({
          id: v.string(),
          timestamp: v.string(),
          status: v.string(),
          message: v.string(),
          courierName: v.optional(v.string()),
          location: v.optional(v.string()),
        })
      )
    ),
  }).index('by_orderId', ['orderId']),
})
