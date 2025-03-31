# ToyShop LK — Setup Guide

## Prerequisites
- Node.js 18+
- MySQL 8.0+ (XAMPP works great)
- npm or yarn

---

## 1. Database Setup

Open **phpMyAdmin** or MySQL CLI and run:

```sql
-- Run schema first
SOURCE database/schema.sql;

-- Then seed data
SOURCE database/seed.sql;
```

Or in MySQL CLI:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials
npm run dev
```

Backend runs on: http://localhost:5000

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---

## 4. Test Login Credentials

| Role  | Email                  | Password |
|-------|------------------------|----------|
| Admin | admin@toyshop.lk       | password |
| User  | john@example.com       | password |

---

## 5. Admin Panel

Visit: http://localhost:5173/admin

---

## Project Structure

```
Online Book Shop/
├── backend/
│   ├── src/
│   │   ├── config/       # DB + Cloudinary config
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, upload middleware
│   │   ├── routes/       # API routes
│   │   ├── utils/        # JWT, helpers
│   │   └── server.js     # Entry point
│   ├── uploads/          # Local image storage
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Context (Auth, Cart)
│   │   ├── pages/        # Page components
│   │   ├── utils/        # API client, helpers
│   │   └── App.jsx
│   └── index.html
└── database/
    ├── schema.sql        # Table definitions
    └── seed.sql          # Sample data
```

---

## API Endpoints

| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| POST   | /api/auth/register          | Register user         |
| POST   | /api/auth/login             | Login                 |
| GET    | /api/products               | List products         |
| GET    | /api/products/:slug         | Product details       |
| POST   | /api/orders                 | Place order           |
| GET    | /api/orders/my-orders       | My orders             |
| POST   | /api/wishlist/:id           | Toggle wishlist       |
| POST   | /api/coupons/validate       | Validate coupon       |
| GET    | /api/admin/dashboard        | Admin stats           |

---

## Available Coupon Codes

| Code       | Discount         | Min Order    |
|------------|------------------|--------------|
| WELCOME10  | 10% off          | LKR 500      |
| SCHOOL20   | 20% off          | LKR 2,000    |
| FLAT500    | LKR 500 off      | LKR 3,000    |
| TOYS15     | 15% off          | LKR 1,000    |
