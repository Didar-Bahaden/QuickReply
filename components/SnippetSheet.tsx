import React from 'react';
import { X, Check } from '@phosphor-icons/react';
import { getCategoryIcon } from '../lib/icons';
import { Snippet, Category } from '../lib/types';

interface SnippetSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingSnippet: Snippet | null;
  formTitle: string;
  setFormTitle: (val: string) => void;
  formCategory: string;
  setFormCategory: (val: string) => void;
  formBody: string;
  setFormBody: (val: string) => void;
  categories: Category[];
  onSave: (e: React.FormEvent) => void;
}

export function SnippetSheet({
  isOpen,
  onClose,
  editingSnippet,
  formTitle,
  setFormTitle,
  formCategory,
  setFormCategory,
  formBody,
  setFormBody,
  categories,
  onSave
}: SnippetSheetProps) {
  return (
    <>
      {/* BOTTOM SHEET BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0F172A]/40 dark:bg-black/60 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* BOTTOM SHEET ELEMENT */}
      <div
        className={`absolute z-60 bg-white dark:bg-[#1E293B] flex flex-col overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bottom-0 left-0 right-0 rounded-t-3xl pt-2.5 px-5 pb-8 max-h-[90vh] shadow-[0_-20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.3)] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:w-[460px] lg:rounded-2xl lg:p-6 lg:max-h-[85vh] ${
          isOpen
            ? 'translate-y-0 lg:-translate-y-1/2 opacity-100 pointer-events-auto scale-100'
            : 'translate-y-full lg:-translate-y-[40%] opacity-0 pointer-events-none scale-95'
        }`}
      >
        <div
          className="w-10 h-1.5 bg-[#E5E7EB] dark:bg-[#334155] rounded-full mx-auto mb-5 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors lg:hidden"
          onClick={onClose}
        />

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0">
            {editingSnippet ? 'Edit Snippet' : 'New Snippet'}
          </h2>
          <button
            onClick={onClose}
            className="bg-[#F3F4F6] dark:bg-[#334155] w-8 h-8 rounded-full flex items-center justify-center text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors"
          >
            <X weight="bold" size={14} />
          </button>
        </div>

        <form onSubmit={onSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#4B5563] dark:text-[#D1D5DB]">
              Snippet Title
            </label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Return Policy Overview"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[15px] text-[#1F2937] dark:text-[#F3F4F6] outline-none focus:border-[#FF4D3D] focus:ring-[3px] focus:ring-[#FF4D3D]/10 transition-colors shadow-sm font-['Nunito_Sans',sans-serif]"
            />
            <span className={`text-[11px] font-bold mt-0.5 text-right block ${
              formTitle.length >= 90 ? 'text-[#FF4D3D]' : 'text-gray-400 dark:text-gray-500'
            }`}>{formTitle.length}/100</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#4B5563] dark:text-[#D1D5DB]">
              Category
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {categories.map((category) => {
                const isSelected = formCategory === category.name;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setFormCategory(category.name)}
                    className={`group/cat-btn flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#FF4D3D] border-[#FF4D3D] text-white shadow-md shadow-coral-400/20'
                        : 'border-[#E5E7EB] dark:border-[#334155] text-[#4B5563] dark:text-[#D1D5DB] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#334155] shadow-sm'
                    }`}
                  >
                    {getCategoryIcon(
                      category.emoji,
                      category.name,
                      isSelected 
                        ? "text-white" 
                        : "text-gray-400 dark:text-gray-500 group-hover/cat-btn:text-[#FF4D3D] transition-colors duration-200",
                      16
                    )}
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-bold text-[#4B5563] dark:text-[#D1D5DB]">
                Message Text
              </label>
              <span className="text-[11px] text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                <span className="font-black tracking-tight">{'{·}'}</span>
                use <code className="bg-amber-50 dark:bg-amber-500/10 px-1 rounded text-[10px] border border-amber-200 dark:border-amber-500/20 font-black">{'{name}'}</code> for dynamic values
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={2000}
              placeholder="Paste or write the response sent to customers..."
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[15px] text-[#1F2937] dark:text-[#F3F4F6] outline-none focus:border-[#FF4D3D] focus:ring-[3px] focus:ring-[#FF4D3D]/10 transition-colors shadow-sm resize-none leading-relaxed font-['Nunito_Sans',sans-serif]"
            />
            <span className={`text-[11px] font-bold mt-0.5 text-right block ${
              formBody.length >= 1800 ? 'text-[#FF4D3D]' : 'text-gray-400 dark:text-gray-500'
            }`}>{formBody.length}/2000</span>
          </div>

          <button
            type="submit"
            disabled={!formTitle.trim() || !formBody.trim()}
            className={`mt-2 p-[14px] rounded-xl font-extrabold text-[15px] flex items-center justify-center gap-2 transition-all ${
              !formTitle.trim() || !formBody.trim()
                ? 'bg-[#F3F4F6] dark:bg-[#334155] text-[#9CA3AF] dark:text-[#6B7280] pointer-events-none'
                : 'bg-[#FF4D3D] text-white shadow-[0_6px_16px_rgba(255,77,61,0.25)] hover:bg-[#E63E2E] active:scale-[0.98]'
            }`}
          >
            <Check weight="bold" size={18} />
            Save Snippet
          </button>
        </form>
      </div>
    </>
  );
}
