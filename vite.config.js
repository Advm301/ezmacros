import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'QuickPrep',
        short_name: 'QuickPrep',
        theme_color: '#08677B',
        background_color: '#04141a',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
})
