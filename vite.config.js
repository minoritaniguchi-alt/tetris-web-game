import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // 相対パス（Cloud Storageで重要）
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.log削除
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
