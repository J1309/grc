import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Get all orders
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('orders').order('desc').collect()
  },
})

// Add new order
export const add = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('orders', args)
  },
})

// Update order status
export const updateStatus = mutation({
  args: {
    orderId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('orders')
      .withIndex('by_orderId', (q) => q.eq('orderId', args.orderId))
      .first()

    if (existing) {
      const newUpdate = {
        id: 'upd-' + Date.now(),
        timestamp: 'Just now',
        status: args.status,
        message: `Order status updated to ${args.status}`,
        location: 'Store Hub',
      }
      const updates = [newUpdate, ...(existing.deliveryUpdates || [])]
      await ctx.db.patch(existing._id, {
        status: args.status,
        deliveryUpdates: updates,
      })
    }
  },
})

// Add delivery update
export const addDeliveryUpdate = mutation({
  args: {
    orderId: v.string(),
    status: v.string(),
    message: v.string(),
    courierName: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('orders')
      .withIndex('by_orderId', (q) => q.eq('orderId', args.orderId))
      .first()

    if (existing) {
      const newUpdate = {
        id: 'upd-' + Date.now(),
        timestamp: 'Just now',
        status: args.status,
        message: args.message,
        courierName: args.courierName,
        location: args.location || 'Central Distribution Hub',
      }
      const updates = [newUpdate, ...(existing.deliveryUpdates || [])]
      await ctx.db.patch(existing._id, {
        status: args.status,
        deliveryUpdates: updates,
      })
    }
  },
})
