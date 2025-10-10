#!/usr/bin/env node
import { Command } from 'commander';

import { createFeatCommand } from '@/cli/feat.js';
import { createGenCommand } from '@/cli/gen.js';

const program = new Command();

program.name('run-create-cli').description('Scaffold files from simple blueprints').version('0.1.0');

// Register commands
program.addCommand(createFeatCommand());
program.addCommand(createGenCommand());

program.parseAsync();
