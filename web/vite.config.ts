import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // web-ifc loads its WASM from a folder URL at runtime, so serve it at /wasm/ (dev and build).
    viteStaticCopy({
      targets: [
        {
          src: ['node_modules/web-ifc/web-ifc.wasm', 'node_modules/web-ifc/web-ifc-mt.wasm'],
          dest: 'wasm',
          rename: { stripBase: true },
        },
      ],
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5292',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
