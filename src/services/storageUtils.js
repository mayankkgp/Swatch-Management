/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BATCHES_KEY = 'swatch_batches';
export const RECORDS_KEY = 'swatch_records';
export const ACTIVE_DEFAULTS_KEY = 'swatch_active_defaults';
export const CUSTOMER_ENQUIRY_STACK_KEY = 'customer_enquiry_stack';
export const CUSTOMER_ENQUIRY_SUBMITTED_KEY = 'customer_enquiry_submitted';
export const CUSTOMER_SESSION_KEY = 'customer_session';

export function getLocal(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[STORAGE] Failed to parse key "${key}" from localStorage:`, err);
    return null;
  }
}

export function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocal(key) {
  localStorage.removeItem(key);
}
