/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Edit } from 'lucide-react';

export default function SwatchCardDisplaySection({
  swatch,
  isAllSwatchesView,
  batchName,
  batchDate,
  isBulkEditMode,
  changeEditingState,
  onEdit,
  onSave
}) {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Mobile-only layout */}
      <div className="flex md:hidden flex-col justify-between h-full w-full min-w-0 text-left">
        {/* Top part: details (top aligned, 12px font size, allowed to wrap) */}
        <div className="space-y-1.5 text-slate-700 font-mono text-[12px] leading-snug min-w-0 w-full">
          {/* Row 1: Vendor Name */}
          <div className="text-slate-900 font-bold break-words w-full">
            {swatch.vendorName}
          </div>

          {/* Row 2: Qty and Vendor SKU */}
          <div className="text-slate-600 break-words w-full flex flex-wrap items-center gap-x-1">
            <span className="font-semibold text-slate-800">
              {swatch.quantity ? `${swatch.quantity}${swatch.unit}` : '-'}
            </span>
            <span className="text-slate-300 font-sans font-normal shrink-0 mx-1">•</span>
            <span>{swatch.vendorSku || '-'}</span>
          </div>

          {/* Row 3: Structure */}
          <div className="text-slate-500 break-words w-full">
            {swatch.structure || '-'}
          </div>

          {/* Row 4: Material Content */}
          <div className="text-slate-500 break-words w-full">
            {swatch.content || '-'}
          </div>

          {isAllSwatchesView && batchName && (
            <div className="pt-1 mt-1 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 leading-none">
              <span className="truncate max-w-[100px]" title={batchName}>
                {batchName}
              </span>
            </div>
          )}
        </div>

        {/* Mobile bottom-aligned edit CTA */}
        {!isBulkEditMode && (
          <div className="mt-auto pt-2 flex items-center w-full">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  changeEditingState(true);
                } else if (!isAllSwatchesView) {
                  changeEditingState(true);
                } else if (onEdit) {
                  onEdit(swatch);
                } else if (onSave) {
                  onSave(swatch.id, null, true);
                } else {
                  changeEditingState(true);
                }
              }}
              className="w-full h-8 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 active:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 hover:border-indigo-200 rounded-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop-only layout */}
      <div className="hidden md:flex flex-col justify-between h-full gap-1.5">
        <div className="space-y-1 text-slate-700 font-mono text-[11px] min-w-0">
          {/* Row 1: Vendor Name and Quantity */}
          <div className="flex items-center flex-nowrap gap-x-1.5 text-slate-900 font-medium leading-tight w-full min-w-0">
            <span className="truncate min-w-0" title={swatch.vendorName}>
              {swatch.vendorName}
            </span>
            <span className="text-slate-300 font-sans font-normal shrink-0">•</span>
            <span className="shrink-0" title={swatch.quantity ? `${swatch.quantity}${swatch.unit}` : '-'}>
              {swatch.quantity ? `${swatch.quantity}${swatch.unit}` : '-'}
            </span>
          </div>

          {/* Row 2: Vendor SKU and Structure */}
          <div className="flex items-center flex-nowrap gap-x-1.5 text-slate-500 leading-tight w-full min-w-0">
            <span className="truncate min-w-0" title={swatch.vendorSku || '-'}>
              {swatch.vendorSku || '-'}
            </span>
            <span className="text-slate-300 font-sans font-normal shrink-0">•</span>
            <span className="truncate min-w-0" title={swatch.structure || '-'}>
              {swatch.structure || '-'}
            </span>
          </div>

          {/* Row 3: Material Content */}
          <div className="flex items-center flex-nowrap text-slate-500 leading-tight w-full min-w-0">
            <span className="truncate block w-full" title={swatch.content || '-'}>
              {swatch.content || '-'}
            </span>
          </div>

          {isAllSwatchesView && batchName && (
            <div className="pt-1 mt-1 border-t border-dashed border-slate-200 flex items-center justify-between text-[9px] text-slate-400 leading-none">
              <span className="truncate max-w-[100px]" title={batchName}>
                {batchName}
              </span>
              <span>{batchDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
