/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';

export default function useSwatchDeleteCountdown(onDelete, swatchId, setIsSaving) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState(0);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const triggerDelete = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setIsSaving(true);
    try {
      await onDelete(swatchId);
    } catch (err) {
      console.error('[Countdown] Swatch deletion failed:', err);
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const startDeleteCountdown = () => {
    setShowDeleteConfirm(true);
    setCountdownProgress(0);
    const duration = 5000; // 5 seconds
    const intervalTime = 100; // update every 100ms
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setCountdownProgress(pct);
      if (elapsed >= duration) {
        clearInterval(progressIntervalRef.current);
        triggerDelete();
      }
    }, intervalTime);
  };

  const cancelDeleteCountdown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setShowDeleteConfirm(false);
    setCountdownProgress(0);
  };

  return {
    showDeleteConfirm,
    countdownProgress,
    startDeleteCountdown,
    cancelDeleteCountdown,
    triggerDelete
  };
}
