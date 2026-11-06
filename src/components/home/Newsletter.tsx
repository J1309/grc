import React, { useState } from 'react'
import { ShoppingBag, Send, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export const Newsletter: React.FC = () => {
  const { addToast } = useCart()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', undefined, 'info')
      return
    }

    setIsSubscribed(true)
    addToast('Welcome to GroceryCart Deals!', 'Check your inbox for a 15% off coupon.', 'success')
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-forest-900 text-white p-8 sm:p-12 shadow-lg border border-forest-800 text-center flex flex-col items-center">
        
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-750 via-forest-900 to-forest-950 pointer-events-none"></div>

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Basket icon badge matching image */}
          <div className="w-12 h-12 rounded-2xl bg-harvest-400 text-stone-900 flex items-center justify-center mb-4 shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Stay Updated with Our Latest Offers
          </h2>

          <p className="text-emerald-100/80 text-xs sm:text-sm mb-6 max-w-md">
            Subscribe to receive seasonal farm updates, exclusive weekend discounts, and chef-curated pantry recipes.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>You are subscribed! Coupon code: <strong>WELCOME15</strong></span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white rounded-full p-1.5 shadow-md border border-forest-700/60"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-11 px-5 rounded-full text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
                required
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-harvest-400 hover:bg-harvest-500 text-stone-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-emerald-300/60 mt-3">
            Zero spam. Unsubscribe anytime with a single click.
          </p>
        </div>

      </div>
    </section>
  )
}

export default Newsletter

