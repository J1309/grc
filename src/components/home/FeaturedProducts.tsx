import React, { useState } from 'react'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { ProductCard } from '../product/ProductCard'

interface FeaturedProductsProps {
  products: Product[]
  selectedCategory?: string
  onResetCategory?: () => void
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'best-sellers', label: 'Best Sellers' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'special-offers', label: 'Special Offers' },
]

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  selectedCategory,
  onResetCategory,
}) => {
  const [activeTab, setActiveTab] = useState('all')

  const filteredProducts = products.filter((product) => {
    // If a category was chosen from navigation or category grid
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'all-products') {
      if (selectedCategory === 'offers') {
        if (!product.discount && !product.isSpecialOffer) return false
      } else if (product.categorySlug !== selectedCategory) {
        return false
      }
    }

    if (activeTab === 'best-sellers') return product.isBestSeller
    if (activeTab === 'new-arrivals') return product.isLatest
    if (activeTab === 'special-offers') return product.isSpecialOffer || (product.discount !== undefined)
    return true
  }).slice(0, 8)

  return (
    <section id="catalog-section" className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
            <Flame className="w-5 h-5 text-forest-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Featured Products
              </h2>
              {selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'all-products' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800">
                  <span>Filtered</span>
                  {onResetCategory && (
                    <button
                      type="button"
                      onClick={onResetCategory}
                      className="ml-1 text-forest-600 hover:text-forest-900 font-extrabold"
                    >
                      ×
                    </button>
                  )}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 font-medium">Handpicked grocery staples rated 4.7+ by customers</p>
          </div>
        </div>

        {/* Tab Pills matching the image */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-full border border-stone-200/80 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="featured-active-pill"
                    className="absolute inset-0 bg-forest-900 rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 8 Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts

