import React from 'react'
import { Heart, Star, Plus, Minus, Eye, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, setQuickViewProduct } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const cartItem = cart.find((i) => i.product.id === product.id)
  const isWishlisted = isInWishlist(product.id)

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/90 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Bar inside Card: Discount Pill + Wishlist button */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.discount ? (
          <span className="pointer-events-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-harvest-400 text-stone-900 shadow-xs tracking-tight">
            {product.discount}
          </span>
        ) : (
          <div></div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product)
          }}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/90 hover:bg-white text-stone-400 hover:text-rose-500 shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image with Hover Zoom & Quick View overlay button */}
      <div
        onClick={() => setQuickViewProduct(product)}
        className="relative w-full pt-[85%] bg-stone-50/70 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setQuickViewProduct(product)
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/95 text-stone-800 text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-forest-900 hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Unit Row */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1 text-harvest-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-harvest-400 text-harvest-400" />
              <span className="text-stone-800 text-xs">{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>

            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              {product.unit}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-bold text-sm text-stone-800 group-hover:text-forest-900 transition-colors line-clamp-1 cursor-pointer mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Category / Origin */}
          <p className="text-[11px] text-stone-400 mb-3 truncate">
            {product.origin || product.category}
          </p>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-forest-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart or Stepper */}
          {cartItem ? (
            <div className="flex items-center justify-between bg-forest-50 border border-forest-200 rounded-xl p-1">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 rounded-lg bg-white text-forest-900 shadow-xs flex items-center justify-center hover:bg-forest-100 transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-forest-900 tabular-nums px-2">
                {cartItem.quantity} in cart
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-forest-900 text-white shadow-xs flex items-center justify-center hover:bg-forest-800 transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => addToCart(product, 1)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 group-hover:border-forest-850 group-hover:bg-forest-900 group-hover:text-white bg-white text-forest-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add to Cart
            </motion.button>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductCard

