const express = require('express');
const router = express.Router();
const db = require('../data/database');

// POST /api/orders/validate-coupon
router.post('/validate-coupon', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code required' });
  }

  const coupon = db.validateCoupon(code);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Invalid or expired coupon code' });
  }

  res.json({ success: true, coupon });
});

// GET /api/orders - list recent orders
router.get('/', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - retrieve order details
router.get('/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve order' });
  }
});

// POST /api/orders - create a new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingDetails, shippingMethod, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Shopping cart is empty' });
    }

    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.email || !shippingDetails.address) {
      return res.status(400).json({ success: false, error: 'Please provide full shipping details' });
    }

    // Verify products & calculate prices on the server to prevent price tampering
    const allProducts = await db.getProducts();
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = allProducts.find(p => p.id === item.id);
      if (!prod) {
        return res.status(400).json({ success: false, error: `Product ${item.id} not found` });
      }

      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemSubtotal = prod.price * quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity,
        color: item.color || (prod.colors && prod.colors[0]) || 'Standard',
        image: prod.images[0]
      });
    }

    // Calculate shipping
    let shipping = 0;
    if (shippingMethod === 'express') {
      shipping = 14.99;
    } else if (shippingMethod === 'priority') {
      shipping = 24.99;
    } else {
      // Standard shipping is free over $100, otherwise $4.99
      shipping = subtotal >= 100 ? 0 : 4.99;
    }

    // Apply Coupon if valid
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = db.validateCoupon(couponCode);
      if (coupon) {
        appliedCoupon = coupon.code;
        if (coupon.discountPercent) {
          discount = (subtotal * coupon.discountPercent) / 100;
        }
        if (coupon.freeShipping) {
          shipping = 0;
        }
      }
    }

    // Tax calculation (8% standard estimate)
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
    const total = Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);

    // Generate Order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${randomNum}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "Order Placed",
      items: validatedItems,
      shippingDetails,
      shippingMethod: shippingMethod === 'express' 
        ? 'Express Shipping (1-2 Days)' 
        : shippingMethod === 'priority'
          ? 'Priority Overnight'
          : 'Standard Ground Delivery (3-5 Days)',
      paymentMethod: paymentMethod || 'Credit Card',
      couponCode: appliedCoupon,
      pricing: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      },
      tracking: [
        { status: "Order Placed", time: "Just now", done: true },
        { status: "Processing", time: "Pending", done: false },
        { status: "Shipped", time: "Pending", done: false },
        { status: "Delivered", time: "Pending", done: false }
      ]
    };

    const savedOrder = await db.createOrder(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error processing order: ' + err.message });
  }
});

// PATCH /api/orders/:id/status - Advance or update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Order Placed", "Processing", "Shipped", "Delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

module.exports = router;
