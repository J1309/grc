import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { ParticleButton } from '../kokonutui/particle-button'

interface PromoBannerProps {
  onShopNow: () => void
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onShopNow }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-harvest-400 via-harvest-500 to-amber-500 p-8 sm:p-12 shadow-md border border-harvest-300">
        
        {/* Organic green circular accents matching the image */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-forest-800/20 blur-2xl pointer-events-none"></div>
        <div className="absolute right-6 -bottom-10 w-44 h-44 rounded-full bg-forest-700/25 pointer-events-none"></div>
        <div className="absolute right-24 bottom-2 w-28 h-28 rounded-full bg-forest-850/30 pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl text-center mx-auto flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/10 text-stone-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-stone-900" /> Limited Time Savings
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 tracking-tight mb-3">
            Fresh Essentials, Great Savings!
          </h2>

          <p className="text-stone-850 text-sm sm:text-base max-w-lg mb-6 leading-relaxed font-medium">
            Discover weekly deals and bundled discounts on everyday pantry favorites. Extra 10% off with code <code className="bg-stone-900/10 px-2 py-0.5 rounded font-mono font-bold text-stone-950">SAVE10</code> at checkout!
          </p>

          <ParticleButton
            variant="primary"
            onClick={onShopNow}
            className="bg-forest-900 hover:bg-forest-950 text-white font-bold px-8 py-3.5 shadow-lg shadow-forest-950/20 cursor-pointer"
            icon={<ArrowRight className="w-4 h-4 text-emerald-200" />}
          >
            Shop Now
          </ParticleButton>
        </div>

      </div>
    </section>
  )
}

export default PromoBanner

