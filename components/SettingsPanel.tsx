import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LinkedinLogo, DownloadSimple, UploadSimple, Link, CaretRight } from '@phosphor-icons/react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShareLink: () => void;
  onOpenCategoryManager: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function SettingsPanel({
  isOpen,
  onClose,
  onExport,
  onImport,
  onShareLink,
  onOpenCategoryManager,
  fileInputRef
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[100] flex justify-end lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ damping: 25, stiffness: 200 }}
            className="w-4/5 max-w-[320px] h-full bg-white dark:bg-[#111827] z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-[#EEEDF2] dark:border-[#1F2937] flex justify-between items-center bg-[#F9FAFB] dark:bg-[#0B0F19]">
              <h2 className="text-xl font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#1F2937] text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X weight="bold" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pb-10 flex flex-col gap-8">
              <section>
                <h3 className="text-xs tracking-wider text-gray-400 dark:text-gray-500 uppercase font-bold mb-3">
                  Meet The Developer
                </h3>
                <div className="bg-[#F9FAFB] dark:bg-[#1F2937] rounded-xl p-4 border border-[#EEEDF2] dark:border-gray-800">
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

              <section>
                <h3 className="text-xs tracking-wider text-gray-400 dark:text-gray-500 uppercase font-bold mb-3">
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

              <section>
                <h3 className="text-xs tracking-wider text-gray-400 dark:text-gray-500 uppercase font-bold mb-3">
                  Data Management
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={onExport}
                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-xl hover:bg-gray-50 dark:hover:bg-[#0F172A] transition-all shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 text-[14px] font-bold text-[#1F2937] dark:text-[#F3F4F6]">
                      <DownloadSimple weight="duotone" size={20} className="text-[#3B82F6] dark:text-[#60A5FA]" />{' '}
                      Export Backup
                    </div>
                  </button>
                  <label className="w-full flex items-center justify-between p-3 bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-xl hover:bg-gray-50 dark:hover:bg-[#0F172A] transition-all shadow-sm cursor-pointer active:scale-[0.98]">
                    <div className="flex items-center gap-3 text-[14px] font-bold text-[#1F2937] dark:text-[#F3F4F6]">
                      <UploadSimple weight="duotone" size={20} className="text-[#10B981] dark:text-[#34D399]" />{' '}
                      Import Backup
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImport}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </label>
                  <button
                    onClick={onShareLink}
                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-xl hover:bg-gray-50 dark:hover:bg-[#0F172A] transition-all shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 text-[14px] font-bold text-[#1F2937] dark:text-[#F3F4F6]">
                      <Link weight="duotone" size={20} className="text-[#8B5CF6] dark:text-[#A78BFA]" />{' '}
                      Copy Shareable Link
                    </div>
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-xs tracking-wider text-gray-400 dark:text-gray-500 uppercase font-bold mb-3">
                  Preferences
                </h3>
                <button
                  onClick={onOpenCategoryManager}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-xl hover:bg-gray-50 dark:hover:bg-[#0F172A] active:scale-[0.98] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-lg shadow-sm border border-gray-100 dark:border-[#1F2937]">
                      🏷️
                    </div>
                    <span className="font-extrabold text-[#1F2937] dark:text-[#F3F4F6] text-[15px]">
                      Manage Categories
                    </span>
                  </div>
                  <CaretRight weight="bold" size={20} className="text-gray-400" />
                </button>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
