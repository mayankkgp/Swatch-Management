/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BATCHES_KEY = 'swatch_batches';
export const RECORDS_KEY = 'swatch_records';
export const ACTIVE_DEFAULTS_KEY = 'swatch_active_defaults';

export function getLocal(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocal(key) {
  localStorage.removeItem(key);
}
