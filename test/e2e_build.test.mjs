/**
 * NaijaSpots 4-Tier E2E Test Suite: Next.js Production Build Verification
 * Tier 4: Real-World Scenarios & Reliability
 *
 * Requirements Source: ORIGINAL_REQUEST.md Acceptance Criteria & PROJECT.md
 * Framework: Node.js Native Test Runner (node --test)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const NEXT_BIN_PATH = path.join(PROJECT_ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
const NEXT_OUT_DIR = path.join(PROJECT_ROOT, '.next');

// 90 second timeout for production Next.js build and type checking
const BUILD_TIMEOUT_MS = 90000;

describe('Tier 4: Next.js Production Build & Compilation Verification', () => {
  let buildExitCode = null;
  let buildStdout = '';
  let buildStderr = '';
  let buildDurationSeconds = 0;

  it('T4.4: Next.js production build compiles successfully with exit code 0 and zero TypeScript errors', async (t) => {
    // Ensure Next.js bin exists
    assert.ok(
      fs.existsSync(NEXT_BIN_PATH),
      `Next.js CLI binary must exist at ${NEXT_BIN_PATH}`
    );

    const startTime = Date.now();

    const buildPromise = new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [NEXT_BIN_PATH, 'build'], {
        cwd: PROJECT_ROOT,
        env: {
          ...process.env,
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1'
        },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      child.stdout.on('data', chunk => {
        buildStdout += chunk.toString();
      });

      child.stderr.on('data', chunk => {
        buildStderr += chunk.toString();
      });

      const timer = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`Next.js build timed out after ${BUILD_TIMEOUT_MS / 1000}s`));
      }, BUILD_TIMEOUT_MS);

      child.on('close', code => {
        clearTimeout(timer);
        buildExitCode = code;
        buildDurationSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        resolve({ code, stdout: buildStdout, stderr: buildStderr });
      });

      child.on('error', err => {
        clearTimeout(timer);
        reject(err);
      });
    });

    const result = await buildPromise;

    console.log(`\n  [Next.js Build] Completed in ${buildDurationSeconds}s with exit code ${result.code}`);

    // Validate 0 TypeScript errors
    const typeErrorMatches = buildStdout.match(/Type error:/g) || [];
    const tsDiagnosticMatches = buildStderr.match(/error TS\d+:/g) || [];
    const totalTsErrors = typeErrorMatches.length + tsDiagnosticMatches.length;

    assert.equal(
      totalTsErrors,
      0,
      `Detected ${totalTsErrors} TypeScript compilation error(s) during production build:\nStdout Type Errors: ${typeErrorMatches.length}\nStderr TS Errors: ${tsDiagnosticMatches.length}\nStderr output:\n${result.stderr}`
    );

    // Validate exit code 0
    assert.equal(
      result.code,
      0,
      `Next.js build failed with non-zero exit code: ${result.code}.\nStderr:\n${result.stderr}\nStdout tail:\n${result.stdout.slice(-1000)}`
    );
  });

  it('T4.5: Production build output (.next) contains essential deployment artifacts', () => {
    assert.ok(
      fs.existsSync(NEXT_OUT_DIR),
      `Expected .next output directory to exist at ${NEXT_OUT_DIR}`
    );

    const buildIdPath = path.join(NEXT_OUT_DIR, 'BUILD_ID');
    assert.ok(
      fs.existsSync(buildIdPath),
      `Expected .next/BUILD_ID to exist at ${buildIdPath}`
    );

    const buildId = fs.readFileSync(buildIdPath, 'utf-8').trim();
    assert.ok(buildId.length > 0, '.next/BUILD_ID must be a non-empty string');

    const routesManifestPath = path.join(NEXT_OUT_DIR, 'routes-manifest.json');
    assert.ok(
      fs.existsSync(routesManifestPath),
      `Expected .next/routes-manifest.json to exist at ${routesManifestPath}`
    );

    const staticDir = path.join(NEXT_OUT_DIR, 'static');
    assert.ok(
      fs.existsSync(staticDir) && fs.statSync(staticDir).isDirectory(),
      `Expected .next/static directory to exist at ${staticDir}`
    );
  });
});
