import React from 'react';
import { ShareNetwork, PencilSimple, Trash, Check, Copy } from '@phosphor-icons/react';
import { Snippet } from '../lib/types';

interface SnippetCardProps {
  snippet: Snippet;
  index: number;
  isExpanded: boolean;
  isCopied: boolean;
  onToggle: () => void;
  onCopy: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  categoryIcon?: React.ReactNode;
}

export function SnippetCard({
  snippet,
  index,
  isExpanded,
  isCopied,
  onToggle,
  onCopy,
  onShare,
  onEdit,
  onDelete,
  categoryIcon
}: SnippetCardProps) {
  const hasVariables = /\{[^}]+\}/.test(snippet.body);

  return (
    <div
      onClick={onToggle}
      className={`bg-white dark:bg-[#1E293B] rounded-2xl border p-4 shadow-sm cursor-pointer select-none transition-all duration-300 opacity-0 animate-[slideUpIn_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] w-full max-w-[360px] flex flex-col justify-between ${
        isExpanded ? 'min-h-[200px] h-auto' : 'h-[200px]'
      } ${
        isCopied
          ? 'border-l-4 border-l-[#10B981] bg-emerald-50/10 dark:bg-emerald-500/10 border-[#F1F1F5] dark:border-[#334155] scale-[0.98]'
          : 'border-[#F1F1F5] dark:border-[#334155]'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm text-gray-400">
            {categoryIcon}
          </div>
          <h3 className="text-[16px] font-bold text-[#1F2937] dark:text-[#F3F4F6] m-0 leading-tight">
            {snippet.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {hasVariables && (
            <span
              title="This snippet has dynamic placeholders — you'll fill them before copying"
              className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 tracking-wide select-none"
            >
              {'{·}'}
            </span>
          )}
          <span className="text-[10px] font-bold bg-[#FF4D3D]/10 text-[#FF4D3D] px-2 py-1 rounded-full uppercase tracking-wide">
            {snippet.category}
          </span>
        </div>
      </div>

      <div className="mb-3 relative flex-1 flex flex-col justify-start overflow-hidden">
        <p className="text-[14px] text-[#4B5563] dark:text-[#D1D5DB] leading-relaxed m-0 break-words font-['Nunito_Sans',sans-serif]">
          {isExpanded
            ? snippet.body
            : snippet.body.length > 72
            ? `${snippet.body.slice(0, 72)}...`
            : snippet.body}
        </p>
        {snippet.body.length > 72 && !isExpanded && (
          <span className="inline-block text-[#9CA3AF] dark:text-[#6B7280] text-xs font-semibold mt-1">
            Tap to expand
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-[#F3F4F6] dark:border-[#334155] flex justify-between items-center shrink-0">
        <div className="flex gap-2.5 items-center">
          <button
            onClick={onShare}
            title="Share Snippet"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#3B82F6] dark:text-[#60A5FA] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
          >
            <ShareNetwork weight="duotone" size={18} />
          </button>
          <button
            onClick={onEdit}
            title="Edit Snippet"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B5563] dark:text-[#D1D5DB] hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
          >
            <PencilSimple weight="duotone" size={18} />
          </button>
          <button
            onClick={onDelete}
            title="Delete Snippet"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#FF4D3D] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash weight="duotone" size={18} />
          </button>
        </div>

        <div className="relative group/copybtn flex items-center">
          {hasVariables && !isCopied && (
            <span className="absolute right-full mr-2 text-[10px] font-extrabold text-amber-500 dark:text-amber-400 whitespace-nowrap opacity-0 translate-x-1 group-hover/copybtn:opacity-100 group-hover/copybtn:translate-x-0 transition-all duration-200 pointer-events-none select-none">
              Fill & Copy
            </span>
          )}
          <button
            onClick={onCopy}
            title={isCopied ? 'Copied!' : hasVariables ? 'Fill placeholders & Copy' : 'Copy Snippet'}
            className={`${
              isCopied
                ? 'bg-[#10B981] shadow-emerald-400/20'
                : hasVariables
                ? 'bg-amber-500 shadow-amber-400/25 hover:-translate-y-0.5'
                : 'bg-[#FF4D3D] shadow-[#FF4D3D]/25 hover:-translate-y-0.5'
            } text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all active:scale-95`}
          >
            {isCopied ? (
              <Check weight="bold" size={16} />
            ) : (
              <Copy weight="bold" size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
