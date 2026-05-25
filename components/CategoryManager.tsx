import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash, X, DotsSixVertical } from '@phosphor-icons/react';
import { Category } from '../lib/types';
import { getCategoryIcon } from '../lib/icons';

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
  onReorderCategories: (newCategories: Category[]) => void;
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
  onDeleteCategory,
  onReorderCategories
}: CategoryManagerProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Keyword auto-suggest logic based on category name typing
  useEffect(() => {
    const name = editCategoryName.trim().toLowerCase();
    if (!name) return;

    let suggestedEmoji = '';
    if (/ship|track|deliv|post|cargo|box|pack/.test(name)) {
      suggestedEmoji = '📦';
    } else if (/return|refund|exchan|swap|back/.test(name)) {
      suggestedEmoji = '🔄';
    } else if (/price|cost|sale|deal|discount|checkout|pay|money|coin|buy/.test(name)) {
      suggestedEmoji = '💰';
    } else if (/chat|msg|support|talk|repl|connect|convers/.test(name)) {
      suggestedEmoji = '💬';
    } else if (/greet|hello|hi|morn|welc/.test(name)) {
      suggestedEmoji = '👋';
    } else if (/info|help|faq|guide|about/.test(name)) {
      suggestedEmoji = 'ℹ️';
    } else if (/goal|target|task|todo|plan/.test(name)) {
      suggestedEmoji = '🎯';
    } else if (/flight|travel|plane|air|shipment/.test(name)) {
      suggestedEmoji = '✈️';
    } else if (/mail|letter|inbox|send/.test(name)) {
      suggestedEmoji = '✉️';
    } else if (/alert|bell|notif|announc/.test(name)) {
      suggestedEmoji = '📢';
    } else if (/cart|shop|store|order/.test(name)) {
      suggestedEmoji = '🛒';
    } else if (/tool|fix|repair|engine/.test(name)) {
      suggestedEmoji = '🛠️';
    } else if (/idea|bulb|light|smart/.test(name)) {
      suggestedEmoji = '💡';
    } else if (/date|cal|sched|time/.test(name)) {
      suggestedEmoji = '📅';
    }

    if (suggestedEmoji && editCategoryEmoji === '🏷️') {
      setEditCategoryEmoji(suggestedEmoji);
    }
  }, [editCategoryName, editCategoryEmoji, setEditCategoryEmoji]);

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reordered = [...categories];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);

    onReorderCategories(reordered);
    setDraggedIndex(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel Card */}
          <motion.div
            initial={{ y: '100%', scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative bg-white dark:bg-[#1E293B] w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-[24px] sm:rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] z-[106] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#EEEDF2] dark:border-slate-800/80 flex justify-between items-center bg-[#F7F7FB] dark:bg-[#0F172A] shrink-0">
              <h2 className="text-[17px] font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0 tracking-tight">
                Customize Categories
              </h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="bg-gray-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X weight="bold" size={14} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-6 no-scrollbar font-['Nunito_Sans',sans-serif]">
              {/* Create Category Form */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Create Category
                </label>
                <div className="bg-[#F9FAFB] dark:bg-[#0F172A] p-2.5 rounded-2xl border border-[#EEEDF2] dark:border-slate-800 flex gap-2.5 shadow-sm">
                  {/* Curated Emoji Picker */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="Select emoji"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-xl font-medium outline-none hover:border-[#FF4D3D]/50 transition-colors cursor-pointer shadow-sm select-none"
                    >
                      {editCategoryEmoji}
                    </button>

                    <AnimatePresence>
                      {showEmojiPicker && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setShowEmojiPicker(false)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute left-0 top-[52px] z-[111] bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl p-3 w-56 grid grid-cols-5 gap-2"
                          >
                            {['📦', '🔄', '💰', '💬', '👋', 'ℹ️', '🎯', '✈️', '✉️', '📢', '🛒', '🛠️', '💡', '📅', '🤝', '⭐', '🔥', '🔒', '📞', '🎁'].map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setEditCategoryEmoji(emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer active:scale-90 transition-all select-none"
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <input
                    type="text"
                    placeholder="Category Name"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="flex-1 px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-[14px] font-bold text-[#1F2937] dark:text-[#F3F4F6] outline-none focus:border-[#FF4D3D] shadow-sm font-['Nunito_Sans',sans-serif]"
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
                    className="w-12 flex items-center justify-center bg-[#10B981] text-white rounded-xl disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Plus weight="bold" size={20} />
                  </button>
                </div>
              </div>

              {/* List Categories */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Existing Categories (Drag to Reorder)
                </label>
                <div className="flex flex-col gap-2">
                  {categories.map((category, index) => {
                    const isDragged = index === draggedIndex;
                    return (
                      <div
                        key={category.name}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 rounded-xl shadow-sm transition-all duration-200 select-none ${
                          isDragged 
                            ? 'opacity-40 border-dashed border-[#FF4D3D]/30 scale-[0.98]' 
                            : 'hover:border-[#FF4D3D]/25 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          {/* Drag Handle */}
                          <div className="cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-600 hover:text-[#FF4D3D] p-1 rounded transition-colors shrink-0">
                            <DotsSixVertical weight="bold" size={18} />
                          </div>
                          <span className="bg-gray-50 dark:bg-slate-950 w-9 h-9 rounded-lg flex items-center justify-center border border-gray-100 dark:border-slate-800/80 shrink-0">
                            {getCategoryIcon(category.emoji, category.name, "text-[#FF4D3D] dark:text-[#FF6B5C]", 18)}
                          </span>
                          <span className="font-extrabold text-[#1F2937] dark:text-[#D1D5DB] text-[14px] truncate">
                            {category.name}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteCategory(category.name)}
                          className="text-[#FF4D3D] hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors active:scale-90 cursor-pointer shrink-0"
                        >
                          <Trash weight="duotone" size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
