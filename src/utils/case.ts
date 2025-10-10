export type NameCases = {
  raw: string;
  pascal: string;
  camel: string;
  kebab: string;
  snake: string;
};

const toWords = (s: string) =>
  s
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/);

const capitalize = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export function toCases(input: string): NameCases {
  const words = toWords(input.toString());
  const lower = words.map(w => w.toLowerCase());
  const pascal = lower.map(capitalize).join('');
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  const kebab = lower.join('-');
  const snake = lower.join('_');
  return { raw: input, pascal, camel, kebab, snake };
}
