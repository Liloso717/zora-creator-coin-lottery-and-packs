
import React from 'react';
import { ShoppingBag, Gift, Trophy, Package, Sparkles, Zap, ArrowLeft, Share2, Star, BatteryFull, X, CheckCircle2, Info, Wallet, Coins, Search, User, Briefcase, Repeat, Send, Clock, ArrowRightLeft, Loader2, ArrowDownLeft, ArrowUpRight, Scissors, TrendingUp, ShieldCheck, Award, Plus, Minus, Layers, Flame, DollarSign, ExternalLink, Globe, Twitter, MessageSquare, BriefcaseIcon, UserCircle2, BarChart3, Handshake, History, UserPlus, HelpCircle, BookOpen, Activity, LayoutGrid, Filter, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { Pack, CreatorCoin, LotteryTicket, TradeOffer, PackDraft, LeaderboardCategory, UserStats } from '../types';
import { RARITY_CONFIG, ONBOARDING_TIPS, CREATORS, INITIAL_LEADERBOARD } from '../constants';
import { formatUSD, SimpleTooltip, LOTTERY_PRICE, PACKS_PRICE_USD, ZORA_PRICE_USD } from './Shared';

export const MarketTab = ({ 
  showTips, setShowTips, canClaimDaily, claimDaily, lottoSearchTerm, setLottoSearchTerm, 
  filteredLottoCreators, lotteryQuantities, setLotteryQuantities, buyLottery, openProfile,
  searchTerm, setSearchTerm, sortBy, setSortBy, filteredPacks, setViewingPack, setConfirmingPurchase, getPackRoi
}: any) => (
  <div className="space-y-12 animate-slide-up">
    {showTips && (
      <section className="bg-gradient-to-br from-cyan-600/10 via-black to-black border border-cyan-500/20 rounded-[2.5rem] p-6 relative overflow-hidden animate-slide-up">
        <button onClick={() => setShowTips(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors p-1"><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-cyan-500/20 rounded-lg"><Activity className="w-4 h-4 text-cyan-400" /></div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400">Protocol Analytics</h4>
        </div>
        <div className="space-y-5">
          {ONBOARDING_TIPS.map((tip: any, idx: number) => (
            <div key={idx} className="flex gap-4 items-start group">
              <div className="p-2.5 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">{tip.icon}</div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-tight leading-none mb-1.5">{tip.title}</div>
                <p className="text-[10px] text-white/40 leading-snug font-medium">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    <SimpleTooltip text="Get free packs and tickets every 24 hours">
      <div className={`glass p-8 rounded-[3rem] relative overflow-hidden group border-2 transition-all ${canClaimDaily ? 'border-fuchsia-500 shadow-fuchsia-500/20' : 'border-white/5 opacity-80'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-all">
            <Gift className="w-24 h-24 text-fuchsia-400" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
              <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-1">Daily Settlement</h2>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] max-w-[200px]">Secure your protocol-backed collection daily</p>
              </div>
              {canClaimDaily ? (
                  <button onClick={claimDaily} className="px-10 py-4 bg-fuchsia-500 text-white rounded-full font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Claim Allocation</button>
              ) : (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20 tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5">
                    <Clock className="w-3 h-3" /> 24h Settlement Lock
                  </div>
              )}
          </div>
      </div>
    </SimpleTooltip>

    <section className="space-y-6">
        <div className="px-2">
            <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] italic flex items-center gap-2 mb-1">
               <Zap className="w-4 h-4 text-yellow-500" /> High-Octane Lotto
            </h3>
        </div>
        
        <div className="px-2 mb-4 relative">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
             <input 
                 type="text" 
                 placeholder="Find creator lotto..." 
                 value={lottoSearchTerm}
                 onChange={(e) => setLottoSearchTerm(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[10px] font-bold uppercase tracking-wider placeholder:text-white/20 outline-none focus:border-yellow-500/50 transition-all text-white"
             />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar snap-x snap-mandatory">
           {filteredLottoCreators.length > 0 ? filteredLottoCreators.map((creator: CreatorCoin) => {
              const qty = lotteryQuantities[creator.id] || 1;
              const price = LOTTERY_PRICE * qty;
              return (
                <div key={creator.id} className="snap-center flex-shrink-0 w-44 glass p-5 rounded-[2.5rem] text-center border-white/5 group hover:border-yellow-500/20 transition-all bg-black/20">
                   <div className="relative mb-3 cursor-pointer" onClick={() => openProfile(creator.name)}>
                      <img src={creator.avatar} className="w-16 h-16 rounded-2xl mx-auto border-2 border-black group-hover:scale-105 transition-transform" alt="c" />
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 shadow-lg"><Star className="w-3 h-3 text-black" /></div>
                   </div>
                   <div className="text-[12px] font-black uppercase tracking-tighter text-yellow-500 truncate mb-2 leading-none">{creator.handle}</div>
                   <div className="bg-black/40 rounded-xl p-2 mb-3 border border-white/5 flex items-center justify-between">
                      <button onClick={() => setLotteryQuantities((p: any) => ({...p, [creator.id]: Math.max(1, (p[creator.id] || 1) - 1)}))} className="p-1 text-white/40 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-mono font-black">{qty}</span>
                      <button onClick={() => setLotteryQuantities((p: any) => ({...p, [creator.id]: (p[creator.id] || 1) + 1}))} className="p-1 text-white/40 hover:text-white"><Plus className="w-3 h-3" /></button>
                   </div>
                   <div className="mb-2">
                     <div className="text-[10px] font-black font-mono text-yellow-500 leading-none mb-0.5">{price} $PACKS</div>
                     <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">≈ {formatUSD(price)}</div>
                   </div>
                   <button onClick={() => buyLottery(creator)} className="w-full bg-yellow-500 text-black py-2.5 rounded-xl text-[9px] font-black uppercase active:scale-95 shadow-lg">Buy Tickets</button>
                </div>
              );
           }) : (
             <div className="text-center w-full py-8 text-white/30 text-[10px] font-black uppercase tracking-widest italic">No creators match "{lottoSearchTerm}"</div>
           )}
        </div>
    </section>

    <div className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
                type="text" 
                placeholder="Search packs, curators..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-[11px] font-bold uppercase tracking-wider placeholder:text-white/20 outline-none focus:border-cyan-500/50 transition-all text-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setSortBy('newest')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all border ${sortBy === 'newest' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white/40'}`}>
              <Calendar className="w-3 h-3" /> Newest
            </button>
            <button onClick={() => setSortBy('price_asc')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all border ${sortBy === 'price_asc' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 border-white/5 text-white/40'}`}>
              <ArrowDown className="w-3 h-3" /> Price
            </button>
            <button onClick={() => setSortBy('price_desc')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all border ${sortBy === 'price_desc' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 border-white/5 text-white/40'}`}>
              <ArrowUp className="w-3 h-3" /> Price
            </button>
            <button onClick={() => setSortBy('rarity')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all border ${sortBy === 'rarity' ? 'bg-fuchsia-500 text-white border-fuchsia-500' : 'bg-white/5 border-white/5 text-white/40'}`}>
              <Star className="w-3 h-3" /> Rarity
            </button>
          </div>
        </div>
    </div>

    <div className="grid grid-cols-1 gap-8 pb-12">
        {filteredPacks.length > 0 ? filteredPacks.map((p: Pack) => (
            <div 
              key={p.id} 
              onClick={() => setViewingPack(p)}
              className="glass rounded-[3rem] overflow-hidden border border-white/10 group cursor-pointer transition-all hover:border-white/20 relative active:scale-[0.98]"
            >
                <div className="absolute top-6 left-6 z-10">
                    <div className="bg-green-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg border border-black flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{getPackRoi(p.id, p.rarity)}% Est. ROI
                    </div>
                </div>

                <div className="relative h-72">
                    <img src={p.image} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" alt="Pack" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-10">
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase glass border border-white/10 ${RARITY_CONFIG[p.rarity].color}`}>{p.rarity}</span>
                      <span className="px-4 py-1.5 rounded-full text-[8px] font-black uppercase bg-black/60 text-cyan-400 border border-cyan-400/30 backdrop-blur-md shadow-lg">Burn: +{RARITY_CONFIG[p.rarity].burnValue} $PACKS</span>
                    </div>
                    <div className="absolute bottom-6 left-8 z-10">
                        <div className="text-4xl font-black italic uppercase tracking-tighter mb-1 leading-none">{p.name}</div>
                        <div 
                          onClick={(e) => { e.stopPropagation(); openProfile(p.curatorName); }}
                          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors inline-block py-1 cursor-pointer"
                        >
                          Curated by {p.curatorName}
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-black/40 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Protocol Fee</div>
                      <div className="text-right">
                        <div className="text-xl font-black font-mono leading-none text-fuchsia-400">{p.price} $PACKS</div>
                        <div className="text-[9px] font-bold text-white/30 uppercase mt-1 leading-none">{formatUSD(p.price)} USD</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setConfirmingPurchase(p); }} 
                      className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-[11px] active:scale-95 shadow-2xl transition-all hover:bg-fuchsia-500 hover:text-white"
                    >
                      Secure Bundle
                    </button>
                </div>
            </div>
        )) : (
          <div className="text-center py-20 text-white/30 text-[10px] font-black uppercase tracking-widest">No strategies found</div>
        )}
    </div>
  </div>
);

export const VaultTab = ({ 
  vaultSubTab, setVaultSubTab, totalVaultWorth, stats, groupedTickets, 
  setActiveLottery, consolidatedPacks, openPack, setTradingPack, setPackToRecycle, 
  consolidatedCoins, setSelectedCoinForAction, tradeOffers, handleTradeAction, vault
}: any) => (
  <div className="space-y-12 animate-slide-up pb-12">
    <div className="flex items-center justify-between px-2">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Vault</h2>
      <div className="flex gap-2 glass p-1 rounded-2xl border border-white/5 bg-white/5">
        <button onClick={() => setVaultSubTab('inventory')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${vaultSubTab === 'inventory' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-white/40'}`}>Inventory</button>
        <button onClick={() => setVaultSubTab('trades')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${vaultSubTab === 'trades' ? 'bg-cyan-600 text-white shadow-lg' : 'text-white/40'}`}>Trades</button>
      </div>
    </div>

    {vaultSubTab === 'inventory' ? (
      <div className="space-y-12">
        <div className="grid grid-cols-2 gap-4 px-2">
          <div className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1.5 bg-gradient-to-br from-fuchsia-500/10 to-transparent">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-fuchsia-400">Vault Worth</span>
            <span className="text-2xl font-black font-mono leading-none">{totalVaultWorth} <span className="text-[10px]">$PACKS</span></span>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">≈ {formatUSD(totalVaultWorth)} USD</span>
          </div>
          
          <div className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1.5 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-400">Lifetime PnL</span>
              <div className={`text-2xl font-black font-mono leading-none ${stats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.pnl >= 0 ? '+' : ''}{stats.pnl} <span className="text-[10px]">$PACKS</span>
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${stats.pnl >= 0 ? 'text-green-500/50' : 'text-red-500/50'}`}>
                  {stats.roi.toFixed(1)}% ROI
              </span>
          </div>
        </div>

        <section className="space-y-6">
            <div className="px-2 flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] flex items-center gap-2 leading-none italic">
                <Zap className="w-3.5 h-3.5" /> High-Octane Rolls
              </h3>
              <span className="text-[9px] font-mono text-white/20 uppercase">{vault.tickets.length} TICKETS</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {groupedTickets.map((group: any, i: number) => (
                  <div key={i} className="glass p-5 rounded-[2.5rem] flex items-center justify-between border-yellow-500/20 group transition-all hover:border-yellow-500/40 bg-gradient-to-br from-yellow-500/5 to-black shadow-lg">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-yellow-500/30 flex items-center justify-center relative shadow-inner">
                          <Layers className="w-7 h-7 text-yellow-500" />
                          {group.count > 1 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xl border-2 border-black">x{group.count}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-[13px] font-black uppercase italic tracking-tighter mb-1 leading-none">{group.prize?.handle || 'Mystery Coin'}</div>
                          <div className="text-[8px] font-bold uppercase text-yellow-500/60 tracking-[0.2em] leading-none">Ready to Rip</div>
                        </div>
                     </div>
                     <button onClick={() => setActiveLottery(group.tickets[0])} className="px-6 py-2.5 bg-yellow-500 text-black rounded-xl font-black uppercase text-[10px] active:scale-95 shadow-xl hover:shadow-yellow-500/40 transition-all border-b-4 border-yellow-700">Reveal</button>
                  </div>
               ))}
               {vault.tickets.length === 0 && <div className="p-10 text-center glass rounded-[2.5rem] border-dashed text-white/20 text-[10px] font-black uppercase tracking-widest italic opacity-50">Lotto Queue Empty</div>}
            </div>
        </section>

        <section className="space-y-6">
            <div className="px-2 flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.5em] flex items-center gap-2 leading-none italic">
                <Package className="w-3.5 h-3.5" /> Strategy Bundles
              </h3>
              <span className="text-[9px] font-mono text-white/20 uppercase">{consolidatedPacks.length} TYPES</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
               {consolidatedPacks.map((group: any, i: number) => (
                  <div key={i} className={`glass p-6 rounded-[3rem] border ${RARITY_CONFIG[group.pack.rarity as import('../types').Rarity].border} group transition-all overflow-hidden relative bg-black/40 shadow-xl`}>
                     <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                           <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${RARITY_CONFIG[group.pack.rarity as import('../types').Rarity].bg} border border-white/5 shadow-inner transition-transform group-hover:scale-105 relative`}>
                              <Package className={`w-10 h-10 ${RARITY_CONFIG[group.pack.rarity as import('../types').Rarity].color}`} />
                              {group.count > 1 && (
                                <div className="absolute -top-3 -right-3 bg-white text-black text-[12px] font-black px-3 py-1 rounded-full shadow-2xl border-4 border-black">x{group.count}</div>
                              )}
                           </div>
                           <div>
                             <div className="text-xl font-black uppercase italic tracking-tighter leading-none mb-1">{group.pack.name}</div>
                             <div className={`text-[10px] font-black uppercase ${RARITY_CONFIG[group.pack.rarity as import('../types').Rarity].color} tracking-[0.2em] leading-none mb-4`}>{group.pack.rarity} SERIES</div>
                             <div className="flex flex-col gap-1.5">
                                <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5"><Flame className="w-3 h-3" /> Burn for +{RARITY_CONFIG[group.pack.rarity as import('../types').Rarity].burnValue} $PACKS</div>
                                <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Verified Strategy</div>
                             </div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <button onClick={() => openPack(group.ids[0])} className="px-6 py-3 bg-white text-black rounded-2xl font-black uppercase text-[10px] active:scale-95 shadow-xl flex items-center gap-2 justify-center transition-all hover:bg-cyan-400 hover:text-white border-b-4 border-white/20"><Scissors className="w-3 h-3" /> Rip Pack</button>
                           <div className="flex gap-2">
                              <button onClick={() => setTradingPack(group)} className="flex-1 p-3 glass rounded-xl text-cyan-400 border border-cyan-500/20 active:scale-95 transition-all shadow-lg flex items-center justify-center hover:bg-cyan-500/10"><Handshake className="w-4 h-4" /></button>
                              <button onClick={() => setPackToRecycle(group.pack)} className="flex-1 p-3 glass rounded-xl text-fuchsia-400 border border-fuchsia-500/20 active:scale-95 transition-all shadow-lg flex items-center justify-center hover:bg-fuchsia-500/10"><BatteryFull className="w-4 h-4" /></button>
                           </div>
                        </div>
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                  </div>
               ))}
               {vault.packs.length === 0 && <div className="p-10 text-center glass rounded-[2.5rem] border-dashed text-white/20 text-[10px] font-black uppercase tracking-widest italic opacity-50">Strategy Vault Empty</div>}
            </div>
        </section>
        
        <section className="space-y-6">
            <div className="px-2 flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] flex items-center gap-2 leading-none italic">
                <Coins className="w-4 h-4" /> Secured Coins
              </h3>
              <span className="text-[9px] font-mono text-white/20 uppercase">{consolidatedCoins.length} TYPES</span>
            </div>
            <div className="grid grid-cols-3 gap-4 px-1 pb-12">
                {consolidatedCoins.map((group: any, i: number) => (
                    <div key={i} onClick={() => setSelectedCoinForAction(group.coin)} className="glass p-4 rounded-3xl border border-white/5 text-center group cursor-pointer hover:border-white/20 transition-all hover:-translate-y-1 bg-black/40 relative">
                        {group.count > 1 && (
                          <div className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border-2 border-black z-20">x{group.count}</div>
                        )}
                        <div className="relative mb-3">
                          <img src={group.coin.avatar} className="w-full aspect-square rounded-2xl border-2 border-black group-hover:scale-105 transition-transform shadow-lg" alt="asset" />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-tighter truncate leading-none mb-1.5">{group.coin.handle}</div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="font-black font-mono text-fuchsia-400 text-[11px] leading-none">{group.coin.value * group.count} <span className="text-[7px] font-sans">$PACKS</span></div>
                          <span className="text-[7px] text-white/20 uppercase font-black tracking-widest">Settle Val</span>
                        </div>
                    </div>
                ))}
                {consolidatedCoins.length === 0 && <div className="col-span-3 p-10 text-center glass rounded-[2.5rem] border-dashed text-white/20 text-[10px] font-black uppercase tracking-widest italic opacity-50">Inventory Empty</div>}
            </div>
        </section>
      </div>
    ) : (
      <div className="space-y-10 animate-slide-up">
        <section className="space-y-6">
          <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] px-2 italic flex items-center gap-2 leading-none"><ArrowRightLeft className="w-4 h-4 text-cyan-400" /> Peer Swap Proposals</h3>
          {tradeOffers.filter((t: TradeOffer) => t.receiver === 'You').map((trade: TradeOffer, i: number) => (
            <div key={i} className="glass p-6 rounded-[2.5rem] border-cyan-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={trade.offeredPack.image} className="w-10 h-10 rounded-full border border-white/10 object-cover" alt="p" />
                  <div>
                    <div className="text-[12px] font-black uppercase italic leading-none">{trade.sender}</div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Direct Swap Offer</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/40 p-5 rounded-3xl border border-white/5 shadow-inner">
                <div className="flex-1 text-center">
                  <div className="text-[8px] font-bold text-white/20 uppercase mb-2">Peer Gives</div>
                  <div className="text-[11px] font-black uppercase truncate">{trade.offeredPack.name}</div>
                  <div className="text-[9px] font-mono text-cyan-400 mt-1 font-bold">x{trade.offeredQuantity} ({trade.offeredValue} $PACKS)</div>
                  <div className="text-[8px] font-bold text-white/20 uppercase mt-0.5">≈ {formatUSD(trade.offeredValue)}</div>
                </div>
                <ArrowRightLeft className="w-6 h-6 text-white/10 animate-pulse" />
                <div className="flex-1 text-center">
                  <div className="text-[8px] font-bold text-white/20 uppercase mb-2">You Give</div>
                  <div className="text-[11px] font-black uppercase truncate">{trade.requestedPack?.name || 'Rare Selection'}</div>
                  <div className="text-[9px] font-mono text-fuchsia-400 mt-1 font-bold">x{trade.requestedQuantity} ({trade.requestedValue} $PACKS)</div>
                  <div className="text-[8px] font-bold text-white/20 uppercase mt-0.5">≈ {formatUSD(trade.requestedValue)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleTradeAction(trade, 'accept')} className="py-3 bg-cyan-600 text-white rounded-xl font-black uppercase text-[10px] active:scale-95 shadow-lg hover:bg-cyan-500 transition-all border-b-4 border-cyan-800">Accept Swap</button>
                <button onClick={() => handleTradeAction(trade, 'decline')} className="py-3 glass text-white/40 rounded-xl font-black uppercase text-[10px] active:scale-95 hover:bg-white/5 transition-all">Decline</button>
              </div>
            </div>
          ))}
          {tradeOffers.filter((t: TradeOffer) => t.receiver === 'You').length === 0 && <div className="p-10 text-center glass rounded-[2.5rem] border-dashed text-white/20 text-[10px] font-black uppercase tracking-widest italic opacity-50">No active swap offers</div>}
        </section>
      </div>
    )}
  </div>
);

export const CurateTab = ({ packDraft, setPackDraft, availableCurationCoins, publishPack, setActiveTab }: any) => (
  <div className="space-y-12 animate-slide-up pb-12">
    <div className="px-2 text-center">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1">Strategy Studio</h2>
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Design protocol strategies for $PACKS rewards</p>
    </div>
    <div className="glass p-8 rounded-[3rem] space-y-8 shadow-2xl border-white/10 bg-black/30">
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-2 italic leading-none">Bundle Identifier</label>
        <input type="text" placeholder="STRATEGY NAME..." value={packDraft.name} onChange={(e) => setPackDraft({...packDraft, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-black uppercase tracking-tighter italic text-xl focus:border-cyan-500 outline-none transition-all shadow-inner placeholder:text-white/10" />
      </div>
      
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-2 italic leading-none">Minting Yield ($PACKS)</label>
        <div className="relative group">
           <input type="number" placeholder="100" value={packDraft.price} onChange={(e) => setPackDraft({...packDraft, price: Math.max(0, parseInt(e.target.value) || 0)})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-black font-mono text-2xl text-cyan-400 focus:border-cyan-500 outline-none transition-all shadow-inner placeholder:text-white/10" />
           <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
             <button onClick={() => setPackDraft((p: any) => ({...p, price: Math.max(0, p.price - 50)}))} className="p-2 glass rounded-xl text-white/40 hover:text-white"><Minus className="w-4 h-4" /></button>
             <button onClick={() => setPackDraft((p: any) => ({...p, price: p.price + 50}))} className="p-2 glass rounded-xl text-white/40 hover:text-white"><Plus className="w-4 h-4" /></button>
           </div>
        </div>
        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-2 mt-1">≈ {formatUSD(packDraft.price)} USD Value</div>
        <div className="px-2 py-4 rounded-2xl bg-white/5 border border-white/10 mt-3 space-y-2">
           <div className="flex justify-between items-center">
              <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Est. Curator Royalty (5%)</span>
              <span className="text-[10px] font-black font-mono text-green-400">{Math.floor(packDraft.price * 0.05)} $PACKS / mint</span>
           </div>
           <p className="text-[7px] text-white/10 uppercase tracking-widest leading-relaxed">Royalties are settled on-chain to your connected wallet upon every protocol mint.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-2 italic leading-none">Strategy Slots (7/7)</label>
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto no-scrollbar p-3 glass-dark rounded-3xl border border-white/10 shadow-inner">
            {availableCurationCoins.map((c: CreatorCoin, idx: number) => {
            const isSelected = packDraft.selectedCoins.some((sc: any) => sc.id === c.id);
            return (
                <div key={idx} onClick={() => {
                if (isSelected) setPackDraft({...packDraft, selectedCoins: packDraft.selectedCoins.filter((sc: any) => sc.id !== c.id)});
                else if (packDraft.selectedCoins.length < 7) setPackDraft({...packDraft, selectedCoins: [...packDraft.selectedCoins, c]});
                }} className={`cursor-pointer transition-all p-4 rounded-2xl border flex items-center justify-between ${isSelected ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                <div className="flex items-center gap-4">
                    <img src={c.avatar} className="w-12 h-12 rounded-xl object-cover shadow-md" alt="c" />
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-tighter leading-none mb-1">{c.name}</div>
                      <div className={`text-[8px] font-bold uppercase ${RARITY_CONFIG[c.rarity].color} leading-none tracking-widest`}>{c.rarity} SERIES</div>
                    </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 transition-all ${isSelected ? 'text-cyan-500 scale-110' : 'text-white/5'}`} />
                </div>
            );
            })}
            {availableCurationCoins.length === 0 && (
              <div className="p-8 text-center text-white/20 text-[10px] font-black uppercase tracking-widest italic">Strategy Vault Empty - Rip packs to start curating</div>
            )}
        </div>
      </div>
      <div className="text-center">
         <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${packDraft.selectedCoins.length === 7 ? 'text-cyan-400' : 'text-white/20'}`}>
           {packDraft.selectedCoins.length} / 7 Locked
         </span>
      </div>
      <button onClick={publishPack} disabled={packDraft.selectedCoins.length !== 7 || !packDraft.name} className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] transition-all shadow-xl active:scale-95 border-b-8 border-black ${packDraft.selectedCoins.length === 7 && packDraft.name ? 'bg-white text-black hover:bg-cyan-400 hover:text-white' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}>Publish Strategy</button>
    </div>
  </div>
);

export const SwapTab = ({ swapInput, setSwapInput, swapDirection, setSwapDirection, currency, zoraBalance, executeSwap }: any) => (
  <div className="space-y-12 animate-slide-up pb-12">
    <div className="px-2 text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1">Protocol Settlement</h2>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Swap $PACKS assets to Zora liquidity</p>
    </div>

    <div className="grid grid-cols-2 gap-4 px-2">
         <SimpleTooltip text="Current network exchange rate">
           <div className="glass p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-1 bg-white/5">
              <div className="text-[8px] font-black uppercase text-cyan-400 tracking-widest">Protocol Rate</div>
              <div className="text-[10px] font-black font-mono">1 $PACKS = {(PACKS_PRICE_USD / ZORA_PRICE_USD).toFixed(6)} ZORA</div>
           </div>
         </SimpleTooltip>
         <SimpleTooltip text="Real-time fiat value">
           <div className="glass p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-1 bg-white/5">
              <div className="text-[8px] font-black uppercase text-fuchsia-400 tracking-widest">USD Oracle</div>
              <div className="text-[10px] font-black font-mono">1 $PACKS = ${PACKS_PRICE_USD.toFixed(2)} USD</div>
           </div>
         </SimpleTooltip>
    </div>

    <div className="glass p-8 rounded-[3rem] space-y-6 shadow-2xl relative border-white/10 bg-black/20">
        <div className="flex items-center justify-between px-2 text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
          <span>Current Liquidity</span>
          <span>{swapDirection === 'packs-to-zora' ? `${currency} $PACKS` : `${zoraBalance.toFixed(6)} ZORA`}</span>
        </div>
        <div className="flex flex-col gap-2">
            <div className="glass-dark p-6 rounded-[2.5rem] border border-white/10 flex flex-col gap-2 relative shadow-inner">
                <span className="text-[9px] font-black text-fuchsia-400 uppercase tracking-widest">Outbound Yield</span>
                <div className="flex items-center justify-between">
                    <input type="number" placeholder="0.00" value={swapInput} onChange={(e) => setSwapInput(e.target.value)} className="bg-transparent text-3xl font-black font-mono outline-none w-full placeholder:text-white/5" />
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                        <span className="text-sm font-black italic">{swapDirection === 'packs-to-zora' ? '$PACKS' : 'ZORA'}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center -my-6 relative z-10">
                <button onClick={() => setSwapDirection((d: any) => d === 'packs-to-zora' ? 'zora-to-packs' : 'packs-to-zora')} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center border-4 border-black shadow-2xl active:rotate-180 transition-all hover:scale-110">
                    <ArrowDownLeft className="w-6 h-6" />
                </button>
            </div>
            <div className="glass-dark p-6 rounded-[2.5rem] border border-white/10 flex flex-col gap-2 shadow-inner">
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Protocol Settlement</span>
                <div className="flex items-center justify-between">
                    <div className="text-3xl font-black font-mono text-white/30 truncate pr-4">
                      {swapInput ? (swapDirection === 'packs-to-zora' ? ((parseFloat(swapInput) * PACKS_PRICE_USD) / ZORA_PRICE_USD).toFixed(6) : (parseFloat(swapInput) * ZORA_PRICE_USD / PACKS_PRICE_USD).toFixed(0)) : '0.00'}
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                        <span className="text-sm font-black italic">{swapDirection === 'packs-to-zora' ? 'ZORA' : '$PACKS'}</span>
                    </div>
                </div>
            </div>
        </div>
        <button onClick={executeSwap} disabled={!swapInput} className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 border-b-8 border-black ${swapInput ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}>
          <BatteryFull className="w-5 h-5" />
          {swapDirection === 'packs-to-zora' ? 'Settle to Zora' : 'Deposit $PACKS'}
        </button>
    </div>
  </div>
);

export const LeaderboardTab = ({ leaderboardCat, setLeaderboardCat, filteredLeaderboard, openProfile }: any) => (
  <div className="space-y-12 animate-slide-up">
     <div className="px-2">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1">Protocol Rankings</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4">
           {['Global', 'Curators', 'Collectors', 'Gas Kings'].map((cat) => (
              <button key={cat} onClick={() => setLeaderboardCat(cat as any)} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase border transition-all whitespace-nowrap ${leaderboardCat === cat ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}>{cat}</button>
           ))}
        </div>
     </div>
     <div className="space-y-4 pb-12 px-1">
       {filteredLeaderboard.map((entry: any, i: number) => (
         <div key={i} className="glass p-6 rounded-[2.5rem] flex items-center justify-between border-white/5 group hover:bg-white/5 transition-all cursor-pointer" onClick={() => openProfile(entry.name)}>
           <div className="flex items-center gap-6">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${i < 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-white/20'}`}>{i + 1}</div>
             <div className="flex items-center gap-4">
                {entry.avatar && <img src={entry.avatar} className="w-14 h-14 rounded-2xl border border-white/10 object-cover shadow-lg" alt="av" />}
                <div><div className="font-black text-xl italic uppercase tracking-tight group-hover:text-fuchsia-400 transition-colors leading-none mb-1">{entry.name}</div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">{entry.type === 'Gas King' ? 'Top Recycler' : entry.type}</div></div>
           </div>
           </div>
           <div className="text-right">
              <div className="font-black font-mono text-xl leading-none text-white">{entry.value.toLocaleString()}</div>
              <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">{entry.type === 'Gas King' ? 'Total Burned' : '$PACKS'}</div>
           </div>
         </div>
       ))}
     </div>
  </div>
);
