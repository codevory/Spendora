import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode,process.cwd())
  
   visualizer({
    open: true,
    filename: 'stats.html',
    template: 'treemap', // 🔥 best view
   })

  return {
    base:'',
  plugins: [tailwindcss(),react()],
  
  build:{
    rollupOptions:{
      output:{
        manualChunks:{
           charts:["react-chartjs-2","chart.js"],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
           'vendor-utils': ['immer', '@reduxjs/toolkit', 'react-redux']   
        }
      }
    }
  },
  server:{
    proxy: {
      '/api':{
        target: env.VITE_BACKEND_URL || "https://spendora-backend-4ado.onrender.com",
        changeOrigin:true,
        secure:false
      }
    }
  }
}
})