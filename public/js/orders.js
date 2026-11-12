// Order Confirmation & Live Tracking Logic
let currentOrder = null;

const STATUS_FLOW = ["Order Placed", "Processing", "Shipped", "Delivered"];

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('id');

  setupOrderLookupForm();

  if (orderId) {
    await loadOrderDetails(orderId);
  } else {
    // If no order ID in query, try showing order lookup form or most recent order
    await loadRecentOrderOrShowSearch();
  }
});

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
  } catch (err) {
    showError('Search for your Order ID above.');
  }
}

function renderOrderPage() {
  const details = document.getElementById('order-details-container');
  if (details) details.style.display = 'block';

  // Basic Info
  document.getElementById('display-order-id').textContent = currentOrder.id;
  document.getElementById('display-order-date').textContent = new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('display-order-status-badge').textContent = currentOrder.status;

  // Render Stepper Timeline
  renderStepper();

  // Shipping & Payment Info
  const ship = currentOrder.shippingDetails;
  document.getElementById('display-customer-name').textContent = ship.fullName;
  document.getElementById('display-shipping-address').textContent = `${ship.address}, ${ship.city}, ${ship.state} ${ship.zip}`;
  document.getElementById('display-customer-email').textContent = ship.email;
  document.getElementById('display-shipping-method').textContent = currentOrder.shippingMethod;
  document.getElementById('display-payment-method').textContent = currentOrder.paymentMethod;

  // Order Items
  const itemsContainer = document.getElementById('invoice-items-tbody');
  if (itemsContainer) {
    itemsContainer.innerHTML = currentOrder.items.map(item => `
      <tr>
        <td style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
          <div>
            <div style="font-weight: 600;">${item.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${item.color}</div>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  // Pricing Breakdown
  const p = currentOrder.pricing;
  document.getElementById('invoice-subtotal').textContent = `$${p.subtotal.toFixed(2)}`;
  
  const discountRow = document.getElementById('invoice-discount-row');
  if (p.discount && p.discount > 0) {
    discountRow.style.display = 'table-row';
    document.getElementById('invoice-discount').textContent = `-$${p.discount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('invoice-shipping').textContent = p.shipping === 0 ? 'FREE' : `$${p.shipping.toFixed(2)}`;
  document.getElementById('invoice-tax').textContent = `$${p.tax.toFixed(2)}`;
  document.getElementById('invoice-total').textContent = `$${p.total.toFixed(2)}`;

  // Attach status simulate button
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
    btn.textContent = 'Order Delivered (Completed)';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    return;
  }

  const nextStatus = STATUS_FLOW[currentIdx + 1];
  btn.disabled = false;
  btn.style.opacity = '1';
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    Simulate Next: Advance to "${nextStatus}"
  `;

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = 'Updating status...';

    try {
      const res = await API.updateOrderStatus(currentOrder.id, nextStatus);
      if (res.success && res.order) {
        currentOrder = res.order;
        Toast.success(`Status updated to "${nextStatus}"!`);
        renderOrderPage();
      } else {
        Toast.error(res.error || 'Failed to update order status');
        btn.disabled = false;
      }
    } catch (err) {
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
      window.location.href = `/orders.html?id=${id}`;
    });
  }
}

function showError(msg) {
  const errorBox = document.getElementById('order-error');
  if (errorBox) {
    errorBox.style.display = 'block';
    errorBox.innerHTML = `
      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; color: #f87171; max-width: 500px; margin: 2rem auto;">
        <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;">Order Lookup Notice</h4>
        <p style="font-size: 0.9rem;">${msg}</p>
        <a href="/index.html" class="btn-secondary" style="margin-top: 1rem; display: inline-block;">Return to Catalog</a>
      </div>
    `;
  }
}
