/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import simulateNetwork from '../utils/simulateNetwork.js';
import { BATCHES_KEY, RECORDS_KEY, ACTIVE_DEFAULTS_KEY, getLocal, setLocal } from './storageUtils.js';

export { hydrateAndSeedStorage } from './hydrationServices.js';

export async function fetchBatches() {
  await simulateNetwork();
  return getLocal(BATCHES_KEY) || [];
}

export async function fetchSwatches() {
  await simulateNetwork();
  return getLocal(RECORDS_KEY) || [];
}

export async function saveBatch(batchData) {
  await simulateNetwork();
  const currentBatches = getLocal(BATCHES_KEY) || [];
  const existsIndex = currentBatches.findIndex((b) => b.id === batchData.id);
  
  let updatedBatches;
  if (existsIndex >= 0) {
    updatedBatches = [...currentBatches];
    updatedBatches[existsIndex] = { ...updatedBatches[existsIndex], ...batchData };
  } else {
    updatedBatches = [batchData, ...currentBatches];
  }
  
  setLocal(BATCHES_KEY, updatedBatches);
  return updatedBatches;
}

export async function saveSwatch(swatchData) {
  await simulateNetwork();
  const currentSwatches = getLocal(RECORDS_KEY) || [];
  const existsIndex = currentSwatches.findIndex((s) => s.id === swatchData.id);
  
  let updatedSwatches;
  if (existsIndex >= 0) {
    updatedSwatches = [...currentSwatches];
    updatedSwatches[existsIndex] = { ...updatedSwatches[existsIndex], ...swatchData };
  } else {
    updatedSwatches = [...currentSwatches, swatchData];
  }
  
  setLocal(RECORDS_KEY, updatedSwatches);
  return updatedSwatches;
}

export async function saveSwatchesBulk(swatchesArray) {
  await simulateNetwork();
  const currentSwatches = getLocal(RECORDS_KEY) || [];
  const swatchesMap = new Map(currentSwatches.map(s => [s.id, s]));
  
  swatchesArray.forEach(swatch => {
    const existing = swatchesMap.get(swatch.id);
    if (existing) {
      swatchesMap.set(swatch.id, { ...existing, ...swatch });
    } else {
      swatchesMap.set(swatch.id, swatch);
    }
  });
  
  const updatedSwatches = Array.from(swatchesMap.values());
  setLocal(RECORDS_KEY, updatedSwatches);
  return updatedSwatches;
}

export async function deleteSwatch(swatchId) {
  await simulateNetwork();
  
  const currentSwatches = getLocal(RECORDS_KEY) || [];
  const updatedSwatches = currentSwatches.filter((s) => s.id !== swatchId);
  setLocal(RECORDS_KEY, updatedSwatches);
  
  const currentBatches = getLocal(BATCHES_KEY) || [];
  const updatedBatches = currentBatches.map((batch) => {
    if (batch.swatchIds && batch.swatchIds.includes(swatchId)) {
      return { ...batch, swatchIds: batch.swatchIds.filter((id) => id !== swatchId) };
    }
    return batch;
  });
  setLocal(BATCHES_KEY, updatedBatches);
  
  return { swatches: updatedSwatches, batches: updatedBatches };
}

export async function deleteSwatchesBulk(swatchIds) {
  await simulateNetwork();
  
  const currentSwatches = getLocal(RECORDS_KEY) || [];
  const updatedSwatches = currentSwatches.filter((s) => !swatchIds.includes(s.id));
  setLocal(RECORDS_KEY, updatedSwatches);
  
  const currentBatches = getLocal(BATCHES_KEY) || [];
  const updatedBatches = currentBatches.map((batch) => {
    if (batch.swatchIds) {
      return { ...batch, swatchIds: batch.swatchIds.filter((id) => !swatchIds.includes(id)) };
    }
    return batch;
  });
  setLocal(BATCHES_KEY, updatedBatches);
  
  return { swatches: updatedSwatches, batches: updatedBatches };
}

export async function deleteBatch(batchId) {
  await simulateNetwork();
  const currentBatches = getLocal(BATCHES_KEY) || [];
  const updatedBatches = currentBatches.filter((b) => b.id !== batchId);
  setLocal(BATCHES_KEY, updatedBatches);
  return updatedBatches;
}

export async function fetchActiveDefaults() {
  await simulateNetwork();
  return getLocal(ACTIVE_DEFAULTS_KEY) || null;
}

export async function updateActiveDefaults(newDefaults) {
  await simulateNetwork();
  setLocal(ACTIVE_DEFAULTS_KEY, newDefaults);
  return newDefaults;
}

export function resolveBatchSwatches(batch, swatchesList) {
  if (!batch || !batch.swatchIds || !swatchesList) return [];
  const swatchesMap = new Map(swatchesList.map(s => [s.id, s]));
  return batch.swatchIds
    .map(id => swatchesMap.get(id))
    .filter(Boolean);
}

