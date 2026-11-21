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

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'CONVEX_'],
    define: {
      'import.meta.env.VITE_CONVEX_URL': JSON.stringify(convexUrl),
      'import.meta.env.CONVEX_URL': JSON.stringify(convexUrl),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})

