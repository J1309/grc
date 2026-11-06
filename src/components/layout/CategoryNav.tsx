import React from 'react'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryNavProps {
  activeCategory: string
  onSelectCategory: (slug: string) => void
}

const NAV_LINKS = [
  { label: 'HOME', slug: 'all' },
  { label: 'ALL PRODUCTS', slug: 'all-products' },
  { label: 'FRUITS & VEGETABLES', slug: 'fruits-vegetables' },
  { label: 'MEAT', slug: 'meat' },
  { label: 'SPICES & FLOURS', slug: 'spices-flours' },
  { label: 'PULSES & DALS', slug: 'pulses-dals' },
  { label: 'COOKING OILS & GHEE', slug: 'cooking-oils-ghee' },
  { label: 'SNACKS', slug: 'snacks' },
  { label: 'PICKLES & PASTE', slug: 'pickles-paste' },
  { label: 'RICE', slug: 'rice' },
  { label: 'OFFERS', slug: 'offers', isBadge: true },
]

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="w-full bg-white border-b border-stone-200 shadow-xs overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center gap-1 sm:gap-2 whitespace-nowrap py-2 text-xs font-semibold tracking-wider text-stone-600">
          {NAV_LINKS.map((link) => {
            const isActive =
              activeCategory === link.slug ||
              (link.slug === 'all' && activeCategory === 'all')

            return (
              <li key={link.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectCategory(link.slug)}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-forest-900 text-white shadow-xs'
                      : 'hover:text-forest-900 hover:bg-forest-50/70 text-stone-600',
                    link.isBadge && !isActive && 'text-harvest-600 font-bold hover:text-harvest-700'
                  )}
                >
                  {link.isBadge && <Tag className="w-3 h-3 text-harvest-500" />}
                  <span>{link.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default CategoryNav

