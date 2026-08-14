import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:8080/api'
  : '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ridego_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Initial Mock Dataset matching Spring Boot Entities & Showcase image
export const INITIAL_MOCK_VEHICLES = [
  {
    id: 1,
    brand: 'Royal Enfield',
    model: 'Classic 350',
    registrationNumber: 'KA01 AB1234',
    vehicleType: 'Cruiser',
    categoryName: 'Cruiser Bikes',
    categoryId: 2,
    engineCC: 350,
    fuelType: 'Petrol',
    transmission: 'Manual',
    manufacturingYear: 2023,
    color: 'Stealth Black',
    mileage: 35.0,
    pricePerHour: 80.0,
    pricePerDay: 799.0,
    securityDeposit: 2000.0,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    averageRating: 4.6,
    reviewCount: 128,
    locationName: 'Koramangala, Bengaluru',
    locationId: 1,
    description: 'The Royal Enfield Classic 350 is a timeless motorcycle with modern performance. Ideal for city cruises & weekend mountain rides.'
  },
  {
    id: 2,
    brand: 'Yamaha',
    model: 'R15 V4',
    registrationNumber: 'KA02 CD5678',
    vehicleType: 'Sports',
    categoryName: 'Sports Bikes',
    categoryId: 1,
    engineCC: 155,
    fuelType: 'Petrol',
    transmission: 'Manual',
    manufacturingYear: 2024,
    color: 'Racing Blue',
    mileage: 45.0,
    pricePerHour: 90.0,
    pricePerDay: 899.0,
    securityDeposit: 2500.0,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    averageRating: 4.7,
    reviewCount: 96,
    locationName: 'Indiranagar, Bengaluru',
    locationId: 2,
    description: 'The Yamaha R15 V4 delivers unmatched precision, track aerodynamic styling, and quick-shifter response for sport enthusiasts.'
  },
  {
    id: 3,
    brand: 'KTM',
    model: 'Duke 250',
    registrationNumber: 'KA03 EF9012',
    vehicleType: 'Sports',
    categoryName: 'Sports Bikes',
    categoryId: 1,
    engineCC: 250,
    fuelType: 'Petrol',
    transmission: 'Manual',
    manufacturingYear: 2023,
    color: 'Dark Galvano',
    mileage: 30.0,
    pricePerHour: 85.0,
    pricePerDay: 799.0,
    securityDeposit: 2000.0,
    imageUrl: 'https://images.unsplash.com/photo-1547549662-774120611251?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    averageRating: 4.5,
    reviewCount: 112,
    locationName: 'HSR Layout, Bengaluru',
    locationId: 3,
    description: 'Naked agility meets explosive power. The KTM Duke 250 offers crisp throttle response and lightweight street performance.'
  },
  {
    id: 4,
    brand: 'Honda',
    model: 'Activa 6G',
    registrationNumber: 'KA04 GH3456',
    vehicleType: 'Scooter',
    categoryName: 'Scooters',
    categoryId: 3,
    engineCC: 110,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    manufacturingYear: 2023,
    color: 'Matte Axis Grey',
    mileage: 50.0,
    pricePerHour: 50.0,
    pricePerDay: 499.0,
    securityDeposit: 1000.0,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    averageRating: 4.3,
    reviewCount: 172,
    locationName: 'Koramangala, Bengaluru',
    locationId: 1,
    description: 'India\'s favorite scooter. Easy maneuverability, telescopic suspension, and silent start for daily effortless commuting.'
  },
  {
    id: 5,
    brand: 'BMW',
    model: 'G 310 GS',
    registrationNumber: 'KA05 IJ7890',
    vehicleType: 'Adventure',
    categoryName: 'Adventure',
    categoryId: 4,
    engineCC: 313,
    fuelType: 'Petrol',
    transmission: 'Manual',
    manufacturingYear: 2024,
    color: 'Triple Black',
    mileage: 32.0,
    pricePerHour: 130.0,
    pricePerDay: 1299.0,
    securityDeposit: 3500.0,
    imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    averageRating: 4.9,
    reviewCount: 84,
    locationName: 'Whitefield, Bengaluru',
    locationId: 4,
    description: 'Unleash your adventure spirit with long suspension travel, comfortable ergonomics, and rugged endurance capability.'
  },
  {
    id: 6,
    brand: 'Ather',
    model: '450X Gen 3',
    registrationNumber: 'KA06 KL1234',
    vehicleType: 'Electric Scooter',
    categoryName: 'Scooters',
    categoryId: 3,
    engineCC: 0,
    fuelType: 'Electric',
    transmission: 'Automatic',
    manufacturingYear: 2024,
    color: 'Space Grey',
    mileage: 105.0, // range in km
    pricePerHour: 60.0,
    pricePerDay: 599.0,
    securityDeposit: 1500.0,
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE',
    averageRating: 4.8,
    reviewCount: 145,
    locationName: 'MG Road, Bengaluru',
    locationId: 5,
    description: 'High-tech electric smart scooter featuring Warp mode, touchscreen navigation, and zero emissions.'
  }
];

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Sports Bikes', count: 12, icon: 'Zap' },
  { id: 2, name: 'Cruiser Bikes', count: 18, icon: 'Compass' },
  { id: 3, name: 'Scooters', count: 25, icon: 'ShieldCheck' },
  { id: 4, name: 'Adventure', count: 15, icon: 'Navigation' }
];

