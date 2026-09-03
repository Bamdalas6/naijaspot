/**
 * NaijaSpots 4-Tier E2E Test Suite: Dataset Verification
 * Tiers 1-3: Feature Coverage, Boundary & Corner Cases, Cross-Feature Combinations
 *
 * Requirements Source: ORIGINAL_REQUEST.md & PROJECT.md
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

// Authoritative list of 37 Nigerian administrative divisions (36 states + Abuja FCT)
export const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Oyo', 'Rivers', 'Enugu', 'Cross River', 'Ogun',
  'Kano', 'Kaduna', 'Edo', 'Delta', 'Plateau', 'Akwa Ibom', 'Anambra',
  'Imo', 'Abia', 'Osun', 'Ondo', 'Kwara', 'Benue', 'Niger', 'Nasarawa',
  'Kogi', 'Bayelsa', 'Taraba', 'Adamawa', 'Bauchi', 'Borno', 'Gombe',
  'Yobe', 'Jigawa', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara', 'Ebonyi', 'Ekiti'
];

// Authoritative 5 discovery categories
export const CATEGORIES = [
  'Eatery & Dining',
  'Bars & Lounges',
  'Historical & Memory',
  'Nature & Parks',
  'Arts & Culture'
];

// 10 Designated Lagos Urban & Coastal Zones (ORIGINAL_REQUEST.md R1)
export const LAGOS_ZONES = [
  'Lekki Phase 1',
  'Victoria Island',
  'Ikoyi',
  'Ikeja GRA',
  'Marina',
  'Yaba',
  'Surulere',
  'Badagry',
  'Epe',
  'Ikorodu'
];

// Valid price rating tiers
export const VALID_PRICE_RATINGS = new Set(['Free', '₦', '₦₦', '₦₦₦', '₦₦₦₦']);

// Allowed Spot interface fields (types/index.ts)
export const ALLOWED_SPOT_FIELDS = new Set([
  'id',
  'name',
  'category',
  'priceRating',
  'priceRange',
  'city',
  'state',
  'address',
  'description',
  'imageUrl',
  'rating',
  'reviewsCount',
  'openingHours',
  'distance',
  'amenities',
  'featured',
  'tags',
  'created_at'
]);

export const REQUIRED_SPOT_FIELDS = [
  'id',
  'name',
  'category',
  'priceRating',
  'city',
  'state',
  'address',
  'description',
  'imageUrl'
];

/**
 * Helper to load and parse spots.json with raw file metrics
 */
function loadSpotsData() {
  assert.ok(fs.existsSync(SPOTS_FILE_PATH), `data/spots.json must exist at ${SPOTS_FILE_PATH}`);
  const rawContent = fs.readFileSync(SPOTS_FILE_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(rawContent);
  } catch (err) {
    assert.fail(`data/spots.json is not valid JSON: ${err.message}`);
  }
  assert.ok(Array.isArray(data), 'data/spots.json root entity must be an Array');
  return { rawContent, spots: data };
}

