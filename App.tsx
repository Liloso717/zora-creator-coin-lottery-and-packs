
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ShoppingBag, Package, Trophy, ArrowRightLeft, Loader2, Wallet, X, MessageSquare, Send, CheckCircle2, Info, Briefcase } from 'lucide-react';
import { CreatorCoin, Pack, UserStats, Rarity, CreatorProfile, PackDraft, TradeOffer, LotteryTicket, LeaderboardCategory } from './types';
import { CREATORS, INITIAL_LEADERBOARD, getCreatorProfile, TICKER_ITEMS, RARITY_CONFIG } from './constants';
import { generatePackRevealText, createBiggsChat } from './services/geminiService';
import { Chat } from '@google/genai';
import { LOTTERY_PRICE, PACKS_PRICE_USD, ZORA_PRICE_USD, SimpleTooltip, formatUSD } from './components/Shared';
import { MarketTab, VaultTab, CurateTab, SwapTab, LeaderboardTab } from './components/Tabs';
import { ViewingPackModal, LottoConfirmationModal, TradingPackModal, ActiveLotteryModal, RecycleModal, OpeningPackModal, RevealDataModal, WalletHubModal, SelectedCoinModal, RedeemCoinModal, PackPurchaseConfirmationModal } from './components/GameModals';

const INITIAL_BALANCE = 5000;

