/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import BatchDirectory from './features/batches/BatchDirectory.jsx';
import AllSwatchesStream from './features/swatches/AllSwatchesStream.jsx';
import CaptureSession from './features/logging/CaptureSession.jsx';

export default function AppWorkspace({
  activeModule,
  loading,
  refreshing,
  batches,
  swatches,
  activeDefaults,
  resumeBatchId,
  setResumeBatchId,
  refreshData,
  handleNavigate,
  viewerTheme,
  setViewerTheme,
  showStagingQueue,
  setShowStagingQueue,
  setActiveModule
}) {
  return (
    <main
      id="workspace-canvas"
      className={`flex-1 bg-slate-50 transition-all duration-300 flex flex-col relative ${
        (activeModule === 'batch' || activeModule === 'all_swatches' || activeModule === 'logging') ? 'p-0 md:p-3 overflow-hidden h-full' : 'p-4 md:p-3 overflow-y-auto'
      }`}
    >
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs select-none gap-2 py-12">
          <span className="size-5 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin" />
          <span>Simulating Network Latency • Hydrating Data Layer...</span>
        </div>
      ) : (
        <>
          {refreshing && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
              <div className="bg-white px-4 py-2.5 rounded shadow border border-slate-200 flex items-center gap-2 text-xs font-mono text-slate-600">
                <span className="size-3 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                <span>Syncing Datasets...</span>
              </div>
            </div>
          )}
          {activeModule === 'batch' && (
            <BatchDirectory 
              batches={batches} 
              swatches={swatches}
              onRefresh={() => refreshData(true)}
              onNavigate={handleNavigate}
              onResumeDraft={(batchId) => {
                setResumeBatchId(batchId);
                setActiveModule('logging');
              }}
            />
          )}
          {activeModule === 'all_swatches' && (
            <AllSwatchesStream 
              batches={batches} 
              swatches={swatches}
              onRefresh={() => refreshData(true)}
              onNavigate={handleNavigate}
            />
          )}
          {activeModule === 'logging' && (
            <CaptureSession 
              batches={batches}
              swatches={swatches}
              activeDefaults={activeDefaults} 
              resumeBatchId={resumeBatchId}
              onClearResumeBatchId={() => setResumeBatchId(null)}
              onRefresh={() => refreshData(true)}
              onNavigate={handleNavigate}
              viewerTheme={viewerTheme}
              setViewerTheme={setViewerTheme}
              showStagingQueue={showStagingQueue}
              setShowStagingQueue={setShowStagingQueue}
            />
          )}
        </>
      )}
    </main>
  );
}
