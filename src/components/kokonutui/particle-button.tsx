import React, { useRef } from 'react'
import confetti from 'canvas-confetti'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParticleButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
  particleCount?: number
  variant?: 'primary' | 'amber' | 'outline'
  icon?: React.ReactNode
}

export const ParticleButton: React.FC<ParticleButtonProps> = ({
  children,
  className,
  particleCount = 45,
  variant = 'primary',
  icon,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      try {
        confetti({
          particleCount,
          spread: 60,
          origin: { x, y },
          colors: ['#0E5A32', '#F59E0B', '#22C55E', '#FDE68A', '#15803D'],
          ticks: 200,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 25,
          shapes: ['circle', 'square'],
          scalar: 0.8,
        })
      } catch (err) {
        console.error('Confetti animation error', err)
      }
    }

    if (onClick) {
      onClick(e)
    }
  }

  const variantStyles = {
    primary:
      'bg-forest-900 hover:bg-forest-850 text-white shadow-md hover:shadow-lg hover:shadow-forest-900/20 active:scale-[0.98]',
    amber:
      'bg-harvest-500 hover:bg-harvest-600 text-stone-900 font-semibold shadow-md hover:shadow-lg hover:shadow-harvest-500/20 active:scale-[0.98]',
    outline:
      'border border-stone-300 hover:border-forest-700 bg-white hover:bg-forest-50 text-stone-700 hover:text-forest-900 shadow-sm',
  }

  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2 select-none cursor-pointer',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  )
}

export default ParticleButton

