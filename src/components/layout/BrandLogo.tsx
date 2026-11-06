import React from 'react'

interface BrandLogoProps {
  className?: string
  markSize?: number
  showText?: boolean
  subtext?: string
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  markSize = 48,
  showText = true,
  subtext = 'Fresh Supermarket',
}) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* High-Definition Vector Brand Mark */}
      <div 
        className="shrink-0 relative group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
        style={{ width: markSize, height: markSize }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="blBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#084223" />
              <stop offset="100%" stopColor="#021c0e" />
            </linearGradient>
            <linearGradient id="blLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#86EFAC" />
            </linearGradient>
            <linearGradient id="blGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FFC727" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <filter id="blShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Outer Ring & Badge Seal */}
          <circle
            cx="50"
            cy="50"
            r="46.5"
            stroke="url(#blGoldGrad)"
            strokeWidth="2.5"
            fill="url(#blBadgeBg)"
            filter="url(#blShadow)"
          />
          <circle
            cx="50"
            cy="50"
            r="41.5"
            stroke="#166534"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            opacity="0.8"
          />

          {/* Organic Sprout / Fresh Leaves */}
          <path
            d="M49 46 C44 34, 32 30, 26 34 C25 44, 36 50, 47 48"
            fill="url(#blLeafGrad)"
          />
          <path
            d="M28 35 C36 41, 44 45, 47 47"
            stroke="#15803D"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <path
            d="M49 46 C52 30, 66 22, 75 26 C76 38, 64 47, 51 48"
            fill="#4ADE80"
          />
          <path
            d="M74 27 C64 36, 54 44, 50 47"
            stroke="#15803D"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Sprout Central Stem */}
          <path
            d="M50 51 C50 40, 51 28, 52 21"
            stroke="#FEF08A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Fresh Golden Produce Accent */}
          <circle cx="58" cy="41" r="7.5" fill="url(#blGoldGrad)" />
          <path
            d="M58 33 C60 31, 63 32, 62 34"
            stroke="#166534"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Shopping Cart Body */}
          <path
            d="M22 36 L27.5 36 L37 60 L68 60 L76 41 L31.5 41"
            stroke="url(#blGoldGrad)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Basket Interior Ribbing */}
          <line
            x1="42"
            y1="44"
            x2="39"
            y2="57"
            stroke="url(#blGoldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="53"
            y1="44"
            x2="51"
            y2="57"
            stroke="url(#blGoldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="64"
            y1="44"
            x2="62"
            y2="57"
            stroke="url(#blGoldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Cart Wheels */}
          <circle cx="40" cy="69" r="5.5" fill="url(#blGoldGrad)" />
          <circle cx="40" cy="69" r="2.2" fill="#021c0e" />

          <circle cx="65" cy="69" r="5.5" fill="url(#blGoldGrad)" />
          <circle cx="65" cy="69" r="2.2" fill="#021c0e" />

          {/* Four-Point Sparkle */}
          <path
            d="M74 16 Q74 20 78 20 Q74 20 74 24 Q74 20 70 20 Q74 20 74 16 Z"
            fill="#FDE047"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight">
            <span className="font-black text-2xl sm:text-[27px] text-white leading-none tracking-tight">
              Grocery
            </span>
            <span className="font-black text-2xl sm:text-[27px] text-[#FFC727] leading-none tracking-tight">
              Cart
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-[2px] w-2.5 bg-[#FFC727]/80 rounded-full"></span>
            <span className="text-[10px] tracking-[0.2em] text-emerald-300 font-bold uppercase">
              {subtext}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
