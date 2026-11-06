import React, { useState } from 'react'
import { Send, CheckCircle2, Mail } from 'lucide-react'
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
    <section className="w-full py-16 sm:py-20 border-t border-stone-200/80 bg-gradient-to-b from-transparent to-[#F2EDE4]/60">
      <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Subtle Icon Accent */}
        <div className="w-10 h-10 rounded-full bg-forest-100/80 text-forest-850 flex items-center justify-center mb-3 border border-forest-200/50">
          <Mail className="w-4 h-4 text-forest-800" />
        </div>

        <span className="text-[11px] uppercase font-extrabold tracking-[0.2em] text-forest-800 mb-1.5">
          Weekly Farm Dispatch
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-2.5">
          Fresh Arrivals & Pantry Recipes to Your Inbox
        </h2>

        <p className="text-stone-600 text-xs sm:text-sm max-w-lg mb-8 leading-relaxed font-normal">
          Join 12,000+ home cooks receiving seasonal organic produce guides, exclusive subscriber discounts, and chef-crafted pantry recipes.
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-semibold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>You're subscribed! Use coupon code <strong>WELCOME15</strong> for 15% off.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white rounded-full p-1.5 shadow-sm border border-stone-300 focus-within:border-forest-700 focus-within:ring-2 focus-within:ring-forest-600/20 transition-all"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full h-11 px-5 rounded-full text-stone-800 placeholder-stone-400 text-sm focus:outline-none bg-transparent"
              required
            />

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-forest-900 hover:bg-forest-850 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-400 mt-3 font-medium">
          Zero spam. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  )
}

export default Newsletter
