# gemini_clone
# Gemini Backend Assignment – Kuvaka Tech

A full-featured backend built with **Node.js**, **Express**, **PostgreSQL**, **Redis**, **BullMQ**, and **Stripe** to support chatroom management, async Gemini AI integration, user subscriptions, rate-limiting, and more.

---

## 🚀 Features

- ✅ JWT-based user authentication
- ✅ OTP-based login (mocked via API)
- ✅ Chatroom management (create/list/get)
- ✅ Send message → async Gemini response (via queue)
- ✅ Redis-based caching for chatroom list
- ✅ Stripe integration for Pro subscriptions
- ✅ Rate limiting (5 prompts/day for Basic users)
- ✅ Webhook handling for Stripe events
- ✅ Structured error handling middleware
- ✅ Consistent API responses

---

## ⚙️ Setup & Run Instructions

### 1. Clone and Install

git clone https://github.com/<your-username>/gemini-backend.git
cd gemini-backend
npm install

### 2. Setup .env 
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_ID=price_abc123
STRIPE_WEBHOOK_SECRET=whsec_xxx
DOMAIN=http://localhost:5000
DATABASE_URL=postgres://username:password@localhost:5432/gemini_clone

###  3. Run PostgreSQL Migrations
npx sequelize-cli db:migrate

### 4 Start Redis (via Docker)
docker run -d --name redis-server -p 6379:6379 redis

### 5 Start Server
npm run dev

### 6 Start Queue Worker (in a separate terminal)
node queue/worker.js

### 7 Architecture Overview
Backend: Node.js + Express

Database: PostgreSQL (with Sequelize ORM)

Caching: Redis (for chatroom list + rate limiting)

Queue: BullMQ + Redis (for Gemini job processing)

Auth: JWT (with mock OTP login)

Subscription: Stripe Checkout + Webhooks

### Gemini API Integration
Integrated via Google’s Gemini-2.0-flash model 

Uses API key authentication

Caches message response in the Messages table

### Assumptions & Design Decisions
OTP is returned in the response (no real SMS integration)

Each user has their own set of chatrooms

Chatroom list is cached with a TTL of 5 minutes

Stripe webhooks are the source of truth for Pro tier

Free users are limited to 5 messages per day (rate-limited via Redis)

Gemini messages are processed async to improve UX & reliability

