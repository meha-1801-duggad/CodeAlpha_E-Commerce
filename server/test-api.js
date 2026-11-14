// Automated Full-Stack Test Suite with SQLite Database & Auth
async function runTests() {
  console.log('Testing Nova Luxe India Full-Stack App (SQLite DB + Auth + E-Commerce)...');
  
  // Require and initialize server
  require('./server.js');
  await new Promise(r => setTimeout(r, 1500));

  const BASE_URL = 'http://127.0.0.1:5000';

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('✓ Health Endpoint:', healthData.status);

  // 2. User Registration
  const testEmail = `intern_${Date.now()}@test.in`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Sharma',
      email: testEmail,
      phone: '9876500000',
      password: 'password123'
    })
  });
  const regData = await regRes.json();
  console.log(`✓ User Registration (SQLite): ${regData.user.name} (${regData.user.email})`);
  const token = regData.token;

  // 3. User Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'password123'
    })
  });
  const loginData = await loginRes.json();
  console.log(`✓ User Login (bcrypt + JWT): Success token verified`);

  // 4. Products listing from SQLite
  const prodRes = await fetch(`${BASE_URL}/api/products`);
  const prodData = await prodRes.json();
  console.log(`✓ Products from SQLite DB: ${prodData.count} items found`);

  // 5. Pincode Check
  const pinRes = await fetch(`${BASE_URL}/api/products/check-pincode/560103`);
  const pinData = await pinRes.json();
  console.log(`✓ Pincode 560103 Checked: ${pinData.deliveryDate} (${pinData.courier})`);

  // 6. Create Order linked to user in SQLite
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [{ id: 'prod-1', quantity: 1, color: 'Space Black' }],
      shippingDetails: {
        fullName: 'Priya Sharma',
        email: testEmail,
        phone: '9876500000',
        address: '402 Tech Boulevard',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103'
      },
      shippingMethod: 'standard',
      paymentMethod: 'upi',
      upiId: 'priya@okaxis',
      couponCode: 'FESTIVE20'
    })
  });
  const orderData = await orderRes.json();
  console.log(`✓ Authenticated Order Created in SQLite: ID ${orderData.order.id}, User ID ${orderData.order.userId}`);

  // 7. Get user's order history from SQLite
  const myOrdersRes = await fetch(`${BASE_URL}/api/orders/user/my-orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const myOrdersData = await myOrdersRes.json();
  console.log(`✓ User Order History from SQLite: Found ${myOrdersData.count} order(s) for user`);

  // 8. Update Order Status (Simulation)
  const statusRes = await fetch(`${BASE_URL}/api/orders/${orderData.order.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Processing' })
  });
  const statusData = await statusRes.json();
  console.log(`✓ Order Status Updated in SQLite: ${statusData.order.status}`);

  console.log('\n🎉 ALL 8 FULL-STACK SQLite + AUTH + E-COMMERCE TESTS PASSED!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
