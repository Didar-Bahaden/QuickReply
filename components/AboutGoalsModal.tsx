import React from 'react';
import { X, LinkedinLogo } from '@phosphor-icons/react';

interface AboutGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutGoalsModal({ isOpen, onClose }: AboutGoalsModalProps) {
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0F172A]/40 dark:bg-black/60 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* MODAL CONTAINER */}
      <div
        className={`absolute z-60 bg-white dark:bg-[#1E293B] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bottom-0 left-0 right-0 rounded-t-3xl pt-4 px-5 pb-8 max-h-[85vh] shadow-[0_-20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.3)] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[460px] lg:rounded-2xl lg:p-6 ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto scale-100'
            : 'translate-y-full lg:-translate-y-[40%] opacity-0 pointer-events-none scale-95'
        }`}
      >
        {/* Mobile Pull indicator */}
        <div
          className="w-10 h-1.5 bg-[#E5E7EB] dark:bg-[#334155] rounded-full mx-auto mb-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors lg:hidden"
          onClick={onClose}
        />

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0 flex items-center gap-2">
            <span>ℹ️</span> About QuickReply
          </h2>
          <button
            onClick={onClose}
            className="bg-[#F3F4F6] dark:bg-[#334155] w-8 h-8 rounded-full flex items-center justify-center text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors"
          >
            <X weight="bold" size={14} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          {/* About Us Section */}
          <section>
            <h3 className="text-xs tracking-wider text-gray-400 dark:text-gray-500 uppercase font-bold mb-2.5">
              Meet the Developer
            </h3>
            <div className="bg-[#F9FAFB] dark:bg-[#0F172A]/50 rounded-xl p-4 border border-[#EEEDF2] dark:border-[#334155]">
              <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed m-0 mb-3 font-['Nunito_Sans',sans-serif]">
                I am <strong className="text-[#1F2937] dark:text-white font-extrabold">Didar</strong>, an AI assisted web developer passionate about building simple, performant tools.
              </p>
              <a
                href="https://www.linkedin.com/in/didar-bahaden"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0A66C2] dark:text-[#3B82F6] hover:underline"
              >
                <LinkedinLogo weight="duotone" size={18} />
                LinkedIn Profile
              </a>
            </div>
          </section>

          {/* Our Goal Section */}
          <section>
            <h3 className="text-xs tracking-wider text-gray-400 dark:text-gray-500 uppercase font-bold mb-2.5">
              Our Goal
            </h3>
            <div className="bg-[#FFF4F2] dark:bg-[#FF4D3D]/10 rounded-xl p-4 border border-[#FF4D3D]/20">
              <p className="text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed m-0 font-['Nunito_Sans',sans-serif]">
                <strong className="text-[#FF4D3D] font-extrabold block mb-1">Empower your workflow.</strong>
                QuickReply is designed for solopreneurs and online sellers who want to centralize their most frequent customer responses.
                Copy text instantly, organize by custom categories, and close conversations faster.
              </p>
            </div>
          </section>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 p-3 bg-[#FF4D3D] text-white rounded-xl font-extrabold text-[14px] shadow-[0_6px_16px_rgba(255,77,61,0.25)] hover:bg-[#E63E2E] active:scale-[0.98] transition-all flex items-center justify-center"
        >
          Got it, Thanks!
        </button>
      </div>
    </>
  );
}
