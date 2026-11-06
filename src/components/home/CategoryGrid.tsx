import React from 'react'
import { LayoutGrid, ArrowRight } from 'lucide-react'
import { Category } from '@/types'

interface CategoryGridProps {
  categories: Category[]
  activeCategory: string
  onSelectCategory: (slug: string) => void
  onViewAll?: () => void
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onViewAll,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-harvest-700">
            <LayoutGrid className="w-5 h-5 text-harvest-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Shop By Categories
            </h2>
            <p className="text-xs text-stone-500 font-medium">Browse our farm-direct aisles and pantry sections</p>
          </div>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 group transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* 2 Rows x 4 Columns = 8 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.slug

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative rounded-2xl p-3 sm:p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'border-forest-800 bg-forest-50/80 shadow-md ring-2 ring-forest-800/20'
                  : 'border-stone-200/80 bg-white hover:border-forest-600/60 shadow-card-soft hover:shadow-card-hover'
              }`}
              style={{ backgroundColor: isSelected ? undefined : cat.bgColor }}
            >
              {/* Category Image Circle / Rounded Container */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-2.5 sm:mb-3.5 shadow-xs border border-white/80 group-hover:scale-105 transition-transform duration-300 bg-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Title without item numbers */}
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-forest-900 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryGrid

