const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../data/database');

const JWT_SECRET = process.env.JWT_SECRET || 'nova_luxe_secure_jwt_secret_key_2026';

// Helper to extract optional user from token
function getOptionalUser(req) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      return jwt.verify(token, JWT_SECRET);
    }
  } catch (e) {
    // Ignore invalid/expired tokens for optional user lookup
  }
  return null;
}

// POST /api/orders/validate-coupon
router.post('/validate-coupon', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code required' });
  }

  const coupon = db.validateCoupon(code);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Invalid or expired coupon code' });
  }

  if (coupon.minOrder && subtotal && subtotal < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      error: `Coupon ${coupon.code} requires a minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')}`
    });
  }

  res.json({ success: true, coupon });
});

// GET /api/orders - list recent orders
router.get('/', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders: ' + err.message });
  }
});

// GET /api/orders/my-orders - list orders for currently logged in user
router.get('/user/my-orders', async (req, res) => {
  try {
    const user = getOptionalUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Please log in to view your order history.' });
    }

    const orders = await db.getOrdersByUserId(user.id);
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch user orders: ' + err.message });
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

// POST /api/orders - create a new order (Indian Currency, SQLite DB, linked to user if logged in)
router.post('/', async (req, res) => {
  try {
    const { items, shippingDetails, shippingMethod, paymentMethod, couponCode, upiId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Shopping cart is empty' });
    }

    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.pincode) {
      return res.status(400).json({ success: false, error: 'Please provide complete delivery details including 6-digit Pincode & Phone' });
    }

    // Check optional authenticated user
    const authenticatedUser = getOptionalUser(req);
    const userId = authenticatedUser ? authenticatedUser.id : (req.body.userId || null);

    // Verify products & calculate prices in INR on server
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

    // Shipping in INR: Free above ₹999, otherwise ₹99; Express is ₹199
    let shipping = 0;
    if (shippingMethod === 'express') {
      shipping = 199;
    } else {
      shipping = subtotal >= 999 ? 0 : 99;
    }

    // Apply Coupon
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = db.validateCoupon(couponCode);
      if (coupon) {
        appliedCoupon = coupon.code;
        if (coupon.discountPercent) {
          discount = Math.round((subtotal * coupon.discountPercent) / 100);
        } else if (coupon.flatAmount) {
          discount = Math.min(subtotal, coupon.flatAmount);
        }
        if (coupon.freeShipping) {
          shipping = 0;
        }
      }
    }

    // GST Breakdown (18% GST: 9% CGST + 9% SGST)
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const cgst = Math.round(discountedSubtotal * 0.09);
    const sgst = Math.round(discountedSubtotal * 0.09);
    const totalGst = cgst + sgst;
    const total = Math.max(0, discountedSubtotal + shipping + totalGst);

    // Generate Indian Order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-IN-${randomNum}`;

    const newOrder = {
      id: orderId,
      userId: userId,
      createdAt: new Date().toISOString(),
      status: "Order Placed",
      items: validatedItems,
      shippingDetails: {
        ...shippingDetails,
        country: "India"
      },
      shippingMethod: shippingMethod === 'express'
        ? 'BlueDart Express Air (1-2 Days)'
        : 'Standard Ground Delivery (3-5 Days)',
      paymentMethod: paymentMethod === 'upi'
        ? `UPI Instant (${upiId || 'PhonePe / GPay QR'})`
        : paymentMethod === 'card'
          ? 'Credit / Debit Card (RuPay / Visa / Master)'
          : paymentMethod === 'netbanking'
            ? 'NetBanking (HDFC / ICICI / SBI)'
            : 'Cash on Delivery (COD)',
      couponCode: appliedCoupon,
      pricing: {
        currency: "INR",
        currencySymbol: "₹",
        subtotal,
        discount,
        shipping,
        cgst,
        sgst,
        totalGst,
        total
      },
      gstDetails: {
        sellerGstin: "29AAACN1234F1Z5",
        hsnCode: "85183000",
        stateOfSupply: shippingDetails.state || "Karnataka"
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
      message: 'Order placed successfully and recorded in SQLite database',
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
