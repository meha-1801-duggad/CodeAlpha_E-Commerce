// Main Storefront Logic
let currentProducts = [];
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';

document.addEventListener('DOMContentLoaded', async () => {
  setupSearch();
  setupSorting();
  setupQuickViewModal();
  await loadCategories();
  await fetchAndRenderProducts();
});

// Category loader
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
          fetchAndRenderProducts();
        });
      });
    }
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

// Fetch and render products with filters
async function fetchAndRenderProducts() {
  const grid = document.getElementById('product-grid');
  const countBar = document.getElementById('products-count');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
      <div style="font-size: 1.25rem; margin-bottom: 0.5rem;">Loading premium catalog...</div>
      <div style="font-size: 0.9rem;">Fetching the latest audio, computing, and smart home gear</div>
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
      countBar.textContent = `Showing ${currentProducts.length} ${currentProducts.length === 1 ? 'item' : 'items'}`;
    }

    if (currentProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No products match your search</h3>
          <p style="font-size: 0.9rem; max-width: 400px; margin: 0 auto 1.5rem;">Try adjusting your keywords or clearing the category filter.</p>
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
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="card-image-wrap">
        ${product.badge ? `<span class="card-badge ${badgeClass}">${product.badge}</span>` : ''}
        <img src="${product.images[0]}" alt="${product.name}" class="card-image" loading="lazy">
        <button class="quick-view-btn" data-id="${product.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path></svg>
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
          <span>${stars}</span>
          <span class="rating-count">${product.rating} (${product.reviewsCount})</span>
        </div>
        <div class="card-footer">
          <div class="price-wrap">
            <span class="card-price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="card-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="card-add-btn add-to-cart-direct" data-id="${product.id}" title="Add to Cart" aria-label="Add to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachCardEvents() {
  // Add to cart button
  document.querySelectorAll('.add-to-cart-direct').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const product = currentProducts.find(p => p.id === id);
      if (product) {
        Cart.addItem(product, 1);
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
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    searchQuery = e.target.value.trim();

    if (clearBtn) {
      if (searchQuery.length > 0) {
        clearBtn.classList.add('visible');
      } else {
        clearBtn.classList.remove('visible');
      }
    }

    debounceTimer = setTimeout(() => {
      fetchAndRenderProducts();
    }, 280);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      searchQuery = '';
      clearBtn.classList.remove('visible');
      fetchAndRenderProducts();
      input.focus();
    });
  }
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

  const input = document.getElementById('search-input');
  if (input) input.value = '';

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  const pills = document.querySelectorAll('.cat-pill');
  pills.forEach(p => p.classList.remove('active'));
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
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div id="modal-content" class="modal-grid">
          <!-- Filled dynamically -->
        </div>
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
    <div class="pdp-gallery">
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
    <div class="pdp-info">
      <div class="card-category">${product.category}</div>
      <h2 class="pdp-title" style="font-size: 1.65rem;">${product.name}</h2>
      <p class="pdp-tagline" style="font-size: 0.95rem;">${product.tagline}</p>
      
      <div class="pdp-price-row" style="margin-bottom: 1.25rem;">
        <span class="pdp-current-price" style="font-size: 1.75rem;">$${product.price.toFixed(2)}</span>
        ${product.originalPrice ? `<span class="pdp-orig-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
      </div>

      ${product.colors ? `
        <div class="variant-block">
          <div class="variant-label">Selected Color: <strong id="modal-color-label">${selectedColor}</strong></div>
          <div class="color-options" id="modal-color-options">
            ${product.colors.map((c, i) => `
              <button class="color-chip ${i === 0 ? 'active' : ''}" data-color="${c}">${c}</button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="stock-status-box" style="margin-bottom: 1.5rem;">
        <span class="stock-dot"></span>
        <span>In Stock (${product.stock} available for fast dispatch)</span>
      </div>

      <div class="pdp-actions-row">
        <div class="qty-control">
          <button class="qty-btn" id="modal-qty-minus">−</button>
          <span class="qty-num" id="modal-qty-val">1</span>
          <button class="qty-btn" id="modal-qty-plus">+</button>
        </div>
        <button class="btn-add-cart-large" id="modal-add-cart-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Add to Cart
        </button>
      </div>

      <div style="margin-top: 1rem;">
        <a href="/product.html?id=${product.id}" style="color: var(--accent-primary); font-size: 0.9rem; font-weight: 600; text-decoration: underline;">
          View Full Product Details & Customer Reviews →
        </a>
      </div>
    </div>
  `;

  // Variant click
  content.querySelectorAll('.color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      content.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedColor = chip.dataset.color;
      document.getElementById('modal-color-label').textContent = selectedColor;
    });
  });

  // Quantity controls
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

  // Add to cart
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
