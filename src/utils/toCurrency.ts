const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const toCurrency = (num: number | undefined | null) => {
  return formatter.format(num ?? 0);
};
