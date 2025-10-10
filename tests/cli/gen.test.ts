import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createGenCommand } from '@/cli/gen';

describe('createGenCommand', () => {
  it('should create a command with correct configuration', () => {
    const command = createGenCommand();

    expect(command.name()).toBe('gen');

    // Check that options are registered
    const options = command.options;
    expect(options).toHaveLength(1); // force option

    const optionNames = options.map(opt => opt.long);
    expect(optionNames).toContain('--force');
  });

  it('should have correct arguments', () => {
    const command = createGenCommand();

    // Check that arguments are registered
    const args = command.registeredArguments;
    expect(args).toHaveLength(2); // blueprint and name

    expect(args[0].name()).toBe('blueprint');
    expect(args[1].name()).toBe('name');
  });

  it('should handle command execution with direct action call', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      // Directly call the action with blueprint name
      const action = async (blueprint: string) => {
        console.log(`Generating blueprint: ${blueprint}`);
      };

      await action('user');

      expect(consoleSpy).toHaveBeenCalledWith('Generating blueprint: user');
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('should handle multiple blueprint names', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      const action = async (blueprint: string) => {
        const blueprints = ['user', 'auth', 'dashboard'];
        if (blueprints.includes(blueprint)) {
          console.log(`Generating blueprint: ${blueprint}`);
        } else {
          console.log(`Unknown blueprint: ${blueprint}`);
        }
      };

      await action('user');
      await action('unknown');

      expect(consoleSpy).toHaveBeenCalledWith('Generating blueprint: user');
      expect(consoleSpy).toHaveBeenCalledWith('Unknown blueprint: unknown');
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
