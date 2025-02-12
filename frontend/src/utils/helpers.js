export const formatPrice = (price) =>
  `LKR ${parseFloat(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

export const getDiscount = (price, salePrice) =>
  salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

export const truncate = (str, n) => (str?.length > n ? str.slice(0, n) + '...' : str);

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const getStarArray = (rating) =>
  Array.from({ length: 5 }, (_, i) => (i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty'));
