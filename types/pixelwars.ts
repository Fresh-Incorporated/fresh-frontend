export interface BasePixel {
  x: number;
  y: number;
  type: "border" | "state" | "sea";
  ownerId?: number;
}

export interface Player {
  id: string;
  username: string;
  clanId?: string;
  pixels: number;
  maxPixels: number;
  pixelsPerMinute: number;
  coins: number;
  experience: number;
  level: number;
  lastPixelRegeneration: Date;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  description?: string;
  leaderId: string;
  members: string[];
  totalPixels: number;
  totalCoins: number;
  totalExperience: number;
  level: number;
  createdAt: Date;
  seasonRank?: number;
}

export interface GameSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  rewards: SeasonReward[];
}

export interface SeasonReward {
  rank: number;
  coins: number;
  experience: number;
  specialRewards?: string[];
}

export interface GameSettings {
  pixelsPerMinute: number;
  experiencePerMinute: number;
  pixelRegenerationTime: number; // в минутах
  maxPixelsDefault: number;
  maxPixelsUpgradeCost: number;
  regenerationSpeedUpgradeCost: number;
  incomeUpgradeCost: number;
}

export interface ViewState {
  scale: number;
  panX: number;
  panY: number;
}

export interface GameStats {
  totalPixels: number;
  borderPixels: number;
  statePixels: number;
  activePlayers: number;
  activeClans: number;
  seasonProgress: number; // процент завершения сезона
  lastUpdated: Date;
}

export interface PixelIncome {
  coins: number;
  experience: number;
  timestamp: Date;
}

export interface ClanWar {
  id: string;
  clan1Id: string;
  clan2Id: string;
  startDate: Date;
  endDate: Date;
  clan1Score: number;
  clan2Score: number;
  winnerId?: string;
  isActive: boolean;
} 