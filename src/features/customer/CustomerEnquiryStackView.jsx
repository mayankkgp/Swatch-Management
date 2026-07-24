import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Send, X, Check } from 'lucide-react';
import simulateNetwork from '../../utils/simulateNetwork';
import {
  fetchEnquiryStack,
  addEnquiryItem,
  updateEnquiryItemQty,
  deleteEnquiryItem,
  submitCustomerEnquiry,
  fetchEnquirySubmittedState,
  startNewCustomerEnquiry
} from '../../services/customerEnquiryServices';

import EnquirySubmittedState from './EnquirySubmittedState';
import EnquiryEmptyState from './EnquiryEmptyState';
import EnquirySkeletonCard from './EnquirySkeletonCard';
import EnquirySwatchCard from './EnquirySwatchCard';
import QrScannerModal from './QrScannerModal';

export default function CustomerEnquiryStackView({ onLogout }) {
  // Enquiry items state
  const [enquiryItems, setEnquiryItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStartingNewEnquiry, setIsStartingNewEnquiry] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [toastConfig, setToastConfig] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [longPressActiveId, setLongPressActiveId] = useState(null);
  const [isFloatingHidden, setIsFloatingHidden] = useState(false);

  // Ref to track quantity input for the top/newest item
  const topInputRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollRef = useRef(null);
  const deleteIntervalRef = useRef(null);

  // Hydrate enquiry items and submitted state from LocalStorage on mount
  useEffect(() => {
    async function hydrate() {
      const items = await fetchEnquiryStack();
      setEnquiryItems(items);
      const submitted = await fetchEnquirySubmittedState();
      setIsSubmitted(submitted);
    }
    hydrate();
  }, []);

  // Delete countdown timer effect for active delete confirmation
  useEffect(() => {
    if (!deleteConfirmId) {
      setDeleteProgress(0);
      if (deleteIntervalRef.current) clearInterval(deleteIntervalRef.current);
      return;
    }

    setDeleteProgress(0);
    const duration = 5000; // 5 seconds countdown duration
    const intervalTime = 100;
    let elapsed = 0;

    deleteIntervalRef.current = setInterval(async () => {
      elapsed += intervalTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setDeleteProgress(pct);
      if (elapsed >= duration) {
        clearInterval(deleteIntervalRef.current);
        const updatedStack = await deleteEnquiryItem(deleteConfirmId);
        setEnquiryItems(updatedStack);
        setDeleteConfirmId(null);
      }
    }, intervalTime);

    return () => {
      if (deleteIntervalRef.current) clearInterval(deleteIntervalRef.current);
    };
  }, [deleteConfirmId]);

  // Scroll listener to hide floating CTAs on scroll down and show on scroll up
  useEffect(() => {
    const el = scrollRef.current;
    const handleScroll = () => {
      const currentScrollY = el ? el.scrollTop : (window.scrollY || document.documentElement.scrollTop);
      if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 40) {
        setIsFloatingHidden(true);
      } else if (currentScrollY < lastScrollY.current - 8 || currentScrollY <= 20) {
        setIsFloatingHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sync header title when in submitted state
  useEffect(() => {
    if (isSubmitted) {
      window.dispatchEvent(new CustomEvent('customer-header-title-override', { detail: 'Enquiry Submitted' }));
    } else {
      window.dispatchEvent(new CustomEvent('customer-header-title-override', { detail: null }));
    }
    return () => {
      window.dispatchEvent(new CustomEvent('customer-header-title-override', { detail: null }));
    };
  }, [isSubmitted]);

  const showToast = (msg, isError = false) => {
    setToastConfig({ msg, isError });
    setTimeout(() => setToastConfig(null), 3000);
  };

  // Auto-focus top quantity input whenever a new item is added
  useEffect(() => {
    if (enquiryItems.length > 0) {
      const timer = setTimeout(() => {
        topInputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [enquiryItems.length]);

  // Handle adding a swatch via QR scan
  const handleAddSwatch = async (swatchToScan) => {
    setIsScannerOpen(false);
    setIsAddingItem(true);
    setIsScanning(true);

    try {
      const updatedStack = await addEnquiryItem(swatchToScan);
      setEnquiryItems(updatedStack);
    } catch (err) {
      showToast('Failed to add swatch', true);
    } finally {
      setIsAddingItem(false);
      setIsScanning(false);
    }
  };

  // Handle Quick Random Scan simulation directly from FAB
  const handleQuickScan = async () => {
    setIsScanning(true);
    await handleAddSwatch();
  };

  // Long press handler for touch/mouse
  const handleTouchStart = (instanceId) => {
    longPressTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate(50); } catch (e) {}
      }
      setLongPressActiveId(null);
      setDropdownOpenId(instanceId);
    }, 500);
    setLongPressActiveId(instanceId);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setLongPressActiveId(null);
  };

  // Delete item handler
  const handleDeleteItem = async (instanceId) => {
    try {
      const updatedStack = await deleteEnquiryItem(instanceId);
      setEnquiryItems(updatedStack);
      setDeleteConfirmId(null);
      setDropdownOpenId(null);
    } catch (err) {
      showToast('Failed to delete item', true);
    }
  };

  // Update item quantity
  const handleQtyChange = async (instanceId, value) => {
    const cleanVal = value.replace(/\D/g, '');
    setEnquiryItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, qty: cleanVal } : item))
    );
    await updateEnquiryItemQty(instanceId, cleanVal);
  };

  // Submit Enquiry
  const handleSubmitEnquiry = async (e) => {
    if (e) e.preventDefault();
    if (enquiryItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitCustomerEnquiry(enquiryItems);
      setIsSubmitted(true);
    } catch (err) {
      showToast('Failed to submit enquiry', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start New Enquiry handler
  const handleStartNewEnquiry = async () => {
    if (isStartingNewEnquiry) return;
    setIsStartingNewEnquiry(true);

    try {
      // Step 1: Wait network latency on submitted screen CTA button
      await simulateNetwork();

      // Step 2: Switch to stack screen, showing empty stack & skeleton loading UI
      setIsSubmitted(false);
      setIsAddingItem(true);
      setEnquiryItems([]);
      setIsScanning(true);

      // Step 3: Call service to clear submitted state and create initial item in localStorage
      const newStack = await startNewCustomerEnquiry();

      setEnquiryItems(newStack);
      setIsAddingItem(false);
      setIsStartingNewEnquiry(false);
      setIsScannerOpen(false);
      setIsScanning(false);

      setTimeout(() => {
        topInputRef.current?.focus();
      }, 150);
    } catch (err) {
      showToast('Failed to start new enquiry', true);
      setIsStartingNewEnquiry(false);
    }
  };

  return (
    <div ref={scrollRef} className="w-full h-full bg-slate-50 flex flex-col justify-between select-none relative overflow-y-auto">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastConfig && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border ${
              toastConfig.isError
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastConfig.isError ? (
              <X className="size-3.5 text-rose-400" />
            ) : (
              <Check className="size-3.5 text-emerald-400" />
            )}
            <span>{toastConfig.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 flex flex-col p-4 w-full max-w-md mx-auto">
        
        {isSubmitted ? (
          <EnquirySubmittedState
            isStartingNewEnquiry={isStartingNewEnquiry}
            handleStartNewEnquiry={handleStartNewEnquiry}
          />
        ) : (enquiryItems.length === 0 && !isAddingItem && !isStartingNewEnquiry) ? (
          <EnquiryEmptyState />
        ) : (
          /* POPULATED STATE: SWATCH CARDS STACK */
          <div className="flex-1 flex flex-col pb-36">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {/* Skeleton Card Loading UI when adding a new swatch */}
                {(isAddingItem || isStartingNewEnquiry) && (
                  <EnquirySkeletonCard />
                )}

                {enquiryItems.map((item, index) => (
                  <EnquirySwatchCard
                    key={item.instanceId}
                    item={item}
                    index={index}
                    topInputRef={topInputRef}
                    deleteConfirmId={deleteConfirmId}
                    setDeleteConfirmId={setDeleteConfirmId}
                    dropdownOpenId={dropdownOpenId}
                    setDropdownOpenId={setDropdownOpenId}
                    longPressActiveId={longPressActiveId}
                    deleteProgress={deleteProgress}
                    handleTouchStart={handleTouchStart}
                    handleTouchEnd={handleTouchEnd}
                    handleDeleteItem={handleDeleteItem}
                    handleQtyChange={handleQtyChange}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>

      {/* Floating Action Button (FAB): [ Submit (X) ] on Left */}
      {enquiryItems.length > 0 && !isSubmitted && (
        <button
          type="button"
          onClick={handleSubmitEnquiry}
          disabled={isSubmitting}
          className={`fixed bottom-6 left-6 z-30 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full shadow-lg border border-slate-700/50 px-4 py-3 flex items-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 group ${
            isSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
          } ${
            isFloatingHidden ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
          }`}
          aria-label="Submit Enquiry"
        >
          {isSubmitting ? (
            <>
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
              <span className="tracking-wide font-mono">Submitting...</span>
            </>
          ) : (
            <>
              <Send className="size-4 text-white group-hover:scale-110 transition-transform" />
              <span className="tracking-wide font-mono">Submit ({enquiryItems.length})</span>
            </>
          )}
        </button>
      )}

      {/* Floating Action Button (FAB): [ Scan QR ] on Right */}
      {!isSubmitted && (
        <button
          type="button"
          onClick={handleQuickScan}
          disabled={isScanning || isSubmitting}
          className={`fixed bottom-6 right-6 z-30 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full shadow-lg border border-slate-700/50 px-4 py-3 flex items-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 group ${
            isFloatingHidden ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
          }`}
          aria-label="Scan QR Code"
        >
          {isScanning ? (
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <QrCode className="size-4 text-white group-hover:scale-110 transition-transform" />
          )}
          <span className="tracking-wide font-mono">Scan QR</span>
        </button>
      )}

      {/* QR Scanner Modal Simulator */}
      <QrScannerModal
        isScannerOpen={isScannerOpen}
        setIsScannerOpen={setIsScannerOpen}
        handleAddSwatch={handleAddSwatch}
      />

    </div>
  );
}
