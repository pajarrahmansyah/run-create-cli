import {
  describe,
  expect,
  it,
} from 'vitest';

import { featTemplate } from '@/templates/feat';
import { toCases } from '@/utils/case';

describe('featTemplate', () => {
  const mockCases = toCases('user auth');

  it('should generate 4 files by default', () => {
    const files = featTemplate();
    expect(files).toHaveLength(4);
  });

  it('should generate correct file paths', () => {
    const files = featTemplate();
    const paths = files.map(f => f.path(mockCases));

    expect(paths).toEqual([
      'src/user-auth/index.ts',
      'src/user-auth/user-auth.ts',
      'src/user-auth/user-auth.type.ts',
      'src/user-auth/user-auth.test.ts',
    ]);
  });

  it('should use custom base directory', () => {
    const files = featTemplate('lib');
    const paths = files.map(f => f.path(mockCases));

    expect(paths).toEqual([
      'lib/user-auth/index.ts',
      'lib/user-auth/user-auth.ts',
      'lib/user-auth/user-auth.type.ts',
      'lib/user-auth/user-auth.test.ts',
    ]);
  });

  describe('generated content', () => {
    it('should generate valid index.ts content', () => {
      const files = featTemplate();
      const indexFile = files[0];
      const content = indexFile.template(mockCases);

      expect(content).toContain("export * from './user-auth'");
      expect(content).toContain("export * from './user-auth.type'");
    });

    it('should generate valid feature implementation', () => {
      const files = featTemplate();
      const featFile = files[1];
      const content = featFile.template(mockCases);

      expect(content).toContain('// UserAuth feature');
      expect(content).toContain('export function userAuth()');
      expect(content).toContain("return 'UserAuth works'");
    });

    it('should generate valid type definitions', () => {
      const files = featTemplate();
      const typeFile = files[2];
      const content = typeFile.template(mockCases);

      expect(content).toContain('export interface UserAuthOptions');
      expect(content).toContain('// define options for UserAuth');
    });

    it('should generate valid test file', () => {
      const files = featTemplate();
      const testFile = files[3];
      const content = testFile.template(mockCases);

      expect(content).toContain("import { userAuth } from './user-auth'");
      expect(content).toContain("describe('UserAuth'");
      expect(content).toContain("expect(userAuth()).toBe('UserAuth works')");
    });
  });

  it('should handle single word names', () => {
    const singleWordCases = toCases('user');
    const files = featTemplate();
    const paths = files.map(f => f.path(singleWordCases));

    expect(paths).toEqual(['src/user/index.ts', 'src/user/user.ts', 'src/user/user.type.ts', 'src/user/user.test.ts']);
  });

  it('should handle complex names', () => {
    const complexCases = toCases('api-client-manager');
    const files = featTemplate();
    const paths = files.map(f => f.path(complexCases));

    expect(paths).toEqual([
      'src/api-client-manager/index.ts',
      'src/api-client-manager/api-client-manager.ts',
      'src/api-client-manager/api-client-manager.type.ts',
      'src/api-client-manager/api-client-manager.test.ts',
    ]);
  });
});
