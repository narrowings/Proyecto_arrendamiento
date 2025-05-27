import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // aquí le indicas a Vite que reemplace global por window
    global: "window"
  }
})
