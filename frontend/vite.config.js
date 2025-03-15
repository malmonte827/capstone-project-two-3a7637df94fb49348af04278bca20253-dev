import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Makes it easier to use `describe`, `it`, etc. globally
    environment: 'jsdom', // Simulate a browser environment
}})
