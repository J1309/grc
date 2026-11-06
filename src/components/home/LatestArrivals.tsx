import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Product } from '@/types'
import { ProductCard } from '../product/ProductCard'

interface LatestArrivalsProps {
  products: Product[]
  onViewAll: () => void
}

export const LatestArrivals: React.FC<LatestArrivalsProps> = ({ products, onViewAll }) => {
  // Show the 4 latest arrival products matching the inspiration image
  const latestItems = products.filter((p) => p.isLatest).slice(0, 4)

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
            <Sparkles className="w-5 h-5 text-forest-800" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Latest Arrivals
            </h2>
            <p className="text-xs text-stone-500 font-medium">Freshly harvested & newly packaged staples</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-sm font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {latestItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default LatestArrivals

