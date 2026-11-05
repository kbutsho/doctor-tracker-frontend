export const cn = (...c) => c.filter(Boolean).join(' ');

export const formatDate = (d) =>
  d ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d)) : '—';

export const shortDate = (iso) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

export const initials = (name = '') =>
  name.replace(/^dr\.?\s+/i, '').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export const cleanParams = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined && v !== null));

export const getErrorMessage = (err) => {
  const data = err?.response?.data;
  if (data?.details?.length) return data.details.map((d) => `${d.field}: ${d.message}`).join(', ');
  return data?.message || err?.message || 'Something went wrong';
};
