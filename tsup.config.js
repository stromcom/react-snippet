import { defineConfig } from 'tsup';
import { copyFileSync } from 'node:fs';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  target: 'es2019',
  external: ['react'],
  loader: { '.js': 'jsx' },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  onSuccess: async () => {
    copyFileSync('src/index.d.ts', 'dist/index.d.ts');
  },
});
