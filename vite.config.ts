import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const contentSecurityPolicy = [
  "default-src 'self' data: blob: filesystem: about:;",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;",
  "font-src https://fonts.gstatic.com data:;",
  "connect-src 'self' https: ws: wss:;",
  "img-src 'self' data: blob: https:;",
  "frame-src 'self' https:;",
  "object-src 'none';",
  "base-uri 'self';",
  "form-action 'self';",
].join(' ');

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      headers: {
        'Content-Security-Policy': contentSecurityPolicy,
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
