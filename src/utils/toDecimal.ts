export function toDecimal(s: string | undefined): number | undefined {
  if (!s) {
    return undefined;
  }

  const n = parseFloat(s);

  return Number.isNaN(n) ? undefined : n;
}
