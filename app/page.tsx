'use client';

import React from 'react';
import { Plus, MagnifyingGlass, X, Clock, TrendUp, CaretDown } from '@phosphor-icons/react';
import { useQuickReply } from '../hooks/useQuickReply';
import { SplashScreen } from '../components/SplashScreen';
import { ThemeToggle } from '../components/ThemeToggle';
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
    selectedCategories,
    toggleCategory,
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
    handleCopyVariableFilled,
    theme,
    toggleTheme
  } = useQuickReply();

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = React.useState(true);
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

  // Return SSR-friendly initial wrapper matching the exact responsive layout of the splash screen
  if (!mounted) {
    return (
      <div className="w-full h-[100dvh] bg-[#FF4D3D] flex flex-col items-center justify-center overflow-hidden sm:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:rounded-[36px] ring-1 ring-black/5 dark:ring-white/10 lg:max-w-none lg:max-h-none lg:h-screen lg:w-screen lg:rounded-none lg:shadow-none lg:ring-0">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_12px_40px_rgba(153,27,27,0.3)] mb-6">
            <span className="text-[#FF4D3D] text-[40px] font-black tracking-tighter">QR</span>
          </div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight font-['Nunito',sans-serif] m-0">
            QuickReply
          </h1>
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
        .dark body {
          background-color: #0B0F19;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUpIn {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
      <div className="w-full h-[100dvh] bg-[#F7F7FB] dark:bg-[#0F172A] relative flex flex-col overflow-hidden sm:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:rounded-[36px] ring-1 ring-black/5 dark:ring-white/10 lg:max-w-none lg:max-h-none lg:h-screen lg:w-screen lg:rounded-none lg:shadow-none lg:ring-0 lg:p-5 lg:gap-4">
        
        {/* 1. SPLASH SCREEN OVERLAY */}
        <SplashScreen showSplash={showSplash} />

        {/* 2. UNIFIED TOP-SPANNING HEADER FOR DESKTOP */}
        <header className="hidden lg:flex w-full bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-2xl h-[72px] shrink-0 items-center justify-between px-6 z-20 shadow-sm">
          {/* Logo Section - matches sidebar width minus gap */}
          <div className="w-[256px] shrink-0 flex items-center h-full">
            <h1 className="text-[24px] font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0 font-['Nunito',sans-serif] tracking-tight">
              Quick<span className="text-[#FF4D3D]">Reply</span>
            </h1>
          </div>

          {/* Search bar and workspace controls */}
          <div className="flex-1 flex items-center justify-between pl-4">
            <div className="relative w-80 group/search">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#9CA3AF] dark:text-[#6B7280] group-hover/search:text-[#FF4D3D]/80 group-focus-within/search:text-[#FF4D3D] transition-colors duration-200">
                <MagnifyingGlass weight="duotone" size={18} />
              </span>
              <input
                type="text"
                placeholder="Search responses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                className="w-full pl-[42px] pr-12 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[14px] text-[#1F2937] dark:text-[#F3F4F6] outline-none hover:border-[#FF4D3D]/30 focus:border-[#FF4D3D] focus:ring-[3px] focus:ring-[#FF4D3D]/10 transition-all shadow-sm placeholder-[#9CA3AF] dark:placeholder-[#6B7280] font-['Nunito_Sans',sans-serif]"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#6B7280] hover:text-[#FF4D3D] p-1 rounded-full transition-colors"
                >
                  <X weight="bold" size={14} />
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#FF4D3D]/70 dark:text-[#FF4D3D]/60 bg-[#FF4D3D]/5 dark:bg-[#FF4D3D]/10 px-1.5 py-0.5 rounded border border-[#FF4D3D]/15 group-hover/search:border-[#FF4D3D]/30 select-none tracking-wide transition-colors duration-200">
                  Ctrl+K
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button
                onClick={handleOpenAdd}
                className="bg-[#FF4D3D] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#E63E2E] active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus weight="bold" size={16} /> New Snippet
              </button>
            </div>
          </div>
        </header>

        {/* 3. TWO-COLUMN WORKSPACE CONTAINER BELOW HEADER */}
        <div className="flex-1 flex flex-row min-w-0 gap-4 overflow-hidden">
          
          {/* PERSISTENT SIDEBAR FOR DESKTOP */}
          <aside className="hidden lg:flex flex-col w-[280px] gap-4 shrink-0 overflow-hidden">
            
            {/* Container 1: Filter Container */}
            <div className="bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-2xl p-6 flex-1 flex flex-col overflow-hidden justify-between">
              
              {/* Sort Filter Section */}
              <div className="mb-6 shrink-0">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-3">
                  Sort By
                </label>
                <div className="flex bg-[#F7F7FB] dark:bg-[#0F172A] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#334155] shadow-sm w-full">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors duration-200 ${
                      sortBy === 'recent'
                        ? 'bg-white dark:bg-[#1E293B] text-[#FF4D3D] shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                    }`}
                  >
                    <Clock weight="bold" size={14} />
                    Recent
                  </button>
                  <button
                    onClick={() => setSortBy('usage')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors duration-200 ${
                      sortBy === 'usage'
                        ? 'bg-white dark:bg-[#1E293B] text-[#FF4D3D] shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                    }`}
                  >
                    <TrendUp weight="bold" size={14} />
                    Most Used
                  </button>
                </div>
              </div>

              {/* Category Filter Section */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center select-none cursor-pointer mb-4" onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block cursor-pointer">
                    Categories
                  </label>
                  <button
                    type="button"
                    aria-label={isCategoriesExpanded ? "Collapse Categories" : "Expand Categories"}
                    className="text-gray-400 dark:text-gray-500 hover:text-[#FF4D3D] transition-colors duration-200"
                  >
                    <CaretDown weight="bold" size={14} className={`transform transition-transform duration-200 ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${isCategoriesExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none invisible h-0'}`}>
                  <div className="flex flex-col gap-1.5 pb-2">
                    
                    <button
                      onClick={() => toggleCategory('All')}
                      className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
                        selectedCategories.includes('All')
                          ? 'bg-red-50 dark:bg-red-500/10 text-[#FF4D3D] border-[#FF4D3D]/20 shadow-sm'
                          : 'text-[#4B5563] dark:text-[#D1D5DB] hover:bg-gray-50 dark:hover:bg-[#334155] border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 shrink-0 shadow-sm ${
                          selectedCategories.includes('All')
                            ? 'bg-gradient-to-br from-[#FF6B5C] to-[#FF4D3D] border-transparent shadow-[0_0_12px_rgba(255,77,61,0.5)] text-white'
                            : 'bg-transparent border-gray-300 dark:border-gray-600 text-transparent group-hover:border-[#FF4D3D]/60 group-hover:shadow-[0_0_8px_rgba(255,77,61,0.3)]'
                        }`}>
                          {selectedCategories.includes('All') && (
                            <span className="text-[11px] font-black">✓</span>
                          )}
                        </span>
                        <span>💬 All</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                          selectedCategories.includes('All')
                            ? 'bg-[#FF4D3D]/10 text-[#FF4D3D]'
                            : 'bg-[#F3F4F6] dark:bg-[#334155] text-[#6B7280] dark:text-[#9CA3AF]'
                        }`}
                      >
                        {categoryCounts['All'] || 0}
                      </span>
                    </button>

                    {categories.map((category) => {
                      const isActive = selectedCategories.includes(category.name);
                      return (
                        <button
                          key={category.name}
                          onClick={() => toggleCategory(category.name)}
                          className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
                            isActive
                              ? 'bg-red-50 dark:bg-red-500/10 text-[#FF4D3D] border-[#FF4D3D]/20 shadow-sm'
                              : 'text-[#4B5563] dark:text-[#D1D5DB] hover:bg-gray-50 dark:hover:bg-[#334155] border-transparent'
                          }`}
                        >
                          <span className="flex items-center gap-3 truncate">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 shrink-0 shadow-sm ${
                              isActive
                                ? 'bg-gradient-to-br from-[#FF6B5C] to-[#FF4D3D] border-transparent shadow-[0_0_12px_rgba(255,77,61,0.5)] text-white'
                                : 'bg-transparent border-gray-300 dark:border-gray-600 text-transparent group-hover:border-[#FF4D3D]/60 group-hover:shadow-[0_0_8px_rgba(255,77,61,0.3)]'
                            }`}>
                              {isActive && (
                                <span className="text-[11px] font-black">✓</span>
                              )}
                            </span>
                            <span className="flex items-center gap-2 truncate">
                              <span>{category.emoji}</span>
                              <span className="truncate">{category.name}</span>
                            </span>
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 transition-all duration-200 ${
                              isActive
                                ? 'bg-[#FF4D3D]/10 text-[#FF4D3D]'
                                : 'bg-[#F3F4F6] dark:bg-[#334155] text-[#6B7280] dark:text-[#9CA3AF]'
                            }`}
                          >
                            {categoryCounts[category.name] || 0}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Manage Categories Button (Always Visible at Bottom of Filter Container) */}
              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                className="flex items-center gap-2 w-full mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 shrink-0 font-bold text-sm text-[#FF4D3D] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <span>🏷️</span> Manage Categories
              </button>
            </div>
            
            {/* Container 2: Workspace Storage Stats & Footer Actions */}
            <div className="bg-white dark:bg-[#1E293B] border border-[#EEEDF2] dark:border-[#334155] rounded-2xl p-6 shrink-0 flex flex-col gap-4">
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
                    aria-label="Export Backup"
                    className="flex flex-col items-center justify-center p-2 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-[#334155] rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    <span className="text-[15px]">📤</span>
                    <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 mt-1">Export</span>
                  </button>
                  <label
                    title="Import Backup"
                    aria-label="Import Backup"
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
                    aria-label="Share Workspace Link"
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

          {/* 4. MAIN WORKSPACE CONTAINER */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* MOBILE HEADER (hidden on desktop) */}
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenSettings={() => setIsSettingsOpen(true)}
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              categoryCounts={categoryCounts}
              sortBy={sortBy}
              setSortBy={setSortBy}
              theme={theme}
              toggleTheme={toggleTheme}
            />

            {/* 5. RESPONSIVE GRID SNIPPETS LIST */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-0 lg:pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 lg:gap-3 pb-[90px] no-scrollbar content-start items-start justify-items-center md:justify-items-start">
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
                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto animate-[slideUpIn_0.4s_ease-out]">
                  {/* Premium Custom Animated Holographic SVG */}
                  <svg
                    width="180"
                    height="180"
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0 select-none drop-shadow-[0_10px_20px_rgba(255,77,61,0.08)] dark:drop-shadow-[0_15px_30px_rgba(255,77,61,0.18)]"
                  >
                    <style>{`
                      .anim-orbit { transform-origin: 80px 80px; animation: spin-slower 24s linear infinite; }
                      .anim-capsule { transform-origin: 80px 75px; animation: float-slow 6s ease-in-out infinite; }
                      .anim-bubble-small { transform-origin: 120px 50px; animation: float-medium 5s ease-in-out infinite; }
                      .anim-magnifier { transform-origin: 95px 95px; animation: magnifier-scan 4s ease-in-out infinite; }
                      .anim-radar { transform-origin: 80px 80px; animation: radar-pulse 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
                      .anim-sparkle-1 { animation: pulse-soft 3s ease-in-out infinite; }
                      .anim-sparkle-2 { animation: pulse-soft 3s ease-in-out infinite 1.5s; }
                      
                      @keyframes spin-slower {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                      @keyframes float-slow {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-7px) rotate(2deg); }
                      }
                      @keyframes float-medium {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-12px) rotate(-4deg); }
                      }
                      @keyframes magnifier-scan {
                        0%, 100% { transform: translate(0px, 0px) scale(1); }
                        50% { transform: translate(-12px, 8px) scale(1.05); }
                      }
                      @keyframes radar-pulse {
                        0% { opacity: 0.4; r: 15px; stroke-width: 1px; }
                        100% { opacity: 0; r: 75px; stroke-width: 0.5px; }
                      }
                      @keyframes pulse-soft {
                        0%, 100% { opacity: 0.2; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.2); }
                      }
                    `}</style>
                    
                    <defs>
                      <linearGradient id="redGrad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FF8B7E" />
                        <stop offset="50%" stopColor="#FF4D3D" />
                        <stop offset="100%" stopColor="#D62B1C" />
                      </linearGradient>
                      <radialGradient id="bgGlow" cx="80" cy="80" r="80" fx="80" fy="80" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FF4D3D" stopOpacity="0.12" />
                        <stop offset="50%" stopColor="#FF4D3D" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#FF4D3D" stopOpacity="0" />
                      </radialGradient>
                      <filter id="neonShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#FF4D3D" floodOpacity="0.25" />
                      </filter>
                    </defs>
                    
                    {/* Radial Ambient Glow */}
                    <circle cx="80" cy="80" r="70" fill="url(#bgGlow)" />
                    
                    {/* Radar Pulsing Circle */}
                    <circle cx="80" cy="80" r="20" fill="none" stroke="#FF4D3D" className="anim-radar" />
                    <circle cx="80" cy="80" r="20" fill="none" stroke="#FF4D3D" className="anim-radar" style={{ animationDelay: '1.5s' }} />

                    {/* Orbiting Rings */}
                    <circle cx="80" cy="80" r="62" fill="none" stroke="#FF4D3D" strokeWidth="1" strokeDasharray="3,12" opacity="0.3" className="anim-orbit" />
                    <circle cx="80" cy="80" r="50" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6,8" opacity="0.2" className="anim-orbit" style={{ animationDirection: 'reverse', animationDuration: '32s' }} />
                    
                    {/* Connected node lines */}
                    <line x1="30" y1="50" x2="52" y2="60" stroke="#FF4D3D" strokeWidth="1" strokeDasharray="2,4" opacity="0.2" />
                    <line x1="130" y1="110" x2="110" y2="95" stroke="#FF4D3D" strokeWidth="1" strokeDasharray="2,4" opacity="0.2" />
                    
                    {/* Floating node points */}
                    <circle cx="30" cy="50" r="3" fill="#94A3B8" opacity="0.4" />
                    <circle cx="130" cy="110" r="2" fill="#FF4D3D" opacity="0.5" className="anim-sparkle-1" />

                    {/* Main chat capsule */}
                    <g className="anim-capsule" filter="url(#neonShadow)">
                      <rect x="42" y="44" width="76" height="52" rx="16" fill="white" stroke="url(#redGrad)" strokeWidth="3" className="dark:fill-[#1E293B]" />
                      
                      {/* Inner decorative mock text lines */}
                      <rect x="56" y="58" width="48" height="4" rx="2" fill="#FF4D3D" opacity="0.3" />
                      <rect x="56" y="68" width="34" height="4" rx="2" fill="#FF4D3D" opacity="0.3" />
                      <circle cx="56" cy="80" r="3" fill="#FF4D3D" opacity="0.4" />
                      <circle cx="66" cy="80" r="3" fill="#FF4D3D" opacity="0.4" />
                      <circle cx="76" cy="80" r="3" fill="#FF4D3D" opacity="0.4" />
                    </g>

                    {/* Secondary floating chat bubble */}
                    <g className="anim-bubble-small">
                      <path
                        d="M 112 42
                           A 4 4 0 0 1 116 38
                           L 132 38
                           A 4 4 0 0 1 136 42
                           L 136 52
                           A 4 4 0 0 1 132 56
                           L 121 56
                           L 116 61
                           L 118 56
                           L 116 56
                           A 4 4 0 0 1 112 52
                           Z"
                        fill="white"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        className="dark:fill-[#1E293B] dark:stroke-slate-500"
                        opacity="0.8"
                      />
                      <line x1="119" y1="47" x2="129" y2="47" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" className="dark:stroke-slate-500" />
                    </g>

                    {/* Sparkle elements */}
                    <path d="M 28 92 L 30 96 L 34 98 L 30 100 L 28 104 L 26 100 L 22 98 L 26 96 Z" fill="#FF4D3D" className="anim-sparkle-1" />
                    <path d="M 125 76 L 126.5 79.5 L 130 81 L 126.5 82.5 L 125 86 L 123.5 82.5 L 120 81 L 123.5 79.5 Z" fill="#FF4D3D" className="anim-sparkle-2" />

                    {/* Magnifying Glass */}
                    <g className="anim-magnifier">
                      <line x1="102" y1="102" x2="124" y2="124" stroke="#475569" strokeWidth="5.5" strokeLinecap="round" className="dark:stroke-slate-300" />
                      <line x1="102" y1="102" x2="124" y2="124" stroke="#FF4D3D" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                      
                      <circle cx="88" cy="88" r="20" fill="white" stroke="#475569" strokeWidth="3.5" className="dark:fill-[#1E293B] dark:stroke-slate-300" />
                      <circle cx="88" cy="88" r="20" fill="none" stroke="url(#redGrad)" strokeWidth="1.5" opacity="0.7" />
                      
                      <path d="M 76 80 A 13 13 0 0 1 92 76" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                      <text x="88" y="94" textAnchor="middle" fill="#FF4D3D" fontSize="16" fontWeight="bold" fontFamily="sans-serif" filter="drop-shadow(0 2px 4px rgba(255,77,61,0.4))">?</text>
                    </g>
                  </svg>

                  <h3 className="text-lg font-extrabold text-[#1F2937] dark:text-[#F3F4F6] mt-8 mb-2 tracking-tight">
                    {snippets.length === 0 ? 'Your workspace is empty' : 'No replies in sight'}
                  </h3>
                  
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-[280px] leading-relaxed mb-6 font-medium">
                    {snippets.length === 0
                      ? 'Create your first quick reply snippet to get started.'
                      : 'We searched all categories and snippets but couldn\'t find a match for your query.'}
                  </p>

                  <div className="flex flex-wrap gap-2.5 justify-center items-center">
                    {snippets.length === 0 ? (
                      <button
                        onClick={() => handleOpenAdd()}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-[#FF4D3D] hover:bg-[#E63E2E] rounded-xl transition-all active:scale-95 shadow-md shadow-[#FF4D3D]/15 flex items-center gap-1.5"
                      >
                        <Plus weight="bold" size={14} />
                        Add First Snippet
                      </button>
                    ) : (
                      <>
                        {(searchQuery || selectedCategories.length > 1 || !selectedCategories.includes('All')) && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              if (!selectedCategories.includes('All')) {
                                toggleCategory('All');
                              }
                            }}
                            className="group px-4 py-2.5 text-xs font-bold text-[#FF4D3D] hover:bg-[#FF4D3D]/5 dark:hover:bg-[#FF4D3D]/10 border border-[#FF4D3D]/20 rounded-xl transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5 transform group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                            </svg>
                            Reset Filters
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleOpenAdd(searchQuery || undefined)}
                          className="px-4 py-2.5 text-xs font-bold text-white bg-[#FF4D3D] hover:bg-[#E63E2E] rounded-xl transition-all active:scale-95 shadow-md shadow-[#FF4D3D]/15 flex items-center gap-1.5"
                        >
                          <Plus weight="bold" size={14} />
                          {searchQuery ? `Create "${searchQuery.length > 15 ? searchQuery.substring(0, 15) + '...' : searchQuery}"` : 'Add Snippet'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

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
