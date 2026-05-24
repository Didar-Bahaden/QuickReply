'use client';

import React from 'react';
import { Plus, MagnifyingGlass, X, Clock, TrendUp } from '@phosphor-icons/react';
import { useQuickReply } from '../hooks/useQuickReply';
import { SplashScreen } from '../components/SplashScreen';
import { Header } from '../components/Header';
import { SnippetCard } from '../components/SnippetCard';
import { SnippetSheet } from '../components/SnippetSheet';
import { SettingsPanel } from '../components/SettingsPanel';
import { CategoryManager } from '../components/CategoryManager';
import { AboutGoalsModal } from '../components/AboutGoalsModal';
import { Toast } from '../components/Toast';
import { VariableFillModal } from '../components/VariableFillModal';

export default function QuickReply() {
  const {
    snippets,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    mounted,
    showSplash,
    expandedCards,
    copiedSnippetId,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    editingSnippet,
    formTitle,
    setFormTitle,
    formCategory,
    setFormCategory,
    formBody,
    setFormBody,
    isSettingsOpen,
    setIsSettingsOpen,
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    isAboutGoalsOpen,
    setIsAboutGoalsOpen,
    editCategoryName,
    setEditCategoryName,
    editCategoryEmoji,
    setEditCategoryEmoji,
    toast,
    fileInputRef,
    filteredSnippets,
    categoryCounts,
    handleExport,
    handleImport,
    handleShareLink,
    handleShareSnippet,
    toggleCardExpansion,
    handleCopyText,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
    getCategoryEmoji,
    handleAddCategory,
    handleDeleteCategory,
    sortBy,
    setSortBy,
    isVariableModalOpen,
    setIsVariableModalOpen,
    activeVariableSnippet,
    variableKeys,
    handleCopyVariableFilled
  } = useQuickReply();

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const storagePercent = Math.max(Math.round(Math.min((snippets.length / 200) * 100, 100)), 2);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      if (!isInput) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          searchInputRef.current?.focus();
        } else if (e.key === '/') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Return SSR-friendly initial wrapper
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E2E8F0] dark:bg-[#0B0F19]">
        <div className="w-full max-w-[430px] h-[100dvh] max-h-[932px] bg-[#FF4D3D] flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6">
            <span className="text-[#FF4D3D] text-[40px] font-black font-sans tracking-[-1.5px]">QR</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          margin: 0;
          padding: 0;
          background-color: #E2E8F0;
          font-family: 'Nunito', 'Nunito Sans', sans-serif;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #0B0F19;
          }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUpIn {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
      <div className="w-full h-[100dvh] bg-[#F7F7FB] dark:bg-[#0F172A] relative flex flex-col overflow-hidden sm:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:rounded-[36px] ring-1 ring-black/5 dark:ring-white/10 lg:flex-row lg:max-w-none lg:max-h-none lg:h-screen lg:w-screen lg:rounded-none lg:shadow-none lg:ring-0">
        
        {/* 1. SPLASH SCREEN OVERLAY */}
        <SplashScreen showSplash={showSplash} />

        {/* 2. PERSISTENT SIDEBAR FOR DESKTOP */}
        <aside className="hidden lg:flex flex-col w-[280px] bg-white dark:bg-[#1E293B] border-r border-[#EEEDF2] dark:border-[#334155] p-6 shrink-0 justify-between">
          <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar">
            <h1 className="text-[26px] font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0 font-['Nunito',sans-serif] tracking-tight">
              Quick<span className="text-[#FF4D3D]">Reply</span>
            </h1>
            
            {/* Categories Menu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">
                Categories
              </label>
              
              <button
                onClick={() => setSelectedCategory('All')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-b from-[#FF5C4D] to-[#FF4D3D] text-white shadow-[0_4px_16px_rgba(255,77,61,0.25)] border-[#FF6B5C] border-b-[#E03A2B] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:via-white/5 before:to-white/10'
                    : 'text-[#4B5563] dark:text-[#D1D5DB] hover:bg-gray-50 dark:hover:bg-[#334155] border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">💬 All</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                    selectedCategory === 'All'
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-[#F3F4F6] dark:bg-[#334155] text-[#6B7280] dark:text-[#9CA3AF]'
                  }`}
                >
                  {categoryCounts['All'] || 0}
                </span>
              </button>

              {categories.map((category) => {
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
                      isActive
                        ? 'bg-gradient-to-b from-[#FF5C4D] to-[#FF4D3D] text-white shadow-[0_4px_16px_rgba(255,77,61,0.25)] border-[#FF6B5C] border-b-[#E03A2B] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:via-white/5 before:to-white/10'
                        : 'text-[#4B5563] dark:text-[#D1D5DB] hover:bg-gray-50 dark:hover:bg-[#334155] border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span className="truncate">{category.name}</span>
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'bg-white/20 text-white backdrop-blur-sm'
                          : 'bg-[#F3F4F6] dark:bg-[#334155] text-[#6B7280] dark:text-[#9CA3AF]'
                      }`}
                    >
                      {categoryCounts[category.name] || 0}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                className="flex items-center gap-2 w-full mt-3 px-4 py-2.5 rounded-xl font-bold text-sm text-[#FF4D3D] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <span>🏷️</span> Manage Categories
              </button>
            </div>
          </div>
                  {/* Sidebar Footer with Settings Actions */}
          <div className="flex flex-col gap-4 pt-4 border-t border-[#EEEDF2] dark:border-[#334155]">
            <div className="bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] dark:from-[#1E293B] dark:to-[#0F172A] border border-[#EEEDF2] dark:border-[#334155] rounded-2xl p-4 shadow-sm relative overflow-hidden group">
              {/* Decorative Glow */}
              <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-[#FF4D3D]/10 rounded-full blur-2xl group-hover:bg-[#FF4D3D]/15 transition-all duration-500" />
              
              {/* Title & Stats */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[11px] font-black text-[#1F2937] dark:text-[#F3F4F6] uppercase tracking-wider m-0">Local Workspace</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 m-0 mt-0.5">{snippets.length} Saved Snippets</p>
                </div>
                <span className="text-[9px] font-extrabold bg-[#10B981]/15 text-[#10B981] px-1.5 py-0.5 rounded border border-[#10B981]/20">Active</span>
              </div>
              
              {/* Progress/Storage utilization indicator */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">Storage Slots</span>
                  <span className="text-[9px] font-extrabold text-gray-600 dark:text-gray-400">{storagePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF4D3D] to-[#FF6B5C] rounded-full" style={{ width: `${storagePercent}%` }} />
                </div>
              </div>
              
              {/* Actions Grid */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleExport}
                  title="Export Backup"
                  className="flex flex-col items-center justify-center p-2 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-[#334155] rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <span className="text-[15px]">📤</span>
                  <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 mt-1">Export</span>
                </button>
                <label
                  title="Import Backup"
                  className="flex flex-col items-center justify-center p-2 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-[#334155] rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <span className="text-[15px]">📥</span>
                  <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 mt-1">Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
                <button
                  onClick={handleShareLink}
                  title="Share Workspace Link"
                  className="flex flex-col items-center justify-center p-2 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-[#334155] rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <span className="text-[15px]">🔗</span>
                  <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 mt-1">Share</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsAboutGoalsOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-50 dark:bg-[#1E293B]/40 border border-[#EEEDF2] dark:border-[#334155] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-all text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6]"
              >
                Meet Developer
              </button>
              <button
                onClick={() => setIsAboutGoalsOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-50 dark:bg-[#1E293B]/40 border border-[#EEEDF2] dark:border-[#334155] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-all text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6]"
              >
                🎯 Goals
              </button>
            </div>

            <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
              PWA by <strong>Didar</strong>
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* MOBILE HEADER (hidden on desktop) */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenSettings={() => setIsSettingsOpen(true)}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* DESKTOP SEARCH & ACTIONS HEADER (hidden on mobile) */}
          <div className="hidden lg:flex px-6 py-4 bg-[#F7F7FB] dark:bg-[#0F172A] border-b border-[#EEEDF2] dark:border-[#334155] justify-between items-center shrink-0">
            <div className="relative w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#9CA3AF] dark:text-[#6B7280]">
                <MagnifyingGlass weight="duotone" size={18} />
              </span>
              <input
                type="text"
                placeholder="Search responses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                className="w-full pl-[42px] pr-12 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[14px] text-[#1F2937] dark:text-[#F3F4F6] outline-none focus:border-[#FF4D3D] focus:ring-[3px] focus:ring-[#FF4D3D]/10 transition-colors shadow-sm placeholder-[#9CA3AF] dark:placeholder-[#6B7280] font-['Nunito_Sans',sans-serif]"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#6B7280] hover:text-[#6B7280] dark:hover:text-[#9CA3AF] p-1 rounded-full transition-colors"
                >
                  <X weight="bold" size={14} />
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#0F172A] px-1.5 py-0.5 rounded border border-[#E5E7EB] dark:border-[#334155] select-none tracking-wide">
                  Ctrl+K
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Toggle for Desktop */}
              <div className="flex bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#334155] shadow-sm shrink-0">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortBy === 'recent'
                      ? 'bg-red-50 dark:bg-red-500/10 text-[#FF4D3D]'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                  }`}
                >
                  <Clock weight="bold" size={14} />
                  Recent
                </button>
                <button
                  onClick={() => setSortBy('usage')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortBy === 'usage'
                      ? 'bg-red-50 dark:bg-red-500/10 text-[#FF4D3D]'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                  }`}
                >
                  <TrendUp weight="bold" size={14} />
                  Most Used
                </button>
              </div>

              <button
                onClick={handleOpenAdd}
                className="bg-[#FF4D3D] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#E63E2E] active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus weight="bold" size={16} /> New Snippet
              </button>
            </div>
          </div>

          {/* 4. RESPONSIVE GRID SNIPPETS LIST */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 lg:gap-3 pb-[90px] lg:pb-6 no-scrollbar content-start items-start justify-items-center md:justify-items-start">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet, index) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  index={index}
                  isExpanded={expandedCards.has(snippet.id)}
                  isCopied={copiedSnippetId === snippet.id}
                  onToggle={() => toggleCardExpansion(snippet.id)}
                  onCopy={(e) => handleCopyText(e, snippet.id, snippet.body)}
                  onShare={(e) => handleShareSnippet(e, snippet)}
                  onEdit={(e) => handleOpenEdit(e, snippet)}
                  onDelete={(e) => handleDelete(e, snippet.id)}
                  categoryEmoji={getCategoryEmoji(snippet.category)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-[260px] text-[#6B7280] dark:text-[#9CA3AF] gap-3">
                <span className="text-[40px] opacity-70">
                  <MagnifyingGlass weight="duotone" size={48} className="text-[#9CA3AF] dark:text-[#6B7280]" />
                </span>
                <p className="m-0 font-bold text-[16px] text-[#1F2937] dark:text-[#F3F4F6]">
                  No matches found
                </p>
                <p className="m-0 text-[14px] text-[#9CA3AF] dark:text-[#6B7280]">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>

        </div>

        {/* 5. TOAST NOTIFICATION */}
        <Toast visible={toast.visible} message={toast.message} />

        {/* 6. FLOATING ACTION BUTTON (FAB - mobile/tablet only) */}
        <button
          onClick={handleOpenAdd}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#FF4D3D] text-white flex items-center justify-center shadow-lg shadow-[#FF4D3D]/30 active:scale-90 hover:-translate-y-1 transition-all z-30 lg:hidden"
        >
          <Plus weight="bold" size={24} />
        </button>

        {/* 7. BOTTOM SHEET EDIT/ADD MODAL (Responsive sheet/dialog modal) */}
        <SnippetSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          editingSnippet={editingSnippet}
          formTitle={formTitle}
          setFormTitle={setFormTitle}
          formCategory={formCategory}
          setFormCategory={setFormCategory}
          formBody={formBody}
          setFormBody={setFormBody}
          categories={categories}
          onSave={handleSave}
        />

        {/* 8. SETTINGS SIDEBAR OVERLAY (mobile only) */}
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onExport={handleExport}
          onImport={handleImport}
          onShareLink={handleShareLink}
          onOpenCategoryManager={() => {
            setIsSettingsOpen(false);
            setIsCategoryManagerOpen(true);
          }}
          fileInputRef={fileInputRef}
        />

        {/* 9. CATEGORY MANAGER OVERLAY */}
        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          editCategoryName={editCategoryName}
          setEditCategoryName={setEditCategoryName}
          editCategoryEmoji={editCategoryEmoji}
          setEditCategoryEmoji={setEditCategoryEmoji}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* 10. ABOUT US & GOALS OVERLAY */}
        <AboutGoalsModal
          isOpen={isAboutGoalsOpen}
          onClose={() => setIsAboutGoalsOpen(false)}
        />

        {/* 11. VARIABLE FILL MODAL */}
        <VariableFillModal
          key={activeVariableSnippet?.id || 'none'}
          isOpen={isVariableModalOpen}
          onClose={() => setIsVariableModalOpen(false)}
          snippet={activeVariableSnippet}
          variableKeys={variableKeys}
          onCopyFilled={handleCopyVariableFilled}
        />
      </div>
    </>
  );
}
