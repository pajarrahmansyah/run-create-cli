import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/run-create-cli.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: false,
  // Keep commander as external dependency - npm will handle it
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
    };
  },
});
