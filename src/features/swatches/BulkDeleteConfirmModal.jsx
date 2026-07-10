import React from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BulkDeleteConfirmModal({
  showModal,
  setShowModal,
  isDeleting,
  handleDelete,
  selectedCount,
  showCancel = true
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-pointer" 
        onClick={() => {
          if (!isDeleting) {
            setShowModal(false);
          }
        }}
      />
      
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl border border-slate-100 w-full max-w-sm p-5 relative z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Delete Swatches</h3>
          <button 
            type="button"
            onClick={() => {
              if (!isDeleting) {
                setShowModal(false);
              }
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 cursor-pointer"
            disabled={isDeleting}
          >
            <X className="size-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Are you sure you want to delete {selectedCount} selected {selectedCount === 1 ? 'swatch' : 'swatches'}? This action cannot be undone.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {showCancel && (
              <Button
                type="button"
                onClick={() => {
                  setShowModal(false);
                }}
                disabled={isDeleting}
                className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-md cursor-pointer border border-slate-200"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-10 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm rounded-md cursor-pointer flex items-center gap-1.5 justify-center"
            >
              {isDeleting ? (
                <>
                  <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
