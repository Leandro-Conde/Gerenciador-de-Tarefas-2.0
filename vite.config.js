import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/Gerenciador-de-Tarefas-2.0/",
  plugins: [react()],
});