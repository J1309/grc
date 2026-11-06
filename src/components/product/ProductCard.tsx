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
    <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Bar inside Card: Discount Pill + Wishlist button */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.discount ? (
          <span className="pointer-events-auto inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-harvest-400 text-stone-900 shadow-xs tracking-tight">
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
          className={`pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/90 hover:bg-white text-stone-400 hover:text-rose-500 shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
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

        {/* Quick View Button on Hover (Desktop) */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
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
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Unit Row */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500 mb-1 sm:mb-1.5">
            <div className="flex items-center gap-0.5 sm:gap-1 text-harvest-500 font-semibold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-harvest-400 text-harvest-400" />
              <span className="text-stone-800 text-[11px] sm:text-xs">{product.rating}</span>
              <span className="text-stone-400 font-normal hidden xs:inline">({product.reviewsCount})</span>
            </div>

            <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 bg-stone-100 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[70px] sm:max-w-none">
              {product.unit}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-bold text-xs sm:text-sm text-stone-800 group-hover:text-forest-900 transition-colors line-clamp-1 cursor-pointer mb-0.5 sm:mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Category / Origin */}
          <p className="text-[10px] sm:text-[11px] text-stone-400 mb-2 sm:mb-3 truncate">
            {product.origin || product.category}
          </p>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-sm sm:text-lg font-extrabold text-forest-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart or Stepper */}
          {cartItem ? (
            <div className="flex items-center justify-between bg-forest-50 border border-forest-200 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-white text-forest-900 shadow-xs flex items-center justify-center hover:bg-forest-100 transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="text-[11px] sm:text-xs font-bold text-forest-900 tabular-nums px-1 sm:px-2">
                {cartItem.quantity} <span className="hidden xs:inline">in cart</span>
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-forest-900 text-white shadow-xs flex items-center justify-center hover:bg-forest-800 transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => addToCart(product, 1)}
              className="w-full py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl border border-stone-200 group-hover:border-forest-850 group-hover:bg-forest-900 group-hover:text-white bg-white text-forest-900 font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span>Add<span className="hidden xs:inline"> to Cart</span></span>
            </motion.button>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductCard

