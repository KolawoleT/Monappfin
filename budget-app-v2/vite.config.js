import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Budget App',
        short_name: 'Budget',
        description: 'Suivi budgétaire avec 3 portefeuilles',
        theme_color: '#ffffff',
        background_color: '#0d0e14',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23818cf8" width="192" height="192"/><text x="50%" y="50%" font-size="120" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">₣</text></svg>',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true
      }
    })
  ]
})
