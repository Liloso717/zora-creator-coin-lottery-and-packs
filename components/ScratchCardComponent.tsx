
import React, { useState } from 'react';
import { CreatorCoin } from '../types';
import { Sparkles, Zap, Coins } from 'lucide-react';

interface Props {
  prize?: CreatorCoin;
  onComplete: () => void;
}

export const ScratchCardComponent: React.FC<Props> = ({ prize, onComplete }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    // Trigger onComplete after a short delay to allow the animation to start
    setTimeout(onComplete, 1200);
  };

  return (
    <div 
      onClick={handleReveal}
      className="relative w-[300px] h-[180px] cursor-pointer group perspective-1000"
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT SIDE (Unrevealed) */}
        <div className="absolute inset-0 backface-hidden glass rounded-3xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-black to-black flex flex-col items-center justify-center p-4 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 shimmer opacity-20" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Zap className="text-yellow-500 w-6 h-6 animate-pulse" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Packs Lottery</div>
            <div className="text-sm font-black italic tracking-tighter uppercase text-white group-hover:text-yellow-400 transition-colors">Tap to reveal</div>
          </div>
          
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-yellow-500/20 rounded-tl-lg" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-yellow-500/20 rounded-br-lg" />
        </div>

        {/* BACK SIDE (Revealed) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass rounded-[2rem] border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black to-black flex flex-col items-center justify-center p-6 shadow-2xl">
          {prize ? (
            <div className="flex flex-col items-center gap-3 w-full animate-scale-in">
              <div className="flex items-center gap-4 w-full">
                <div className="relative">
                  <img src={prize.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-xl" alt="Prize" />
                  <div className="absolute -top-2 -right-2 bg-cyan-500 rounded-full p-1 shadow-lg">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-0.5">Asset Won!</div>
                  <div className="text-lg font-black italic tracking-tighter uppercase leading-none mb-0.5 truncate">{prize.handle}</div>
                  <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{prize.rarity} Rarity</div>
                </div>
              </div>
              
              <div className="w-full bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-fuchsia-400">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm font-black font-mono">{prize.value} $PACKS</span>
                </div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">Market Value</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/40 animate-fade-in">
              <div className="text-xs font-black uppercase tracking-widest">Empty Ticket</div>
              <div className="text-[10px]">Better luck next roll</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
