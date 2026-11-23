import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const convexUrl =
    env.CONVEX_URL ||
    env.VITE_CONVEX_URL ||
    process.env.CONVEX_URL ||
    process.env.VITE_CONVEX_URL ||
    ''

  const clerkKey =
    env.VITE_CLERK_PUBLISHABLE_KEY ||
    env.CLERK_PUBLISHABLE_KEY ||
    process.env.VITE_CLERK_PUBLISHABLE_KEY ||
    process.env.CLERK_PUBLISHABLE_KEY ||
    ''

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'CONVEX_', 'CLERK_'],
    define: {
      'import.meta.env.VITE_CONVEX_URL': JSON.stringify(convexUrl),
      'import.meta.env.CONVEX_URL': JSON.stringify(convexUrl),
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKey),
      'import.meta.env.CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})

