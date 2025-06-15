import { build } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Build for static deployment (GitHub Pages)
async function buildStatic() {
  try {
    await build({
      configFile: false,
      plugins: [
        (await import('@vitejs/plugin-react')).default()
      ],
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
    console.log('Static build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildStatic()