/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronDown, Image as ImageIcon, Upload } from 'lucide-react';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { VENDOR_NAMES, STRUCTURES } from '../../data/seedData';

export default function BulkEditPanelFormSection({
  handleSave,
  editingSwatch,
  isDisabled,
  formData,
  handleInputChange,
  selectClass,
  inputClass,
  textareaClass,
  textareaRef,
  handleContentChange,
  isViewOnly,
  onView
}) {
  return (
    <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-3 px-1.5 space-y-3.5">
      {editingSwatch && (
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Fabrito SKU
          </label>
          <input
            type="text"
            disabled
            value={editingSwatch.id || ''}
            className="h-11 md:h-6 w-full text-base md:text-xs bg-slate-100 border border-slate-200 rounded-md md:rounded-sm px-2.5 text-slate-500 font-sans cursor-not-allowed"
          />
        </div>
      )}

      <div>
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
          Vendor Name
        </label>
        <SearchableSelect
          disabled={isDisabled}
          value={formData.vendorName}
          onChange={(val) => handleInputChange('vendorName', val)}
          options={VENDOR_NAMES}
          placeholder="Keep original values"
          className={selectClass}
        />
      </div>

      {/* Display SKU and Quantity/Unit ONLY in Single Edit mode */}
      {editingSwatch && (
        <>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Vendor SKU
            </label>
            <input
              type="text"
              disabled={isDisabled}
              value={formData.vendorSku}
              onChange={(e) => handleInputChange('vendorSku', e.target.value)}
              className={`${inputClass} md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]`}
              placeholder="e.g. SKU"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Quantity
              </label>
              <input
                type="number"
                disabled={isDisabled}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`${inputClass} md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]`}
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Unit
              </label>
              <div className="relative">
                <select
                  disabled={isDisabled}
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className={selectClass}
                >
                  <option value="yd">yd</option>
                  <option value="m">m</option>
                  <option value="kg">kg</option>
                </select>
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
          Structure
        </label>
        <SearchableSelect
          disabled={isDisabled}
          value={formData.structure}
          onChange={(val) => handleInputChange('structure', val)}
          options={STRUCTURES}
          placeholder="Keep original values"
          className={selectClass}
        />
      </div>

      <div>
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
          Content
        </label>
        <textarea
          ref={textareaRef}
          disabled={isDisabled}
          value={formData.content}
          onChange={handleContentChange}
          placeholder="Keep original values"
          rows={1}
          className={textareaClass}
        />
      </div>

      {editingSwatch && (
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Swatch Image
          </label>
          <div className="space-y-2">
            <div 
              className={`relative group rounded border border-slate-200 overflow-hidden h-28 flex items-center justify-center ${!formData.image ? 'bg-slate-50' : ''}`}
              style={{
                background: formData.image && (formData.image.startsWith('linear-gradient') || formData.image.startsWith('radial-gradient') || formData.image.startsWith('#') || formData.image.startsWith('rgb'))
                  ? formData.image
                  : undefined
              }}
            >
              {formData.image ? (
                !(formData.image.startsWith('linear-gradient') || formData.image.startsWith('radial-gradient') || formData.image.startsWith('#') || formData.image.startsWith('rgb')) ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover select-none cursor-pointer md:cursor-default"
                    onClick={(e) => {
                      if (window.innerWidth < 768) {
                        e.stopPropagation();
                        e.preventDefault();
                        const event = new CustomEvent('show-mobile-image-overlay', {
                          detail: {
                            src: formData.image,
                            id: editingSwatch?.id || 'Preview'
                          }
                        });
                        window.dispatchEvent(event);
                      }
                    }}
                  />
                ) : null
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                  <ImageIcon className="size-5 stroke-[1.5]" />
                  <span className="text-[9px] uppercase tracking-wider font-mono">No image loaded</span>
                </div>
              )}
              {formData.image && !isViewOnly && (
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView && onView(editingSwatch.id)}
                    className="text-[9px] bg-white text-slate-800 font-bold px-2.5 py-1 rounded shadow-xs cursor-pointer uppercase tracking-wider hover:bg-slate-100 transition-all"
                  >
                    View
                  </button>
                  <label
                    htmlFor="sidebar-image-upload"
                    className="text-[9px] bg-white text-slate-800 font-bold px-2.5 py-1 rounded shadow-xs cursor-pointer uppercase tracking-wider hover:bg-slate-100 transition-all"
                  >
                    Replace
                  </label>
                </div>
              )}
            </div>

            {!isViewOnly && (
              <input
                type="file"
                accept="image/*"
                id="sidebar-image-upload"
                className="hidden"
                disabled={isDisabled}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const dataUrl = evt.target?.result;
                      if (typeof dataUrl === 'string') {
                        handleInputChange('image', dataUrl);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            )}

            {!formData.image && !isViewOnly && (
              <label
                htmlFor="sidebar-image-upload"
                className="w-full h-8 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-1 border border-slate-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="size-3" />
                <span>Upload Image</span>
              </label>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