export const MOCK_LOCATIONS = [
  { id: 1, name: 'Master Canteen, Bhubaneswar' },
  { id: 2, name: 'Patia, Bhubaneswar' },
  { id: 3, name: 'Saheed Nagar, Bhubaneswar' },
  { id: 4, name: 'KIIT Square, Bhubaneswar' },
  { id: 5, name: 'Khandagiri, Bhubaneswar' }
];

export const MOCK_BOOKINGS = [
  {
    id: 'BK1001',
    riderName: 'Rohan Kumar',
    phone: '+91 98765 43210',
    bikeName: 'Royal Enfield Classic 350',
    fromDate: '20 May 2025',
    toDate: '22 May 2025',
    status: 'CONFIRMED',
    amount: 3686,
    paymentStatus: 'PAID'
  },
  {
    id: 'BK1002',
    riderName: 'Anjali Singh',
    phone: '+91 98123 45678',
    bikeName: 'Yamaha R15 V4',
    fromDate: '21 May 2025',
    toDate: '24 May 2025',
    status: 'ACTIVE',
    amount: 5199,
    paymentStatus: 'PAID'
  },
  {
    id: 'BK1003',
    riderName: 'Waseem Naaz',
    phone: '+91 97654 32109',
    bikeName: 'KTM Duke 250',
    fromDate: '24 May 2025',
    toDate: '26 May 2025',
    status: 'COMPLETED',
    amount: 2499,
    paymentStatus: 'PAID'
  }
];

export const getAdminVehicles = async () => {
  try {
    const res = await apiClient.get('/admin/vehicles', { params: { size: 100 } });
    const payload = res.data?.data || res.data;
    if (payload && Array.isArray(payload.content)) {
      return payload.content;
    }
    if (Array.isArray(payload)) {
      return payload;
    }
    return res.data?.content || [];
  } catch (err) {
    console.error('Failed to fetch admin vehicles:', err);
    throw err;
  }
};

export const createAdminVehicle = async (vehiclePayload) => {
  const res = await apiClient.post('/admin/vehicles', vehiclePayload);
  return res.data?.data || res.data;
};

export const updateAdminVehicle = async (id, vehiclePayload) => {
  const res = await apiClient.put(`/admin/vehicles/${id}`, vehiclePayload);
  return res.data?.data || res.data;
};

export const deleteAdminVehicle = async (id) => {
  const res = await apiClient.delete(`/admin/vehicles/${id}`);
  return res.data?.data || res.data;
};

export const updateAdminVehicleStatus = async (id, status) => {
  const res = await apiClient.patch(`/admin/vehicles/${id}/status`, null, { params: { status } });
  return res.data?.data || res.data;
};

export const getVehicles = async (filters = {}) => {
  try {
    const res = await apiClient.get('/vehicles/search', { params: { size: 100, ...filters } });
    const payload = res.data?.data || res.data;
    const content = payload?.content || payload;
    if (Array.isArray(content) && content.length > 0) {
      return content;
    }
    const adminRes = await apiClient.get('/admin/vehicles', { params: { size: 100 } });
    const adminPayload = adminRes.data?.data || adminRes.data;
    return adminPayload?.content || adminPayload || [];
  } catch (err) {
    try {
      const adminRes = await apiClient.get('/admin/vehicles', { params: { size: 100 } });
      const adminPayload = adminRes.data?.data || adminRes.data;
      return adminPayload?.content || adminPayload || [];
    } catch (e) {
      console.error('Failed to fetch vehicles from PostgreSQL:', e);
      return [];
    }
  }
};

