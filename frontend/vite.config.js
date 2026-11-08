import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { weddingConfig } from './src/data/weddingConfig.js'

const bride = weddingConfig.bride.nickname || weddingConfig.bride.name || ''
const groom = weddingConfig.groom.nickname || weddingConfig.groom.name || ''
const weddingTitle = `The Wedding of ${bride} & ${groom}`

// Vite HTML transform plugin: replaces %WEDDING_TITLE% in index.html at build time
function htmlTitlePlugin() {
  return {
    name: 'html-title',
    transformIndexHtml(html) {
      return html.replace('%WEDDING_TITLE%', weddingTitle)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), htmlTitlePlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
        },
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
