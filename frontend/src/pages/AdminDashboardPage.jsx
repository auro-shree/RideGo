import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Bike, Calendar, Users, CreditCard, MapPin, 
  Wrench, Ticket, TrendingUp, Plus, CheckCircle, Clock, AlertTriangle, 
  Search, ShieldCheck, X, Eye, Edit, Trash2, Image as ImageIcon,
  RotateCcw, Star, Bell, FileText, SlidersHorizontal, LogOut, Check,
  ChevronDown, Sun, Moon, BarChart3, RefreshCw, Layers, ArrowUpRight, ArrowDownRight, Menu,
  Download, Filter, Send, Settings as SettingsIcon, ShieldAlert, Sparkles, FileSpreadsheet,
  ChevronRight, CalendarDays, Activity, PieChart, AlertCircle
} from 'lucide-react';
import { 
  getAdminDashboardStats, 
  getAdminVehicles, 
  createAdminVehicle, 
  updateAdminVehicle, 
  deleteAdminVehicle, 
  updateAdminVehicleStatus, 
  MOCK_BOOKINGS 
} from '../services/api';
import VehiclePhotoManager from '../components/VehiclePhotoManager';

const PRESET_BIKE_IMAGES = [
  { name: 'Classic Black Cruiser', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Racing Blue Superbike', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80' },
  { name: 'Naked Dark KTM', url: 'https://images.unsplash.com/photo-1547549662-774120611251?auto=format&fit=crop&w=800&q=80' },
  { name: 'Red Urban Scooter', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Adventure Touring Bike', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80' },
  { name: 'Electric Smart Scooter', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80' }
];

// Rich Data Collections for Operational Tabs
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Rohit Sharma', email: 'rohit.sharma@example.com', phone: '+91 98765 43210', role: 'ROLE_USER', joined: 'May 10, 2025', bookingsCount: 4, status: 'ACTIVE' },
  { id: 2, name: 'Priya Singh', email: 'priya.singh@example.com', phone: '+91 91234 56789', role: 'ROLE_USER', joined: 'May 12, 2025', bookingsCount: 2, status: 'ACTIVE' },
  { id: 3, name: 'Amit Kumar', email: 'amit.kumar@example.com', phone: '+91 99887 76655', role: 'ROLE_USER', joined: 'May 14, 2025', bookingsCount: 1, status: 'ACTIVE' },
  { id: 4, name: 'Neha Patel', email: 'neha.patel@example.com', phone: '+91 97766 55443', role: 'ROLE_USER', joined: 'May 15, 2025', bookingsCount: 3, status: 'ACTIVE' },
  { id: 5, name: 'Super Admin', email: 'admin@ridego.com', phone: '+91 90000 00000', role: 'ROLE_ADMIN', joined: 'May 01, 2025', bookingsCount: 0, status: 'ACTIVE' }
];

const INITIAL_PAYMENTS = [
  { id: 'TXN-9021', bookingId: 'RG1250', customer: 'Rohit Sharma', amount: 1598, method: 'Razorpay UPI', status: 'SUCCESS', date: 'May 18, 2025 10:30 AM' },
  { id: 'TXN-9022', bookingId: 'RG1249', customer: 'Priya Singh', amount: 899, method: 'Credit Card', status: 'SUCCESS', date: 'May 19, 2025 11:15 AM' },
  { id: 'TXN-9023', bookingId: 'RG1248', customer: 'Amit Kumar', amount: 1347, method: 'Net Banking', status: 'SUCCESS', date: 'May 20, 2025 09:45 AM' },
  { id: 'TXN-9024', bookingId: 'RG1247', customer: 'Neha Patel', amount: 799, method: 'PhonePe UPI', status: 'REFUNDED', date: 'May 20, 2025 02:20 PM' }
];

const INITIAL_REFUNDS = [
  { id: 'REF-101', bookingId: 'RG1250', customer: 'Rohit Sharma', amount: 2000, reason: 'Security Deposit Refund', status: 'COMPLETED', date: 'May 19, 2025' },
  { id: 'REF-102', bookingId: 'RG1247', customer: 'Neha Patel', amount: 799, reason: 'Trip Cancellation Refund', status: 'PROCESSING', date: 'May 20, 2025' }
];

const INITIAL_MAINTENANCE = [
  { id: 'MNT-401', bikeName: 'Royal Enfield Classic 350', regNo: 'KA01 AB1234', serviceType: 'Routine Oil & Filter Change', cost: 1200, mechanic: 'Speed Moto Care', status: 'COMPLETED', date: 'May 15, 2025' },
  { id: 'MNT-402', bikeName: 'KTM Duke 250', regNo: 'KA03 EF9012', serviceType: 'Chain Drive Lube & Brake Adjustment', cost: 850, mechanic: 'ProBike Hub', status: 'IN_PROGRESS', date: 'May 20, 2025' }
];

const INITIAL_COUPONS = [
  { id: 1, code: 'WELCOME100', discount: 'Flat ₹100 OFF', type: 'FLAT', value: 100, validTill: 'Dec 31, 2025', usageCount: 42, status: 'ACTIVE' },
  { id: 2, code: 'RIDEGO20', discount: '20% OFF', type: 'PERCENT', value: 20, validTill: 'Nov 30, 2025', usageCount: 18, status: 'ACTIVE' },
  { id: 3, code: 'SUMMERBIKE', discount: 'Flat ₹200 OFF', type: 'FLAT', value: 200, validTill: 'Jun 30, 2025', usageCount: 9, status: 'ACTIVE' }
];

const INITIAL_REVIEWS = [
  { id: 1, customer: 'Rohit Sharma', bikeName: 'Royal Enfield Classic 350', rating: 5, comment: 'Pristine condition bike! Engine was super smooth for my Nandi Hills trip.', date: 'May 19, 2025', status: 'PUBLISHED' },
  { id: 2, customer: 'Priya Singh', bikeName: 'Yamaha R15 V4', rating: 5, comment: 'Great mileage and throttle response. Pickup location staff was very polite.', date: 'May 20, 2025', status: 'PUBLISHED' },
  { id: 3, customer: 'Amit Kumar', bikeName: 'Honda Activa 6G', rating: 4, comment: 'Clean scooter with extra helmet. Very easy self-drive rental process.', date: 'May 20, 2025', status: 'PUBLISHED' }
];

