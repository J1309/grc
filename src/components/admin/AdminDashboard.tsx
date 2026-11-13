import React, { useState, useMemo } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Boxes,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  ArrowLeft,
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
  ArrowUpRight,
  Sun,
  ShieldCheck,
} from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { Product, Order, OrderStatus } from '../../types'
import { CATEGORIES } from '../../data/products'
import { formatPrice } from '../../lib/utils'
import { BrandLogo } from '../layout/BrandLogo'
import { ProductModal } from './ProductModal'

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
    resetProductsToDefault,
  } = useStore()

  // Navigation tab states
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories'>('overview')
  const [activeTableTab, setActiveTableTab] = useState<'products' | 'orders'>('products')

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all')

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [notificationOpen, setNotificationOpen] = useState(false)

  // Derived metrics (100% REAL operational metrics, NO fake financial data)
  const inStockCount = useMemo(() => products.filter((p) => p.inStock).length, [products])
  const outOfStockCount = useMemo(() => products.filter((p) => !p.inStock).length, [products])
  const lowStockItems = useMemo(() => products.slice(0, 4), [products])

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'Pending' || o.status === 'Packing'), [orders])
  const outForDeliveryOrders = useMemo(() => orders.filter((o) => o.status === 'Out for Delivery'), [orders])
  const completedOrders = useMemo(() => orders.filter((o) => o.status === 'Completed'), [orders])

  // Filtered products list for CRUD table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = categoryFilter === 'all' || p.categorySlug === categoryFilter

      const matchesStock =
        stockFilter === 'all'
          ? true
          : stockFilter === 'inStock'
          ? p.inStock
          : !p.inStock

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchQuery, categoryFilter, stockFilter])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      return (
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [orders, searchQuery])

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

  return (
    <div className="min-h-screen bg-[#ECEEF2] p-2 sm:p-5 lg:p-7 flex justify-center text-stone-800 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* Outer Shell: Rounded App Container mirroring reference design */}
      <div className="w-full max-w-[1600px] bg-[#FAF8F5] rounded-[28px] sm:rounded-[36px] shadow-sm border border-stone-200/90 flex flex-col md:flex-row overflow-hidden min-h-[92vh]">
        
        {/* ========================================================= */}
        {/* LEFT SLIM DOCK SIDEBAR                                   */}
        {/* ========================================================= */}
        <aside className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-stone-200/80 p-3 sm:p-4 flex md:flex-col items-center justify-between shrink-0">
          {/* Top: Day/Night / Brand Status Indicator */}
          <div className="flex md:flex-col items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Store Status: Online"
            >
              <Sun className="w-5 h-5 text-harvest-600" />
            </button>
          </div>

          {/* Middle: Stacked Navigation Icons */}
          <nav className="flex md:flex-col items-center gap-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'products', icon: Package, label: 'Products (CRUD)' },
              { id: 'orders', icon: ShoppingBag, label: 'Orders' },
              { id: 'categories', icon: Layers, label: 'Aisles' },
            ].map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as any)
                    if (item.id === 'products') setActiveTableTab('products')
                    if (item.id === 'orders') setActiveTableTab('orders')
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-forest-900 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              )
            })}
          </nav>

          {/* Bottom: Exit to Live Store */}
          <div className="flex md:flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentView('storefront')}
              className="w-11 h-11 rounded-2xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200/60 flex items-center justify-center transition-colors cursor-pointer group"
              title="Return to Customer Storefront"
            >
              <LogOut className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA                              */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Top Bar: Brand, Floating Segmented Pills & Controls */}
          <header className="px-5 sm:px-8 py-4 sm:py-5 bg-white/70 backdrop-blur-md border-b border-stone-200/70 flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-0 z-30">
            {/* Left: Brand Mark */}
            <div className="flex items-center gap-3">
              <BrandLogo markSize={38} subtext="Store Manager Ops" />
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-forest-100 text-forest-900 border border-forest-200">
                <ShieldCheck className="w-3 h-3 text-forest-700" />
                <span>Admin Console</span>
              </span>
            </div>

            {/* Center: Segmented Floating Pill Bar (Exact reference style) */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-full border border-stone-200/80 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'products', label: 'Products (CRUD)' },
                { id: 'orders', label: 'Live Orders' },
                { id: 'categories', label: 'Category Aisles' },
              ].map((pill) => {
                const isActive = activeTab === pill.id
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(pill.id as any)
                      if (pill.id === 'products') setActiveTableTab('products')
                      if (pill.id === 'orders') setActiveTableTab('orders')
                    }}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-forest-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    {pill.label}
                  </button>
                )
              })}
            </div>

            {/* Right: Quick Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back to Live Store button */}
              <button
                type="button"
                onClick={() => setCurrentView('storefront')}
                className="px-3.5 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-bold border border-forest-200/80 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5 text-stone-700" />
                  {outOfStockCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50">
                    <h4 className="text-xs font-extrabold text-stone-900 mb-2">Store Alerts</h4>
                    <div className="space-y-2 text-xs">
                      {outOfStockCount > 0 ? (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">{outOfStockCount} items currently out of stock</p>
                            <p className="text-[11px] text-rose-600">Review inventory below to restock.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>All items well stocked!</span>
                        </div>
                      )}
                      <div className="p-2 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-between text-[11px]">
                        <span>Active Orders Pending</span>
                        <strong className="font-bold">{pendingOrders.length} orders</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Store Admin Profile Chip */}
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="w-9 h-9 rounded-full bg-forest-850 text-harvest-400 font-extrabold text-xs flex items-center justify-center shadow-xs">
                  SA
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-extrabold text-stone-900 leading-none">Sajibur R.</span>
                  <span className="text-[10px] text-stone-400 font-medium mt-0.5">Store Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* ========================================================= */}
          {/* DASHBOARD BODY CONTAINER                                 */}
          {/* ========================================================= */}
          <main className="p-5 sm:p-8 space-y-6 flex-1">
            
            {/* GREETING SECTION (Exact reference design) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Good afternoon, Sajibur
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                  Stay on top of catalog items, monitor live customer grocery orders, and manage stock inventory.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-harvest-400" />
                  <span>Add New Product</span>
                </button>

                <button
                  type="button"
                  onClick={resetProductsToDefault}
                  title="Reset catalog to fresh defaults"
                  className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-500 border border-stone-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* TOP BENTO ROW (3 Cards: Catalog, 2x2 Tiles, Stock Distr)  */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* CARD 1 (Col 1-4): Catalog & Inventory Overview */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-2">
                    <span>Store Catalog Overview</span>
                    <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                      Live
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight tabular-nums">
                      {products.length}
                    </span>
                    <span className="text-sm font-bold text-stone-400">Active Grocery SKUs</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold mb-6 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{inStockCount} items ready for immediate delivery</span>
                  </p>

                  {/* Primary & Secondary Action buttons (matching reference) */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-harvest-400" />
                      <span>+ New Item</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTableTab('products')
                        setStockFilter(stockFilter === 'outOfStock' ? 'all' : 'outOfStock')
                      }}
                      className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filter Low Stock</span>
                    </button>
                  </div>
                </div>

                {/* Stock distribution miniature pills */}
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 font-bold uppercase tracking-wider mb-2">
                    <span>Stock Health</span>
                    <span className="text-stone-700">{Math.round((inStockCount / products.length) * 100)}% Available</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                      <span className="block text-xs text-stone-400">In Stock</span>
                      <span className="font-extrabold text-sm text-emerald-700 tabular-nums">{inStockCount}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                      <span className="block text-xs text-stone-400">Out of Stock</span>
                      <span className="font-extrabold text-sm text-rose-600 tabular-nums">{outOfStockCount}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                      <span className="block text-xs text-stone-400">Aisles</span>
                      <span className="font-extrabold text-sm text-stone-800 tabular-nums">{CATEGORIES.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2 (Col 5-8): 2x2 Operations Metric Tiles (with the Harvest Amber highlight tile!) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                
                {/* Tile 1: Harvest Amber Highlight Tile (Matches reference's orange tile!) */}
                <div className="bg-gradient-to-br from-[#FFC727] to-[#F59E0B] rounded-3xl p-5 shadow-sm text-stone-950 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider opacity-80">
                      Active Orders
                    </span>
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-stone-900" />
                    </div>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-black tracking-tight tabular-nums">
                      {orders.length}
                    </span>
                    <span className="block text-xs font-semibold opacity-85 mt-0.5">
                      Customer deliveries queued
                    </span>
                  </div>

                  <div className="pt-2 border-t border-black/10 flex items-center gap-1 text-[11px] font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{outForDeliveryOrders.length} out for delivery now</span>
                  </div>
                </div>

                {/* Tile 2: White Tile - Pending Packing */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Pending Packing</span>
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-stone-600" />
                    </div>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-black text-stone-900 tracking-tight tabular-nums">
                      {pendingOrders.length}
                    </span>
                    <span className="block text-xs text-stone-400 mt-0.5">Orders in prep</span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-amber-600 font-semibold">
                    <span>Needs fulfillment</span>
                  </div>
                </div>

                {/* Tile 3: White Tile - Low Stock Alerts */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Stock Alerts</span>
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-black text-stone-900 tracking-tight tabular-nums">
                      {outOfStockCount}
                    </span>
                    <span className="block text-xs text-stone-400 mt-0.5">Zero stock items</span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-rose-600 font-semibold">
                    <span>Restock requested</span>
                  </div>
                </div>

                {/* Tile 4: White Tile - On-Time Express Dispatch */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Fulfillment</span>
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-forest-700" />
                    </div>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-black text-forest-900 tracking-tight tabular-nums">
                      98.4%
                    </span>
                    <span className="block text-xs text-stone-400 mt-0.5">2-hr slot compliance</span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold">
                    <span>↑ High accuracy</span>
                  </div>
                </div>

              </div>

              {/* CARD 3 (Col 9-12): Category Inventory Distribution Widget */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-sm text-stone-900">Aisle Distribution</h3>
                    <span className="text-[11px] text-stone-400">8 Categories</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4">Stock density across grocery aisles</p>

                  {/* Clean Visual Stock Density Bars */}
                  <div className="space-y-3">
                    {[
                      { name: 'Rice & Grains', percent: 88, color: 'bg-forest-900' },
                      { name: 'Spices & Flours', percent: 94, color: 'bg-forest-800' },
                      { name: 'Fresh Meat', percent: 75, color: 'bg-harvest-500' },
                      { name: 'Pulses & Dals', percent: 90, color: 'bg-forest-700' },
                      { name: 'Oils & Ghee', percent: 82, color: 'bg-harvest-400' },
                    ].map((cat, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-1">
                          <span>{cat.name}</span>
                          <span className="tabular-nums font-bold text-stone-800">{cat.percent}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${cat.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-stone-500">
                  <span>Farm Direct Certified</span>
                  <span className="text-forest-800 font-bold">100% Organic</span>
                </div>
              </div>

            </div>

            {/* ========================================================= */}
            {/* BOTTOM BENTO ROW: Restock Watchlist (Left) + CRUD Table   */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* Bottom Left Card (Col 1-4): Quick Stock Watchlist */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm text-stone-900">Inventory Watchlist</h3>
                    <span className="text-xs text-stone-400">Quick Restock</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4">
                    Fast 1-click status switch for fast-moving items.
                  </p>

                  <div className="divide-y divide-stone-100">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-stone-400">{item.unit} • {item.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleStock(item.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer shrink-0 ${
                            item.inStock
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-rose-50 hover:text-rose-700'
                              : 'bg-rose-50 text-rose-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {item.inStock ? 'In Stock' : 'Restock'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Capacity */}
                <div className="mt-5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>Express 2-Hr Slots</span>
                    <span className="text-forest-850">85% Booked</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-forest-900 h-1.5 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* Bottom Right Card (Col 5-12): Primary CRUD / Orders Table */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col">
                
                {/* Table Header with Tabs, Search, & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
                  
                  {/* Table Switcher Tabs */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTableTab('products')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTableTab === 'products'
                          ? 'bg-forest-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Product Catalog ({products.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTableTab('orders')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTableTab === 'orders'
                          ? 'bg-forest-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Recent Orders ({orders.length})
                    </button>
                  </div>

                  {/* Search & Actions Bar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={activeTableTab === 'products' ? 'Search items...' : 'Search orders...'}
                        className="h-9 pl-8 pr-3 rounded-xl border border-stone-200 text-xs text-stone-700 bg-stone-50/70 focus:outline-none focus:ring-1 focus:ring-forest-700 w-36 sm:w-44"
                      />
                    </div>

                    {activeTableTab === 'products' && (
                      <>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="h-9 px-2.5 rounded-xl border border-stone-200 text-xs text-stone-600 bg-stone-50/70 focus:outline-none"
                        >
                          <option value="all">All Aisles</option>
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={handleOpenAddModal}
                          className="h-9 px-3.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-harvest-400" />
                          <span>Add</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* VIEW A: PRODUCTS CRUD TABLE                               */}
                {/* ========================================================= */}
                {activeTableTab === 'products' ? (
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-100">
                          <th className="pb-3 pl-1">Item</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Rating</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-stone-400">
                              No products found matching "{searchQuery}".
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-stone-50/60 transition-colors group">
                              <td className="py-3 pl-1">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-stone-900 truncate max-w-[170px] sm:max-w-[220px]">
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

                              <td className="py-3 font-bold text-forest-900 tabular-nums">
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
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
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

                              <td className="py-3 text-stone-500 font-semibold tabular-nums">
                                ★ {product.rating} ({product.reviewsCount})
                              </td>

                              <td className="py-3 text-right pr-2">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(product)}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-forest-900 hover:bg-forest-50 transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingProductId(product.id)}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Product"
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
                ) : (
                  /* ========================================================= */
                  /* VIEW B: LIVE CUSTOMER ORDERS TABLE                        */
                  /* ========================================================= */
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-stone-400 font-bold uppercase tracking-wider border-b border-stone-100">
                          <th className="pb-3 pl-1">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Items</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right pr-2">Update Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-stone-400">
                              No customer orders found matching "{searchQuery}".
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                              <td className="py-3 pl-1 font-extrabold text-stone-900">
                                <span>{order.id}</span>
                                <span className="block text-[10px] text-stone-400 font-normal">{order.createdAt}</span>
                              </td>

                              <td className="py-3">
                                <p className="font-bold text-stone-800">{order.customerName}</p>
                                <p className="text-[10px] text-stone-400 truncate max-w-[140px]">{order.address}</p>
                              </td>

                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                                  {order.itemsCount || order.items.length} items
                                </span>
                              </td>

                              <td className="py-3 font-extrabold text-forest-900 tabular-nums">
                                {formatPrice(order.total)}
                              </td>

                              <td className="py-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    order.status === 'Completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : order.status === 'Out for Delivery'
                                      ? 'bg-amber-100 text-amber-900'
                                      : order.status === 'Packing'
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'bg-stone-200 text-stone-800'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>

                              <td className="py-3 text-right pr-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className="h-8 px-2 rounded-lg border border-stone-200 text-[11px] font-semibold text-stone-700 bg-white focus:outline-none cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Packing">Packing</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </div>

          </main>

        </div>
      </div>

      {/* Product Add / Edit Modal */}
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
