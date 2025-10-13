/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [nodePolyfills(), react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 750,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@icons': path.resolve(__dirname, './src/components/icons'),
      '@types': path.resolve(__dirname, './src/domain/types'),
    },
  },
})
