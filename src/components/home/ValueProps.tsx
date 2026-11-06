import React from 'react'
import { Award, Truck, ShieldCheck, Tag, ShoppingBag } from 'lucide-react'

const FEATURES = [
  {
    icon: Award,
    title: 'Quality Products',
    desc: '100% organic, farm-picked, and thoroughly quality verified.',
  },
  {
    icon: Truck,
    title: 'Fast Home Delivery',
    desc: 'Same-day doorstep delivery within hours in temperature-sealed packaging.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    desc: 'Encrypted checkout with multiple trusted payment gateways.',
  },
  {
    icon: Tag,
    title: 'Best Prices',
    desc: 'Everyday affordable prices, direct farm margins, and bundled offers.',
  },
  {
    icon: ShoppingBag,
    title: '100% Grocery Essentials',
    desc: 'Complete selection for all your authentic culinary & pantry needs.',
  },
]

export const ValueProps: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight mb-1">
          Why Choose Us
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Committed to delivering authentic freshness, honest prices, and seamless convenience.
        </p>
      </div>

      {/* 5-Column Grid matching inspiration image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-750 mb-4 group-hover:scale-110 group-hover:bg-forest-900 group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-stone-800 mb-2">{item.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ValueProps

