import { resolve } from 'node:path';

import { Command } from 'commander';

import { featTemplate } from '@/templates/feat.js';
import { toCases } from '@/utils/case.js';
import { getConfigValue, loadConfig } from '@/utils/config.js';
import { writeText } from '@/utils/fs.js';

export function createFeatCommand() {
  const command = new Command();

  return command
    .command('feat')
    .argument('name', 'Feature name (e.g., "user auth")')
    .option('-d, --dir <dir>', 'Base directory (overrides config)')
    .option('-f, --force', 'Overwrite existing files', false)
    .option('--no-test', 'Skip generating test files')
    .option('--test', 'Generate test files (overrides config skipTests)')
    .action(async (name, opts) => {
      // Load config from project
      const config = await loadConfig();

      // CLI option > config > default
      const baseDir = opts.dir || getConfigValue(config, 'baseDir', 'src');

      // Determine skipTests with priority: CLI --test > CLI --no-test > config > default
      let skipTests: boolean;
      if (opts.test === true) {
        // Explicit --test flag
        skipTests = false;
      } else if (opts.test === false) {
        // Explicit --no-test flag
        skipTests = true;
      } else {
        // Fall back to config or default
        skipTests = getConfigValue(config, 'skipTests', false);
      }

      const cases = toCases(name);
      const files = featTemplate(baseDir);

      // Filter out test files if --no-test option or config skipTests is true
      const filteredFiles = skipTests
        ? files.filter(spec => {
            const filePath = spec.path(cases);
            const isTestFile = filePath.includes('.test.');
            return !isTestFile;
          })
        : files;

      const results: { path: string; ok: boolean; error?: string }[] = [];

      for (const spec of filteredFiles) {
        const path = resolve(spec.path(cases));
        const content = spec.template(cases);
        try {
          await writeText(path, content, { force: opts.force });
          results.push({ path, ok: true });
        } catch (e: any) {
          results.push({ path, ok: false, error: e?.message || String(e) });
        }
      }

      const ok = results.filter(r => r.ok);
      const fail = results.filter(r => !r.ok);

      if (ok.length) {
        console.log('\nCreated:');
        ok.forEach(r => console.log(' •', r.path));
      }
      if (fail.length) {
        console.log('\nSkipped/Failed:');
        fail.forEach(r => console.log(' •', r.path, '—', r.error));
        process.exitCode = 1;
      }

      if (!ok.length && !fail.length) {
        console.log('No files generated.');
      }
    });
}
