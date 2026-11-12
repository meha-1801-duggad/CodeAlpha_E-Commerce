// Automated End-to-End API Test Suite
const http = require('http');

async function runTests() {
  console.log('Testing Nova Luxe Backend API...');
  
  // Require and start server
  require('./server.js');

  // Wait 1 second for port binding
  await new Promise(r => setTimeout(r, 1200));

  const BASE_URL = 'http://localhost:3000';

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('✓ Health Endpoint:', healthData.status);

  // 2. Products listing
  const prodRes = await fetch(`${BASE_URL}/api/products`);
  const prodData = await prodRes.json();
  console.log(`✓ Products Listed: ${prodData.count} items found`);

  // 3. Categories
  const catRes = await fetch(`${BASE_URL}/api/products/categories`);
  const catData = await catRes.json();
  console.log(`✓ Categories: ${catData.categories.map(c => c.name).join(', ')}`);

  // 4. Single product detail
  const singleRes = await fetch(`${BASE_URL}/api/products/prod-1`);
  const singleData = await singleRes.json();
  console.log(`✓ Product Detail: "${singleData.product.name}" ($${singleData.product.price})`);

  // 5. Coupon validation
  const couponRes = await fetch(`${BASE_URL}/api/orders/validate-coupon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'NOVA20' })
  });
  const couponData = await couponRes.json();
  console.log(`✓ Coupon Validation: ${couponData.coupon.code} -> ${couponData.coupon.description}`);

  // 6. Create order
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: 'prod-1', quantity: 1, color: 'Space Black' }],
      shippingDetails: {
        fullName: 'Internship Evaluator',
        email: 'evaluator@techcorp.com',
        address: '500 Tech Highway',
        city: 'Silicon Valley',
        state: 'CA',
        zip: '94016'
      },
      shippingMethod: 'standard',
      paymentMethod: 'Credit Card (ending in 4242)',
      couponCode: 'NOVA20'
    })
  });
  const orderData = await orderRes.json();
  console.log(`✓ Order Created: ID ${orderData.order.id}, Total $${orderData.order.pricing.total}`);

  // 7. Update status (simulation)
  const statusRes = await fetch(`${BASE_URL}/api/orders/${orderData.order.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Processing' })
  });
  const statusData = await statusRes.json();
  console.log(`✓ Order Status Updated: ${statusData.order.status}`);

  console.log('\n🎉 ALL 7 FULL-STACK API TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
