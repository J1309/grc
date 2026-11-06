import React, { useState, useMemo } from 'react'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { Navbar } from './components/layout/Navbar'
import { CategoryNav } from './components/layout/CategoryNav'
import { HeroBanner } from './components/home/HeroBanner'
import { LatestArrivals } from './components/home/LatestArrivals'
import { CategoryGrid } from './components/home/CategoryGrid'
import { FeaturedProducts } from './components/home/FeaturedProducts'
import { ValueProps } from './components/home/ValueProps'
import { Newsletter } from './components/home/Newsletter'
import { Footer } from './components/layout/Footer'
import { WhatsAppButton } from './components/layout/WhatsAppButton'
import { CartDrawer } from './components/cart/CartDrawer'
import { CheckoutModal } from './components/cart/CheckoutModal'
import { QuickViewModal } from './components/product/QuickViewModal'
import { ToastContainer } from './components/ui/ToastContainer'
import { ProductCard } from './components/product/ProductCard'
import { PRODUCTS, CATEGORIES } from './data/products'
import { Agentation } from 'agentation'

const Storefront: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleShopNow = () => {
    const el = document.getElementById('catalog-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Filter products by selected category or search query
  const categoryFilteredProducts = useMemo(() => {
    let result = PRODUCTS

    if (activeCategory && activeCategory !== 'all' && activeCategory !== 'all-products') {
      if (activeCategory === 'offers') {
        result = result.filter((p) => p.discount !== undefined || p.isSpecialOffer)
      } else {
        result = result.filter((p) => p.categorySlug === activeCategory)
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    return result
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
      {/* Fixed/Sticky Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCategorySelect={(slug) => {
          setActiveCategory(slug)
          if (slug !== 'all') {
            const target = document.getElementById('catalog-section')
            if (target) target.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      />

      {/* Category Navigation Bar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={(slug) => {
          setActiveCategory(slug)
          if (slug !== 'all') {
            const target = document.getElementById('catalog-section')
            if (target) target.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      />

      <main className="flex-1">
        {/* Hero Banner (Think Smart, Makes Life Easier) */}
        <HeroBanner onShopNow={handleShopNow} />

        {/* Latest Arrivals (4-column grid: Basmati Rice, Atta, Samosa, Garam Masala) */}
        <LatestArrivals
          products={PRODUCTS}
          onViewAll={handleShopNow}
        />

        {/* Shop By Categories (8 categories grid without item numbers) */}
        <CategoryGrid
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(slug) => {
            setActiveCategory(slug)
            const target = document.getElementById('catalog-section')
            if (target) target.scrollIntoView({ behavior: 'smooth' })
          }}
          onViewAll={handleShopNow}
        />

        {/* Featured Products (Filter tabs: All, Best Sellers, New Arrivals, Special Offers) */}
        <FeaturedProducts
          products={categoryFilteredProducts}
          selectedCategory={activeCategory}
          onResetCategory={() => setActiveCategory('all')}
        />

        {/* Why Choose Us (5 feature cards) */}
        <ValueProps />

        {/* Newsletter Subscription */}
        <Newsletter />
      </main>

      {/* Comprehensive 4-Column Forest Green Footer */}
      <Footer />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />

      {/* Interactive Cart Slide-over Sheet */}
      <CartDrawer />

      {/* Checkout Modal & Order Confirmation */}
      <CheckoutModal />

      {/* Product Quick View Modal */}
      <QuickViewModal />

      {/* Floating Action Notifications */}
      <ToastContainer />

      {/* Agentation Visual Feedback & Annotation Toolbar */}
      <Agentation />
    </div>
  )
}

export function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Storefront />
      </WishlistProvider>
    </CartProvider>
  )
}

export default App

