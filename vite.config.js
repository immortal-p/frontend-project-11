import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
})