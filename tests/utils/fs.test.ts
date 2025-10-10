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
} from 'vitest';

import {
  ensureDir,
  exists,
  writeText,
} from '@/utils/fs';

const testDir = resolve('./test-temp');
const testFile = resolve(testDir, 'test.txt');

describe('fs utilities', () => {
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

  describe('exists', () => {
    it('should return false for non-existent file', async () => {
      const result = await exists(testFile);
      expect(result).toBe(false);
    });

    it('should return true for existing file', async () => {
      await ensureDir(testFile);
      await writeText(testFile, 'test content', { force: true });

      const result = await exists(testFile);
      expect(result).toBe(true);
    });
  });

  describe('ensureDir', () => {
    it('should create directory recursively', async () => {
      const nestedFile = resolve(testDir, 'nested', 'deep', 'file.txt');

      await ensureDir(nestedFile);

      const dirExists = await exists(resolve(testDir, 'nested', 'deep'));
      expect(dirExists).toBe(true);
    });
  });

  describe('writeText', () => {
    it('should write content to new file', async () => {
      const content = 'Hello, World!';

      await writeText(testFile, content);

      const writtenContent = await readFile(testFile, 'utf8');
      expect(writtenContent).toBe(content);
    });

    it("should create directories if they don't exist", async () => {
      const nestedFile = resolve(testDir, 'nested', 'file.txt');
      const content = 'Nested content';

      await writeText(nestedFile, content);

      const writtenContent = await readFile(nestedFile, 'utf8');
      expect(writtenContent).toBe(content);
    });

    it('should throw error if file exists and force is false', async () => {
      const content = 'Initial content';
      await writeText(testFile, content);

      await expect(writeText(testFile, 'New content', { force: false })).rejects.toThrow('File exists');
    });

    it('should overwrite file if force is true', async () => {
      const initialContent = 'Initial content';
      const newContent = 'New content';

      await writeText(testFile, initialContent);
      await writeText(testFile, newContent, { force: true });

      const writtenContent = await readFile(testFile, 'utf8');
      expect(writtenContent).toBe(newContent);
    });
  });
});
