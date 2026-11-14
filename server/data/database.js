const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'ecommerce.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

// Wrap SQLite methods in Promises
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initial Product Catalog for Seeding
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura SoundLink Pro Wireless Headphones",
    tagline: "Studio-grade spatial audio with hybrid active noise cancellation (ANC 42dB).",
    price: 14999,
    originalPrice: 19999,
    category: "Audio",
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 1420,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Space Black", "Silver Gray", "Midnight Navy"],
    description: "Designed for audiophiles and working professionals. Aura SoundLink Pro features 40mm bio-cellulose dynamic drivers, LDAC high-res audio codec, and ultra-fast Type-C charging delivering 4 hours of music in just 10 minutes.",
    features: [
      "Hybrid Active Noise Cancellation (ANC up to 42dB)",
      "Hi-Res Wireless Audio certified with LDAC & AAC codecs",
      "Massive 50-Hour Playtime (35 hours with ANC enabled)",
      "Multipoint Dual Bluetooth 5.3 pairing with seamless device handover"
    ],
    specs: {
      "Battery Life": "Up to 50 Hours (Type-C Quick Fuel)",
      "Weight": "250 grams",
      "Bluetooth": "v5.3 Multipoint (15m range)",
      "Water Resistance": "IPX4 Splash & Sweat Proof",
      "Warranty": "1 Year Brand Replacement Warranty"
    }
  },
  {
    id: "prod-2",
    name: "Chronos Apex Ultra Smartwatch",
    tagline: "Aerospace titanium bezel with 1.43\" AMOLED sapphire crystal display.",
    price: 18499,
    originalPrice: 24999,
    category: "Wearables",
    badge: "Deal of the Day",
    rating: 4.8,
    reviewsCount: 890,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Titanium Gray", "Starlight Gold", "Obsidian Black"],
    description: "Engineered for fitness enthusiasts and urban explorers. Features dual-frequency GNSS positioning, 100+ sports modes, Bluetooth calling with AI noise reduction, and a battery that runs 12 days on a single charge.",
    features: [
      "1.43\" Ultra AMOLED Display with 1000 nits peak brightness",
      "Medical-grade Optical PPG sensor for 24/7 Heart Rate & SpO2",
      "5 ATM & IP68 Swim-proof construction",
      "Built-in Microphone and Speaker for crisp Bluetooth phone calls"
    ],
    specs: {
      "Battery Life": "12 Days typical use, 5 days heavy use",
      "Display": "1.43\" AMOLED, 466x466 px",
      "Sensors": "Optical Heart Rate, SpO2, Barometer, Gyroscope",
      "Compatibility": "Android 8.0+ / iOS 12.0+",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "prod-3",
    name: "Lumino Studio Smart Monitor Light Bar",
    tagline: "Minimalist desktop lamp with back ambient RGB and wireless controller puck.",
    price: 3499,
    originalPrice: 4999,
    category: "Smart Home",
    badge: "Trending",
    rating: 4.7,
    reviewsCount: 620,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Matte Black", "Space Gray"],
    description: "Protect your eyesight during intense work or gaming sessions. Features patented asymmetric forward optical projection that illuminates your workspace with zero screen glare and zero reflections.",
    features: [
      "Asymmetric Optical Design guarantees 0% screen glare",
      "Wireless 2.4GHz Desktop Rotary Dial Controller",
      "Full Spectrum RGB Backlight with dynamic music sync",
      "Stepless Color Temperature tuning (2700K Warm - 6500K Cool)"
    ],
    specs: {
      "Power Input": "5V 2A USB-C (powered directly from PC/Monitor)",
      "Color Rendering": "Ra > 97 Ultra-High CRI",
      "Mounting": "Fits Flat & Curved Monitors (5mm to 45mm thickness)",
      "Warranty": "1 Year Replacement Warranty"
    }
  },
  {
    id: "prod-4",
    name: "KeyCraft Mechanical Pro RGB Keyboard",
    tagline: "Hot-swappable gasket-mounted mechanical keyboard with CNC volume knob.",
    price: 7999,
    originalPrice: 11499,
    category: "Computing",
    badge: "Hot Deal",
    rating: 4.9,
    reviewsCount: 1150,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Cyberpunk Neon", "Retro Cream", "Carbon Stealth"],
    description: "The dream typing experience for coders and writers. Pre-lubed custom tactile switches cushioned by 5 layers of sound-absorbing foam produce a satisfying deep 'thock' sound on every keystroke.",
    features: [
      "75% Compact 82-Key Layout with Multi-function Metal Knob",
      "Hot-Swappable 5-pin PCB supports Cherry, Gateron, and Kailh switches",
      "Tri-Mode Connectivity: 2.4GHz Wireless, Bluetooth 5.1 & Type-C Detachable",
      "Premium PBT Dye-Sub Keycaps that never fade or get shiny"
    ],
    specs: {
      "Switch Type": "Gateron Pro Yellow / Brown (Factory Pre-lubed)",
      "Battery": "4000mAh Lithium-ion (Up to 200 hours backlight off)",
      "Backlight": "Per-Key RGB with 22 lighting presets",
      "Warranty": "2 Years Official Warranty"
    }
  },
  {
    id: "prod-5",
    name: "NovaBeam 4K HDR Home Cinema Projector",
    tagline: "Ultra-bright 2500 ANSI Lumens smart laser projector with Harman Kardon sound.",
    price: 49999,
    originalPrice: 69999,
    category: "Smart Home",
    badge: "Mega Deal",
    rating: 4.8,
    reviewsCount: 340,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Lunar White", "Cosmic Gray"],
    description: "Turn your living room into an IMAX theater. Features true 4K HDR projection, instant AI auto-focus and auto-keystone correction, Google TV with certified Netflix, and dual 12W Harman Kardon speakers.",
    features: [
      "True 4K UHD Resolution with HDR10+ and MEMC motion smoothing",
      "2500 ANSI Lumens ALPD 4.0 Laser Engine for vivid daytime viewing",
      "1-Second AI Auto Keystone Correction and Obstacle Avoidance",
      "Licensed Android TV 11 with built-in Chromecast & Google Assistant"
    ],
    specs: {
      "Screen Size": "40 to 200 inches diagonal",
      "Audio": "2x 12W Harman Kardon tuned with Dolby Audio & DTS-HD",
      "Lamp Life": "30,000+ Hours (Equivalent to 10+ years)",
      "Warranty": "2 Years Comprehensive Brand Warranty"
    }
  },
  {
    id: "prod-6",
    name: "OmniDesk Ergonomic Wireless Precision Mouse",
    tagline: "Sculpted thumb rest, 8000 DPI sensor on glass, and MagSpeed electromagnetic scroll.",
    price: 4299,
    originalPrice: 5999,
    category: "Computing",
    badge: "Bestseller",
    rating: 4.7,
    reviewsCount: 880,
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Graphite Black", "Pale Gray", "Rose Gold"],
    description: "The gold standard mouse for productivity. Sculpted specifically to support your hand and wrist natural angle. Scroll 1,000 lines in a single second with silent magnetic MagSpeed scrolling.",
    features: [
      "8000 DPI Darkfield high-precision sensor tracks even on glass tables",
      "Dual Horizontal & Vertical Thumb Scroll Wheels",
      "Whisper-Quiet Click switches reduce click noise by 90%",
      "Easy-Switch connects up to 3 computers with clipboard file transfer"
    ],
    specs: {
      "Battery Life": "Up to 70 days on full charge, 1-min charge = 3 hours use",
      "Connectivity": "Logi Bolt USB Receiver & Bluetooth Low Energy",
      "Weight": "141 grams",
      "Warranty": "2 Years Replacement Warranty"
    }
  },
  {
    id: "prod-7",
    name: "PulsePods Pro Sport ANC Earbuds",
    tagline: "Wingtip lock fit, IPX7 sweat-proof, and immersive bass with 36-hour playback.",
    price: 3999,
    originalPrice: 6499,
    category: "Audio",
    badge: "Top Rated",
    rating: 4.8,
    reviewsCount: 740,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Volt Neon", "Jet Black", "Glacier White"],
    description: "Crafted for intense workouts, running, and heavy rain. Featuring flexible silicone ear hooks that lock securely, active noise cancellation, and punchy bass tuned for workout motivation.",
    features: [
      "IPX7 Waterproof rating with SweatShield nanocoating",
      "Active Noise Cancellation with Transparency Mode for road safety",
      "36 Hours total battery with Qi wireless fast charging case",
      "Quad-Mic ENC technology for crystal clear phone calls"
    ],
    specs: {
      "Driver": "11mm Titanium Dynamic Driver",
      "Playtime": "8 Hours (Earbuds) + 28 Hours (Charging Case)",
      "Bluetooth": "v5.3 with Gaming Low Latency Mode (45ms)",
      "Warranty": "1 Year Brand Warranty"
    }
  },
  {
    id: "prod-8",
    name: "Veloce Handcrafted Leather Tech Organizer Folio",
    tagline: "Full-grain genuine leather organizer for 14\" laptops, iPads, chargers & cables.",
    price: 2799,
    originalPrice: 3999,
    category: "Accessories",
    badge: "Handcrafted",
    rating: 4.9,
    reviewsCount: 310,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Cognac Tan", "Espresso Brown", "Midnight Black"],
    description: "Handcrafted by master leather artisans. Keeps your laptop, tablet, passport, AirPods, power bank, and cables neatly organized in one slim, luxurious travel companion.",
    features: [
      "Padded velvet sleeve accommodates laptops and tablets up to 14.2 inches",
      "Elastic organizer loops for stylus, Apple Pencil, and cable cords",
      "RFID-shielded security pockets for credit cards and passport",
      "Premium Japanese YKK metal zippers that glide effortlessly"
    ],
    specs: {
      "Material": "100% Genuine Full-Grain Vegetable Tanned Leather",
      "Dimensions": "35 cm x 25 cm x 3 cm",
      "Weight": "480 grams",
      "Warranty": "Lifetime Craftsmanship Guarantee"
    }
  },
  {
    id: "prod-9",
    name: "AeroCharge 65W GaN Fast Charger Trio",
    tagline: "Ultra-compact Gallium Nitride wall charger with 2x Type-C + 1x USB-A ports.",
    price: 1999,
    originalPrice: 2999,
    category: "Accessories",
    badge: "Must Have",
    rating: 4.8,
    reviewsCount: 520,
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609592424368-80dfa5697693?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Glossy White", "Stealth Black"],
    description: "Charge your laptop, smartphone, and smartwatch simultaneously from a single pocket-sized adapter. Powered by advanced GaN III semiconductor technology that runs cooler and charges 3x faster.",
    features: [
      "65W Power Delivery charges MacBook Air to 100% in 1.5 hours",
      "Intelligent power distribution across 3 fast-charging ports",
      "50% smaller than standard manufacturer OEM brick chargers",
      "Over-voltage, surge, and thermal temperature guard protection"
    ],
    specs: {
      "Output": "65W Max (PD 3.0, QC 4.0+, PPS Support)",
      "Ports": "2x USB-C + 1x USB-A",
      "Plug Type": "Indian Standard 2-Pin Plug (BIS Certified)",
      "Warranty": "18 Months Replacement Warranty"
    }
  },
  {
    id: "prod-10",
    name: "OnePlus Pad Go 11.35\" 2.4K Display Tablet",
    tagline: "Eye-care 2.4K 90Hz display with Dolby Atmos quad-speakers and 8000mAh battery.",
    price: 17999,
    originalPrice: 21999,
    category: "Computing",
    badge: "Festive Pick",
    rating: 4.7,
    reviewsCount: 960,
    stock: 11,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Twin Mint Green", "Graphite Gray"],
    description: "The ultimate entertainment and study tablet. Boasting an expansive 11.35\" 7:5 ratio screen, Low Blue Light TÜV Rheinland certification, and Omnibearing quad speakers with Dolby Atmos sound.",
    features: [
      "11.35-inch 2.4K ReadFit Display with 90Hz refresh rate",
      "Quad Stereo Speakers tuned with Dolby Atmos audio",
      "8000mAh Battery with 33W SUPERVOOC Fast Charging",
      "8GB RAM + 128GB Storage expandable up to 1TB via microSD"
    ],
    specs: {
      "Processor": "MediaTek Helio G99 Octa-core",
      "Display": "11.35\" 2.4K (2408 x 1720) 260 PPI",
      "Battery": "8000mAh with 33W Fast Charger included in box",
      "Weight": "532 grams",
      "Warranty": "1 Year Manufacturer Brand Warranty"
    }
  }
];

