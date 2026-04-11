import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react(),
  visualizer({
  open: true,
  filename: 'stats.html',
  template: 'treemap', // 🔥 best view
})
  ],
  build:{
    rollupOptions:{
      output:{
        manualChunks:{
          charts:["react-chartjs-2","chart.js"],
          firebase:["firebase/app","firebase/auth","firebase/firestore","firebase/analytics"],
          vendor:["react","react-dom"],
        }
      }
    }
  }
})
