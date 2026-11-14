// Nova Luxe E-Commerce API Client with Full-Stack & GitHub Pages Auto-Fallback
const FALLBACK_PRODUCTS = [
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
      "Warranty": "1 Year Official OnePlus India Warranty"
    }
  }
];

const FALLBACK_COUPONS = {
  "FESTIVE20": { code: "FESTIVE20", discountPercent: 20, description: "20% Festive Clearance Discount" },
  "INDIA10": { code: "INDIA10", discountPercent: 10, description: "10% Instant Storewide Discount" },
  "FLAT500": { code: "FLAT500", flatAmount: 500, minOrder: 2000, description: "Flat ₹500 Off on orders above ₹2,000" },
  "FREESHIP": { code: "FREESHIP", freeShipping: true, description: "Free Express Shipping across India" }
};

// Check if running in static environment (GitHub Pages or local file)
const IS_STATIC_HOST = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';

const API = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('nova_auth_token');
  },

  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth: Register
  async register(userData) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const mockUsers = JSON.parse(localStorage.getItem('nova_mock_users') || '[]');
    const existing = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'User with this email already exists' };
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '9876543210'
    };
    mockUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem('nova_mock_users', JSON.stringify(mockUsers));
    const token = `mock_jwt_${newUser.id}`;
    localStorage.setItem('nova_auth_token', token);
    localStorage.setItem('nova_current_user', JSON.stringify(newUser));
    return { success: true, user: newUser, token };
  },

  // Auth: Login
  async login(credentials) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const email = credentials.email.toLowerCase();
    const mockUsers = JSON.parse(localStorage.getItem('nova_mock_users') || '[]');
    
    // Check seeded demo user or registered mock users
    let found = mockUsers.find(u => u.email.toLowerCase() === email);
    if (!found && email === 'demo@novaluxe.in' && credentials.password === 'password123') {
      found = { id: 'usr_demo_1', name: 'Aarav Sharma', email: 'demo@novaluxe.in', phone: '9876543210' };
    }
    
    if (found && (credentials.password === 'password123' || found.password === credentials.password)) {
      const user = { id: found.id, name: found.name, email: found.email, phone: found.phone };
      const token = `mock_jwt_${user.id}`;
      localStorage.setItem('nova_auth_token', token);
      localStorage.setItem('nova_current_user', JSON.stringify(user));
      return { success: true, user, token };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  // Auth: Get Me
  async getMe() {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/me`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const userStr = localStorage.getItem('nova_current_user');
    if (userStr) {
      return { success: true, user: JSON.parse(userStr) };
    }
    return { success: false, error: 'Not authenticated' };
  },

  // Products: Get List
  async getProducts(params = {}) {
    if (!IS_STATIC_HOST) {
      try {
        const query = new URLSearchParams(params).toString();
        const url = `${this.baseUrl}/products${query ? '?' + query : ''}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    
    let list = [...FALLBACK_PRODUCTS];
    if (params.category && params.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (params.minPrice) list = list.filter(p => p.price >= Number(params.minPrice));
    if (params.maxPrice) list = list.filter(p => p.price <= Number(params.maxPrice));

    if (params.sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (params.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return { success: true, count: list.length, products: list };
  },

  // Products: Get Single Product
  async getProduct(id) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/products/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const product = FALLBACK_PRODUCTS.find(p => p.id === id);
    if (!product) return { success: false, error: 'Product not found' };
    return { success: true, product };
  },

  // Products: Get Categories
  async getCategories() {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/products/categories`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const categories = Array.from(new Set(FALLBACK_PRODUCTS.map(p => p.category)));
    return { success: true, categories };
  },

  // Pincode Lookup
  async checkPincode(pincode) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/products/check-pincode/${pincode}`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const pin = String(pincode).trim();
    if (pin.length !== 6 || isNaN(Number(pin))) {
      return { success: false, error: 'Please enter a valid 6-digit Indian PIN code' };
    }
    const isMetro = ["11", "12", "40", "56", "50", "60", "70"].some(p => pin.startsWith(p));
    return {
      success: true,
      pincode: pin,
      serviceable: true,
      deliveryDate: isMetro ? "Delivery by Tomorrow, 2:00 PM" : "Delivery in 2-3 Business Days",
      courier: isMetro ? "BlueDart Air Express" : "Delhivery Surface Express",
      codAvailable: true
    };
  },

  // Coupon Validation
  async validateCoupon(code, subtotal = 0) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/orders/validate-coupon`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, subtotal })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const upper = (code || '').trim().toUpperCase();
    const coupon = FALLBACK_COUPONS[upper];
    if (!coupon) {
      return { success: false, error: 'Invalid or expired coupon code' };
    }
    if (coupon.minOrder && subtotal && subtotal < coupon.minOrder) {
      return {
        success: false,
        error: `Coupon ${coupon.code} requires a minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')}`
      };
    }
    return { success: true, coupon };
  },

  // Orders: Create Order
  async createOrder(orderPayload) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/orders`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(orderPayload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }

    const { items, customer, payment, coupon } = orderPayload;
    if (!items || !items.length) {
      return { success: false, error: 'Cart is empty' };
    }

    let subtotal = 0;
    const validatedItems = items.map(item => {
      const prod = FALLBACK_PRODUCTS.find(p => p.id === item.id);
      const price = prod ? prod.price : item.price;
      const total = price * (item.quantity || 1);
      subtotal += total;
      return {
        id: item.id,
        name: prod ? prod.name : item.name,
        price,
        quantity: item.quantity || 1,
        color: item.color || 'Standard',
        image: prod ? prod.images[0] : item.image,
        total
      };
    });

    let discount = 0;
    if (coupon) {
      const valid = FALLBACK_COUPONS[coupon.toUpperCase()];
      if (valid) {
        if (valid.discountPercent) discount = Math.round(subtotal * (valid.discountPercent / 100));
        else if (valid.flatAmount) discount = Math.min(valid.flatAmount, subtotal);
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping = (discountedSubtotal >= 999 || (coupon && coupon.toUpperCase() === 'FREESHIP')) ? 0 : 99;
    const totalTaxable = discountedSubtotal;
    const taxRate = 0.18;
    const tax = Math.round(totalTaxable * taxRate);
    const cgst = Math.round(tax / 2);
    const sgst = tax - cgst;
    const total = totalTaxable + shipping;

    const orderId = `NL-IND-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`;

    const newOrder = {
      id: orderId,
      userId: this.getToken() ? 'usr_demo' : null,
      customer,
      items: validatedItems,
      pricing: {
        subtotal,
        discount,
        couponApplied: coupon || null,
        tax,
        cgst,
        sgst,
        shipping,
        total
      },
      payment: {
        method: payment.method || 'UPI',
        upiId: payment.upiId || 'demo@okhdfcbank',
        status: payment.method === 'COD' ? 'Pending (Cash on Delivery)' : 'Paid (Verified)',
        transactionId: `TXN${Date.now()}`
      },
      status: 'Confirmed',
      shippingDetails: {
        carrier: 'BlueDart Express',
        trackingNumber,
        estimatedDelivery: '2 Business Days'
      },
      createdAt: new Date().toISOString()
    };

    const mockOrders = JSON.parse(localStorage.getItem('nova_mock_orders') || '[]');
    mockOrders.unshift(newOrder);
    localStorage.setItem('nova_mock_orders', JSON.stringify(mockOrders));

    return { success: true, order: newOrder };
  },

  // Orders: Get Order by ID
  async getOrder(id) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/orders/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const mockOrders = JSON.parse(localStorage.getItem('nova_mock_orders') || '[]');
    const order = mockOrders.find(o => o.id.toUpperCase() === id.toUpperCase());
    if (!order) return { success: false, error: 'Order not found' };
    return { success: true, order };
  },

  // Orders: List All Orders
  async getOrders() {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/orders`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const mockOrders = JSON.parse(localStorage.getItem('nova_mock_orders') || '[]');
    return { success: true, count: mockOrders.length, orders: mockOrders };
  },

  // Orders: Get User's Orders
  async getMyOrders() {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/orders/user/my-orders`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const mockOrders = JSON.parse(localStorage.getItem('nova_mock_orders') || '[]');
    return { success: true, count: mockOrders.length, orders: mockOrders };
  },

  // Orders: Update Status (Simulation)
  async updateOrderStatus(id, status) {
    if (!IS_STATIC_HOST) {
      try {
        const res = await fetch(`${this.baseUrl}/orders/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
    }
    const mockOrders = JSON.parse(localStorage.getItem('nova_mock_orders') || '[]');
    const order = mockOrders.find(o => o.id.toUpperCase() === id.toUpperCase());
    if (!order) return { success: false, error: 'Order not found' };
    order.status = status;
    localStorage.setItem('nova_mock_orders', JSON.stringify(mockOrders));
    return { success: true, order };
  }
};
