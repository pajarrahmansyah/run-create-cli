import type { NameCases } from '@/utils/case';

export type FileSpec = {
  /** Absolute or relative to CWD */
  path: (name: NameCases) => string;
  /** Render file contents from resolved name cases */
  template: (name: NameCases) => string;
};

export const featTemplate = (baseDir = 'src') => {
  return [
    // index.ts
    {
      path: n => `${baseDir}/${n.kebab}/index.ts`,
      template: n => `export * from './${n.kebab}';\nexport * from './${n.kebab}.type';\n`,
    },
    // feature implementation
    {
      path: n => `${baseDir}/${n.kebab}/${n.kebab}.ts`,
      template: n =>
        `// ${n.pascal} feature\n\nexport function ${n.camel}() {\n // TODO: implement ${n.pascal}\n return '${n.pascal} works';\n}\n`,
    },
    // types
    {
      path: n => `${baseDir}/${n.kebab}/${n.kebab}.type.ts`,
      template: n => `export interface ${n.pascal}Options {\n // define options for ${n.pascal}\n}\n`,
    },
    // test (vitest style, but you can swap)
    {
      path: n => `${baseDir}/${n.kebab}/${n.kebab}.test.ts`,
      template: n =>
        `import { ${n.camel} } from './${n.kebab}';\n\ndescribe('${n.pascal}', () => {\n it('should work', () => {\n expect(${n.camel}()).toBe('${n.pascal} works');\n });\n});\n`,
    },
  ] satisfies FileSpec[];
};
