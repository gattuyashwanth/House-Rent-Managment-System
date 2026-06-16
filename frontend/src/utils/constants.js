export const COLORS = {
  primary: '#0d6efd',
  success: '#198754',
  background: '#f8f9fa',
  text: '#212529',
};

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House', icon: 'house' },
  { value: 'apartment', label: 'Apartment', icon: 'apartment' },
  { value: 'villa', label: 'Villa', icon: 'villa' },
];

export const PROPERTY_STATUS = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'danger' },
  rented: { label: 'Rented', color: 'secondary' },
};

export const AMENITIES_LIST = [
  'Parking', 'WiFi', 'Swimming Pool', 'Gym', 'Security',
  'Air Conditioning', 'Furnished', 'Garden', 'Elevator', 'Pet Friendly',
];

export const ADMIN_EMAIL = 'gattuyashwanth22@gmail.com';

export const NAV_LINKS = {
  public: [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/owners', label: 'Manage Owners', icon: 'owners' },
    { path: '/admin/properties', label: 'Manage Properties', icon: 'properties' },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: 'reports' },
    { path: '/admin/settings', label: 'Settings', icon: 'settings' },
  ],
  owner: [
    { path: '/owner/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/owner/add-property', label: 'Add Property', icon: 'add' },
    { path: '/owner/my-properties', label: 'My Properties', icon: 'properties' },
    { path: '/owner/profile', label: 'Profile', icon: 'profile' },
    { path: '/owner/settings', label: 'Settings', icon: 'settings' },
  ],
};
