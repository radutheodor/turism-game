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
  color?: string;
  price?: number;
  rent?: number[];
  image?: string;
  group?: string;
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
}

// ─── Property ownership ─────────────────────────────────────────

export interface OwnedProperty {
  tileId: number;
  ownerId: string;
  houses: number; // 0-4 cabins, 5 = hotel
  mortgaged: boolean;
}

// ─── Game state ─────────────────────────────────────────────────

export type GamePhase =
  | 'waiting'    // lobby, waiting for players
  | 'rolling'    // current player must roll
  | 'moving'     // animation in progress
  | 'buying'     // landed on unowned property, must decide
  | 'paying'     // landed on owned property, must pay rent
  | 'endTurn'    // player can end their turn
  | 'finished';  // game over

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
}

// ─── Constants ──────────────────────────────────────────────────

export const STARTING_MONEY = 1500;
export const PASS_GO_BONUS = 200;
export const MAX_PLAYERS = 6;
export const MIN_PLAYERS = 2;
export const BOARD_SIZE = 40;
export const TOKEN_EMOJIS = ['🚗', '🧢', '🐧', '🧀', '🧛', '🐶'];
