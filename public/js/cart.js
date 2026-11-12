// Cart State & Drawer Manager
const Cart = {
  items: [],
  appliedCoupon: null,

  init() {
    this.load();
    this.renderBadge();
    this.injectDrawer();
    this.bindGlobalEvents();
  },

  load() {
    try {
      const saved = localStorage.getItem('nova_cart');
      this.items = saved ? JSON.parse(saved) : [];
      const savedCoupon = localStorage.getItem('nova_coupon');
      this.appliedCoupon = savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch (e) {
      this.items = [];
      this.appliedCoupon = null;
    }
  },

  save() {
    localStorage.setItem('nova_cart', JSON.stringify(this.items));
    if (this.appliedCoupon) {
      localStorage.setItem('nova_coupon', JSON.stringify(this.appliedCoupon));
    } else {
      localStorage.removeItem('nova_coupon');
    }
    this.renderBadge();
    this.renderDrawer();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: this.items } }));
  },

  addItem(product, quantity = 1, color = null) {
    const selectedColor = color || (product.colors && product.colors[0]) || 'Standard';
    const existingIndex = this.items.findIndex(
      item => item.id === product.id && item.color === selectedColor
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : product.image,
        color: selectedColor,
        quantity: quantity
      });
    }

    this.save();
    Toast.success(`Added ${product.name} to cart!`);
    this.openDrawer();
  },

  updateQty(id, color, delta) {
    const item = this.items.find(i => i.id === id && i.color === color);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(id, color);
    } else {
      this.save();
    }
  },

  removeItem(id, color) {
    this.items = this.items.filter(i => !(i.id === id && i.color === color));
    this.save();
    Toast.info('Item removed from cart');
  },

  clear() {
    this.items = [];
    this.appliedCoupon = null;
    this.save();
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  renderBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'grid' : 'none';
      badge.classList.remove('bump');
      void badge.offsetWidth; // trigger reflow
      if (count > 0) badge.classList.add('bump');
    });
  },

  injectDrawer() {
    if (document.getElementById('cart-drawer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cart-drawer-overlay';
    overlay.className = 'cart-drawer-overlay';
    overlay.innerHTML = `
      <div class="cart-drawer">
        <div class="cart-drawer-header">
          <div class="cart-drawer-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Your Cart (<span id="drawer-item-count">0</span>)
          </div>
          <button class="cart-close-btn" id="drawer-close-btn" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="free-shipping-progress" id="drawer-free-shipping">
          <div class="progress-text" id="free-shipping-text">Add $100.00 more for Free Shipping!</div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" id="free-shipping-bar" style="width: 0%"></div>
          </div>
        </div>

        <div class="cart-drawer-items" id="drawer-items-list">
          <!-- Dynamically populated -->
        </div>

        <div class="cart-drawer-footer" id="drawer-footer">
          <div class="cart-summary-line">
            <span>Subtotal</span>
            <span id="drawer-subtotal">$0.00</span>
          </div>
          <div class="cart-summary-line total-line">
            <span>Estimated Total</span>
            <span id="drawer-total">$0.00</span>
          </div>
          <div class="cart-drawer-actions">
            <a href="/checkout.html" class="btn-primary" style="justify-content: center;">
              Proceed to Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
            <a href="/cart.html" class="btn-secondary" style="justify-content: center;">View Detailed Cart</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeDrawer();
    });

    document.getElementById('drawer-close-btn').addEventListener('click', () => {
      this.closeDrawer();
    });

    this.renderDrawer();
  },

  openDrawer() {
    this.renderDrawer();
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) overlay.classList.add('active');
  },

  closeDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) overlay.classList.remove('active');
  },

  renderDrawer() {
    const list = document.getElementById('drawer-items-list');
    const countSpan = document.getElementById('drawer-item-count');
    const subtotalSpan = document.getElementById('drawer-subtotal');
    const totalSpan = document.getElementById('drawer-total');
    const freeShippingText = document.getElementById('free-shipping-text');
    const freeShippingBar = document.getElementById('free-shipping-bar');
    const footer = document.getElementById('drawer-footer');

    if (!list) return;

    const totalCount = this.getCount();
    const subtotal = this.getSubtotal();

    if (countSpan) countSpan.textContent = totalCount;
    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `$${subtotal.toFixed(2)}`;

    // Free shipping threshold: $100
    const threshold = 100;
    if (freeShippingText && freeShippingBar) {
      if (subtotal >= threshold) {
        freeShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked Free Standard Shipping!`;
        freeShippingBar.style.width = '100%';
      } else {
        const remaining = (threshold - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
        freeShippingText.innerHTML = `Add <strong>$${remaining}</strong> more for <strong>Free Shipping!</strong>`;
        freeShippingBar.style.width = `${percent}%`;
      }
    }

    if (this.items.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <h3>Your cart is empty</h3>
          <p style="font-size: 0.88rem; margin-top: 0.5rem;">Explore our curated tech and lifestyle collection to get started.</p>
          <a href="/index.html#products" class="btn-primary" style="margin-top: 1.5rem; font-size: 0.85rem;" onclick="Cart.closeDrawer()">Start Shopping</a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    list.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-variant">Variant: ${item.color}</div>
          <div class="cart-item-bottom">
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            <div class="qty-control">
              <button class="qty-btn" onclick="Cart.updateQty('${item.id}', '${item.color}', -1)" aria-label="Decrease quantity">−</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn" onclick="Cart.updateQty('${item.id}', '${item.color}', 1)" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.removeItem('${item.id}', '${item.color}')" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `).join('');
  },

  bindGlobalEvents() {
    document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });
  }
};

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});
