/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Served from https://<user>.github.io/clocktower-companion/
  base: '/clocktower-companion/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Clocktower Companion',
        short_name: 'Clocktower',
        description:
          'Atmospheric speeches for Blood on the Clocktower storytellers',
        display: 'standalone',
        background_color: '#141118',
        theme_color: '#141118',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
