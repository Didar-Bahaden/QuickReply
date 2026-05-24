import React from 'react';
import { GearSix, MagnifyingGlass, X, Clock, TrendUp } from '@phosphor-icons/react';
import { Category } from '../lib/types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenSettings: () => void;
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (val: string) => void;
  categoryCounts: Record<string, number>;
  sortBy: 'recent' | 'usage';
  setSortBy: (val: 'recent' | 'usage') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Header({
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  categories,
  selectedCategories,
  onToggleCategory,
  categoryCounts,
  sortBy,
  setSortBy,
  theme,
  toggleTheme
}: HeaderProps) {
  return (
    <header className="px-4 pt-4 pb-3 bg-[#F7F7FB] dark:bg-[#0F172A] border-b border-[#EEEDF2] dark:border-[#334155] z-10 flex flex-col gap-3 lg:hidden">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[26px] font-extrabold text-[#1F2937] dark:text-[#F3F4F6] m-0 font-['Nunito',sans-serif] tracking-tight">
          Quick<span className="text-[#FF4D3D]">Reply</span>
        </h1>
        <div className="flex items-center gap-3 -mr-2">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="text-[#9CA3AF] dark:text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#F3F4F6] transition-colors p-2"
          >
            <GearSix weight="duotone" size={24} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1 group/search-mobile">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#9CA3AF] dark:text-[#6B7280] group-hover/search-mobile:text-[#FF4D3D]/80 group-focus-within/search-mobile:text-[#FF4D3D] transition-colors duration-200">
            <MagnifyingGlass weight="duotone" size={18} />
          </span>
          <input
            type="text"
            placeholder="Search responses…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[42px] pr-10 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[15px] text-[#1F2937] dark:text-[#F3F4F6] outline-none hover:border-[#FF4D3D]/30 focus:border-[#FF4D3D] focus:ring-[3px] focus:ring-[#FF4D3D]/10 transition-all shadow-sm placeholder-[#9CA3AF] dark:placeholder-[#6B7280] font-['Nunito_Sans',sans-serif]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#6B7280] hover:text-[#FF4D3D] p-1 rounded-full transition-colors"
            >
              <X weight="bold" size={16} />
            </button>
          )}
        </div>

        <div className="flex bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#334155] shadow-sm shrink-0">
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'recent' ? 'usage' : 'recent')}
            aria-label={sortBy === 'recent' ? 'Sort by usage' : 'Sort by recent'}
            className={`p-2 rounded-lg transition-all ${
              sortBy === 'usage'
                ? 'text-[#FF4D3D] bg-red-50 dark:bg-red-500/10'
                : 'text-[#9CA3AF] dark:text-[#6B7280]'
            }`}
            title={sortBy === 'recent' ? 'Sorting by Recent' : 'Sorting by Most Used'}
          >
            {sortBy === 'recent' ? (
              <Clock weight="bold" size={20} />
            ) : (
              <TrendUp weight="bold" size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 items-center">
        {[{ name: 'All', emoji: '' }, ...categories].map((category) => {
          const isActive = selectedCategories.includes(category.name);
          return (
            <button
              key={category.name}
              onClick={() => onToggleCategory(category.name)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#FF4D3D] text-white border border-transparent shadow shadow-coral-400/20'
                  : 'bg-white dark:bg-[#1E293B] text-[#4B5563] dark:text-[#D1D5DB] border border-[#E5E7EB] dark:border-[#334155] shadow-sm hover:bg-gray-50 dark:hover:bg-[#334155]'
              }`}
            >
              {category.name}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-[#F3F4F6] dark:bg-[#334155] text-[#6B7280] dark:text-[#9CA3AF]'
                }`}
              >
                {categoryCounts[category.name] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
