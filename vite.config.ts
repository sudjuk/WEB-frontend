import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isTauri = process.env.TAURI_PLATFORM !== undefined;
  const base = isTauri ? '/' : '/AstroDist-Frontend/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'AstroDist',
          short_name: 'AstroDist',
          description: 'AstroDist Astronomy Services',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
    ],
    clearScreen: false,
    server: !isTauri ? {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
        '/order': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
        '/static': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
        '/pictures': { target: 'http://localhost:9000', changeOrigin: true, secure: false },
      },
    } : {
      port: 5173,
      strictPort: true,
      watch: {
        ignored: ['**/src-tauri/**'],
      },
    },
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
      target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  };
});


