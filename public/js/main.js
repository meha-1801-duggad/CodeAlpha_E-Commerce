// Storefront Logic & Interactions
let currentProducts = [];
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';

document.addEventListener('DOMContentLoaded', async () => {
  setupFlashSaleTimer();
  setupSearch();
  setupSorting();
  setupQuickViewModal();
  setupSubNavCategories();
  await loadCategories();
  await fetchAndRenderProducts();
});

// Flash Deal Countdown Timer (Simulated 6-hour daily flash sale)
function setupFlashSaleTimer() {
  const hrEl = document.getElementById('timer-hours');
  const minEl = document.getElementById('timer-minutes');
  const secEl = document.getElementById('timer-seconds');
  if (!hrEl || !minEl || !secEl) return;

  let totalSeconds = 5 * 3600 + 42 * 60 + 19;

  setInterval(() => {
    if (totalSeconds > 0) totalSeconds--;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hrEl.textContent = String(h).padStart(2, '0');
    minEl.textContent = String(m).padStart(2, '0');
    secEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

// Category Loader
async function loadCategories() {
  const container = document.getElementById('category-pills-row');
  if (!container) return;

  try {
    const data = await API.getCategories();
    if (data.success && data.categories) {
      container.innerHTML = `
        <button class="cat-pill active" data-category="all">All Products</button>
        ${data.categories.map(c => `
          <button class="cat-pill" data-category="${c.name}">${c.name} (${c.count})</button>
        `).join('')}
      `;

      container.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeCategory = btn.dataset.category;
          syncSubNavCategory(activeCategory);
          fetchAndRenderProducts();
        });
      });
    }
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

function setupSubNavCategories() {
  document.querySelectorAll('.cat-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.cat-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeCategory = item.dataset.category || 'all';

      // Sync pills
      const pill = document.querySelector(`.cat-pill[data-category="${activeCategory}"]`);
      if (pill) {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }

      fetchAndRenderProducts();
    });
  });
}

function syncSubNavCategory(cat) {
  document.querySelectorAll('.cat-nav-item').forEach(item => {
    if (item.dataset.category === cat) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Fetch and render products with INR currency
async function fetchAndRenderProducts() {
  const grid = document.getElementById('product-grid');
  const countBar = document.getElementById('products-count');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
      <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Loading verified electronics catalog...</div>
      <div style="font-size: 0.9rem;">Fetching genuine brand products with GST invoice & fast delivery</div>
    </div>
  `;

  try {
    const params = {};
    if (activeCategory !== 'all') params.category = activeCategory;
    if (searchQuery) params.search = searchQuery;
    if (currentSort !== 'featured') params.sort = currentSort;

    const data = await API.getProducts(params);
    currentProducts = data.products || [];

    if (countBar) {
      countBar.textContent = `Showing ${currentProducts.length} verified products`;
    }

    if (currentProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">No products match your search</h3>
          <p style="font-size: 0.9rem; max-width: 400px; margin: 0 auto 1.5rem;">Try adjusting your keywords or clearing filters.</p>
          <button class="btn-secondary" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = currentProducts.map(renderProductCard).join('');
    attachCardEvents();
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--accent-rose);">
        <h3>Unable to load catalog</h3>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check your server connection and try again.</p>
      </div>
    `;
  }
}

function renderProductCard(product) {
  const badgeClass = product.badge ? product.badge.toLowerCase().replace(/\s+/g, '-') : '';
  const isWishlisted = Wishlist.has(product.id);
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="card-image-wrap">
        ${product.badge ? `<span class="card-badge ${badgeClass}">${product.badge}</span>` : ''}
        
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" title="Add to Wishlist" aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </button>

        <img src="${product.images[0]}" alt="${product.name}" class="card-image" loading="lazy">
        
        <button class="quick-view-btn" data-id="${product.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path></svg>
          Quick View
        </button>
      </div>

      <div class="card-body">
        <div class="card-category">${product.category}</div>
        <h3 class="card-title">
          <a href="/product.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="card-tagline">${product.tagline}</p>
        
        <div class="card-rating">
          <span class="rating-pill">
            ★ ${product.rating}
          </span>
          <span class="rating-count">(${product.reviewsCount.toLocaleString('en-IN')} ratings)</span>
        </div>

        <div class="card-footer">
          <div class="price-wrap">
            <span class="card-price">${formatINR(product.price)}</span>
            <div>
              ${product.originalPrice ? `<span class="card-original-price">${formatINR(product.originalPrice)}</span>` : ''}
              ${discountPercent > 0 ? `<span class="card-discount-tag"> (${discountPercent}% OFF)</span>` : ''}
            </div>
          </div>
          <button class="card-add-btn add-to-cart-direct" data-id="${product.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachCardEvents() {
  // Add to cart
  document.querySelectorAll('.add-to-cart-direct').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const product = currentProducts.find(p => p.id === id);
      if (product) Cart.addItem(product, 1);
    });
  });

  // Wishlist toggle
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const product = currentProducts.find(p => p.id === id);
      if (product) {
        Wishlist.toggle(product);
        btn.classList.toggle('active');
        const icon = btn.querySelector('svg');
        if (icon) {
          icon.setAttribute('fill', Wishlist.has(id) ? 'currentColor' : 'none');
        }
      }
    });
  });

  // Quick View button
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      openQuickView(id);
    });
  });
}

