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
          // React関連
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // Three.js コア
          'three-core': ['three'],
          
          // Three.js React統合
          'three-react': ['@react-three/fiber', '@react-three/drei'],
          
          // Three.js 重いモジュール（examples/jsm）
          'three-examples': [
            'three/examples/jsm/objects/Lensflare',
            'three/examples/jsm/controls/OrbitControls',
            'three/examples/jsm/loaders/GLTFLoader',
            'three/examples/jsm/postprocessing/EffectComposer',
            'three/examples/jsm/postprocessing/RenderPass',
            'three/examples/jsm/postprocessing/UnrealBloomPass'
          ],
          
          // Three.js ポストプロセシング
          'three-postprocessing': ['@react-three/postprocessing'],
          
          // UI関連
          ui: ['lucide-react', 'react-hot-toast', 'framer-motion'],
          
          // その他のライブラリ
          utils: ['axios', 'zustand', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 2000, // チャンクサイズの警告を2MBに設定
  },
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(new URL('.', import.meta.url)), "src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 明示的に拡張子を指定
  },
});
