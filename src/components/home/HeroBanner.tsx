import React from 'react'
import { motion } from 'framer-motion'

interface HeroBannerProps {
  onShopNow: () => void
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full overflow-hidden select-none pb-2 sm:pb-4">
      {/* 100% Edge-to-Edge Panoramic Commercial Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={onShopNow}
        className="group relative w-full overflow-hidden cursor-pointer shadow-md bg-[#042e16]"
      >
        {/* Full-width Razor-Sharp 2560px Upscaled Banner Image */}
        <img
          src="/hero-banner.jpg"
          alt="GroceryCart — Think Smart, Makes Life Easier"
          className="w-full h-auto max-h-[520px] object-cover object-center group-hover:scale-[1.008] transition-transform duration-500 ease-out"
          loading="eager"
        />

        {/* Subtle bottom edge gradient to transition seamlessly into the page */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Hover Cue */}
        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg pointer-events-none hidden md:flex items-center gap-1.5">
          <span>Click to explore fresh catalog</span>
          <span className="text-harvest-400 font-bold">→</span>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroBanner
