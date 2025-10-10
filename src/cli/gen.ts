import { resolve } from 'node:path';

import { Command } from 'commander';

import { toCases } from '@/utils/case.js';
import { writeText } from '@/utils/fs.js';

export function createGenCommand() {
  const command = new Command();

  return command
    .command('gen')
    .argument('blueprint', 'Path to a JS/JSON blueprint module')
    .argument('name', 'Entity name')
    .option('-f, --force', 'Overwrite existing files', false)
    .action(async (blueprintPath, name, opts) => {
      const modPath = resolve(blueprintPath);
      const mod = await import(modPath);
      const blueprint = (mod.default || mod).blueprint ?? (mod.default || mod);
      if (!Array.isArray(blueprint)) throw new Error('Blueprint must export an array of { path, template }');

      const cases = toCases(name);
      for (const spec of blueprint) {
        const p = resolve(spec.path(cases));
        await writeText(p, spec.template(cases), { force: opts.force });
        console.log(' •', p);
      }
    });
}
