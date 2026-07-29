import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Layers, Check, X } from 'lucide-react';
import Button from '../../components/ui/Button';

/* =========================================================================
   1. COMPACT ROW (FOR SPLIT / COLLAPSED VIEW)
   ========================================================================= */
function EnquiryCompactRow({ enquiry, isSelected, activeTab, onSelectEnquiry }) {
  const line1Value = enquiry.customer && enquiry.customer.trim() !== '' 
    ? enquiry.customer 
    : enquiry.phone;

  return (
    <tr
      onClick={() => onSelectEnquiry && onSelectEnquiry(enquiry.id)}
      className={`cursor-pointer transition-all text-xs text-slate-700 ${
        isSelected
          ? 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 font-medium'
          : 'hover:bg-slate-50/60'
      }`}
    >
      <td className="py-1.5 px-3">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="font-bold text-slate-900 truncate" title={line1Value}>
            {line1Value}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono mt-0.5 select-all truncate">
            <span className="truncate font-bold text-slate-700">{enquiry.id}</span>
            <span className="text-slate-300 font-sans font-normal">•</span>
            <span>{enquiry.date}</span>
            <span className="text-slate-300 font-sans font-normal">•</span>
            {activeTab === 'past' ? (
              (() => {
                const outcomeVal =
                  enquiry.outcome ||
                  enquiry.closedStatus ||
                  (enquiry.notes?.toLowerCase().includes('cancel') ? 'Dropped' : 'Converted');
                const isConverted = outcomeVal.toLowerCase() === 'converted';
                return isConverted ? (
                  <span className="inline-flex items-center justify-center size-3 rounded-xs bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0" title="Converted">
                    <Check className="size-2.5 text-emerald-600 stroke-[3]" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center size-3 rounded-xs bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0" title="Dropped">
                    <X className="size-2.5 text-rose-600 stroke-[3]" />
                  </span>
                );
              })()
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Layers className="size-2.5 text-slate-500 shrink-0" />
                <span>{enquiry.swatchCount}</span>
              </span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================================
   2. COLLAPSED / SPLIT PANE GRID VIEW
   ========================================================================= */
function EnquiriesSplitGrid({
  paginatedEnquiries,
  selectedEnquiryId,
  onSelectEnquiry,
  activeTab,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages
}) {
  return (
    <div className="hidden md:flex flex-col flex-1 overflow-hidden bg-white border-b border-slate-200/80 shadow-2xs w-full h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full border-collapse text-left table-fixed">
          <tbody className="divide-y divide-slate-100">
            {paginatedEnquiries.map((enquiry) => (
              <EnquiryCompactRow
                key={enquiry.id}
                enquiry={enquiry}
                isSelected={selectedEnquiryId === enquiry.id}
                activeTab={activeTab}
                onSelectEnquiry={onSelectEnquiry}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="shrink-0 flex items-center justify-between border-t border-slate-100 px-2.5 py-1.5 bg-slate-50/50 text-[10px] text-slate-500 font-medium select-none w-full">
          <div className="flex items-center gap-1.5">
            <span>
              {startIndex + 1}–{endIndex} of {totalItems}
            </span>
            <span className="text-slate-300">•</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-slate-600 rounded-sm px-1 py-0.5 outline-none cursor-pointer hover:bg-slate-50 transition-colors text-[9px] font-bold"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-3" />
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   3. FULL WIDTH GRID TABLE HEADER
   ========================================================================= */
function EnquiryGridHeader({ handleSort, activeTab, getSortIcon }) {
  return (
    <thead>
      <tr className="sticky top-0 z-10 h-6 bg-slate-50/90 backdrop-blur-xs border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
        <th
          onClick={() => handleSort('id')}
          className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${
            activeTab === 'past' ? 'w-[12%]' : 'w-[15%]'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span>ID</span>
            {getSortIcon('id')}
          </div>
        </th>

        <th
          onClick={() => handleSort('date')}
          className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${
            activeTab === 'past' ? 'w-[13%]' : 'w-[15%]'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span>Date</span>
            {getSortIcon('date')}
          </div>
        </th>

        <th
          onClick={() => handleSort('phone')}
          className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${
            activeTab === 'past' ? 'w-[17%]' : 'w-[20%]'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span>Phone</span>
            {getSortIcon('phone')}
          </div>
        </th>

        <th
          onClick={() => handleSort('customer')}
          className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${
            activeTab === 'past' ? 'w-[23%]' : 'w-[25%]'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span>Customer</span>
            {getSortIcon('customer')}
          </div>
        </th>

        <th
          onClick={() => handleSort('swatches')}
          className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${
            activeTab === 'past' ? 'w-[11%]' : 'w-[12%]'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span>Swatches</span>
            {getSortIcon('swatches')}
          </div>
        </th>

        <th
          onClick={() => handleSort('am')}
          className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${
            activeTab === 'past' ? 'w-[12%]' : 'w-[13%]'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span>AM</span>
            {getSortIcon('am')}
          </div>
        </th>

        {activeTab === 'past' && (
          <th
            onClick={() => handleSort('status')}
            className="sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group w-[12%]"
          >
            <div className="flex items-center gap-1 font-bold">
              <span>Status</span>
              {getSortIcon('status')}
            </div>
          </th>
        )}
      </tr>
    </thead>
  );
}

/* =========================================================================
   4. FULL WIDTH GRID TABLE ROW
   ========================================================================= */
function EnquiryGridRow({ enquiry, isSelected, onSelectEnquiry, activeTab }) {
  return (
    <tr
      onClick={() => onSelectEnquiry && onSelectEnquiry(enquiry.id)}
      className={`h-6 cursor-pointer transition-all text-xs text-slate-700 ${
        isSelected
          ? 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 font-medium'
          : 'hover:bg-slate-50/60'
      }`}
    >
      <td className="py-0.5 px-3 font-mono font-bold text-slate-900 select-all truncate">
        {enquiry.id}
      </td>
      <td className="py-0.5 px-3 font-mono text-slate-600 truncate">
        {enquiry.date}
      </td>
      <td className="py-0.5 px-3 font-mono text-slate-700 truncate">
        {enquiry.phone || '-'}
      </td>
      <td className="py-0.5 px-3 font-semibold text-slate-900 truncate max-w-xs" title={enquiry.customer || '-'}>
        {enquiry.customer && enquiry.customer.trim() !== '' ? enquiry.customer : '-'}
      </td>
      <td className="py-0.5 px-3 font-mono text-slate-800">
        {enquiry.swatchCount}
      </td>
      <td className="py-0.5 px-3 font-medium text-slate-700 truncate">
        {enquiry.am && enquiry.am !== 'Unassigned' && enquiry.am.trim() !== '' ? enquiry.am : '-'}
      </td>
      {activeTab === 'past' && (
        <td className="py-0.5 px-3 font-semibold text-xs truncate">
          {(() => {
            const outcomeVal =
              enquiry.outcome ||
              enquiry.closedStatus ||
              (enquiry.notes?.toLowerCase().includes('cancel') ? 'Dropped' : 'Converted');
            const isConverted = outcomeVal.toLowerCase() === 'converted';
            return (
              <span
                className={`inline-flex items-center px-1.5 py-0.2 rounded-xs text-[10px] font-bold font-mono tracking-tight ${
                  isConverted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                }`}
              >
                {isConverted ? 'Converted' : 'Dropped'}
              </span>
            );
          })()}
        </td>
      )}
    </tr>
  );
}

/* =========================================================================
   5. FULL WIDTH GRID PAGINATION CONTROLS
   ========================================================================= */
function EnquiryPagination({
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages
}) {
  if (totalItems === 0) return null;

  return (
    <div className="shrink-0 flex items-center justify-between border-t border-slate-100 px-4 py-2 bg-slate-50/50 text-xs text-slate-500 font-medium select-none w-full">
      <div className="flex items-center gap-4">
        <span>
          Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">{endIndex}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalItems}</span> enquiries
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 text-slate-600 rounded-sm px-1.5 py-0.5 text-xs outline-none cursor-pointer hover:bg-slate-50 transition-colors font-medium"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span>
          Page <span className="font-semibold text-slate-700">{currentPage}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalPages}</span>
        </span>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. FULL WIDTH GRID CONTAINER
   ========================================================================= */
function EnquiriesFullGrid({
  paginatedEnquiries,
  selectedEnquiryId,
  onSelectEnquiry,
  activeTab,
  handleSort,
  getSortIcon,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages
}) {
  return (
    <div className="hidden md:flex flex-col flex-1 overflow-hidden bg-white border-y border-slate-200/80 shadow-2xs w-full h-full">
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse text-left table-fixed">
          <EnquiryGridHeader
            handleSort={handleSort}
            activeTab={activeTab}
            getSortIcon={getSortIcon}
          />
          <tbody className="divide-y divide-slate-100">
            {paginatedEnquiries.map((enquiry) => (
              <EnquiryGridRow
                key={enquiry.id}
                enquiry={enquiry}
                isSelected={selectedEnquiryId === enquiry.id}
                onSelectEnquiry={onSelectEnquiry}
                activeTab={activeTab}
              />
            ))}
          </tbody>
        </table>
      </div>

      <EnquiryPagination
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

/* =========================================================================
   7. MAIN EXPORT: ENQUIRIES DESKTOP GRID
   ========================================================================= */
export default function EnquiriesDesktopGrid({
  sortedEnquiries,
  selectedEnquiryId,
  onSelectEnquiry,
  sortField,
  sortDirection,
  handleSort,
  activeTab
}) {
  const isCollapsed = !!selectedEnquiryId;
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedEnquiries.length, isCollapsed, itemsPerPage]);

  const totalItems = sortedEnquiries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedEnquiries = sortedEnquiries.slice(startIndex, endIndex);

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-slate-400 group-hover:text-slate-600 transition-all ml-1 shrink-0" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="size-3 text-indigo-600 font-bold ml-1 shrink-0 animate-in fade-in zoom-in-90 duration-150" />;
    }
    return <ArrowDown className="size-3 text-indigo-600 font-bold ml-1 shrink-0 animate-in fade-in zoom-in-90 duration-150" />;
  };

  if (isCollapsed) {
    return (
      <EnquiriesSplitGrid
        paginatedEnquiries={paginatedEnquiries}
        selectedEnquiryId={selectedEnquiryId}
        onSelectEnquiry={onSelectEnquiry}
        activeTab={activeTab}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    );
  }

  return (
    <EnquiriesFullGrid
      paginatedEnquiries={paginatedEnquiries}
      selectedEnquiryId={selectedEnquiryId}
      onSelectEnquiry={onSelectEnquiry}
      activeTab={activeTab}
      handleSort={handleSort}
      getSortIcon={getSortIcon}
      totalItems={totalItems}
      startIndex={startIndex}
      endIndex={endIndex}
      itemsPerPage={itemsPerPage}
      setItemsPerPage={setItemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
}

