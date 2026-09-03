# NaijaSpots E2E Test Infrastructure & Architecture

## Overview
The NaijaSpots E2E test infrastructure provides a comprehensive, requirement-driven, opaque-box test suite designed to validate the platform against the acceptance criteria defined in `ORIGINAL_REQUEST.md` and the interface contracts in `types/index.ts`.

The test harness is built on Node.js's native test runner (`node --test`) and assertion library (`node:assert/strict`), eliminating heavy external testing dependencies while achieving high-speed, parallelized execution, zero-overhead ES module support, and native asynchronous primitives.

---

## Testing Principles

1. **Opaque-Box Requirement Derivation**: Tests assert strictly against external requirements (`ORIGINAL_REQUEST.md`) and authoritative interface specifications (`Spot` interface in `types/index.ts`). No tests are coupled to private implementation details or generator internals.
2. **Progressive Testability & No-Facade Integrity**: Tests exercise authentic data boundaries, network connectivity, and compiler pipelines. The test suite rejects dummy datasets or incomplete catalogs, accurately identifying missing requirements prior to milestone completion.
3. **Multi-Tiered Verification**: Coverage is stratified across four distinct validation tiers ranging from raw data schema conformance up to live CDN media availability and production Next.js build compilation.
4. **Adversarial Resiliency**: Tests inspect UTF-8 encoding fidelity (preserving the Nigerian Naira `₦` currency symbol without Unicode replacement artifacts `\uFFFD` or mojibake `â‚¦`), guard against placeholder tokens, enforce distance formatting regexes, and verify payload size thresholds.

---

## 4-Tier Test Architecture

```
                       ┌──────────────────────────────────────┐
                       │          Master Test Runner          │
                       │          (test/runner.mjs)           │
                       └──────────────────┬───────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
┌───────▼───────────────┐       ┌─────────▼─────────────┐       ┌───────────▼───────────┐
│  test/e2e_dataset...  │       │   test/e2e_media...   │       │   test/e2e_build...   │
├───────────────────────┤       ├───────────────────────┤       ├───────────────────────┤
│ Tier 1: Feature Cov.  │       │ Tier 4: CDN Media     │       │ Tier 4: Next.js Build │
│ Tier 2: Boundaries    │       │ - Parallel HTTP Scan  │       │ - TS Typecheck        │
│ Tier 3: Combinations  │       │ - Payload < 3.0 MB    │       │ - .next Artifacts     │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```

### Tier 1: Feature Coverage & Dataset Completeness (`test/e2e_dataset.test.mjs`)
- **T1.1 Total Spot Count**: Asserts `data/spots.json` contains >= 2,100 valid spot records.
- **T1.2 Hyper-Dense Lagos Coverage**: Asserts Lagos State contains > 700 distinct spot records.
- **T1.3 Comprehensive Nationwide Catalog**: Validates that all other 36 Nigerian states and Abuja (FCT) have >= 35 spots each (37 administrative entities total).
- **T1.4 Category Completeness**: Validates that all 5 discovery categories (`Eatery & Dining`, `Bars & Lounges`, `Historical & Memory`, `Nature & Parks`, `Arts & Culture`) are present in every state/FCT.
- **T1.5 Interface Conformance**: Enforces strict conformance to the TypeScript `Spot` interface (`types/index.ts`), verifying all required fields (`id`, `name`, `category`, `priceRating`, `city`, `state`, `address`, `description`, `imageUrl`) and permitted optional fields (`priceRange`, `rating`, `reviewsCount`, `openingHours`, `distance`, `amenities`, `featured`, `tags`), and forbidding rogue/unauthorized keys.

