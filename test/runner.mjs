#!/usr/bin/env node
/**
 * NaijaSpots 4-Tier E2E Master Test Runner
 *
 * Orchestrates and executes all 4 tiers of E2E verification:
 *   - Tier 1: Feature Coverage & Dataset Completeness
 *   - Tier 2: Boundary & Corner Cases
 *   - Tier 3: Cross-Feature Combinations
 *   - Tier 4: Real-World Scenarios (Media Quality CDN Scan & Next.js Build)
 *
 * Usage:
 *   node test/runner.mjs            # Run all 4 tiers
 *   node test/runner.mjs --dataset  # Run Tiers 1-3 only
 *   node test/runner.mjs --media    # Run Tier 4 Media Scan only
 *   node test/runner.mjs --build    # Run Tier 4 Build Verification only
 *   node test/runner.mjs --fast     # Run Tiers 1-3 and Media Scan (skip build)
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SUITES = [
  {
    id: 'dataset',
    name: 'Tiers 1-3: Dataset Completeness, Boundaries, & Combinations',
    file: 'test/e2e_dataset.test.mjs',
    flag: '--dataset'
  },
  {
    id: 'media',
    name: 'Tier 4: Media Quality Scan & Data Payload Verification',
    file: 'test/e2e_media.test.mjs',
    flag: '--media'
  },
  {
    id: 'build',
    name: 'Tier 4: Next.js Production Build & TypeScript Verification',
    file: 'test/e2e_build.test.mjs',
    flag: '--build'
  }
];

function printBanner() {
  console.log('================================================================');
  console.log('         NaijaSpots 4-Tier Opaque-Box E2E Test Suite            ');
  console.log('================================================================');
  console.log(`Working Directory: ${PROJECT_ROOT}`);
  console.log(`Node.js Version:   ${process.version}`);
  console.log(`Execution Time:    ${new Date().toISOString()}`);
  console.log('----------------------------------------------------------------\n');
}

function runSuite(suite) {
  return new Promise((resolve) => {
    console.log(`▶ Starting Suite: ${suite.name}`);
    console.log(`  Executing: node --test ${suite.file}\n`);

    const startTime = Date.now();
    const child = spawn(process.execPath, ['--test', suite.file], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: {
        ...process.env,
        FORCE_COLOR: '1'
      }
    });

    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n✔ Completed Suite: ${suite.name} (Exit Code: ${code}, Duration: ${duration}s)\n`);
      resolve({
        suite,
        code,
        passed: code === 0,
        duration
      });
    });

    child.on('error', (err) => {
      console.error(`✖ Execution Error in ${suite.name}:`, err);
      resolve({
        suite,
        code: 1,
        passed: false,
        duration: '0.00',
        error: err.message
      });
    });
  });
}

async function main() {
  printBanner();

  const args = process.argv.slice(2);
  let selectedSuites = [];

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Options:');
    console.log('  --all          Run all test suites (default)');
    console.log('  --dataset      Run Tiers 1-3 dataset test suite only');
    console.log('  --media        Run Tier 4 media quality scan only');
    console.log('  --build        Run Tier 4 Next.js production build only');
    console.log('  --fast         Run dataset and media tests (skip build)');
    process.exit(0);
  }

  if (args.includes('--fast')) {
    selectedSuites = SUITES.filter(s => s.id === 'dataset' || s.id === 'media');
  } else if (args.some(arg => ['--dataset', '--media', '--build'].includes(arg))) {
    selectedSuites = SUITES.filter(s => args.includes(s.flag));
  } else {
    // Default: run all
    selectedSuites = SUITES;
  }

  console.log(`Selected Suites to Execute (${selectedSuites.length}):`);
  selectedSuites.forEach((s, idx) => console.log(`  ${idx + 1}. ${s.name}`));
  console.log('');

  const suiteResults = [];

  for (const suite of selectedSuites) {
    const res = await runSuite(suite);
    suiteResults.push(res);
  }

  // Summary Table
  console.log('\n================================================================');
  console.log('                       TEST SUITE SUMMARY                       ');
  console.log('================================================================');
  let allPassed = true;

  for (const res of suiteResults) {
    const status = res.passed ? 'PASS' : 'FAIL';
    if (!res.passed) allPassed = false;
    const padding = ' '.repeat(Math.max(1, 60 - res.suite.name.length));
    console.log(`[${status}] ${res.suite.name}${padding}(${res.duration}s)`);
  }

  console.log('----------------------------------------------------------------');
  if (allPassed) {
    console.log('OVERALL RESULT: ALL TEST SUITES PASSED (100% OK)');
  } else {
    console.log('OVERALL RESULT: FAILURES DETECTED (See suite logs above)');
  }
  console.log('================================================================\n');

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal Runner Exception:', err);
  process.exit(1);
});
