# NOVA LUXE — Full-Stack E-Commerce Web Application

A modern, high-performance E-Commerce platform built for internship demonstration with high-level UI/UX design.

![Full Stack E-Commerce](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Key Highlights & Assignment Requirements

| Requirement | Implementation Status | Features |
| :--- | :--- | :--- |
| **Frontend** | ✅ HTML5, Modern CSS3, JavaScript | Responsive dark mode, glassmorphism, micro-interactions, toast notifications |
| **Backend** | ✅ Node.js with Express.js | Modular RESTful API routes (`/api/products`, `/api/orders`), Morgan logging, CORS |
| **Product Listings** | ✅ Interactive Storefront | Real-time debounced search, category filtering pills, sorting, Quick View modal |
| **Product Details** | ✅ Dedicated PDP (`product.html`) | Multi-angle image switcher, color variants, stock level, specs table, verified reviews |
| **Shopping Cart** | ✅ Dual Cart System | Slide-out quick drawer + full cart page, free shipping progress bar, localStorage sync |
| **Order Processing** | ✅ End-to-End Order Lifecycle | Multi-step checkout, coupon engine (`NOVA20`), mock card visualizer, live tracking stepper |

---

## 📦 Project Structure

```
E-Commerce/
├── package.json               # Scripts & dependencies (Express, CORS, Morgan, Dotenv)
├── server/
│   ├── server.js              # Express app, middleware, routes, static file serving
│   ├── data/
│   │   ├── database.js        # File-based JSON data persistence handler
│   │   ├── products.json      # Pre-seeded catalog (Audio, Wearables, Computing, Smart Home)
│   │   └── orders.json        # Persistent orders database
│   └── routes/
│       ├── productRoutes.js   # Products & category endpoints
│       └── orderRoutes.js     # Order placement, coupon validator, status advance
├── public/
│   ├── index.html             # Storefront with hero banner, filters, product grid
│   ├── product.html           # Dedicated product detail page with variants & tabs
│   ├── cart.html              # Dedicated full shopping cart & summary
│   ├── checkout.html          # Multi-step checkout with mock credit card
│   ├── orders.html            # Order lookup & live tracking simulator
│   ├── order-confirmation.html# Celebration screen & printable invoice receipt
│   ├── css/
│   │   └── styles.css         # Modern design system (tokens, glassmorphism, responsive)
│   └── js/
│       ├── api.js             # Fetch client for backend endpoints
│       ├── cart.js            # Universal cart manager (localStorage + drawer)
│       ├── toast.js           # Reusable floating toast notifications
│       ├── main.js            # Storefront search, filter, and quick view
│       ├── product.js         # PDP gallery, variants, and reviews
│       ├── checkout.js        # Form validation, autofill, order submission
│       └── orders.js          # Live status simulator & invoice rendering
└── README.md
```

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The application will launch on:
- 🌐 **Storefront:** [http://localhost:3000](http://localhost:3000)
- 📡 **REST API:** [http://localhost:3000/api/products](http://localhost:3000/api/products)

For development with hot-reload (Node.js 18+ watch mode):
```bash
npm run dev
```

---

## 📡 REST API Documentation

### Products API
- `GET /api/products` — Retrieve products (supports `?category=Audio`, `?search=headphone`, `?sort=price-asc`)
- `GET /api/products/:id` — Retrieve a single product by ID with full specifications
- `GET /api/products/categories` — Retrieve all product categories with count

### Orders & Checkout API
- `POST /api/orders` — Place a new order with address, items, and server-side pricing validation
- `GET /api/orders/:id` — Retrieve order details and dispatch timeline by ID
- `GET /api/orders` — List recent orders
- `PATCH /api/orders/:id/status` — Advance order status (`Order Placed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`)
- `POST /api/orders/validate-coupon` — Validate promo code (`NOVA20`, `WELCOME10`, `FREESHIP`)

---

## 💡 Demo & Presentation Tips for Evaluators

1. **Auto-Fill Demo Info**: On the `/checkout.html` page, click the **"⚡ Autofill Demo Info"** button to instantly populate realistic customer and payment data for a smooth live presentation.
2. **Interactive Order Status Simulator**: After placing an order or visiting `/orders.html?id=ORD-94812`, click **"Simulate Next Status Update"** to watch the status change live from *Order Placed* ➔ *Processing* ➔ *Shipped* ➔ *Delivered* using backend `PATCH` requests!
3. **Printable Invoice**: Click **"🖨️ Print Invoice Receipt"** to show clean print stylesheets suitable for real-world packing slips.
4. **Promo Codes**:
   - `NOVA20` — 20% discount on entire cart
   - `WELCOME10` — 10% welcome discount
   - `FREESHIP` — Free express shipping
