import {
  access,
  mkdir,
  writeFile,
} from 'node:fs/promises';
import { dirname } from 'node:path';

export async function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
}

export async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeText(path: string, content: string, { force = false } = {}) {
  if (!force && (await exists(path))) {
    throw new Error(`File exists: ${path}. Use --force to overwrite.`);
  }
  await ensureDir(path);
  await writeFile(path, content, 'utf8');
}
