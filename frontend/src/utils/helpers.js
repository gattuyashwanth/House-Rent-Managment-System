export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const getPropertyImages = (property) => {
  if (property?.images?.length) return property.images;
  if (property?.image) return [property.image];
  return ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'];
};

export const normalizeRole = (role) => (role === 'user' ? 'owner' : role);

export const getDashboardPath = (role) => {
  const r = normalizeRole(role);
  return r === 'admin' ? '/admin/dashboard' : '/owner/dashboard';
};