describe('Tier 1: Feature Coverage & Dataset Completeness', () => {
  const { spots } = loadSpotsData();

  it('T1.1: Total spot count must be at least 2,100', () => {
    assert.ok(
      spots.length >= 2100,
      `Expected total spots >= 2,100, but found ${spots.length}`
    );
  });

  it('T1.2: Lagos State spot count must exceed 700 (Hyper-Dense Coverage)', () => {
    const lagosSpots = spots.filter(s => s.state === 'Lagos');
    assert.ok(
      lagosSpots.length > 700,
      `Expected Lagos spots > 700, but found ${lagosSpots.length}`
    );
  });

  it('T1.3: Nationwide catalog covers all 36 remaining states + Abuja FCT with >= 35 spots each', () => {
    const otherStates = NIGERIAN_STATES.filter(state => state !== 'Lagos');
    const stateCounts = new Map();

    for (const state of otherStates) {
      stateCounts.set(state, 0);
    }

    for (const spot of spots) {
      if (spot.state !== 'Lagos' && stateCounts.has(spot.state)) {
        stateCounts.set(spot.state, stateCounts.get(spot.state) + 1);
      }
    }

    const deficientStates = [];
    for (const [state, count] of stateCounts.entries()) {
      if (count < 35) {
        deficientStates.push(`${state}: ${count} (expected >= 35)`);
      }
    }

    assert.equal(
      deficientStates.length,
      0,
      `Deficient states found (< 35 spots):\n${deficientStates.join('\n')}`
    );
  });

  it('T1.4: All 5 discovery categories are represented in every single state/FCT', () => {
    const missingMatrix = [];

    for (const state of NIGERIAN_STATES) {
      const stateSpots = spots.filter(s => s.state === state);
      for (const cat of CATEGORIES) {
        const hasCategory = stateSpots.some(s => s.category === cat);
        if (!hasCategory) {
          missingMatrix.push(`State: "${state}" lacks category: "${cat}"`);
        }
      }
    }

    assert.equal(
      missingMatrix.length,
      0,
      `Missing category representations across states:\n${missingMatrix.join('\n')}`
    );
  });

  it('T1.5: Strict TypeScript Spot interface conformance for all spots', () => {
    const violations = [];

    spots.forEach((spot, idx) => {
      // Check required fields
      for (const field of REQUIRED_SPOT_FIELDS) {
        if (spot[field] === undefined || spot[field] === null || spot[field] === '') {
          violations.push(`Spot #${idx + 1} (${spot.id || 'no-id'}) missing required field "${field}"`);
        }
      }

      // Check field types
      if (typeof spot.id !== 'string') violations.push(`Spot #${idx + 1}: id must be string`);
      if (typeof spot.name !== 'string') violations.push(`Spot #${idx + 1}: name must be string`);
      if (typeof spot.category !== 'string') violations.push(`Spot #${idx + 1}: category must be string`);
      if (typeof spot.priceRating !== 'string') violations.push(`Spot #${idx + 1}: priceRating must be string`);
      if (typeof spot.city !== 'string') violations.push(`Spot #${idx + 1}: city must be string`);
      if (typeof spot.state !== 'string') violations.push(`Spot #${idx + 1}: state must be string`);
      if (typeof spot.address !== 'string') violations.push(`Spot #${idx + 1}: address must be string`);
      if (typeof spot.description !== 'string') violations.push(`Spot #${idx + 1}: description must be string`);
      if (typeof spot.imageUrl !== 'string') violations.push(`Spot #${idx + 1}: imageUrl must be string`);

      // Optional types
      if (spot.priceRange !== undefined && typeof spot.priceRange !== 'string') {
        violations.push(`Spot #${idx + 1}: priceRange must be string`);
      }
      if (spot.rating !== undefined && typeof spot.rating !== 'number') {
        violations.push(`Spot #${idx + 1}: rating must be number`);
      }
      if (spot.reviewsCount !== undefined && typeof spot.reviewsCount !== 'number') {
        violations.push(`Spot #${idx + 1}: reviewsCount must be number`);
      }
      if (spot.openingHours !== undefined && typeof spot.openingHours !== 'string') {
        violations.push(`Spot #${idx + 1}: openingHours must be string`);
      }
      if (spot.distance !== undefined && typeof spot.distance !== 'string') {
        violations.push(`Spot #${idx + 1}: distance must be string`);
      }
      if (spot.featured !== undefined && typeof spot.featured !== 'boolean') {
        violations.push(`Spot #${idx + 1}: featured must be boolean`);
      }
      if (spot.amenities !== undefined && (!Array.isArray(spot.amenities) || !spot.amenities.every(a => typeof a === 'string'))) {
        violations.push(`Spot #${idx + 1}: amenities must be array of strings`);
      }
      if (spot.tags !== undefined && (!Array.isArray(spot.tags) || !spot.tags.every(t => typeof t === 'string'))) {
        violations.push(`Spot #${idx + 1}: tags must be array of strings`);
      }

      // Check for illegal/rogue properties not in Spot interface
      for (const key of Object.keys(spot)) {
        if (!ALLOWED_SPOT_FIELDS.has(key)) {
          violations.push(`Spot #${idx + 1} has unauthorized key "${key}"`);
        }
      }
    });

    assert.equal(
      violations.length,
      0,
      `Schema conformance violations found (${violations.length}):\n${violations.slice(0, 15).join('\n')}`
    );
  });
});

