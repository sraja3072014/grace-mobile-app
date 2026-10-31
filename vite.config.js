import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replaceAll('\\', '/');

          if (moduleId.includes('/node_modules/@supabase/supabase-js/')) {
            return 'supabase';
          }

          if (moduleId.includes('/node_modules/lucide-react/')) {
            return 'lucide';
          }

          if (moduleId.includes('/node_modules/react-dom/')) {
            return 'react-dom';
          }
        },
      },
    },
  },
})
