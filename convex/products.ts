import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Get all products
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('products').collect()
  },
})

// Add new product
export const add = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('products', args)
  },
})

// Update product
export const update = mutation({
  args: {
    productId: v.string(),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('products')
      .withIndex('by_productId', (q) => q.eq('productId', args.productId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, args.updates)
    }
  },
})

// Delete product
export const remove = mutation({
  args: {
    productId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('products')
      .withIndex('by_productId', (q) => q.eq('productId', args.productId))
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
    }
  },
})

// Toggle stock
export const toggleStock = mutation({
  args: {
    productId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('products')
      .withIndex('by_productId', (q) => q.eq('productId', args.productId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { inStock: !existing.inStock })
    }
  },
})

// Bulk seed initial catalog if table is empty
export const seedInitialProducts = mutation({
  args: {
    items: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query('products').take(1)).length
    if (count === 0) {
      for (const item of args.items) {
        await ctx.db.insert('products', {
          productId: item.id,
          name: item.name,
          category: item.category,
          categorySlug: item.categorySlug,
          price: item.price,
          originalPrice: item.originalPrice,
          discount: item.discount,
          unit: item.unit,
          image: item.image,
          description: item.description,
          inStock: item.inStock,
          isLatest: item.isLatest ?? true,
          isBestSeller: item.isBestSeller ?? false,
          isSpecialOffer: item.isSpecialOffer ?? false,
          origin: item.origin ?? 'Farm Direct',
          rating: item.rating ?? 4.8,
          reviewsCount: item.reviewsCount ?? 12,
        })
      }
    }
  },
})
