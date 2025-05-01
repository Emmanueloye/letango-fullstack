export const formatNumber = (input: number) => {
  return new Intl.NumberFormat().format(input);
};

export const formatDate = (input: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).format(input);
};
