import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => ({
  base: "/",   // 🔥 CHANGED TO "/" TO FIX ASSET LOADING ON SUBPATHS (e.g. /meeting)
  plugins: [react()],
  server: {
    watch: { usePolling: true, interval: 800 },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
