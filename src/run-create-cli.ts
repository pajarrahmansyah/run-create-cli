#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { createFeatCommand } from '@/cli/feat.js';
import { createGenCommand } from '@/cli/gen.js';

// Read version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('run-create-cli')
  .description('Scaffold files from simple blueprints')
  .version(`${packageJson.name} v${packageJson.version}`, '-v, --version');

// Register commands
program.addCommand(createFeatCommand());
program.addCommand(createGenCommand());

program.parseAsync();
