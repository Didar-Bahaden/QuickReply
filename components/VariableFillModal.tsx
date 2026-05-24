import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Info } from '@phosphor-icons/react';
import { Snippet } from '../lib/types';

interface VariableFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippet: Snippet | null;
  variableKeys: string[];
  onCopyFilled: (filledText: string, id: number) => void;
}

export function VariableFillModal({
  isOpen,
  onClose,
  snippet,
  variableKeys,
  onCopyFilled
}: VariableFillModalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    variableKeys.forEach(k => {
      initialValues[k] = '';
    });
    return initialValues;
  });
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen || !snippet) return null;

  const handleInputChange = (key: string, val: string) => {
    setValues(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Compute live preview of the body text
  let previewText = snippet.body;
  variableKeys.forEach(key => {
    const val = values[key] || `{${key}}`;
    previewText = previewText.replaceAll(`{${key}}`, val);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalFilledText = snippet.body;
    variableKeys.forEach(key => {
      const val = values[key] || '';
      finalFilledText = finalFilledText.replaceAll(`{${key}}`, val);
    });
    onCopyFilled(finalFilledText, snippet.id);
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0F172A]/40 dark:bg-black/60 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* DIALOG BODY */}
      <div
        className={`absolute z-60 bg-white dark:bg-[#1E293B] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bottom-0 left-0 right-0 rounded-t-3xl pt-4 px-5 pb-8 max-h-[90vh] shadow-[0_-20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.3)] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[460px] lg:rounded-2xl lg:p-6 ${
          isOpen
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : 'translate-y-full lg:-translate-y-[40%] opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Mobile Pull Indicator */}
        <div
          className="w-10 h-1.5 bg-[#E5E7EB] dark:bg-[#334155] rounded-full mx-auto mb-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors lg:hidden"
          onClick={onClose}
        />

        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-black text-[#1F2937] dark:text-[#F3F4F6] m-0">
              Fill Placeholders
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 m-0 mt-0.5 leading-tight">
              Snippet: {snippet.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-[#F3F4F6] dark:bg-[#334155] w-8 h-8 rounded-full flex items-center justify-center text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors"
          >
            <X weight="bold" size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dynamic input fields */}
          <div className="flex flex-col gap-3.5 max-h-[30vh] overflow-y-auto no-scrollbar pr-0.5">
            {variableKeys.map((key, idx) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#4B5563] dark:text-[#D1D5DB] capitalize">
                  {key.replace(/[-_]/g, ' ')}
                </label>
                <input
                  type="text"
                  required
                  ref={idx === 0 ? firstInputRef : null}
                  placeholder={`Enter value for ${key.toLowerCase()}...`}
                  value={values[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[14px] text-[#1F2937] dark:text-[#F3F4F6] outline-none focus:border-[#FF4D3D] focus:ring-[3px] focus:ring-[#FF4D3D]/10 transition-colors shadow-sm font-['Nunito_Sans',sans-serif]"
                />
              </div>
            ))}
          </div>

          {/* Live Preview Block */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Info weight="bold" size={12} /> Live Preview
            </span>
            <div className="bg-gray-50 dark:bg-[#0F172A] border border-[#EEEDF2] dark:border-[#334155] rounded-xl p-3.5 max-h-[120px] overflow-y-auto no-scrollbar">
              <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed m-0 break-words font-['Nunito_Sans',sans-serif]">
                {previewText}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 p-[13px] bg-[#FF4D3D] text-white rounded-xl font-extrabold text-[14.5px] shadow-[0_6px_16px_rgba(255,77,61,0.25)] hover:bg-[#E63E2E] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Copy weight="bold" size={16} />
            Copy Filled Text
          </button>
        </form>
      </div>
    </>
  );
}
