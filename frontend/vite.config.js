// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import path from "path";
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl(), // ← これがトップレベルで必要！
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 本番環境ではソースマップを無効化
    minify: 'terser', // より良い圧縮のためterserを使用
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // チャンクサイズの警告を1MBに設定
  },
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(new URL('.', import.meta.url)), "src"),
    },
  },
});
