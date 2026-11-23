import React, { useState } from 'react'
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  User as UserIcon,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Phone,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../context/StoreContext'
import { Order, OrderStatus } from '../../types'
import { formatPrice } from '../../lib/utils'
import { useClerkStatus } from '../auth/ClerkAuthProvider'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react'

interface UserAccountModalProps {
  isOpen: boolean
  onClose: () => void
  initialOrderId?: string
  initialTab?: 'tracking' | 'orders' | 'profile'
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
  initialTab,
}) => {
  const { orders } = useStore()
  const { isClerkConfigured } = useClerkStatus()

  // Find initial order or default to the most recent one
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    if (initialOrderId) return initialOrderId
    return orders[0]?.id || ''
  })
  const [searchTrackingId, setSearchTrackingId] = useState('')
  const [activeTab, setActiveTab] = useState<'tracking' | 'orders' | 'profile'>(initialTab || 'tracking')

  React.useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab)
    }
  }, [initialTab, isOpen])

  if (!isOpen) return null

  const selectedOrder = orders.find(
    (o) =>
      o.id.toLowerCase() === selectedOrderId.toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === selectedOrderId.toLowerCase())
  ) || orders[0]

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTrackingId.trim()) return
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === searchTrackingId.trim().toLowerCase() ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === searchTrackingId.trim().toLowerCase())
    )
    if (match) {
      setSelectedOrderId(match.id)
      setActiveTab('tracking')
    }
  }

  // Determine active step index for progress tracker
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending':
        return 1
      case 'Packing':
        return 2
      case 'Out for Delivery':
        return 3
      case 'Completed':
        return 4
      case 'Cancelled':
        return 0
      default:
        return 1
    }
  }

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.status) : 1

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-7 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
              <Truck className="w-5 h-5 text-forest-800" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 leading-tight">
                Customer Account & Order Tracking
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Live delivery milestones & account preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="px-5 sm:px-7 py-3 bg-white/60 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Order Tracking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              My Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Account / Clerk
            </button>
          </div>

          {/* Quick Search Order ID */}
          <form onSubmit={handleTrackSubmit} className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3" />
            <input
              type="text"
              value={searchTrackingId}
              onChange={(e) => setSearchTrackingId(e.target.value)}
              placeholder="Search order ID (e.g. GC-10024)"
              className="h-8 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700 w-full sm:w-56"
            />
          </form>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: ORDER TRACKING */}
          {activeTab === 'tracking' && selectedOrder && (
            <div className="space-y-6">
              {/* Order Overview Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Order Reference
                    </span>
                    <span className="font-extrabold text-sm text-forest-900">
                      {selectedOrder.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        selectedOrder.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedOrder.status === 'Out for Delivery'
                          ? 'bg-amber-100 text-amber-900'
                          : selectedOrder.status === 'Packing'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on <span className="font-medium text-stone-700">{selectedOrder.createdAt}</span> • Slot: <span className="font-semibold text-stone-800">{selectedOrder.deliverySlot}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="block text-[11px] font-semibold text-stone-400 uppercase">
                    Estimated Delivery
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-forest-900">
                    {selectedOrder.estimatedDelivery || 'Today within 2 hrs'}
                  </span>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                  Delivery Milestones
                </h3>

                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-stone-100 -z-0">
                    <div
                      className="h-full bg-forest-900 transition-all duration-500"
                      style={{
                        width:
                          currentStep === 1
                            ? '0%'
                            : currentStep === 2
                            ? '33%'
                            : currentStep === 3
                            ? '66%'
                            : currentStep === 4
                            ? '100%'
                            : '0%',
                      }}
                    />
                  </div>

                  {/* Steps */}
                  {[
                    { step: 1, label: 'Order Placed', desc: 'Verified & Queued' },
                    { step: 2, label: 'Packing', desc: 'At Farm Hub' },
                    { step: 3, label: 'Out for Delivery', desc: 'In Courier Van' },
                    { step: 4, label: 'Delivered', desc: 'Direct to Hands' },
                  ].map((s) => {
                    const isDone = currentStep >= s.step
                    const isCurrent = currentStep === s.step

                    return (
                      <div key={s.step} className="flex flex-col items-center text-center z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs mb-2 ${
                            isDone
                              ? 'bg-forest-900 text-white'
                              : 'bg-white text-stone-400 border border-stone-200'
                          } ${isCurrent ? 'ring-4 ring-forest-100 scale-105' : ''}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isDone ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {s.label}
                        </span>
                        <span className="text-[10px] text-stone-400 hidden sm:block mt-0.5">
                          {s.desc}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Live Delivery Updates Stream (Pushed by Admin) */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Live Delivery Updates Feed
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Real-time dispatcher logs
                  </span>
                </div>

                {selectedOrder.deliveryUpdates && selectedOrder.deliveryUpdates.length > 0 ? (
                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
                    {selectedOrder.deliveryUpdates.map((update, idx) => (
                      <div key={update.id || idx} className="relative">
                        <div
                          className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            idx === 0 ? 'bg-forest-900 ring-2 ring-forest-200' : 'bg-stone-400'
                          }`}
                        />
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-stone-900">{update.status}</span>
                            <span className="text-[11px] text-stone-400 font-medium">
                              {update.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 leading-relaxed">
                            {update.message}
                          </p>
                          {(update.courierName || update.location) && (
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500 pt-1.5 border-t border-stone-200/50">
                              {update.courierName && (
                                <span className="flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-stone-400" />
                                  <span>{update.courierName}</span>
                                </span>
                              )}
                              {update.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-stone-400" />
                                  <span>{update.location}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-stone-400">
                    No delivery status notes posted yet.
                  </div>
                )}
              </div>

              {/* Items in this Order */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Items in this Delivery ({selectedOrder.items.length})
                </h3>
                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-stone-800">{item.productName}</p>
                        <p className="text-[11px] text-stone-400">
                          Qty: {item.quantity} • {item.unit}
                        </p>
                      </div>
                      <span className="font-bold text-stone-900 tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 flex items-center justify-between font-bold text-stone-900 text-sm">
                    <span>Order Total</span>
                    <span className="text-forest-900 text-base tabular-nums">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                All Storefront Orders
              </h3>
              <div className="space-y-2.5">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrderId(ord.id)
                      setActiveTab('tracking')
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedOrderId === ord.id
                        ? 'bg-forest-50/70 border-forest-300 ring-1 ring-forest-300'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-extrabold text-xs text-stone-900">{ord.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Out for Delivery'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        {ord.items.length} items • Total: {formatPrice(ord.total)}
                      </p>
                      <p className="text-[11px] text-stone-400">{ord.createdAt}</p>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Track</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLERK USER ACCOUNT PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {isClerkConfigured ? (
                <>
                  <SignedIn>
                    <div className="p-5 rounded-2xl bg-white border border-stone-200 text-center">
                      <div className="flex justify-center mb-3">
                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox: 'w-16 h-16 rounded-full border-2 border-forest-700',
                            },
                          }}
                        />
                      </div>
                      <h3 className="font-extrabold text-base text-stone-900">
                        Clerk Account Active
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Your grocery order history and saved delivery addresses are securely synced.
                      </p>
                    </div>
                  </SignedIn>

                  <SignedOut>
                    <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-stone-900">
                          Sign In to Your GroceryCart Account
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                          Sign in with Clerk to save addresses, track order dispatches, and receive one-tap delivery updates.
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <SignInButton mode="modal">
                          <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-850 transition-colors shadow-sm cursor-pointer"
                          >
                            Sign In
                          </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            Create Account
                          </button>
                        </SignUpButton>
                      </div>
                    </div>
                  </SignedOut>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900">
                      Clerk Authentication Setup
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                      Clerk SDK is fully installed and wired up! To enable instant customer sign-in & user accounts, add your key to <code className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-800">.env</code>:
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left font-mono text-xs text-stone-700 max-w-md mx-auto select-all">
                    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
                  </div>

                  <p className="text-[11px] text-stone-400">
                    Orders can still be tracked instantly in guest mode using Order ID or the tracking tabs above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
export default UserAccountModal
