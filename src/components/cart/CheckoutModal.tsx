import React, { useState } from 'react'
import { X, CheckCircle, Truck, ShieldCheck, CreditCard, Banknote, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, discount, deliveryFee, total, clearCart } = useCart()

  const [step, setStep] = useState<'details' | 'success'>('details')
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Apt 4B',
    city: 'New York',
    zip: '10001',
    deliverySlot: 'Express 2-Hour Slot (Today)',
    paymentMethod: 'card',
  })
  const [orderId, setOrderId] = useState('')

  if (!isCheckoutOpen) return null

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const generatedId = 'GC-' + Math.floor(100000 + Math.random() * 900000)
    setOrderId(generatedId)
    setStep('success')

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0E5A32', '#F59E0B', '#22C55E', '#10B981'],
      })
    } catch (err) {
      console.error(err)
    }

    clearCart()
  }

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setStep('details')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="bg-forest-900 text-white p-5 flex items-center justify-between border-b border-forest-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest-800 text-harvest-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {step === 'details' ? 'Complete Your Grocery Order' : 'Order Confirmed!'}
              </h3>
              <p className="text-xs text-emerald-200">
                {step === 'details' ? 'Doorstep express delivery' : 'Fresh essentials are being packed'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-forest-800 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-5">
            {/* Delivery Address */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-forest-700" /> Delivery Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1 font-medium">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Time Slot */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-forest-700" /> Choose Delivery Slot
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  'Express 2-Hour Slot (Today)',
                  'Today 5:00 PM - 7:00 PM',
                  'Tomorrow Morning 8:00 AM',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, deliverySlot: slot })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.deliverySlot === slot
                        ? 'border-forest-800 bg-forest-50/80 text-forest-900 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-[11px] text-forest-700">🚚 Slot</span>
                    <span className="text-xs">{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-forest-700" /> Payment Method
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-forest-800 bg-forest-50/80 text-forest-900 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-forest-700" />
                  <span>Card / Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-forest-800 bg-forest-50/80 text-forest-900 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-forest-700" />
                  <span>Cash on Delivery</span>
                </button>
              </div>
            </div>

            {/* Order Total & Submit */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-stone-400 block">Total Due</span>
                <span className="text-2xl font-extrabold text-forest-900 tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-harvest-400 hover:bg-harvest-500 text-stone-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Order Confirmation Screen */
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold text-forest-700 uppercase tracking-widest bg-forest-50 px-3 py-1 rounded-full mb-2">
              Order #{orderId}
            </span>

            <h3 className="text-2xl font-extrabold text-stone-900 mb-2">
              Thank You, {formData.name}!
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mb-6 leading-relaxed">
              Your grocery order has been successfully placed. Our packing team has started prepping your items for <strong>{formData.deliverySlot}</strong>.
            </p>

            <div className="w-full max-w-sm bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between text-stone-500">
                <span>Deliver to:</span>
                <strong className="text-stone-800">{formData.address}, {formData.city}</strong>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Payment:</span>
                <strong className="text-stone-800">{formData.paymentMethod === 'card' ? 'Online Card' : 'Cash on Delivery'}</strong>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Arrival:</span>
                <strong className="text-emerald-700">Within 2 Hours</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 rounded-full bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs transition-colors"
            >
              Back to Store
            </button>
          </div>
        )}

      </motion.div>
    </div>
  )
}

export default CheckoutModal

