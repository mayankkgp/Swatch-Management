/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import AppWorkspace from './AppWorkspace.jsx';
import MobileImageOverlay from './components/ui/MobileImageOverlay.jsx';

import { 
  fetchBatches, 
  fetchSwatches, 
  fetchActiveDefaults, 
  hydrateAndSeedStorage
} from './services/swatchServices.js';
import { INITIAL_DEFAULTS } from './data/seedData.js';

export default function App() {
  const [activeModule, setActiveModule] = useState('batch');
  const [userRole, setUserRole] = useState('fabrito'); // 'fabrito' | 'customer'
  const [loading, setLoading] = useState(true);
  const [viewerTheme, setViewerTheme] = useState('dark');
  const [showStagingQueue, setShowStagingQueue] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [batches, setBatches] = useState([]);
  const [swatches, setSwatches] = useState([]);
  const [activeDefaults, setActiveDefaults] = useState(INITIAL_DEFAULTS);
  const [resumeBatchId, setResumeBatchId] = useState(null);

  // Load and Hydrate Local Data Layer
  const refreshData = useCallback(async (showGlobalSpinner = false) => {
    if (showGlobalSpinner) {
      setRefreshing(true);
    }
    try {
      console.log('[DATA LAYER] Fetching latest datasets from local storage transaction engine...');
      const loadedBatches = await fetchBatches();
      const loadedSwatches = await fetchSwatches();
      const loadedDefaults = await fetchActiveDefaults();

      setBatches(loadedBatches);
      setSwatches(loadedSwatches);
      if (loadedDefaults) {
        setActiveDefaults(loadedDefaults);
      }
      console.log('[DATA LAYER] Hydration complete.', {
        batches: loadedBatches.length,
        swatches: loadedSwatches.length
      });
    } catch (err) {
      console.error('[DATA LAYER] Failed to refresh state:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Root level single-execution hydration hook
  useEffect(() => {
    async function init() {
      try {
        hydrateAndSeedStorage();
        await refreshData(false);
      } catch (error) {
        console.error('[DATA LAYER] Critical failure during storage hydration:', error);
        setLoading(false);
      }
    }
    init();
  }, [refreshData]);

  const handleNavigate = (module) => {
    setActiveModule(module);
    setShowStagingQueue(false);
  };

  return (
    <>
      <div
        id="application-frame"
        className={`h-screen max-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 overflow-hidden`}
      >
      {/* Responsive Global Header */}
      <Header
        activeModule={activeModule}
        onNavigate={handleNavigate}
        viewerTheme={viewerTheme}
        setViewerTheme={setViewerTheme}
        showStagingQueue={showStagingQueue}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Desktop Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onNavigate={handleNavigate}
        />

        {/* Workspace Area: dynamic canvas update */}
        <AppWorkspace
          activeModule={activeModule}
          loading={loading}
          refreshing={refreshing}
          batches={batches}
          swatches={swatches}
          activeDefaults={activeDefaults}
          resumeBatchId={resumeBatchId}
          setResumeBatchId={setResumeBatchId}
          refreshData={refreshData}
          handleNavigate={handleNavigate}
          viewerTheme={viewerTheme}
          setViewerTheme={setViewerTheme}
          showStagingQueue={showStagingQueue}
          setShowStagingQueue={setShowStagingQueue}
          setActiveModule={setActiveModule}
          userRole={userRole}
        />
      </div>
    </div>
    <MobileImageOverlay />
    </>
  );
}
