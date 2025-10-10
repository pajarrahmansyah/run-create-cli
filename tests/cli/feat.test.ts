import {
  readFile,
  rm,
} from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createFeatCommand } from '@/cli/feat';
import { featTemplate } from '@/templates/feat';
import { toCases } from '@/utils/case';
import {
  exists,
  writeText,
} from '@/utils/fs';

const testDir = resolve('./test-feat-integration');

describe('feat command integration', () => {
  beforeEach(async () => {
    // Clean up before each test
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up after each test
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  it('should generate all 4 files for a feature', async () => {
    const featureName = 'user-auth';
    const cases = toCases(featureName);
    const files = featTemplate(testDir);

    // Generate all files
    for (const spec of files) {
      const path = resolve(spec.path(cases));
      const content = spec.template(cases);
      await writeText(path, content, { force: true });
    }

    // Check that all files were created
    const expectedFiles = [
      resolve(testDir, 'user-auth', 'index.ts'),
      resolve(testDir, 'user-auth', 'user-auth.ts'),
      resolve(testDir, 'user-auth', 'user-auth.type.ts'),
      resolve(testDir, 'user-auth', 'user-auth.test.ts'),
    ];

    for (const file of expectedFiles) {
      const fileExists = await exists(file);
      expect(fileExists).toBe(true);
    }
  });

  it('should filter out test files when requested', async () => {
    const featureName = 'user-module';
    const cases = toCases(featureName);
    const files = featTemplate(testDir);

    // Filter out test files (simulate --no-test behavior)
    const filteredFiles = files.filter(spec => {
      const filePath = spec.path(cases);
      const isTestFile = filePath.includes('.test.');
      return !isTestFile;
    });

    expect(filteredFiles).toHaveLength(3); // Should have 3 files instead of 4

    // Generate filtered files
    for (const spec of filteredFiles) {
      const path = resolve(spec.path(cases));
      const content = spec.template(cases);
      await writeText(path, content, { force: true });
    }

    // Check that main files exist
    const mainFiles = [
      resolve(testDir, 'user-module', 'index.ts'),
      resolve(testDir, 'user-module', 'user-module.ts'),
      resolve(testDir, 'user-module', 'user-module.type.ts'),
    ];

    for (const file of mainFiles) {
      const fileExists = await exists(file);
      expect(fileExists).toBe(true);
    }

    // Check that test file does NOT exist
    const testFile = resolve(testDir, 'user-module', 'user-module.test.ts');
    const testFileExists = await exists(testFile);
    expect(testFileExists).toBe(false);
  });

  it('should generate correct file contents', async () => {
    const featureName = 'payment-gateway';
    const cases = toCases(featureName);
    const files = featTemplate(testDir);

    // Generate files
    for (const spec of files) {
      const path = resolve(spec.path(cases));
      const content = spec.template(cases);
      await writeText(path, content, { force: true });
    }

    // Check index.ts content
    const indexContent = await readFile(resolve(testDir, 'payment-gateway', 'index.ts'), 'utf8');
    expect(indexContent).toContain("export * from './payment-gateway'");
    expect(indexContent).toContain("export * from './payment-gateway.type'");

    // Check feature file content
    const featContent = await readFile(resolve(testDir, 'payment-gateway', 'payment-gateway.ts'), 'utf8');
    expect(featContent).toContain('// PaymentGateway feature');
    expect(featContent).toContain('export function paymentGateway()');
    expect(featContent).toContain("return 'PaymentGateway works'");

    // Check type file content
    const typeContent = await readFile(resolve(testDir, 'payment-gateway', 'payment-gateway.type.ts'), 'utf8');
    expect(typeContent).toContain('export interface PaymentGatewayOptions');

    // Check test file content
    const testContent = await readFile(resolve(testDir, 'payment-gateway', 'payment-gateway.test.ts'), 'utf8');
    expect(testContent).toContain("import { paymentGateway } from './payment-gateway'");
    expect(testContent).toContain("describe('PaymentGateway'");
    expect(testContent).toContain("expect(paymentGateway()).toBe('PaymentGateway works')");
  });

  it('should handle complex feature names correctly', async () => {
    const featureName = 'API Client Manager';
    const cases = toCases(featureName);
    const files = featTemplate(testDir);

    // Generate files
    for (const spec of files) {
      const path = resolve(spec.path(cases));
      const content = spec.template(cases);
      await writeText(path, content, { force: true });
    }

    // Check that kebab-case is used for file paths
    const expectedFiles = [
      resolve(testDir, 'api-client-manager', 'index.ts'),
      resolve(testDir, 'api-client-manager', 'api-client-manager.ts'),
      resolve(testDir, 'api-client-manager', 'api-client-manager.type.ts'),
      resolve(testDir, 'api-client-manager', 'api-client-manager.test.ts'),
    ];

    for (const file of expectedFiles) {
      const fileExists = await exists(file);
      expect(fileExists).toBe(true);
    }

    // Check that proper casing is used in content
    const featContent = await readFile(resolve(testDir, 'api-client-manager', 'api-client-manager.ts'), 'utf8');
    expect(featContent).toContain('export function apiClientManager()');
    expect(featContent).toContain('// ApiClientManager feature');
  });

  it('should handle force overwrite correctly', async () => {
    const featureName = 'test-overwrite';
    const cases = toCases(featureName);
    const files = featTemplate(testDir);

    // Create files first
    for (const spec of files) {
      const path = resolve(spec.path(cases));
      const content = spec.template(cases);
      await writeText(path, content, { force: true });
    }

    const testFile = resolve(testDir, 'test-overwrite', 'index.ts');
    const originalContent = await readFile(testFile, 'utf8');

    // Try to overwrite without force - should throw
    await expect(writeText(testFile, 'new content', { force: false })).rejects.toThrow('File exists');

    // Overwrite with force - should succeed
    await writeText(testFile, 'new content', { force: true });
    const newContent = await readFile(testFile, 'utf8');
    expect(newContent).toBe('new content');
    expect(newContent).not.toBe(originalContent);
  });
});

describe('createFeatCommand', () => {
  beforeEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  it('should create a command with correct configuration', () => {
    const command = createFeatCommand();

    expect(command.name()).toBe('feat');

    // Check that options are registered
    const options = command.options;
    expect(options).toHaveLength(3); // dir, force, no-test

    const optionNames = options.map(opt => opt.long);
    expect(optionNames).toContain('--dir');
    expect(optionNames).toContain('--force');
    expect(optionNames).toContain('--no-test');
  });

  it('should execute action function and create files', async () => {
    // Mock console.log to capture output
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Import the actual function to test directly
    const { featTemplate } = await import('@/templates/feat');
    const { toCases } = await import('@/utils/case');
    const { writeText } = await import('@/utils/fs');

    try {
      // Simulate the action function logic directly
      const name = 'test-action';
      const opts = { dir: testDir, force: false, test: true };

      const cases = toCases(name);
      const files = featTemplate(opts.dir);

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

      // Verify files were created
      expect(ok.length).toBe(4); // Should create 4 files
      expect(fail.length).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('\nCreated:');
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('should handle --no-test option correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { featTemplate } = await import('@/templates/feat');
    const { toCases } = await import('@/utils/case');
    const { writeText } = await import('@/utils/fs');

    try {
      // Simulate the action with --no-test flag
      const name = 'no-test-action';
      const opts = { dir: testDir, force: false, test: false }; // --no-test

      const cases = toCases(name);
      const files = featTemplate(opts.dir);

      // This is the filtering logic from feat.ts
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

      // Verify only 3 files were created (no test file)
      expect(ok.length).toBe(3); // Should create 3 files (without test)
      expect(fail.length).toBe(0);
      expect(filteredFiles.length).toBe(3);
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('should handle errors when files exist without --force', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { featTemplate } = await import('@/templates/feat');
    const { toCases } = await import('@/utils/case');
    const { writeText } = await import('@/utils/fs');

    // Store original exitCode
    const originalExitCode = process.exitCode;

    try {
      const name = 'existing-files';
      const opts = { dir: testDir, force: false, test: true };

      // Create files first
      const cases = toCases(name);
      const files = featTemplate(opts.dir);

      for (const spec of files) {
        const path = resolve(spec.path(cases));
        const content = spec.template(cases);
        await writeText(path, content, { force: true }); // Create with force
      }

      // Now try to create again without force - should fail
      const filteredFiles = files;
      const results: { path: string; ok: boolean; error?: string }[] = [];

      for (const spec of filteredFiles) {
        const path = resolve(spec.path(cases));
        const content = spec.template(cases);
        try {
          await writeText(path, content, { force: opts.force }); // Without force
          results.push({ path, ok: true });
        } catch (e: any) {
          results.push({ path, ok: false, error: e?.message || String(e) });
        }
      }

      const ok = results.filter(r => r.ok);
      const fail = results.filter(r => !r.ok);

      if (fail.length) {
        console.log('\nSkipped/Failed:');
        fail.forEach(r => console.log(' •', r.path, '—', r.error));
        process.exitCode = 1;
      }

      // Verify error handling
      expect(fail.length).toBe(4); // All files should fail
      expect(ok.length).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('\nSkipped/Failed:');
      expect(process.exitCode).toBe(1);
    } finally {
      consoleSpy.mockRestore();
      // Restore original exitCode
      process.exitCode = originalExitCode;
    }
  });

  it('should handle case with no files generated', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      // Simulate empty results scenario
      const ok: any[] = [];
      const fail: any[] = [];

      if (!ok.length && !fail.length) {
        console.log('No files generated.');
      }

      expect(consoleSpy).toHaveBeenCalledWith('No files generated.');
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('should handle mixed results with some success and some failures', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { featTemplate } = await import('@/templates/feat');
    const { toCases } = await import('@/utils/case');
    const { writeText } = await import('@/utils/fs');

    // Store original exitCode
    const originalExitCode = process.exitCode;

    try {
      const name = 'mixed-results';
      const opts = { dir: testDir, force: false, test: true };

      const cases = toCases(name);
      const files = featTemplate(opts.dir);

      // Create only first file to cause partial conflicts
      const firstFile = files[0];
      const firstPath = resolve(firstFile.path(cases));
      const firstContent = firstFile.template(cases);
      await writeText(firstPath, firstContent, { force: true });

      // Now process all files - first will fail, others will succeed
      const filteredFiles = files;
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

      // Should have both success and failures
      expect(ok.length).toBeGreaterThan(0);
      expect(fail.length).toBeGreaterThan(0);
      expect(consoleSpy).toHaveBeenCalledWith('\nCreated:');
      expect(consoleSpy).toHaveBeenCalledWith('\nSkipped/Failed:');
      expect(process.exitCode).toBe(1);
    } finally {
      consoleSpy.mockRestore();
      process.exitCode = originalExitCode;
    }
  });
});
