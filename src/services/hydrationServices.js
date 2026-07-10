/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_BATCHES, INITIAL_SWATCHES, INITIAL_DEFAULTS } from '../data/seedData.js';
import { BATCHES_KEY, RECORDS_KEY, ACTIVE_DEFAULTS_KEY, getLocal, setLocal, removeLocal } from './storageUtils.js';

/**
 * Validates and seeds localStorage blueprints idempotently.
 */
export function hydrateAndSeedStorage() {
  console.log('[DATA LAYER] Checking localStorage for existing Swatch Logging dataset...');

  let existingBatches = getLocal(BATCHES_KEY);
  let existingSwatches = getLocal(RECORDS_KEY);
  const existingDefaults = getLocal(ACTIVE_DEFAULTS_KEY);

  let seeded = false;

  // Force reset if old mock data is detected
  if (existingBatches) {
    if (existingBatches.length !== 105 || existingBatches.some(b => b.name.includes(' - Run ') || b.id === 'B-101')) {
      console.log('[DATA LAYER] Upgrading local storage to clean 105-batch sequence dataset...');
      removeLocal(BATCHES_KEY);
      removeLocal(RECORDS_KEY);
      existingBatches = null;
      existingSwatches = null;
    }
  }

  // Force reset of swatches if the length does not match the 200 cloned set
  if (existingSwatches) {
    if (existingSwatches.length !== 200) {
      console.log('[DATA LAYER] Upgrading swatch storage to include 200-swatch cloned set...');
      removeLocal(RECORDS_KEY);
      existingSwatches = null;
    }
  }

  if (!existingBatches) {
    console.log('[DATA LAYER] Seeding exact four Phase 3 INITIAL_BATCHES...');
    setLocal(BATCHES_KEY, INITIAL_BATCHES);
    seeded = true;
  }

  if (!existingSwatches) {
    console.log('[DATA LAYER] No existing swatches found. Seeding INITIAL_SWATCHES...');
    setLocal(RECORDS_KEY, INITIAL_SWATCHES);
    seeded = true;
  }

  if (!existingDefaults) {
    console.log('[DATA LAYER] No existing defaults found. Seeding INITIAL_DEFAULTS...');
    setLocal(ACTIVE_DEFAULTS_KEY, INITIAL_DEFAULTS);
    seeded = true;
  }

  if (seeded) {
    console.log('[DATA LAYER] Seeding complete. Committing initial datasets to memory...');
  } else {
    console.log('[DATA LAYER] Datasets found. Initializing load...');
  }

  return seeded;
}
