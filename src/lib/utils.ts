export function normalizeMath(content: string): string {
  if (!content) return ''
  return content
    .replace(/\\\s*\(/g, '$')
    .replace(/\\\s*\)/g, '$')
    .replace(/\\\s*\[/g, '$$')
    .replace(/\\\s*\]/g, '$$')
}
