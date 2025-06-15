import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// Configuration for static build (GitHub Pages)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  root: './client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  base: './',
  define: {
    global: 'globalThis',
  },
})