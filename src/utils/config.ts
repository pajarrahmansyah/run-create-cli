import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export interface RccConfig {
  /** Base directory for generated files */
  baseDir?: string;
  /** Default to skip test files */
  skipTests?: boolean;
}

const CONFIG_FILES = ['rcc.config.js', 'rcc.config.mjs', 'rcc.config.cjs'];

/**
 * Load config from project directory
 * Searches for rcc.config.js/mjs/cjs in current working directory
 * Note: .ts files are not supported directly, users should compile to .js first
 */
export async function loadConfig(): Promise<RccConfig> {
  const cwd = process.cwd();

  for (const configFile of CONFIG_FILES) {
    const configPath = resolve(cwd, configFile);
    if (existsSync(configPath)) {
      try {
        const configUrl = pathToFileURL(configPath).href;
        const mod = await import(configUrl);
        const config = mod.default || mod;
        return config;
      } catch (error) {
        console.warn(`Warning: Failed to load ${configFile}`);
      }
    }
  }

  // Return empty config if no file found
  return {};
}

/**
 * Get config value with fallback to default
 */
export function getConfigValue<T>(config: RccConfig, key: keyof RccConfig, defaultValue: T): T {
  const value = config[key];
  return value !== undefined ? (value as T) : defaultValue;
}
