
import { CreatorCoin, LeaderboardEntry, CreatorProfile, Pack, Quest, Rarity } from './types';
import React from 'react';
import { ShieldCheck, Flame, Layers } from 'lucide-react';

export const RARITY_CONFIG: Record<Rarity, { color: string; bg: string; border: string; glow: string; price: number; burnValue: number; gradient: string; hex: string }> = {
  'Common': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-blue-500/20', price: 50, burnValue: 25, gradient: 'from-blue-600 to-blue-400', hex: '#60a5fa' },
  'Rare': { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-purple-500/20', price: 150, burnValue: 75, gradient: 'from-purple-600 to-purple-400', hex: '#c084fc' },
  'Epic': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20', price: 400, burnValue: 200, gradient: 'from-yellow-600 to-yellow-400', hex: '#facc15' },
  'Ultra Rare': { color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', glow: 'shadow-fuchsia-500/20', price: 1000, burnValue: 500, gradient: 'from-fuchsia-600 to-fuchsia-400', hex: '#f472b6' },
  'Legendary': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-orange-500/20', price: 2500, burnValue: 1250, gradient: 'from-orange-600 to-orange-400', hex: '#fb923c' }
};

export const TICKER_ITEMS = [
  { label: '$PACKS', price: '0.42', change: '+5.2%', up: true },
  { label: 'ZORA', price: '1250.00', change: '-1.1%', up: false },
  { label: '$WCLUB', price: '4.20', change: '+12.5%', up: true },
  { label: 'RECENT RIP', price: 'The W Club Biggs', change: 'EPIC!', up: true },
  { label: '$LEX', price: '1.85', change: '+8.1%', up: true },
  { label: '$EMBER', price: '2.10', change: '+15.2%', up: true },
  { label: 'MARKET', price: 'BULLISH', change: 'BUY THE DIP', up: true },
];

export const ONBOARDING_TIPS = [
  { title: "Protocol Liquidity", desc: "$PACKS is backed by Zora network treasury. All burns settle instantly.", icon: <ShieldCheck className="text-cyan-400" /> },
  { title: "Ripping Economics", desc: "Common packs are entry-level. Legendary packs yield high-value curation coins.", icon: <Flame className="text-orange-400" /> },
  { title: "Consolidated Inventory", desc: "Identical assets group automatically. Manage your portfolio with bulk actions.", icon: <Layers className="text-purple-400" /> },
];

export const CREATORS: CreatorCoin[] = [
  { id: 'wclub', name: 'The W Club Biggs', handle: '$thewclubbiggs', avatar: 'https://picsum.photos/seed/biggs/200', rarity: 'Legendary', value: 1000 },
  { id: 'swap', name: 'Lex Zora', handle: '$lex_zora', avatar: 'https://picsum.photos/seed/lex/200', rarity: 'Ultra Rare', value: 800 },
  { id: 'vault', name: 'Pack Hoarder', handle: '$pack_king', avatar: 'https://picsum.photos/seed/vault/200', rarity: 'Epic', value: 600 },
  { id: 'whale', name: 'Deep Pockets', handle: '$whale_99', avatar: 'https://picsum.photos/seed/whale/200', rarity: 'Legendary', value: 1200 },
  { id: '1', name: 'Zora Muse', handle: '$zora', avatar: 'https://picsum.photos/seed/zora/200', rarity: 'Legendary', value: 500 },
  { id: '2', name: 'Pixel Guru', handle: '$pixel', avatar: 'https://picsum.photos/seed/pixel/200', rarity: 'Common', value: 20 },
  { id: '3', name: 'Vibe Master', handle: '$vibes', avatar: 'https://picsum.photos/seed/vibes/200', rarity: 'Common', value: 20 },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Deep Pockets', value: 1200000, type: 'Collector', avatar: 'https://picsum.photos/seed/whale/200' },
  { name: 'The W Club Biggs', value: 890000, type: 'Curator', avatar: 'https://picsum.photos/seed/biggs/200' },
  { name: 'Charger_01', value: 1540, type: 'Gas King', avatar: 'https://picsum.photos/seed/burn1/200' },
  { name: 'Lex Zora', value: 450000, type: 'Curator', avatar: 'https://picsum.photos/seed/lex/200' },
  { name: 'Hoarder_99', value: 82000, type: 'Collector', avatar: 'https://picsum.photos/seed/vault/200' },
  { name: 'Volt_Master', value: 720, type: 'Gas King', avatar: 'https://picsum.photos/seed/phoenix/200' },
  { name: 'Zora Muse', value: 310000, type: 'Curator', avatar: 'https://picsum.photos/seed/zora/200' },
  { name: 'Vibe Master', value: 120, type: 'Gas King', avatar: 'https://picsum.photos/seed/vibes/200' },
];

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Share your Vault', description: 'Show the world your legendary creator coin pulls on Twitter', reward: 150, platform: 'twitter', icon: 'Twitter', isCompleted: false },
  { id: 'q2', title: 'Creator Hype', description: 'Post your latest creator coin strategy to Farcaster', reward: 200, platform: 'farcaster', icon: 'Share2', isCompleted: false },
  { id: 'q3', title: 'Zora Bridge', description: 'Connect and share your $PACKS balance from the app', reward: 100, platform: 'zora', icon: 'ExternalLink', isCompleted: false },
  { id: 'q4', title: 'Protocol Charge', description: 'Recycle 3 creator coins today to earn bonus $PACKS', reward: 50, platform: 'daily', icon: 'BatteryFull', isCompleted: false },
];

export const getCreatorProfile = (creator: CreatorCoin): CreatorProfile => {
  const isBiggs = creator.id === 'wclub';
  const isLex = creator.id === 'swap';
  const isVault = creator.id === 'vault';
  const isWhale = creator.id === 'whale';
  
  const mockMinted: Pack[] = [
    { 
      id: `p-${creator.id}-1`, 
      name: `${creator.name} Selection Vol. 1`, 
      curatorName: creator.name, 
      price: 50, 
      image: `https://picsum.photos/seed/drop1-${creator.id}/300/400`, 
      isOpen: false, 
      rarity: 'Rare', 
      createdAt: Date.now(),
      category: 'Art',
      holders: 10,
      volume: 500,
      burnCount: 2
    },
    { 
      id: `p-${creator.id}-2`, 
      name: `${creator.name} Selection Vol. 2`, 
      curatorName: creator.name, 
      price: 150, 
      image: `https://picsum.photos/seed/drop2-${creator.id}/300/400`, 
      isOpen: false, 
      rarity: 'Epic', 
      createdAt: Date.now(),
      category: 'Art',
      holders: 5,
      volume: 750,
      burnCount: 1
    }
  ];
  
  const mockCollected: CreatorCoin[] = CREATORS.filter(c => c.id !== creator.id).slice(0, 5);

  let bio = `Visionary on Zora. Part of the Packs of Zora Creators ecosystem. Built for creator coin utility.`;
  if (isBiggs) bio = "Top Creator Coin. One of the most held and used coins in the Packs of Zora Creators app.";
  if (isLex) bio = "Official Creator Coin of Lex Zora. A high-utility asset within the Packs ecosystem.";
  if (isVault) bio = "Top Collector. The leader in acquiring rare creator coin packs through high-octane lotteries.";
  if (isWhale) bio = "Protocol Whale. Holding massive reserves of $PACKS currency to back creator coin liquidity.";

  return {
    coin: creator,
    bio,
    mintedPacks: mockMinted,
    collectedCoins: mockCollected,
    totalSales: isBiggs ? 245000 : isLex ? 182000 : isVault ? 95000 : 1200000,
    role: (isBiggs || isLex) ? 'curator' : 'collector'
  };
};
