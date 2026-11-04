# 🌾 AnnSetu - Connecting Farmers & Buyers (अन्नदाता सेतु)

> **Complete Full-Stack MERN Application**  
> Direct, transparent, and technology-enabled agricultural marketplace eliminating middlemen markups and delivering fair prices to farmers and wholesale buyers.

---

## 🌐 Deployment status

There is no permanent live URL yet. The previous `trycloudflare.com` address was a temporary tunnel and is no longer advertised as live. `render.yaml` is configured for Render Blueprint deployment. After connecting this GitHub repository in Render and deploying, Render will assign the service URL; save that URL in `HOSTED_LINK.txt`.

For durable user data, configure `MONGO_URI` to a MongoDB database. Production startup now requires this setting and `JWT_SECRET`. Local development can use the built-in JSON store. Demo login and seed reset are disabled in production.

---

## 🔑 Demo accounts

Demo-login UI buttons remain for local evaluation. Set `DEMO_LOGIN_ENABLED=true` in local `.env` to use the demo endpoint; keep it disabled on a public deployment. Do not use seeded sample accounts for real data.

| Role | Email | Notes |
| :--- | :--- | :--- |
| Farmer | `farmer@annsetu.com` | Seeded sample profile |
| Buyer | `buyer@annsetu.com` | Seeded sample profile |
| Admin | `admin@annsetu.com` | Seeded sample profile; do not expose publicly |

---

## 🏗️ 3. Complete MERN Stack Architecture

The entire project is structured and consolidated in **one unified folder** (`C:\Users\Mukul\OneDrive\Desktop\AnnSetu`):

```
C:\Users\Mukul\OneDrive\Desktop\AnnSetu\
  ├── package.json              <-- Root server dependencies & management scripts
  ├── .env.example              <-- Environment configuration template
  ├── README.md                 <-- Comprehensive project documentation
  ├── HOSTED_LINK.txt           <-- Permanent deployment URL (after deployment)
  ├── start.bat                 <-- One-click Windows runner
  ├── start_host.ps1            <-- Local server runner
  │
  ├── server/                   <-- Node.js / Express / MongoDB Backend
  │   ├── index.js              <-- Server entry, API routing, serves built React frontend
  │   ├── seeder.js             <-- Realistic Indian agricultural dataset seeder
  │   ├── config/
  │   │   └── db.js             <-- MongoDB connection with auto-fallback to persistent store
  │   ├── models/
  │   │   ├── User.js           <-- User schema (Farmer / Buyer / Admin, hashed passwords)
  │   │   ├── Product.js        <-- Produce listings (Crops, variety, price/kg, stock, benchmarks)
  │   │   ├── Order.js          <-- Orders, items, timeline tracking, delivery status
  │   │   ├── MandiPrice.js     <-- Real-time APMC benchmark prices across Indian states
  │   │   └── Inquiry.js        <-- Direct buyer-farmer negotiations and chats
  │   ├── routes/
  │   │   ├── authRoutes.js     <-- /api/auth (register, login, me, demo-login)
  │   │   ├── productRoutes.js  <-- /api/products (CRUD, filtering, search, farmer inventory)
  │   │   ├── orderRoutes.js    <-- /api/orders (create, buyer orders, farmer orders, status updates)
  │   │   ├── mandiRoutes.js    <-- /api/mandi (live APMC benchmark rates)
  │   │   ├── inquiryRoutes.js  <-- /api/inquiries (farmer-buyer chat/quotes)
  │   │   └── analyticsRoutes.js<-- /api/analytics (live platform counters & GMV)
  │   └── middleware/
  │       ├── auth.js           <-- JWT authentication & role-based access control
  │       └── errorHandler.js   <-- Unified error response handler
  │
  └── client/                   <-- React Single Page Application (Vite + React 18)
      ├── index.html            <-- HTML template with Google Poppins, FontAwesome, Bootstrap 5
      ├── vite.config.js        <-- Vite build and proxy settings
      ├── dist/                 <-- Production compiled web bundle
      ├── public/
      │   └── Background.jpg    <-- High-res Indian harvest landscape
      └── src/
          ├── main.jsx          <-- React root with Auth and Cart providers
          ├── App.jsx           <-- Main navigation, modal controllers, state routing
          ├── index.css         <-- AnnSetu brand styling (#2e7d32, gold wheat, glassmorphism)
          ├── context/
          │   ├── AuthContext.jsx   <-- Auth state, JWT tokens, one-click logins
          │   └── CartContext.jsx   <-- Wholesale cart, quantity calculations, middleman savings
          ├── components/
          │   ├── Navbar.jsx        <-- Glassmorphism navbar with role badge & cart count
          │   ├── Footer.jsx        <-- Footer matching original contact (info@annsetu.com)
          │   ├── MandiTicker.jsx   <-- Real-time scrolling APMC benchmark price banner
          │   ├── ProductCard.jsx   <-- Produce card with mandi price comparison & stock badge
          │   ├── StatsSection.jsx  <-- Animated 4-box statistics cards (150+ Farmers, 200+ Orders)
          │   └── PriceSavingsCalc.jsx <-- Middleman elimination calculator (+22% farmer, -20% buyer)
          └── pages/
              ├── Home.jsx          <-- Hero, role selection, live stats, featured harvests
              ├── Marketplace.jsx   <-- Search, categories, state filter, organic toggle, sorting
              ├── FarmerDashboard.jsx <-- Inventory manager, add harvest modal, incoming orders
              ├── BuyerOrders.jsx   <-- Order tracking (Placed -> Confirmed -> Dispatched -> Delivered)
              ├── Cart.jsx          <-- Wholesale cart, transport mode, COD & UPI checkout
              ├── MandiRates.jsx    <-- Full APMC benchmark rates table across states
              ├── Login.jsx         <-- Sign-in with 1-click demo test buttons
              ├── Register.jsx      <-- Farmer or Buyer registration form
              └── AboutContact.jsx  <-- Mission statement and contact form
```

