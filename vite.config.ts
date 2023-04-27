// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "node:path"

export default defineConfig({
  resolve:{
    extensions:[".vue",".mjs",".ts",".js",".tsx",".jsx"],
    alias:{
      "@": path.join(__dirname, "./src"), 
    }
  },
  plugins: [vue()],
})
