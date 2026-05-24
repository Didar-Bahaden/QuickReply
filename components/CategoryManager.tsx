import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react';
import { Category } from '../lib/types';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  editCategoryName: string;
  setEditCategoryName: (val: string) => void;
  editCategoryEmoji: string;
  setEditCategoryEmoji: (val: string) => void;
  onAddCategory: (name: string, emoji: string) => boolean;
  onDeleteCategory: (name: string) => void;
}

export function CategoryManager({
  isOpen,
  onClose,
  categories,
  editCategoryName,
  setEditCategoryName,
  editCategoryEmoji,
  setEditCategoryEmoji,
  onAddCategory,
  onDeleteCategory
}: CategoryManagerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-[105] bg-white dark:bg-[#0F172A] flex flex-col sm:rounded-[36px]"
        >
          <div className="px-4 py-4 border-b border-[#EEEDF2] dark:border-[#334155] flex justify-between items-center bg-[#F7F7FB] dark:bg-[#0B0F19] sm:rounded-t-[36px]">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#1E293B] text-gray-500 transition-colors"
              >
                <ArrowLeft weight="bold" size={24} />
              </button>
              <h2 className="text-xl font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0 tracking-tight">
                Categories
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 font-['Nunito_Sans',sans-serif]">
            {/* Add New Category Form */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Create Category
              </label>
              <div className="bg-[#F9FAFB] dark:bg-[#1E293B] p-3 rounded-2xl border border-[#EEEDF2] dark:border-[#334155] flex gap-3 shadow-sm">
                <input
                  type="text"
                  placeholder="🏷️"
                  value={editCategoryEmoji}
                  onChange={(e) => setEditCategoryEmoji(e.target.value)}
                  className="w-[52px] text-center rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0F172A] text-xl font-medium outline-none focus:border-[#FF4D3D] dark:text-white"
                  maxLength={2}
                />
                <input
                  type="text"
                  placeholder="Category Name"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="flex-1 px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0F172A] text-[15px] font-bold text-[#1F2937] dark:text-[#F3F4F6] outline-none focus:border-[#FF4D3D] shadow-sm"
                />
                <button
                  onClick={() => {
                    const success = onAddCategory(editCategoryName, editCategoryEmoji);
                    if (success) {
                      setEditCategoryName('');
                      setEditCategoryEmoji('🏷️');
                    }
                  }}
                  disabled={!editCategoryName.trim()}
                  className="w-12 flex items-center justify-center bg-[#10B981] text-white rounded-xl disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-600 shadow-md active:scale-95 transition-all"
                >
                  <Plus weight="bold" size={22} />
                </button>
              </div>
            </div>

            {/* List Categories */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Existing Categories
              </label>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-3.5 bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-gray-50 dark:bg-[#0F172A] w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-700">
                        {category.emoji}
                      </span>
                      <span className="font-extrabold text-[#1F2937] dark:text-[#D1D5DB] text-[15px]">
                        {category.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteCategory(category.name)}
                      className="text-[#FF4D3D] hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors active:scale-90"
                    >
                      <Trash weight="duotone" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
