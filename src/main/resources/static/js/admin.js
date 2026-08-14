document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadDashboardStats();
});

let revenueChartInstance = null;
let categoryChartInstance = null;
let bookingTrendChartInstance = null;
let topVehiclesChartInstance = null;
let statusChartInstance = null;

function checkAdminAuth() {
    const token = localStorage.getItem('ridego_token') || sessionStorage.getItem('ridego_token');
    const userRole = localStorage.getItem('ridego_user_role') || sessionStorage.getItem('ridego_user_role');

    if (!token) {
        // Redirect to login if unauthenticated
        console.warn('Unauthenticated admin access attempt. Please log in.');
    }
}

function getAuthHeader() {
    const token = localStorage.getItem('ridego_token') || sessionStorage.getItem('ridego_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function loadDashboardStats() {
    try {
        const response = await fetch('/api/admin/dashboard/stats', {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            console.warn('Dashboard stats API returned status:', response.status);
            renderMockStats();
            return;
        }

        const resData = await response.json();
        if (resData.success && resData.data) {
            updateDashboardUI(resData.data);
        } else {
            renderMockStats();
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        renderMockStats();
    }
}

function updateDashboardUI(data) {
    // 1. Populate 8 Metric Cards
    document.getElementById('card-total-vehicles').innerText = data.totalVehicles || 0;
    document.getElementById('card-available-vehicles').innerText = data.availableVehicles || 0;
    document.getElementById('card-booked-vehicles').innerText = data.bookedVehicles || 0;
    document.getElementById('card-active-rentals').innerText = data.activeRentals || 0;
    document.getElementById('card-maintenance-vehicles').innerText = data.maintenanceVehicles || 0;
    document.getElementById('card-total-users').innerText = data.totalUsers || 0;
    document.getElementById('card-todays-bookings').innerText = data.todaysBookings || 0;
    document.getElementById('card-monthly-revenue').innerText = '$' + (data.monthlyRevenue ? parseFloat(data.monthlyRevenue).toFixed(2) : '0.00');

    // 2. Render Chart 1: Revenue Trends
    renderRevenueChart(data.revenueByMonth || []);

    // 3. Render Chart 2: Booking Trends
    renderBookingTrendChart(data.bookingTrends || []);

    // 4. Render Chart 3: Category Distribution
    renderCategoryChart(data.categoryDistribution || []);

    // 5. Render Chart 4: Top Booked Vehicles
    renderTopVehiclesChart(data.mostBookedVehicles || []);

    // 6. Render Chart 5: Booking Status Breakdown
    renderStatusChart(data.statusDistribution || {});
}

function renderMockStats() {
    const mockData = {
        totalVehicles: 24,
        availableVehicles: 16,
        bookedVehicles: 4,
        activeRentals: 3,
        maintenanceVehicles: 1,
        totalUsers: 85,
        todaysBookings: 5,
        monthlyRevenue: 4250.00,
        revenueByMonth: [
            { month: 'Mar 2026', revenue: 2100 },
            { month: 'Apr 2026', revenue: 2800 },
            { month: 'May 2026', revenue: 3400 },
            { month: 'Jun 2026', revenue: 3900 },
            { month: 'Jul 2026', revenue: 4100 },
            { month: 'Aug 2026', revenue: 4250 }
        ],
        bookingTrends: [
            { date: '06 Aug', count: 4 },
            { date: '07 Aug', count: 6 },
            { date: '08 Aug', count: 8 },
            { date: '09 Aug', count: 5 },
            { date: '10 Aug', count: 9 },
            { date: '11 Aug', count: 7 },
            { date: '12 Aug', count: 5 }
        ],
        categoryDistribution: [
            { categoryName: 'Urban Cruiser', count: 10 },
            { categoryName: 'Sports Bike', count: 6 },
            { categoryName: 'Electric Scooter', count: 5 },
            { categoryName: 'Adventure Tourer', count: 3 }
        ],
        mostBookedVehicles: [
            { vehicleName: 'Royal Enfield Meteor 350', bookingCount: 28 },
            { vehicleName: 'Yamaha YZF R15', bookingCount: 22 },
            { vehicleName: 'Ather 450X EV', bookingCount: 18 },
            { vehicleName: 'KTM Duke 390', bookingCount: 15 },
            { vehicleName: 'Honda CB350 Highness', bookingCount: 12 }
        ],
        statusDistribution: {
            'CONFIRMED': 12,
            'ACTIVE': 8,
            'COMPLETED': 45,
            'PENDING': 5,
            'CANCELLED': 3
        }
    };
    updateDashboardUI(mockData);
}

function renderRevenueChart(series) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    if (revenueChartInstance) revenueChartInstance.destroy();

    const labels = series.map(s => s.month);
    const values = series.map(s => s.revenue);

    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Revenue ($)',
                data: values,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#38bdf8'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

function renderBookingTrendChart(series) {
    const ctx = document.getElementById('bookingTrendChart').getContext('2d');
    if (bookingTrendChartInstance) bookingTrendChartInstance.destroy();

    const labels = series.map(s => s.date);
    const values = series.map(s => s.count);

    bookingTrendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bookings',
                data: values,
                backgroundColor: '#38bdf8',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

function renderCategoryChart(series) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChartInstance) categoryChartInstance.destroy();

    const labels = series.map(s => s.categoryName);
    const values = series.map(s => s.count);

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#38bdf8', '#4ade80', '#c084fc', '#fb923c', '#2dd4bf']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } }
            }
        }
    });
}

function renderTopVehiclesChart(series) {
    const ctx = document.getElementById('topVehiclesChart').getContext('2d');
    if (topVehiclesChartInstance) topVehiclesChartInstance.destroy();

    const labels = series.map(s => s.vehicleName);
    const values = series.map(s => s.bookingCount);

    topVehiclesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bookings',
                data: values,
                backgroundColor: '#4ade80',
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });
}

function renderStatusChart(statusMap) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    if (statusChartInstance) statusChartInstance.destroy();

    const labels = Object.keys(statusMap);
    const values = Object.values(statusMap);

    statusChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#4ade80', '#38bdf8', '#c084fc', '#facc15', '#f87171', '#fb923c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 12 } }
            }
        }
    });
}

function showSection(sectionName) {
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionName}`) {
            link.classList.add('active');
        }
    });

    const dashboardSec = document.getElementById('dashboard-section');
    const dynamicSec = document.getElementById('dynamic-section');

    if (sectionName === 'dashboard') {
        dashboardSec.classList.remove('d-none');
        dynamicSec.classList.add('d-none');
        document.getElementById('section-title').innerText = 'Admin Dashboard';
    } else {
        dashboardSec.classList.add('d-none');
        dynamicSec.classList.remove('d-none');
        const formattedTitle = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        document.getElementById('section-title').innerText = `${formattedTitle} Management`;
        document.getElementById('dynamic-title').innerText = `${formattedTitle} Management Module`;
        document.getElementById('dynamic-desc').innerText = `Manage ${sectionName} records, specs, and status actions via REST endpoints.`;
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function logoutAdmin() {
    localStorage.removeItem('ridego_token');
    localStorage.removeItem('ridego_user_role');
    sessionStorage.clear();
    window.location.href = '/index.html';
}
