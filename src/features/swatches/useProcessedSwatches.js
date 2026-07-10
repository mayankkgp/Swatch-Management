/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';

const parseDDMMYY = (str) => {
  if (!str) return 0;
  if (str.includes('-') && str.split('-')[0].length === 4) {
    const parts = str.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      return new Date(year, month - 1, day).getTime();
    }
  }
  const parts = str.split(/[\/\-]/);
  if (parts.length !== 3) return 0;
  let [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
  if (year < 100) year = 2000 + year;
  return new Date(year, month - 1, day).getTime();
};

export default function useProcessedSwatches({
  swatches = [],
  batches = [],
  searchTerm = '',
  structureFilter = 'all',
  selectedVendors = [],
  fromDate = '',
  toDate = '',
  sortField = 'none'
}) {
  const getBatchInfo = useMemo(() => {
    const batchMap = new Map();
    batches.forEach(b => {
      if (b.swatchIds) {
        b.swatchIds.forEach(id => {
          batchMap.set(id, {
            id: b.id,
            name: b.name,
            date: b.date
          });
        });
      }
    });

    return (swatchId) => {
      const parent = batchMap.get(swatchId);
      return {
        id: parent ? parent.id : null,
        name: parent ? parent.name : 'Unassigned',
        date: parent ? parent.date : '-'
      };
    };
  }, [batches]);

  const processedSwatches = useMemo(() => {
    let list = [...swatches];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      list = list.filter(s => 
        (s.vendorName && s.vendorName.toLowerCase().includes(term)) || 
        (s.vendorSku && s.vendorSku.toLowerCase().includes(term))
      );
    }

    if (structureFilter !== 'all') {
      list = list.filter(s => s.structure === structureFilter);
    }

    if (selectedVendors && selectedVendors.length > 0) {
      list = list.filter(s => selectedVendors.includes(s.vendorName));
    }

    if (fromDate || toDate) {
      list = list.filter(s => {
        const batchInfo = getBatchInfo(s.id);
        if (!batchInfo || !batchInfo.date || batchInfo.date === '-') return false;
        const parts = batchInfo.date.split('-');
        if (parts.length !== 3) return false;
        const [day, month, year] = parts.map(Number);
        const t = new Date(2000 + year, month - 1, day).getTime();

        if (fromDate) {
          const fromTime = parseDDMMYY(fromDate);
          if (fromTime && t < fromTime) return false;
        }
        if (toDate) {
          const toTime = parseDDMMYY(toDate) + 86400000 - 1; // End of selected day
          if (toTime && t > toTime) return false;
        }
        return true;
      });
    }

    if (sortField === 'none') {
      list.sort((a, b) => {
        const numA = parseInt((a.id || '').replace('S-', ''), 10) || 0;
        const numB = parseInt((b.id || '').replace('S-', ''), 10) || 0;
        return numA - numB;
      });
    } else if (sortField === 'name') {
      list.sort((a, b) => (a.vendorName || '').localeCompare(b.vendorName || ''));
    } else if (sortField === 'quantity') {
      list.sort((a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0));
    }

    return list;
  }, [swatches, searchTerm, structureFilter, selectedVendors, fromDate, toDate, sortField, getBatchInfo]);

  return { processedSwatches, getBatchInfo };
}
