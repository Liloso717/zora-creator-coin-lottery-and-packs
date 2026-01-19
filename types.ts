
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Ultra Rare' | 'Legendary';

export interface CreatorCoin {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  rarity: Rarity;
  value: number;
}

export interface Pack {
  id: string;
  name: string;
  curatorName: string;
  price: number;
  usdWorth?: number;
  image: string;
  isOpen: boolean;
  rarity: Rarity;
  contents?: CreatorCoin[];
  createdAt: number;
  category: string;
  holders: number;
  volume: number;
  burnCount: number;
}

export interface TradeOffer {
  id: string;
  sender: string;
  receiver: string;
  offeredPack: Pack;
  offeredQuantity: number;
  offeredValue: number;
  requestedPack?: Pack;
  requestedQuantity: number;
  requestedValue: number;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: number;
}

export interface PackDraft {
  name: string;
  price: number;
  rarity: Rarity;
  category: string;
  selectedCoins: CreatorCoin[];
}

export interface CreatorProfile {
  coin: CreatorCoin;
  bio: string;
  mintedPacks: Pack[];
  collectedCoins: CreatorCoin[];
  totalSales: number;
  role: 'curator' | 'collector';
}

export interface LotteryTicket {
  id: string;
  isScratched: boolean;
  prize?: CreatorCoin;
  cost: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  platform: 'twitter' | 'zora' | 'farcaster' | 'daily';
  isCompleted: boolean;
}

export interface UserStats {
  packsBalance: number;
  totalInvested: number;
  totalValue: number;
  pnl: number;
  roi: number;
}

export type LeaderboardCategory = 'Global' | 'Curators' | 'Collectors' | 'Gas Kings';

export interface LeaderboardEntry {
  name: string;
  value: number;
  type: 'Curator' | 'Collector' | 'Gas King';
  avatar?: string;
}
