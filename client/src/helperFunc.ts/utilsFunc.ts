import { PAGE_SIZE } from '../Actions/constant';

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

export const formatDateWD = (input: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(input);
};

export const formatTime = (time: Date) => {
  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // or false for 24-hour format
  }).format(time);
};

export const paginate = (searchParams: URLSearchParams) => {
  // Get current page from search params.
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));

  // Set start and end index for slice
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = currentPage * PAGE_SIZE;

  return { currentPage, startIndex, endIndex };
};
