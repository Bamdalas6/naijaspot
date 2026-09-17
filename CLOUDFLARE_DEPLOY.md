# Cloudflare Pages Deployment Guide for NaijaSpots

This Next.js application is configured for **Static HTML Export (`output: 'export'`)**, which deploys natively to **Cloudflare Pages** with 0ms cold starts, global CDN edge caching, and 100% free bandwidth.

---

## 🚀 One-Time Setup in Cloudflare Dashboard

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository: `Bamdalas6/naijaspot`.
3. In the **Set up builds and deployments** step, configure:
   - **Project name**: `naijaspot` (or your preferred subdomain)
   - **Production branch**: `main`
   - **Framework preset**: `Next.js (Static HTML Export)` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
4. Under **Environment variables** (optional):
   - Add `NODE_VERSION` = `20` (or leave default)
   - (If using Supabase): Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Save and Deploy**.

---

## ⚡ What was configured in this codebase:

1. **`next.config.mjs`**:
   - `output: 'export'`: Produces the standalone static `out/` bundle containing pre-rendered HTML for all routes (`/`, `/saved`, `/404`).
   - `images: { unoptimized: true }`: Enables Next.js `<Image />` tags to pull directly from remote CDNs without needing a dedicated Node.js server.
   - `trailingSlash: true`: Ensures deep links like `/saved/` resolve cleanly across Cloudflare edge servers without 404 routing errors.
2. **`public/_headers`**:
   - Configures edge browser caching (`max-age=31536000, immutable`) for all Next.js static JS/CSS chunks, plus modern security headers (`X-Frame-Options`, `X-Content-Type-Options`).
3. **`package.json`**:
   - `"build": "next build"` works uniformly across Cloudflare Pages, Vercel, and local systems.
