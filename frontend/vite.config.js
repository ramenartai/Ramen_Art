import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/azure-openai': 'https://soura-m78qs14x-eastus2.openai.azure.com'
    }
  }
})
