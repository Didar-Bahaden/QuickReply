import React from 'react';

interface ToastProps {
  visible: boolean;
  message: string;
}

export function Toast({ visible, message }: ToastProps) {
  return (
    <div
      className={`absolute bottom-[96px] left-4 right-4 bg-[#1F2937] text-white rounded-xl p-3 shadow-2xl flex items-center gap-3 z-40 pointer-events-none transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D3D]" />
      <span className="text-sm font-bold tracking-wide">{message}</span>
    </div>
  );
}
