const express = require('express');
const router = express.Router();
const db = require('../data/database');

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const products = await db.getProducts();
    const categoriesMap = {};
    products.forEach(p => {
      categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
    });

    const categories = Object.keys(categoriesMap).map(cat => ({
      name: cat,
      count: categoriesMap[cat]
    }));

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve categories' });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    let products = await db.getProducts();
    const { category, search, minPrice, maxPrice, inStock, sort } = req.query;

    // Filter by Category
    if (category && category.toLowerCase() !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search (name, tagline, description, category)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Price range
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Filter inStock
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          products.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch product details' });
  }
});

module.exports = router;
