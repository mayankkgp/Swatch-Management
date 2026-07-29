import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Ban, CheckCircle2 } from 'lucide-react';
import { fetchSwatches, saveSwatch } from '../../services/swatchServices';
import EnquiryDetailsViewHeader from './EnquiryDetailsViewHeader';
import EnquirySwatchCard from './EnquirySwatchCard';

import { getSwatchAspectRatio } from '../batches/swatchCardUtils';

function EnquirySwatchSkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs animate-pulse flex flex-col w-full">
      {/* Image Skeleton */}
      <div
        className="w-full bg-slate-200 border-b border-slate-100"
        style={{ aspectRatio: getSwatchAspectRatio('3:4', false) }}
      />
      {/* Details Skeleton */}
      <div className="px-3 pt-1.5 pb-2 flex-1 flex flex-col justify-between gap-1.5 bg-white">
        <div className="space-y-1">
          {/* Row 1: Vendor Name & Stock Qty */}
          <div className="flex items-center justify-between gap-2 h-[14px]">
            <div className="h-2.5 bg-slate-200 rounded-xs w-2/3" />
            <div className="h-2.5 bg-slate-200/70 rounded-xs w-1/4" />
          </div>
          {/* Row 2: Vendor SKU & Structure */}
          <div className="flex items-center justify-between gap-2 h-[14px]">
            <div className="h-2 bg-slate-200/60 rounded-xs w-1/2" />
            <div className="h-2 bg-slate-200/50 rounded-xs w-1/3" />
          </div>
          {/* Row 3: Material Content */}
          <div className="flex items-center h-[14px]">
            <div className="h-2 bg-slate-200/50 rounded-xs w-4/5" />
          </div>
          {/* Row 4: Enquired Quantity */}
          <div className="flex items-center h-[14px] pt-0.5">
            <div className="h-2.5 bg-indigo-100/80 rounded-xs w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   1. SWATCH PREVIEW MODE COMPONENT
   ========================================================================= */
function EnquirySwatchPreviewMode({
  viewingSwatch,
  enquiry,
  rejectedSwatchIds,
  onViewSwatch,
  handleToggleRejectSwatch
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100 relative overflow-hidden">
      <button
        onClick={() => {
          if (onViewSwatch) onViewSwatch(null);
        }}
        className="absolute top-4 right-4 z-10 bg-white/95 hover:bg-white text-slate-700 font-bold text-xs md:text-[10px] uppercase tracking-wider px-4 md:px-3 h-11 md:h-7 rounded-md border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <X className="size-5 md:size-3.5" />
        <span>Back to Grid</span>
      </button>

      <div
        className="max-w-full max-h-[calc(100vh-180px)] rounded-lg shadow-xl overflow-hidden border border-slate-200/50 flex items-center justify-center transition-all bg-white"
        style={{
          aspectRatio: viewingSwatch.aspectRatio
            ? viewingSwatch.aspectRatio.replace(':', '/')
            : '3/4',
          background:
            !viewingSwatch.image ||
            viewingSwatch.image.startsWith('linear-gradient') ||
            viewingSwatch.image.startsWith('radial-gradient') ||
            viewingSwatch.image.startsWith('#')
              ? viewingSwatch.image ||
                'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
              : undefined,
          width: '100%',
          maxWidth: '520px'
        }}
      >
        {viewingSwatch.image &&
          !(
            viewingSwatch.image.startsWith('linear-gradient') ||
            viewingSwatch.image.startsWith('radial-gradient') ||
            viewingSwatch.image.startsWith('#')
          ) && (
            <img
              src={viewingSwatch.image}
              alt={`Swatch ${viewingSwatch.id}`}
              className="w-full h-full object-contain max-h-full max-w-full select-none block"
              referrerPolicy="no-referrer"
            />
          )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
          {viewingSwatch.id}
        </span>

        {enquiry.status !== 'in_progress' && rejectedSwatchIds.includes(viewingSwatch.id) && (
          <span className="px-2.5 py-1 text-xs font-bold font-mono uppercase tracking-wider rounded border bg-rose-50 text-rose-700 border-rose-300 flex items-center gap-1">
            <Ban className="size-3.5" />
            <span>Rejected</span>
          </span>
        )}

        {enquiry.status === 'in_progress' && (
          <button
            onClick={() => handleToggleRejectSwatch(viewingSwatch.id)}
            className={`px-3 py-1 text-xs font-semibold rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              rejectedSwatchIds.includes(viewingSwatch.id)
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Ban className="size-3.5" />
            <span>
              {rejectedSwatchIds.includes(viewingSwatch.id) ? 'Rejected' : 'Mark Rejected'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   2. SWATCHES GRID CONTAINER COMPONENT
   ========================================================================= */
function EnquirySwatchesGrid({
  loading,
  isPaneLoading,
  displaySwatches,
  enquirySwatches,
  enquiry,
  rejectedSwatchIds,
  actionState,
  viewingSwatchId,
  handleRejectSwatch,
  handleAcceptSwatch,
  onViewSwatch
}) {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      {loading || isPaneLoading ? (
        <div
          className="grid justify-between gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 200px))'
          }}
        >
          {Array.from({
            length: Math.max(enquirySwatches.length || enquiry?.swatchCount || 6, 4)
          }).map((_, idx) => (
            <EnquirySwatchSkeletonCard key={idx} />
          ))}
        </div>
      ) : displaySwatches.length === 0 ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          This enquiry has no registered fabric swatches.
        </div>
      ) : (
        <div
          className="grid justify-between gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 200px))'
          }}
        >
          {displaySwatches.map((swatch) => {
            const isRejected = rejectedSwatchIds.includes(swatch.id);
            const isActiveEnquiry = enquiry.status === 'in_progress';
            const isTarget = actionState?.swatchId === swatch.id;
            const actionPhase = isTarget ? actionState.phase : null;

            return (
              <motion.div
                key={swatch.id}
                layout
                transition={{
                  layout: { duration: 0.075, ease: [0.2, 0, 0, 1] }
                }}
              >
                <EnquirySwatchCard
                  swatch={swatch}
                  isActiveEnquiry={isActiveEnquiry}
                  isRejected={isRejected}
                  isCurrentlyViewing={viewingSwatchId === swatch.id}
                  actionPhase={actionPhase}
                  onReject={handleRejectSwatch}
                  onAccept={handleAcceptSwatch}
                  onView={() => {
                    if (onViewSwatch) onViewSwatch(swatch.id);
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   3. MAIN EXPORT: ENQUIRY DETAILS VIEW
   ========================================================================= */
export default function EnquiryDetailsView({
  enquiry,
  onClose,
  onUpdateEnquiry,
  viewingSwatchId,
  onViewSwatch,
  allSwatches: propsAllSwatches
}) {
  const [internalAllSwatches, setInternalAllSwatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaneLoading, setIsPaneLoading] = useState(true);

  // Sorting & Action Animation states
  const [orderedSwatchIds, setOrderedSwatchIds] = useState([]);
  const [actionState, setActionState] = useState(null); // { swatchId, phase: 'latency' | 'exit' | 'reenter' }

  // Simulated delay & loading state when opening or switching an enquiry row
  useEffect(() => {
    if (enquiry?.id) {
      setIsPaneLoading(true);
      const timer = setTimeout(() => {
        setIsPaneLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [enquiry?.id]);

  const allSwatches = propsAllSwatches && propsAllSwatches.length > 0 ? propsAllSwatches : internalAllSwatches;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (propsAllSwatches && propsAllSwatches.length > 0) {
        setLoading(false);
        return;
      }
      try {
        const sw = await fetchSwatches();
        if (isMounted) setInternalAllSwatches(sw);
      } catch (err) {
        console.error('[ENQUIRY DETAILS] Failed to load swatches:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [propsAllSwatches]);

  // Resolve swatches for this enquiry
  let enquirySwatches = [];
  if (enquiry?.swatchIds && Array.isArray(enquiry.swatchIds) && enquiry.swatchIds.length > 0) {
    const swMap = new Map(allSwatches.map((s) => [s.id, s]));
    enquirySwatches = enquiry.swatchIds.map((id) => swMap.get(id)).filter(Boolean);
  } else if (enquiry) {
    // Fallback: slice swatches up to enquiry.swatchCount
    const count = enquiry.swatchCount || 5;
    enquirySwatches = allSwatches.slice(0, count);
  }

  // Calculate rejected SKU count
  const rejectedSwatchIds = enquiry?.rejectedSwatchIds || [];
  const rejectedSkuCount = rejectedSwatchIds.length;

  // Initialize or update orderedSwatchIds when enquiry or swatches change
  useEffect(() => {
    if (enquirySwatches.length > 0) {
      const normal = enquirySwatches.map((s) => s.id).filter((id) => !rejectedSwatchIds.includes(id));
      const rejected = enquirySwatches.map((s) => s.id).filter((id) => rejectedSwatchIds.includes(id));
      setOrderedSwatchIds([...normal, ...rejected]);
    }
  }, [enquiry?.id, enquirySwatches.length]);

  if (!enquiry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 text-xs">
        No Enquiry Selected
      </div>
    );
  }

  const viewingSwatch = enquirySwatches.find((s) => s.id === viewingSwatchId);

  // Reject handler: Moves swatch to the VERY END of the stack with simulated latency & high-speed animation
  const handleRejectSwatch = (swatchId) => {
    if (actionState) return;
    if (rejectedSwatchIds.includes(swatchId)) return;

    // 1. Simulated Latency UI (Triggered instantly on click)
    setActionState({ swatchId, phase: 'latency' });

    // Latency duration (400ms simulated server latency)
    setTimeout(() => {
      // 2. High-Speed Animation Phase 1: The Instant Exit (0ms)
      setActionState({ swatchId, phase: 'exit' });

      // Clear airspace instantly (15ms tick)
      setTimeout(() => {
        // 3. High-Speed Animation Phase 2: The Snap Reflow (0ms–75ms) & Flash Re-entry (50ms–100ms)
        const updatedRejected = [...rejectedSwatchIds, swatchId];
        onUpdateEnquiry({ ...enquiry, rejectedSwatchIds: updatedRejected });

        const nextOrder = [...orderedSwatchIds.filter((id) => id !== swatchId), swatchId];
        setOrderedSwatchIds(nextOrder);

        setActionState({ swatchId, phase: 'reenter' });

        // Clear action animation state after completion
        setTimeout(() => {
          setActionState(null);
        }, 100);
      }, 15);
    }, 400);
  };

  // Accept handler: Moves swatch to the END OF NORMAL (unrejected) cards with simulated latency & high-speed animation
  const handleAcceptSwatch = (swatchId) => {
    if (actionState) return;
    if (!rejectedSwatchIds.includes(swatchId)) return;

    // 1. Simulated Latency UI (Triggered instantly on click)
    setActionState({ swatchId, phase: 'latency' });

    // Latency duration (400ms simulated server latency)
    setTimeout(() => {
      // 2. High-Speed Animation Phase 1: The Instant Exit (0ms)
      setActionState({ swatchId, phase: 'exit' });

      // Clear airspace instantly (15ms tick)
      setTimeout(() => {
        // 3. High-Speed Animation Phase 2: The Snap Reflow (0ms–75ms) & Flash Re-entry (50ms–100ms)
        const updatedRejected = rejectedSwatchIds.filter((id) => id !== swatchId);
        onUpdateEnquiry({ ...enquiry, rejectedSwatchIds: updatedRejected });

        const currentNormals = orderedSwatchIds.filter(
          (id) => !updatedRejected.includes(id) && id !== swatchId
        );
        const currentRejected = orderedSwatchIds.filter((id) => updatedRejected.includes(id));

        const nextOrder = [...currentNormals, swatchId, ...currentRejected];
        setOrderedSwatchIds(nextOrder);

        setActionState({ swatchId, phase: 'reenter' });

        // Clear action animation state after completion
        setTimeout(() => {
          setActionState(null);
        }, 100);
      }, 15);
    }, 400);
  };

  const handleToggleRejectSwatch = (swatchId) => {
    if (rejectedSwatchIds.includes(swatchId)) {
      handleAcceptSwatch(swatchId);
    } else {
      handleRejectSwatch(swatchId);
    }
  };

  // Derive ordered swatch objects
  const swMap = new Map(enquirySwatches.map((s) => [s.id, s]));
  const sortedSwatches = orderedSwatchIds
    .map((id) => swMap.get(id))
    .filter(Boolean);

  const displaySwatches =
    sortedSwatches.length === enquirySwatches.length ? sortedSwatches : enquirySwatches;

  return (
    <div
      id="enquiry-details-right-pane"
      className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-hidden border-l border-slate-200/80"
    >
      {/* Header */}
      <EnquiryDetailsViewHeader
        enquiry={enquiry}
        swatchCount={enquirySwatches.length}
        rejectedSkuCount={rejectedSkuCount}
        onUpdateEnquiry={onUpdateEnquiry}
        onClose={onClose}
        isViewingSwatch={Boolean(viewingSwatch)}
      />

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto min-h-0 relative">
        {viewingSwatch ? (
          <EnquirySwatchPreviewMode
            viewingSwatch={viewingSwatch}
            enquiry={enquiry}
            rejectedSwatchIds={rejectedSwatchIds}
            onViewSwatch={onViewSwatch}
            handleToggleRejectSwatch={handleToggleRejectSwatch}
          />
        ) : (
          <EnquirySwatchesGrid
            loading={loading}
            isPaneLoading={isPaneLoading}
            displaySwatches={displaySwatches}
            enquirySwatches={enquirySwatches}
            enquiry={enquiry}
            rejectedSwatchIds={rejectedSwatchIds}
            actionState={actionState}
            viewingSwatchId={viewingSwatchId}
            handleRejectSwatch={handleRejectSwatch}
            handleAcceptSwatch={handleAcceptSwatch}
            onViewSwatch={onViewSwatch}
          />
        )}
      </div>
    </div>
  );
}


