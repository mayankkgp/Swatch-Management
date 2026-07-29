/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import simulateNetwork from '../utils/simulateNetwork.js';
import { getLocal, setLocal } from './storageUtils.js';
import MOCK_ENQUIRIES from '../data/mock-enquiries.json';

const ENQUIRIES_STORAGE_KEY = 'fabrito_enquiries_list';

export async function fetchEnquiries() {
  await simulateNetwork();
  const stored = getLocal(ENQUIRIES_STORAGE_KEY);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    const merged = stored.map((item) => {
      const mockMatch = MOCK_ENQUIRIES.find((m) => m.id === item.id);
      if (mockMatch) {
        return {
          ...mockMatch,
          ...item,
          swatchIds: item.swatchIds || mockMatch.swatchIds,
          rejectedSwatchIds: item.rejectedSwatchIds || mockMatch.rejectedSwatchIds
        };
      }
      return item;
    });
    return merged;
  }
  // Initialize with mock data
  setLocal(ENQUIRIES_STORAGE_KEY, MOCK_ENQUIRIES);
  return MOCK_ENQUIRIES;
}

export async function saveEnquiries(enquiries) {
  await simulateNetwork();
  setLocal(ENQUIRIES_STORAGE_KEY, enquiries);
  return enquiries;
}