// Search with Debounce
function setupSearch() {
  const inputs = [document.getElementById('header-search-input'), document.getElementById('search-input')];
  let debounceTimer;

  inputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      searchQuery = e.target.value.trim();

      // Sync both search boxes
      inputs.forEach(other => { if (other && other !== input) other.value = searchQuery; });

      debounceTimer = setTimeout(() => {
        fetchAndRenderProducts();
      }, 280);
    });
  });
}

// Sort dropdown
function setupSorting() {
  const select = document.getElementById('sort-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    currentSort = e.target.value;
    fetchAndRenderProducts();
  });
}

function resetFilters() {
  searchQuery = '';
  activeCategory = 'all';
  currentSort = 'featured';

  document.querySelectorAll('#header-search-input, #search-input').forEach(i => i.value = '');
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('.cat-pill, .cat-nav-item').forEach(p => p.classList.remove('active'));
  const allPill = document.querySelector('.cat-pill[data-category="all"]');
  if (allPill) allPill.classList.add('active');

  fetchAndRenderProducts();
}

// Quick View Modal
function setupQuickViewModal() {
  let modalOverlay = document.getElementById('quick-view-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'quick-view-modal';
    modalOverlay.className = 'cart-drawer-overlay';
    modalOverlay.innerHTML = `
      <div style="background: #ffffff; border-radius: var(--radius-xl); width: 90%; max-width: 820px; max-height: 90vh; overflow-y: auto; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2rem; box-shadow: var(--shadow-lg); z-index: 210;">
        <button id="modal-close-btn" style="position: absolute; top: 1.25rem; right: 1.25rem; width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--bg-subtle); display: grid; place-items: center; color: var(--text-main);" aria-label="Close modal">✕</button>
        <div id="modal-content" class="pdp-grid" style="margin-bottom: 0;"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    modalOverlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  }
}

function openQuickView(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('modal-content');
  let selectedColor = product.colors ? product.colors[0] : 'Standard';
  let qty = 1;

  content.innerHTML = `
    <div>
      <div class="pdp-main-image-wrap">
        <img src="${product.images[0]}" alt="${product.name}" class="pdp-main-image" id="modal-main-img">
      </div>
      <div class="pdp-thumbnails">
        ${product.images.map((img, idx) => `
          <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="switchModalThumb('${img}', this)">
            <img src="${img}" alt="Thumbnail">
          </div>
        `).join('')}
      </div>
    </div>
    <div>
      <div class="card-category">${product.category}</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">${product.name}</h2>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">${product.tagline}</p>
      
      <div class="pdp-price-row" style="margin-bottom: 1.25rem;">
        <span class="pdp-current-price" style="font-size: 1.85rem;">${formatINR(product.price)}</span>
        ${product.originalPrice ? `<span class="pdp-orig-price">${formatINR(product.originalPrice)}</span>` : ''}
        <span class="pdp-discount-pill">INCLUSIVE OF ALL TAXES (GST)</span>
      </div>

      ${product.colors ? `
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.5rem;">Color: <strong id="modal-color-label" style="color: var(--text-main);">${selectedColor}</strong></div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${product.colors.map((c, i) => `
              <button class="color-chip ${i === 0 ? 'active' : ''}" data-color="${c}">${c}</button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; color: var(--accent-emerald); margin-bottom: 1.5rem;">
        <span>✓ In Stock (${product.stock} units) · Fast Express Delivery</span>
      </div>

      <div style="display: flex; gap: 1rem; align-items: center;">
        <div class="qty-control">
          <button class="qty-btn" id="modal-qty-minus">−</button>
          <span class="qty-num" id="modal-qty-val">1</span>
          <button class="qty-btn" id="modal-qty-plus">+</button>
        </div>
        <button class="btn-primary" id="modal-add-cart-btn" style="flex: 1; justify-content: center;">
          Add to Bag
        </button>
      </div>

      <div style="margin-top: 1.25rem;">
        <a href="/product.html?id=${product.id}" style="color: var(--primary); font-size: 0.9rem; font-weight: 700;">
          View Full Specs, Pincode Delivery & Customer Reviews →
        </a>
      </div>
    </div>
  `;

  content.querySelectorAll('.color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      content.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedColor = chip.dataset.color;
      document.getElementById('modal-color-label').textContent = selectedColor;
    });
  });

  const qtyVal = content.querySelector('#modal-qty-val');
  content.querySelector('#modal-qty-minus').addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      qtyVal.textContent = qty;
    }
  });
  content.querySelector('#modal-qty-plus').addEventListener('click', () => {
    if (qty < product.stock) {
      qty++;
      qtyVal.textContent = qty;
    }
  });

  content.querySelector('#modal-add-cart-btn').addEventListener('click', () => {
    Cart.addItem(product, qty, selectedColor);
    closeModal();
  });

  document.getElementById('quick-view-modal').classList.add('active');
}

function switchModalThumb(imgSrc, thumbElem) {
  const mainImg = document.getElementById('modal-main-img');
  if (mainImg) mainImg.src = imgSrc;
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  if (thumbElem) thumbElem.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.remove('active');
}
