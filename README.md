# NOVA LUXE 🇮🇳 — Full-Stack Indian E-Commerce Web Application

A full-stack, enterprise-grade E-Commerce platform built for internship demonstration featuring **User Authentication**, a persistent **SQLite Database** (`users`, `products`, `orders`), **Indian Rupee (₹) pricing**, **UPI instant payments**, **18% GST invoicing**, and a vibrant, high-energy UI/UX.

---

## 🚀 Key Highlights & Internship Requirements Checklist

| Feature Area | Technologies | Details |
| :--- | :--- | :--- |
| **Frontend UI/UX** | **HTML5, CSS3, JavaScript (ES6+)** | Vibrant festive theme, Flipkart-style sub-nav, live Flash Deal timer, Wishlist heart toggles, responsive cards, slide-over drawer, toast notifications. |
| **Backend API** | **Node.js, Express.js** | Modular REST routes (`/api/auth`, `/api/products`, `/api/orders`), Morgan request logger, CORS, JWT authentication middleware. |
| **Database** | **SQLite3 (`ecommerce.sqlite`)** | Relational SQL schema with foreign keys: `users`, `products`, `orders` tables with auto-seeding. |
| **Authentication** | **bcryptjs + JWT (JSON Web Tokens)** | User Registration, Secure Login, Password Hashing with salt, protected endpoints, auto-login state persistence. |
| **Indian Localization** | **INR (₹), UPI, GST & Pincodes** | Indian Rupee formatting (`₹14,999`), 18% GST (9% CGST + 9% SGST), 6-digit Pincode courier estimator, UPI QR simulator. |
| **Order Processing** | **End-to-End Order Flow** | Multi-step checkout, coupon discounts (`FESTIVE20`, `INDIA10`), live BlueDart status simulator, official printable GST Tax Invoice. |

---

## 🗄️ Database Architecture (SQLite Schema)

The application stores all critical data in a relational SQLite database file at [`server/data/ecommerce.sqlite`](file:///c:/Users/mehad/OneDrive/Documents/E-Commerce/server/data/ecommerce.sqlite):

```sql
-- 1. Users Table (Registered Customers)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,       -- Stored as secure bcrypt hash
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table (Catalog)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  price REAL NOT NULL,          -- In Indian Rupees (INR)
  original_price REAL,
  category TEXT NOT NULL,
  badge TEXT,
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 10,
  images TEXT,                  -- JSON Array
  colors TEXT,                  -- JSON Array
  description TEXT,
  features TEXT,                -- JSON Array
  specs TEXT                    -- JSON Key-Value Map
);

-- 3. Orders Table (Recorded Purchases)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,          -- e.g. ORD-IN-84912
  user_id TEXT,                 -- Foreign Key linked to users(id)
  status TEXT NOT NULL,         -- Order Placed -> Processing -> Shipped -> Delivered
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  items TEXT NOT NULL,          -- JSON Array
  shipping_details TEXT NOT NULL, -- Name, Phone, Address, PIN, State
  shipping_method TEXT NOT NULL,
  payment_method TEXT NOT NULL, -- UPI, Cards, NetBanking, COD
  coupon_code TEXT,
  pricing TEXT NOT NULL,        -- Subtotal, Discount, Shipping, CGST, SGST, Total
  tracking TEXT NOT NULL,       -- JSON Array of status milestones
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 📦 Project Structure

```
E-Commerce/
├── package.json               # Dependencies (Express, SQLite3, bcryptjs, jsonwebtoken, CORS)
├── server/
│   ├── server.js              # Express app initialization, static frontend, route mounting
│   ├── data/
│   │   ├── database.js        # SQLite database connection, schema setup & CRUD helpers
│   │   └── ecommerce.sqlite   # Relational SQLite database file
│   ├── routes/
│   │   ├── authRoutes.js      # User registration, login, and profile (JWT + bcrypt)
│   │   ├── productRoutes.js   # Products catalog, categories, and 6-digit Pincode check
│   │   └── orderRoutes.js     # Order creation in SQLite, coupon engine, status updates
│   └── test-api.js            # Automated test suite verifying 8 full-stack endpoints
├── public/
│   ├── index.html             # Storefront: Hero banner, flash timer, categories, grid
│   ├── product.html           # Dedicated product details: Pincode checker, gallery, specs
│   ├── cart.html              # Dedicated shopping bag with free delivery progress bar
│   ├── checkout.html          # Checkout with Indian addresses & UPI QR simulator
│   ├── orders.html            # Order tracking, user order history & printable GST invoice
│   ├── order-confirmation.html# Celebration screen & packing slip
│   ├── css/
│   │   └── styles.css         # Modern, high-energy Indian design system
│   └── js/
│       ├── api.js             # Client-side API fetch wrapper
│       ├── auth.js            # Auth modal, user state, and navbar session manager
│       ├── cart.js            # Universal cart manager & Wishlist state
│       ├── toast.js           # Floating toast alerts
│       ├── main.js            # Storefront search, filter, and quick view
│       ├── product.js         # PDP gallery, variants, and pincode check
│       ├── checkout.js        # Form validation, autofill, and order submission
│       └── orders.js          # Live status simulator & user order history
└── README.md
```

---

## 🛠️ Quick Start Instructions

### 1. Start the Application
Run in your terminal:
```bash
npm start
```

### 2. Open Your Browser
- 🌐 **Storefront:** [http://localhost:5000](http://localhost:5000)
- 📡 **REST API:** [http://localhost:5000/api/products](http://localhost:5000/api/products)

### 3. Run the Automated Test Suite
```bash
npm test
```

---

## 🔑 Default Demo Account & Credentials

For an effortless demonstration during your internship evaluation:
- **Email:** `demo@novaluxe.in`
- **Password:** `password123`
- *(Or simply click the **"⚡ Instant Demo Account"** button inside the Sign In modal!)*

---

## 💡 Evaluation Demo Walkthrough

1. **User Registration & Login**:
   - Click **"Sign In / Register"** in the top navbar.
   - Click **"Create Account"** to register a new user, or click **"Instant Demo Account"** to log in as *Rahul Sharma*.
   - Notice the navbar immediately reflects `👤 Hi, Rahul` with a dropdown menu.

2. **Pincode Delivery Estimator**:
   - Open any product details page and enter your 6-digit PIN code (e.g. `560103`, `110001`, `400001`) to see real-time BlueDart dispatch availability.

3. **Fast Checkout & UPI Simulation**:
   - Proceed to checkout. If logged in, your name, email, and phone are auto-filled!
   - Select **UPI** to view the live QR code scanner simulator.
   - Active Promo Codes:
     - `FESTIVE20` — 20% instant storewide discount
     - `FLAT500` — Flat ₹500 off on orders above ₹2,000

4. **Live Order Status Transition & GST Invoice**:
   - On the order tracking page, click **"Simulate Next Status Update"** to watch the status change live (*Order Placed ➔ Processing ➔ Shipped via BlueDart ➔ Delivered*).
   - Click **"🖨️ Print GST Tax Invoice"** to inspect the official Indian GST packing slip.
