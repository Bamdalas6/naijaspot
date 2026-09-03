import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const SPOTS_PATH = path.resolve('data/spots.json');

async function runMediaScan() {
  console.log('====================================================');
  console.log('1. ADVERSARIAL MEDIA ASSET SCAN');
  console.log('====================================================');

  const raw = fs.readFileSync(SPOTS_PATH, 'utf8');
  const spots = JSON.parse(raw);

  console.log(`Loaded ${spots.length} spots from ${SPOTS_PATH}`);

  const uniqueUrls = Array.from(new Set(spots.map(s => s.imageUrl)));
  console.log(`Unique image URLs to verify: ${uniqueUrls.length}`);

  // Parameter check
  const requiredParams = ['auto=format', 'fit=crop', 'w=1000', 'q=80'];
  const paramFailures = [];

  for (const url of uniqueUrls) {
    for (const param of requiredParams) {
      if (!url.includes(param)) {
        paramFailures.push({ url, missing: param });
      }
    }
  }

  console.log(`URL Parameter Integrity: ${paramFailures.length === 0 ? 'PASS (100% compliant)' : 'FAIL'}`);
  if (paramFailures.length > 0) {
    console.error('Parameter failures:', paramFailures);
  }

  // Network verification with concurrency
  console.log(`\nProbing ${uniqueUrls.length} unique URLs via HTTP HEAD/GET...`);
  const concurrency = 10;
  const results = [];
  let idx = 0;

  async function probe(url) {
    const start = performance.now();
    let status = 0;
    let ok = false;
    let contentType = '';
    let contentLength = '';
    let method = 'HEAD';
    let errorMsg = null;

    try {
      let res = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'NaijaSpots-Challenger2-Scanner/1.0',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        },
        signal: AbortSignal.timeout(12000)
      });

      if (res.status === 405 || res.status === 403) {
        method = 'GET';
        res = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'NaijaSpots-Challenger2-Scanner/1.0',
            'Range': 'bytes=0-1024'
          },
          signal: AbortSignal.timeout(12000)
        });
      }

      status = res.status;
      ok = res.ok;
      contentType = res.headers.get('content-type') || '';
      contentLength = res.headers.get('content-length') || '';
    } catch (err) {
      // Retry once on failure
      try {
        method = 'GET-RETRY';
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'NaijaSpots-Challenger2-Scanner/1.0',
            'Range': 'bytes=0-1024'
          },
          signal: AbortSignal.timeout(15000)
        });
        status = res.status;
        ok = res.ok;
        contentType = res.headers.get('content-type') || '';
        contentLength = res.headers.get('content-length') || '';
      } catch (retryErr) {
        errorMsg = retryErr.message;
      }
    }

    const duration = performance.now() - start;
    return {
      url,
      method,
      status,
      ok,
      contentType,
      contentLength,
      durationMs: duration.toFixed(1),
      errorMsg
    };
  }

  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < uniqueUrls.length) {
      const current = idx++;
      const res = await probe(uniqueUrls[current]);
      results.push(res);
      process.stdout.write(`[${results.length}/${uniqueUrls.length}] `);
    }
  });

  await Promise.all(workers);
  console.log('\nScan complete.\n');

  const failed = results.filter(r => !r.ok || r.status !== 200);
  const nonImages = results.filter(r => !r.contentType.startsWith('image/'));

  console.log('--- Media Scan Summary ---');
  console.log(`Total URLs probed: ${results.length}`);
  console.log(`HTTP 200 OK: ${results.filter(r => r.status === 200).length}`);
  console.log(`Non-200 / Broken URLs: ${failed.length}`);
  console.log(`Invalid Content-Types: ${nonImages.length}`);

  if (failed.length > 0) {
    console.error('Broken URLs:', failed);
  }
  if (nonImages.length > 0) {
    console.error('Non-image responses:', nonImages);
  }

  return {
    total: results.length,
    failed: failed.length,
    nonImages: nonImages.length,
    paramFailures: paramFailures.length,
    results
  };
}

