/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function BulkEditPanelViewSection({
  editingSwatch,
  parentBatch,
  formData
}) {
  return (
    <div className="flex-1 overflow-y-auto py-3 px-1.5 space-y-4 text-xs font-sans text-slate-700">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Fabrito SKU</label>
          <p className="font-sans text-sm font-medium text-slate-900 select-all">
            {editingSwatch?.id || '-'}
          </p>
        </div>

        {parentBatch && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Batch</label>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-sm font-medium text-slate-900 truncate" title={parentBatch.name}>
                {parentBatch.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}?batchId=${parentBatch.id}`;
                  window.open(url, '_blank');
                }}
                className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors cursor-pointer inline-flex items-center"
                title="Open batch in new tab"
              >
                <ExternalLink className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Vendor Name</label>
          <p className="font-sans text-sm font-medium text-slate-900">{formData.vendorName || '-'}</p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Vendor SKU</label>
          <p className="font-sans text-sm font-medium text-slate-900 select-all">{formData.vendorSku || '-'}</p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Quantity</label>
          <p className="font-sans text-sm font-medium text-slate-900">
            {formData.quantity ? `${formData.quantity} ${formData.unit}` : '-'}
          </p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Structure</label>
          <p className="font-sans text-sm font-medium text-slate-900">{formData.structure || '-'}</p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Content</label>
          <p className="font-sans text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">{formData.content || '-'}</p>
        </div>
      </div>
    </div>
  );
}