---

## ⚡ 4. Key Platform Features

1. **Role-Based Workflows**:
   - **🌾 Farmers**: Post produce listings with photos, quantity, harvest dates, and organic certifications. Manage inventory, view incoming orders, update dispatch status, and reply to buyer price quotes.
   - **🛒 Wholesale Buyers**: Search and filter produce by crop category, state, and organic certification. Compare farmer prices against APMC Mandi benchmark prices. Add to cart, choose transport options, and track deliveries.
2. **Elimination of Middlemen (Transparency Calculator)**:
   - Interactive calculation engine showing how cutting out the 4 traditional intermediary levels gives farmers **22-30% higher earnings** while allowing buyers to save **15-25%** on bulk procurement.
3. **Real-Time APMC Mandi Rates Ticker**:
   - Continuous price ticker displaying live benchmark rates for Wheat, Basmati Paddy, Mustard, Onion, Chana, Soybean, and Cotton across major agricultural states.
4. **Resilient Dual-Mode Database Engine**:
   - Zero-configuration auto-fallback: Works out of the box with the built-in persistent store, and automatically connects to MongoDB Atlas whenever a `MONGO_URI` is provided in `.env`.
5. **Brand Design Continuity**:
   - Seamlessly preserves all original design elements (`Index.html`, `Index.css`, `Manvii.css`, `Naveen.css`) including the lush green agricultural color palette (`#2e7d32`, `#4caf50`, `#83c13b`), Poppins typography, and signature stat cards.

---

## 🚀 5. How to Run Locally

### Option A: Double-Click Runner (Windows)
Double-click `start.bat` in this folder. It automatically runs the fullstack server on port `5000` and opens in your browser at `http://localhost:5000`.

### Option B: Terminal Command
```bash
# From the AnnSetu project directory:
npm start
```
Then visit `http://localhost:5000` in any browser.

### Deploy on Render

1. Push this repository to GitHub and create a new Blueprint in Render using `render.yaml`.
2. Configure `MONGO_URI` in the Render service environment to retain registrations, listings, and orders across restarts.
3. Keep the generated `JWT_SECRET` private. Leave `DEMO_LOGIN_ENABLED` disabled for public use.
4. After the first successful deploy, copy the Render service URL into `HOSTED_LINK.txt`.

The Render service uses the free plan configuration, which can sleep when idle. Always-on service and persistent disks may require a paid plan.

---

## 📡 6. REST API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | Public |
| `POST` | `/api/auth/register` | Register new Farmer or Buyer | Public |
| `POST` | `/api/auth/login` | Login with email & password | Public |
| `POST` | `/api/auth/demo-login` | Instant demo login (Farmer / Buyer / Admin) | Public |
| `GET` | `/api/auth/me` | Current authenticated user details | Authenticated |
| `GET` | `/api/products` | Browse produce with search, category & state filters | Public |
| `POST` | `/api/products` | Create a new produce listing | Farmer |
| `PUT` | `/api/products/:id` | Update produce listing | Farmer (Owner) |
| `DELETE`| `/api/products/:id` | Remove produce listing | Farmer (Owner) |
| `GET` | `/api/orders/buyer/mine` | View logged-in buyer orders with tracking | Buyer |
| `GET` | `/api/orders/farmer/mine` | View incoming orders for farmer produce | Farmer |
| `PUT` | `/api/orders/:id/status` | Update dispatch / delivery status | Farmer / Admin |
| `GET` | `/api/mandi` | Retrieve live APMC Mandi benchmark rates | Public |
| `POST` | `/api/inquiries` | Send negotiation inquiry from buyer to farmer | Buyer |
| `PUT` | `/api/inquiries/:id/reply`| Farmer reply to buyer inquiry | Farmer |
| `GET` | `/api/analytics` | Platform metrics (farmers, orders, GMV) | Public |
