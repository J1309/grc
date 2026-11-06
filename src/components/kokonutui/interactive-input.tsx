import React, { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InteractiveInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
  onSubmit?: () => void
}

export const InteractiveInput: React.FC<InteractiveInputProps> = ({
  value,
  onChange,
  placeholder = 'Search for products, spices, flours, rice...',
  onClear,
  className,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen to keyboard shortcut '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={cn('relative w-full max-w-2xl lg:max-w-3xl', className)}>
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) {
              onSubmit()
            }
          }}
          placeholder={placeholder}
          className="w-full h-12 sm:h-13 pl-6 pr-26 rounded-full bg-white text-stone-800 placeholder-stone-400 text-sm sm:text-[15px] focus:outline-none focus:ring-2 focus:ring-harvest-400 border border-white/20 shadow-md transition-all"
        />

        <div className="absolute right-2 flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                if (onClear) onClear()
                inputRef.current?.focus()
              }}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!value && (
            <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-mono text-stone-400 bg-stone-100 rounded-md border border-stone-200">
              /
            </kbd>
          )}

          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={onSubmit}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest-850 hover:bg-forest-900 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            title="Search"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-100" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default InteractiveInput

