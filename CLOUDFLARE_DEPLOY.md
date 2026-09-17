# Cloudflare Deployment Guide for NaijaSpots

This Next.js application is configured with **Static HTML Export (`output: 'export'`)** and **Cloudflare Workers Static Assets (`wrangler.jsonc`)**. It can be deployed either as a **Cloudflare Worker** (via `npx wrangler deploy`) or as a **Cloudflare Pages** site.

---

## 🚀 Method A: Cloudflare Workers (Builds & Deploy)

If you are using Cloudflare Workers (CI command: `npx wrangler deploy`):

1. The repository now includes `wrangler.jsonc` configured with:
   ```jsonc
   {
     "$schema": "node_modules/wrangler/config-schema.json",
     "name": "naijaspot",
     "compatibility_date": "2026-09-17",
     "assets": {
       "directory": "./out",
       "html_handling": "auto-trailing-slash",
       "not_found_handling": "404-page"
     }
   }
   ```
2. In your Cloudflare Workers Dashboard under **Settings** > **Builds**:
   - **Build command**: `npm run build`
   - **Deploy command**: `npx wrangler deploy`
   - **Build output directory**: `out` (or leave default since `wrangler.jsonc` sets `./out`)
3. With `wrangler.jsonc` in place, Wrangler will **not** attempt OpenNext migration and will deploy the pre-rendered static assets directly to Cloudflare's global edge network.

---

## 🚀 Method B: Cloudflare Pages (Alternative)

If you create a **Pages** project:

1. In **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**:
2. Select `Bamdalas6/naijaspot`.
3. In Build settings:
   - **Framework preset**: `Next.js (Static HTML Export)` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
4. Click **Save and Deploy**.

---

## ⚡ What was configured in this codebase:

1. **`wrangler.jsonc`**:
   - Defines `"assets": { "directory": "./out" }` so `npx wrangler deploy` uploads the static export directly without triggering OpenNext or Node server migration.
2. **`package.json`**:
   - Includes `"wrangler": "^4.134.0"` in `devDependencies` for fast, reproducible builds.
   - Added `"deploy": "wrangler deploy"` script.
3. **`next.config.mjs`**:
   - `output: 'export'` generates the complete `./out` directory.
   - `images: { unoptimized: true }` ensures remote images load directly via CDN.
   - `trailingSlash: true` guarantees proper edge routing.
4. **`public/_headers`**:
   - Sets 1-year cache headers (`max-age=31536000, immutable`) for all Next.js static JS/CSS chunks.
