import { resolve } from 'node:path';

import { Command } from 'commander';

import { featTemplate } from '@/templates/feat.js';
import { toCases } from '@/utils/case.js';
import { writeText } from '@/utils/fs.js';

export function createFeatCommand() {
  const command = new Command();

  return command
    .command('feat')
    .argument('name', 'Feature name (e.g., "user auth")')
    .option('-d, --dir <dir>', 'Base directory', 'src')
    .option('-f, --force', 'Overwrite existing files', false)
    .option('--no-test', 'Skip generating test files')
    .action(async (name, opts) => {
      const cases = toCases(name);
      const files = featTemplate(opts.dir);

      // Filter out test files if --no-test option is provided
      const filteredFiles =
        opts.test === false
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
