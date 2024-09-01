import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_PORT}`, // Replace with your backend API's base URL
        changeOrigin: true,
        secure: false,
      },
    },
    cors: {
      origin: '*', // Allows all origins, adjust as needed for security
    },
  },
});
