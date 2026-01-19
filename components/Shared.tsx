
import React, { useState } from 'react';

export const PACKS_PRICE_USD = 0.42;
export const ZORA_PRICE_USD = 1250; 
export const LOTTERY_PRICE = 25; 

export const formatUSD = (packs: number) => {
  return (packs * PACKS_PRICE_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const SimpleTooltip = ({ text, children, position = 'bottom' }: { text: string, children: React.ReactNode, position?: 'top' | 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative flex items-center justify-center" 
         onMouseEnter={() => setIsVisible(true)} 
         onMouseLeave={() => setIsVisible(false)}
         onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}>
      {children}
      {isVisible && (
        <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-wide text-white w-max max-w-[180px] text-center z-50 shadow-2xl animate-fade-in pointer-events-none`}>
          {text}
          <div className={`absolute ${position === 'top' ? 'top-full border-t-gray-900/95' : 'bottom-full border-b-gray-900/95'} left-1/2 -translate-x-1/2 border-4 border-transparent`}></div>
        </div>
      )}
    </div>
  );
};
