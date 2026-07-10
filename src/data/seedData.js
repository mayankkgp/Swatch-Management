/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import INITIAL_BATCHES_RAW from './mock-batch.json';
import INITIAL_SWATCHES_RAW from './mock-swatch.json';

// Duplicate the 10 active batches exactly 10 times to get 100 active batches
// Every duplicated batch receives a batch ID 30 higher than its previous clone
const activeRaw = INITIAL_BATCHES_RAW.filter(b => b.status === 'active');
const draftRaw = INITIAL_BATCHES_RAW.filter(b => b.status === 'draft');

const duplicatedActive = [];
activeRaw.forEach((batch) => {
  const originalNumericId = parseInt(batch.id.replace('B-', ''), 10);
  for (let j = 0; j < 10; j++) {
    const newNumericId = originalNumericId + j * 30;
    duplicatedActive.push({
      ...batch,
      id: `B-${String(newNumericId).padStart(3, '0')}`,
      name: batch.name, // Keep original batch name without suffixes
      swatchIds: [...batch.swatchIds]
    });
  }
});

// Map the 5 drafts keeping their original IDs (B-011 through B-015)
const mappedDrafts = draftRaw.map((batch) => ({
  ...batch,
  id: batch.id,
  swatchIds: [...batch.swatchIds]
}));

const INITIAL_BATCHES = [...duplicatedActive, ...mappedDrafts];

// Clone the 50 SKUs 3 times. Only edit SKU ID, with each new SKU getting SKU ID 100 higher than the previous clone of the swatch.
const duplicatedSwatches = [];
INITIAL_SWATCHES_RAW.forEach((swatch) => {
  // Push original swatch (S-001 to S-050)
  duplicatedSwatches.push(swatch);
  
  const numericId = parseInt(swatch.id.replace('S-', ''), 10);
  // Clone 3 times
  for (let k = 1; k <= 3; k++) {
    const newNumericId = numericId + k * 100;
    duplicatedSwatches.push({
      ...swatch,
      id: `S-${String(newNumericId).padStart(3, '0')}`
    });
  }
});

const INITIAL_SWATCHES = duplicatedSwatches;

export { INITIAL_BATCHES, INITIAL_SWATCHES };

export const INITIAL_DEFAULTS = {
  vendorName: "Tex-Source Mills",
  vendorSku: "",
  quantity: "",
  unit: "yd",
  content: "",
  structure: "Plain Woven",
  aspectRatio: "3:4"
};

export const VENDOR_NAMES = [
  "Tex-Source Mills",
  "Global Fabrics",
  "Sienna Textiles",
  "Verona Fabrics",
  "Tokyo Knit Lab",
  "Aura Organic Weaves"
];

export const STRUCTURES = [
  "Plain Woven",
  "Twill",
  "Knit",
  "Herringbone",
  "Satin",
  "Jacquard"
];
