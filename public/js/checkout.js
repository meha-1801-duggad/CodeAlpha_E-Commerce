// Checkout Page Logic
let selectedShipping = 'standard';
let selectedPayment = 'card';
let appliedCouponData = null;

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  setupAutofill();
  setupShippingOptions();
  setupPaymentTabs();
  setupCardFormatting();
  setupCouponForm();
  setupOrderSubmission();
});

function calculateOrderTotals() {
  const subtotal = Cart.getSubtotal();
  
  // Shipping calculation
  let shippingCost = 0;
  if (selectedShipping === 'express') {
    shippingCost = 14.99;
  } else if (selectedShipping === 'priority') {
    shippingCost = 24.99;
  } else {
    shippingCost = subtotal >= 100 ? 0 : 4.99;
  }

  // Discount
  let discount = 0;
  if (appliedCouponData) {
    if (appliedCouponData.discountPercent) {
      discount = (subtotal * appliedCouponData.discountPercent) / 100;
    }
    if (appliedCouponData.freeShipping) {
      shippingCost = 0;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const total = Math.max(0, Math.round((taxableAmount + shippingCost + tax) * 100) / 100);

  return { subtotal, shippingCost, discount, tax, total };
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
      <div style="display: flex; gap: 0.85rem; align-items: center; margin-bottom: 0.85rem; padding-bottom: 0.85rem; border-bottom: 1px solid var(--border-color);">
        <img src="${item.image}" alt="${item.name}" style="width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-color);">
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Qty: ${item.quantity} · ${item.color}</div>
        </div>
        <div style="font-size: 0.92rem; font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
  }

  const { subtotal, shippingCost, discount, tax, total } = calculateOrderTotals();

  document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  
  const discountRow = document.getElementById('summary-discount-row');
  const discountVal = document.getElementById('summary-discount');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    discountVal.textContent = `-$${discount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('summary-shipping').textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
  document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

// Autofill for instant testing & demo presentations
function setupAutofill() {
  const btn = document.getElementById('btn-autofill-demo');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.getElementById('fullName').value = 'Sarah Connor';
    document.getElementById('email').value = 'sarah.connor@cyberdyne.io';
    document.getElementById('phone').value = '+1 (555) 789-2049';
    document.getElementById('address').value = '404 Resistance Blvd, Suite 101';
    document.getElementById('city').value = 'Los Angeles';
    document.getElementById('state').value = 'CA';
    document.getElementById('zip').value = '90001';
    document.getElementById('cardNumber').value = '4242 4242 4242 4242';
    document.getElementById('cardExpiry').value = '12/28';
    document.getElementById('cardCvc').value = '739';

    // update preview card
    document.getElementById('card-preview-num').textContent = '•••• •••• •••• 4242';
    document.getElementById('card-preview-name').textContent = 'SARAH CONNOR';
    document.getElementById('card-preview-exp').textContent = '12/28';

    Toast.success('Demo customer details auto-filled!');
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
  const cardSection = document.getElementById('payment-card-section');
  const codSection = document.getElementById('payment-cod-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedPayment = tab.dataset.payment;

      if (selectedPayment === 'card') {
        if (cardSection) cardSection.style.display = 'block';
        if (codSection) codSection.style.display = 'none';
      } else {
        if (cardSection) cardSection.style.display = 'none';
        if (codSection) codSection.style.display = 'block';
      }
    });
  });
}

function setupCardFormatting() {
  const cardInput = document.getElementById('cardNumber');
  const previewNum = document.getElementById('card-preview-num');
  const cardNameInput = document.getElementById('fullName');
  const previewName = document.getElementById('card-preview-name');
  const expInput = document.getElementById('cardExpiry');
  const previewExp = document.getElementById('card-preview-exp');

  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
      if (previewNum) {
        previewNum.textContent = formatted.length > 0 ? formatted : '•••• •••• •••• ••••';
      }
    });
  }

  if (cardNameInput && previewName) {
    cardNameInput.addEventListener('input', (e) => {
      previewName.textContent = e.target.value.trim().toUpperCase() || 'YOUR NAME';
    });
  }

  if (expInput && previewExp) {
    expInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
      e.target.value = val;
      previewExp.textContent = val || 'MM/YY';
    });
  }
}

function setupCouponForm() {
  const btn = document.getElementById('btn-apply-coupon');
  const input = document.getElementById('coupon-code-input');
  if (!btn || !input) return;

  btn.addEventListener('click', async () => {
    const code = input.value.trim().toUpperCase();
    if (!code) {
      Toast.error('Please enter a coupon code (Try: NOVA20 or WELCOME10)');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Applying...';

    try {
      const data = await API.validateCoupon(code);
      if (data.success && data.coupon) {
        appliedCouponData = data.coupon;
        Toast.success(`Coupon "${code}" applied: ${data.coupon.description}!`);
        input.disabled = true;
        btn.textContent = 'Applied';
        btn.style.background = 'var(--accent-emerald)';
        renderCheckoutSummary();
      } else {
        Toast.error(data.error || 'Invalid coupon code');
        btn.textContent = 'Apply';
        btn.disabled = false;
      }
    } catch (err) {
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

    if (!fullName || !email || !address || !city || !zip) {
      Toast.error('Please complete all required shipping fields');
      return;
    }

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
        zip,
        country: 'United States'
      },
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment === 'card' 
        ? `Credit Card (ending in ${document.getElementById('cardNumber')?.value.slice(-4) || '4242'})` 
        : 'Cash on Delivery (COD)',
      couponCode: appliedCouponData ? appliedCouponData.code : null
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
      Processing Secure Payment...
    `;

    try {
      const response = await API.createOrder(payload);
      if (response.success && response.order) {
        Cart.clear();
        Toast.success('Order placed successfully!');
        window.location.href = `/order-confirmation.html?id=${response.order.id}`;
      } else {
        Toast.error(response.error || 'Failed to place order');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Order';
      }
    } catch (err) {
      Toast.error('Network error during checkout: ' + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Complete Order';
    }
  });
}
