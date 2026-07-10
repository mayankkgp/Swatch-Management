/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VENDOR_NAMES, STRUCTURES } from '../../data/seedData';

/**
 * Calculates the aspect ratio for CSS aspectRatio property
 * @param {string} ratioStr - e.g. "3:4", "4:3", etc.
 * @param {boolean} isEditing - flag if card is currently editing
 * @returns {string} CSS ratio string like "3 / 4"
 */
export function getSwatchAspectRatio(ratioStr, isEditing) {
  const fallback = ratioStr || '3:4';
  const parts = fallback.split(':');
  const w = parseFloat(parts[0]) || 3;
  const h = parseFloat(parts[1]) || 4;
  if (isEditing) {
    return `${w} / ${h}`;
  }
  return `${w} / ${h * 0.75}`;
}

/**
 * Renders the fallback gradient background color or the image itself
 * @param {object} swatch - the swatch data
 * @returns {string|undefined} background color or gradient string
 */
export function getSwatchFallbackBackground(swatch) {
  if (!swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#')) {
    return swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
  }
  return undefined;
}

/**
 * Checks if the image source is a standard image (not gradient/hex fallback)
 * @param {string} imgSource - image path or gradient string
 * @returns {boolean}
 */
export function isRealImageSource(imgSource) {
  if (!imgSource) return false;
  return !(imgSource.startsWith('linear-gradient') || imgSource.startsWith('radial-gradient') || imgSource.startsWith('#'));
}

/**
 * Filters the list of vendor names by a query
 */
export function getFilteredVendorNames(query = '') {
  return VENDOR_NAMES.filter(v => 
    v.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Filters the list of weave structures by a query
 */
export function getFilteredStructures(query = '') {
  return STRUCTURES.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  );
}
