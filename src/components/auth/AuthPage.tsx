import React, { useState } from 'react'
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock,
  CheckCircle2,
  Mail,
  User,
  ShoppingBag,
} from 'lucide-react'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { useClerkStatus } from './ClerkAuthProvider'
import { BrandLogo } from '../layout/BrandLogo'

interface AuthPageProps {
  onBackToStore: () => void
  initialMode?: 'signIn' | 'signUp'
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToStore,
  initialMode = 'signIn',
}) => {
  const { isClerkConfigured } = useClerkStatus()
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>(initialMode)
  const [demoEmail, setDemoEmail] = useState('')
  const [demoPassword, setDemoPassword] = useState('')
  const [demoSubmitted, setDemoSubmitted] = useState(false)

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDemoSubmitted(true)
    setTimeout(() => {
      onBackToStore()
    }, 1200)
  }

  const clerkAppearance = {
    elements: {
      card: 'shadow-none border border-stone-200/80 rounded-3xl bg-white p-6 sm:p-8',
      formButtonPrimary:
        'bg-forest-900 hover:bg-forest-850 text-white font-bold rounded-xl text-xs py-3 tracking-wide transition-all shadow-sm',
      headerTitle: 'text-stone-900 font-extrabold text-xl tracking-tight',
      headerSubtitle: 'text-stone-500 text-xs font-normal',
      socialButtonsBlockButton:
        'border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 font-semibold text-xs py-2.5 transition-colors',
      formFieldInput:
        'rounded-xl border-stone-200 focus:border-forest-700 focus:ring-forest-700 text-xs py-2.5 bg-stone-50/50',
      formFieldLabel: 'text-[11px] font-bold text-stone-700 uppercase tracking-wider',
      footerActionLink: 'text-forest-900 hover:text-forest-800 font-bold',
      identityPreviewText: 'text-xs text-stone-700 font-medium',
    },
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex flex-col justify-between text-stone-800 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* Top Bar Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-stone-200/60">
        <BrandLogo subtext="Fresh Supermarket" markSize={32} />

        <button
          type="button"
          onClick={onBackToStore}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
          <span>Return to Store</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Hero Column (Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#06331B] via-forest-900 to-[#032011] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-harvest-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-forest-800/80 text-harvest-400 border border-forest-700">
                <Sparkles className="w-3 h-3" />
                <span>Customer Portal</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Purity & freshness delivered in 2 hours.
              </h2>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-normal">
                Sign in to manage your active deliveries, save favorite farm staples, and access express checkout.
              </p>
            </div>

            {/* Feature Perks */}
            <div className="relative z-10 space-y-3 my-6 pt-4 border-t border-forest-800/80 text-xs text-emerald-100/90">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-800 text-harvest-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-3 h-3" />
                </div>
                <span>Live milestone tracking & doorstep driver updates.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-800 text-harvest-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-3 h-3" />
                </div>
                <span>Sync your wishlist across phones, tablets & desktop.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-800 text-harvest-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <span>100% farm-direct verified staples & organic oils.</span>
              </div>
            </div>

            <div className="relative z-10 text-[11px] text-emerald-200/60 font-mono">
              grocerycart.com.au • Secured by Clerk
            </div>
          </div>

          {/* Right Auth Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            {isClerkConfigured ? (
              <div className="w-full max-w-sm mx-auto space-y-4">
                {/* Switcher Tab */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl mb-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signIn')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authMode === 'signIn'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signUp')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authMode === 'signUp'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {authMode === 'signIn' ? (
                  <SignIn routing="hash" appearance={clerkAppearance} />
                ) : (
                  <SignUp routing="hash" appearance={clerkAppearance} />
                )}
              </div>
            ) : (
              /* Fallback / Mock Auth view for development */
              <div className="w-full max-w-sm mx-auto space-y-5">
                <div>
                  <h3 className="text-xl font-black text-stone-900 tracking-tight">
                    {authMode === 'signIn' ? 'Sign in to GroceryCart' : 'Create your account'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {authMode === 'signIn'
                      ? 'Enter your email to access your orders and saved staples.'
                      : 'Join today for fast 2-hour doorstep deliveries.'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signIn')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authMode === 'signIn'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signUp')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authMode === 'signUp'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {demoSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-900">
                      Successfully Authenticated!
                    </p>
                    <p className="text-[11px] text-emerald-700">Returning to store...</p>
                  </div>
                ) : (
                  <form onSubmit={handleDemoSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={demoEmail}
                          onChange={(e) => setDemoEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-10 pl-9 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={demoPassword}
                          onChange={(e) => setDemoPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 pl-9 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-10 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <User className="w-3.5 h-3.5 text-harvest-400" />
                      <span>{authMode === 'signIn' ? 'Continue with Email' : 'Register Account'}</span>
                    </button>

                    <p className="text-[10px] text-center text-stone-400 pt-2 leading-relaxed">
                      By continuing, you agree to GroceryCart's Terms of Service and Privacy Policy.
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-stone-400 border-t border-stone-200/60">
        &copy; {new Date().getFullYear()} GroceryCart. All rights reserved. 100% Farm-Direct Supermarket.
      </footer>
    </div>
  )
}
export default AuthPage
