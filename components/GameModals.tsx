
import React from 'react';
import { ArrowLeft, Share2, TrendingUp, Scissors, Handshake, BatteryFull, X, Package, Minus, Plus, Zap, ArrowRightLeft } from 'lucide-react';
import { Pack, CreatorCoin, TradeOffer } from '../types';
import { RARITY_CONFIG, INITIAL_LEADERBOARD } from '../constants';
import { formatUSD, SimpleTooltip } from './Shared';
import { ScratchCardComponent } from './ScratchCardComponent';

export const ViewingPackModal = ({ viewingPack, setViewingPack, openProfile, getPackRoi, buyPack, setConfirmingPurchase, sharePack }: any) => (
    <div className="fixed inset-0 z-[150] bg-black/95 flex flex-col animate-slide-up overflow-y-auto no-scrollbar">
      <div className="relative h-[45vh]">
        <div className={`absolute inset-0 rarity-glow opacity-30 ${RARITY_CONFIG[viewingPack.rarity as import('../types').Rarity].bg}`} />
        <img src={viewingPack.image} className="w-full h-full object-cover opacity-60 scale-110 blur-sm grayscale" alt="Pack" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <button onClick={() => setViewingPack(null)} className="absolute top-8 left-8 p-3 glass rounded-2xl active:scale-95 shadow-lg border border-white/10 hover:bg-white/10 transition-all z-20"><ArrowLeft className="w-5 h-5" /></button>
        <SimpleTooltip text="Share this strategy" position="bottom">
          <button onClick={() => sharePack(viewingPack)} className="absolute top-8 right-8 p-3 glass rounded-2xl active:scale-95 shadow-lg border border-white/10 hover:bg-white/10 transition-all z-20 text-white"><Share2 className="w-5 h-5" /></button>
        </SimpleTooltip>
        
        <div className="absolute bottom-12 left-10 right-10 flex flex-col items-center text-center">
          <div className={`w-36 h-36 rounded-[3rem] border-4 border-black shadow-2xl overflow-hidden mb-6 animate-scale-in p-1 ${RARITY_CONFIG[viewingPack.rarity as import('../types').Rarity].bg}`}>
            <img src={viewingPack.image} className="w-full h-full object-cover rounded-[2.5rem]" alt="Pack" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2 drop-shadow-glow">{viewingPack.name}</h2>
          <div 
            onClick={() => { setViewingPack(null); openProfile(viewingPack.curatorName); }}
            className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4 leading-none italic cursor-pointer hover:underline"
          >
            Curated by {viewingPack.curatorName}
          </div>
          <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border border-white/10 glass shadow-lg ${RARITY_CONFIG[viewingPack.rarity as import('../types').Rarity].color}`}>
            {viewingPack.rarity} SERIES BUNDLE
          </div>
        </div>
      </div>
      
      <div className="px-8 pb-32 space-y-8 animate-slide-up">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="glass p-3 rounded-2xl text-center border border-white/5 bg-white/5">
            <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Holders</div>
            <div className="text-lg font-black font-mono">{viewingPack.holders}</div>
          </div>
          <div className="glass p-3 rounded-2xl text-center border border-white/5 bg-white/5">
             <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Vol ($PACKS)</div>
             <div className="text-lg font-black font-mono">{viewingPack.volume > 1000 ? (viewingPack.volume/1000).toFixed(1) + 'k' : viewingPack.volume}</div>
          </div>
          <div className="glass p-3 rounded-2xl text-center border border-white/5 bg-white/5">
             <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Burned</div>
             <div className="text-lg font-black font-mono text-fuchsia-500">{viewingPack.burnCount}</div>
          </div>
          <div className="glass p-3 rounded-2xl text-center border border-green-500/30 bg-green-500/5">
            <div className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1">Proj. ROI</div>
            <div className="text-lg font-black font-mono text-green-400">+{getPackRoi(viewingPack.id, viewingPack.rarity)}%</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic px-2">Potential Contents</h3>
          <div className="grid grid-cols-1 gap-3">
             {viewingPack.contents?.map((c: CreatorCoin, i: number) => (
                <div key={i} className="flex items-center justify-between gap-4 glass p-3 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-4">
                       <img src={c.avatar} className="w-10 h-10 rounded-xl" alt="c" />
                       <div>
                         <div className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{c.name}</div>
                         <div className={`text-[8px] font-bold uppercase ${RARITY_CONFIG[c.rarity].color}`}>{c.rarity}</div>
                       </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-black font-mono text-fuchsia-400">{c.value} $PACKS</div>
                      <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Est. Val</div>
                   </div>
                </div>
             ))}
             {!viewingPack.contents && <div className="text-center text-white/20 text-xs italic">Mystery Contents</div>}
          </div>
        </div>

        <div className="sticky bottom-4">
          <div className="glass p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-between bg-black/90 backdrop-blur-xl">
             <div>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Protocol Price</div>
                <div className="text-2xl font-black font-mono text-fuchsia-400">{viewingPack.price} <span className="text-[10px] text-white/40">$PACKS</span></div>
                <div className="text-[9px] font-bold text-white/30 uppercase mt-0.5 tracking-widest">≈ {formatUSD(viewingPack.price)} USD</div>
             </div>
             <button 
              onClick={() => setConfirmingPurchase(viewingPack)} 
              className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase active:scale-95 transition-all shadow-xl hover:bg-fuchsia-500 hover:text-white border-b-4 border-black"
             >
               Secure Bundle
             </button>
          </div>
        </div>
      </div>
    </div>
);

export const PackPurchaseConfirmationModal = ({ confirmingPurchase, setConfirmingPurchase, buyPack }: any) => (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-xs p-8 rounded-[3rem] border-fuchsia-500/20 animate-scale-in text-center shadow-2xl bg-black">
        <div className="w-20 h-20 bg-fuchsia-600/20 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-fuchsia-500/30 shadow-inner animate-pulse"><Package className="w-10 h-10 text-fuchsia-500" /></div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-white leading-none">Confirm Bundle?</h3>
        <div className="text-[12px] font-black text-fuchsia-400 uppercase tracking-widest mb-1 leading-none">{confirmingPurchase.name}</div>
        
        <div className="bg-fuchsia-500/5 p-6 rounded-3xl mb-8 border border-fuchsia-500/10 text-center shadow-inner mt-4">
          <div className="text-[10px] font-black uppercase text-fuchsia-500/40 tracking-widest mb-2 leading-none italic">Total Cost</div>
          <div className="text-4xl font-black font-mono text-fuchsia-400 leading-none mb-1">{confirmingPurchase.price} <span className="text-xs font-bold text-fuchsia-500/40 tracking-widest">$PACKS</span></div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">≈ {formatUSD(confirmingPurchase.price)} USD</div>
          <div className="text-[8px] text-white/20 uppercase mt-2 tracking-widest italic">{confirmingPurchase.rarity} Series Strategy</div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => buyPack(confirmingPurchase)} className="w-full py-5 bg-fuchsia-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] active:scale-95 shadow-xl border-b-4 border-fuchsia-800 hover:bg-fuchsia-500 transition-all">Secure Bundle</button>
          <button onClick={() => setConfirmingPurchase(null)} className="w-full py-4 text-white/40 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">Cancel</button>
        </div>
      </div>
    </div>
);

export const LottoConfirmationModal = ({ lottoConfirmation, setLottoConfirmation, executeLottoPurchase }: any) => (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-xs p-8 rounded-[3rem] border-yellow-500/20 animate-scale-in text-center shadow-2xl bg-black">
        <div className="w-20 h-20 bg-yellow-600/20 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-yellow-500/30 shadow-inner animate-pulse"><Zap className="w-10 h-10 text-yellow-500" /></div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-white leading-none">Confirm Lotto?</h3>
        <div className="text-[12px] font-black text-yellow-400 uppercase tracking-widest mb-1 leading-none">{lottoConfirmation.quantity} Ticket{lottoConfirmation.quantity > 1 ? 's' : ''}</div>
        
        <div className="bg-yellow-500/5 p-6 rounded-3xl mb-8 border border-yellow-500/10 text-center shadow-inner mt-4">
          <div className="text-[10px] font-black uppercase text-yellow-500/40 tracking-widest mb-2 leading-none italic">Total Cost</div>
          <div className="text-4xl font-black font-mono text-yellow-400 leading-none mb-1">{lottoConfirmation.cost} <span className="text-xs font-bold text-yellow-500/40 tracking-widest">$PACKS</span></div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">≈ {formatUSD(lottoConfirmation.cost)} USD</div>
          <div className="text-[8px] text-white/20 uppercase mt-2 tracking-widest italic">Target: {lottoConfirmation.creator ? lottoConfirmation.creator.name : 'Random Protocol Asset'}</div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={executeLottoPurchase} className="w-full py-5 bg-yellow-600 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] active:scale-95 shadow-xl border-b-4 border-yellow-800 hover:bg-yellow-500 transition-all">Confirm Purchase</button>
          <button onClick={() => setLottoConfirmation(null)} className="w-full py-4 text-white/40 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">Cancel</button>
        </div>
      </div>
    </div>
);

export const TradingPackModal = ({ tradingPack, setTradingPack, tradeQuantity, setTradeQuantity, proposeTrade }: any) => (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-sm p-8 rounded-[3rem] border-cyan-500/20 animate-scale-in shadow-2xl space-y-6 bg-black">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Peer Swap</h3>
          <button onClick={() => { setTradingPack(null); setTradeQuantity(1); }} className="p-2 glass rounded-xl hover:bg-white/5 transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Outbound Bundle</div>
          <div className="w-24 h-24 rounded-3xl bg-black border border-cyan-500/30 flex items-center justify-center shadow-inner relative">
            <Package className={`w-12 h-12 ${RARITY_CONFIG[tradingPack.pack.rarity as import('../types').Rarity].color}`} />
            <div className="absolute -bottom-2 px-4 py-1 bg-cyan-600 text-black text-[9px] font-black rounded-full shadow-lg border-2 border-black">x{tradeQuantity}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black uppercase italic tracking-tighter leading-none mb-1">{tradingPack.pack.name}</div>
            <div className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">Settle Value: {tradingPack.pack.price * tradeQuantity} $PACKS</div>
            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">≈ {formatUSD(tradingPack.pack.price * tradeQuantity)} USD</div>
          </div>
        </div>

        {tradingPack.count > 1 && (
          <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center justify-between shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Swap Quantity</span>
            <div className="flex items-center gap-5">
              <button onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))} className="p-1.5 glass rounded-lg text-white/40 hover:text-white transition-all"><Minus className="w-4 h-4" /></button>
              <span className="text-sm font-mono font-black">{tradeQuantity}</span>
              <button onClick={() => setTradeQuantity(Math.min(tradingPack.count, tradeQuantity + 1))} className="p-1.5 glass rounded-lg text-white/40 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-[10px] font-black uppercase text-white/30 tracking-widest italic px-2">Select Counterparty</div>
          <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto no-scrollbar">
            {INITIAL_LEADERBOARD.slice(0, 6).map((p, i) => (
              <button key={i} onClick={() => proposeTrade(p.name)} className="p-4 glass rounded-[2rem] border-white/5 text-left active:scale-95 transition-all hover:bg-cyan-400/10 group bg-white/5">
                <div className="flex items-center gap-3">
                  <img src={p.avatar} className="w-8 h-8 rounded-xl border border-white/10" alt="av" />
                  <div className="truncate">
                    <div className="text-[10px] font-black uppercase truncate group-hover:text-cyan-400 transition-colors">{p.name}</div>
                    <div className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{p.type}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="pt-2">
           <p className="text-[8px] text-white/20 uppercase tracking-widest text-center italic">Swap settlement requires counterparty acceptance.</p>
        </div>
      </div>
    </div>
);

export const ActiveLotteryModal = ({ activeLottery, setActiveLottery, completeLottery }: any) => (
    <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-3xl animate-fade-in">
      <button onClick={() => setActiveLottery(null)} className="absolute top-8 right-8 p-3 glass rounded-full hover:bg-white/10 transition-all shadow-xl"><X className="w-6 h-6" /></button>
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-yellow-400 leading-none mb-3 drop-shadow-glow">Protocol Roll</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Zora Entropy Active</p>
      </div>
      <ScratchCardComponent prize={activeLottery.prize} onComplete={completeLottery} />
      <div className="mt-12 animate-pulse text-yellow-500/40 text-[9px] font-black uppercase tracking-[0.6em]">Finalizing Settlement...</div>
    </div>
);

export const RecycleModal = ({ packToRecycle, setPackToRecycle, confirmRecycle }: any) => {
    const value = RARITY_CONFIG[packToRecycle.rarity as import('../types').Rarity].burnValue;
    return (
    <div className="fixed inset-0 z-[190] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-xs p-8 rounded-[3rem] border-fuchsia-500/20 animate-scale-in text-center shadow-2xl bg-black">
        <div className="w-20 h-20 bg-fuchsia-600/20 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-fuchsia-500/30 shadow-inner animate-pulse"><BatteryFull className="w-10 h-10 text-fuchsia-500" /></div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-white leading-none">Recycle Asset?</h3>
        <div className="text-[12px] font-black text-fuchsia-400 uppercase tracking-widest mb-1 leading-none">{packToRecycle.name}</div>
        <div className="bg-fuchsia-500/5 p-6 rounded-3xl mb-8 border border-fuchsia-500/10 text-center shadow-inner mt-4">
          <div className="text-[10px] font-black uppercase text-fuchsia-500/40 tracking-widest mb-2 leading-none italic">Instant Yield Settle</div>
          <div className="text-4xl font-black font-mono text-fuchsia-400 leading-none mb-1">+{value} <span className="text-xs font-bold text-fuchsia-500/40 tracking-widest">$PACKS</span></div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">≈ {formatUSD(value)} USD</div>
          <div className="text-[8px] text-white/20 uppercase mt-2 tracking-widest italic">Protocol Treasury Settle</div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={confirmRecycle} className="w-full py-5 bg-fuchsia-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] active:scale-95 shadow-xl border-b-4 border-fuchsia-800">Finalize Recycle</button>
          <button onClick={() => setPackToRecycle(null)} className="w-full py-4 text-white/40 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">Cancel</button>
        </div>
      </div>
    </div>
    );
};

export const OpeningPackModal = ({ packRipAnimation }: any) => (
    <div className="fixed inset-0 z-[220] bg-black flex flex-col items-center justify-center animate-fade-in backdrop-blur-3xl overflow-hidden">
      <div className="relative w-72 h-96 group">
        <div className={`absolute top-0 left-0 w-full h-1/2 transition-all duration-400 cubic-bezier(0.17, 0.67, 0.83, 0.67) ${packRipAnimation ? '-translate-y-full opacity-0 scale-110' : 'translate-y-0'}`}>
          <div className="w-full h-full bg-gradient-to-br from-fuchsia-600 to-cyan-600 rounded-t-[3rem] shadow-2xl flex items-end justify-center pb-6 border-t-4 border-white/40">
            <div className="w-3/4 h-1 bg-white/20 rounded-full blur-[1px]" />
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 w-full h-1/2 transition-all duration-400 cubic-bezier(0.17, 0.67, 0.83, 0.67) ${packRipAnimation ? 'translate-y-full opacity-0 scale-110' : 'translate-y-0'}`}>
          <div className="w-full h-full bg-gradient-to-br from-fuchsia-700 to-cyan-700 rounded-b-[3rem] shadow-2xl flex items-start justify-center pt-6 border-b-4 border-white/20">
            <BatteryFull className="w-16 h-16 text-white/30 animate-pulse" />
          </div>
        </div>
      </div>
      <p className="mt-8 text-cyan-400 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Ripping Strategy Bundle...</p>
    </div>
);

