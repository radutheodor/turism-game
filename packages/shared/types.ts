// ─── Tile definitions ───────────────────────────────────────────

export type TileType =
  | 'property'
  | 'surpriza'
  | 'statie'
  | 'parcare'
  | 'semafor'
  | 'cfr'
  | 'pod'
  | 'gradina'
  | 'camping'
  | 'han'
  | 'start';

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number[];        // [base, 1house, 2house, 3house, 4house, hotel]
  houseCost?: number;     // cost per house/hotel
  group?: string;         // property color group
  icon?: string;          // emoji icon for the tile
}

// ─── Player ─────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  money: number;
  properties: number[];
  bankrupt: boolean;
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
}

// ─── Property ownership ─────────────────────────────────────────

export interface OwnedProperty {
  tileId: number;
  ownerId: string;
  houses: number;         // 0-4 houses, 5 = hotel
  mortgaged: boolean;
}

// ─── Surprise card ──────────────────────────────────────────────

export interface SurpriseCard {
  id: number;
  text: string;
  action: 'pay' | 'receive' | 'moveTo' | 'moveSteps' | 'jail' | 'jailFree' | 'repairs';
  value?: number;
  tileId?: number;
}

// ─── Game state ─────────────────────────────────────────────────

export type GamePhase =
  | 'waiting'
  | 'rolling'
  | 'buying'
  | 'paying'
  | 'jailDecision'    // player in jail: pay $50, use card, or try doubles
  | 'endTurn'
  | 'finished';

export interface GameState {
  roomId: string;
  players: Player[];
  currentPlayerIndex: number;
  ownedProperties: OwnedProperty[];
  phase: GamePhase;
  lastDiceRoll: [number, number] | null;
  doublesCount: number;
  winner: string | null;
  log: string[];
  lastSurpriseCard: SurpriseCard | null;
}

// ─── Socket events ──────────────────────────────────────────────

export interface ServerToClientEvents {
  gameState: (state: GameState) => void;
  roomCreated: (roomId: string) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  createRoom: (playerInfo: { name: string; avatar: string }) => void;
  joinRoom: (data: { roomId: string; name: string; avatar: string }) => void;
  startGame: () => void;
  rollDice: () => void;
  buyProperty: () => void;
  declinePurchase: () => void;
  endTurn: () => void;
  // Phase 2 actions
  buildHouse: (tileId: number) => void;
  sellHouse: (tileId: number) => void;
  mortgageProperty: (tileId: number) => void;
  unmortgageProperty: (tileId: number) => void;
  payJailFine: () => void;
  useJailCard: () => void;
}

// ─── Constants ──────────────────────────────────────────────────

export const STARTING_MONEY = 1500;
export const PASS_GO_BONUS = 200;
export const MAX_PLAYERS = 6;
export const MIN_PLAYERS = 2;
export const BOARD_SIZE = 40;
export const JAIL_FINE = 50;
export const JAIL_POSITION = 10;
export const SEMAFOR_POSITION = 11;
export const TOKEN_EMOJIS = ['🚗', '🧢', '🐧', '🧀', '🧛', '🐶'];
