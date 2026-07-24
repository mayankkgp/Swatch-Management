/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Simulates network latency by returning a Promise that resolves
 * after a random delay between 400ms and 800ms.
 * @returns {Promise<void>}
 */
export default function simulateNetwork(customDelay) {
  if (typeof customDelay === 'number') {
    return new Promise((resolve) => setTimeout(resolve, customDelay));
  }
  const min = 400;
  const max = 800;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