export const RevealDataModal = ({ revealData, setRevealData }: any) => (
    <div className="fixed inset-0 z-[210] bg-black/99 flex flex-col items-center p-4 animate-fade-in overflow-hidden backdrop-blur-3xl">
        <div className="text-center mt-8 mb-6 animate-scale-in px-4">
            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-3 leading-none italic">Bundle Settle Successful</div>
            <div className="flex items-end justify-center gap-3 mb-2">
              <span className="text-6xl font-black font-mono tracking-tighter text-yellow-400 leading-none drop-shadow-glow">{revealData.totalValue}</span>
              <span className="text-xl font-black text-white/40 mb-2">$PACKS</span>
            </div>
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">Total Pack Value</span>
            </div>
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-tight italic leading-tight mb-2 drop-shadow-glow">{revealData.message}</h2>
        </div>
        <div className="w-full flex-1 relative flex items-center justify-start overflow-x-auto no-scrollbar snap-x px-8 space-x-[-70px]">
            {revealData.coins.map((coin: CreatorCoin, i: number) => (
                <div key={i} className={`flex-shrink-0 w-[220px] h-[340px] glass p-5 rounded-[3rem] text-center border-2 animate-scale-in snap-center flex flex-col items-center justify-between shadow-2xl relative transition-all active:scale-95 stagger-${(i % 7) + 1} ${RARITY_CONFIG[coin.rarity].border} ${RARITY_CONFIG[coin.rarity].glow} bg-black/40 backdrop-blur-lg hover:z-50 hover:-translate-y-6`}>
                    <div className="relative z-10 w-full flex flex-col items-center pt-2">
                      <img src={coin.avatar} className="w-28 h-28 rounded-[2.5rem] border-4 border-black shadow-2xl mb-4" alt="Coin" />
                      <div className="text-[14px] font-black uppercase tracking-tight truncate w-full mb-1 leading-none italic">{coin.handle}</div>
                      <div className={`text-[9px] font-black uppercase ${RARITY_CONFIG[coin.rarity].color} tracking-widest mb-2 leading-none`}>{coin.rarity} SERIES</div>
                    </div>
                    <div className="w-full relative z-10 pb-2">
                      <div className="bg-white/5 py-3 px-4 rounded-[2rem] border border-white/10 w-full flex flex-col items-center gap-1 shadow-inner backdrop-blur-md">
                         <span className="text-[18px] font-black font-mono text-fuchsia-400 leading-none">{coin.value} <span className="text-[10px]">$PACKS</span></span>
                         <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">≈ {formatUSD(coin.value)}</span>
                      </div>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={() => setRevealData(null)} className="mb-10 w-full max-w-[280px] py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.5em] text-[12px] active:scale-95 transition-all shadow-xl border-4 border-black hover:bg-cyan-400 hover:text-white border-b-8">Add to Vault</button>
    </div>
);

export const WalletHubModal = ({ setShowWalletHub, stats, currency, zoraBalance, setActiveTab }: any) => (
    <div className="fixed inset-0 z-[180] bg-black/98 flex flex-col animate-slide-up">
      <div className="p-8 space-y-12 overflow-y-auto no-scrollbar pb-32">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">$PACKS SETTLEMENT</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Active Zora Protocol Session</span>
          </div>
          <button onClick={() => setShowWalletHub(false)} className="p-3 glass rounded-2xl active:scale-95 transition-all hover:bg-white/5"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-1 bg-white/5 shadow-lg">
            <div className="text-[9px] font-black uppercase text-white/30 tracking-widest italic leading-none">Net Worth</div>
            <div className="text-2xl font-black font-mono text-white leading-none">{stats.totalValue} <span className="text-[10px]">$PACKS</span></div>
            <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">≈ {formatUSD(stats.totalValue)} USD</div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-1 bg-white/5 shadow-lg">
            <div className="text-[9px] font-black uppercase text-white/30 tracking-widest italic leading-none">Current Yield</div>
            <div className={`text-2xl font-black font-mono leading-none ${stats.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.pnl >= 0 ? '+' : ''}{stats.pnl} <span className="text-[10px]">$PACKS</span>
            </div>
            <div className={`text-[8px] font-bold uppercase tracking-widest leading-none ${stats.pnl >= 0 ? 'text-green-500/40' : 'text-red-500/40'}`}>
              {stats.roi.toFixed(1)}% GROWTH
            </div>
          </div>
        </div>

        <div className="glass p-10 rounded-[4rem] border border-white/5 text-center space-y-2 relative overflow-hidden group shadow-2xl bg-gradient-to-br from-white/5 to-black">
          <div className="absolute inset-0 shimmer opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] mb-6 italic leading-none">Liquid Settle Balance</div>
            <div className="text-7xl font-black font-mono tracking-tighter text-fuchsia-400 mb-4 leading-none drop-shadow-glow">{currency}</div>
            <div className="text-xl font-bold text-white/20 uppercase tracking-widest mt-6 italic">≈ {formatUSD(currency)} USD</div>
          </div>
        </div>
        
        <div className="glass p-8 rounded-[3rem] border border-white/5 flex items-center justify-between relative overflow-hidden bg-black/40 shadow-xl">
            <div className="flex flex-col gap-1 text-left">
              <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] italic leading-none">On-Chain Zora</div>
              <div className="text-2xl font-black font-mono tracking-tighter text-cyan-400 leading-none drop-shadow-glow">{zoraBalance.toFixed(6)}</div>
            </div>
            <button onClick={() => { setActiveTab('swap'); setShowWalletHub(false); }} className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase active:scale-95 transition-all shadow-xl hover:bg-cyan-400 hover:text-white border-b-4 border-black">Protocol Settle</button>
        </div>
      </div>
    </div>
);

export const SelectedCoinModal = ({ selectedCoinForAction, setSelectedCoinForAction, setActiveTab, setCoinToRedeem }: any) => (
    <div className="fixed inset-0 z-[155] bg-black/95 flex flex-col animate-slide-up overflow-y-auto no-scrollbar">
      <div className="relative h-[45vh]">
        <div className={`absolute inset-0 rarity-glow opacity-30 ${RARITY_CONFIG[selectedCoinForAction.rarity as import('../types').Rarity].bg}`} />
        <img src={selectedCoinForAction.avatar} className="w-full h-full object-cover opacity-60 scale-110 blur-sm grayscale" alt="Asset" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <button onClick={() => setSelectedCoinForAction(null)} className="absolute top-8 left-8 p-3 glass rounded-2xl active:scale-95 shadow-lg border border-white/10 hover:bg-white/10 transition-all"><ArrowLeft className="w-5 h-5" /></button>
        <div className="absolute bottom-12 left-10 right-10 flex flex-col items-center text-center">
          <div className={`w-36 h-36 rounded-[3rem] border-4 border-black shadow-2xl overflow-hidden mb-6 animate-scale-in p-1 ${RARITY_CONFIG[selectedCoinForAction.rarity as import('../types').Rarity].bg}`}>
            <img src={selectedCoinForAction.avatar} className="w-full h-full object-cover rounded-[2.5rem]" alt="Avatar" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 drop-shadow-glow">{selectedCoinForAction.name}</h2>
          <div className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4 leading-none italic">{selectedCoinForAction.handle}</div>
          <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border border-white/10 glass shadow-lg ${RARITY_CONFIG[selectedCoinForAction.rarity as import('../types').Rarity].color}`}>
            {selectedCoinForAction.rarity} SERIES ASSET
          </div>
        </div>
      </div>
      <div className="px-10 space-y-8 pb-20">
        <div className="glass p-8 rounded-[3rem] border border-white/5 text-center relative overflow-hidden shadow-2xl bg-black/40">
          <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] mb-4 italic leading-none">Settlement Yield</div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl font-black font-mono tracking-tighter text-fuchsia-400 leading-none drop-shadow-glow">{selectedCoinForAction.value}</span>
            <div className="text-left leading-none flex flex-col gap-1">
              <span className="text-[14px] font-black text-white/40 uppercase tracking-widest">$PACKS</span>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{formatUSD(selectedCoinForAction.value)} USD</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => { setActiveTab('swap'); setSelectedCoinForAction(null); }} className="w-full py-6 glass border-white/10 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 active:scale-95 shadow-lg hover:bg-white/10 transition-all"><ArrowRightLeft className="w-5 h-5 text-cyan-400" /> Counterparty Swap</button>
          <button onClick={() => setCoinToRedeem(selectedCoinForAction)} className="w-full py-7 bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 rounded-3xl font-black uppercase tracking-widest text-[11px] active:scale-95 shadow-xl flex flex-col items-center justify-center gap-1.5 hover:bg-cyan-600/20 transition-all border-b-4 border-cyan-800">
            <div className="flex items-center gap-3"><BatteryFull className="w-5 h-5" /><span>Redeem Asset</span></div>
            <span className="text-[10px] opacity-40 italic">Finalize Settlement</span>
          </button>
        </div>
      </div>
    </div>
);

export const RedeemCoinModal = ({ coinToRedeem, setCoinToRedeem, confirmCoinRedemption }: any) => (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-xs p-8 rounded-[3rem] border-cyan-500/20 animate-scale-in text-center shadow-2xl bg-black">
        <div className="w-20 h-20 bg-cyan-600/20 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-cyan-500/30 shadow-inner animate-pulse"><BatteryFull className="w-10 h-10 text-cyan-500" /></div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-white leading-none">Redeem Asset?</h3>
        <div className="text-[12px] font-black text-cyan-400 uppercase tracking-widest mb-1 leading-none">{coinToRedeem.name}</div>
        <div className="bg-cyan-500/5 p-6 rounded-3xl mb-8 border border-cyan-500/10 text-center shadow-inner mt-4">
          <div className="text-[10px] font-black uppercase text-cyan-500/40 tracking-widest mb-2 leading-none italic">Instant Yield Settle</div>
          <div className="text-4xl font-black font-mono text-cyan-400 leading-none mb-1">+{coinToRedeem.value} <span className="text-xs font-bold text-cyan-500/40 tracking-widest">$PACKS</span></div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">≈ {formatUSD(coinToRedeem.value)} USD</div>
          <div className="text-[8px] text-white/20 uppercase mt-2 tracking-widest italic">Protocol Treasury Settle</div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={confirmCoinRedemption} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] active:scale-95 shadow-xl border-b-4 border-cyan-800">Confirm Redeem</button>
          <button onClick={() => setCoinToRedeem(null)} className="w-full py-4 text-white/40 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">Cancel</button>
        </div>
      </div>
    </div>
);
