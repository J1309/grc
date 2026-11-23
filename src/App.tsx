import React, { useState, useMemo } from 'react'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { StoreProvider, useStore } from './context/StoreContext'
import { Navbar } from './components/layout/Navbar'
import { CategoryNav } from './components/layout/CategoryNav'
import { HeroBanner } from './components/home/HeroBanner'
import { LatestArrivals } from './components/home/LatestArrivals'
import { CategoryGrid } from './components/home/CategoryGrid'
import { FeaturedProducts } from './components/home/FeaturedProducts'
import { Newsletter } from './components/home/Newsletter'
import { Footer } from './components/layout/Footer'
import { WhatsAppButton } from './components/layout/WhatsAppButton'
import { CartDrawer } from './components/cart/CartDrawer'
import { CheckoutModal } from './components/cart/CheckoutModal'
import { QuickViewModal } from './components/product/QuickViewModal'
import { ToastContainer } from './components/ui/ToastContainer'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { UserAccountModal } from './components/account/UserAccountModal'
import { AuthPage } from './components/auth/AuthPage'
import { useClerkStatus } from './components/auth/ClerkAuthProvider'
import { ShieldAlert } from 'lucide-react'
import { CATEGORIES } from './data/products'

const Storefront: React.FC = () => {
  const { products, currentView, setCurrentView } = useStore()
  const { isClerkConfigured, isSignedIn, isAdmin, user } = useClerkStatus()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined)
  const [trackingInitialTab, setTrackingInitialTab] = useState<'tracking' | 'orders' | 'profile'>('tracking')

  const handleShopNow = () => {
    const el = document.getElementById('catalog-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpenTracking = (orderId?: string, tab: 'tracking' | 'orders' | 'profile' = 'tracking') => {
    setTrackingOrderId(orderId)
    setTrackingInitialTab(tab)
    setIsTrackingModalOpen(true)
  }

  // Filter products by selected category or search query
  const categoryFilteredProducts = useMemo(() => {
    let result = products

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
  }, [products, activeCategory, searchQuery])

  // Protected Admin View: Only users with Clerk role "admin" can access
  if (currentView === 'admin') {
    if (isClerkConfigured && !isSignedIn) {
      return (
        <AuthPage
          onBackToStore={() => setCurrentView('storefront')}
        />
      )
    }

    if (isClerkConfigured && !isAdmin) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-stone-800 font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">Access Restricted</h2>
              <p className="text-xs text-stone-500 mt-1">
                Your account ({user?.primaryEmailAddress?.emailAddress || 'Signed In User'}) does not have store administrator privileges.
              </p>
            </div>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed text-left">
              To grant access, go to your <strong>Clerk Dashboard &rarr; Users &rarr; Metadata &rarr; Public metadata</strong> and add:
              <br />
              <code className="text-forest-900 font-mono font-bold block mt-1 bg-white p-1.5 rounded border border-stone-200">
                &#123; "role": "admin" &#125;
              </code>
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('storefront')}
              className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      )
    }

    return <AdminDashboard />
  }

  // If Auth page is selected, render dedicated aesthetic Auth Page
  if (currentView === 'auth') {
    return <AuthPage onBackToStore={() => setCurrentView('storefront')} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 w-full max-w-full overflow-x-hidden">
      {/* Fixed/Sticky Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenTracking={handleOpenTracking}
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

      <main className="flex-1 w-full max-w-full overflow-hidden">
        {/* Hero Banner (Think Smart, Makes Life Easier) */}
        <HeroBanner onShopNow={handleShopNow} />

        {/* Latest Arrivals (4-column grid: Basmati Rice, Atta, Samosa, Garam Masala) */}
        <LatestArrivals
          products={products}
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

      {/* Customer Account & Order Tracking Modal */}
      <UserAccountModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialOrderId={trackingOrderId}
        initialTab={trackingInitialTab}
      />

      {/* Floating Action Notifications */}
      <ToastContainer />
    </div>
  )
}

export function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <WishlistProvider>
          <Storefront />
        </WishlistProvider>
      </CartProvider>
    </StoreProvider>
  )
}

export default App
