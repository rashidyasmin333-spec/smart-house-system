const BASE_URL = 'http://localhost:8080/api';

const api = {
    // Auth
    login: async (email, password) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Login failed');
        }
        return response.json();
    },
    register: async (userData) => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Registration failed');
        }
        return response.json();
    },
    async getAllUsers() {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },
    async createUser(userData) {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to create user');
        return await response.json();
    },
    async updateUser(userId, userData) {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to update user');
        return await response.json();
    },
    async deleteUser(userId) {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return true;
    },

    // Properties
    getProperties: async () => {
        const response = await fetch(`${BASE_URL}/properties`);
        return response.json();
    },
    getPropertyById: async (id) => {
        const response = await fetch(`${BASE_URL}/properties/${id}`);
        return response.json();
    },
    getPropertiesByLandlord: async (landlordId) => {
        const response = await fetch(`${BASE_URL}/properties/landlord/${landlordId}`);
        return response.json();
    },
    createProperty: async (propertyData) => {
        const response = await fetch(`${BASE_URL}/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
        });
        if (!response.ok) throw new Error('Failed to create property');
        return response.json();
    },
    updateProperty: async (propertyId, propertyData) => {
        const response = await fetch(`${BASE_URL}/properties/${propertyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
        });
        if (!response.ok) throw new Error('Failed to update property');
        return response.json();
    },
    deleteProperty: async (propertyId) => {
        const response = await fetch(`${BASE_URL}/properties/${propertyId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete property');
        return true;
    },
    requestPropertyRent: async (propertyId, tenantId) => {
        // Need to create request via PropertyRequestController
        const response = await fetch(`${BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                property: { propertyId: propertyId },
                tenant: { userId: tenantId },
                status: 'PENDING'
            })
        });
        if (!response.ok) throw new Error('Failed to request property');
        return response.json();
    },
    updatePropertyStatus: async (propertyId, status) => {
        const response = await fetch(`${BASE_URL}/properties/${propertyId}/status?status=${status}`, {
            method: 'PUT'
        });
        if (!response.ok) throw new Error('Failed to update property status');
        return response.json();
    },
    
    // Requests
    getRequestsForLandlord: async (landlordId) => {
        const response = await fetch(`${BASE_URL}/requests/landlord/${landlordId}`);
        return response.json();
    },
    getRequestsForTenant: async (tenantId) => {
        const response = await fetch(`${BASE_URL}/requests/tenant/${tenantId}`);
        return response.json();
    },
    updateRequestStatus: async (requestId, status) => {
        const response = await fetch(`${BASE_URL}/requests/${requestId}/status?status=${status}`, {
            method: 'PUT'
        });
        if (!response.ok) throw new Error('Failed to update request status');
        return response.json();
    }
};

export default api;
