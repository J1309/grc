import React, { useState } from 'react'
import { X, Star, Heart, Plus, Minus, Check, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/lib/utils'
import { ParticleButton } from '../kokonutui/particle-button'

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)

  if (!quickViewProduct) return null

  const isWishlisted = isInWishlist(quickViewProduct.id)

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity)
    setQuickViewProduct(null)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2.5 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col md:flex-row my-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image Section */}
        <div className="relative md:w-1/2 bg-stone-50 p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-stone-200">
          {quickViewProduct.discount && (
            <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-harvest-400 text-stone-900 shadow-sm">
              {quickViewProduct.discount}
            </span>
          )}

          <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner my-auto bg-white flex items-center justify-center">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full mt-4 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Quality Sealed
            </span>
            <span>Origin: <strong>{quickViewProduct.origin || 'Farm Direct'}</strong></span>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-50 px-2.5 py-0.5 rounded-md">
                {quickViewProduct.category}
              </span>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-stone-200 hover:border-rose-200 text-stone-500 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-stone-900 mb-2">
              {quickViewProduct.name}
            </h3>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-harvest-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-harvest-400 text-harvest-400" />
                <span className="text-stone-800">{quickViewProduct.rating}</span>
              </div>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500">{quickViewProduct.reviewsCount} customer reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-2xl font-extrabold text-forest-900 tabular-nums">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
              <span className="text-xs font-medium text-stone-500">/ {quickViewProduct.unit}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              {quickViewProduct.description}
            </p>

            {/* Dietary / Feature Tags */}
            {quickViewProduct.tags && quickViewProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {quickViewProduct.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100 flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-forest-600" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Nutrition Facts */}
            {quickViewProduct.nutrition && (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 mb-4">
                <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nutrition per serving
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-1 rounded border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Energy</span>
                    <strong className="text-stone-800 text-[11px]">{quickViewProduct.nutrition.calories}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Protein</span>
                    <strong className="text-stone-800 text-[11px]">{quickViewProduct.nutrition.protein}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Carbs</span>
                    <strong className="text-stone-800 text-[11px]">{quickViewProduct.nutrition.carbs}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Fats</span>
                    <strong className="text-stone-800 text-[11px]">{quickViewProduct.nutrition.fat}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper & Add to Cart button */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-stone-800 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <ParticleButton
              variant="primary"
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-forest-900 hover:bg-forest-850 text-white font-bold"
              icon={<ShoppingBag className="w-4 h-4" />}
            >
              Add {quantity} to Cart ({formatPrice(quickViewProduct.price * quantity)})
            </ParticleButton>
          </div>
        </div>

      </motion.div>
    </div>
  )
}

export default QuickViewModal

