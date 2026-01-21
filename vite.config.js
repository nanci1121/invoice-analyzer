import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'sql': ['sql.js']
        }
      }
    }
  },
  server: {
    port: 5173
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        bigint: true
      }
    }
  }
});