### Tier 2: Boundary & Corner Cases (`test/e2e_dataset.test.mjs`)
- **T2.1 Price Rating Boundaries**: Verifies price tiers strictly belong to `['Free', '₦', '₦₦', '₦₦₦', '₦₦₦₦']`.
- **T2.2 Distance Format**: Validates distance complies with regex `^.+ • \d+(\.\d+)? km away$` and verifies numeric distance is a realistic non-negative float.
- **T2.3 Rating Range**: Asserts all ratings are finite numbers bounded within `[1.0, 5.0]`.
- **T2.4 Reviews Count**: Asserts all review counts are non-negative integers (`>= 0`).
- **T2.5 ID Uniqueness**: Confirms 100% unique string IDs across the dataset (zero duplicate IDs).
- **T2.6 Data Fidelity & Anti-Placeholder**: Asserts address (>= 5 chars), description (>= 20 chars), and name (>= 3 chars) are non-empty and contains no placeholder tokens (`[object Object]`, `undefined`, `null`, `TODO`, `lorem ipsum`).
- **T2.7 Amenities & Tags Collection**: Asserts amenities and tags arrays contain valid non-empty string entries.
- **T2.8 UTF-8 Currency Integrity**: Asserts data integrity of Nigerian Naira `₦` symbol with 0 Unicode replacement characters (`\uFFFD`) or mojibake.

### Tier 3: Cross-Feature Combinations (`test/e2e_dataset.test.mjs`)
- **T3.1 State x Category Matrix**: Asserts that every single one of the 185 combinations (37 states/entities x 5 categories) is populated with valid spots.
- **T3.2 Lagos Urban & Coastal Zones**: Verifies representation across all 10 designated Lagos zones (`Lekki Phase 1`, `Victoria Island`, `Ikoyi`, `Ikeja GRA`, `Marina`, `Yaba`, `Surulere`, `Badagry`, `Epe`, `Ikorodu`).
- **T3.3 Featured Spot Distribution**: Verifies featured spots exist across diverse states (>= 10 states) and cover all 5 discovery categories.
- **T3.4 Price Tier Diversity**: Asserts all price rating tiers are represented across the dataset.

### Tier 4: Real-World Scenarios & Reliability (`test/e2e_media.test.mjs` & `test/e2e_build.test.mjs`)
- **T4.1 Data Payload Size**: Validates uncompressed `data/spots.json` payload size is strictly under 3.0 MB (`< 3,145,728 bytes`).
- **T4.2 Image URL Syntax**: Validates all spot image URLs parse as valid `http:` or `https:` URLs.
- **T4.3 Parallel CDN Media Quality Scan**: Programmatic scanner executing parallel HTTP `HEAD` requests (with fallback to range `GET` for CDNs restricting HEAD) with worker pool concurrency (15 concurrent workers) and timeout control (10,000 ms). Validates 100% HTTP 200 OK and zero 404/broken URLs.
- **T4.4 Next.js Production Build**: Spawns `node ./node_modules/next/dist/bin/next build`, validates exit code 0 and verifies 0 TypeScript compilation errors (`Type error:`, `error TS\d+:`).
- **T4.5 Deployment Artifacts**: Validates `.next` output contains `BUILD_ID`, `routes-manifest.json`, and static assets.

---

## Test Runner Architecture (`test/runner.mjs`)

The master runner orchestrates test execution with rich terminal output, suite timing, and granular exit codes.

### CLI Options
```bash
# Execute entire 4-tier E2E suite
node test/runner.mjs

# Execute Tiers 1-3 (Dataset Completeness, Boundaries, Combinations)
node test/runner.mjs --dataset

# Execute Tier 4 Media Scan only
node test/runner.mjs --media

# Execute Tier 4 Next.js Production Build only
node test/runner.mjs --build

# Fast execution (Tiers 1-3 + Media Scan, skipping Next.js build)
node test/runner.mjs --fast
```

### Direct Node.js Native Test Commands
```bash
# Run dataset validation suite directly
node --test test/e2e_dataset.test.mjs

# Run media validation suite directly
node --test test/e2e_media.test.mjs

# Run build verification suite directly
node --test test/e2e_build.test.mjs

# Run all tests using node native test runner
node --test test/*.test.mjs
```

---

## Execution Performance Profile

| Test Suite | Focus | Typical Runtime | Concurrency |
|------------|-------|-----------------|-------------|
| `test/e2e_dataset.test.mjs` | Tiers 1-3 (17 tests) | ~0.15s - 0.25s | In-process synchronous & async checks |
| `test/e2e_media.test.mjs` | Tier 4 Media & Payload (3 tests) | ~5s - 8s | 15-worker HTTP pool |
| `test/e2e_build.test.mjs` | Tier 4 Next.js Build (2 tests) | ~18s - 22s | Child process Next.js production build |
| **Total Full Run** | **All 4 Tiers (22 tests)** | **~24s - 30s** | Full pipeline |