export const getVehicleById = async (id) => {
  try {
    const res = await apiClient.get(`/vehicles/${id}`);
    return res.data?.data || res.data;
  } catch (err) {
    try {
      const adminRes = await apiClient.get(`/admin/vehicles/${id}`);
      return adminRes.data?.data || adminRes.data;
    } catch (e) {
      console.error('Failed to fetch vehicle by ID:', e);
      return null;
    }
  }
};

export const createBooking = async (bookingPayload) => {
  try {
    const res = await apiClient.post('/user/bookings', bookingPayload);
    return res.data;
  } catch (err) {
    console.warn('Backend offline, returning mock confirmation');
    return {
      bookingId: 'BK' + Math.floor(1000 + Math.random() * 9000),
      status: 'CONFIRMED',
      totalAmount: bookingPayload.totalAmount || 3686,
      createdAt: new Date().toISOString()
    };
  }
};

export const loginUser = async (email, password) => {
  const cleanEmail = email ? email.trim() : '';
  const res = await apiClient.post('/auth/login', { email: cleanEmail, password });
  const payload = res.data?.data || res.data;
  const token = payload?.accessToken || payload?.token;
  const userData = payload?.user || payload;
  if (token) {
    localStorage.setItem('ridego_token', token);
    if (userData) {
      localStorage.setItem('ridego_user', JSON.stringify(userData));
    }
  }
  return { token, user: userData, raw: res.data };
};

export const registerUser = async (registerData) => {
  const cleanData = {
    ...registerData,
    email: registerData.email ? registerData.email.trim() : ''
  };
  const res = await apiClient.post('/auth/register', cleanData);
  const payload = res.data?.data || res.data;
  const token = payload?.accessToken || payload?.token;
  const userData = payload?.user || payload;
  if (token) {
    localStorage.setItem('ridego_token', token);
    if (userData) {
      localStorage.setItem('ridego_user', JSON.stringify(userData));
    }
  }
  return { token, user: userData, raw: res.data };
};

// Customer Profile APIs
export const getMyProfile = async () => {
  const res = await apiClient.get('/users/me');
  const profileData = res.data?.data || res.data;
  if (profileData && profileData.id) {
    localStorage.setItem('ridego_user', JSON.stringify(profileData));
  }
  return profileData;
};

export const updateMyProfile = async (profileData) => {
  const res = await apiClient.put('/users/me', profileData);
  const updated = res.data?.data || res.data;
  localStorage.setItem('ridego_user', JSON.stringify(updated));
  return updated;
};

export const updateEmail = async (email) => {
  const res = await apiClient.put('/users/me/email', { email });
  const updated = res.data?.data || res.data;
  localStorage.setItem('ridego_user', JSON.stringify(updated));
  return updated;
};

export const requestEmailChangeOtp = async (newEmail) => {
  const res = await apiClient.post('/users/me/email/change/request', { newEmail });
  return res.data;
};

export const verifyEmailChangeOtp = async (newEmail, otp) => {
  const res = await apiClient.post('/users/me/email/change/verify', { newEmail, otp });
  const updated = res.data?.data || res.data;
  if (updated && updated.email) {
    localStorage.setItem('ridego_user', JSON.stringify(updated));
  }
  return updated;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/users/me/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  const updated = res.data?.data || res.data;
  localStorage.setItem('ridego_user', JSON.stringify(updated));
  return updated;
};

export const deleteProfileImage = async () => {
  const res = await apiClient.delete('/users/me/profile-image');
  const updated = res.data?.data || res.data;
  localStorage.setItem('ridego_user', JSON.stringify(updated));
  return updated;
};

export const changePassword = async (passwordData) => {
  const res = await apiClient.put('/users/me/change-password', passwordData);
  return res.data;
};

export const getAdminDashboardStats = async () => {
  const res = await apiClient.get('/admin/dashboard/stats');
  return res.data?.data || res.data;
};

