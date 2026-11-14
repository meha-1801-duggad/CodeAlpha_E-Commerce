// Checkout Page Logic with Indian Payments & GST
let selectedShipping = 'standard';
let selectedPayment = 'upi';
let appliedCouponData = null;

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  setupAutofill();
  setupShippingOptions();
  setupPaymentTabs();
  setupCouponForm();
  setupOrderSubmission();
  prefillLoggedInUser();
  window.addEventListener('authChanged', prefillLoggedInUser);
});

function prefillLoggedInUser() {
  if (Auth && Auth.isLoggedIn() && Auth.user) {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (nameInput && !nameInput.value) nameInput.value = Auth.user.name;
    if (emailInput && !emailInput.value) emailInput.value = Auth.user.email;
    if (phoneInput && !phoneInput.value && Auth.user.phone) phoneInput.value = Auth.user.phone;
  }
}

function calculateOrderTotals() {
  const subtotal = Cart.getSubtotal();
  
  // Shipping: Free above ₹999, else ₹99; Express is ₹199
  let shippingCost = 0;
  if (selectedShipping === 'express') {
    shippingCost = 199;
  } else {
    shippingCost = subtotal >= 999 ? 0 : 99;
  }

  // Discount
  let discount = 0;
  if (appliedCouponData) {
    if (appliedCouponData.discountPercent) {
      discount = Math.round((subtotal * appliedCouponData.discountPercent) / 100);
    } else if (appliedCouponData.flatAmount) {
      discount = Math.min(subtotal, appliedCouponData.flatAmount);
    }
    if (appliedCouponData.freeShipping) {
      shippingCost = 0;
    }
  }

  // GST Breakdown: 18% GST (9% CGST + 9% SGST)
  const taxableAmount = Math.max(0, subtotal - discount);
  const cgst = Math.round(taxableAmount * 0.09);
  const sgst = Math.round(taxableAmount * 0.09);
  const totalGst = cgst + sgst;
  const total = Math.max(0, taxableAmount + shippingCost + totalGst);

  return { subtotal, shippingCost, discount, cgst, sgst, totalGst, total };
}

