/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import DesktopInputTray from './DesktopInputTray';
import MobileInputTray from './MobileInputTray';

export default function InputTray(props) {
  const { formData } = props;

  const selectClass = "appearance-none w-full text-base bg-white hover:bg-slate-50 focus:bg-white rounded-md border border-slate-200 focus:outline-hidden focus:border-slate-400 text-slate-800 transition-all duration-150 font-sans cursor-pointer h-12 px-3 disabled:opacity-50 disabled:cursor-not-allowed md:text-xs md:bg-white md:hover:bg-white md:rounded md:h-8 md:py-0 md:pl-2 md:pr-8 md:text-slate-900 md:border-slate-300 md:hover:border-slate-400 disabled:md:bg-slate-100 disabled:md:text-slate-500 disabled:md:border-slate-200 md:placeholder:italic md:placeholder:text-[11px] md:placeholder:text-slate-600";
  const inputClass = "w-full text-base bg-white hover:bg-slate-50 focus:bg-white rounded-md border border-slate-200 focus:outline-hidden focus:border-slate-400 text-slate-800 transition-all duration-150 font-sans h-12 px-3 disabled:opacity-50 disabled:cursor-not-allowed md:text-xs md:bg-white md:hover:bg-white md:rounded md:h-8 md:py-0 md:px-2 md:text-slate-900 md:border-slate-300 md:hover:border-slate-400 disabled:md:bg-slate-100 disabled:md:text-slate-500 disabled:md:border-slate-200 md:placeholder:text-slate-600 md:placeholder:italic md:placeholder:text-[11px] disabled:md:placeholder:text-slate-400/70";

  const getCollapsedText = () => {
    const parts = [];
    if (formData.vendorName) parts.push(formData.vendorName);
    if (formData.structure) parts.push(formData.structure);
    if (formData.content) parts.push(formData.content);
    
    if (parts.length === 0) {
      return "Tap to set attribute parameters...";
    }
    return parts.join(' • ');
  };

  return (
    <>
      <DesktopInputTray 
        {...props} 
        selectClass={selectClass} 
        inputClass={inputClass} 
      />
      <MobileInputTray 
        {...props} 
        getCollapsedText={getCollapsedText} 
      />
    </>
  );
}
