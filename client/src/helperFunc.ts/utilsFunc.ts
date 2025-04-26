export const formatNumber = (input: number) => {
  return new Intl.NumberFormat().format(input);
};
