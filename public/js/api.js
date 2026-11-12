// API Client for Nova Luxe Storefront
const API = {
  baseUrl: '/api',

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

  async validateCoupon(code) {
    const res = await fetch(`${this.baseUrl}/orders/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return await res.json();
  },

  async createOrder(orderPayload) {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  async updateOrderStatus(id, status) {
    const res = await fetch(`${this.baseUrl}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  }
};
