// RideGo User Frontend SPA Application Logic
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let state = {
    user: null,
    token: null,
    wishlist: JSON.parse(localStorage.getItem('ridego_wishlist') || '[]'),
    locations: [],
    categories: [],
    selectedVehicle: null,
    activeBooking: null,
    appliedCoupon: null,
    calculatedRentalCost: 0,
    calculatedDiscount: 0,
    calculatedTax: 0,
    calculatedDeposit: 0,
    calculatedTotal: 0
};

function initApp() {
    loadAuthToken();
    updateAuthHeaderUI();
    updateWishlistCount();
    loadLocations();
    loadCategories();
    loadHomeData();
}

function loadAuthToken() {
    state.token = localStorage.getItem('ridego_token') || sessionStorage.getItem('ridego_token');
    const userStr = localStorage.getItem('ridego_user') || sessionStorage.getItem('ridego_user');
    if (userStr) {
        try { state.user = JSON.parse(userStr); } catch (e) { state.user = null; }
    }
}

function getAuthHeader() {
    return {
        'Content-Type': 'application/json',
        'Authorization': state.token ? `Bearer ${state.token}` : ''
    };
}

function updateAuthHeaderUI() {
    const container = document.getElementById('auth-header-container');
    if (!container) return;

    if (state.token && state.user) {
        container.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-dark-glass rounded-pill dropdown-toggle px-3 py-2" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle text-emerald me-1"></i> ${state.user.name || 'My Account'}
                </button>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                    <li><a class="dropdown-item" href="#" onclick="showView('profile')"><i class="bi bi-person me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="#" onclick="showView('my-bookings')"><i class="bi bi-journal-check me-2"></i>My Bookings</a></li>
                    <li><a class="dropdown-item" href="#" onclick="showView('notifications')"><i class="bi bi-bell me-2"></i>Notifications</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                </ul>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button class="btn btn-outline-emerald rounded-pill px-4 py-2" onclick="openAuthModal('login')">Log In</button>
            <button class="btn btn-emerald rounded-pill px-4 py-2" onclick="openAuthModal('register')">Register</button>
        `;
    }
}

// 12-PAGE SPA VIEW SWITCHER
function showView(viewName) {
    document.querySelectorAll('.view-page').forEach(page => page.classList.add('d-none'));
    
    const targetPage = document.getElementById(`${viewName}-view`);
    if (targetPage) {
        targetPage.classList.remove('d-none');
        window.scrollTo(0, 0);
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${viewName}`);
    if (activeNav) activeNav.classList.add('active');

    // Trigger View Specific Data Loaders
    if (viewName === 'home') loadHomeData();
    if (viewName === 'search') executeVehicleSearch();
    if (viewName === 'my-bookings') loadMyBookings();
    if (viewName === 'active-rental') loadActiveRental();
    if (viewName === 'wishlist') renderWishlist();
    if (viewName === 'notifications') loadNotifications();
    if (viewName === 'profile') loadUserProfile();
}

// API DATA LOADERS
async function loadLocations() {
    try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        if (data.success && data.data) {
            state.locations = data.data;
            populateLocationSelects();
        }
    } catch (e) { console.error('Failed to load locations', e); }
}

function populateLocationSelects() {
    const heroSelect = document.getElementById('hero-pickup-location');
    const searchBarSelect = document.getElementById('search-bar-location');
    const bkPickupSelect = document.getElementById('booking-pickup-location');
    const bkReturnSelect = document.getElementById('booking-return-location');

    let optionsHtml = '<option value="">Select Station Location...</option>';
    state.locations.forEach(loc => {
        optionsHtml += `<option value="${loc.id}">${loc.name} (${loc.city})</option>`;
    });

    if (heroSelect) heroSelect.innerHTML = optionsHtml;
    if (searchBarSelect) searchBarSelect.innerHTML = '<option value="">All Pickup Stations</option>' + optionsHtml;
    if (bkPickupSelect) bkPickupSelect.innerHTML = optionsHtml;
    if (bkReturnSelect) bkReturnSelect.innerHTML = optionsHtml;
}

async function loadCategories() {
    try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.data) {
            state.categories = data.data;
            const filterCatSelect = document.getElementById('filter-category');
            if (filterCatSelect) {
                let catHtml = '<option value="">All Categories</option>';
                state.categories.forEach(c => {
                    catHtml += `<option value="${c.id}">${c.name}</option>`;
                });
                filterCatSelect.innerHTML = catHtml;
            }
        }
    } catch (e) { console.error('Failed to load categories', e); }
}

