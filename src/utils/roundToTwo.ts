export function roundToTwo(num: number) {
  return +(Math.round((num + 'e+2') as any) + 'e-2');
}