const INITIAL_LOCATIONS = [
  { id: 1, name: 'Master Canteen Station', city: 'Bhubaneswar', address: 'Plot 104, Station Square', capacity: 25, activeBikes: 7, phone: '+91 98765 00001', status: 'OPEN' },
  { id: 2, name: 'Koramangala Hub', city: 'Bengaluru', address: '80 Feet Road, 4th Block', capacity: 30, activeBikes: 12, phone: '+91 98765 00002', status: 'OPEN' },
  { id: 3, name: 'Indiranagar Metro Drop', city: 'Bengaluru', address: '100 Feet Road, Near Metro', capacity: 20, activeBikes: 5, phone: '+91 98765 00003', status: 'OPEN' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Weekend Special Discount', text: 'Use code RIDEGO20 for 20% flat discount on all cruiser bikes this weekend!', audience: 'ALL_CUSTOMERS', sentAt: 'May 18, 2025 09:00 AM', status: 'SENT' },
  { id: 2, title: 'Helmet Safety Reminder', text: 'Always wear a ISI certified helmet during your RideGo rental trip.', audience: 'ACTIVE_RENTERS', sentAt: 'May 19, 2025 02:30 PM', status: 'SENT' }
];

const INITIAL_INVOICES = [
  { id: 'INV-2025-01', bookingId: 'RG1250', customer: 'Rohit Sharma', baseFare: 1354.24, gstTax: 243.76, total: 1598.00, status: 'PAID', date: 'May 18, 2025' },
  { id: 'INV-2025-02', bookingId: 'RG1249', customer: 'Priya Singh', baseFare: 761.86, gstTax: 137.14, total: 899.00, status: 'PAID', date: 'May 19, 2025' },
  { id: 'INV-2025-03', bookingId: 'RG1248', customer: 'Amit Kumar', baseFare: 1141.52, gstTax: 205.48, total: 1347.00, status: 'PAID', date: 'May 20, 2025' }
];

export default function AdminDashboardPage({ currentUser, onLogout, onExitAdmin }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ridego_admin_theme') || 'light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Backend Stats State
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Fleet management state
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState(null);

  // Chart view state
  const [revenueTimeframe, setRevenueTimeframe] = useState('thisWeek');

  // Modals state
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);
  const [vehicleSubmitError, setVehicleSubmitError] = useState(null);

  // Dynamic operational state
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS);
  const [maintenance, setMaintenance] = useState(INITIAL_MAINTENANCE);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  // Sub-modals
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'FLAT', value: 100, validTill: '2025-12-31' });
  const [newLocation, setNewLocation] = useState({ name: '', city: 'Bengaluru', address: '', capacity: 20 });
  const [newMaintenance, setNewMaintenance] = useState({ bikeName: '', serviceType: '', cost: 1000, mechanic: 'ProBike Hub' });
  const [newNotification, setNewNotification] = useState({ title: '', text: '', audience: 'ALL_CUSTOMERS' });

  const [settings, setSettings] = useState({
    platformName: 'RideGo Bike Rentals',
    supportEmail: 'support@ridego.com',
    supportPhone: '+91 1800 123 4567',
    taxGstRate: 18,
    defaultDeposit: 2000,
    autoApproveBookings: true
  });

  const [formVehicle, setFormVehicle] = useState({
    brand: '',
    model: '',
    registrationNumber: '',
    categoryName: 'Sports Bikes',
    categoryId: 1,
    locationId: 1,
    engineCC: 150,
    fuelType: 'Petrol',
    transmission: 'Manual',
    pricePerDay: 799,
    securityDeposit: 2000,
    imageUrl: PRESET_BIKE_IMAGES[0].url,
    status: 'AVAILABLE'
  });

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('ridego_admin_theme', newTheme);
  };

  const fetchStats = async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setStatsError(err.response?.data?.message || 'Unable to load dashboard data from backend server.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchVehicles = async () => {
    setIsLoadingVehicles(true);
    setVehicleError(null);
    try {
      const data = await getAdminVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to fetch admin vehicles:', err);
      setVehicleError(err.response?.data?.message || 'Unable to load vehicle fleet from PostgreSQL.');
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setVehicleSubmitError(null);
    setFormVehicle({
      brand: '',
      model: '',
      registrationNumber: '',
      categoryName: 'Sports Bikes',
      categoryId: 1,
      locationId: 1,
      engineCC: 150,
      fuelType: 'Petrol',
      transmission: 'Manual',
      pricePerDay: 799,
      securityDeposit: 2000,
      imageUrl: PRESET_BIKE_IMAGES[0].url,
      status: 'AVAILABLE'
    });
    setShowAddVehicleModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVehicle(v);
    setVehicleSubmitError(null);
    setFormVehicle({ ...v });
    setShowAddVehicleModal(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    setIsSubmittingVehicle(true);
    setVehicleSubmitError(null);
    try {
      const payload = {
        brand: formVehicle.brand,
        model: formVehicle.model,
        registrationNumber: formVehicle.registrationNumber || undefined,
        vehicleType: formVehicle.vehicleType || formVehicle.categoryName || 'Motorcycle',
        engineCC: Number(formVehicle.engineCC) || 150,
        fuelType: formVehicle.fuelType || 'Petrol',
        transmission: formVehicle.transmission || 'Manual',
        manufacturingYear: Number(formVehicle.manufacturingYear) || 2023,
        color: formVehicle.color || 'Black',
        mileage: Number(formVehicle.mileage) || 40.0,
        pricePerHour: Number(formVehicle.pricePerHour) || Math.max(50, Math.round((Number(formVehicle.pricePerDay) || 799) / 8)),
        pricePerDay: Number(formVehicle.pricePerDay) || 799,
        securityDeposit: Number(formVehicle.securityDeposit) || 2000,
        imageUrl: formVehicle.imageUrl || PRESET_BIKE_IMAGES[0].url,
        status: formVehicle.status || 'AVAILABLE',
        categoryId: Number(formVehicle.categoryId) || 1,
        categoryName: formVehicle.categoryName || 'Sports Bikes',
        locationId: Number(formVehicle.locationId) || 1
      };

      if (editingVehicle && editingVehicle.id) {
        await updateAdminVehicle(editingVehicle.id, payload);
      } else {
        await createAdminVehicle(payload);
      }

      setShowAddVehicleModal(false);
      await fetchVehicles();
      fetchStats();
    } catch (err) {
      console.error('Failed to save vehicle:', err);
      setVehicleSubmitError(err.response?.data?.message || 'Unable to save vehicle to database. Please try again.');
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await updateAdminVehicleStatus(vehicleId, newStatus);
      await fetchVehicles();
      fetchStats();
    } catch (err) {
      console.error('Failed to update vehicle status:', err);
      alert(err.response?.data?.message || 'Failed to update vehicle status.');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to deactivate this vehicle in PostgreSQL?')) return;
    try {
      await deleteAdminVehicle(vehicleId);
      await fetchVehicles();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      alert(err.response?.data?.message || 'Failed to deactivate vehicle.');
    }
  };

  const handleToggleCustomerStatus = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : c));
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    setCoupons(prev => [
      {
        id: Date.now(),
        code: newCoupon.code.toUpperCase(),
        discount: newCoupon.type === 'FLAT' ? `Flat ₹${newCoupon.value} OFF` : `${newCoupon.value}% OFF`,
        type: newCoupon.type,
        value: Number(newCoupon.value),
        validTill: newCoupon.validTill,
        usageCount: 0,
        status: 'ACTIVE'
      },
      ...prev
    ]);
    setShowCouponModal(false);
    setNewCoupon({ code: '', type: 'FLAT', value: 100, validTill: '2025-12-31' });
  };

  const handleCreateLocation = (e) => {
    e.preventDefault();
    setLocations(prev => [
      {
        id: Date.now(),
        name: newLocation.name,
        city: newLocation.city,
        address: newLocation.address,
        capacity: Number(newLocation.capacity),
        activeBikes: 0,
        phone: '+91 98765 00099',
        status: 'OPEN'
      },
      ...prev
    ]);
    setShowLocationModal(false);
    setNewLocation({ name: '', city: 'Bengaluru', address: '', capacity: 20 });
  };

  const handleCreateMaintenance = (e) => {
    e.preventDefault();
    setMaintenance(prev => [
      {
        id: `MNT-${Date.now().toString().slice(-3)}`,
        bikeName: newMaintenance.bikeName || 'Royal Enfield Classic 350',
        regNo: 'KA01 AB1234',
        serviceType: newMaintenance.serviceType,
        cost: Number(newMaintenance.cost),
        mechanic: newMaintenance.mechanic,
        status: 'IN_PROGRESS',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
      ...prev
    ]);
    setShowMaintenanceModal(false);
    setNewMaintenance({ bikeName: '', serviceType: '', cost: 1000, mechanic: 'ProBike Hub' });
  };

  const handleCreateNotification = (e) => {
    e.preventDefault();
    setNotifications(prev => [
      {
        id: Date.now(),
        title: newNotification.title,
        text: newNotification.text,
        audience: newNotification.audience,
        sentAt: 'Just now',
        status: 'SENT'
      },
      ...prev
    ]);
    setShowNotificationModal(false);
    setNewNotification({ title: '', text: '', audience: 'ALL_CUSTOMERS' });
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles Fleet', icon: Bike },
    { id: 'photos', label: 'Vehicle Photos', icon: ImageIcon },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'refunds', label: 'Refunds', icon: RotateCcw },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal }
  ];

  // Theme-dependent colors
  const isDark = theme === 'dark';
  const styles = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    cardBg: isDark ? '#1E293B' : '#FFFFFF',
    border: isDark ? '#334155' : '#E2E8F0',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    hoverBg: isDark ? '#334155' : '#F1F5F9'
  };

  // Helper formatting for currency
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    const num = Number(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const cleanGrowthText = (val, defaultVal) => {
    const raw = val || defaultVal || '';
    return raw.replace(/^[↑↗\s]+/, '');
  };

  // Weekly Revenue SVG Line Points calculation
  const weeklyChartPointsThisWeek = [45, 65, 55, 80, 70, 95, 85];
  const weeklyChartPointsLastWeek = [35, 50, 45, 60, 55, 75, 65];

  const createSvgPath = (points) => {
    return points.map((p, i) => {
      const x = 30 + i * 85;
      const y = 160 - (p / 100) * 130;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const thisWeekPath = useMemo(() => createSvgPath(weeklyChartPointsThisWeek), []);
  const lastWeekPath = useMemo(() => createSvgPath(weeklyChartPointsLastWeek), []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: styles.bg, color: styles.textPrimary, fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.2s ease-in-out',
        borderRight: '1px solid #1E293B'
      }} className="admin-sidebar">
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#FFB800', color: '#000000', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(255,184,0,0.25)' }}>
              R
            </div>
            <div>
              <div style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>RideGo</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.06em' }}>SUPER ADMIN PORTAL</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }} className="mobile-only">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', padding: '0.5rem 0.75rem', letterSpacing: '0.08em' }}>MAIN NAVIGATION</div>
          {sidebarItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#FFB800' : 'transparent',
                  color: isActive ? '#000000' : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginBottom: '0.2rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#000000' : '#94A3B8'} />
                {item.label}
              </button>
            );
          })}

          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', padding: '1rem 0.75rem 0.5rem', letterSpacing: '0.08em' }}>OPERATIONS & FINANCE</div>
          {sidebarItems.slice(5, 11).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#FFB800' : 'transparent',
                  color: isActive ? '#000000' : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginBottom: '0.2rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#000000' : '#94A3B8'} />
                {item.label}
              </button>
            );
          })}

          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', padding: '1rem 0.75rem 0.5rem', letterSpacing: '0.08em' }}>SYSTEM & REPORTS</div>
          {sidebarItems.slice(11).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#FFB800' : 'transparent',
                  color: isActive ? '#000000' : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginBottom: '0.2rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#000000' : '#94A3B8'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer Admin User Profile Card */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1E293B', backgroundColor: '#090D16' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB800', fontWeight: 700, flexShrink: 0 }}>
                {currentUser?.firstName ? currentUser.firstName[0] : 'A'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || currentUser?.firstName || 'Super Admin'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.email || 'admin@ridego.com'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <button 
              onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
              style={{
                padding: '0.35rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid #1E293B',
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              {isDark ? <Sun size={13} color="#FFB800" /> : <Moon size={13} />} {isDark ? 'Light' : 'Dark'}
            </button>

            <button 
              onClick={onExitAdmin}
              style={{
                padding: '0.35rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid #1E293B',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Exit
            </button>
          </div>

          <button 
            onClick={onLogout}
            style={{
              width: '100%',
              marginTop: '0.4rem',
              padding: '0.4rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#EF444420',
              color: '#EF4444',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <LogOut size={14} /> Admin Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main">
        {/* Top Header */}
        <header style={{
          height: '70px',
          backgroundColor: styles.cardBg,
          borderBottom: `1px solid ${styles.border}`,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          padding: '0 1.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: styles.textPrimary, cursor: 'pointer' }} className="mobile-only">
              <Menu size={22} />
            </button>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: styles.textSecondary }} />
              <input 
                type="text" 
                placeholder="Search fleet, bookings, users..." 
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                  borderRadius: '8px',
                  border: `1px solid ${styles.border}`,
                  backgroundColor: styles.bg,
                  color: styles.textPrimary,
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: styles.bg, border: `1px solid ${styles.border}`, padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: styles.textSecondary }}>
              <CalendarDays size={14} color="#FFB800" />
              <span>May 11 – May 17, 2025</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isDark ? '#064E3B' : '#ECFDF5', border: `1px solid ${isDark ? '#047857' : '#A7F3D0'}`, color: isDark ? '#A7F3D0' : '#047857', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }}></span>
              System Online <code style={{ fontSize: '0.75rem', opacity: 0.8 }}>(PostgreSQL ridego_db)</code>
            </div>
          </div>
        </header>

        {/* Dashboard Work Area */}
        <main style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
          {/* Top Welcome Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: styles.textPrimary, letterSpacing: '-0.02em', margin: 0 }}>
                Welcome back, Super Admin! 👋
              </h1>
              <p style={{ fontSize: '0.88rem', color: styles.textSecondary, marginTop: '0.25rem', margin: 0 }}>
                Here's what's happening with your RideGo platform today. Connected to PostgreSQL <code style={{ color: '#FFB800' }}>ridego_db</code>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => { fetchStats(); fetchVehicles(); }} 
                className="btn btn-outline btn-sm"
                style={{ borderColor: styles.border, color: styles.textPrimary, backgroundColor: styles.cardBg, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} className={(isLoadingStats || isLoadingVehicles) ? 'spin' : ''} /> Refresh Data
              </button>
              {activeTab === 'vehicles' && (
                <button onClick={handleOpenAdd} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none' }}>
                  <Plus size={16} /> Add Vehicle
                </button>
              )}
              {activeTab === 'coupons' && (
                <button onClick={() => setShowCouponModal(true)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none' }}>
                  <Plus size={16} /> Create Coupon
                </button>
              )}
            </div>
          </div>

          {/* Error Banner State */}
          {(statsError || vehicleError) && (
            <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertCircle size={18} />
                <span>Unable to load dashboard data. {statsError || vehicleError}</span>
              </div>
              <button onClick={() => { fetchStats(); fetchVehicles(); }} className="btn btn-sm" style={{ backgroundColor: '#991B1B', color: '#FFF', border: 'none' }}>
                Retry Connection
              </button>
            </div>
          )}

          {/* DASHBOARD TAB OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* 4 Top KPI Cards */}
              <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.75rem' }} className="grid-4">
                {/* KPI CARD 1: Total Fleet Vehicles */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: styles.textSecondary }}>Total Fleet Vehicles</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isDark ? '#FFB80020' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bike size={22} color="#FFB800" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: styles.textPrimary, marginBottom: '0.35rem' }}>
                    {isLoadingVehicles ? '...' : vehicles.length}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#10B981', fontWeight: 700, backgroundColor: isDark ? '#064E3B40' : '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    <TrendingUp size={13} /> +12.4% this month
                  </div>
                </div>

                {/* KPI CARD 2: Active Rental Bookings */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: styles.textSecondary }}>Active Bookings</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isDark ? '#10B98120' : '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarDays size={22} color="#10B981" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: styles.textPrimary, marginBottom: '0.35rem' }}>
                    {isLoadingStats ? '...' : (stats?.activeBookings ?? 142).toLocaleString()}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#10B981', fontWeight: 700, backgroundColor: isDark ? '#064E3B40' : '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    <TrendingUp size={13} /> {cleanGrowthText(stats?.bookingGrowth, '+8.3% vs last week')}
                  </div>
                </div>

                {/* KPI CARD 3: Total Registered Customers */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: styles.textSecondary }}>Registered Customers</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isDark ? '#3B82F620' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={22} color="#3B82F6" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: styles.textPrimary, marginBottom: '0.35rem' }}>
                    {isLoadingStats ? '...' : (stats?.totalUsers ?? 5842).toLocaleString()}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#10B981', fontWeight: 700, backgroundColor: isDark ? '#064E3B40' : '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    <TrendingUp size={13} /> {cleanGrowthText(stats?.customerGrowth, '+18.7% vs last week')}
                  </div>
                </div>

                {/* KPI CARD 4: Monthly Revenue */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: styles.textSecondary }}>Monthly Revenue</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isDark ? '#8B5CF620' : '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={22} color="#8B5CF6" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: styles.textPrimary, marginBottom: '0.35rem' }}>
                    {isLoadingStats ? '...' : formatCurrency(stats?.monthlyRevenue ?? 2485000)}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#10B981', fontWeight: 700, backgroundColor: isDark ? '#064E3B40' : '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    <TrendingUp size={13} /> {cleanGrowthText(stats?.revenueGrowth, '+21.4% vs last week')}
                  </div>
                </div>
              </div>

              {/* REVENUE OVERVIEW & BOOKINGS OVERVIEW ROW */}
              <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.75rem' }} className="grid-2">
                {/* Revenue Overview SVG Line/Area Chart */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Revenue Overview</h3>
                      <p style={{ fontSize: '0.78rem', color: styles.textSecondary, margin: '0.15rem 0 0' }}>Daily revenue performance comparison (Mon–Sun)</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: styles.textSecondary }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFB800', display: 'inline-block' }}></span> This Week
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: styles.textSecondary }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'inline-block' }}></span> Last Week
                      </div>
                    </div>
                  </div>

                  <div style={{ height: '220px', position: 'relative', width: '100%' }}>
                    <svg width="100%" height="100%" viewBox="0 0 560 180" preserveAspectRatio="none">
                      {/* Horizontal Grid lines */}
                      <line x1="20" y1="30" x2="540" y2="30" stroke={styles.border} strokeDasharray="3 3" />
                      <line x1="20" y1="80" x2="540" y2="80" stroke={styles.border} strokeDasharray="3 3" />
                      <line x1="20" y1="130" x2="540" y2="130" stroke={styles.border} strokeDasharray="3 3" />

                      {/* Last Week Line */}
                      <path d={lastWeekPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.75" />

                      {/* This Week Line */}
                      <path d={thisWeekPath} fill="none" stroke="#FFB800" strokeWidth="3.5" />
                    </svg>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem', fontSize: '0.75rem', color: styles.textSecondary, marginTop: '0.5rem', fontWeight: 600 }}>
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Bookings Overview Donut Chart */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: styles.textPrimary, margin: '0 0 0.2rem' }}>Bookings Overview</h3>
                  <p style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '1.25rem' }}>Reservation status breakdown</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '0 auto 1.25rem', width: '140px', height: '140px' }}>
                    <svg width="140" height="140" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={styles.bg} strokeWidth="3.8" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 14.5 22.5" fill="none" stroke="#10B981" strokeWidth="3.8" strokeDasharray="67.6, 100" />
                      <path d="M32.5 24.5845 a 15.9155 15.9155 0 0 1 -14.5 9.3" fill="none" stroke="#3B82F6" strokeWidth="3.8" strokeDasharray="19.9, 100" />
                      <path d="M18 33.9155 a 15.9155 15.9155 0 0 1 -13.5 -8.0" fill="none" stroke="#EF4444" strokeWidth="3.8" strokeDasharray="9.0, 100" />
                      <path d="M4.5 25.9155 a 15.9155 15.9155 0 0 1 13.5 -23.831" fill="none" stroke="#FFB800" strokeWidth="3.8" strokeDasharray="3.5, 100" />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: styles.textPrimary }}>1,248</div>
                      <div style={{ fontSize: '0.68rem', color: styles.textSecondary, fontWeight: 700 }}>Total</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                      <span style={{ color: styles.textSecondary }}>Completed: <strong style={{ color: styles.textPrimary }}>842</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></span>
                      <span style={{ color: styles.textSecondary }}>Ongoing: <strong style={{ color: styles.textPrimary }}>248</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
                      <span style={{ color: styles.textSecondary }}>Cancelled: <strong style={{ color: styles.textPrimary }}>112</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFB800' }}></span>
                      <span style={{ color: styles.textSecondary }}>Upcoming: <strong style={{ color: styles.textPrimary }}>46</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP PERFORMING VEHICLES & PLATFORM ACTIVITY ROW */}
              <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.75rem' }} className="grid-2">
                {/* Top Performing Vehicles */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Top Performing Vehicles</h3>
                    <button onClick={() => setActiveTab('vehicles')} style={{ background: 'none', border: 'none', color: '#FFB800', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                      View All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { name: 'Royal Enfield Classic 350', revenue: '₹1.25L Revenue', growth: '+24.5%', img: PRESET_BIKE_IMAGES[0].url },
                      { name: 'Yamaha R15 V4', revenue: '₹98,500 Revenue', growth: '+18.7%', img: PRESET_BIKE_IMAGES[1].url },
                      { name: 'Honda Activa 6G', revenue: '₹72,300 Revenue', growth: '+15.3%', img: PRESET_BIKE_IMAGES[3].url },
                      { name: 'KTM Duke 250', revenue: '₹65,200 Revenue', growth: '+12.1%', img: PRESET_BIKE_IMAGES[2].url }
                    ].map((v, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: styles.bg, borderRadius: '12px', border: `1px solid ${styles.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img src={v.img} alt={v.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: styles.textPrimary }}>{v.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#FFB800', fontWeight: 700 }}>{v.revenue}</div>
                          </div>
                        </div>
                        <div style={{ backgroundColor: isDark ? '#064E3B40' : '#ECFDF5', color: '#10B981', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                          {v.growth}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Activity Feed */}
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Platform Activity</h3>
                    <button style={{ background: 'none', border: 'none', color: '#FFB800', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                      View All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { icon: Users, color: '#3B82F6', title: 'New customer registered', desc: 'Vikram Singh joined RideGo', time: '2m ago' },
                      { icon: Calendar, color: '#FFB800', title: 'New booking created', desc: 'Booking #RG1250 has been created', time: '8m ago' },
                      { icon: CreditCard, color: '#10B981', title: 'Payment received', desc: 'Payment of ₹1,598 received', time: '15m ago' },
                      { icon: Bike, color: '#8B5CF6', title: 'Vehicle added', desc: 'New vehicle KTM Duke 250 added', time: '30m ago' },
                      { icon: Star, color: '#F59E0B', title: 'Review received', desc: 'New 5-star review for Royal Enfield 350', time: '1h ago' }
                    ].map((act, idx) => {
                      const IconComp = act.icon;
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: `${act.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <IconComp size={16} color={act.color} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: styles.textPrimary }}>{act.title}</div>
                            <div style={{ fontSize: '0.75rem', color: styles.textSecondary }}>{act.desc}</div>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: styles.textSecondary, fontWeight: 600 }}>{act.time}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RECENT BOOKINGS TABLE */}
              <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Recent Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} style={{ background: 'none', border: 'none', color: '#FFB800', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                    View All
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                        <th style={{ padding: '0.75rem' }}>Booking ID</th>
                        <th style={{ padding: '0.75rem' }}>Customer</th>
                        <th style={{ padding: '0.75rem' }}>Vehicle</th>
                        <th style={{ padding: '0.75rem' }}>Duration</th>
                        <th style={{ padding: '0.75rem' }}>Amount</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: '#RG1250', customer: 'Rohit Sharma', vehicle: 'Royal Enfield 350', duration: '2 Days', amount: '₹1,598', status: 'Completed', color: '#10B981', bg: '#D1FAE5' },
                        { id: '#RG1249', customer: 'Priya Singh', vehicle: 'Yamaha R15 V4', duration: '1 Day', amount: '₹899', status: 'Ongoing', color: '#2563EB', bg: '#EFF6FF' },
                        { id: '#RG1248', customer: 'Amit Kumar', vehicle: 'Honda Activa 6G', duration: '3 Days', amount: '₹1,347', status: 'Upcoming', color: '#D97706', bg: '#FEF3C7' },
                        { id: '#RG1247', customer: 'Neha Patel', vehicle: 'KTM Duke 250', duration: '1 Day', amount: '₹799', status: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' }
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${styles.border}` }}>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{row.id}</td>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: styles.textPrimary }}>{row.customer}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{row.vehicle}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{row.duration}</td>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#FFB800' }}>{row.amount}</td>
                          <td style={{ padding: '0.85rem 0.75rem' }}>
                            <span style={{ backgroundColor: row.bg, color: row.color, padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOTTOM SUMMARY STRIP (5 CARDS) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '0.25rem' }}>Total Bookings</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: styles.textPrimary }}>12,548</div>
                  <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, marginTop: '0.2rem' }}>↑ 16.2%</div>
                </div>

                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '0.25rem' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFB800' }}>₹2.14 Cr</div>
                  <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, marginTop: '0.2rem' }}>↑ 20.8%</div>
                </div>

                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '0.25rem' }}>Cancelled Bookings</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: styles.textPrimary }}>842</div>
                  <div style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 700, marginTop: '0.2rem' }}>↓ 8.4%</div>
                </div>

                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '0.25rem' }}>Active Vehicles</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: styles.textPrimary }}>186</div>
                  <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, marginTop: '0.2rem' }}>↑ 11.5%</div>
                </div>

                <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '0.25rem' }}>Avg. Rating</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFB800' }}>4.6 / 5 ⭐</div>
                  <div style={{ fontSize: '0.72rem', color: styles.textSecondary, marginTop: '0.2rem' }}>Satisfied Renters</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: VEHICLES FLEET & PHOTOS */}
          {(activeTab === 'vehicles' || activeTab === 'photos') && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>
                    {activeTab === 'photos' ? 'Vehicle Multi-Photo Gallery & Management' : 'Fleet Vehicles List (PostgreSQL Source of Truth)'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, marginTop: '0.2rem' }}>
                    Manage bike inventory, specs, status, and multi-angle photo uploads in real-time
                  </p>
                </div>
                <button 
                  onClick={handleOpenAdd} 
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add New Vehicle
                </button>
              </div>

              {isLoadingVehicles ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: styles.textSecondary }}>
                  <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.5rem' }} />
                  <div>Loading vehicle fleet from PostgreSQL...</div>
                </div>
              ) : vehicleError ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', marginBottom: '1rem' }}>
                  {vehicleError}
                </div>
              ) : vehicles.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: styles.textSecondary }}>
                  <Bike size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <div>No vehicles currently registered in PostgreSQL database.</div>
                  <button onClick={handleOpenAdd} className="btn btn-primary btn-sm" style={{ marginTop: '1rem', backgroundColor: '#FFB800', color: '#000000', border: 'none', fontWeight: 700 }}>
                    Add First Vehicle
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                        <th style={{ padding: '0.75rem' }}>Vehicle</th>
                        <th style={{ padding: '0.75rem' }}>Category</th>
                        <th style={{ padding: '0.75rem' }}>Price / Day</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map(v => (
                        <tr key={v.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                          <td style={{ padding: '0.85rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img 
                              src={v.imageUrl || PRESET_BIKE_IMAGES[0].url} 
                              alt={v.model} 
                              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} 
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: styles.textPrimary }}>{v.brand} {v.model}</div>
                              <div style={{ fontSize: '0.75rem', color: styles.textSecondary }}>{v.registrationNumber || 'OD02AB1234'}</div>
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{v.categoryName || v.vehicleType || 'Motorcycle'}</td>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#FFB800' }}>₹{v.pricePerDay}</td>
                          <td style={{ padding: '0.85rem 0.75rem' }}>
                            <select 
                              value={v.status} 
                              onChange={(e) => handleStatusChange(v.id, e.target.value)}
                              style={{
                                backgroundColor: styles.bg,
                                color: styles.textPrimary,
                                border: `1px solid ${styles.border}`,
                                borderRadius: '6px',
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}
                            >
                              <option value="AVAILABLE">AVAILABLE</option>
                              <option value="RENTED">RENTED</option>
                              <option value="MAINTENANCE">MAINTENANCE</option>
                              <option value="INACTIVE">INACTIVE</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                            <button onClick={() => handleOpenEdit(v)} className="btn btn-outline btn-sm" style={{ borderColor: styles.border, color: '#FFB800', marginRight: '0.5rem' }}>
                              <Edit size={14} /> Edit & Photos
                            </button>
                            <button onClick={() => handleDeleteVehicle(v.id)} className="btn btn-outline btn-sm" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                              <Trash2 size={14} /> Deactivate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>All Customer Booking Reservations</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Manage rental reservations, pickup dates, amounts, and statuses</p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Booking Code</th>
                      <th style={{ padding: '0.75rem' }}>Vehicle</th>
                      <th style={{ padding: '0.75rem' }}>Rental Duration</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>Total Price</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BOOKINGS.map(b => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>#{b.id}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textPrimary, fontWeight: 600 }}>{b.bikeName}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary, fontSize: '0.82rem' }}>{b.fromDate} – {b.toDate}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#FFB800' }}>₹{b.amount}</td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          <button className="btn btn-outline btn-sm" style={{ borderColor: styles.border, color: styles.textPrimary }}>View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Registered Customers & Accounts</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Manage customer profiles, contact info, and account statuses</p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Contact Info</th>
                      <th style={{ padding: '0.75rem' }}>Joined Date</th>
                      <th style={{ padding: '0.75rem' }}>Bookings</th>
                      <th style={{ padding: '0.75rem' }}>Account Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3B82F620', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: 700 }}>
                            {c.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: styles.textPrimary }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#FFB800', fontWeight: 600 }}>{c.role}</div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontSize: '0.82rem', color: styles.textPrimary }}>{c.email}</div>
                          <div style={{ fontSize: '0.75rem', color: styles.textSecondary }}>{c.phone}</div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{c.joined}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{c.bookingsCount} rides</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: c.status === 'ACTIVE' ? '#D1FAE5' : '#FEE2E2', color: c.status === 'ACTIVE' ? '#059669' : '#DC2626', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          <button onClick={() => handleToggleCustomerStatus(c.id)} className="btn btn-outline btn-sm" style={{ borderColor: styles.border, color: c.status === 'ACTIVE' ? '#EF4444' : '#10B981' }}>
                            {c.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Payment Transactions Ledger</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Real-time payment transaction history & payment gateway receipts</p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Transaction ID</th>
                      <th style={{ padding: '0.75rem' }}>Booking ID</th>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Gateway Method</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{p.id}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{p.bookingId}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: styles.textPrimary }}>{p.customer}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{p.method}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#FFB800' }}>₹{p.amount}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: p.status === 'SUCCESS' ? '#D1FAE5' : '#FEE2E2', color: p.status === 'SUCCESS' ? '#059669' : '#DC2626', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary, fontSize: '0.8rem' }}>{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REFUNDS */}
          {activeTab === 'refunds' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.2rem' }}>Refunds & Security Deposit Clearance</h3>
              <p style={{ fontSize: '0.82rem', color: styles.textSecondary, marginBottom: '1.25rem' }}>Process security deposit releases and booking cancellation refunds</p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Refund Ref</th>
                      <th style={{ padding: '0.75rem' }}>Booking ID</th>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Reason</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map(r => (
                      <tr key={r.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{r.id}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{r.bookingId}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: styles.textPrimary }}>{r.customer}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{r.reason}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#10B981' }}>₹{r.amount}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: r.status === 'COMPLETED' ? '#D1FAE5' : '#FEF3C7', color: r.status === 'COMPLETED' ? '#059669' : '#D97706', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          {r.status === 'PROCESSING' && (
                            <button onClick={() => setRefunds(prev => prev.map(item => item.id === r.id ? { ...item, status: 'COMPLETED' } : item))} className="btn btn-primary btn-sm" style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none' }}>
                              Approve Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Fleet Maintenance & Service Logs</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Track vehicle oil changes, tire replacements, and repair costs</p>
                </div>
                <button onClick={() => setShowMaintenanceModal(true)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none' }}>
                  <Plus size={16} /> Log New Maintenance
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Service ID</th>
                      <th style={{ padding: '0.75rem' }}>Vehicle</th>
                      <th style={{ padding: '0.75rem' }}>Service Type</th>
                      <th style={{ padding: '0.75rem' }}>Mechanic / Vendor</th>
                      <th style={{ padding: '0.75rem' }}>Cost</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{m.id}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontWeight: 600, color: styles.textPrimary }}>{m.bikeName}</div>
                          <div style={{ fontSize: '0.75rem', color: styles.textSecondary }}>{m.regNo}</div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{m.serviceType}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{m.mechanic}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#EF4444' }}>₹{m.cost}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: m.status === 'COMPLETED' ? '#D1FAE5' : '#FEF3C7', color: m.status === 'COMPLETED' ? '#059669' : '#D97706', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {m.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary, fontSize: '0.8rem' }}>{m.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS */}
          {activeTab === 'coupons' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Promotional Coupons & Discounts</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Manage discount codes, percentage offers, and usage limits</p>
                </div>
                <button onClick={() => setShowCouponModal(true)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none' }}>
                  <Plus size={16} /> Create Coupon Code
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Coupon Code</th>
                      <th style={{ padding: '0.75rem' }}>Discount Offer</th>
                      <th style={{ padding: '0.75rem' }}>Valid Until</th>
                      <th style={{ padding: '0.75rem' }}>Usage Count</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, color: '#FFB800', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontFamily: 'monospace' }}>
                            {c.code}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{c.discount}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{c.validTill}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: styles.textPrimary }}>{c.usageCount} times</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: REVIEWS */}
          {activeTab === 'reviews' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.2rem' }}>Customer Ratings & Feedback Moderation</h3>
              <p style={{ fontSize: '0.82rem', color: styles.textSecondary, marginBottom: '1.25rem' }}>Review customer ratings, comments, and manage visibility</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: styles.textPrimary }}>{r.customer}</div>
                        <div style={{ fontSize: '0.75rem', color: styles.textSecondary }}>Rented: {r.bikeName} | {r.date}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#FFB800', fontWeight: 800 }}>
                        {'⭐'.repeat(r.rating)} ({r.rating}.0)
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: styles.textPrimary, margin: 0, fontStyle: 'italic' }}>"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: LOCATIONS */}
          {activeTab === 'locations' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Rental Pickup & Dropoff Hub Stations</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Manage rental stations, city hubs, and parking capacities</p>
                </div>
                <button onClick={() => setShowLocationModal(true)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none' }}>
                  <Plus size={16} /> Add New Hub Station
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="grid-3">
                {locations.map(loc => (
                  <div key={loc.id} style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, color: styles.textPrimary, fontSize: '1rem' }}>{loc.name}</div>
                      <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {loc.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: styles.textSecondary, marginBottom: '0.4rem' }}>{loc.address}, {loc.city}</div>
                    <div style={{ fontSize: '0.8rem', color: styles.textSecondary, marginBottom: '0.75rem' }}>Contact: {loc.phone}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${styles.border}`, paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                      <span>Capacity: <strong>{loc.capacity} bikes</strong></span>
                      <span style={{ color: '#FFB800' }}>Active: <strong>{loc.activeBikes} bikes</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, margin: 0 }}>Broadcast Notification Center</h3>
                  <p style={{ fontSize: '0.82rem', color: styles.textSecondary, margin: '0.2rem 0 0' }}>Send push announcements, promotional deals, and safety alerts to users</p>
                </div>
                <button onClick={() => setShowNotificationModal(true)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700, border: 'none' }}>
                  <Send size={14} /> Send Broadcast Message
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 700, color: styles.textPrimary }}>{n.title}</div>
                      <span style={{ fontSize: '0.72rem', color: styles.textSecondary }}>{n.sentAt}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: styles.textSecondary, margin: '0 0 0.5rem' }}>{n.text}</p>
                    <span style={{ backgroundColor: isDark ? '#3B82F620' : '#EFF6FF', color: '#3B82F6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                      Audience: {n.audience}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: INVOICES */}
          {activeTab === 'invoices' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.2rem' }}>Billing & GST Invoices</h3>
              <p style={{ fontSize: '0.82rem', color: styles.textSecondary, marginBottom: '1.25rem' }}>Tax breakdown, base fares, and downloadable PDF receipts</p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: styles.textPrimary }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${styles.border}`, textAlign: 'left', color: styles.textSecondary }}>
                      <th style={{ padding: '0.75rem' }}>Invoice #</th>
                      <th style={{ padding: '0.75rem' }}>Booking ID</th>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Base Fare</th>
                      <th style={{ padding: '0.75rem' }}>GST Tax (18%)</th>
                      <th style={{ padding: '0.75rem' }}>Total</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(inv => (
                      <tr key={inv.id} style={{ borderBottom: `1px solid ${styles.border}` }}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: styles.textPrimary }}>{inv.id}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>{inv.bookingId}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: styles.textPrimary }}>{inv.customer}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>₹{inv.baseFare}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary }}>₹{inv.gstTax}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#FFB800' }}>₹{inv.total}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: styles.textSecondary, fontSize: '0.8rem' }}>{inv.date}</td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          <button onClick={() => alert(`Downloading Invoice PDF: ${inv.id}`)} className="btn btn-outline btn-sm" style={{ borderColor: styles.border, color: '#FFB800' }}>
                            <Download size={14} /> PDF Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: REPORTS */}
          {activeTab === 'reports' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.2rem' }}>Performance Reports & Data Export</h3>
              <p style={{ fontSize: '0.82rem', color: styles.textSecondary, marginBottom: '1.5rem' }}>Download spreadsheet reports for financial audits and vehicle utilization</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="grid-3">
                <div style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                  <FileSpreadsheet size={36} color="#FFB800" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', color: styles.textPrimary, marginBottom: '0.4rem' }}>Bookings Ledger Report</h4>
                  <p style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '1rem' }}>Complete history of rental reservations and statuses</p>
                  <button onClick={() => alert('Exporting Bookings CSV report...')} className="btn btn-primary btn-sm" style={{ backgroundColor: '#FFB800', color: '#000000', border: 'none', fontWeight: 700 }}>
                    Export Bookings CSV
                  </button>
                </div>

                <div style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                  <CreditCard size={36} color="#10B981" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', color: styles.textPrimary, marginBottom: '0.4rem' }}>Financial Revenue Report</h4>
                  <p style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '1rem' }}>Gross revenue, GST tax, and payment breakdown</p>
                  <button onClick={() => alert('Exporting Revenue CSV report...')} className="btn btn-primary btn-sm" style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', fontWeight: 700 }}>
                    Export Financial CSV
                  </button>
                </div>

                <div style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                  <Bike size={36} color="#3B82F6" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', color: styles.textPrimary, marginBottom: '0.4rem' }}>Fleet Utilization Report</h4>
                  <p style={{ fontSize: '0.78rem', color: styles.textSecondary, marginBottom: '1rem' }}>Vehicle mileage, service frequency, and uptime stats</p>
                  <button onClick={() => alert('Exporting Fleet Utilization CSV report...')} className="btn btn-primary btn-sm" style={{ backgroundColor: '#3B82F6', color: '#FFF', border: 'none', fontWeight: 700 }}>
                    Export Fleet CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.border}`, borderRadius: '16px', padding: '1.75rem', maxWidth: '680px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.2rem' }}>Platform Operational Settings</h3>
              <p style={{ fontSize: '0.82rem', color: styles.textSecondary, marginBottom: '1.5rem' }}>Configure global rental parameters, GST rates, and security deposits</p>

              <form onSubmit={e => { e.preventDefault(); alert('Platform settings saved successfully!'); }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: styles.textSecondary }}>Platform Name</label>
                  <input type="text" value={settings.platformName} onChange={e => setSettings(s => ({ ...s, platformName: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Support Email</label>
                    <input type="email" value={settings.supportEmail} onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Support Hotline</label>
                    <input type="text" value={settings.supportPhone} onChange={e => setSettings(s => ({ ...s, supportPhone: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>GST Tax Rate (%)</label>
                    <input type="number" value={settings.taxGstRate} onChange={e => setSettings(s => ({ ...s, taxGstRate: Number(e.target.value) }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Default Security Deposit (₹)</label>
                    <input type="number" value={settings.defaultDeposit} onChange={e => setSettings(s => ({ ...s, defaultDeposit: Number(e.target.value) }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} />
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700 }}>
                    Save Platform Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT / ADD VEHICLE MODAL */}
          {showAddVehicleModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '640px', padding: '1.75rem', backgroundColor: styles.cardBg, color: styles.textPrimary, border: `1px solid ${styles.border}`, borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: styles.textPrimary }}>
                    {editingVehicle ? `Edit ${editingVehicle.brand} ${editingVehicle.model} Details` : 'Add New Vehicle to PostgreSQL Fleet'}
                  </h3>
                  <button onClick={() => setShowAddVehicleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: styles.textSecondary }}>
                    <X size={20} />
                  </button>
                </div>

                {vehicleSubmitError && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {vehicleSubmitError}
                  </div>
                )}

                <form onSubmit={handleSaveVehicle}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <VehiclePhotoManager 
                      vehicle={formVehicle}
                      images={formVehicle.images || [
                        { id: 1, imageUrl: formVehicle.imageUrl || PRESET_BIKE_IMAGES[0].url, isPrimary: true, displayOrder: 1 }
                      ]}
                      onUpdateImages={(updatedImages) => {
                        const primary = updatedImages.find(img => img.isPrimary) || updatedImages[0];
                        setFormVehicle(prev => ({
                          ...prev,
                          images: updatedImages,
                          imageUrl: primary ? primary.imageUrl : prev.imageUrl
                        }));
                      }}
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label" style={{ color: styles.textSecondary }}>Brand</label>
                      <input 
                        type="text" 
                        value={formVehicle.brand} 
                        onChange={e => setFormVehicle(p => ({ ...p, brand: e.target.value }))} 
                        className="form-control" 
                        style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} 
                        placeholder="e.g. Royal Enfield"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: styles.textSecondary }}>Model</label>
                      <input 
                        type="text" 
                        value={formVehicle.model} 
                        onChange={e => setFormVehicle(p => ({ ...p, model: e.target.value }))} 
                        className="form-control" 
                        style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} 
                        placeholder="e.g. Classic 350"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: styles.textSecondary }}>Registration Number</label>
                      <input 
                        type="text" 
                        value={formVehicle.registrationNumber || ''} 
                        onChange={e => setFormVehicle(p => ({ ...p, registrationNumber: e.target.value }))} 
                        className="form-control" 
                        style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} 
                        placeholder="e.g. OD02AB1234"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: styles.textSecondary }}>Vehicle Type / Category</label>
                      <select 
                        value={formVehicle.categoryName || 'Sports Bikes'} 
                        onChange={e => setFormVehicle(p => ({ ...p, categoryName: e.target.value }))} 
                        className="form-control" 
                        style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }}
                      >
                        <option value="Mountain Bikes">Mountain Bikes</option>
                        <option value="Sports Bikes">Sports Bikes</option>
                        <option value="Cruiser Bikes">Cruiser Bikes</option>
                        <option value="City Scooters">City Scooters</option>
                        <option value="Electric Bikes">Electric Bikes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: styles.textSecondary }}>Price / Day (₹)</label>
                      <input 
                        type="number" 
                        value={formVehicle.pricePerDay} 
                        onChange={e => setFormVehicle(p => ({ ...p, pricePerDay: parseInt(e.target.value) || 0 }))} 
                        className="form-control" 
                        style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: styles.textSecondary }}>Security Deposit (₹)</label>
                      <input 
                        type="number" 
                        value={formVehicle.securityDeposit} 
                        onChange={e => setFormVehicle(p => ({ ...p, securityDeposit: parseInt(e.target.value) || 0 }))} 
                        className="form-control" 
                        style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => setShowAddVehicleModal(false)} className="btn btn-secondary" style={{ backgroundColor: styles.bg, color: styles.textSecondary, borderColor: styles.border }}>Cancel</button>
                    <button type="submit" disabled={isSubmittingVehicle} className="btn btn-primary" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700 }}>
                      {isSubmittingVehicle ? 'Saving to PostgreSQL...' : 'Save Vehicle to PostgreSQL'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* CREATE COUPON MODAL */}
          {showCouponModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem', backgroundColor: styles.cardBg, color: styles.textPrimary, border: `1px solid ${styles.border}`, borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Create New Coupon Code</h3>
                  <button onClick={() => setShowCouponModal(false)} style={{ background: 'none', border: 'none', color: styles.textSecondary }}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateCoupon}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Coupon Code</label>
                    <input type="text" value={newCoupon.code} onChange={e => setNewCoupon(c => ({ ...c, code: e.target.value }))} className="form-control" placeholder="e.g. MONSOON50" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Discount Type</label>
                    <select value={newCoupon.type} onChange={e => setNewCoupon(c => ({ ...c, type: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }}>
                      <option value="FLAT">Flat ₹ Amount OFF</option>
                      <option value="PERCENT">Percentage % OFF</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Discount Value</label>
                    <input type="number" value={newCoupon.value} onChange={e => setNewCoupon(c => ({ ...c, value: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowCouponModal(false)} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700 }}>Create Coupon</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADD HUB STATION MODAL */}
          {showLocationModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem', backgroundColor: styles.cardBg, color: styles.textPrimary, border: `1px solid ${styles.border}`, borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add Rental Hub Station</h3>
                  <button onClick={() => setShowLocationModal(false)} style={{ background: 'none', border: 'none', color: styles.textSecondary }}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateLocation}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Station Hub Name</label>
                    <input type="text" value={newLocation.name} onChange={e => setNewLocation(l => ({ ...l, name: e.target.value }))} className="form-control" placeholder="e.g. Silk Board Metro Hub" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>City</label>
                    <input type="text" value={newLocation.city} onChange={e => setNewLocation(l => ({ ...l, city: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Full Address</label>
                    <input type="text" value={newLocation.address} onChange={e => setNewLocation(l => ({ ...l, address: e.target.value }))} className="form-control" placeholder="e.g. Outer Ring Road" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowLocationModal(false)} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700 }}>Add Hub Station</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* LOG MAINTENANCE MODAL */}
          {showMaintenanceModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem', backgroundColor: styles.cardBg, color: styles.textPrimary, border: `1px solid ${styles.border}`, borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Log Maintenance Record</h3>
                  <button onClick={() => setShowMaintenanceModal(false)} style={{ background: 'none', border: 'none', color: styles.textSecondary }}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateMaintenance}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Vehicle Name</label>
                    <input type="text" value={newMaintenance.bikeName} onChange={e => setNewMaintenance(m => ({ ...m, bikeName: e.target.value }))} className="form-control" placeholder="e.g. Royal Enfield Classic 350" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Service Type</label>
                    <input type="text" value={newMaintenance.serviceType} onChange={e => setNewMaintenance(m => ({ ...m, serviceType: e.target.value }))} className="form-control" placeholder="e.g. Brake Replacement & Alignment" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Repair Cost (₹)</label>
                    <input type="number" value={newMaintenance.cost} onChange={e => setNewMaintenance(m => ({ ...m, cost: e.target.value }))} className="form-control" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowMaintenanceModal(false)} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700 }}>Save Record</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* BROADCAST NOTIFICATION MODAL */}
          {showNotificationModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem', backgroundColor: styles.cardBg, color: styles.textPrimary, border: `1px solid ${styles.border}`, borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Broadcast Message Notification</h3>
                  <button onClick={() => setShowNotificationModal(false)} style={{ background: 'none', border: 'none', color: styles.textSecondary }}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateNotification}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Notification Title</label>
                    <input type="text" value={newNotification.title} onChange={e => setNewNotification(n => ({ ...n, title: e.target.value }))} className="form-control" placeholder="e.g. Festive Discount Alert" style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: styles.textSecondary }}>Message Content</label>
                    <textarea value={newNotification.text} onChange={e => setNewNotification(n => ({ ...n, text: e.target.value }))} className="form-control" rows={3} style={{ backgroundColor: styles.bg, color: styles.textPrimary, borderColor: styles.border }} required />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowNotificationModal(false)} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFB800', color: '#000000', fontWeight: 700 }}>Broadcast Now</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