const VALID_COUPONS = {
  "FESTIVE20": { code: "FESTIVE20", discountPercent: 20, description: "20% Festive Clearance Discount" },
  "INDIA10": { code: "INDIA10", discountPercent: 10, description: "10% Instant Storewide Discount" },
  "FLAT500": { code: "FLAT500", flatAmount: 500, minOrder: 2000, description: "Flat ₹500 Off on orders above ₹2,000" },
  "FREESHIP": { code: "FREESHIP", freeShipping: true, description: "Free Express Shipping across India" }
};

// Initialize SQLite Database Schema
async function initDatabase() {
  // 1. Create Users Table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Create Products Table
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT NOT NULL,
      badge TEXT,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 10,
      images TEXT,
      colors TEXT,
      description TEXT,
      features TEXT,
      specs TEXT
    )
  `);

  // 3. Create Orders Table
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      items TEXT NOT NULL,
      shipping_details TEXT NOT NULL,
      shipping_method TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      coupon_code TEXT,
      pricing TEXT NOT NULL,
      tracking TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Seed Products if table is empty
  const prodCount = await get(`SELECT COUNT(*) as count FROM products`);
  if (prodCount.count === 0) {
    console.log('Seeding products into SQLite database...');
    for (const p of INITIAL_PRODUCTS) {
      await run(`
        INSERT INTO products (id, name, tagline, price, original_price, category, badge, rating, reviews_count, stock, images, colors, description, features, specs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.id,
        p.name,
        p.tagline,
        p.price,
        p.originalPrice || null,
        p.category,
        p.badge || null,
        p.rating,
        p.reviewsCount,
        p.stock,
        JSON.stringify(p.images),
        JSON.stringify(p.colors || []),
        p.description,
        JSON.stringify(p.features || []),
        JSON.stringify(p.specs || {})
      ]);
    }
    console.log(`Seeded ${INITIAL_PRODUCTS.length} products into SQLite!`);
  }

  // Seed Demo User if not exists
  const demoUser = await get(`SELECT id FROM users WHERE email = ?`, ['demo@novaluxe.in']);
  if (!demoUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await run(`
      INSERT INTO users (id, name, email, phone, password)
      VALUES (?, ?, ?, ?, ?)
    `, [
      'usr-demo-1',
      'Rahul Sharma',
      'demo@novaluxe.in',
      '9876543210',
      hashedPassword
    ]);
    console.log('Created default demo user: demo@novaluxe.in / password123');
  }

  // Seed initial sample order if orders table is empty
  const orderCount = await get(`SELECT COUNT(*) as count FROM orders`);
  if (orderCount.count === 0) {
    const sampleOrder = {
      id: "ORD-IN-84912",
      userId: "usr-demo-1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "Delivered",
      items: [
        {
          id: "prod-1",
          name: "Aura SoundLink Pro Wireless Headphones",
          price: 14999,
          quantity: 1,
          color: "Space Black",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
        }
      ],
      shippingDetails: {
        fullName: "Rahul Sharma",
        email: "demo@novaluxe.in",
        phone: "9876543210",
        address: "Flat 402, Green Glen Layout, Bellandur",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560103",
        country: "India"
      },
      shippingMethod: "Express BlueDart Delivery (FREE)",
      paymentMethod: "UPI (Google Pay - rahul@okaxis)",
      pricing: {
        currency: "INR",
        subtotal: 14999,
        shipping: 0,
        discount: 1500,
        cgst: 1215,
        sgst: 1215,
        totalGst: 2430,
        total: 15929
      },
      tracking: [
        { status: "Order Placed", time: "2 days ago", done: true },
        { status: "Processing", time: "2 days ago", done: true },
        { status: "Shipped", time: "Yesterday", done: true },
        { status: "Delivered", time: "Today at 11:30 AM", done: true }
      ]
    };

    await run(`
      INSERT INTO orders (id, user_id, status, created_at, items, shipping_details, shipping_method, payment_method, coupon_code, pricing, tracking)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      sampleOrder.id,
      sampleOrder.userId,
      sampleOrder.status,
      sampleOrder.createdAt,
      JSON.stringify(sampleOrder.items),
      JSON.stringify(sampleOrder.shippingDetails),
      sampleOrder.shippingMethod,
      sampleOrder.paymentMethod,
      'FESTIVE20',
      JSON.stringify(sampleOrder.pricing),
      JSON.stringify(sampleOrder.tracking)
    ]);
  }
}

// User Database Helpers
async function createUser({ name, email, phone, password }) {
  const id = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const hashedPassword = await bcrypt.hash(password, 10);
  await run(`
    INSERT INTO users (id, name, email, phone, password)
    VALUES (?, ?, ?, ?, ?)
  `, [id, name, email.toLowerCase().trim(), phone || '', hashedPassword]);
  return { id, name, email: email.toLowerCase().trim(), phone };
}

async function findUserByEmail(email) {
  if (!email) return null;
  return await get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
}

async function findUserById(id) {
  return await get(`SELECT id, name, email, phone, created_at FROM users WHERE id = ?`, [id]);
}

// Product Database Helpers
function formatProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    originalPrice: row.original_price,
    category: row.category,
    badge: row.badge,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    stock: row.stock,
    images: JSON.parse(row.images || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    description: row.description,
    features: JSON.parse(row.features || '[]'),
    specs: JSON.parse(row.specs || '{}')
  };
}

async function getProducts() {
  const rows = await all(`SELECT * FROM products`);
  return rows.map(formatProductRow);
}

async function getProductById(id) {
  const row = await get(`SELECT * FROM products WHERE id = ?`, [id]);
  return formatProductRow(row);
}

// Order Database Helpers
function formatOrderRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    createdAt: row.created_at,
    items: JSON.parse(row.items || '[]'),
    shippingDetails: JSON.parse(row.shipping_details || '{}'),
    shippingMethod: row.shipping_method,
    paymentMethod: row.payment_method,
    couponCode: row.coupon_code,
    pricing: JSON.parse(row.pricing || '{}'),
    tracking: JSON.parse(row.tracking || '[]')
  };
}

async function getOrders() {
  const rows = await all(`SELECT * FROM orders ORDER BY created_at DESC`);
  return rows.map(formatOrderRow);
}

async function getOrderById(id) {
  const row = await get(`SELECT * FROM orders WHERE id = ?`, [id.toUpperCase()]);
  return formatOrderRow(row);
}

async function getOrdersByUserId(userId) {
  const rows = await all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
  return rows.map(formatOrderRow);
}

async function createOrder(orderData) {
  await run(`
    INSERT INTO orders (id, user_id, status, created_at, items, shipping_details, shipping_method, payment_method, coupon_code, pricing, tracking)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    orderData.id,
    orderData.userId || null,
    orderData.status,
    orderData.createdAt || new Date().toISOString(),
    JSON.stringify(orderData.items),
    JSON.stringify(orderData.shippingDetails),
    orderData.shippingMethod,
    orderData.paymentMethod,
    orderData.couponCode || null,
    JSON.stringify(orderData.pricing),
    JSON.stringify(orderData.tracking)
  ]);
  return orderData;
}

async function updateOrderStatus(orderId, nextStatus) {
  const order = await getOrderById(orderId);
  if (!order) return null;

  const statusLabels = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const targetIndex = statusLabels.indexOf(nextStatus);

  let newTracking = order.tracking;
  if (targetIndex !== -1) {
    newTracking = statusLabels.map((label, idx) => ({
      status: label,
      time: idx <= targetIndex ? "Completed recently" : "Pending",
      done: idx <= targetIndex
    }));
  }

  await run(`
    UPDATE orders 
    SET status = ?, tracking = ? 
    WHERE id = ?
  `, [nextStatus, JSON.stringify(newTracking), orderId.toUpperCase()]);

  return await getOrderById(orderId);
}

function validateCoupon(code) {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  return VALID_COUPONS[upper] || null;
}

module.exports = {
  db,
  initDatabase,
  createUser,
  findUserByEmail,
  findUserById,
  getProducts,
  getProductById,
  getOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrderStatus,
  validateCoupon,
  VALID_COUPONS
};
