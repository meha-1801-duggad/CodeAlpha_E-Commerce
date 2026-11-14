// API Client for Nova Luxe Storefront
const API = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('nova_auth_token');
  },

  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth Endpoints
  async register(userData) {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  },

  async login(credentials) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return await res.json();
  },

  // Products Endpoints
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/products${query ? '?' + query : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${this.baseUrl}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
  },

  async getCategories() {
    const res = await fetch(`${this.baseUrl}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  },

  async checkPincode(pincode) {
    const res = await fetch(`${this.baseUrl}/products/check-pincode/${pincode}`);
    return await res.json();
  },

  async validateCoupon(code, subtotal = 0) {
    const res = await fetch(`${this.baseUrl}/orders/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return await res.json();
  },

  // Orders Endpoints
  async createOrder(orderPayload) {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderPayload)
    });
    return await res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${this.baseUrl}/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return await res.json();
  },

  async getOrders() {
    const res = await fetch(`${this.baseUrl}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${this.baseUrl}/orders/user/my-orders`, {
      headers: this.getAuthHeaders()
    });
    return await res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${this.baseUrl}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  }
};
