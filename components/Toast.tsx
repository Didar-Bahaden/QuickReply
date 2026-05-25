import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

interface ToastProps {
  visible: boolean;
  message: string;
}

export function Toast({ visible, message }: ToastProps) {
  const isError = message.toLowerCase().includes('failed') || message.toLowerCase().includes('invalid');
  
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-[96px] left-0 right-0 z-50 pointer-events-none flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30 
            }}
            className={`relative pointer-events-auto flex items-center gap-3 px-5 py-3.5 pb-4.5 rounded-2xl bg-white dark:bg-[#1E293B] border ${
              isError 
                ? 'border-[#FF4D3D]/30 dark:border-[#FF4D3D]/40 shadow-[0_12px_40px_rgba(255,77,61,0.08)]' 
                : 'border-emerald-500/30 dark:border-emerald-500/40 shadow-[0_12px_40px_rgba(16,185,129,0.08)]'
            } text-slate-800 dark:text-slate-100 min-w-[280px] max-w-[90vw] md:max-w-md overflow-hidden`}
          >
            {isError ? (
              <XCircle weight="fill" size={20} className="text-[#FF4D3D] shrink-0" />
            ) : (
              <CheckCircle weight="fill" size={20} className="text-[#10B981] shrink-0" />
            )}
            <span className="text-sm font-bold tracking-wide flex-1 mr-2">{message}</span>
            
            {/* Timed progress indicator bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800/50">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className={`h-full ${isError ? 'bg-[#FF4D3D]' : 'bg-[#10B981]'}`}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

