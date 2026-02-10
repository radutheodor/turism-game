import {
  GameState,
  GamePhase,
  Player,
  OwnedProperty,
  STARTING_MONEY,
  PASS_GO_BONUS,
  BOARD_SIZE,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from '@turism/shared';
import { tiles } from '@turism/shared';

export class GameRoom {
  state: GameState;

  constructor(roomId: string) {
    this.state = {
      roomId,
      players: [],
      currentPlayerIndex: 0,
      ownedProperties: [],
      phase: 'waiting',
      lastDiceRoll: null,
      doublesCount: 0,
      winner: null,
      log: [],
    };
  }

  // ─── Player management ──────────────────────────────────────

  addPlayer(id: string, name: string, avatar: string): boolean {
    if (this.state.phase !== 'waiting') return false;
    if (this.state.players.length >= MAX_PLAYERS) return false;
    if (this.state.players.some((p) => p.id === id)) return false;

    // Ensure unique avatar
    const usedAvatars = this.state.players.map((p) => p.avatar);
    if (usedAvatars.includes(avatar)) return false;

    this.state.players.push({
      id,
      name,
      avatar,
      position: 0,
      money: STARTING_MONEY,
      properties: [],
      bankrupt: false,
    });

    this.addLog(`${name} ${avatar} joined the game`);
    return true;
  }

  removePlayer(id: string): void {
    const player = this.state.players.find((p) => p.id === id);
    if (!player) return;

    // Release their properties
    this.state.ownedProperties = this.state.ownedProperties.filter(
      (op) => op.ownerId !== id
    );

    this.state.players = this.state.players.filter((p) => p.id !== id);
    this.addLog(`${player.name} left the game`);

    // Adjust currentPlayerIndex if needed
    if (this.state.players.length > 0) {
      if (this.state.currentPlayerIndex >= this.state.players.length) {
        this.state.currentPlayerIndex = 0;
      }
    }

    // Check if only one player left during active game
    if (this.state.phase !== 'waiting' && this.state.phase !== 'finished') {
      const activePlayers = this.state.players.filter((p) => !p.bankrupt);
      if (activePlayers.length <= 1 && activePlayers.length > 0) {
        this.state.winner = activePlayers[0].id;
        this.state.phase = 'finished';
        this.addLog(`🏆 ${activePlayers[0].name} wins!`);
      } else if (activePlayers.length === 0) {
        this.state.phase = 'waiting';
      }
    }
  }

  // ─── Game flow ──────────────────────────────────────────────

  startGame(requesterId: string): boolean {
    if (this.state.phase !== 'waiting') return false;
    if (this.state.players.length < MIN_PLAYERS) return false;
    // Only the first player (host) can start
    if (this.state.players[0]?.id !== requesterId) return false;

    this.state.phase = 'rolling';
    this.state.currentPlayerIndex = 0;
    this.addLog('🎲 Game started!');
    return true;
  }

  rollDice(playerId: string): { dice: [number, number]; newPosition: number } | null {
    if (this.state.phase !== 'rolling') return null;

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== playerId) return null;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;
    const isDoubles = d1 === d2;

    this.state.lastDiceRoll = [d1, d2];

    if (isDoubles) {
      this.state.doublesCount++;
      this.addLog(`${currentPlayer.name} rolled ${d1}+${d2} = ${total} (DOUBLES!)`);
    } else {
      this.state.doublesCount = 0;
      this.addLog(`${currentPlayer.name} rolled ${d1}+${d2} = ${total}`);
    }

    // Move player
    const oldPosition = currentPlayer.position;
    const newPosition = (oldPosition + total) % BOARD_SIZE;

    // Check if passed Start
    if (newPosition < oldPosition) {
      currentPlayer.money += PASS_GO_BONUS;
      this.addLog(`${currentPlayer.name} passed Start and collected $${PASS_GO_BONUS}`);
    }

    currentPlayer.position = newPosition;

    // Process landing
    this.processLanding(currentPlayer, isDoubles);

    return { dice: [d1, d2], newPosition };
  }

  buyProperty(playerId: string): boolean {
    if (this.state.phase !== 'buying') return false;

    const player = this.getCurrentPlayer();
    if (!player || player.id !== playerId) return false;

    const tile = tiles[player.position];
    if (!tile || !tile.price) return false;

    if (player.money < tile.price) {
      this.addLog(`${player.name} can't afford ${tile.name} ($${tile.price})`);
      return false;
    }

    player.money -= tile.price;
    player.properties.push(tile.id);

    this.state.ownedProperties.push({
      tileId: tile.id,
      ownerId: player.id,
      houses: 0,
      mortgaged: false,
    });

    this.addLog(`${player.name} bought ${tile.name} for $${tile.price}`);

    // After buying, check if doubles → roll again, else endTurn
    if (this.state.doublesCount > 0) {
      this.state.phase = 'rolling';
    } else {
      this.state.phase = 'endTurn';
    }

    return true;
  }

  declinePurchase(playerId: string): boolean {
    if (this.state.phase !== 'buying') return false;

    const player = this.getCurrentPlayer();
    if (!player || player.id !== playerId) return false;

    const tile = tiles[player.position];
    this.addLog(`${player.name} declined to buy ${tile?.name}`);

    if (this.state.doublesCount > 0) {
      this.state.phase = 'rolling';
    } else {
      this.state.phase = 'endTurn';
    }

    return true;
  }

  endTurn(playerId: string): boolean {
    if (this.state.phase !== 'endTurn') return false;

    const player = this.getCurrentPlayer();
    if (!player || player.id !== playerId) return false;

    this.advanceToNextPlayer();
    return true;
  }

  // ─── Internal logic ─────────────────────────────────────────

  private processLanding(player: Player, isDoubles: boolean): void {
    const tile = tiles[player.position];
    if (!tile) {
      this.state.phase = 'endTurn';
      return;
    }

    switch (tile.type) {
      case 'property':
      case 'cfr':
      case 'statie': {
        const owned = this.state.ownedProperties.find(
          (op) => op.tileId === tile.id
        );

        if (!owned && tile.price) {
          // Unowned purchasable tile
          if (player.money >= tile.price) {
            this.state.phase = 'buying';
          } else {
            this.addLog(`${player.name} can't afford ${tile.name}`);
            this.state.phase = isDoubles ? 'rolling' : 'endTurn';
          }
        } else if (owned && owned.ownerId !== player.id && !owned.mortgaged) {
          // Pay rent
          const rent = this.calculateRent(tile, owned);
          const owner = this.state.players.find((p) => p.id === owned.ownerId);

          if (owner && rent > 0) {
            const actualRent = Math.min(rent, player.money);
            player.money -= actualRent;
            owner.money += actualRent;
            this.addLog(
              `${player.name} paid $${actualRent} rent to ${owner.name} for ${tile.name}`
            );

            if (player.money <= 0) {
              player.bankrupt = true;
              this.addLog(`💀 ${player.name} is bankrupt!`);
              this.checkWinCondition();
            }
          }

          this.state.phase = isDoubles ? 'rolling' : 'endTurn';
        } else {
          // Own property or mortgaged — nothing happens
          this.state.phase = isDoubles ? 'rolling' : 'endTurn';
        }
        break;
      }

      case 'camping': {
        const tax = 50;
        player.money -= tax;
        this.addLog(`${player.name} pays $${tax} camping fee`);
        if (player.money <= 0) {
          player.bankrupt = true;
          this.addLog(`💀 ${player.name} is bankrupt!`);
          this.checkWinCondition();
        }
        this.state.phase = isDoubles ? 'rolling' : 'endTurn';
        break;
      }

      case 'surpriza': {
        // Phase 1: simple random effect
        const effects = [
          { text: 'Won a prize!', amount: 100 },
          { text: 'Road repair bill', amount: -75 },
          { text: 'Tourist bonus!', amount: 150 },
          { text: 'Hotel tax', amount: -100 },
          { text: 'Found treasure!', amount: 200 },
          { text: 'Pay the doctor', amount: -50 },
        ];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        player.money += effect.amount;
        this.addLog(
          `🎴 Surpriză: ${effect.text} (${effect.amount > 0 ? '+' : ''}$${effect.amount})`
        );

        if (player.money <= 0) {
          player.bankrupt = true;
          this.addLog(`💀 ${player.name} is bankrupt!`);
          this.checkWinCondition();
        }
        this.state.phase = isDoubles ? 'rolling' : 'endTurn';
        break;
      }

      default:
        // start, parcare, gradina, han, semafor, pod — no action in Phase 1
        this.state.phase = isDoubles ? 'rolling' : 'endTurn';
        break;
    }
  }

  private calculateRent(tile: typeof tiles[0], owned: OwnedProperty): number {
    if (tile.type === 'statie') {
      // Count how many stations the owner has
      const stationCount = this.state.ownedProperties.filter(
        (op) => op.ownerId === owned.ownerId && tiles[op.tileId]?.type === 'statie'
      ).length;
      return 25 * stationCount;
    }

    if (tile.type === 'cfr') {
      const cfrCount = this.state.ownedProperties.filter(
        (op) => op.ownerId === owned.ownerId && tiles[op.tileId]?.type === 'cfr'
      ).length;
      return 25 * cfrCount;
    }

    if (tile.rent && tile.rent.length > owned.houses) {
      return tile.rent[owned.houses];
    }

    return tile.price ? Math.floor(tile.price * 0.1) : 0;
  }

  private advanceToNextPlayer(): void {
    this.state.doublesCount = 0;
    const activePlayers = this.state.players.filter((p) => !p.bankrupt);

    if (activePlayers.length <= 1) {
      this.checkWinCondition();
      return;
    }

    // Find next non-bankrupt player
    let nextIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
    while (this.state.players[nextIndex]?.bankrupt) {
      nextIndex = (nextIndex + 1) % this.state.players.length;
    }

    this.state.currentPlayerIndex = nextIndex;
    this.state.phase = 'rolling';
    this.state.lastDiceRoll = null;

    const next = this.state.players[nextIndex];
    if (next) {
      this.addLog(`It's ${next.name}'s turn`);
    }
  }

  private checkWinCondition(): void {
    const activePlayers = this.state.players.filter((p) => !p.bankrupt);
    if (activePlayers.length === 1) {
      this.state.winner = activePlayers[0].id;
      this.state.phase = 'finished';
      this.addLog(`🏆 ${activePlayers[0].name} wins the game!`);
    } else if (activePlayers.length === 0) {
      this.state.phase = 'finished';
      this.addLog('Game over — all players are bankrupt!');
    }
  }

  private addLog(message: string): void {
    this.state.log.push(message);
    // Keep last 50 messages
    if (this.state.log.length > 50) {
      this.state.log = this.state.log.slice(-50);
    }
  }

  getCurrentPlayer(): Player | null {
    return this.state.players[this.state.currentPlayerIndex] ?? null;
  }
}
