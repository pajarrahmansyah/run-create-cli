/**
 * RCC Configuration File Example
 *
 * Save this file as `rcc.config.js` in your project root.
 *
 * Note: TypeScript config files (.ts) are not directly supported.
 * If you use TypeScript, write your config in .ts and compile to .js,
 * or use .js/.mjs format directly.
 */

export default {
  /**
   * Base directory for generated files
   * CLI flag `-d, --dir` will override this setting
   * @default 'src'
   */
  baseDir: 'src',

  /**
   * Skip generating test files by default
   * CLI flags `--test` or `--no-test` will override this setting
   * @default false
   */
  skipTests: false,
};
