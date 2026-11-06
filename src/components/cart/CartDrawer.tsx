import React, { useState } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { ParticleButton } from '../kokonutui/particle-button'

const FREE_SHIPPING_THRESHOLD = 35.0

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    total,
    couponCode,
    couponDiscountPercent,
    applyCoupon,
    setIsCheckoutOpen,
  } = useCart()

  const [inputCoupon, setInputCoupon] = useState('')

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col"
        >
          {/* Cart Header */}
          <div className="p-4 sm:p-5 bg-forest-900 text-white flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-harvest-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Your Grocery Cart</h3>
                <p className="text-xs text-emerald-200">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in basket
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-forest-800 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-forest-50 p-3.5 border-b border-forest-100">
            <div className="flex items-center justify-between text-xs font-semibold text-forest-900 mb-1.5">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-forest-700" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-forest-600 font-bold">{Math.round(shippingProgress)}%</span>
            </div>

            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-forest-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-800 text-base mb-1">Your cart is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our farm-fresh basmati rice, spices, pulses, and pantry essentials.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-forest-900 text-white text-xs font-bold hover:bg-forest-850 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-3.5 flex gap-3 group">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-300 hover:text-rose-500 transition-colors p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-400 mb-2">
                      {item.product.unit} • {formatPrice(item.product.price)} each
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-forest-900 tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Enter coupon (e.g. SAVE10)"
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-stone-200 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (inputCoupon) applyCoupon(inputCoupon)
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponCode && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span>Coupon <strong>{couponCode}</strong> applied ({couponDiscountPercent}% off)</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold tabular-nums">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-forest-900 tabular-nums text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <ParticleButton
                variant="amber"
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckoutOpen(true)
                }}
                className="w-full py-3.5 text-stone-950 font-extrabold shadow-md shadow-harvest-500/20"
                icon={<ArrowRight className="w-4 h-4 text-stone-900" />}
              >
                Proceed to Checkout ({formatPrice(total)})
              </ParticleButton>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  )
}

export default CartDrawer

