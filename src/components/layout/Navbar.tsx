import React, { useState } from 'react'
import { ShoppingCart, Heart, User, Sparkles, MapPin, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { InteractiveInput } from '../kokonutui/interactive-input'
import { BrandLogo } from './BrandLogo'
import { formatPrice } from '@/lib/utils'
import { PRODUCTS } from '@/data/products'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSelectProduct?: (productId: string) => void
  onCategorySelect?: (categorySlug: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onCategorySelect,
}) => {
  const { totalItems, subtotal, setIsCartOpen, setQuickViewProduct } = useCart()
  const { wishlistCount } = useWishlist()
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Live filtered preview for the search bar dropdown
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg">
      {/* Main Emerald Green Header Bar */}
      <div className="bg-forest-900 text-white px-3 sm:px-8 py-3 sm:py-5 border-b border-forest-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          
          {/* Bespoke Clean & Minimalist Brand Logo */}
          <a
            href="#"
            className="flex items-center shrink-0 group focus:outline-none"
            onClick={(e) => {
              e.preventDefault()
              setSearchQuery('')
              if (onCategorySelect) onCategorySelect('all')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <BrandLogo subtext="Fresh Supermarket" />
          </a>

          {/* Center Search Input with Instant Dropdown */}
          <div className="relative flex-1 max-w-2xl lg:max-w-3xl hidden md:block">
            <InteractiveInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val)
                setIsSearchFocused(true)
              }}
              onSubmit={() => {
                setIsSearchFocused(false)
                const target = document.getElementById('catalog-section')
                if (target) target.scrollIntoView({ behavior: 'smooth' })
              }}
              placeholder="Search for products, spices, flours, rice, snacks..."
            />

            {/* Instant search autocomplete dropdown */}
            <AnimatePresence>
              {searchQuery.trim().length > 0 && isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 text-stone-800"
                >
                  <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500">
                    <span>Matching products for "<strong>{searchQuery}</strong>"</span>
                    <span>{searchResults.length} results</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="p-6 text-center text-sm text-stone-500">
                      No products found matching "{searchQuery}".
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setQuickViewProduct(product)
                            setIsSearchFocused(false)
                          }}
                          className="p-3 hover:bg-forest-50/60 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-800 truncate">{product.name}</p>
                            <p className="text-xs text-stone-400">{product.unit} • {product.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-forest-850 tabular-nums">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="block text-[11px] text-stone-400 line-through tabular-nums">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons: Account, Wishlist, Cart */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Account */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-forest-800/80 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                title="Account"
              >
                <div className="w-8 h-8 rounded-full bg-forest-800 border border-forest-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-200" />
                </div>
                <span className="text-xs font-medium hidden lg:inline">Account</span>
              </button>

              <AnimatePresence>
                {showAccountDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 text-stone-800"
                  >
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                      <p className="text-xs text-stone-400">Welcome to GroceryCart</p>
                      <p className="text-sm font-semibold text-stone-800">Guest Shopper</p>
                    </div>
                    <a href="#orders" onClick={(e) => { e.preventDefault(); setShowAccountDropdown(false); }} className="block px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 rounded-lg">My Orders</a>
                    <a href="#settings" onClick={(e) => { e.preventDefault(); setShowAccountDropdown(false); }} className="block px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 rounded-lg">Saved Delivery Addresses</a>
                    <a href="#help" onClick={(e) => { e.preventDefault(); setShowAccountDropdown(false); }} className="block px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 rounded-lg">Help Center</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <a
              href="#wishlist"
              onClick={(e) => {
                e.preventDefault()
                const target = document.getElementById('catalog-section')
                if (target) target.scrollIntoView({ behavior: 'smooth' })
              }}
              className="relative flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-forest-800/80 text-emerald-100 hover:text-white transition-colors"
              title="Saved Wishlist"
            >
              <div className="relative w-8 h-8 rounded-full bg-forest-800/60 sm:bg-transparent flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-100" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden lg:inline">Wishlist</span>
            </a>

            {/* Cart Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-forest-850 hover:bg-forest-750 text-white border border-forest-700/80 shadow-sm cursor-pointer transition-colors group shrink-0"
              title="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-harvest-400 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-0.5 bg-harvest-500 text-stone-900 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-emerald-200/90 uppercase tracking-wider font-semibold leading-none hidden sm:inline">Cart</span>
                <span className="text-xs font-bold text-white tabular-nums leading-tight">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </motion.button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden relative">
          <InteractiveInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val)
              setIsSearchFocused(true)
            }}
            onSubmit={() => {
              setIsSearchFocused(false)
              const target = document.getElementById('catalog-section')
              if (target) target.scrollIntoView({ behavior: 'smooth' })
            }}
            placeholder="Search groceries, rice, spices..."
          />

          {/* Instant mobile search autocomplete dropdown */}
          <AnimatePresence>
            {searchQuery.trim().length > 0 && isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 text-stone-800"
              >
                <div className="p-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500">
                  <span>Matching "<strong>{searchQuery}</strong>"</span>
                  <span>{searchResults.length} results</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-500">
                    No products found matching "{searchQuery}".
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setQuickViewProduct(product)
                          setIsSearchFocused(false)
                        }}
                        className="p-2.5 hover:bg-forest-50/60 cursor-pointer flex items-center gap-2.5 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-9 h-9 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-800 truncate">{product.name}</p>
                          <p className="text-[10px] text-stone-400">{product.unit} • {product.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-forest-850 tabular-nums">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Navbar