export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'market' | 'vault' | 'curate' | 'swap' | 'leaderboard'>('market');
  const [vaultSubTab, setVaultSubTab] = useState<'inventory' | 'trades'>('inventory');
  const [currency, setCurrency] = useState(INITIAL_BALANCE);
  const [totalInvested, setTotalInvested] = useState(0);
  const [zoraBalance, setZoraBalance] = useState(0.42);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showTips, setShowTips] = useState(true);
  
  const [vault, setVault] = useState<{ packs: Pack[]; tickets: LotteryTicket[]; coins: CreatorCoin[] }>({
    packs: [],
    tickets: [],
    coins: CREATORS.slice(0, 3)
  });
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [marketplacePacks, setMarketplacePacks] = useState<Pack[]>([]);
  const [revealData, setRevealData] = useState<{ coins: CreatorCoin[]; message: string; totalValue: number } | null>(null);
  const [activeLottery, setActiveLottery] = useState<LotteryTicket | null>(null);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [packRipAnimation, setPackRipAnimation] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<CreatorProfile | null>(null);
  const [selectedCoinForAction, setSelectedCoinForAction] = useState<CreatorCoin | null>(null);
  const [viewingPack, setViewingPack] = useState<Pack | null>(null);
  const [lastDailyClaim, setLastDailyClaim] = useState<number>(0);
  const [showWalletHub, setShowWalletHub] = useState(false);
  
  const [confirmingPurchase, setConfirmingPurchase] = useState<Pack | null>(null);
  const [packToRecycle, setPackToRecycle] = useState<Pack | null>(null);
  const [coinToRedeem, setCoinToRedeem] = useState<CreatorCoin | null>(null);
  const [tradingPack, setTradingPack] = useState<{ pack: Pack; count: number; ids: string[] } | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [lottoConfirmation, setLottoConfirmation] = useState<{ creator: CreatorCoin | undefined; quantity: number; cost: number } | null>(null);

  const [leaderboardCat, setLeaderboardCat] = useState<LeaderboardCategory>('Global');

  const [swapInput, setSwapInput] = useState<string>('');
  const [swapDirection, setSwapDirection] = useState<'packs-to-zora' | 'zora-to-packs'>('packs-to-zora');
  
  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [lottoSearchTerm, setLottoSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rarity'>('newest');

  // Biggs Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openProfile = useCallback((name: string) => {
    const creator = CREATORS.find(c => c.name === name) || {
      id: 'temp-' + name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      handle: `$${name.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: `https://picsum.photos/seed/${name}/200`,
      rarity: 'Common' as Rarity,
      value: 0
    };
    setViewingProfile(getCreatorProfile(creator));
  }, []);

  const [lotteryQuantities, setLotteryQuantities] = useState<Record<string, number>>(
    Object.fromEntries(CREATORS.map(c => [c.id, 1]))
  );

  const [packDraft, setPackDraft] = useState<PackDraft>({
    name: '',
    price: 100,
    rarity: 'Common',
    category: 'Art',
    selectedCoins: []
  });

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      showToast("Wallet Connected to Zora", "success");
    }, 1500);
  };

  const stats = useMemo<UserStats>(() => {
    const coinValue = vault.coins.reduce((acc, c) => acc + c.value, 0);
    const packValue = vault.packs.reduce((acc, p) => acc + p.price, 0);
    const totalValue = currency + coinValue + packValue;
    const pnl = totalValue - INITIAL_BALANCE;
    const roi = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;
    return {
      packsBalance: currency,
      totalInvested,
      totalValue,
      pnl,
      roi
    };
  }, [currency, vault.coins, vault.packs, totalInvested]);

  const filteredPacks = useMemo(() => {
    let result = [...marketplacePacks];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.curatorName.toLowerCase().includes(lowerTerm) ||
        p.category.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
    const rarityWeight = { 'Legendary': 5, 'Ultra Rare': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 };
    
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rarity') return rarityWeight[b.rarity] - rarityWeight[a.rarity];
      return 0;
    });

    return result;
  }, [marketplacePacks, searchTerm, sortBy]);

  const filteredLottoCreators = useMemo(() => {
    if (!lottoSearchTerm) return CREATORS;
    return CREATORS.filter(c => 
      c.name.toLowerCase().includes(lottoSearchTerm.toLowerCase()) || 
      c.handle.toLowerCase().includes(lottoSearchTerm.toLowerCase())
    );
  }, [lottoSearchTerm]);

  // Helper to get deterministic ROI
  const getPackRoi = (packId: string, rarity: Rarity) => {
    const seed = packId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const base = RARITY_CONFIG[rarity].price > 500 ? 15 : 5;
    return (base + (seed % 35));
  };

  // Initialize Chat with Context
  useEffect(() => {
    if (showChat && !chatInstance) {
      const context = `
        User Balance: ${currency} $PACKS
        User Zora: ${zoraBalance.toFixed(4)}
        Vault: ${vault.packs.length} packs, ${vault.coins.length} creator coins, ${vault.tickets.length} tickets
        Total PnL: ${stats.pnl}
        Current View: ${activeTab}
        Leaderboard Rank: ${INITIAL_LEADERBOARD.findIndex(l => l.name === 'You') !== -1 ? INITIAL_LEADERBOARD.findIndex(l => l.name === 'You') + 1 : 'Unranked'}
      `;
      const chat = createBiggsChat(context);
      setChatInstance(chat);
      setChatMessages([{role: 'model', text: "Yo! Biggs here. Ready to secure some bags? What's the move?"}]);
    }
  }, [showChat, chatInstance, currency, zoraBalance, vault, stats, activeTab]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || !chatInstance) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setChatInput('');
    setIsChatTyping(true);

    try {
      const result = await chatInstance.sendMessage({ message: userMsg });
      setChatMessages(prev => [...prev, {role: 'model', text: result.text || "Let's run that back."}]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, {role: 'model', text: "Protocol lag. Try again."}]);
    } finally {
      setIsChatTyping(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatTyping]);

  useEffect(() => {
    const seedPacks: Pack[] = [
      { id: 'seed-1', name: 'Zora Origins', curatorName: 'The W Club Biggs', price: 150, rarity: 'Rare', isOpen: false, image: 'https://picsum.photos/seed/z1/400', createdAt: Date.now(), category: 'Art', contents: CREATORS.slice(0, 7), holders: 124, volume: 18500, burnCount: 45 },
      { id: 'seed-2', name: 'Vibe Vault', curatorName: 'Lex Zora', price: 500, rarity: 'Epic', isOpen: false, image: 'https://picsum.photos/seed/z2/400', createdAt: Date.now() - 100000, category: 'Music', contents: CREATORS.slice(0, 7), holders: 82, volume: 41000, burnCount: 12 },
      { id: 'seed-3', name: 'Legendary Bundle', curatorName: 'Whale 99', price: 2500, rarity: 'Legendary', isOpen: false, image: 'https://picsum.photos/seed/z3/400', createdAt: Date.now() - 200000, category: 'Utility', contents: CREATORS.slice(0, 7), holders: 31, volume: 77500, burnCount: 5 },
      { id: 'seed-4', name: 'Pixel Bankerz', curatorName: 'Pixel Guru', price: 80, rarity: 'Common', isOpen: false, image: 'https://picsum.photos/seed/z4/400', createdAt: Date.now() - 300000, category: 'PFPs', contents: CREATORS.slice(0, 7), holders: 450, volume: 36000, burnCount: 210 }
    ];
    setMarketplacePacks(seedPacks);

    setTradeOffers([
      {
        id: 't-mock-1',
        sender: 'Deep Pockets',
        receiver: 'You',
        offeredPack: seedPacks[1],
        offeredQuantity: 1,
        offeredValue: 500,
        requestedPack: seedPacks[0],
        requestedQuantity: 2,
        requestedValue: 300,
        status: 'pending',
        timestamp: Date.now() - 3600000
      }
    ]);
  }, []);

  const claimDaily = () => {
    if (!canClaimDaily) return;
    const dailyPack = marketplacePacks[Math.floor(Math.random() * marketplacePacks.length)];
    const packInstance = { ...dailyPack, id: 'daily-' + Date.now() };
    const dailyTicket: LotteryTicket = {
      id: 'daily-t-' + Date.now(),
      isScratched: false,
      cost: 0,
      prize: CREATORS[Math.floor(Math.random() * CREATORS.length)]
    };

    setVault(prev => ({
      ...prev,
      packs: [...prev.packs, packInstance],
      tickets: [...prev.tickets, dailyTicket]
    }));
    setLastDailyClaim(Date.now());
    showToast("Daily Allocation: 1 Pack + 1 Ticket Settled!", "success");
  };

  const buyPack = (pack: Pack) => {
    if (currency < pack.price) {
      showToast('Insufficient $PACKS', 'error');
      setConfirmingPurchase(null);
      return;
    }
    setCurrency(prev => prev - pack.price);
    setTotalInvested(prev => prev + pack.price);
    setVault(prev => ({ ...prev, packs: [...prev.packs, { ...pack, id: Math.random().toString(36).substr(2, 9) }] }));
    showToast(`${pack.name} Secured!`, 'success');
    setConfirmingPurchase(null);
    setViewingPack(null); // Close details if open
  };

  const buyLottery = (selectedCreator?: CreatorCoin) => {
    const qty = lotteryQuantities[selectedCreator?.id || ''] || 1;
    const total = LOTTERY_PRICE * qty;
    setLottoConfirmation({ creator: selectedCreator, quantity: qty, cost: total });
  };

  const executeLottoPurchase = () => {
    if (!lottoConfirmation) return;
    const { cost, quantity, creator } = lottoConfirmation;
    
    if (currency < cost) {
      showToast(`Insufficient $PACKS`, 'error');
      setLottoConfirmation(null);
      return;
    }
    setCurrency(prev => prev - cost);
    setTotalInvested(prev => prev + cost);
    const tickets = Array.from({ length: quantity }).map((_, i) => ({
      id: 't-' + Date.now() + i,
      isScratched: false,
      prize: creator || CREATORS[Math.floor(Math.random() * CREATORS.length)],
      cost: LOTTERY_PRICE
    }));
    setVault(prev => ({ ...prev, tickets: [...prev.tickets, ...tickets] }));
    showToast(`${quantity} Lotto Ticket(s) Settled!`, 'success');
    setLottoConfirmation(null);
  };

  const sharePack = (pack: Pack) => {
    const url = window.location.href;
    const shareText = `Check out the ${pack.name} on Zora Lotto! 🎲\n${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Zora Lotto',
        text: `Check out ${pack.name} on Zora Lotto!`,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
          showToast("Link Copied to Clipboard!", "info");
      }).catch(() => {
          showToast("Failed to copy", "error");
      });
    }
  };

  const confirmRecycle = () => {
    if (!packToRecycle) return;
    const reward = RARITY_CONFIG[packToRecycle.rarity].burnValue || 50;
    setVault(prev => ({ ...prev, packs: prev.packs.filter(p => p.id !== packToRecycle.id) }));
    setCurrency(prev => prev + reward);
    showToast(`Recycled! +${reward} $PACKS Settled.`, 'success');
    setPackToRecycle(null);
  };

  const confirmCoinRedemption = () => {
    if (!coinToRedeem) return;
    setCurrency(prev => prev + coinToRedeem.value);
    setVault(prev => ({...prev, coins: prev.coins.filter(c => c.id !== coinToRedeem.id)}));
    showToast(`Redeemed: +${coinToRedeem.value} $PACKS Settled.`, 'success');
    setCoinToRedeem(null);
    setSelectedCoinForAction(null);
  };

  const proposeTrade = (receiverName: string) => {
    if (!tradingPack) return;
    const value = tradingPack.pack.price * tradeQuantity;
    const newOffer: TradeOffer = {
      id: `to-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'You',
      receiver: receiverName,
      offeredPack: tradingPack.pack,
      offeredQuantity: tradeQuantity,
      offeredValue: value,
      requestedQuantity: 1,
      requestedValue: 0, 
      status: 'pending',
      timestamp: Date.now()
    };
    setTradeOffers(prev => [newOffer, ...prev]);
    showToast(`Swap Proposed to ${receiverName}!`, 'success');
    setTradingPack(null);
    setTradeQuantity(1);
    setVaultSubTab('trades');
  };

  const handleTradeAction = (trade: TradeOffer, action: 'accept' | 'decline') => {
    if (action === 'accept') {
      if (trade.receiver === 'You') {
        setVault(prev => ({
          ...prev,
          packs: [...prev.packs.filter(p => p.id !== trade.requestedPack?.id), trade.offeredPack]
        }));
      }
      showToast('Swap Confirmed!', 'success');
    } else {
      showToast('Swap Cancelled.', 'info');
    }
    setTradeOffers(prev => prev.filter(t => t.id !== trade.id));
  };

  const openPack = async (packId: string) => {
    const pack = vault.packs.find(p => p.id === packId);
    if (!pack) return;
    const contents = pack.contents || CREATORS.slice(0, 7);
    const totalVal = contents.reduce((acc, c) => acc + (c.value || 0), 0);
    setIsOpeningPack(true);
    setPackRipAnimation(false);
    setTimeout(() => setPackRipAnimation(true), 150);
    const aiTextPromise = generatePackRevealText(contents.map(c => c.name));
    setTimeout(async () => {
      const msg = await Promise.race([ aiTextPromise, new Promise<string>((r) => setTimeout(() => r("New Assets Settled!"), 400)) ]);
      setRevealData({ coins: contents, message: msg, totalValue: totalVal });
      setVault(prev => ({ ...prev, packs: prev.packs.filter(p => p.id !== packId), coins: [...prev.coins, ...contents] }));
      setIsOpeningPack(false);
      setPackRipAnimation(false);
    }, 600); 
  };

  const executeSwap = () => {
    const amount = parseFloat(swapInput);
    if (isNaN(amount) || amount <= 0) return;
    if (swapDirection === 'packs-to-zora') {
      if (currency < amount) { showToast('Insufficient $PACKS', 'error'); return; }
      const zoraOut = (amount * PACKS_PRICE_USD) / ZORA_PRICE_USD;
      setCurrency(prev => prev - amount);
      setZoraBalance(prev => prev + zoraOut);
      showToast(`Protocol Swap Settled: ${zoraOut.toFixed(6)} ZORA!`, 'success');
    } else {
      const zoraNeeded = (amount * PACKS_PRICE_USD) / ZORA_PRICE_USD;
      if (zoraBalance < zoraNeeded) { showToast('Insufficient ZORA', 'error'); return; }
      setZoraBalance(prev => prev - zoraNeeded);
      setCurrency(prev => prev + amount);
      showToast(`Settled: ${amount} $PACKS!`, 'success');
    }
    setSwapInput('');
  };

  const completeLottery = useCallback(() => {
    if (!activeLottery) return;
    const prize = activeLottery.prize;
    setVault(prev => ({ ...prev, tickets: prev.tickets.filter(t => t.id !== activeLottery.id), coins: prize ? [...prev.coins, prize] : prev.coins }));
    if (prize) showToast(`Asset Settled: ${prize.handle}!`, 'success');
    setActiveLottery(null);
  }, [activeLottery, showToast]);

  const consolidatedPacks = useMemo(() => {
    const groups: Record<string, { pack: Pack; count: number; ids: string[] }> = {};
    vault.packs.forEach(p => {
      if (!groups[p.name]) {
        groups[p.name] = { pack: p, count: 0, ids: [] };
      }
      groups[p.name].count++;
      groups[p.name].ids.push(p.id);
    });
    return Object.values(groups);
  }, [vault.packs]);

  const consolidatedCoins = useMemo(() => {
    const groups: Record<string, { coin: CreatorCoin; count: number }> = {};
    vault.coins.forEach(c => {
      if (!groups[c.id]) {
        groups[c.id] = { coin: c, count: 0 };
      }
      groups[c.id].count++;
    });
    return Object.values(groups);
  }, [vault.coins]);

  const groupedTickets = useMemo(() => {
    const groups: Record<string, { prize: CreatorCoin | undefined; count: number; tickets: LotteryTicket[] }> = {};
    vault.tickets.forEach(t => {
      const key = t.prize?.id || 'mystery';
      if (!groups[key]) {
        groups[key] = { prize: t.prize, count: 0, tickets: [] };
      }
      groups[key].count++;
      groups[key].tickets.push(t);
    });
    return Object.values(groups);
  }, [vault.tickets]);

  const availableCurationCoins = useMemo(() => {
    const uniqueMap = new Map<string, CreatorCoin>();
    vault.coins.forEach(c => {
      if (!uniqueMap.has(c.id)) {
        uniqueMap.set(c.id, c);
      }
    });
    return Array.from(uniqueMap.values());
  }, [vault.coins]);

  const filteredLeaderboard = useMemo(() => {
    const data = [...INITIAL_LEADERBOARD];
    if (leaderboardCat === 'Global') {
      return data.sort((a, b) => b.value - a.value);
    }
    
    const typeMap: Record<string, string> = {
      'Curators': 'Curator',
      'Collectors': 'Collector',
      'Gas Kings': 'Gas King'
    };
    
    return data
      .filter(entry => entry.type === typeMap[leaderboardCat])
      .sort((a, b) => b.value - a.value);
  }, [leaderboardCat]);

  const publishPack = () => {
    if (!packDraft.name || packDraft.selectedCoins.length !== 7) return;
    const newPack: Pack = {
      id: 'custom-' + Date.now(),
      name: packDraft.name,
      curatorName: 'You',
      price: packDraft.price,
      image: `https://picsum.photos/seed/${packDraft.name}/400`,
      isOpen: false,
      rarity: packDraft.rarity,
      contents: packDraft.selectedCoins,
      createdAt: Date.now(),
      category: packDraft.category,
      holders: 1,
      volume: 0,
      burnCount: 0
    };
    setMarketplacePacks(prev => [newPack, ...prev]);
    showToast(`"${packDraft.name}" Protocol Strategy Published!`, 'success');
    setPackDraft({ name: '', price: 100, rarity: 'Common', category: 'Art', selectedCoins: [] });
    setActiveTab('market');
  };

  const canClaimDaily = useMemo(() => Date.now() - lastDailyClaim > 24 * 60 * 60 * 1000, [lastDailyClaim]);

  const totalVaultWorth = useMemo(() => {
    const packsValue = vault.packs.reduce((acc, p) => acc + p.price, 0);
    const coinsValue = vault.coins.reduce((acc, c) => acc + c.value, 0);
    const ticketsValue = vault.tickets.length * LOTTERY_PRICE;
    return packsValue + coinsValue + ticketsValue;
  }, [vault.packs, vault.coins, vault.tickets]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-fade-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-black to-cyan-900/20 pointer-events-none" />
        <div className="relative z-10 space-y-12">
           <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(217,70,239,0.3)] animate-pulse">
                 <Package className="text-white w-14 h-14" />
              </div>
              <div>
                <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-4 drop-shadow-glow">ZORA LOTTO</h1>
                <p className="text-white/40 font-black uppercase tracking-[0.4em] text-xs">Creator Coin Lottery & Collectibles</p>
              </div>
           </div>
           
           <div className="max-w-xs mx-auto space-y-8">
              <div className="space-y-2">
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
                   Mint curated bundles, manage creator coins, and engage in protocol-backed high-octane lotteries.
                 </p>
              </div>
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.4em] text-xs active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 border-b-8 border-black/20 hover:bg-cyan-400 hover:text-white"
              >
                {isConnecting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing Connection...</>
                ) : (
                  <><Wallet className="w-4 h-4" /> Connect Wallet</>
                )}
              </button>
              <div className="flex items-center justify-center gap-4 text-white/20">
                 <span className="h-px w-8 bg-white/10" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Powered by Zora</span>
                 <span className="h-px w-8 bg-white/10" />
              </div>
           </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 px-8">
           <div className="max-w-xs mx-auto flex justify-between gap-4">
              {['24k+ Rips', '500+ Strategies', '1.2M $PACKS'].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                   <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{stat}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-black text-white relative flex flex-col overflow-x-hidden transition-all duration-300 no-scrollbar">
      
      {/* GLOBAL TICKER */}
      <div className="bg-white/5 border-b border-white/10 py-1 overflow-hidden whitespace-nowrap z-50">
        <div className="flex animate-ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 mx-6">
              <span className="text-[10px] font-black tracking-widest uppercase">{item.label}</span>
              <span className="text-[10px] font-mono text-white/80">${item.price}</span>
              <span className={`text-[9px] font-bold ${item.up ? 'text-green-400' : 'text-red-400'}`}>{item.change}</span>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] animate-slide-up">
            <div className={`glass p-4 rounded-2xl flex items-center gap-3 border shadow-2xl ${toast.type === 'error' ? 'border-red-500/50 text-red-400' : 'border-cyan-500/50 text-cyan-400'}`}>
                {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : toast.type === 'error' ? <X className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                <span className="text-xs font-black uppercase tracking-wider flex-1">{toast.message}</span>
            </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 p-4 flex justify-between items-center glass-dark border-b border-white/10">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setActiveTab('market'); setViewingProfile(null); }}>
          <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
            <Package className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter italic uppercase leading-none">ZORA LOTTO</h1>
            <span className="text-[8px] font-black uppercase tracking-widest text-fuchsia-500/60 leading-none mt-0.5">Creator Coin Protocol</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SimpleTooltip text="Total Net Worth (Liquid + Assets)" position="bottom">
            <button onClick={() => setShowWalletHub(true)} className="bg-white/5 px-4 py-2 rounded-2xl flex flex-col items-end gap-0.5 border border-white/10 group active:scale-95 transition-all">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">NET WORTH</span>
                <span className="text-sm font-mono font-black leading-none text-white">{stats.totalValue.toLocaleString()} $PACKS</span>
              </div>
              <div className="flex items-center gap-1.5 leading-none mt-1">
                 <span className={`w-1.5 h-1.5 rounded-full ${stats.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                 <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">Liquid: {currency.toLocaleString()}</span>
              </div>
            </button>
          </SimpleTooltip>
        </div>
      </header>

      <main className="p-4 space-y-12 flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'market' && (
          <MarketTab 
            showTips={showTips} setShowTips={setShowTips} canClaimDaily={canClaimDaily} claimDaily={claimDaily}
            lottoSearchTerm={lottoSearchTerm} setLottoSearchTerm={setLottoSearchTerm} filteredLottoCreators={filteredLottoCreators}
            lotteryQuantities={lotteryQuantities} setLotteryQuantities={setLotteryQuantities} buyLottery={buyLottery} openProfile={openProfile}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortBy={setSortBy} filteredPacks={filteredPacks}
            setViewingPack={setViewingPack} setConfirmingPurchase={setConfirmingPurchase} getPackRoi={getPackRoi}
          />
        )}
        
        {activeTab === 'vault' && (
          <VaultTab 
            vaultSubTab={vaultSubTab} setVaultSubTab={setVaultSubTab} totalVaultWorth={totalVaultWorth} stats={stats}
            groupedTickets={groupedTickets} setActiveLottery={setActiveLottery} consolidatedPacks={consolidatedPacks}
            openPack={openPack} setTradingPack={setTradingPack} setPackToRecycle={setPackToRecycle} consolidatedCoins={consolidatedCoins}
            setSelectedCoinForAction={setSelectedCoinForAction} tradeOffers={tradeOffers} handleTradeAction={handleTradeAction} vault={vault}
          />
        )}

        {activeTab === 'curate' && (
          <CurateTab 
            packDraft={packDraft} setPackDraft={setPackDraft} availableCurationCoins={availableCurationCoins} 
            publishPack={publishPack} setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'swap' && (
          <SwapTab 
            swapInput={swapInput} setSwapInput={setSwapInput} swapDirection={swapDirection} setSwapDirection={setSwapDirection}
            currency={currency} zoraBalance={zoraBalance} executeSwap={executeSwap}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab 
            leaderboardCat={leaderboardCat} setLeaderboardCat={setLeaderboardCat} filteredLeaderboard={filteredLeaderboard} openProfile={openProfile}
          />
        )}
      </main>

      {/* Floating Biggs Chat Button */}
      {!showChat && (
        <button 
          onClick={() => setShowChat(true)}
          className="fixed bottom-28 right-4 z-[100] w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 active:scale-90 transition-all animate-fade-in group hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Biggs Chat Window */}
      {showChat && (
        <div className="fixed bottom-28 right-4 w-80 max-w-[calc(100vw-32px)] z-[100] glass rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border-white/20 animate-scale-in bg-black/80 backdrop-blur-xl h-[450px]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                 <img src={CREATORS[0].avatar} className="w-full h-full object-cover" alt="Biggs" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white">Biggs AI</div>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Protocol Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="p-2 text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {chatMessages.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-[10px] font-medium leading-relaxed ${msg.role === 'user' ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-100 rounded-tr-sm' : 'bg-white/10 border border-white/10 text-white/80 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
               </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1 border border-white/5 pl-3">
               <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask Biggs..."
                  className="flex-1 bg-transparent text-[11px] font-bold text-white outline-none placeholder:text-white/20"
               />
               <button 
                  onClick={handleSendChat}
                  disabled={isChatTyping || !chatInput}
                  className={`p-2 rounded-xl transition-all ${chatInput ? 'bg-cyan-500 text-black shadow-lg hover:scale-105' : 'bg-white/5 text-white/10'}`}
               >
                  {isChatTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto glass-dark border-t border-white/10 p-6 flex justify-around items-center z-[90] rounded-t-[3.5rem] shadow-[0_-25px_50px_rgba(0,0,0,0.8)]">
        {[
          { id: 'market', icon: <ShoppingBag />, label: 'Market' },
          { id: 'vault', icon: <Package />, label: 'Vault' },
          { id: 'curate', icon: <Briefcase />, label: 'Studio' },
          { id: 'swap', icon: <ArrowRightLeft />, label: 'Swap' },
          { id: 'leaderboard', icon: <Trophy />, label: 'Ranks' }
        ].map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id as any); setViewingProfile(null); }} className={`flex flex-col items-center gap-2 px-4 transition-all active:scale-75 ${activeTab === item.id ? 'text-fuchsia-500' : 'text-white/20'}`}>
            <div className={`transition-all duration-500 ${activeTab === item.id ? 'translate-y-[-10px] scale-125 drop-shadow-[0_0_20px_rgba(217,70,239,1)]' : 'hover:scale-110'}`}>{item.icon}</div>
            <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-all leading-none ${activeTab === item.id ? 'opacity-100 scale-110' : 'opacity-40'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* MODALS */}
      {viewingPack && <ViewingPackModal viewingPack={viewingPack} setViewingPack={setViewingPack} openProfile={openProfile} getPackRoi={getPackRoi} buyPack={buyPack} setConfirmingPurchase={setConfirmingPurchase} sharePack={sharePack} />}
      {lottoConfirmation && <LottoConfirmationModal lottoConfirmation={lottoConfirmation} setLottoConfirmation={setLottoConfirmation} executeLottoPurchase={executeLottoPurchase} />}
      {tradingPack && <TradingPackModal tradingPack={tradingPack} setTradingPack={setTradingPack} tradeQuantity={tradeQuantity} setTradeQuantity={setTradeQuantity} proposeTrade={proposeTrade} />}
      {activeLottery && <ActiveLotteryModal activeLottery={activeLottery} setActiveLottery={setActiveLottery} completeLottery={completeLottery} />}
      {packToRecycle && <RecycleModal packToRecycle={packToRecycle} setPackToRecycle={setPackToRecycle} confirmRecycle={confirmRecycle} />}
      {isOpeningPack && <OpeningPackModal packRipAnimation={packRipAnimation} />}
      {revealData && <RevealDataModal revealData={revealData} setRevealData={setRevealData} />}
      {showWalletHub && <WalletHubModal setShowWalletHub={setShowWalletHub} stats={stats} currency={currency} zoraBalance={zoraBalance} setActiveTab={setActiveTab} />}
      {selectedCoinForAction && <SelectedCoinModal selectedCoinForAction={selectedCoinForAction} setSelectedCoinForAction={setSelectedCoinForAction} setActiveTab={setActiveTab} setCoinToRedeem={setCoinToRedeem} />}
      {coinToRedeem && <RedeemCoinModal coinToRedeem={coinToRedeem} setCoinToRedeem={setCoinToRedeem} confirmCoinRedemption={confirmCoinRedemption} />}
      {confirmingPurchase && <PackPurchaseConfirmationModal confirmingPurchase={confirmingPurchase} setConfirmingPurchase={setConfirmingPurchase} buyPack={buyPack} />}
    </div>
  );
};
