# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tapisri-Said** — Moroccan furniture showcase website.
- `frontend/` — React 19 + Vite, deployed on **Vercel**
- `backend/` — Laravel 12 + Sanctum API, deployed on **Railway** (Docker)
- Images stored on **Cloudinary** (Railway filesystem is ephemeral)

---

## Commands

### Frontend (`frontend/`)
```bash
npm run dev       # dev server (localhost:5173)
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

### Backend (`backend/`)
```bash
php artisan serve              # dev server (localhost:8000)
php artisan migrate            # run migrations
php artisan db:seed --class=AdminSeeder   # seed admin user
composer test                  # run PHPUnit tests
./vendor/bin/pint              # Laravel Pint code formatter
```

### Deploy
Push to `origin master` — Vercel auto-deploys the frontend, Railway auto-deploys the backend via Docker.

---

## Environment Variables

### Frontend (`.env` / Vercel dashboard)
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://xxx.up.railway.app/api`) |
| `VITE_STORAGE_URL` | Unused for new images (Cloudinary), kept for legacy |
| `VITE_WHATSAPP` | WhatsApp number digits only (e.g. `212671998528`) |

### Backend (Railway Variables)
| Variable | Purpose |
|---|---|
| `CLOUDINARY_URL` | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |
| `APP_KEY` | Laravel app key |
| `DB_*` | Railway MySQL/PostgreSQL vars |
| `FRONTEND_URL` | Used in CORS config |

---

## Architecture

### Frontend

**Routing** (`src/App.jsx`):
- Public: `/`, `/produits`, `/produits/:slug`
- Admin (Sanctum-protected): `/admin`, `/admin/produits`, `/admin/categories`, `/admin/parametres`
- Auth gate: `useAuthStore` (Zustand) — stores Bearer token in `localStorage`

**API layer** (`src/api/axios.js`):
- All requests go through a single axios instance
- Auto-attaches `Authorization: Bearer <token>` from `localStorage`
- 401 on `/admin/*` routes → clears token and redirects to `/admin/login`

**Image handling** (`src/config.js` → `img()` helper):
- Images stored on Cloudinary return full `https://` URLs
- Old Railway local paths (e.g. `products/phpXXX.jpg`) return `null` → callers use an inline SVG placeholder
- `PLACEHOLDER` constant in `ProductCard` and `ProductDetailPage` is a `data:image/svg+xml` URI (no external request)

**Data fetching**: `@tanstack/react-query` — queryKey conventions:
- `['categories']`, `['products', categorySlug]`, `['product', slug]`, `['products', 'featured']`

**Styling**: All inline styles (no CSS-in-JS library, no Tailwind). Shared color palette:
- Dark brown: `#1c0e08` / `#2c1810`
- Gold accent: `#d4a96a`
- Background: `#faf6f1` / `#f7f3ee`

### Backend

**Models**: `User`, `Category` (has many `Product`), `Product` (belongs to `Category`, has many `ProductImage`), `ProductImage`

**Image upload flow** (`ProductImageController`):
1. Receives file upload via multipart form
2. Parses `CLOUDINARY_URL` with `parse_url()` to extract credentials
3. Uploads to Cloudinary folder `tapisri/products` with `quality: auto, fetch_format: auto`
4. Stores the returned `secure_url` as `path` and `public_id` as `cloudinary_public_id` in `product_images`
5. First image of a product is automatically set as `is_main = true`

**Auth**: Laravel Sanctum — single admin user seeded by `AdminSeeder`. Token returned on `/api/login`, sent as `Authorization: Bearer` header.

**Products API**:
- `GET /api/products` — public, only active (`is_active = true`), with main image
- `GET /api/admin/products` — admin, all products including inactive
- Products have a `slug` field used for URL routing

**Railway Dockerfile notes**:
- Uses `php:8.3-cli-alpine`, no web server (runs `php artisan serve`)
- `--no-scripts` during `composer install` skips auto-discovery → `package:discover` is called explicitly in both Dockerfile and `start.sh`
- `start.sh` runs migrations and AdminSeeder on every boot (idempotent)
- `CloudinaryServiceProvider` is manually registered in `bootstrap/providers.php` (not auto-discovered reliably)
