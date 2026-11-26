import React, { useState, useMemo } from 'react'
import {
  Home,
  Package,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Sparkles,
  Sun,
  ShieldCheck,
  Star,
  MapPin,
  Send,
  X,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Store,
  ArrowRight,
  TrendingUp,
  Database,
} from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { Product, Order, OrderStatus } from '../../types'
import { CATEGORIES } from '../../data/products'
import { formatPrice } from '../../lib/utils'
import { BrandLogo } from '../layout/BrandLogo'
import { ProductModal } from './ProductModal'
import { useClerkStatus } from '../auth/ClerkAuthProvider'
import { useConvexStatus } from '../../context/ConvexClientProvider'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react'

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    setCurrentView,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    updateOrderStatus,
    addDeliveryUpdate,
    resetProductsToDefault,
  } = useStore()
  const { isClerkConfigured, user } = useClerkStatus()
  const { isConvexConfigured } = useConvexStatus()

  const adminDisplayName = user?.fullName || user?.firstName || 'Store Administrator'
  const adminEmail = user?.primaryEmailAddress?.emailAddress || 'admin@grocerycart.com.au'
  const adminInitials = adminDisplayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'GC'

  // STRICT SEPARATE SECTIONS: Overview, Products, Orders, Account (No "CRUD" label)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'account'>('overview')

  // Search & Filter state for Products
  const [productSearch, setProductSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all')

  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  // Dispatch / Delivery Update Drawer State
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null)
  const [newUpdateStatus, setNewUpdateStatus] = useState<OrderStatus>('Out for Delivery')
  const [courierName, setCourierName] = useState('Courier Van #1')
  const [dispatchLocation, setDispatchLocation] = useState('Australia Distribution Hub')
  const [customUpdateNote, setCustomUpdateNote] = useState('')

  // Derived real operational metrics (NO fake financial data)
  const inStockCount = useMemo(() => products.filter((p) => p.inStock).length, [products])
  const outOfStockCount = useMemo(() => products.filter((p) => !p.inStock).length, [products])

  // Filtered products list for Products view
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.origin && p.origin.toLowerCase().includes(productSearch.toLowerCase()))

      const matchesCategory = categoryFilter === 'all' || p.categorySlug === categoryFilter

      const matchesStock =
        stockFilter === 'all'
          ? true
          : stockFilter === 'inStock'
          ? p.inStock
          : !p.inStock

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, productSearch, categoryFilter, stockFilter])

  // Filtered orders list for Orders view
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.status.toLowerCase().includes(orderSearch.toLowerCase())

      const matchesStatus =
        orderStatusFilter === 'all' ? true : o.status.toLowerCase() === orderStatusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [orders, orderSearch, orderStatusFilter])

  // Handlers for Product CRUD
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setIsProductModalOpen(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      updateProduct(productData.id, productData)
    } else {
      addProduct(productData)
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId)
      setDeletingProductId(null)
    }
  }

  // Delivery Dispatcher Handler
  const handleOpenDispatch = (order: Order) => {
    setDispatchOrder(order)
    setNewUpdateStatus(
      order.status === 'Pending' ? 'Packing' : order.status === 'Packing' ? 'Out for Delivery' : order.status
    )
    setCustomUpdateNote('')
  }

  const handleSendDeliveryUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dispatchOrder) return

    const note = customUpdateNote.trim() || `Delivery milestone updated to ${newUpdateStatus}`
    addDeliveryUpdate(
      dispatchOrder.id,
      newUpdateStatus,
      note,
      courierName,
      dispatchLocation
    )

    // Keep drawer updated with the latest order state
    const refreshed = orders.find((o) => o.id === dispatchOrder.id)
    if (refreshed) {
      setDispatchOrder({
        ...refreshed,
        status: newUpdateStatus,
        deliveryUpdates: [
          {
            id: 'upd-' + Date.now(),
            timestamp: 'Just now',
            status: newUpdateStatus,
            message: note,
            courierName,
            location: dispatchLocation,
          },
          ...(refreshed.deliveryUpdates || []),
        ],
      })
    }
    setCustomUpdateNote('')
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex flex-col md:flex-row text-stone-800 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Full-height flush sidebar)                   */}
      {/* ========================================================= */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200/80 p-4 sm:p-5 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <div>
          {/* Top Brand Logo & Collapse Icon */}
          <div className="flex items-center justify-between mb-5">
            <BrandLogo markSize={32} subtext="Operations" />
          </div>

            {/* Store Switcher Card */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-forest-900 text-harvest-400 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-stone-900 truncate">GroceryCart</p>
                  <p className="text-[10px] text-stone-400 truncate">Fresh Supermarket</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
            </div>

            {/* Quick Search Bar */}
            <div className="relative mb-6">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search console..."
                className="w-full h-9 pl-8 pr-10 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-stone-400 bg-stone-200/60 px-1 rounded">
                ⌘K
              </span>
            </div>

            {/* Menu Items: Overview, Products, Orders, Account */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 mb-2">
                Menu
              </p>

              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
                { id: 'account', label: 'Account', icon: User },
              ].map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-forest-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums font-mono ${
                          isActive ? 'bg-forest-800 text-emerald-200' : 'bg-stone-200/70 text-stone-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom Sidebar: Settings, Profile Card & Exit */}
          <div className="pt-4 border-t border-stone-200/80 space-y-3">
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-stone-400" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('storefront')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-stone-400" />
              <span>Return to Storefront</span>
            </button>

            {/* Admin Profile Widget */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-harvest-400 font-black text-xs flex items-center justify-center shrink-0">
                  {adminInitials}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-stone-900 truncate">{adminDisplayName}</p>
                  <p className="text-[10px] text-stone-400 truncate">{adminEmail}</p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA: HEADER & SEPARATE TAB VIEWS            */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Top Bar Header */}
          <header className="px-5 sm:px-8 py-4 sm:py-5 bg-white/70 backdrop-blur-md border-b border-stone-200/70 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                GroceryCart Operations
              </h1>
              <p className="text-xs text-stone-400 font-medium">
                Live Store Inventory & Order Fulfillment Console
              </p>
            </div>

            {/* Right: Open Site (Reference Design Button) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('storefront')}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-harvest-400" />
                <span>Open Site</span>
              </button>
            </div>
          </header>

          {/* ========================================================= */}
          {/* SECTION 1: OVERVIEW DASHBOARD (REAL INVENTORY & NO FAKE DATA) */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <main className="p-5 sm:p-8 space-y-6 flex-1">
              {/* Operations & Convex Sync Status Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-forest-900 text-harvest-400 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-extrabold text-stone-900">
                        Live Grocery Catalog & Inventory
                      </h2>
                      {isConvexConfigured ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Convex Cloud Live</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200" title="Add VITE_CONVEX_URL in .env for real-time cloud database sync">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Local Storage Mode</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      All product additions, stock status toggles, edits, and deletions update instantly on the customer website.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-harvest-400" />
                    <span>Add New Item</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('storefront')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>View Site</span>
                  </button>
                </div>
              </div>

              {/* 4 Real Metric Cards (NO fake financial or fake visitor data) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Total Products */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500">Total Products</span>
                    <Package className="w-4 h-4 text-stone-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums font-mono">
                    {products.length}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Live grocery listings
                  </p>
                </div>

                {/* Metric 2: In Stock Available */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500">In Stock Available</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 tabular-nums font-mono">
                    {inStockCount}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Ready for customer purchase
                  </p>
                </div>

                {/* Metric 3: Out of Stock */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500">Restock Needed</span>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 tabular-nums font-mono">
                    {outOfStockCount}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Marked out of stock
                  </p>
                </div>

                {/* Metric 4: Grocery Aisles */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500">Aisles / Categories</span>
                    <Store className="w-4 h-4 text-stone-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-forest-900 tabular-nums font-mono">
                    {CATEGORIES.length}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Rice, Atta, Ghee, Spices & more
                  </p>
                </div>
              </div>

              {/* Real Live Products Inventory Table */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900">
                      Live Store Inventory
                    </h3>
                    <p className="text-xs text-stone-400">
                      Manage items, toggle stock availability, edit pricing, or delete products.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Products Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search inventory items..."
                      className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-stone-200 text-xs text-stone-700 bg-stone-50 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="all">All Aisles</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-xl">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'inStock', label: 'In Stock' },
                        { id: 'outOfStock', label: 'Out of Stock' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setStockFilter(s.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            stockFilter === s.id ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table of Real Products */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-100 pb-3">
                        <th className="pb-3 pl-2">Product</th>
                        <th className="pb-3">Aisle</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Stock Status</th>
                        <th className="pb-3">Rating</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-stone-400">
                            No products found matching "{productSearch}".
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                            <td className="py-3 pl-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-stone-900 truncate max-w-[200px]">
                                    {product.name}
                                  </p>
                                  <p className="text-[11px] text-stone-400">
                                    {product.unit} {product.origin ? `• ${product.origin}` : ''}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 font-medium text-stone-600">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                                {product.category}
                              </span>
                            </td>

                            <td className="py-3 font-bold text-forest-900 tabular-nums font-mono">
                              {formatPrice(product.price)}
                              {product.originalPrice && (
                                <span className="block text-[10px] text-stone-400 line-through font-normal">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </td>

                            <td className="py-3">
                              <button
                                type="button"
                                onClick={() => toggleStock(product.id)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                                  product.inStock
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                }`}
                                title="Click to toggle stock status"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                              </button>
                            </td>

                            <td className="py-3 text-stone-500 font-semibold tabular-nums font-mono">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>{product.rating}</span>
                                <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
                              </div>
                            </td>

                            <td className="py-3 text-right pr-2">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(product)}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-forest-900 hover:bg-forest-50 transition-colors cursor-pointer"
                                  title="Edit Item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingProductId(product.id)}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          )}

          {/* ========================================================= */}
          {/* SECTION 2: PRODUCTS (STRICTLY NO "CRUD" TEXT)              */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <main className="p-5 sm:p-8 space-y-6 flex-1">
              {/* Products Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    Product Catalog
                  </h2>
                  <p className="text-xs text-stone-500 font-normal">
                    Manage grocery items, update pricing, stock status, and aisle placement.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-harvest-400" />
                    <span>Add New Item</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetProductsToDefault}
                    title="Reset to fresh defaults"
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-500 border border-stone-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter & Search Controls */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, category, or origin..."
                    className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Category Aisle Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-stone-200 text-xs text-stone-700 bg-stone-50 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="all">All Aisles</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Stock Filter Pills */}
                  <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-xl">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'inStock', label: 'In Stock' },
                      { id: 'outOfStock', label: 'Out of Stock' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStockFilter(s.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          stockFilter === s.id ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-100 pb-3">
                      <th className="pb-3 pl-2">Product</th>
                      <th className="pb-3">Aisle</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock Status</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          No products found matching "{productSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 pl-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-stone-900 truncate max-w-[200px]">
                                  {product.name}
                                </p>
                                <p className="text-[11px] text-stone-400">
                                  {product.unit} {product.origin ? `• ${product.origin}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 font-medium text-stone-600">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                              {product.category}
                            </span>
                          </td>

                          <td className="py-3 font-bold text-forest-900 tabular-nums font-mono">
                            {formatPrice(product.price)}
                            {product.originalPrice && (
                              <span className="block text-[10px] text-stone-400 line-through font-normal">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </td>

                          <td className="py-3">
                            <button
                              type="button"
                              onClick={() => toggleStock(product.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                                product.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                              title="Click to toggle stock status"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </button>
                          </td>

                          <td className="py-3 text-stone-500 font-semibold tabular-nums font-mono">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{product.rating}</span>
                              <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
                            </div>
                          </td>

                          <td className="py-3 text-right pr-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-forest-900 hover:bg-forest-50 transition-colors cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingProductId(product.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </main>
          )}

          {/* ========================================================= */}
          {/* SECTION 3: ORDERS & DELIVERY UPDATES                      */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <main className="p-5 sm:p-8 space-y-6 flex-1">
              {/* Orders Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    Customer Orders & Dispatch
                  </h2>
                  <p className="text-xs text-stone-500 font-normal">
                    Track live deliveries, update fulfillment milestones, and push notifications to customers.
                  </p>
                </div>
              </div>

              {/* Status Filter Bar */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID, customer name..."
                    className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'packing', label: 'Packing' },
                    { id: 'out for delivery', label: 'Out for Delivery' },
                    { id: 'completed', label: 'Completed' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        orderStatusFilter === st.id
                          ? 'bg-forest-900 text-white font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-100 pb-3">
                      <th className="pb-3 pl-2">Order ID</th>
                      <th className="pb-3">Customer & Destination</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Delivery Updates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          No orders found matching "{orderSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 pl-2 font-extrabold text-stone-900">
                            <span>{order.id}</span>
                            <span className="block text-[10px] text-stone-400 font-normal">{order.createdAt}</span>
                          </td>

                          <td className="py-3">
                            <p className="font-bold text-stone-800">{order.customerName}</p>
                            <p className="text-[10px] text-stone-400 truncate max-w-[170px]">{order.address}</p>
                          </td>

                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                              {order.itemsCount || order.items.length} items
                            </span>
                          </td>

                          <td className="py-3 font-extrabold text-forest-900 tabular-nums font-mono">
                            {formatPrice(order.total)}
                          </td>

                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                order.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'Out for Delivery'
                                  ? 'bg-amber-100 text-amber-900'
                                  : order.status === 'Packing'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  order.status === 'Completed'
                                    ? 'bg-emerald-600'
                                    : order.status === 'Out for Delivery'
                                    ? 'bg-amber-600'
                                    : order.status === 'Packing'
                                    ? 'bg-blue-600'
                                    : 'bg-stone-600'
                                }`}
                              />
                              <span>{order.status}</span>
                            </span>
                          </td>

                          <td className="py-3 text-right pr-2">
                            <button
                              type="button"
                              onClick={() => handleOpenDispatch(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                              title="Push delivery update to customer"
                            >
                              <Truck className="w-3.5 h-3.5 text-harvest-400" />
                              <span>Dispatch Updates</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </main>
          )}

          {/* ========================================================= */}
          {/* SECTION 4: ACCOUNT & CLERK AUTHENTICATION                 */}
          {/* ========================================================= */}
          {activeTab === 'account' && (
            <main className="p-5 sm:p-8 space-y-6 flex-1 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Account & Operations Profile
                </h2>
                <p className="text-xs text-stone-500 font-normal">
                  Configure store administrator credentials, Clerk authentication, and dispatch preferences.
                </p>
              </div>

              {/* Admin Profile Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                <h3 className="font-extrabold text-sm text-stone-900">Store Manager Credentials</h3>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-forest-900 text-harvest-400 font-black text-lg flex items-center justify-center">
                    {adminInitials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">{adminDisplayName}</h4>
                    <p className="text-xs text-stone-400">Lead Operations Administrator</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-forest-100 text-forest-900 text-[10px] font-bold">
                      Full Store Access
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={adminEmail}
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      Store Hub Location
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Australia Distribution Hub"
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-700"
                    />
                  </div>
                </div>
              </div>

              {/* Clerk Integration Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900">Clerk User Authentication</h3>
                    <p className="text-xs text-stone-400">
                      Sync customer profiles, saved delivery addresses, and social logins.
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      isClerkConfigured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isClerkConfigured ? 'Clerk Active' : 'Key Pending in .env'}
                  </span>
                </div>

                {isClerkConfigured ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                      <div>
                        <p className="text-xs font-bold text-emerald-950">Clerk Authenticated Session</p>
                        <p className="text-[11px] text-emerald-800">Customers can sign in via modal and track orders.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <p className="text-xs text-stone-700">
                      Add your Clerk publishable key to <code className="font-mono text-forest-900">.env</code>:
                    </p>
                    <pre className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs font-mono text-stone-800 select-all">
                      VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
                    </pre>
                    <p className="text-[11px] text-stone-400">
                      Guest checkout and order tracking remain 100% operational without requiring immediate key setup.
                    </p>
                  </div>
                )}
              </div>
            </main>
          )}

        </div>

      {/* ========================================================= */}
      {/* DELIVERY UPDATES & DISPATCH DRAWER / MODAL               */}
      {/* ========================================================= */}
      {dispatchOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-5 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDispatchOrder(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between border-b border-forest-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-harvest-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Fulfillment & Delivery Dispatcher
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Push live tracking milestones to <span className="font-bold text-white">{dispatchOrder.customerName}</span> ({dispatchOrder.id})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-forest-800 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Order Quick Context */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block font-semibold">Customer</span>
                  <span className="font-bold text-stone-800">{dispatchOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Address</span>
                  <span className="font-medium text-stone-700 truncate block">{dispatchOrder.address}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Delivery Slot</span>
                  <span className="font-medium text-stone-700">{dispatchOrder.deliverySlot}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Current Status</span>
                  <span className="font-bold text-forest-900">{dispatchOrder.status}</span>
                </div>
              </div>

              {/* Form to Push New Delivery Update */}
              <form onSubmit={handleSendDeliveryUpdate} className="space-y-4 p-4.5 rounded-2xl bg-forest-50/50 border border-forest-200/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-forest-700" />
                    <span>Push Real-Time Delivery Update</span>
                  </h4>
                  <span className="text-[10px] text-stone-500">Customer sees this instantly</span>
                </div>

                {/* Status + Courier + Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      New Status
                    </label>
                    <select
                      value={newUpdateStatus}
                      onChange={(e) => setNewUpdateStatus(e.target.value as OrderStatus)}
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white focus:outline-none focus:ring-1 focus:ring-forest-700"
                    >
                      <option value="Pending">Pending (Received)</option>
                      <option value="Packing">Packing at Farm Hub</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Delivered / Handed Over</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Assigned Courier / Driver
                    </label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. Carlos M. (Van #2)"
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-1 focus:ring-forest-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Current Location
                    </label>
                    <input
                      type="text"
                      value={dispatchLocation}
                      onChange={(e) => setDispatchLocation(e.target.value)}
                      placeholder="e.g. 5th Ave Route"
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-1 focus:ring-forest-700"
                    />
                  </div>
                </div>

                {/* Message input */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Delivery Note / Message to Customer
                  </label>
                  <input
                    type="text"
                    value={customUpdateNote}
                    onChange={(e) => setCustomUpdateNote(e.target.value)}
                    placeholder="Enter custom delivery update or pick a grocery preset below..."
                    className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-1 focus:ring-forest-700"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Presets:</span>
                    {[
                      'Packed with ice gel packs in insulated tote',
                      'Driver on route to customer doorstep',
                      'Arriving in 10-15 minutes - please be ready',
                      'Handed over directly to customer / concierge',
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomUpdateNote(preset)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 hover:border-forest-700 text-stone-600 hover:text-forest-900 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-harvest-400" />
                    <span>Push Delivery Update</span>
                  </button>
                </div>
              </form>

              {/* Delivery History Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Delivery History & Timeline ({dispatchOrder.deliveryUpdates?.length || 0})
                </h4>

                {dispatchOrder.deliveryUpdates && dispatchOrder.deliveryUpdates.length > 0 ? (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
                    {dispatchOrder.deliveryUpdates.map((upd, idx) => (
                      <div key={upd.id || idx} className="relative">
                        <div
                          className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white ${
                            idx === 0 ? 'bg-forest-900 ring-2 ring-forest-200' : 'bg-stone-400'
                          }`}
                        />
                        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-stone-900">{upd.status}</span>
                            <span className="text-[11px] text-stone-400 tabular-nums font-mono">
                              {upd.timestamp}
                            </span>
                          </div>
                          <p className="text-stone-700">{upd.message}</p>
                          {(upd.courierName || upd.location) && (
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-500 pt-1 border-t border-stone-200/50">
                              {upd.courierName && <span>Courier: {upd.courierName}</span>}
                              {upd.location && <span>Location: {upd.location}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                    No past delivery updates logged for this order.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal with Drag & Drop */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setDeletingProductId(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-stone-200 p-5 z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 mb-1">Delete Grocery Item?</h3>
            <p className="text-xs text-stone-500 mb-5">
              This product will be immediately removed from the live customer catalog.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminDashboard
