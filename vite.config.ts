import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const isElectronBuild = process.env.BUILD_TARGET === 'electron';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isElectronBuild ? './' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
