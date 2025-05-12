import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Terminal from 'vite-plugin-terminal'
import { plugin as markdownPlugin } from "vite-plugin-markdown";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Terminal(),
    markdownPlugin(),
    visualizer({
      open: true, // auto opens report
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true
    })
  ],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['chunk-4M52IPBT']
  }
})