// PAGE 1: HOME
async function loadHomeData() {
    try {
        const res = await fetch('/api/vehicles/search?size=6');
        const data = await res.json();
        if (data.success && data.data && data.data.content) {
            renderPopularBikes(data.data.content);
        }
        renderHomeCategories();
        renderHomeLocations();
    } catch (e) { console.error('Error loading home data', e); }
}

function renderPopularBikes(bikes) {
    const grid = document.getElementById('home-popular-bikes-grid');
    if (!grid) return;

    if (!bikes || bikes.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted">No vehicles available at this time.</div>';
        return;
    }

    let html = '';
    bikes.forEach(b => {
        const isWishlisted = state.wishlist.includes(b.id);
        const rating = b.averageRating ? b.averageRating.toFixed(1) : '5.0';

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-glass p-3 h-100 d-flex flex-column">
                    <div class="position-relative mb-3">
                        <img src="${b.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}" class="bike-img-crop" alt="${b.brand} ${b.model}">
                        <button class="btn btn-dark-glass btn-sm rounded-circle position-absolute top-0 end-0 m-2" onclick="toggleWishlist(${b.id})">
                            <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                        </button>
                    </div>
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge badge-glass text-emerald small mb-1">${b.vehicleType || 'Cruiser'}</span>
                            <h5 class="fw-bold text-light m-0">${b.brand} ${b.model}</h5>
                        </div>
                        <div class="rating-stars fw-semibold">
                            <i class="bi bi-star-fill me-1"></i>${rating}
                        </div>
                    </div>
                    <div class="d-flex gap-2 mb-3">
                        <span class="spec-pill"><i class="bi bi-fuel-pump me-1"></i>${b.fuelType || 'Petrol'}</span>
                        <span class="spec-pill"><i class="bi bi-speedometer me-1"></i>${b.engineCC || 350} cc</span>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-dark-subtle">
                        <div>
                            <span class="text-secondary small d-block">Price / Hour</span>
                            <span class="fs-5 fw-bold text-emerald">$${b.pricePerHour || 10.00}</span>
                        </div>
                        <button class="btn btn-emerald rounded-pill px-3 py-2" onclick="loadBikeDetails(${b.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

function renderHomeCategories() {
    const grid = document.getElementById('home-categories-grid');
    if (!grid) return;
    let html = '';
    state.categories.forEach(c => {
        html += `
            <div class="col-6 col-md-3">
                <div class="card-glass p-3 text-center cursor-pointer" onclick="showView('search')">
                    <i class="bi bi-layers text-emerald fs-2 mb-2"></i>
                    <h6 class="fw-bold text-light m-0">${c.name}</h6>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

function renderHomeLocations() {
    const grid = document.getElementById('home-locations-grid');
    if (!grid) return;
    let html = '';
    state.locations.forEach(l => {
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-glass p-3 d-flex align-items-center gap-3">
                    <i class="bi bi-geo-alt-fill text-emerald fs-2"></i>
                    <div>
                        <h6 class="fw-bold text-light mb-1">${l.name}</h6>
                        <span class="text-secondary small">${l.address}, ${l.city}</span>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// PAGE 2: SEARCH BIKES
function handleHeroSearch(event) {
    event.preventDefault();
    const locId = document.getElementById('hero-pickup-location').value;
    const pickup = document.getElementById('hero-pickup-time').value;
    const ret = document.getElementById('hero-return-time').value;

    if (locId) document.getElementById('search-bar-location').value = locId;
    if (pickup) document.getElementById('search-bar-pickup').value = pickup;
    if (ret) document.getElementById('search-bar-return').value = ret;

    showView('search');
}

async function executeVehicleSearch() {
    const locId = document.getElementById('search-bar-location')?.value || '';
    const pickup = document.getElementById('search-bar-pickup')?.value || '';
    const ret = document.getElementById('search-bar-return')?.value || '';
    const brand = document.getElementById('filter-brand')?.value || '';
    const catId = document.getElementById('filter-category')?.value || '';
    const type = document.getElementById('filter-type')?.value || '';
    const fuel = document.getElementById('filter-fuel')?.value || '';

    let query = `/api/vehicles/search?page=0&size=12`;
    if (locId) query += `&locationId=${locId}`;
    if (pickup) query += `&startTime=${encodeURIComponent(pickup)}`;
    if (ret) query += `&endTime=${encodeURIComponent(ret)}`;
    if (brand) query += `&brand=${encodeURIComponent(brand)}`;
    if (catId) query += `&categoryId=${catId}`;
    if (type) query += `&vehicleType=${encodeURIComponent(type)}`;
    if (fuel) query += `&fuelType=${encodeURIComponent(fuel)}`;

    try {
        const res = await fetch(query);
        const data = await res.json();
        if (data.success && data.data && data.data.content) {
            renderSearchResults(data.data.content);
        }
    } catch (e) { console.error('Failed to search vehicles', e); }
}

function renderSearchResults(bikes) {
    const grid = document.getElementById('search-results-grid');
    if (!grid) return;

    if (!bikes || bikes.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No available vehicles match your search criteria.</div>';
        return;
    }

    let html = '';
    bikes.forEach(b => {
        const isWishlisted = state.wishlist.includes(b.id);
        const rating = b.averageRating ? b.averageRating.toFixed(1) : '5.0';

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-glass p-3 h-100 d-flex flex-column">
                    <div class="position-relative mb-3">
                        <img src="${b.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}" class="bike-img-crop" alt="${b.brand} ${b.model}">
                        <button class="btn btn-dark-glass btn-sm rounded-circle position-absolute top-0 end-0 m-2" onclick="toggleWishlist(${b.id})">
                            <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                        </button>
                    </div>
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge badge-glass text-emerald small mb-1">${b.vehicleType || 'Cruiser'}</span>
                            <h5 class="fw-bold text-light m-0">${b.brand} ${b.model}</h5>
                        </div>
                        <div class="rating-stars fw-semibold">
                            <i class="bi bi-star-fill me-1"></i>${rating}
                        </div>
                    </div>
                    <div class="d-flex gap-2 mb-3">
                        <span class="spec-pill"><i class="bi bi-fuel-pump me-1"></i>${b.fuelType || 'Petrol'}</span>
                        <span class="spec-pill"><i class="bi bi-speedometer me-1"></i>${b.engineCC || 350} cc</span>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-dark-subtle">
                        <div>
                            <span class="text-secondary small d-block">Price / Hour</span>
                            <span class="fs-5 fw-bold text-emerald">$${b.pricePerHour || 10.00}</span>
                        </div>
                        <button class="btn btn-emerald rounded-pill px-3 py-2" onclick="loadBikeDetails(${b.id})">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// PAGE 3: BIKE DETAILS
async function loadBikeDetails(id) {
    try {
        const res = await fetch(`/api/vehicles/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
            state.selectedVehicle = data.data;
            renderBikeDetails(data.data);
            showView('details');
        }
    } catch (e) { console.error('Failed to load bike details', e); }
}

function renderBikeDetails(v) {
    const container = document.getElementById('bike-details-container');
    if (!container) return;

    const isWishlisted = state.wishlist.includes(v.id);
    const rating = v.averageRating ? v.averageRating.toFixed(1) : '5.0';

    container.innerHTML = `
        <div class="col-lg-6">
            <div class="card-glass p-3 mb-3">
                <img src="${v.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}" class="img-fluid rounded-4 w-100" alt="${v.brand}">
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card-glass p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <span class="badge badge-glass text-emerald px-3 py-2 rounded-pill mb-2">${v.category ? v.category.name : 'Urban Cruiser'}</span>
                        <h2 class="fw-bold text-light m-0">${v.brand} ${v.model}</h2>
                        <span class="text-secondary small">Registration: ${v.registrationNumber}</span>
                    </div>
                    <div class="rating-stars fs-5 fw-bold">
                        <i class="bi bi-star-fill me-1"></i>${rating} (${v.reviewCount || 0})
                    </div>
                </div>

                <div class="row g-2 mb-4">
                    <div class="col-6"><div class="spec-pill"><i class="bi bi-speedometer2 text-emerald me-2"></i>Engine: ${v.engineCC} cc</div></div>
                    <div class="col-6"><div class="spec-pill"><i class="bi bi-fuel-pump text-emerald me-2"></i>Fuel: ${v.fuelType}</div></div>
                    <div class="col-6"><div class="spec-pill"><i class="bi bi-gear text-emerald me-2"></i>Transmission: ${v.transmission}</div></div>
                    <div class="col-6"><div class="spec-pill"><i class="bi bi-palette text-emerald me-2"></i>Color: ${v.color}</div></div>
                </div>

                <div class="p-3 bg-dark-subtle rounded-3 mb-4">
                    <h6 class="fw-bold text-light mb-2"><i class="bi bi-geo-alt text-emerald me-2"></i>Pickup Station</h6>
                    <p class="text-secondary small m-0">${v.location ? v.location.name + ' - ' + v.location.address + ', ' + v.location.city : 'Central Station'}</p>
                    <small class="text-muted">Operating Hours: ${v.location ? v.location.openingTime + ' - ' + v.location.closingTime : '06:00 AM - 11:00 PM'}</small>
                </div>

                <div class="d-flex justify-content-between align-items-center p-3 bg-dark-subtle rounded-3 mb-4">
                    <div><span class="text-secondary small d-block">Hourly Rate</span><span class="fs-4 fw-bold text-emerald">$${v.pricePerHour}</span></div>
                    <div><span class="text-secondary small d-block">Daily Rate</span><span class="fs-4 fw-bold text-light">$${v.pricePerDay}</span></div>
                    <div><span class="text-secondary small d-block">Security Deposit</span><span class="fs-5 fw-semibold text-warning">$${v.securityDeposit}</span></div>
                </div>

                <div class="d-flex gap-3">
                    <button class="btn btn-emerald btn-lg flex-fill py-3 rounded-pill" onclick="prepareBooking(${v.id})">
                        Reserve This Bike
                    </button>
                    <button class="btn btn-dark-glass btn-lg px-4 rounded-circle" onclick="toggleWishlist(${v.id})">
                        <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// PAGE 4: BOOKING & COUPON VALIDATION
function prepareBooking(vehicleId) {
    if (!state.token) {
        alert('Please log in or register to book a vehicle.');
        openAuthModal('login');
        return;
    }

    const v = state.selectedVehicle;
    if (!v) return;

    document.getElementById('booking-vehicle-id').value = v.id;
    document.getElementById('booking-vehicle-title').value = `${v.brand} ${v.model} ($${v.pricePerHour}/hr)`;

    // Set default pickup/return times
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 2);

    document.getElementById('booking-pickup-time').value = now.toISOString().slice(0, 16);
    document.getElementById('booking-return-time').value = tomorrow.toISOString().slice(0, 16);

    if (v.location) {
        document.getElementById('booking-pickup-location').value = v.location.id;
        document.getElementById('booking-return-location').value = v.location.id;
    }

    recalculateBookingPrices();
    showView('booking');
}

function recalculateBookingPrices() {
    const v = state.selectedVehicle;
    if (!v) return;

    const pickupStr = document.getElementById('booking-pickup-time').value;
    const returnStr = document.getElementById('booking-return-time').value;

    if (!pickupStr || !returnStr) return;

    const pDate = new Date(pickupStr);
    const rDate = new Date(returnStr);
    const diffHours = Math.max(1, Math.ceil((rDate - pDate) / (1000 * 60 * 60)));

    let rentalCost = 0;
    if (diffHours < 24) {
        rentalCost = diffHours * parseFloat(v.pricePerHour);
    } else {
        const days = Math.floor(diffHours / 24);
        const remHours = diffHours % 24;
        rentalCost = (days * parseFloat(v.pricePerDay)) + (remHours * parseFloat(v.pricePerHour));
    }

    state.calculatedRentalCost = rentalCost;
    state.calculatedDeposit = parseFloat(v.securityDeposit);

    let taxable = Math.max(0, state.calculatedRentalCost - state.calculatedDiscount);
    state.calculatedTax = taxable * 0.18;
    state.calculatedTotal = taxable + state.calculatedTax + state.calculatedDeposit;

    document.getElementById('bk-rental-cost').innerText = '$' + state.calculatedRentalCost.toFixed(2);
    document.getElementById('bk-discount').innerText = '-$' + state.calculatedDiscount.toFixed(2);
    document.getElementById('bk-tax').innerText = '$' + state.calculatedTax.toFixed(2);
    document.getElementById('bk-deposit').innerText = '$' + state.calculatedDeposit.toFixed(2);
    document.getElementById('bk-total').innerText = '$' + state.calculatedTotal.toFixed(2);
}

async function handleApplyCoupon() {
    const code = document.getElementById('booking-coupon-code').value.trim();
    const feedback = document.getElementById('coupon-feedback');

    if (!code) {
        feedback.className = 'mt-2 small text-danger';
        feedback.innerText = 'Please enter a valid coupon code.';
        return;
    }

    try {
        const res = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code, bookingAmount: state.calculatedRentalCost })
        });
        const data = await res.json();
        if (data.success && data.data && data.data.valid) {
            state.appliedCoupon = code;
            state.calculatedDiscount = parseFloat(data.data.discountAmount);
            feedback.className = 'mt-2 small text-emerald fw-bold';
            feedback.innerText = data.data.message;
            recalculateBookingPrices();
        } else {
            state.appliedCoupon = null;
            state.calculatedDiscount = 0;
            feedback.className = 'mt-2 small text-danger';
            feedback.innerText = data.data ? data.data.message : 'Invalid coupon code';
            recalculateBookingPrices();
        }
    } catch (e) {
        feedback.className = 'mt-2 small text-danger';
        feedback.innerText = 'Failed to validate coupon';
    }
}

async function handleCreateBooking(event) {
    event.preventDefault();

    const payload = {
        vehicleId: parseInt(document.getElementById('booking-vehicle-id').value),
        pickupLocationId: parseInt(document.getElementById('booking-pickup-location').value),
        returnLocationId: parseInt(document.getElementById('booking-return-location').value),
        pickupDateTime: document.getElementById('booking-pickup-time').value,
        returnDateTime: document.getElementById('booking-return-time').value,
        couponCode: state.appliedCoupon
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.data) {
            state.activeBooking = data.data;
            document.getElementById('pay-booking-code').innerText = `Booking Code: ${data.data.bookingCode}`;
            document.getElementById('pay-total-amount').innerText = `$${data.data.totalAmount.toFixed(2)}`;
            showView('payment');
        } else {
            alert(data.message || 'Failed to create booking.');
        }
    } catch (e) { alert('Error creating booking reservation.'); }
}

// PAGE 5: PAYMENT
let selectedPaymentMethod = 'ONLINE';
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
}

async function executeMockPayment(success) {
    if (!state.activeBooking) return;

    try {
        // Step 1: Create Payment Transaction Order
        const createRes = await fetch('/api/payments/create', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ bookingId: state.activeBooking.id, paymentMethod: selectedPaymentMethod })
        });
        const createData = await createRes.json();
        if (!createData.success || !createData.data) {
            alert('Failed to initialize payment gateway.');
            return;
        }

        const paymentId = createData.data.id;

        // Step 2: Confirm Payment Transaction Result
        const confirmRes = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ paymentId: paymentId, success: success, transactionReference: 'RZP_MOCK_' + Date.now() })
        });
        const confirmData = await confirmRes.json();

        if (confirmData.success) {
            document.getElementById('conf-booking-code').innerText = state.activeBooking.bookingCode;
            document.getElementById('conf-vehicle').innerText = `${state.activeBooking.vehicle ? state.activeBooking.vehicle.brand + ' ' + state.activeBooking.vehicle.model : 'Bike Specs'}`;
            document.getElementById('conf-pickup-time').innerText = state.activeBooking.pickupDateTime;
            
            document.getElementById('conf-download-invoice-btn').onclick = () => downloadInvoicePdf(state.activeBooking.id);

            showView('confirmation');
        } else {
            alert('Payment transaction failed.');
        }
    } catch (e) { alert('Payment processing error.'); }
}

function downloadInvoicePdf(bookingId) {
    const token = state.token;
    fetch(`/api/invoices/booking/${bookingId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_Booking_${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(e => alert('Failed to download PDF invoice.'));
}

// PAGE 7: MY BOOKINGS & CANCELLATION PREVIEW
let rawMyBookings = [];
let currentBookingTab = 'ALL';

async function loadMyBookings() {
    if (!state.token) return;

    try {
        const res = await fetch('/api/bookings/my?page=0&size=50', { headers: getAuthHeader() });
        const data = await res.json();
        if (data.success && data.data && data.data.content) {
            rawMyBookings = data.data.content;
            filterMyBookingsTab(currentBookingTab);
        }
    } catch (e) { console.error('Failed to load my bookings', e); }
}

function filterMyBookingsTab(tab) {
    currentBookingTab = tab;

    // Update active tab UI
    document.querySelectorAll('#my-bookings-tabs .nav-link').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`tab-${tab.toLowerCase()}`);
    if (activeBtn) activeBtn.classList.add('active');

    let filtered = rawMyBookings;
    if (tab === 'UPCOMING') {
        filtered = rawMyBookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING');
    } else if (tab === 'ACTIVE') {
        filtered = rawMyBookings.filter(b => b.bookingStatus === 'ACTIVE');
    } else if (tab === 'COMPLETED') {
        filtered = rawMyBookings.filter(b => b.bookingStatus === 'COMPLETED');
    } else if (tab === 'CANCELLED') {
        filtered = rawMyBookings.filter(b => b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REJECTED');
    }

    renderMyBookings(filtered);
}

function renderMyBookings(bookings) {
    const container = document.getElementById('my-bookings-list');
    if (!container) return;

    if (!bookings || bookings.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5">No ${currentBookingTab.toLowerCase()} bookings found.</div>`;
        return;
    }

    let html = '';
    bookings.forEach(b => {
        let badgeClass = 'badge-status-confirmed';
        if (b.bookingStatus === 'ACTIVE') badgeClass = 'badge-status-active';
        if (b.bookingStatus === 'COMPLETED') badgeClass = 'badge-status-completed';
        if (b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REJECTED') badgeClass = 'badge-status-cancelled';

        const bikeTitle = b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'Bike Specifications';
        const pickupLoc = b.pickupLocation ? `${b.pickupLocation.name} (${b.pickupLocation.city})` : 'Pickup Station';
        const returnLoc = b.returnLocation ? `${b.returnLocation.name} (${b.returnLocation.city})` : 'Return Station';

        html += `
            <div class="col-md-6">
                <div class="card-glass p-4 h-100 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span class="text-secondary small d-block">Booking ID</span>
                            <span class="fw-bold text-emerald">${b.bookingCode}</span>
                        </div>
                        <div class="text-end">
                            <span class="badge ${badgeClass} px-3 py-1 rounded-pill mb-1">${b.bookingStatus}</span>
                            <span class="d-block text-muted fs-8">Payment: ${b.paymentStatus}</span>
                        </div>
                    </div>

                    <h5 class="fw-bold text-light mb-3"><i class="bi bi-bicycle me-2 text-emerald"></i>${bikeTitle}</h5>

                    <div class="p-3 bg-dark-subtle rounded-3 mb-3 small">
                        <div class="mb-2"><i class="bi bi-geo-alt text-emerald me-2"></i><strong>Pickup:</strong> ${pickupLoc} <br><span class="text-muted ms-4">${b.pickupDateTime}</span></div>
                        <div><i class="bi bi-flag text-sky me-2"></i><strong>Return:</strong> ${returnLoc} <br><span class="text-muted ms-4">${b.returnDateTime}</span></div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-dark-subtle">
                        <div>
                            <span class="text-secondary small d-block">Total Paid</span>
                            <span class="fs-5 fw-bold text-emerald">$${b.totalAmount ? b.totalAmount.toFixed(2) : '0.00'}</span>
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                            <button class="btn btn-dark-glass btn-sm rounded-pill" onclick="showBookingDetailsModal(${b.id})"><i class="bi bi-eye me-1"></i> Details</button>
                            <button class="btn btn-dark-glass btn-sm rounded-pill" onclick="downloadInvoicePdf(${b.id})"><i class="bi bi-file-earmark-pdf me-1"></i> Invoice</button>
                            ${b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING' ? `<button class="btn btn-outline-danger btn-sm rounded-pill" onclick="openCancelModal(${b.id})">Cancel</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function showBookingDetailsModal(id) {
    const booking = rawMyBookings.find(b => b.id === id);
    if (!booking) return;

    const content = document.getElementById('booking-details-content');
    if (!content) return;

    content.innerHTML = `
        <button class="btn btn-outline-secondary rounded-pill px-3 py-1 mb-3" onclick="showView('my-bookings')"><i class="bi bi-arrow-left me-1"></i> Back to My Bookings</button>
        <h3 class="fw-bold text-light mb-3">Booking Details (${booking.bookingCode})</h3>
        
        <div class="p-3 bg-dark-subtle rounded-3 mb-3">
            <div class="d-flex justify-content-between mb-2"><span>Status:</span><span class="fw-bold text-emerald">${booking.bookingStatus}</span></div>
            <div class="d-flex justify-content-between mb-2"><span>Payment Status:</span><span class="fw-bold text-light">${booking.paymentStatus}</span></div>
            <div class="d-flex justify-content-between"><span>Vehicle:</span><span class="fw-bold text-light">${booking.vehicle ? booking.vehicle.brand + ' ' + booking.vehicle.model : 'N/A'}</span></div>
        </div>

        <div class="p-3 bg-dark-subtle rounded-3 mb-4">
            <h6 class="fw-bold text-light mb-2">Financial Summary</h6>
            <div class="d-flex justify-content-between mb-1"><span>Rental Amount:</span><span>$${booking.rentalAmount.toFixed(2)}</span></div>
            <div class="d-flex justify-content-between mb-1 text-emerald"><span>Discount:</span><span>-$${booking.discountAmount.toFixed(2)}</span></div>
            <div class="d-flex justify-content-between mb-1"><span>Tax (18%):</span><span>$${booking.taxAmount.toFixed(2)}</span></div>
            <div class="d-flex justify-content-between mb-1"><span>Security Deposit:</span><span>$${booking.securityDeposit.toFixed(2)}</span></div>
            <hr class="border-secondary">
            <div class="d-flex justify-content-between fs-5 fw-bold text-light"><span>Total Amount:</span><span class="text-emerald">$${booking.totalAmount.toFixed(2)}</span></div>
        </div>

        <div class="d-flex gap-3">
            <button class="btn btn-emerald rounded-pill flex-fill py-2" onclick="downloadInvoicePdf(${booking.id})"><i class="bi bi-file-earmark-pdf me-2"></i>Download PDF Invoice</button>
            ${booking.bookingStatus === 'COMPLETED' ? `<button class="btn btn-outline-emerald rounded-pill flex-fill py-2" onclick="openReviewModal(${booking.id})">Review Vehicle</button>` : ''}
        </div>
    `;

    showView('booking-details');
}

// PAGE 8: ACTIVE RENTAL
async function loadActiveRental() {
    if (!state.token) return;
    const container = document.getElementById('active-rental-container');
    if (!container) return;

    try {
        const res = await fetch('/api/bookings/my', { headers: getAuthHeader() });
        const data = await res.json();
        if (data.success && data.data && data.data.content) {
            const activeBooking = data.data.content.find(b => b.bookingStatus === 'ACTIVE');
            if (activeBooking) {
                container.innerHTML = `
                    <div class="p-3 bg-dark-subtle rounded-3 mb-3">
                        <span class="badge badge-status-active px-3 py-1 rounded-pill mb-2">ACTIVE RENTAL</span>
                        <h4 class="fw-bold text-light">${activeBooking.vehicle ? activeBooking.vehicle.brand + ' ' + activeBooking.vehicle.model : 'Vehicle'}</h4>
                        <p class="text-secondary small m-0">Booking Code: ${activeBooking.bookingCode}</p>
                    </div>
                    <p class="text-secondary">Present bike at the return station prior to deadline (${activeBooking.returnDateTime}). Staff will inspect ending odometer readings.</p>
                `;
            } else {
                container.innerHTML = '<p class="text-muted text-center py-4">You have no currently active rental on the road.</p>';
            }
        }
    } catch (e) { container.innerHTML = '<p class="text-muted text-center py-4">Unable to fetch active rental status.</p>'; }
}

// PAGE 10: WISHLIST
function toggleWishlist(id) {
    if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter(x => x !== id);
    } else {
        state.wishlist.push(id);
    }
    localStorage.setItem('ridego_wishlist', JSON.stringify(state.wishlist));
    updateWishlistCount();
    if (!document.getElementById('wishlist-view').classList.contains('d-none')) {
        renderWishlist();
    }
}

function updateWishlistCount() {
    const el = document.getElementById('wishlist-count');
    if (el) el.innerText = state.wishlist.length;
}

async function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;

    if (state.wishlist.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5">Your wishlist is currently empty.</div>';
        return;
    }

    try {
        const res = await fetch('/api/vehicles/search?size=50');
        const data = await res.json();
        if (data.success && data.data && data.data.content) {
            const savedBikes = data.data.content.filter(b => state.wishlist.includes(b.id));
            renderSearchResults(savedBikes);
        }
    } catch (e) { grid.innerHTML = '<div class="col-12 text-center text-muted">Error loading wishlist bikes.</div>'; }
}

// PAGE 11: NOTIFICATIONS
async function loadNotifications() {
    if (!state.token) return;
    const list = document.getElementById('notifications-list');
    if (!list) return;

    try {
        const res = await fetch('/api/notifications', { headers: getAuthHeader() });
        const data = await res.json();
        if (data.success && data.data && data.data.content) {
            const notifs = data.data.content;
            if (notifs.length === 0) {
                list.innerHTML = '<div class="text-center text-muted py-4">No notifications found.</div>';
                return;
            }
            let html = '';
            notifs.forEach(n => {
                html += `
                    <div class="card-glass p-3 mb-2 d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="fw-bold text-light m-0">${n.title}</h6>
                            <p class="text-secondary small m-0">${n.message}</p>
                            <small class="text-muted fs-8">${n.createdAt}</small>
                        </div>
                        ${!n.read ? `<button class="btn btn-sm btn-outline-emerald" onclick="handleMarkNotificationRead(${n.id})">Mark Read</button>` : '<span class="badge bg-dark-subtle text-muted">Read</span>'}
                    </div>
                `;
            });
            list.innerHTML = html;
        }
    } catch (e) { list.innerHTML = '<div class="text-center text-muted py-4">Failed to load notifications.</div>'; }
}

async function handleMarkNotificationRead(id) {
    try {
        await fetch(`/api/notifications/${id}/read`, { method: 'PUT', headers: getAuthHeader() });
        loadNotifications();
    } catch (e) {}
}

async function handleMarkAllNotificationsRead() {
    try {
        await fetch(`/api/notifications/read-all`, { method: 'PUT', headers: getAuthHeader() });
        loadNotifications();
    } catch (e) {}
}

// PAGE 12: PROFILE & AUTH MODAL
function loadUserProfile() {
    if (!state.user) return;
    document.getElementById('profile-name').value = state.user.name || '';
    document.getElementById('profile-email').value = state.user.email || '';
    document.getElementById('profile-phone').value = state.user.phoneNumber || '';
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    const payload = {
        name: document.getElementById('profile-name').value,
        phoneNumber: document.getElementById('profile-phone').value
    };
    try {
        const res = await fetch('/api/users/me', {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.data) {
            state.user = data.data;
            localStorage.setItem('ridego_user', JSON.stringify(state.user));
            updateAuthHeaderUI();
            alert('Profile updated successfully!');
        }
    } catch (e) { alert('Error updating profile.'); }
}

// AUTHENTICATION MODAL LOGIC
function openAuthModal(mode) {
    document.getElementById('auth-mode').value = mode;
    document.getElementById('authModalTitle').innerText = mode === 'login' ? 'Log In to RideGo' : 'Create RideGo Account';
    document.getElementById('auth-submit-btn').innerText = mode === 'login' ? 'Log In' : 'Register Account';

    if (mode === 'register') {
        document.getElementById('register-name-group').classList.remove('d-none');
        document.getElementById('register-phone-group').classList.remove('d-none');
    } else {
        document.getElementById('register-name-group').classList.add('d-none');
        document.getElementById('register-phone-group').classList.add('d-none');
    }

    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    modal.show();
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    const mode = document.getElementById('auth-mode').value;
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    let endpoint = '/api/auth/login';
    let payload = { email: email, password: password };

    if (mode === 'register') {
        endpoint = '/api/auth/register';
        payload.name = document.getElementById('auth-name').value;
        payload.phoneNumber = document.getElementById('auth-phone').value;
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.data) {
            state.token = data.data.token || data.data.accessToken;
            state.user = data.data.user || { name: data.data.name, email: data.data.email };
            
            localStorage.setItem('ridego_token', state.token);
            localStorage.setItem('ridego_user', JSON.stringify(state.user));
            
            updateAuthHeaderUI();
            bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
            alert('Authentication successful!');
        } else {
            alert(data.message || 'Authentication failed.');
        }
    } catch (e) { alert('Authentication request error.'); }
}

function logoutUser() {
    localStorage.removeItem('ridego_token');
    localStorage.removeItem('ridego_user');
    sessionStorage.clear();
    state.token = null;
    state.user = null;
    updateAuthHeaderUI();
    showView('home');
}

// CANCELLATION & REVIEW MODALS
async function openCancelModal(bookingId) {
    try {
        const res = await fetch(`/api/bookings/${bookingId}/cancellation-preview`, { headers: getAuthHeader() });
        const data = await res.json();
        if (data.success && data.data) {
            const preview = data.data;
            document.getElementById('cancel-modal-body').innerHTML = `
                <p class="text-secondary">Refund calculation based on pickup time rule:</p>
                <div class="p-3 bg-dark-subtle rounded-3 mb-3">
                    <div class="d-flex justify-content-between mb-1"><span>Hours to Pickup:</span><span class="fw-bold">${preview.hoursBeforePickup} Hours</span></div>
                    <div class="d-flex justify-content-between mb-1"><span>Eligible Refund Rate:</span><span class="fw-bold text-emerald">${preview.refundPercentage}%</span></div>
                    <div class="d-flex justify-content-between mb-1"><span>Refund Amount:</span><span class="fw-bold text-emerald">$${preview.refundAmount.toFixed(2)}</span></div>
                    <div class="d-flex justify-content-between"><span>Cancellation Fee:</span><span class="fw-bold text-danger">$${preview.cancellationFee.toFixed(2)}</span></div>
                </div>
                <button class="btn btn-danger w-100 py-3 rounded-pill" onclick="executeCancellation(${bookingId})">Confirm Cancellation</button>
            `;
            new bootstrap.Modal(document.getElementById('cancelModal')).show();
        }
    } catch (e) { alert('Error previewing cancellation refund.'); }
}

async function executeCancellation(bookingId) {
    try {
        const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ reason: 'Cancelled by customer' })
        });
        const data = await res.json();
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('cancelModal')).hide();
            alert('Reservation cancelled successfully!');
            loadMyBookings();
        }
    } catch (e) { alert('Cancellation failed.'); }
}

function openReviewModal(bookingId) {
    document.getElementById('review-booking-id').value = bookingId;
    new bootstrap.Modal(document.getElementById('reviewModal')).show();
}

async function handleReviewSubmit(event) {
    event.preventDefault();
    const payload = {
        bookingId: parseInt(document.getElementById('review-booking-id').value),
        rating: parseInt(document.getElementById('review-rating').value),
        comment: document.getElementById('review-comment').value
    };

    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
            alert('Thank you! Review submitted successfully.');
        } else {
            alert(data.message || 'Failed to submit review.');
        }
    } catch (e) { alert('Review submission error.'); }
}