function runRuntimeBenchmark() {
  console.log('\n====================================================');
  console.log('2. EMPIRICAL CLIENT RUNTIME BENCHMARK');
  console.log('====================================================');

  const raw = fs.readFileSync(SPOTS_PATH, 'utf8');
  const spots = JSON.parse(raw);
  console.log(`Dataset size: ${spots.length} spots`);

  const states = Array.from(new Set(spots.map(s => s.state)));
  const categories = ["All", "Eatery & Dining", "Bars & Lounges", "Historical & Memory", "Nature & Parks", "Arts & Culture"];

  console.log(`Benchmarking across ${states.length} states and ${categories.length} categories (${states.length * categories.length} unique combinations)...`);

  // 1. State + Category Filtering Benchmark
  // Matching logic in hooks/usePlaces.ts
  function filterPlaces(state, category) {
    let filtered = spots.filter(spot => spot.state === state);
    if (category !== "All") {
      filtered = filtered.filter(spot => spot.category === category);
    }
    return filtered;
  }

  // Warm up JIT
  for (let i = 0; i < 500; i++) {
    filterPlaces(states[i % states.length], categories[i % categories.length]);
  }

  const FILTER_ITERATIONS = 5000;
  const filterTimes = [];

  for (let i = 0; i < FILTER_ITERATIONS; i++) {
    const st = states[i % states.length];
    const cat = categories[i % categories.length];
    const t0 = performance.now();
    const res = filterPlaces(st, cat);
    const t1 = performance.now();
    filterTimes.push(t1 - t0);
  }

  filterTimes.sort((a, b) => a - b);
  const filterSum = filterTimes.reduce((acc, v) => acc + v, 0);
  const filterAvg = filterSum / filterTimes.length;
  const filterP50 = filterTimes[Math.floor(filterTimes.length * 0.50)];
  const filterP95 = filterTimes[Math.floor(filterTimes.length * 0.95)];
  const filterP99 = filterTimes[Math.floor(filterTimes.length * 0.99)];
  const filterMax = filterTimes[filterTimes.length - 1];
  const filterMin = filterTimes[0];

  console.log('\n--- State & Category Filter Latency (5,000 runs) ---');
  console.log(`Average: ${filterAvg.toFixed(4)} ms`);
  console.log(`Median (p50): ${filterP50.toFixed(4)} ms`);
  console.log(`p95: ${filterP95.toFixed(4)} ms`);
  console.log(`p99: ${filterP99.toFixed(4)} ms`);
  console.log(`Min: ${filterMin.toFixed(4)} ms | Max: ${filterMax.toFixed(4)} ms`);
  console.log(`Budget compliance (< 1.0 ms): ${filterAvg < 1.0 && filterP99 < 1.0 ? 'PASS (SUB-FRAME BUDGET MET)' : 'FAIL'}`);

  // 2. Full-Text Search Filtering Benchmark
  // Matching logic in app/page.tsx:
  // p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  function searchPlaces(places, query) {
    if (!query.trim()) return places;
    const q = query.toLowerCase();
    return places.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  const searchQueries = [
    "a", "e", "lagos", "lounge", "park", "buka", "beach", "grill",
    "calabar", "ibadan", "cultural", "waterfall", "heritage",
    "suya", "garden", "resort", "palace", "museum", "cafe",
    "nonexistent_adversarial_query_xyz_12345"
  ];

  // Warmup JIT
  for (let i = 0; i < 500; i++) {
    searchPlaces(spots, searchQueries[i % searchQueries.length]);
  }

  const SEARCH_ITERATIONS = 5000;
  const searchTimes = [];

  for (let i = 0; i < SEARCH_ITERATIONS; i++) {
    const q = searchQueries[i % searchQueries.length];
    const t0 = performance.now();
    const res = searchPlaces(spots, q);
    const t1 = performance.now();
    searchTimes.push(t1 - t0);
  }

  searchTimes.sort((a, b) => a - b);
  const searchSum = searchTimes.reduce((acc, v) => acc + v, 0);
  const searchAvg = searchSum / searchTimes.length;
  const searchP50 = searchTimes[Math.floor(searchTimes.length * 0.50)];
  const searchP95 = searchTimes[Math.floor(searchTimes.length * 0.95)];
  const searchP99 = searchTimes[Math.floor(searchTimes.length * 0.99)];
  const searchMax = searchTimes[searchTimes.length - 1];
  const searchMin = searchTimes[0];

  console.log('\n--- Full-Text Search Latency Across ALL 2,160 Spots (5,000 runs) ---');
  console.log(`Average: ${searchAvg.toFixed(4)} ms`);
  console.log(`Median (p50): ${searchP50.toFixed(4)} ms`);
  console.log(`p95: ${searchP95.toFixed(4)} ms`);
  console.log(`p99: ${searchP99.toFixed(4)} ms`);
  console.log(`Min: ${searchMin.toFixed(4)} ms | Max: ${searchMax.toFixed(4)} ms`);

  // 3. Combined Realistic Client Pipeline:
  // Filter by state + Filter by category + Full text search query + Sort by rating/price
  const PRICE_WEIGHT = {
    Free: 0,
    "₦": 1,
    "₦₦": 2,
    "₦₦₦": 3,
    "₦₦₦₦": 4,
  };

  function fullPipeline(state, category, query, sort) {
    let list = filterPlaces(state, category);
    if (query.trim()) {
      list = searchPlaces(list, query);
    }
    if (sort === "rating") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "price-asc") {
      list = [...list].sort((a, b) => (PRICE_WEIGHT[a.priceRating] || 0) - (PRICE_WEIGHT[b.priceRating] || 0));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => (PRICE_WEIGHT[b.priceRating] || 0) - (PRICE_WEIGHT[a.priceRating] || 0));
    }
    return list;
  }

  const sorts = ["featured", "rating", "price-asc", "price-desc"];
  const PIPELINE_ITERATIONS = 5000;
  const pipelineTimes = [];

  for (let i = 0; i < PIPELINE_ITERATIONS; i++) {
    const st = states[i % states.length];
    const cat = categories[i % categories.length];
    const q = searchQueries[i % searchQueries.length];
    const srt = sorts[i % sorts.length];
    const t0 = performance.now();
    const res = fullPipeline(st, cat, q, srt);
    const t1 = performance.now();
    pipelineTimes.push(t1 - t0);
  }

  pipelineTimes.sort((a, b) => a - b);
  const pipeAvg = pipelineTimes.reduce((a, b) => a + b, 0) / pipelineTimes.length;
  const pipeP50 = pipelineTimes[Math.floor(pipelineTimes.length * 0.50)];
  const pipeP95 = pipelineTimes[Math.floor(pipelineTimes.length * 0.95)];
  const pipeP99 = pipelineTimes[Math.floor(pipelineTimes.length * 0.99)];
  const pipeMax = pipelineTimes[pipelineTimes.length - 1];

  console.log('\n--- Full Combined Pipeline Latency (Filter + Search + Sort, 5,000 runs) ---');
  console.log(`Average: ${pipeAvg.toFixed(4)} ms`);
  console.log(`Median (p50): ${pipeP50.toFixed(4)} ms`);
  console.log(`p95: ${pipeP95.toFixed(4)} ms`);
  console.log(`p99: ${pipeP99.toFixed(4)} ms`);
  console.log(`Max: ${pipeMax.toFixed(4)} ms`);

  // 4. Memory Stability Stress Test
  const heapBefore = process.memoryUsage().heapUsed;
  for (let i = 0; i < 50000; i++) {
    fullPipeline(states[i % states.length], categories[i % categories.length], searchQueries[i % searchQueries.length], sorts[i % sorts.length]);
  }
  if (global.gc) global.gc();
  const heapAfter = process.memoryUsage().heapUsed;
  const heapDiffMB = ((heapAfter - heapBefore) / (1024 * 1024)).toFixed(2);

  console.log('\n--- Memory Leak & Allocation Stress Test (50,000 ops) ---');
  console.log(`Heap Before: ${(heapBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap After: ${(heapAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Net Heap Delta: ${heapDiffMB} MB`);

  return {
    filterAvg, filterP50, filterP95, filterP99, filterMax,
    searchAvg, searchP50, searchP95, searchP99, searchMax,
    pipeAvg, pipeP50, pipeP95, pipeP99, pipeMax,
    heapDiffMB
  };
}

async function main() {
  const mediaResults = await runMediaScan();
  const benchResults = runRuntimeBenchmark();

  console.log('\n====================================================');
  console.log('SUMMARY VERIFICATION STATUS');
  console.log('====================================================');
  const mediaOk = mediaResults.failed === 0 && mediaResults.nonImages === 0 && mediaResults.paramFailures === 0;
  const perfOk = benchResults.filterAvg < 1.0 && benchResults.filterP99 < 1.0;

  console.log(`Media Asset Integrity: ${mediaOk ? 'PASSED' : 'FAILED'}`);
  console.log(`Filter Benchmark (< 1.0 ms): ${perfOk ? 'PASSED' : 'FAILED'}`);

  if (!mediaOk || !perfOk) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
