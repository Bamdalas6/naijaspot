/**
 * NaijaSpots 4-Tier E2E Test Suite: Media Quality & Payload Verification
 * Tier 4: Real-World Scenarios & Reliability
 *
 * Requirements Source: ORIGINAL_REQUEST.md §R3 & Acceptance Criteria
 * Framework: Node.js Native Test Runner (node --test)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SPOTS_FILE_PATH = path.join(PROJECT_ROOT, 'data', 'spots.json');

// Concurrency and timeout configuration
const SCAN_CONCURRENCY = 15;
const REQUEST_TIMEOUT_MS = 10000;
const MAX_PAYLOAD_SIZE_BYTES = 3 * 1024 * 1024; // 3.0 MB

/**
 * Executes async tasks with controlled worker pool concurrency
 */
async function poolAll(items, workerFn, concurrency = SCAN_CONCURRENCY) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];
      try {
        const result = await workerFn(item, currentIndex);
        results[currentIndex] = { success: true, item, result };
      } catch (err) {
        results[currentIndex] = { success: false, item, error: err };
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Checks an individual image URL via HTTP HEAD with GET fallback
 */
async function verifyImageUrl(url) {
  let response;
  let methodUsed = 'HEAD';

  try {
    response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'NaijaSpots-MediaQualityScanner/1.0',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    // If HEAD is not allowed or restricted, fallback to streaming GET
    if (response.status === 405 || response.status === 403) {
      methodUsed = 'GET';
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'NaijaSpots-MediaQualityScanner/1.0',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Range': 'bytes=0-1024'
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
    }
  } catch (err) {
    // Retry once on transient network glitch
    await new Promise(resolve => setTimeout(resolve, 500));
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'NaijaSpots-MediaQualityScanner/1.0',
        'Range': 'bytes=0-1024'
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    methodUsed = 'GET-RETRY';
  }

  const contentType = response.headers.get('content-type') || '';
  const contentLength = response.headers.get('content-length');

  return {
    url,
    status: response.status,
    ok: response.ok,
    methodUsed,
    contentType,
    contentLength: contentLength ? parseInt(contentLength, 10) : null
  };
}

describe('Tier 4: Media Quality Scan & Data Payload Verification', () => {
  it('T4.1: data/spots.json uncompressed payload size is strictly under 3.0 MB', () => {
    assert.ok(fs.existsSync(SPOTS_FILE_PATH), `spots.json must exist at ${SPOTS_FILE_PATH}`);
    const stats = fs.statSync(SPOTS_FILE_PATH);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(3);

    assert.ok(
      stats.size < MAX_PAYLOAD_SIZE_BYTES,
      `data/spots.json uncompressed size must be < 3.0 MB (3,145,728 bytes), but found ${stats.size} bytes (${sizeInMB} MB)`
    );
    assert.ok(
      stats.size > 50000,
      `data/spots.json appears suspiciously small (${stats.size} bytes)`
    );
  });

  it('T4.2: All spot records define syntactically valid HTTP/HTTPS image URLs', () => {
    const rawContent = fs.readFileSync(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(rawContent);
    const malformedUrls = [];

    spots.forEach((spot, idx) => {
      if (!spot.imageUrl || typeof spot.imageUrl !== 'string') {
        malformedUrls.push(`Spot #${idx + 1} (${spot.id}) missing or invalid imageUrl`);
        return;
      }

      try {
        const parsed = new URL(spot.imageUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          malformedUrls.push(`Spot #${idx + 1} (${spot.id}) non-HTTP protocol: ${parsed.protocol}`);
        }
      } catch (err) {
        malformedUrls.push(`Spot #${idx + 1} (${spot.id}) unparseable URL: "${spot.imageUrl}" (${err.message})`);
      }
    });

    assert.equal(
      malformedUrls.length,
      0,
      `Malformed image URLs found (${malformedUrls.length}):\n${malformedUrls.slice(0, 10).join('\n')}`
    );
  });

  it('T4.3: Programmatic media scan confirms 100% HTTP 200 OK and 0 broken/404 image URLs', async () => {
    const rawContent = fs.readFileSync(SPOTS_FILE_PATH, 'utf-8');
    const spots = JSON.parse(rawContent);

    // Extract unique image URLs to scan
    const uniqueUrls = Array.from(new Set(spots.map(s => s.imageUrl).filter(Boolean)));
    assert.ok(uniqueUrls.length > 0, 'Must have image URLs to scan');

    console.log(`\n  [Media Scan] Commencing programmatic scan of ${uniqueUrls.length} unique image URLs (representing ${spots.length} spots)...`);
    const startTime = Date.now();

    const scanResults = await poolAll(uniqueUrls, verifyImageUrl, SCAN_CONCURRENCY);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const failures = [];
    let successCount = 0;

    for (const res of scanResults) {
      if (!res.success) {
        failures.push({
          url: res.item,
          status: 'NETWORK_ERROR',
          error: res.error ? res.error.message : 'Unknown network failure'
        });
      } else if (!res.result.ok) {
        failures.push({
          url: res.item,
          status: res.result.status,
          error: `HTTP ${res.result.status}`
        });
      } else {
        successCount++;
      }
    }

    console.log(`  [Media Scan] Completed in ${duration}s. Success: ${successCount}/${uniqueUrls.length}, Failures: ${failures.length}`);

    assert.equal(
      failures.length,
      0,
      `Image CDN Scan detected ${failures.length} broken/unreachable URLs:\n${failures.map(f => `  - [${f.status}] ${f.url} (${f.error})`).join('\n')}`
    );
    assert.equal(
      successCount,
      uniqueUrls.length,
      `Expected all ${uniqueUrls.length} image URLs to return HTTP 200 OK`
    );
  });
});
