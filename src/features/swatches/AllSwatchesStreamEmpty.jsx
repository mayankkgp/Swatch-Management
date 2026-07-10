/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AllSwatchesStreamEmpty({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4 shadow-inner">
        <Database className="size-10" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">No Swatches Located</h3>
      <p className="text-xs text-slate-500 max-w-xs mt-1">
        No matching swatches were found matching your search term or active filters.
      </p>
      <Button
        id="clear-stream-filter-rules-btn"
        onClick={onClear}
        className="mt-4 px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-50"
      >
        Clear Stream Filter Rules
      </Button>
    </div>
  );
}
