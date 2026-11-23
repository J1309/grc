import React, { useState } from 'react'
import { ShoppingCart, Heart, User, Sparkles, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useStore } from '@/context/StoreContext'
import { InteractiveInput } from '../kokonutui/interactive-input'
import { BrandLogo } from './BrandLogo'
import { formatPrice } from '@/lib/utils'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSelectProduct?: (productId: string) => void
  onCategorySelect?: (categorySlug: string) => void
  onOpenTracking?: (orderId?: string, tab?: 'tracking' | 'orders' | 'profile') => void
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onCategorySelect,
  onOpenTracking,
}) => {
  const { totalItems, subtotal, setIsCartOpen, setQuickViewProduct } = useCart()
  const { wishlistCount } = useWishlist()
  const { products, setCurrentView } = useStore()
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Live filtered preview for the search bar dropdown
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  return (
    <header className="sticky top-0 z-40 w-full max-w-full shadow-lg">
      {/* Main Emerald Green Header Bar */}
      <div className="bg-forest-900 text-white px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-4 border-b border-forest-800/80 w-full max-w-full relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 md:gap-8 min-w-0">
          
          {/* Bespoke Clean & Minimalist Brand Logo */}
          <a
            href="#"
            className="flex items-center shrink min-w-0 group focus:outline-none"
            onClick={(e) => {
              e.preventDefault()
              setSearchQuery('')
              if (onCategorySelect) onCategorySelect('all')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <BrandLogo subtext="Fresh Supermarket" />
          </a>

          {/* Center Search Input with Instant Dropdown (Desktop) */}
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
              placeholder="Search for staples, rice, flours, spices, snacks..."
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
                    <span className="tabular-nums font-mono">{searchResults.length} results</span>
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
                            <span className="text-sm font-bold text-forest-850 tabular-nums font-mono">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="block text-[11px] text-stone-400 line-through tabular-nums font-mono">
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

          {/* Right Action Icons: Track Orders, Account, Wishlist, Cart */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Quick Track Order Pill (Desktop / Tablet) */}
            <button
              type="button"
              onClick={() => onOpenTracking && onOpenTracking()}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-800/90 hover:bg-forest-750 text-emerald-100 hover:text-white text-xs font-semibold border border-forest-700/80 transition-colors cursor-pointer"
              title="Track Active Delivery"
            >
              <Truck className="w-3.5 h-3.5 text-harvest-400" />
              <span>Track Orders</span>
            </button>

            {/* Account / Profile Dropdown Trigger */}
            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-forest-800/80 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                title="Customer Account & Orders"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-forest-800 border border-forest-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
                </div>
                <span className="text-xs font-medium hidden lg:inline">Account</span>
              </button>

              <AnimatePresence>
                {showAccountDropdown && (
                  <>
                    {/* Fixed invisible backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setShowAccountDropdown(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 text-stone-800"
                    >
                      <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <p className="text-[11px] text-stone-400">Welcome to GroceryCart</p>
                        <p className="text-xs font-bold text-stone-800">Customer Account</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false)
                          if (onOpenTracking) onOpenTracking(undefined, 'tracking')
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-forest-50 hover:text-forest-900 rounded-xl transition-colors cursor-pointer text-left font-semibold"
                      >
                        <Truck className="w-4 h-4 text-forest-700" />
                        <span>Track Orders & Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false)
                          if (onOpenTracking) onOpenTracking(undefined, 'profile')
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-700 hover:bg-forest-50 hover:text-forest-900 rounded-xl transition-colors cursor-pointer text-left font-semibold"
                      >
                        <User className="w-4 h-4 text-stone-500" />
                        <span>Customer Profile & Sign In</span>
                      </button>

                      <div className="pt-1 mt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountDropdown(false)
                            setCurrentView('admin')
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-forest-900 bg-forest-50 hover:bg-forest-100 rounded-xl transition-colors cursor-pointer text-left"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                          <span>Admin Console</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
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
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-forest-800/60 sm:bg-transparent flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-100" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden lg:inline">Wishlist</span>
            </a>

            {/* Quick Admin Access Button (Desktop) */}
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-800 hover:bg-forest-750 text-white text-xs font-semibold border border-forest-700/80 transition-colors cursor-pointer shadow-xs"
              title="Open Store Operations Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-harvest-400" />
              <span>Admin</span>
            </button>

            {/* Cart Trigger Button (Compact on Mobile, Never Overflows) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-forest-850 hover:bg-forest-750 text-white border border-forest-700/80 shadow-xs cursor-pointer transition-colors group shrink-0"
              title="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-harvest-400 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-harvest-500 text-stone-900 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-emerald-200/90 uppercase tracking-wider font-semibold leading-none hidden sm:inline">Cart</span>
                <span className="text-[11px] sm:text-xs font-bold text-white tabular-nums font-mono leading-tight">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </motion.button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="mt-2 md:hidden relative w-full max-w-full">
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
                  <span className="tabular-nums font-mono">{searchResults.length} results</span>
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
                          <span className="text-xs font-bold text-forest-850 tabular-nums font-mono">
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
