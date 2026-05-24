import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  showSplash: boolean;
}

export function SplashScreen({ showSplash }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#FF4D3D] sm:rounded-[36px]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_12px_40px_rgba(153,27,27,0.3)] mb-6">
              <span className="text-[#FF4D3D] text-[40px] font-black tracking-tighter">QR</span>
            </div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight font-['Nunito',sans-serif] m-0">
              QuickReply
            </h1>
            
            {/* Micro Loading Bar */}
            <motion.div className="w-16 h-1.5 bg-white/20 rounded-full mt-10 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