describe('Tier 2: Boundary & Corner Cases', () => {
  const { spots } = loadSpotsData();

  it('T2.1: Price ratings strictly contain valid tiers (Free, ₦, ₦₦, ₦₦₦, ₦₦₦₦)', () => {
    const invalidPriceRatings = [];

    for (const spot of spots) {
      if (!VALID_PRICE_RATINGS.has(spot.priceRating)) {
        invalidPriceRatings.push(`Spot ${spot.id} has invalid priceRating: "${spot.priceRating}"`);
      }
    }

    assert.equal(
      invalidPriceRatings.length,
      0,
      `Invalid price ratings detected (${invalidPriceRatings.length}):\n${invalidPriceRatings.slice(0, 10).join('\n')}`
    );
  });

  it('T2.2: Distance strictly complies with "${city} • ${km} km away" format', () => {
    const distanceRegex = /^.+ • \d+(\.\d+)? km away$/;
    const invalidDistances = [];

    for (const spot of spots) {
      if (spot.distance) {
        if (!distanceRegex.test(spot.distance)) {
          invalidDistances.push(`Spot ${spot.id} invalid distance format: "${spot.distance}"`);
        } else {
          // Check that km number is a positive realistic float
          const match = spot.distance.match(/• (\d+(\.\d+)?) km away/);
          if (match) {
            const km = parseFloat(match[1]);
            if (Number.isNaN(km) || km < 0 || km > 100) {
              invalidDistances.push(`Spot ${spot.id} unrealistic distance value: ${km} km`);
            }
          }
        }
      }
    }

    assert.equal(
      invalidDistances.length,
      0,
      `Distance format errors (${invalidDistances.length}):\n${invalidDistances.slice(0, 10).join('\n')}`
    );
  });

  it('T2.3: Ratings bounded strictly between 1.0 and 5.0 with realistic precision', () => {
    const invalidRatings = [];

    for (const spot of spots) {
      if (spot.rating !== undefined) {
        if (typeof spot.rating !== 'number' || Number.isNaN(spot.rating)) {
          invalidRatings.push(`Spot ${spot.id} non-numeric rating: ${spot.rating}`);
        } else if (spot.rating < 1.0 || spot.rating > 5.0) {
          invalidRatings.push(`Spot ${spot.id} rating out of bounds [1.0, 5.0]: ${spot.rating}`);
        }
      }
    }

    assert.equal(
      invalidRatings.length,
      0,
      `Rating boundary violations (${invalidRatings.length}):\n${invalidRatings.slice(0, 10).join('\n')}`
    );
  });

  it('T2.4: Review counts are non-negative integers', () => {
    const invalidReviews = [];

    for (const spot of spots) {
      if (spot.reviewsCount !== undefined) {
        if (!Number.isInteger(spot.reviewsCount) || spot.reviewsCount < 0) {
          invalidReviews.push(`Spot ${spot.id} invalid reviewsCount: ${spot.reviewsCount}`);
        }
      }
    }

    assert.equal(
      invalidReviews.length,
      0,
      `ReviewsCount violations (${invalidReviews.length}):\n${invalidReviews.slice(0, 10).join('\n')}`
    );
  });

  it('T2.5: Spot IDs are 100% unique across entire dataset', () => {
    const idSet = new Set();
    const duplicateIds = [];

    for (const spot of spots) {
      if (idSet.has(spot.id)) {
        duplicateIds.push(spot.id);
      } else {
        idSet.add(spot.id);
      }
    }

    assert.equal(
      duplicateIds.length,
      0,
      `Duplicate spot IDs found (${duplicateIds.length}):\n${duplicateIds.slice(0, 10).join('\n')}`
    );
    assert.equal(idSet.size, spots.length, 'ID set size must match spot array length');
  });

  it('T2.6: Address and description non-empty, realistic, and free of placeholder tokens', () => {
    const placeholderPattern = /\[object Object\]|undefined|null|TODO|lorem ipsum|placeholder/i;
    const invalidRecords = [];

    for (const spot of spots) {
      if (!spot.address || spot.address.trim().length < 5) {
        invalidRecords.push(`Spot ${spot.id} has abnormally short or empty address: "${spot.address}"`);
      } else if (placeholderPattern.test(spot.address)) {
        invalidRecords.push(`Spot ${spot.id} contains placeholder in address: "${spot.address}"`);
      }

      if (!spot.description || spot.description.trim().length < 20) {
        invalidRecords.push(`Spot ${spot.id} has abnormally short or empty description: "${spot.description}"`);
      } else if (placeholderPattern.test(spot.description)) {
        invalidRecords.push(`Spot ${spot.id} contains placeholder in description: "${spot.description}"`);
      }

      if (!spot.name || spot.name.trim().length < 3) {
        invalidRecords.push(`Spot ${spot.id} has abnormally short name: "${spot.name}"`);
      } else if (placeholderPattern.test(spot.name)) {
        invalidRecords.push(`Spot ${spot.id} contains placeholder in name: "${spot.name}"`);
      }
    }

    assert.equal(
      invalidRecords.length,
      0,
      `Data fidelity violations found (${invalidRecords.length}):\n${invalidRecords.slice(0, 10).join('\n')}`
    );
  });

  it('T2.7: Amenities and tags collections contain valid non-empty strings', () => {
    const invalidCollections = [];

    for (const spot of spots) {
      if (spot.amenities) {
        if (spot.amenities.length === 0) {
          invalidCollections.push(`Spot ${spot.id} has empty amenities array`);
        }
        for (const amenity of spot.amenities) {
          if (typeof amenity !== 'string' || amenity.trim().length === 0) {
            invalidCollections.push(`Spot ${spot.id} has invalid amenity item: "${amenity}"`);
          }
        }
      }

      if (spot.tags) {
        if (spot.tags.length === 0) {
          invalidCollections.push(`Spot ${spot.id} has empty tags array`);
        }
        for (const tag of spot.tags) {
          if (typeof tag !== 'string' || tag.trim().length === 0) {
            invalidCollections.push(`Spot ${spot.id} has invalid tag item: "${tag}"`);
          }
        }
      }
    }

    assert.equal(
      invalidCollections.length,
      0,
      `Amenities/tags violations (${invalidCollections.length}):\n${invalidCollections.slice(0, 10).join('\n')}`
    );
  });

  it('T2.8: UTF-8 encoding integrity (preserves Naira symbol ₦ without replacement characters)', () => {
    const { rawContent } = loadSpotsData();
    assert.ok(
      !rawContent.includes('\uFFFD'),
      'data/spots.json must not contain Unicode replacement character \uFFFD (indicating broken UTF-8 encoding)'
    );
    assert.ok(
      !rawContent.includes('â‚¦'),
      'data/spots.json must not contain mojibake encoding artifacts of Naira symbol'
    );
    assert.ok(
      rawContent.includes('₦'),
      'data/spots.json must contain genuine Nigerian Naira currency symbol ₦'
    );
  });
});

