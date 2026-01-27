export function dedent(str: string): string {
  // Remove first line if empty (caused by backtick starting on new line)
  const string = str.replace(/^\n/, '');

  // Find the smallest indentation (spaces)
  const match = string.match(/^\s+(?=\S)/gm);
  const indent = match ? Math.min(...match.map((el) => el.length)) : 0;

  // Remove that indentation from every line
  const regex = new RegExp(`^\\s{${indent}}`, 'gm');
  return string.replace(regex, '');
}
