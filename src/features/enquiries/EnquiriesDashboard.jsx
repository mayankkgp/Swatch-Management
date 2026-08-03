import React, { useState, useEffect, useMemo } from 'react';
import { fetchEnquiries, saveEnquiries } from '../../services/enquiryServices';
import { fetchBatches, fetchSwatches } from '../../services/swatchServices';
import BulkEditPanel from '../batches/BulkEditPanel';
import EnquiriesHeader from './EnquiriesHeader';
import EnquiriesDesktopGrid from './EnquiriesDesktopGrid';
import EnquiryDetailsView from './EnquiryDetailsView';
import { Folder, X } from 'lucide-react';
import Button from '../../components/ui/Button';

/* =========================================================================
   1. DESKTOP ACTIVE FILTER PILLS STRIP
   ========================================================================= */
function EnquiriesActiveFilterPills({ activePills }) {
  if (!activePills || activePills.length === 0) return null;

  return (
    <div className="hidden md:flex bg-white border-b border-slate-200 py-1 px-3 items-center justify-between gap-2 text-xs select-none min-h-[32px] w-full shrink-0">
      <div className="flex flex-wrap items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
        {activePills.map((pill) => (
          <div
            key={pill.id}
            className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-xs py-[2px] px-1.5 text-[10px] font-medium transition-all hover:bg-slate-150 animate-in fade-in-50 duration-100 shrink-0 select-none"
          >
            <span>{pill.label}</span>
            <button
              onClick={() => pill.onDismiss()}
              className="p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center shrink-0"
              aria-label={`Remove ${pill.label}`}
            >
              <X className="size-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   2. ENQUIRIES GRID BODY CONTENT
   ========================================================================= */
function EnquiriesGridContent({
  loading,
  sortedEnquiries,
  selectedEnquiryId,
  setSelectedEnquiryId,
  sortField,
  sortDirection,
  handleSort,
  activeTab,
  resetFilters
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 relative p-0 overflow-hidden">
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
          <span className="size-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-xs font-semibold">Loading enquiries...</span>
        </div>
      ) : sortedEnquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4 shadow-inner">
            <Folder className="size-10" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Enquiries Located</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting search rules or filter selections.</p>
          <Button
            onClick={resetFilters}
            className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded text-xs cursor-pointer hover:bg-slate-50"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <EnquiriesDesktopGrid
          sortedEnquiries={sortedEnquiries}
          selectedEnquiryId={selectedEnquiryId}
          onSelectEnquiry={setSelectedEnquiryId}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}

/* =========================================================================
   3. MAIN EXPORT: ENQUIRIES DASHBOARD
   ========================================================================= */
export default function EnquiriesDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allSwatches, setAllSwatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [viewingSwatchId, setViewingSwatchId] = useState(null);

  // Status Toggles: 'pending' (Default) | 'in_progress' | 'past'
  const [activeTab, setActiveTab] = useState('pending');

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedAMs, setSelectedAMs] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  // Sort state
  const [sortField, setSortField] = useState('id'); // 'id' | 'date' | 'phone' | 'customer' | 'swatches' | 'am'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [enqData, batchData, swatchData] = await Promise.all([
          fetchEnquiries(),
          fetchBatches(),
          fetchSwatches()
        ]);
        if (isMounted) {
          setEnquiries(enqData || []);
          setBatches(batchData || []);
          setAllSwatches(swatchData || []);
        }
      } catch (err) {
        console.error('[ENQUIRIES] Failed to fetch enquiries or swatch data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset viewingSwatchId when selectedEnquiryId changes
  useEffect(() => {
    setViewingSwatchId(null);
  }, [selectedEnquiryId]);

  const customerOptions = useMemo(() => {
    const set = new Set();
    enquiries.forEach((e) => {
      if (e.customer && e.customer.trim() !== '' && e.customer.toLowerCase() !== 'unassigned') {
        set.add(e.customer.trim());
      }
    });
    const list = Array.from(set).sort((a, b) => a.localeCompare(b));
    return ['Unassigned', ...list];
  }, [enquiries]);

  const amOptions = useMemo(() => {
    const set = new Set();
    enquiries.forEach((e) => {
      if (e.am && e.am.trim() !== '' && e.am.toLowerCase() !== 'unassigned') {
        set.add(e.am.trim());
      }
    });
    const list = Array.from(set).sort((a, b) => a.localeCompare(b));
    return ['Unassigned', ...list];
  }, [enquiries]);

  const parseDate = (str) => {
    if (!str) return 0;
    if (str.includes('-') && str.split('-')[0].length === 4) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d).getTime();
    }
    const parts = str.split(/[\/\-]/);
    if (parts.length !== 3) return 0;
    let [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
    if (year < 100) year = 2000 + year;
    return new Date(year, month - 1, day).getTime();
  };

  // 1. Filter by Status Tab
  let filtered = enquiries.filter((e) => e.status === activeTab);

  // 2. Filter by Search Term (ID, Customer, Phone, AM, Notes)
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.id.toLowerCase().includes(term) ||
        (e.customer && e.customer.toLowerCase().includes(term)) ||
        (e.phone && e.phone.toLowerCase().includes(term)) ||
        (e.am && e.am.toLowerCase().includes(term)) ||
        (e.notes && e.notes.toLowerCase().includes(term))
    );
  }

  // 3. Filter by Customer
  if (selectedCustomers.length > 0) {
    filtered = filtered.filter((e) => {
      const isUnassignedCust = !e.customer || e.customer.trim() === '' || e.customer.toLowerCase() === 'unassigned';
      if (isUnassignedCust && selectedCustomers.includes('Unassigned')) {
        return true;
      }
      return e.customer && selectedCustomers.includes(e.customer.trim());
    });
  }

  // 4. Filter by Account Manager (AM)
  if (selectedAMs.length > 0) {
    filtered = filtered.filter((e) => {
      const isUnassignedAM = !e.am || e.am.trim() === '' || e.am.toLowerCase() === 'unassigned';
      if (isUnassignedAM && selectedAMs.includes('Unassigned')) {
        return true;
      }
      return e.am && selectedAMs.includes(e.am.trim());
    });
  }

  // 5. Filter by Date Range
  if (fromDate || toDate) {
    filtered = filtered.filter((e) => {
      if (!e.date) return false;
      const t = parseDate(e.date);
      if (fromDate) {
        const fromTime = parseDate(fromDate);
        if (fromTime && t < fromTime) return false;
      }
      if (toDate) {
        const toTime = parseDate(toDate) + 86400000 - 1;
        if (toTime && t > toTime) return false;
      }
      return true;
    });
  }

  // 6. Filter by Status Outcome (Only for 'Past' tab)
  if (activeTab === 'past' && selectedOutcomes.length > 0) {
    filtered = filtered.filter((e) => {
      const outcomeVal = (e.outcome || e.closedStatus || (e.notes?.toLowerCase().includes('cancel') ? 'Dropped' : 'Converted'));
      return selectedOutcomes.some((o) => o.toLowerCase() === outcomeVal.toLowerCase());
    });
  }

  // Active Pills for Desktop Filter Strip
  const activePills = [];

  if (selectedCustomers && selectedCustomers.length > 0) {
    selectedCustomers.forEach((cust) => {
      activePills.push({
        id: `customer-${cust}`,
        label: `Customer: ${cust}`,
        onDismiss: () => setSelectedCustomers(selectedCustomers.filter((c) => c !== cust))
      });
    });
  }

  if (selectedAMs && selectedAMs.length > 0) {
    selectedAMs.forEach((am) => {
      activePills.push({
        id: `am-${am}`,
        label: `AM: ${am}`,
        onDismiss: () => setSelectedAMs(selectedAMs.filter((a) => a !== am))
      });
    });
  }

  if (fromDate || toDate) {
    activePills.push({
      id: 'date-range',
      label: `Date: ${fromDate || 'Any'} to ${toDate || 'Any'}`,
      onDismiss: () => {
        setFromDate('');
        setToDate('');
      }
    });
  }

  if (activeTab === 'past' && selectedOutcomes && selectedOutcomes.length > 0) {
    selectedOutcomes.forEach((outcome) => {
      activePills.push({
        id: `status-${outcome}`,
        label: `Status: ${outcome}`,
        onDismiss: () => setSelectedOutcomes(selectedOutcomes.filter((o) => o !== outcome))
      });
    });
  }

  // Sorting logic
  const sortedEnquiries = [...filtered].sort((a, b) => {
    let valA, valB;
    if (sortField === 'id') {
      valA = a.id.toLowerCase();
      valB = b.id.toLowerCase();
    } else if (sortField === 'date') {
      valA = parseDate(a.date);
      valB = parseDate(b.date);
    } else if (sortField === 'phone') {
      valA = (a.phone || '').toLowerCase();
      valB = (b.phone || '').toLowerCase();
    } else if (sortField === 'customer') {
      valA = (a.customer || '').toLowerCase();
      valB = (b.customer || '').toLowerCase();
    } else if (sortField === 'swatches') {
      valA = a.swatchCount || 0;
      valB = b.swatchCount || 0;
    } else if (sortField === 'am') {
      valA = (a.am || '').toLowerCase();
      valB = (b.am || '').toLowerCase();
    } else if (sortField === 'outcome' || sortField === 'status') {
      valA = (a.outcome || a.closedStatus || (a.notes?.toLowerCase().includes('cancel') ? 'Dropped' : 'Converted')).toLowerCase();
      valB = (b.outcome || b.closedStatus || (b.notes?.toLowerCase().includes('cancel') ? 'Dropped' : 'Converted')).toLowerCase();
    } else {
      valA = 0;
      valB = 0;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCustomers([]);
    setSelectedAMs([]);
    setFromDate('');
    setToDate('');
    setSelectedOutcomes([]);
    setSortField('id');
    setSortDirection('asc');
  };

  const handleUpdateEnquiry = async (updatedEnquiry) => {
    const updatedList = enquiries.map((e) =>
      e.id === updatedEnquiry.id ? { ...e, ...updatedEnquiry } : e
    );
    setEnquiries(updatedList);
    try {
      await saveEnquiries(updatedList);
    } catch (err) {
      console.error('[ENQUIRIES] Failed to persist enquiry update:', err);
    }
  };

  const selectedEnquiry = enquiries.find((e) => e.id === selectedEnquiryId);

  return (
    <div
      id="enquiries-directory-workspace"
      className="flex-1 flex flex-col bg-slate-50 text-slate-800 h-full overflow-hidden select-none"
    >
      {/* Grid container: Split View when selectedEnquiryId is active, Full Width when null */}
      <div
        className={`flex-1 min-h-0 overflow-hidden ${
          selectedEnquiryId
            ? 'grid grid-cols-1 md:grid-cols-[210px_1fr] gap-0 md:gap-3'
            : 'flex flex-col'
        }`}
      >
        {/* Left Pane / Container */}
        <div
          className={`flex flex-col h-full relative z-30 ${
            selectedEnquiryId
              ? 'hidden md:flex border-r border-slate-200/80 bg-white p-0'
              : 'p-0'
          }`}
        >
          {selectedEnquiryId && viewingSwatchId ? (
            <BulkEditPanel
              selectedCount={1}
              editingSwatch={allSwatches.find((s) => s.id === viewingSwatchId)}
              isViewOnly={true}
              hideEditCTA={true}
              onDiscard={() => setViewingSwatchId(null)}
              batches={batches}
            />
          ) : (
            <>
              {/* Subheader / Workspace Controls */}
              <EnquiriesHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showFilterBar={showFilterBar}
                setShowFilterBar={setShowFilterBar}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSplitView={!!selectedEnquiryId}
                customerOptions={customerOptions}
                selectedCustomers={selectedCustomers}
                setSelectedCustomers={setSelectedCustomers}
                amOptions={amOptions}
                selectedAMs={selectedAMs}
                setSelectedAMs={setSelectedAMs}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                selectedOutcomes={selectedOutcomes}
                setSelectedOutcomes={setSelectedOutcomes}
                resetFilters={resetFilters}
              />

              {/* Desktop Active Filter Bar */}
              <EnquiriesActiveFilterPills activePills={activePills} />

              {/* Data Grid Body */}
              <EnquiriesGridContent
                loading={loading}
                sortedEnquiries={sortedEnquiries}
                selectedEnquiryId={selectedEnquiryId}
                setSelectedEnquiryId={setSelectedEnquiryId}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                activeTab={activeTab}
                resetFilters={resetFilters}
              />
            </>
          )}
        </div>

        {/* Right Pane Contextual Detail View (Active when row selected) */}
        {selectedEnquiryId && (
          <div className="flex-1 h-full overflow-hidden bg-slate-50">
            <EnquiryDetailsView
              key={selectedEnquiryId}
              enquiry={selectedEnquiry}
              onClose={() => setSelectedEnquiryId(null)}
              onUpdateEnquiry={handleUpdateEnquiry}
              viewingSwatchId={viewingSwatchId}
              onViewSwatch={(swatchId) => setViewingSwatchId(swatchId)}
              allSwatches={allSwatches}
            />
          </div>
        )}
      </div>
    </div>
  );
}

