# Kameez Wala MERN

Luxury full-stack fashion e-commerce platform built with:

## Live Demo

https://kameez-wala-mern.vercel.app

- MongoDB
- Express.js
- React + Vite
- Node.js
- Tailwind CSS
- Framer Motion
- JWT authentication

## Project Structure

```text
client/   React frontend
server/   Express + MongoDB backend
```

## Features

- JWT auth with register/login
- MongoDB models for users, products, carts, and orders
- Product listing with category filter and search
- Product details with related products carousel
- Protected cart and order placement flow
- Animated luxury UI with Framer Motion
- Dark mode, preloader, cart sidebar, toast notifications

## Environment Variables

### Server

Copy `server/.env.example` to `server/.env`

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://neilshukla008_db_user:<db_password>@cluster0.udjazry.mongodb.net/kameez-wala?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
```

### Client

Copy `client/.env.example` to `client/.env`

```env
VITE_API_URL=http://localhost:5001/api
```

## Install

### 1. Install both apps

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Or use:

```bash
npm run install:all
```

### 2. Atlas or local fallback

If MongoDB Atlas is configured and your IP is allowed, the backend will connect to Atlas.

If Atlas is unavailable, the backend automatically falls back to a file-backed local development store at `server/.data/dev-store.json`. This fallback includes:

- Seeded products
- Persistent local users, carts, and orders
- A default admin account

Default admin login:

- `admin@kameezwala.local`
- `admin123`

### Vercel deployment requirements

For Vercel production:

- `MONGO_URI` must point to MongoDB Atlas and your Vercel deployment must be allowed in Atlas network access
- `JWT_SECRET` must be set in Vercel environment variables
- `BLOB_READ_WRITE_TOKEN` must be set so admin image uploads use Vercel Blob
- `CLIENT_URL` can be set to your deployed Vercel domain

This repo includes:

- `vercel.json` for Vite + API deployment
- `api/index.mjs` as the Vercel function entrypoint
- automatic Vercel Blob image storage in production
- local file uploads only for local development

### 3. Seed products

When using MongoDB, start the backend, then call:

```bash
curl -X POST http://localhost:5001/api/dev/seed
```

## Run

### Run frontend + backend together

```bash
npm run dev
```

### Run individually

```bash
npm run client
npm run server
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin only
- `PUT /api/products/:id` admin only
- `DELETE /api/products/:id` admin only

### Cart

- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:itemId`
- `DELETE /api/cart/:itemId`

### Orders

- `GET /api/orders`
- `POST /api/orders`

## Notes

- The frontend uses Axios with `VITE_API_URL`
- Cart and orders require login
- Product data is persisted in MongoDB when available
- Without MongoDB, the server uses `server/.data/dev-store.json`
- The current seed route is for local development convenience
