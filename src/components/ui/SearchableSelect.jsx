import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SearchableSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Mobile view - standard select */}
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`md:hidden ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="md:hidden absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
        <ChevronDown className="size-3.5" />
      </div>

      {/* Desktop view - Searchable Combobox */}
      <div className="hidden md:block relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={isOpen ? searchTerm : value}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          placeholder={placeholder}
          className={`${className} ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
        />
        <div 
          className="absolute inset-y-0 right-0 w-8 flex items-center justify-center cursor-pointer text-slate-400"
          onMouseDown={(e) => {
            e.preventDefault();
            if (!disabled) {
                if (!isOpen) {
                  setIsOpen(true);
                  inputRef.current?.focus();
                } else {
                  setIsOpen(false);
                }
            }
          }}
        >
          <ChevronDown className="size-3.5" />
        </div>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            <div
              className="px-3 py-1.5 text-xs hover:bg-slate-50 cursor-pointer text-slate-600"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange('');
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              {placeholder}
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt}
                  className={`px-3 py-1.5 text-xs hover:bg-slate-50 cursor-pointer ${value === opt ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-slate-400 text-center">
                No matches found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
