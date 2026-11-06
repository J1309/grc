import React from 'react'
import { CheckCircle2, Info, ShoppingBag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="pointer-events-auto bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-800 flex items-start gap-3 backdrop-blur-md"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'cart' ? (
                <div className="w-7 h-7 rounded-full bg-forest-700 text-harvest-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              ) : toast.type === 'info' ? (
                <div className="w-7 h-7 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white">{toast.title}</h5>
              {toast.description && (
                <p className="text-[11px] text-stone-300 line-clamp-1">{toast.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer

