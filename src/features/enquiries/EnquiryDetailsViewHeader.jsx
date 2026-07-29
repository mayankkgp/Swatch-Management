import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check, Copy, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';

/* =========================================================================
   1. LEFT METADATA SECTION
   ========================================================================= */
function EnquiryHeaderMetadata({
  enquiry,
  swatchCount,
  rejectedSkuCount,
  badgeStyle,
  badgeLabel,
  primaryIdentity,
  hasCustomer,
  hasPhone,
  copiedPhone,
  handleCopyPhone,
  isConverted
}) {
  return (
    <div className="flex flex-col justify-center min-w-0 pr-2">
      {/* Row 1: Status Badge & Customer Name / Phone + Copy CTA */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs border uppercase tracking-wider shrink-0 ${badgeStyle}`}
        >
          {badgeLabel}
        </span>
        <h3
          className="text-sm font-bold text-slate-900 truncate max-w-[150px] md:max-w-[210px]"
          title={primaryIdentity}
        >
          {primaryIdentity}
        </h3>
        {!hasCustomer && hasPhone && (
          <button
            type="button"
            onClick={handleCopyPhone}
            className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            title="Copy phone number"
          >
            {copiedPhone ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Row 2: Secondary Metadata directly below */}
      <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px] tracking-wide uppercase font-semibold shrink-0 select-all mt-0.5">
        <span>{enquiry.id}</span>
        <span className="text-slate-300 font-sans font-normal">•</span>
        <span>{enquiry.date}</span>
        <span className="text-slate-300 font-sans font-normal">•</span>
        <span className="normal-case">{swatchCount} SKUs</span>
        {rejectedSkuCount > 0 && (
          <>
            <span className="text-slate-300 font-sans font-normal">•</span>
            <span className="text-rose-600 font-bold normal-case">
              {rejectedSkuCount} Rejected
            </span>
          </>
        )}
        {isConverted && (
          <>
            <span className="text-slate-300 font-sans font-normal">•</span>
            <span className="text-emerald-600 font-bold normal-case">
              {(enquiry.convertedSwatchCount || enquiry.swatchCount || swatchCount)} selected
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   2. MIDDLE ACCOUNT MANAGER SELECTOR
   ========================================================================= */
function AccountManagerSelector({
  isClosed,
  enquiry,
  isUpdatingAm,
  showAmDropdown,
  setShowAmDropdown,
  amDropdownRef,
  getDisplayAM,
  availableAMs,
  handleSelectAM
}) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
      ref={amDropdownRef}
    >
      {isClosed ? (
        /* Closed State: AM cannot be added or edited in past enquiries */
        <div className="h-6 px-2.5 rounded-sm bg-slate-50 border border-slate-200 text-slate-600 font-sans text-xs md:text-[11px] font-semibold flex items-center gap-1.5 cursor-not-allowed">
          <span className="text-slate-400 font-normal">AM:</span>
          <span>{getDisplayAM(enquiry.am)}</span>
        </div>
      ) : (
        /* Active or Pending State: Editable AM */
        <div className="relative">
          <button
            disabled={isUpdatingAm}
            onClick={() => !isUpdatingAm && setShowAmDropdown((prev) => !prev)}
            className={`h-6 px-2.5 rounded-sm border text-xs md:text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
              isUpdatingAm
                ? 'bg-slate-100 text-slate-500 border-slate-300 cursor-wait'
                : enquiry.am && enquiry.am !== 'Unassigned' && enquiry.am.trim() !== ''
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300 cursor-pointer'
                : 'bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-700 border-indigo-200 border-dashed cursor-pointer'
            }`}
            title="Change Assigned Account Manager"
          >
            <span className="text-slate-400 font-normal">AM:</span>
            <span>{getDisplayAM(enquiry.am)}</span>
            {isUpdatingAm ? (
              <Loader2 className="size-3 animate-spin text-indigo-600" />
            ) : (
              <ChevronDown className="size-3 text-slate-400" />
            )}
          </button>

          {/* AM Dropdown Menu */}
          {showAmDropdown && !isUpdatingAm && (
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-1 divide-y divide-slate-100 text-xs">
              <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">
                Assign Manager
              </div>
              <div className="py-0.5">
                {availableAMs.map((am) => (
                  <button
                    key={am}
                    onClick={() => handleSelectAM(am)}
                    className={`w-full text-left px-2.5 py-1 hover:bg-slate-50 flex items-center justify-between font-medium cursor-pointer ${
                      getDisplayAM(enquiry.am) === am
                        ? 'text-indigo-600 font-bold bg-indigo-50/30'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{am}</span>
                    {getDisplayAM(enquiry.am) === am && (
                      <Check className="size-3 text-indigo-600" />
                    )}
                  </button>
                ))}
                <button
                  onClick={() => handleSelectAM('Unassigned')}
                  className="w-full text-left px-2.5 py-1 hover:bg-rose-50 text-rose-600 font-medium cursor-pointer border-t border-slate-100"
                >
                  Unassign
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   3. PENDING STATUS ACTION ROW
   ========================================================================= */
function PendingActionRow({ isActivating, handleActivate }) {
  return (
    <Button
      disabled={isActivating}
      onClick={handleActivate}
      className="h-6 text-xs px-2.5 rounded-sm border border-transparent font-semibold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-80 disabled:cursor-wait"
    >
      {isActivating ? (
        <>
          <Loader2 className="size-3 animate-spin" />
          <span>Activating...</span>
        </>
      ) : (
        <span>Activate</span>
      )}
    </Button>
  );
}

/* =========================================================================
   4. INLINE DROP / CONVERT ACTION FORM
   ========================================================================= */
function ConvertDropActionForm({
  swatchInputRef,
  swatchInputValue,
  setSwatchInputValue,
  isConverting,
  isDropping,
  handleConvertEnquiry,
  handleDropEnquiry,
  setActiveActionMode
}) {
  return (
    <form onSubmit={handleConvertEnquiry} className="flex items-center gap-1.5">
      <Button
        type="button"
        disabled={swatchInputValue.trim() !== '' || isDropping || isConverting}
        onClick={handleDropEnquiry}
        className={`h-6 text-xs px-2 rounded-sm font-semibold transition-all border border-transparent flex items-center justify-center gap-1 ${
          swatchInputValue.trim() !== '' || isDropping || isConverting
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs'
        }`}
      >
        {isDropping ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            <span>Dropping...</span>
          </>
        ) : (
          <span>Drop</span>
        )}
      </Button>

      <div className="flex items-center rounded-sm border border-slate-300 focus-within:border-emerald-600 overflow-hidden shadow-2xs">
        <input
          ref={swatchInputRef}
          type="number"
          min="1"
          disabled={isConverting || isDropping}
          value={swatchInputValue}
          onChange={(e) => setSwatchInputValue(e.target.value)}
          placeholder="#Selected"
          className="w-[84px] h-6 px-1.5 text-[11px] font-medium border-0 focus:ring-0 focus:outline-none rounded-none bg-white text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-slate-100 disabled:text-slate-400"
        />
        <Button
          type="submit"
          disabled={swatchInputValue.trim() === '' || isConverting || isDropping}
          className={`h-6 text-xs px-2 font-semibold border-0 rounded-none transition-all flex items-center justify-center gap-1 ${
            swatchInputValue.trim() === '' || isConverting || isDropping
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
          }`}
        >
          {isConverting ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              <span>Converting...</span>
            </>
          ) : (
            <span>Convert</span>
          )}
        </Button>
      </div>

      <div className="w-0.5" />

      <Button
        type="button"
        disabled={isConverting || isDropping}
        onClick={() => {
          setActiveActionMode(null);
          setSwatchInputValue('');
        }}
        className="size-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
        title="Cancel action"
      >
        <X className="size-4" />
      </Button>
    </form>
  );
}

/* =========================================================================
   5. INLINE REVERT TO PENDING CONFIRMATION ROW
   ========================================================================= */
function RevertPendingConfirmRow({
  isRevertingToPending,
  handleConfirmRevertToPending,
  setActiveActionMode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        disabled={isRevertingToPending}
        onClick={() => setActiveActionMode(null)}
        className="h-6 text-xs px-2 rounded-sm border border-slate-200 font-medium text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={isRevertingToPending}
        onClick={handleConfirmRevertToPending}
        className="h-6 text-xs px-2.5 rounded-sm bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs cursor-pointer flex items-center gap-1 disabled:opacity-80 disabled:cursor-wait"
      >
        {isRevertingToPending ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            <span>Confirming...</span>
          </>
        ) : (
          <span>Confirm Revert</span>
        )}
      </Button>
    </div>
  );
}

/* =========================================================================
   6. ACTIVE STATUS ACTION ROW
   ========================================================================= */
function ActiveActionRow({
  activeActionMode,
  setActiveActionMode,
  swatchInputRef,
  swatchInputValue,
  setSwatchInputValue,
  isConverting,
  isDropping,
  isRevertingToPending,
  handleConvertEnquiry,
  handleDropEnquiry,
  handleConfirmRevertToPending
}) {
  if (activeActionMode === null) {
    return (
      <>
        <Button
          onClick={() => setActiveActionMode('revert_pending')}
          className="h-6 text-xs px-2 rounded-sm border font-semibold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
        >
          <span>Revert to Pending</span>
        </Button>

        <Button
          onClick={() => setActiveActionMode('convert_drop')}
          className="h-6 text-xs px-2.5 rounded-sm border border-transparent font-semibold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
        >
          <span>Drop / Convert</span>
        </Button>
      </>
    );
  }

  if (activeActionMode === 'convert_drop') {
    return (
      <ConvertDropActionForm
        swatchInputRef={swatchInputRef}
        swatchInputValue={swatchInputValue}
        setSwatchInputValue={setSwatchInputValue}
        isConverting={isConverting}
        isDropping={isDropping}
        handleConvertEnquiry={handleConvertEnquiry}
        handleDropEnquiry={handleDropEnquiry}
        setActiveActionMode={setActiveActionMode}
      />
    );
  }

  if (activeActionMode === 'revert_pending') {
    return (
      <RevertPendingConfirmRow
        isRevertingToPending={isRevertingToPending}
        handleConfirmRevertToPending={handleConfirmRevertToPending}
        setActiveActionMode={setActiveActionMode}
      />
    );
  }

  return null;
}

/* =========================================================================
   7. CLOSED STATUS ACTION ROW
   ========================================================================= */
function ClosedActionRow({
  showReopenConfirm,
  setShowReopenConfirm,
  isReopening,
  handleConfirmReopen
}) {
  if (!showReopenConfirm) {
    return (
      <Button
        onClick={() => setShowReopenConfirm(true)}
        className="h-6 text-xs px-2.5 rounded-sm border border-transparent font-semibold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
      >
        <span>Re-Open</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        disabled={isReopening}
        onClick={() => setShowReopenConfirm(false)}
        className="h-6 text-xs px-2 rounded-sm border border-slate-200 font-medium text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={isReopening}
        onClick={handleConfirmReopen}
        className="h-6 text-xs px-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer flex items-center gap-1 disabled:opacity-80 disabled:cursor-wait"
      >
        {isReopening ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            <span>Re-opening...</span>
          </>
        ) : (
          <span>Confirm Revert</span>
        )}
      </Button>
    </div>
  );
}

/* =========================================================================
   8. MAIN EXPORT: ENQUIRY DETAILS VIEW HEADER
   ========================================================================= */
export default function EnquiryDetailsViewHeader({
  enquiry,
  swatchCount,
  rejectedSkuCount = 0,
  onUpdateEnquiry,
  onClose,
  isViewingSwatch = false
}) {
  const [showAmDropdown, setShowAmDropdown] = useState(false);
  const amDropdownRef = useRef(null);
  const swatchInputRef = useRef(null);

  // Loading / Simulated Latency states
  const [isUpdatingAm, setIsUpdatingAm] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isRevertingToPending, setIsRevertingToPending] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  // Active status action row states
  const [activeActionMode, setActiveActionMode] = useState(null); // null | 'convert_drop' | 'revert_pending'
  const [swatchInputValue, setSwatchInputValue] = useState('');

  // Closed status action row state
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);

  // Phone copy state
  const [copiedPhone, setCopiedPhone] = useState(false);

  const amNameMap = {
    'Priya S.': 'Priya Sharma',
    'Ankit K.': 'Ankit Kumar',
    'Vikram R.': 'Vikram Rathore',
    'Neha M.': 'Neha Mehta',
    'Priya Sharma': 'Priya Sharma',
    'Ankit Kumar': 'Ankit Kumar',
    'Vikram Rathore': 'Vikram Rathore',
    'Neha Mehta': 'Neha Mehta'
  };

  const availableAMs = ['Priya Sharma', 'Ankit Kumar', 'Vikram Rathore', 'Neha Mehta'];

  const getDisplayAM = (rawAm) => {
    if (!rawAm || rawAm === 'Unassigned' || rawAm.trim() === '') return '-';
    return amNameMap[rawAm] || rawAm;
  };

  // Close AM dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (amDropdownRef.current && !amDropdownRef.current.contains(e.target)) {
        setShowAmDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset action modes when active enquiry changes
  useEffect(() => {
    setActiveActionMode(null);
    setSwatchInputValue('');
    setShowReopenConfirm(false);
    setCopiedPhone(false);
  }, [enquiry?.id]);

  // Focus swatch input automatically when entering convert_drop mode
  useEffect(() => {
    if (activeActionMode === 'convert_drop') {
      const timer = setTimeout(() => {
        swatchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeActionMode]);

  if (!enquiry) return null;

  const isPending = enquiry.status === 'pending';
  const isActive = enquiry.status === 'in_progress';
  const isClosed = enquiry.status === 'past';

  const outcomeVal =
    enquiry.outcome ||
    enquiry.closedStatus ||
    (enquiry.notes?.toLowerCase().includes('cancel') ? 'Dropped' : 'Converted');
  const isConverted = isClosed && outcomeVal.toLowerCase() === 'converted';

  const hasCustomer = Boolean(enquiry.customer && enquiry.customer.trim() !== '');
  const hasPhone = Boolean(enquiry.phone && enquiry.phone.trim() !== '');

  // Primary identity fallback: Customer name -> Phone number -> "No Name Provided"
  const primaryIdentity = hasCustomer
    ? enquiry.customer
    : hasPhone
    ? enquiry.phone
    : 'No Name Provided';

  // Badge config
  let badgeLabel = 'Pending';
  let badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200/80';

  if (isActive) {
    badgeLabel = 'Active';
    badgeStyle = 'bg-indigo-100 text-indigo-800 border-indigo-200/80';
  } else if (isClosed) {
    if (isConverted) {
      badgeLabel = 'Converted';
      badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200/80';
    } else {
      badgeLabel = 'Dropped';
      badgeStyle = 'bg-rose-100 text-rose-800 border-rose-200/80';
    }
  }

  // Copy phone handler
  const handleCopyPhone = (e) => {
    e.stopPropagation();
    if (enquiry.phone) {
      navigator.clipboard.writeText(enquiry.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Handlers for status actions with simulated latency & loading states
  const handleActivate = () => {
    if (isActivating) return;
    setIsActivating(true);
    setTimeout(() => {
      onUpdateEnquiry({ ...enquiry, status: 'in_progress' });
      setIsActivating(false);
    }, 400);
  };

  const handleConfirmRevertToPending = () => {
    if (isRevertingToPending) return;
    setIsRevertingToPending(true);
    setTimeout(() => {
      onUpdateEnquiry({ ...enquiry, status: 'pending', outcome: undefined });
      setActiveActionMode(null);
      setIsRevertingToPending(false);
    }, 400);
  };

  const handleDropEnquiry = () => {
    if (isDropping) return;
    setIsDropping(true);
    setTimeout(() => {
      onUpdateEnquiry({ ...enquiry, status: 'past', outcome: 'Dropped' });
      setActiveActionMode(null);
      setIsDropping(false);
    }, 400);
  };

  const handleConvertEnquiry = (e) => {
    if (e) e.preventDefault();
    if (!swatchInputValue.trim() || isConverting) return;
    const num = parseInt(swatchInputValue.trim(), 10);
    const finalCount = isNaN(num) ? enquiry.swatchCount : num;
    setIsConverting(true);
    setTimeout(() => {
      onUpdateEnquiry({
        ...enquiry,
        status: 'past',
        outcome: 'Converted',
        convertedSwatchCount: finalCount,
        swatchCount: finalCount
      });
      setActiveActionMode(null);
      setIsConverting(false);
    }, 400);
  };

  const handleConfirmReopen = () => {
    if (isReopening) return;
    setIsReopening(true);
    setTimeout(() => {
      onUpdateEnquiry({ ...enquiry, status: 'in_progress', outcome: undefined });
      setShowReopenConfirm(false);
      setIsReopening(false);
    }, 400);
  };

  const handleSelectAM = (amName) => {
    if (isUpdatingAm) return;
    setShowAmDropdown(false);
    setIsUpdatingAm(true);
    setTimeout(() => {
      onUpdateEnquiry({ ...enquiry, am: amName });
      setIsUpdatingAm(false);
    }, 400);
  };

  return (
    <div className="sticky top-0 md:relative z-30 bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between shadow-xs min-h-[48px] md:h-12 shrink-0 w-full select-none">
      {/* LEFT SECTION */}
      <EnquiryHeaderMetadata
        enquiry={enquiry}
        swatchCount={swatchCount}
        rejectedSkuCount={rejectedSkuCount}
        badgeStyle={badgeStyle}
        badgeLabel={badgeLabel}
        primaryIdentity={primaryIdentity}
        hasCustomer={hasCustomer}
        hasPhone={hasPhone}
        copiedPhone={copiedPhone}
        handleCopyPhone={handleCopyPhone}
        isConverted={isConverted}
      />

      {/* MIDDLE SECTION */}
      <AccountManagerSelector
        isClosed={isClosed}
        enquiry={enquiry}
        isUpdatingAm={isUpdatingAm}
        showAmDropdown={showAmDropdown}
        setShowAmDropdown={setShowAmDropdown}
        amDropdownRef={amDropdownRef}
        getDisplayAM={getDisplayAM}
        availableAMs={availableAMs}
        handleSelectAM={handleSelectAM}
      />

      {/* RIGHT SECTION */}
      {!isViewingSwatch && (
        <div className="flex items-center gap-1.5 shrink-0 ml-auto z-10">
          {isPending && (
            <PendingActionRow
              isActivating={isActivating}
              handleActivate={handleActivate}
            />
          )}

          {isActive && (
            <ActiveActionRow
              activeActionMode={activeActionMode}
              setActiveActionMode={setActiveActionMode}
              swatchInputRef={swatchInputRef}
              swatchInputValue={swatchInputValue}
              setSwatchInputValue={setSwatchInputValue}
              isConverting={isConverting}
              isDropping={isDropping}
              isRevertingToPending={isRevertingToPending}
              handleConvertEnquiry={handleConvertEnquiry}
              handleDropEnquiry={handleDropEnquiry}
              handleConfirmRevertToPending={handleConfirmRevertToPending}
            />
          )}

          {isClosed && (
            <ClosedActionRow
              showReopenConfirm={showReopenConfirm}
              setShowReopenConfirm={setShowReopenConfirm}
              isReopening={isReopening}
              handleConfirmReopen={handleConfirmReopen}
            />
          )}

          {activeActionMode !== 'convert_drop' && (
            <>
              <div className="w-1 md:w-2" />
              <Button
                onClick={onClose}
                className="size-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm flex items-center justify-center shrink-0 cursor-pointer"
                title="Close detail view"
              >
                <X className="size-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}


