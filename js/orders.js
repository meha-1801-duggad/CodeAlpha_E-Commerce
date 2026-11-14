// Order Confirmation, Live Tracking & GST Invoice Logic
let currentOrder = null;

const STATUS_FLOW = ["Order Placed", "Processing", "Shipped", "Delivered"];

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('id');

  setupOrderLookupForm();
  await loadUserOrderHistory();

  if (orderId) {
    await loadOrderDetails(orderId);
  } else {
    await loadRecentOrderOrShowSearch();
  }
});

async function loadUserOrderHistory() {
  const historySec = document.getElementById('user-orders-history-section');
  const countBadge = document.getElementById('user-orders-count-badge');
  const tableWrap = document.getElementById('user-orders-table-wrap');

  if (!historySec || !API.getToken()) return;

  try {
    const res = await API.getMyOrders();
    if (res.success && res.orders && res.orders.length > 0) {
      historySec.style.display = 'block';
      if (countBadge) countBadge.textContent = `${res.orders.length} Orders`;
      if (tableWrap) {
        tableWrap.innerHTML = `
          <table class="invoice-table" style="margin-bottom: 0;">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (INR)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${res.orders.map(o => `
                <tr>
                  <td style="font-weight: 800; color: var(--primary);">${o.id}</td>
                  <td style="font-size: 0.85rem;">${new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style="font-size: 0.88rem;">${o.items.map(i => i.name).join(', ')}</td>
                  <td style="font-weight: 800;">${formatINR(o.pricing.total)}</td>
                  <td>
                    <span class="card-badge" style="position: static; font-size: 0.75rem; background: var(--primary);">${o.status}</span>
                  </td>
                  <td>
                    <a href="orders.html?id=${o.id}" class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: 700;">
                      View Details & Invoice
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    }
  } catch (err) {
    console.error('Failed to load user orders history', err);
  }
}

async function loadOrderDetails(orderId) {
  const loading = document.getElementById('order-loading');
  const details = document.getElementById('order-details-container');
  const errorBox = document.getElementById('order-error');

  if (loading) loading.style.display = 'block';
  if (details) details.style.display = 'none';
  if (errorBox) errorBox.style.display = 'none';

  try {
    const data = await API.getOrder(orderId);
    if (!data.success || !data.order) {
      showError(`Order "${orderId}" not found. Please verify the ID.`);
      return;
    }

    currentOrder = data.order;
    renderOrderPage();
  } catch (err) {
    showError('Failed to load order. Make sure the server is reachable.');
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

async function loadRecentOrderOrShowSearch() {
  try {
    const data = await API.getOrders();
    if (data.success && data.orders && data.orders.length > 0) {
      currentOrder = data.orders[0];
      renderOrderPage();
    } else {
      showError('No recent orders found. Place an order from the shop!');
    }
  } catch {
    showError('Search for your Order ID above.');
  }
}

function renderOrderPage() {
  const details = document.getElementById('order-details-container');
  if (details) details.style.display = 'block';

  // Basic Info
  document.getElementById('display-order-id').textContent = currentOrder.id;
  document.getElementById('display-order-date').textContent = new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('display-order-status-badge').textContent = currentOrder.status;

  // Render Stepper Timeline
  renderStepper();

  // Customer & Shipping Info
  const ship = currentOrder.shippingDetails;
  document.getElementById('display-customer-name').textContent = ship.fullName;
  document.getElementById('display-shipping-address').textContent = `${ship.address}, ${ship.city}, ${ship.state} - ${ship.pincode || ship.zip}, India`;
  document.getElementById('display-customer-phone').textContent = `+91 ${ship.phone}`;
  document.getElementById('display-shipping-method').textContent = currentOrder.shippingMethod;
  document.getElementById('display-payment-method').textContent = currentOrder.paymentMethod;

  // Items in GST Tax Invoice
  const itemsContainer = document.getElementById('invoice-items-tbody');
  if (itemsContainer) {
    itemsContainer.innerHTML = currentOrder.items.map((item, index) => `
      <tr>
        <td style="font-weight: 600; color: var(--text-muted);">${index + 1}</td>
        <td style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-light);">
          <div>
            <div style="font-weight: 700; color: var(--text-main);">${item.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Variant: ${item.color} | HSN: 85183000</div>
          </div>
        </td>
        <td style="font-weight: 600;">${formatINR(item.price)}</td>
        <td style="font-weight: 700;">${item.quantity}</td>
        <td style="font-weight: 800; color: var(--text-main);">${formatINR(item.price * item.quantity)}</td>
      </tr>
    `).join('');
  }

  // Pricing & GST Breakdown
  const p = currentOrder.pricing;
  document.getElementById('invoice-subtotal').textContent = formatINR(p.subtotal);
  
  const discountRow = document.getElementById('invoice-discount-row');
  if (p.discount && p.discount > 0) {
    discountRow.style.display = 'table-row';
    document.getElementById('invoice-discount').textContent = `-${formatINR(p.discount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('invoice-shipping').textContent = p.shipping === 0 ? 'FREE' : formatINR(p.shipping);
  
  if (document.getElementById('invoice-cgst')) {
    document.getElementById('invoice-cgst').textContent = formatINR(p.cgst || Math.round(p.subtotal * 0.09));
  }
  if (document.getElementById('invoice-sgst')) {
    document.getElementById('invoice-sgst').textContent = formatINR(p.sgst || Math.round(p.subtotal * 0.09));
  }

  document.getElementById('invoice-total').textContent = formatINR(p.total);

  setupSimulateButton();
}

function renderStepper() {
  const currentIdx = STATUS_FLOW.indexOf(currentOrder.status);
  const fillBar = document.getElementById('stepper-fill-bar');
  
  if (fillBar) {
    const percent = currentIdx === 0 ? 0 : (currentIdx / (STATUS_FLOW.length - 1)) * 100;
    fillBar.style.width = `${percent}%`;
  }

  STATUS_FLOW.forEach((statusName, idx) => {
    const stepEl = document.getElementById(`step-${idx + 1}`);
    if (!stepEl) return;

    stepEl.classList.remove('done', 'active');
    if (idx < currentIdx) {
      stepEl.classList.add('done');
    } else if (idx === currentIdx) {
      stepEl.classList.add('active');
    }
  });
}

function setupSimulateButton() {
  const btn = document.getElementById('btn-advance-status');
  if (!btn) return;

  const currentIdx = STATUS_FLOW.indexOf(currentOrder.status);

  if (currentIdx >= STATUS_FLOW.length - 1) {
    btn.textContent = 'Package Delivered (Completed)';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    return;
  }

  const nextStatus = STATUS_FLOW[currentIdx + 1];
  btn.disabled = false;
  btn.style.opacity = '1';
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
    Simulate Next: Advance to "${nextStatus}"
  `;

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = 'Updating BlueDart dispatch status...';

    try {
      const res = await API.updateOrderStatus(currentOrder.id, nextStatus);
      if (res.success && res.order) {
        currentOrder = res.order;
        Toast.success(`Dispatch status advanced to "${nextStatus}"!`);
        renderOrderPage();
      } else {
        Toast.error(res.error || 'Failed to update order status');
        btn.disabled = false;
      }
    } catch {
      Toast.error('Network error updating status');
      btn.disabled = false;
    }
  };
}

function setupOrderLookupForm() {
  const form = document.getElementById('order-lookup-form');
  const input = document.getElementById('lookup-order-id-input');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = input.value.trim().toUpperCase();
      if (!id) return;
      window.location.href = `orders.html?id=${id}`;
    });
  }
}

function showError(msg) {
  const errorBox = document.getElementById('order-error');
  if (errorBox) {
    errorBox.style.display = 'block';
    errorBox.innerHTML = `
      <div style="background: var(--accent-rose-light); border: 1px solid #fecdd3; padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; color: var(--accent-rose); max-width: 500px; margin: 2rem auto;">
        <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">Order Lookup Notice</h4>
        <p style="font-size: 0.9rem; color: #9f1239;">${msg}</p>
        <a href="index.html" class="btn-secondary" style="margin-top: 1rem; display: inline-block;">Return to Storefront</a>
      </div>
    `;
  }
}
