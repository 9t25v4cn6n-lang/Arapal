import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    // Honour a PORT assigned by the tooling/preview harness. Without this, Vite
    // ignores PORT and auto-increments from 5173, so a proxy that expected the
    // assigned port reaches a blank page. Falls back to Vite's default locally.
    ...(process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : {}),
  },
})