describe('Tier 3: Cross-Feature Combinations', () => {
  const { spots } = loadSpotsData();

  it('T3.1: Every (state, category) matrix cell has valid spots (37 x 5 = 185 cells populated)', () => {
    const emptyCells = [];
    let populatedCells = 0;

    for (const state of NIGERIAN_STATES) {
      for (const cat of CATEGORIES) {
        const matches = spots.filter(s => s.state === state && s.category === cat);
        if (matches.length === 0) {
          emptyCells.push(`[State: "${state}", Category: "${cat}"] -> 0 spots`);
        } else {
          populatedCells++;
        }
      }
    }

    assert.equal(
      emptyCells.length,
      0,
      `Unpopulated state/category cells (${emptyCells.length} / 185):\n${emptyCells.join('\n')}`
    );
    assert.equal(populatedCells, 185, 'All 185 (state, category) combinations must be populated');
  });

  it('T3.2: Lagos State has representation across all 10 designated zones', () => {
    const lagosSpots = spots.filter(s => s.state === 'Lagos');
    const missingZones = [];
    const zoneCoverage = {};

    for (const zone of LAGOS_ZONES) {
      const zoneRegex = new RegExp(zone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const matchingSpots = lagosSpots.filter(spot =>
        zoneRegex.test(spot.city || '') ||
        zoneRegex.test(spot.address || '') ||
        (Array.isArray(spot.tags) && spot.tags.some(t => zoneRegex.test(t)))
      );

      zoneCoverage[zone] = matchingSpots.length;
      if (matchingSpots.length === 0) {
        missingZones.push(zone);
      }
    }

    assert.equal(
      missingZones.length,
      0,
      `Lagos spots missing designated zones (${missingZones.length}):\n${missingZones.join('\n')}\nCoverage map: ${JSON.stringify(zoneCoverage, null, 2)}`
    );
  });

  it('T3.3: Featured spots are distributed across multiple states and categories', () => {
    const featuredSpots = spots.filter(s => s.featured === true);
    assert.ok(featuredSpots.length > 0, 'Featured spots must exist in dataset');

    const featuredStates = new Set(featuredSpots.map(s => s.state));
    const featuredCategories = new Set(featuredSpots.map(s => s.category));

    assert.ok(
      featuredStates.size >= 10,
      `Featured spots should be distributed across multiple states (found ${featuredStates.size} states)`
    );
    assert.equal(
      featuredCategories.size,
      CATEGORIES.length,
      `Featured spots should span all ${CATEGORIES.length} categories (found ${featuredCategories.size})`
    );
  });

  it('T3.4: Price rating distribution covers all tiers from Free to luxury', () => {
    const priceTiersFound = new Set(spots.map(s => s.priceRating));
    for (const tier of VALID_PRICE_RATINGS) {
      assert.ok(
        priceTiersFound.has(tier),
        `Price rating tier "${tier}" must be present in dataset`
      );
    }
  });
});
