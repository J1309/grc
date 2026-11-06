import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800"
          >
            <div className="bg-forest-900 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                  GC
                </div>
                <div>
                  <h4 className="text-xs font-bold">GroceryCart Assistant</h4>
                  <p className="text-[10px] text-emerald-200">Online • Typically replies instantly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-stone-50 text-xs text-stone-600 space-y-2">
              <div className="bg-white p-2.5 rounded-xl shadow-xs border border-stone-100">
                👋 Hello! Need help finding your pantry essentials or checking order status?
              </div>
              <div className="bg-white p-2.5 rounded-xl shadow-xs border border-stone-100">
                You can also call us directly at <strong>(800) 789-GROCERY</strong>!
              </div>
            </div>

            <div className="p-2.5 bg-white border-t border-stone-100">
              <a
                href="https://wa.me/18007894762?text=Hi%20GroceryCart%2C%20I%20have%20a%20question%20about%20my%20order"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Start WhatsApp Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-colors cursor-pointer border-2 border-white"
        title="Chat with Customer Support"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-harvest-400 rounded-full border-2 border-white"></span>
      </motion.button>
    </div>
  )
}

export default WhatsAppButton

