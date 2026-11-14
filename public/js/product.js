// Product Detail Page Logic with Indian Features
let currentProduct = null;
let selectedColor = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showError('No product selected. Returning to storefront...');
    setTimeout(() => { window.location.href = '/index.html'; }, 2000);
    return;
  }

  await loadProductDetails(productId);
  setupTabs();
  setupPincodeChecker();
});

async function loadProductDetails(id) {
  try {
    const data = await API.getProduct(id);
    if (!data.success || !data.product) {
      showError('Product not found.');
      return;
    }

    currentProduct = data.product;
    selectedColor = currentProduct.colors ? currentProduct.colors[0] : 'Standard';
    renderProductPage();
    loadRelatedProducts(currentProduct.category, currentProduct.id);
  } catch (err) {
    showError('Failed to load product. Make sure the server is online.');
  }
}

function renderProductPage() {
  document.title = `${currentProduct.name} - Buy Online at Best Price in India | Nova Luxe`;

  // Breadcrumbs
  const breadcrumb = document.getElementById('pdp-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="/index.html">Home</a>
      <span>/</span>
      <a href="/index.html">${currentProduct.category}</a>
      <span>/</span>
      <span style="color: var(--text-main); font-weight: 700;">${currentProduct.name}</span>
    `;
  }

  // Gallery
  const mainImg = document.getElementById('pdp-main-image');
  const thumbsContainer = document.getElementById('pdp-thumbnails');
  if (mainImg) mainImg.src = currentProduct.images[0];
  if (thumbsContainer) {
    thumbsContainer.innerHTML = currentProduct.images.map((img, idx) => `
      <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="switchPdpThumb('${img}', this)">
        <img src="${img}" alt="${currentProduct.name} View ${idx + 1}">
      </div>
    `).join('');
  }

  // Badge
  const badgeEl = document.getElementById('pdp-badge');
  if (badgeEl) {
    if (currentProduct.badge) {
      badgeEl.textContent = currentProduct.badge;
      badgeEl.style.display = 'inline-block';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  document.getElementById('pdp-title').textContent = currentProduct.name;
  document.getElementById('pdp-tagline').textContent = currentProduct.tagline;
  document.getElementById('pdp-price').textContent = formatINR(currentProduct.price);

  const origPriceEl = document.getElementById('pdp-orig-price');
  const discountPill = document.getElementById('pdp-discount-pill');
  if (currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price) {
    origPriceEl.textContent = formatINR(currentProduct.originalPrice);
    origPriceEl.style.display = 'inline-block';
    const percent = Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
    discountPill.textContent = `${percent}% OFF SPECIAL FESTIVE DEAL`;
    discountPill.style.display = 'inline-block';
  } else {
    origPriceEl.style.display = 'none';
    discountPill.style.display = 'none';
  }

  // Rating
  document.getElementById('pdp-stars').textContent = `★ ${currentProduct.rating}`;
  document.getElementById('pdp-reviews-count').textContent = `(${currentProduct.reviewsCount.toLocaleString('en-IN')} verified Indian buyers)`;

  // Colors / Variants
  const variantBlock = document.getElementById('pdp-variant-block');
  const colorOptions = document.getElementById('pdp-color-options');
  const colorLabel = document.getElementById('pdp-color-label');
  if (currentProduct.colors && currentProduct.colors.length > 0) {
    variantBlock.style.display = 'block';
    colorLabel.textContent = selectedColor;
    colorOptions.innerHTML = currentProduct.colors.map((c, i) => `
      <button class="color-chip ${i === 0 ? 'active' : ''}" data-color="${c}">${c}</button>
    `).join('');

    colorOptions.querySelectorAll('.color-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        colorOptions.querySelectorAll('.color-chip').forEach(el => el.classList.remove('active'));
        chip.classList.add('active');
        selectedColor = chip.dataset.color;
        colorLabel.textContent = selectedColor;
      });
    });
  } else {
    variantBlock.style.display = 'none';
  }

  // Quantity controls
  const qtyVal = document.getElementById('pdp-qty-val');
  document.getElementById('pdp-qty-minus').onclick = () => {
    if (quantity > 1) {
      quantity--;
      qtyVal.textContent = quantity;
    }
  };
  document.getElementById('pdp-qty-plus').onclick = () => {
    if (quantity < currentProduct.stock) {
      quantity++;
      qtyVal.textContent = quantity;
    }
  };

  // Add to cart & Buy now
  document.getElementById('pdp-add-btn').onclick = () => {
    Cart.addItem(currentProduct, quantity, selectedColor);
  };

  document.getElementById('pdp-buynow-btn').onclick = () => {
    Cart.addItem(currentProduct, quantity, selectedColor);
    window.location.href = '/checkout.html';
  };

  // Highlights & Specs
  document.getElementById('pdp-description-text').textContent = currentProduct.description;
  const featuresList = document.getElementById('pdp-features-list');
  if (featuresList && currentProduct.features) {
    featuresList.innerHTML = currentProduct.features.map(f => `
      <li style="display: flex; align-items: center; gap: 0.75rem; background: #fff; border: 1px solid var(--border-light); padding: 1rem 1.25rem; border-radius: var(--radius-md);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span style="font-weight: 600; color: var(--text-main);">${f}</span>
      </li>
    `).join('');
  }

  const specsTable = document.getElementById('pdp-specs-tbody');
  if (specsTable && currentProduct.specs) {
    specsTable.innerHTML = Object.entries(currentProduct.specs).map(([k, v]) => `
      <tr>
        <td style="font-weight: 700; width: 35%; background: var(--bg-subtle); color: var(--text-main);">${k}</td>
        <td>${v}</td>
      </tr>
    `).join('');
  }
}

function switchPdpThumb(imgSrc, thumbElem) {
  const mainImg = document.getElementById('pdp-main-image');
  if (mainImg) mainImg.src = imgSrc;
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  if (thumbElem) thumbElem.classList.add('active');
}

function setupPincodeChecker() {
  const btn = document.getElementById('btn-check-pincode');
  const input = document.getElementById('pincode-input');
  const resBox = document.getElementById('pincode-result');

  if (!btn || !input || !resBox) return;

  btn.addEventListener('click', async () => {
    const pin = input.value.trim();
    if (pin.length !== 6 || isNaN(pin)) {
      Toast.error('Please enter a valid 6-digit Indian PIN code (e.g. 560001, 110001)');
      return;
    }

    btn.textContent = 'Checking...';
    try {
      const data = await API.checkPincode(pin);
      if (data.success) {
        resBox.style.display = 'block';
        resBox.innerHTML = `
          <div style="background: var(--accent-emerald-light); border: 1px solid #a7f3d0; padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--accent-emerald);">
            <div>🚚 <strong>${data.deliveryDate}</strong></div>
            <div style="font-size: 0.8rem; color: #047857; margin-top: 0.25rem;">Courier: ${data.courier} · Cash on Delivery & UPI available · Shipping: ${data.shippingCost}</div>
          </div>
        `;
        Toast.success(`PIN ${pin} is serviceable with Express Delivery!`);
      }
    } catch {
      Toast.error('Unable to verify pincode');
    } finally {
      btn.textContent = 'Check';
    }
  });
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(`tab-${target}`);
      if (pane) pane.classList.add('active');
    });
  });
}

async function loadRelatedProducts(category, excludeId) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  try {
    const data = await API.getProducts({ category });
    const related = (data.products || []).filter(p => p.id !== excludeId).slice(0, 3);

    if (related.length === 0) {
      container.parentElement.style.display = 'none';
      return;
    }

    container.innerHTML = related.map(p => `
      <div class="product-card">
        <div class="card-image-wrap">
          <img src="${p.images[0]}" alt="${p.name}" class="card-image">
        </div>
        <div class="card-body">
          <div class="card-category">${p.category}</div>
          <h4 class="card-title"><a href="/product.html?id=${p.id}">${p.name}</a></h4>
          <div class="card-footer" style="padding-top: 0.75rem;">
            <span class="card-price">${formatINR(p.price)}</span>
            <a href="/product.html?id=${p.id}" class="btn-secondary" style="padding: 0.45rem 1rem; font-size: 0.82rem;">View Details</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load related products', e);
  }
}

function showError(msg) {
  const container = document.getElementById('pdp-container');
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem;">
        <h2 style="color: var(--accent-rose); margin-bottom: 1rem;">${msg}</h2>
        <a href="/index.html" class="btn-primary">Browse All Products</a>
      </div>
    `;
  }
}
