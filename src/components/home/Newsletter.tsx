import React, { useState } from 'react'
import { Send, CheckCircle2, Mail, Sparkles } from 'lucide-react'
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
    <section className="relative w-full py-14 sm:py-24 overflow-hidden border-t border-stone-200/80">
      {/* Minimalist Aesthetic Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/newsletter-bg.jpg"
          alt="Natural organic kitchen backdrop"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Soft aesthetic gradient veil for impeccable text contrast and subtle page blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/85 via-[#FAF8F5]/55 to-[#FAF8F5]/90 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Subtle Icon Accent */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-forest-850 flex items-center justify-center mb-3 sm:mb-3.5 border border-forest-200/60 shadow-sm backdrop-blur-xs">
          <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-forest-800" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100/70 border border-forest-250/50 mb-2 sm:mb-2.5">
          <Sparkles className="w-3 h-3 text-forest-700" />
          <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-forest-900">
            Weekly Farm Dispatch
          </span>
        </div>

        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-2 sm:mb-3">
          Fresh Arrivals & Pantry Recipes to Your Inbox
        </h2>

        <p className="text-stone-700 text-xs sm:text-sm max-w-lg mb-6 sm:mb-8 leading-relaxed font-normal">
          Join 12,000+ home cooks receiving seasonal organic produce guides, exclusive subscriber discounts, and chef-crafted pantry recipes.
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50/95 backdrop-blur-sm border border-emerald-300 text-emerald-900 text-sm font-semibold shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>You're subscribed! Use coupon code <strong>WELCOME15</strong> for 15% off.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full p-1.5 shadow-md border border-stone-200/90 focus-within:border-forest-700 focus-within:ring-2 focus-within:ring-forest-600/20 transition-all"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full h-11 px-4 sm:px-5 rounded-xl sm:rounded-full text-stone-800 placeholder-stone-400 text-xs sm:text-sm focus:outline-none bg-transparent"
              required
            />

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-2.5 rounded-xl sm:rounded-full bg-forest-900 hover:bg-forest-850 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-500 mt-3.5 font-medium">
          Zero spam. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  )
}

export default Newsletter
