import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    glsl(),
    {
      name: 'copy-cname',
      closeBundle() {
        // Copy CNAME to dist after build
        try {
          copyFileSync('CNAME', 'dist/CNAME');
          console.log('✓ CNAME file copied to dist/');
        } catch (err) {
          console.warn('Warning: Could not copy CNAME file');
        }
      }
    }
  ],
  base: '/', // Use root path for custom domain
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  }
});