function renderCheckoutSummary() {
  const itemsContainer = document.getElementById('checkout-items-summary');
  const emptyState = document.getElementById('checkout-empty-state');
  const formSection = document.getElementById('checkout-form-section');

  if (Cart.items.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (formSection) formSection.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (formSection) formSection.style.display = 'grid';

  if (itemsContainer) {
    itemsContainer.innerHTML = Cart.items.map(item => `
      <div style="display: flex; gap: 0.85rem; align-items: center; margin-bottom: 0.85rem; padding-bottom: 0.85rem; border-bottom: 1px solid var(--border-light);">
        <img src="${item.image}" alt="${item.name}" style="width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-light);">
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.88rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-main);">${item.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Qty: ${item.quantity} · ${item.color}</div>
        </div>
        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">${formatINR(item.price * item.quantity)}</div>
      </div>
    `).join('');
  }

  const { subtotal, shippingCost, discount, cgst, sgst, total } = calculateOrderTotals();

  document.getElementById('summary-subtotal').textContent = formatINR(subtotal);
  
  const discountRow = document.getElementById('summary-discount-row');
  const discountVal = document.getElementById('summary-discount');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    discountVal.textContent = `-${formatINR(discount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('summary-shipping').textContent = shippingCost === 0 ? 'FREE' : formatINR(shippingCost);
  document.getElementById('summary-cgst').textContent = formatINR(cgst);
  document.getElementById('summary-sgst').textContent = formatINR(sgst);
  document.getElementById('summary-total').textContent = formatINR(total);
}

// Indian Demo Autofill
function setupAutofill() {
  const btn = document.getElementById('btn-autofill-demo');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.getElementById('fullName').value = 'Rahul Sharma';
    document.getElementById('email').value = 'rahul.sharma@example.com';
    document.getElementById('phone').value = '9876543210';
    document.getElementById('address').value = 'Flat 402, Green Glen Layout, Bellandur';
    document.getElementById('city').value = 'Bengaluru';
    document.getElementById('state').value = 'Karnataka';
    document.getElementById('zip').value = '560103';
    
    // Select UPI & fill test VPA
    const upiInput = document.getElementById('upiIdInput');
    if (upiInput) upiInput.value = 'rahul@okaxis';

    Toast.success('Indian customer details auto-filled (Bengaluru, Karnataka)!');
  });
}

function setupShippingOptions() {
  const options = document.querySelectorAll('.shipping-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedShipping = opt.dataset.method;
      renderCheckoutSummary();
    });
  });
}

function setupPaymentTabs() {
  const tabs = document.querySelectorAll('.payment-tab');
  const upiSec = document.getElementById('payment-upi-section');
  const cardSec = document.getElementById('payment-card-section');
  const netSec = document.getElementById('payment-netbanking-section');
  const codSec = document.getElementById('payment-cod-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedPayment = tab.dataset.payment;

      if (upiSec) upiSec.style.display = selectedPayment === 'upi' ? 'block' : 'none';
      if (cardSec) cardSec.style.display = selectedPayment === 'card' ? 'block' : 'none';
      if (netSec) netSec.style.display = selectedPayment === 'netbanking' ? 'block' : 'none';
      if (codSec) codSec.style.display = selectedPayment === 'cod' ? 'block' : 'none';
    });
  });
}

function setupCouponForm() {
  const btn = document.getElementById('btn-apply-coupon');
  const input = document.getElementById('coupon-code-input');
  if (!btn || !input) return;

  btn.addEventListener('click', async () => {
    const code = input.value.trim().toUpperCase();
    if (!code) {
      Toast.error('Please enter a coupon code (Try: FESTIVE20 or INDIA10)');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Applying...';

    try {
      const data = await API.validateCoupon(code, Cart.getSubtotal());
      if (data.success && data.coupon) {
        appliedCouponData = data.coupon;
        Toast.success(`Coupon "${code}" applied: ${data.coupon.description}!`);
        input.disabled = true;
        btn.textContent = 'Applied';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#fff';
        renderCheckoutSummary();
      } else {
        Toast.error(data.error || 'Invalid coupon code');
        btn.textContent = 'Apply';
        btn.disabled = false;
      }
    } catch {
      Toast.error('Could not validate coupon code');
      btn.textContent = 'Apply';
      btn.disabled = false;
    }
  });
}

function setupOrderSubmission() {
  const form = document.getElementById('checkout-form');
  const submitBtn = document.getElementById('btn-place-order');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (Cart.items.length === 0) {
      Toast.error('Your cart is empty');
      return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zip = document.getElementById('zip').value.trim();

    if (!fullName || !phone || !address || !city || !zip) {
      Toast.error('Please fill in complete Indian shipping address and phone number');
      return;
    }

    if (zip.length !== 6 || isNaN(zip)) {
      Toast.error('PIN code must be exactly 6 digits');
      return;
    }

    const upiId = document.getElementById('upiIdInput')?.value.trim();

    const payload = {
      items: Cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        color: item.color
      })),
      shippingDetails: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        pincode: zip,
        country: 'India'
      },
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      upiId: selectedPayment === 'upi' ? (upiId || 'PhonePe / GPay QR') : null,
      couponCode: appliedCouponData ? appliedCouponData.code : null
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
      Processing Secure Payment with Bank / UPI Gateway...
    `;

    try {
      const response = await API.createOrder(payload);
      if (response.success && response.order) {
        Cart.clear();
        Toast.success('Order placed successfully! Generating GST Invoice...');
        window.location.href = `order-confirmation.html?id=${response.order.id}`;
      } else {
        Toast.error(response.error || 'Failed to place order');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Order & Pay Now';
      }
    } catch (err) {
      Toast.error('Error submitting order: ' + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Order & Pay Now';
    }
  });
}
