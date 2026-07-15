import api from './api.js';

// --- Auth Utilities ---
function getCurrentUser() {
    const userStr = localStorage.getItem('shs_user');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('shs_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('shs_user');
    window.location.href = 'login.html';
}

function checkAuth(requireRole = null) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    if (requireRole && user.role !== requireRole) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// --- UI Utilities ---
function setupNavbar() {
    const navRight = document.getElementById('nav-right');
    const user = getCurrentUser();
    
    if (navRight) {
        let links = `
            <a href="index.html" class="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">Home</a>
            <a href="properties.html" class="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">Properties</a>
        `;
        
        if (user) {
            navRight.innerHTML = links + `
                <a href="dashboard.html" class="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">Dashboard (${user.role})</a>
                <span class="text-white font-semibold px-3 py-2">Hi, ${user.firstName || user.name || 'User'}</span>
                <button id="logout-btn" class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand bg-white hover:bg-gray-100 focus:outline-none transition-colors shadow-sm">Logout</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to log out?')) {
                    logout();
                }
            });
        } else {
            navRight.innerHTML = links + `
                <a href="login.html" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand bg-white hover:bg-gray-100 focus:outline-none transition-colors">Login / Register</a>
            `;
        }
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 z-50`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-y-10', 'opacity-0');
        notification.classList.add('translate-y-0', 'opacity-100');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('translate-y-0', 'opacity-100');
        notification.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- Page Specific Logic ---
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    
    const path = window.location.pathname;
    
    if (path.endsWith('login.html')) {
        initLoginPage();
    } else if (path.endsWith('dashboard.html')) {
        initDashboardPage();
    } else if (path.endsWith('properties.html')) {
        initPropertiesPage();
    } else {
        // Assume index.html
    }
});

function initPropertiesPage() {
    const propertyList = document.getElementById('property-list');
    if (!propertyList) return;

    const loadProperties = async () => {
        try {
            const properties = await api.getProperties();
            const availableProperties = properties.filter(p => p.status === 'AVAILABLE');
            
            if (availableProperties.length === 0) {
                propertyList.innerHTML = '<div class="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"><p class="text-gray-500 text-lg">No properties available at the moment.</p></div>';
                return;
            }
            
            propertyList.innerHTML = availableProperties.map(p => {
                const imgTag = p.imageUrl 
                    ? `<img src="${p.imageUrl}" alt="${p.title}" class="w-full h-48 object-cover">`
                    : `<div class="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                        <svg class="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                       </div>`;

                return `
                <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                    ${imgTag}
                    <div class="p-6 flex-grow flex flex-col">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${p.title}</h3>
                        <p class="text-gray-600 mb-4 flex-grow text-sm line-clamp-3">${p.description}</p>
                        ${p.contactInfo ? `<p class="text-xs text-gray-500 mb-4"><strong>Contact Landlord:</strong> ${p.contactInfo}</p>` : ''}
                        <div class="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                            <span class="text-2xl font-extrabold text-brand">$${p.price}<span class="text-sm font-normal text-gray-500">/mo</span></span>
                            <span class="text-sm text-gray-500 flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${p.location}</span>
                        </div>
                        <button class="w-full bg-brand text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-sm" onclick="requestRent(${p.propertyId})">Request to Rent</button>
                    </div>
                </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading properties:', error);
            propertyList.innerHTML = '<div class="col-span-full text-center py-12 bg-red-50 rounded-xl border border-red-100"><p class="text-red-500">Failed to load properties. Make sure backend is running.</p></div>';
        }
    };
    
    loadProperties();
}

window.requestRent = async (propertyId) => {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to request a property', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    if (user.role !== 'TENANT') {
        showNotification('Only tenants can request properties', 'error');
        return;
    }
    
    try {
        await api.requestPropertyRent(propertyId, user.userId);
        showNotification('Property request submitted successfully!');
    } catch (error) {
        console.error(error);
        showNotification('Failed to submit request', 'error');
    }
};

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    if(showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }

    if(showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const user = await api.login(email, password);
            setCurrentUser(user);
            showNotification('Login successful!');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
        }
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            role: document.getElementById('reg-role').value,
            phone: document.getElementById('reg-phone').value
        };
        
        try {
            const user = await api.register(userData);
            setCurrentUser(user);
            showNotification('Registration successful!');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            showNotification(error.message || 'Registration failed', 'error');
        }
    });
}

function initDashboardPage() {
    const user = checkAuth();
    if (!user) return;
    
    document.getElementById('dashboard-title').textContent = `${user.role} Dashboard`;
    
    const tenantView = document.getElementById('tenant-view');
    const landlordView = document.getElementById('landlord-view');
    
    if (user.role === 'TENANT') {
        tenantView.style.display = 'block';
        landlordView.style.display = 'none';
        loadTenantDashboard(user.userId);
    } else if (user.role === 'LANDLORD') {
        tenantView.style.display = 'none';
        landlordView.style.display = 'block';
        loadLandlordDashboard(user.userId);
    }
}

async function loadTenantDashboard(tenantId) {
    const container = document.getElementById('tenant-requests');
    try {
        const requests = await api.getRequestsForTenant(tenantId);
        if (requests.length === 0) {
            container.innerHTML = '<div class="col-span-full py-8 text-center"><p class="text-gray-500 italic">You have not requested any properties yet.</p></div>';
            return;
        }
        
        container.innerHTML = requests.map(req => `
            <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900">${req.property.title}</h3>
                        <p class="text-sm text-gray-500 flex items-center mt-1">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ${new Date(req.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }">
                        ${req.status}
                    </span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="col-span-full py-8 text-center"><p class="text-red-500">Failed to load requests.</p></div>';
    }
}

async function loadLandlordDashboard(landlordId) {
    const addPropertyForm = document.getElementById('add-property-form');
    addPropertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const propertyData = {
            title: document.getElementById('prop-title').value,
            description: document.getElementById('prop-desc').value,
            location: document.getElementById('prop-address').value,
            price: parseFloat(document.getElementById('prop-price').value),
            contactInfo: document.getElementById('prop-contact').value,
            status: 'AVAILABLE',
            owner: { userId: landlordId }
        };
        
        try {
            await api.createProperty(propertyData);
            showNotification('Property added successfully!');
            addPropertyForm.reset();
            loadLandlordProperties(landlordId);
        } catch (error) {
            showNotification('Failed to add property', 'error');
        }
    });

    const editForm = document.getElementById('edit-property-form');
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const propId = document.getElementById('edit-prop-id').value;
        const propertyData = {
            title: document.getElementById('edit-prop-title').value,
            description: document.getElementById('edit-prop-desc').value,
            location: document.getElementById('edit-prop-address').value,
            price: parseFloat(document.getElementById('edit-prop-price').value),
            contactInfo: document.getElementById('edit-prop-contact').value,
            status: document.getElementById('edit-prop-status').value,
            rented: document.getElementById('edit-prop-status').value === 'RENTED'
        };
        
        try {
            await api.updateProperty(propId, propertyData);
            showNotification('Property updated successfully!');
            closeEditModal();
            loadLandlordProperties(landlordId);
        } catch (error) {
            showNotification('Failed to update property', 'error');
        }
    });

    loadLandlordProperties(landlordId);
    loadLandlordRequests(landlordId);
}

async function loadLandlordProperties(landlordId) {
    const container = document.getElementById('landlord-properties');
    try {
        const properties = await api.getPropertiesByLandlord(landlordId);
        if (properties.length === 0) {
            container.innerHTML = '<p class="text-gray-500 italic py-4">You have not added any properties yet.</p>';
            return;
        }
        
        // Store properties globally so edit modal can find them
        window.landlordProperties = properties;
        
        container.innerHTML = properties.map(p => `
            <div class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex-1">
                    <h4 class="text-md font-bold text-gray-900">${p.title}</h4>
                    <p class="text-brand font-semibold mt-1">$${p.price}<span class="text-xs text-gray-500 font-normal">/mo</span></p>
                    <p class="text-xs text-gray-400 mt-1">${p.status}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 bg-blue-50 rounded" onclick="openEditModal(${p.propertyId})">Edit</button>
                    <button class="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 bg-red-50 rounded" onclick="deleteProperty(${p.propertyId})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-red-500 py-4">Failed to load properties.</p>';
    }
}

window.openEditModal = (propertyId) => {
    const prop = window.landlordProperties.find(p => p.propertyId === propertyId);
    if (!prop) return;
    
    document.getElementById('edit-prop-id').value = prop.propertyId;
    document.getElementById('edit-prop-title').value = prop.title;
    document.getElementById('edit-prop-desc').value = prop.description;
    document.getElementById('edit-prop-address').value = prop.location;
    document.getElementById('edit-prop-price').value = prop.price;
    document.getElementById('edit-prop-contact').value = prop.contactInfo || '';
    document.getElementById('edit-prop-status').value = prop.status === 'RENTED' ? 'RENTED' : 'AVAILABLE';
    
    document.getElementById('edit-modal').classList.remove('hidden');
};

window.closeEditModal = () => {
    document.getElementById('edit-modal').classList.add('hidden');
};

window.deleteProperty = async (propertyId) => {
    if(!confirm("Are you sure you want to delete this property? This will also remove all associated requests.")) return;
    try {
        await api.deleteProperty(propertyId);
        showNotification('Property deleted');
        const user = getCurrentUser();
        loadLandlordProperties(user.userId);
        loadLandlordRequests(user.userId);
    } catch (error) {
        showNotification('Failed to delete property', 'error');
    }
};

async function loadLandlordRequests(landlordId) {
    const container = document.getElementById('landlord-requests');
    try {
        const requests = await api.getRequestsForLandlord(landlordId);
        if (requests.length === 0) {
            container.innerHTML = '<p class="text-gray-500 italic py-4">No requests for your properties.</p>';
            return;
        }
        
        container.innerHTML = requests.map(req => `
            <div class="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div class="mb-2 sm:mb-0">
                        <h4 class="text-md font-bold text-gray-900">${req.property.title}</h4>
                        <p class="text-sm text-gray-600 mt-1"><span class="font-medium text-gray-800">${req.tenant.name || req.tenant.firstName + ' ' + req.tenant.lastName}</span> &bull; ${req.tenant.email}</p>
                        <p class="text-xs text-gray-500 mt-1">Requested on: ${new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }">
                            ${req.status}
                        </span>
                        ${req.status === 'PENDING' ? `
                            <div class="flex space-x-2">
                                <button class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none" onclick="updateReqStatus(${req.requestId}, 'APPROVED')">Approve</button>
                                <button class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none" onclick="updateReqStatus(${req.requestId}, 'REJECTED')">Reject</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-red-500 py-4">Failed to load requests.</p>';
    }
}

window.updateReqStatus = async (requestId, status) => {
    try {
        await api.updateRequestStatus(requestId, status);
        showNotification(`Request ${status.toLowerCase()}!`);
        const user = getCurrentUser();
        loadLandlordRequests(user.userId);
    } catch (error) {
        showNotification('Failed to update request', 'error');
    }
};
