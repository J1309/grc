import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

async function checkOrderWriteAccess(ctx: { auth: { getUserIdentity: () => Promise<any> } }) {
  const identity = await ctx.auth.getUserIdentity()
  if (process.env.CLERK_JWT_ISSUER_DOMAIN && !identity) {
    throw new Error('Unauthorized: Authentication required to update order dispatch.')
  }
  return identity
}

// Get orders (optionally scoped by customerEmail for non-admin customers)
export const list = query({
  args: {
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allOrders = await ctx.db.query('orders').order('desc').collect()
    if (args.customerEmail) {
      const normalized = args.customerEmail.trim().toLowerCase()
      return allOrders.filter((o) => o.customerEmail.toLowerCase() === normalized)
    }
    return allOrders
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
    await checkOrderWriteAccess(ctx)
    const existing = await ctx.db
      .query('orders')
      .withIndex('by_orderId', (q) => q.eq('orderId', args.orderId))
      .first()

    if (existing) {
      const newUpdate = {
        id: 'upd-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: args.status,
        message: `Order status updated to ${args.status}`,
        location: 'Store Fulfillment Hub',
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
    await checkOrderWriteAccess(ctx)
    const existing = await ctx.db
      .query('orders')
      .withIndex('by_orderId', (q) => q.eq('orderId', args.orderId))
      .first()

    if (existing) {
      const newUpdate = {
        id: 'upd-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: args.status,
        message: args.message,
        courierName: args.courierName,
        location: args.location || 'Distribution Hub',
      }
      const updates = [newUpdate, ...(existing.deliveryUpdates || [])]
      await ctx.db.patch(existing._id, {
        status: args.status,
        deliveryUpdates: updates,
      })
    }
  },
})
