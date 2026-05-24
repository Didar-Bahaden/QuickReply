import React from 'react';
import { Sun, Moon } from '@phosphor-icons/react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      className={`relative w-14 h-8 rounded-full px-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF4D3D]/20 shrink-0 flex items-center ${
        isLight
          ? 'bg-[#FF4D3D] border border-transparent'
          : 'bg-[#1E293B] border border-[#334155]'
      }`}
    >
      {/* Sun Icon (Left side) */}
      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isLight ? 'opacity-100' : 'opacity-0'}`}>
        <Sun weight="bold" size={16} className="text-white" />
      </span>

      {/* Moon Icon (Right side) */}
      <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${!isLight ? 'opacity-100' : 'opacity-0'}`}>
        <Moon weight="bold" size={16} className="text-gray-300 dark:text-[#E2E8F0]" />
      </span>

      {/* Slider Knob */}
      <div
        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          isLight ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
