import {
  GameState, Player, OwnedProperty, SurpriseCard,
  STARTING_MONEY, PASS_GO_BONUS, BOARD_SIZE, MAX_PLAYERS, MIN_PLAYERS,
  JAIL_FINE, JAIL_POSITION, SEMAFOR_POSITION,
} from '../../packages/shared';
import { tiles, propertyGroups, surpriseCards } from '../../packages/shared';

export class GameRoom {
  state: GameState;
  private surpriseDeck: SurpriseCard[];

  constructor(roomId: string) {
    this.state = {
      roomId, players: [], currentPlayerIndex: 0, ownedProperties: [],
      phase: 'waiting', lastDiceRoll: null, doublesCount: 0,
      winner: null, log: [], lastSurpriseCard: null,
    };
    this.surpriseDeck = this.shuffleDeck();
  }

  private shuffleDeck(): SurpriseCard[] {
    const deck = [...surpriseCards];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private drawSurprise(): SurpriseCard {
    if (this.surpriseDeck.length === 0) this.surpriseDeck = this.shuffleDeck();
    return this.surpriseDeck.pop()!;
  }

  // ─── Player management ──────────────────────────────────────

  addPlayer(id: string, name: string, avatar: string): boolean {
    if (this.state.phase !== 'waiting') return false;
    if (this.state.players.length >= MAX_PLAYERS) return false;
    if (this.state.players.some(p => p.id === id)) return false;
    if (this.state.players.some(p => p.avatar === avatar)) return false;

    this.state.players.push({
      id, name, avatar, position: 0, money: STARTING_MONEY,
      properties: [], bankrupt: false, inJail: false, jailTurns: 0, getOutOfJailCards: 0,
    });
    this.addLog(`${name} ${avatar} joined`);
    return true;
  }

  removePlayer(id: string): void {
    const player = this.state.players.find(p => p.id === id);
    if (!player) return;
    this.state.ownedProperties = this.state.ownedProperties.filter(op => op.ownerId !== id);
    this.state.players = this.state.players.filter(p => p.id !== id);
    this.addLog(`${player.name} left`);
    if (this.state.players.length > 0 && this.state.currentPlayerIndex >= this.state.players.length) {
      this.state.currentPlayerIndex = 0;
    }
    if (this.state.phase !== 'waiting' && this.state.phase !== 'finished') {
      const active = this.state.players.filter(p => !p.bankrupt);
      if (active.length <= 1 && active.length > 0) {
        this.state.winner = active[0].id;
        this.state.phase = 'finished';
        this.addLog(`🏆 ${active[0].name} wins!`);
      } else if (active.length === 0) this.state.phase = 'waiting';
    }
  }

  // ─── Game start ─────────────────────────────────────────────

  startGame(requesterId: string): boolean {
    if (this.state.phase !== 'waiting') return false;
    if (this.state.players.length < MIN_PLAYERS) return false;
    if (this.state.players[0]?.id !== requesterId) return false;
    this.state.phase = 'rolling';
    this.state.currentPlayerIndex = 0;
    this.addLog('🎲 Game started!');
    return true;
  }

  // ─── Dice roll ──────────────────────────────────────────────

  rollDice(playerId: string): { dice: [number, number] } | null {
    const cur = this.getCurrentPlayer();
    if (!cur || cur.id !== playerId) return null;

    // Jail roll
    if (this.state.phase === 'jailDecision') return this.jailRoll(cur);
    if (this.state.phase !== 'rolling') return null;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;
    const isDoubles = d1 === d2;
    this.state.lastDiceRoll = [d1, d2];

    if (isDoubles) {
      this.state.doublesCount++;
      // 3 doubles in a row → jail
      if (this.state.doublesCount >= 3) {
        this.addLog(`${cur.name} rolled 3 doubles → Semafor!`);
        this.sendToJail(cur);
        return { dice: [d1, d2] };
      }
      this.addLog(`${cur.name} rolled ${d1}+${d2}=${total} (DOUBLES!)`);
    } else {
      this.state.doublesCount = 0;
      this.addLog(`${cur.name} rolled ${d1}+${d2}=${total}`);
    }

    this.movePlayer(cur, total, isDoubles);
    return { dice: [d1, d2] };
  }

  private jailRoll(player: Player): { dice: [number, number] } | null {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    this.state.lastDiceRoll = [d1, d2];

    if (d1 === d2) {
      this.addLog(`${player.name} rolled doubles ${d1}+${d2} and escaped Semafor!`);
      player.inJail = false;
      player.jailTurns = 0;
      this.state.doublesCount = 0;
      this.movePlayer(player, d1 + d2, false);
    } else {
      player.jailTurns++;
      if (player.jailTurns >= 3) {
        player.money -= JAIL_FINE;
        player.inJail = false;
        player.jailTurns = 0;
        this.addLog(`${player.name} paid $${JAIL_FINE} after 3 turns and left Semafor`);
        this.movePlayer(player, d1 + d2, false);
        if (player.money <= 0) { player.bankrupt = true; this.addLog(`💀 ${player.name} is bankrupt!`); this.checkWin(); }
      } else {
        this.addLog(`${player.name} rolled ${d1}+${d2} — no doubles, stays in Semafor (turn ${player.jailTurns}/3)`);
        this.state.phase = 'endTurn';
      }
    }
    return { dice: [d1, d2] };
  }

  // ─── Movement ───────────────────────────────────────────────

  private movePlayer(player: Player, steps: number, isDoubles: boolean): void {
    const oldPos = player.position;
    const newPos = (oldPos + steps + BOARD_SIZE) % BOARD_SIZE;
    if (steps > 0 && newPos < oldPos) {
      player.money += PASS_GO_BONUS;
      this.addLog(`${player.name} passed Start (+$${PASS_GO_BONUS})`);
    }
    player.position = newPos;
    this.processLanding(player, isDoubles);
  }

  // ─── Landing logic ──────────────────────────────────────────

  private processLanding(player: Player, isDoubles: boolean): void {
    const tile = tiles[player.position];
    if (!tile) { this.toEndOrRoll(isDoubles); return; }

    switch (tile.type) {
      case 'property': case 'cfr': case 'statie': {
        const owned = this.state.ownedProperties.find(op => op.tileId === tile.id);
        if (!owned && tile.price) {
          this.state.phase = player.money >= tile.price ? 'buying' : (() => {
            this.addLog(`${player.name} can't afford ${tile.name}`);
            return isDoubles ? 'rolling' as const : 'endTurn' as const;
          })();
        } else if (owned && owned.ownerId !== player.id && !owned.mortgaged) {
          const rent = this.calcRent(tile, owned);
          const owner = this.state.players.find(p => p.id === owned.ownerId);
          if (owner && rent > 0 && !owner.bankrupt) {
            const actual = Math.min(rent, player.money);
            player.money -= actual;
            owner.money += actual;
            this.addLog(`${player.name} paid $${actual} rent to ${owner.name}`);
            if (player.money <= 0) { player.bankrupt = true; this.addLog(`💀 ${player.name} bankrupt!`); this.checkWin(); }
          }
          this.toEndOrRoll(isDoubles);
        } else { this.toEndOrRoll(isDoubles); }
        break;
      }
      case 'semafor':
        this.addLog(`${player.name} hit the Semafor → Jail!`);
        this.sendToJail(player);
        break;
      case 'camping':
        player.money -= 50;
        this.addLog(`${player.name} pays $50 camping fee`);
        if (player.money <= 0) { player.bankrupt = true; this.addLog(`💀 ${player.name} bankrupt!`); this.checkWin(); }
        this.toEndOrRoll(isDoubles);
        break;
      case 'surpriza':
        this.processSurprise(player, isDoubles);
        break;
      case 'pod':
        // Bridge toll: $100
        player.money -= 100;
        this.addLog(`${player.name} pays $100 bridge toll`);
        if (player.money <= 0) { player.bankrupt = true; this.addLog(`💀 ${player.name} bankrupt!`); this.checkWin(); }
        this.toEndOrRoll(isDoubles);
        break;
      default:
        this.toEndOrRoll(isDoubles);
    }
  }

  // ─── Surprise cards ─────────────────────────────────────────

  private processSurprise(player: Player, isDoubles: boolean): void {
    const card = this.drawSurprise();
    this.state.lastSurpriseCard = card;
    this.addLog(`🎴 ${card.text}`);

    switch (card.action) {
      case 'receive':
        player.money += card.value!;
        break;
      case 'pay':
        player.money -= card.value!;
        if (player.money <= 0) { player.bankrupt = true; this.addLog(`💀 ${player.name} bankrupt!`); this.checkWin(); }
        break;
      case 'moveTo': {
        const dest = card.tileId!;
        const passedGo = dest < player.position && dest !== 0;
        if (passedGo || (dest === 0)) { player.money += PASS_GO_BONUS; this.addLog(`${player.name} passed Start (+$${PASS_GO_BONUS})`); }
        player.position = dest;
        this.processLanding(player, isDoubles);
        return;
      }
      case 'moveSteps': {
        const newPos = (player.position + card.value! + BOARD_SIZE) % BOARD_SIZE;
        player.position = newPos;
        this.processLanding(player, isDoubles);
        return;
      }
      case 'jail':
        this.sendToJail(player);
        return;
      case 'jailFree':
        player.getOutOfJailCards++;
        break;
      case 'repairs': {
        let cost = 0;
        for (const op of this.state.ownedProperties) {
          if (op.ownerId === player.id) {
            if (op.houses === 5) cost += 100;
            else cost += op.houses * card.value!;
          }
        }
        player.money -= cost;
        this.addLog(`${player.name} pays $${cost} in repairs`);
        if (player.money <= 0) { player.bankrupt = true; this.addLog(`💀 ${player.name} bankrupt!`); this.checkWin(); }
        break;
      }
    }
    this.toEndOrRoll(isDoubles);
  }

  // ─── Buy / Decline ──────────────────────────────────────────

  buyProperty(playerId: string): boolean {
    if (this.state.phase !== 'buying') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    const tile = tiles[p.position];
    if (!tile?.price || p.money < tile.price) return false;
    p.money -= tile.price;
    p.properties.push(tile.id);
    this.state.ownedProperties.push({ tileId: tile.id, ownerId: p.id, houses: 0, mortgaged: false });
    this.addLog(`${p.name} bought ${tile.name} ($${tile.price})`);
    this.toEndOrRoll(this.state.doublesCount > 0);
    return true;
  }

  declinePurchase(playerId: string): boolean {
    if (this.state.phase !== 'buying') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    this.addLog(`${p.name} passed on ${tiles[p.position]?.name}`);
    this.toEndOrRoll(this.state.doublesCount > 0);
    return true;
  }

  // ─── Build / Sell houses ────────────────────────────────────

  buildHouse(playerId: string, tileId: number): boolean {
    if (this.state.phase !== 'endTurn') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    const tile = tiles[tileId];
    if (!tile?.group || !tile.houseCost) return false;

    const op = this.state.ownedProperties.find(o => o.tileId === tileId && o.ownerId === p.id);
    if (!op || op.mortgaged || op.houses >= 5) return false;

    // Must own all in group
    const group = propertyGroups[tile.group];
    if (!group || !group.every(tid => this.state.ownedProperties.some(o => o.tileId === tid && o.ownerId === p.id && !o.mortgaged))) return false;

    // Even building: can't have more than 1 house difference in group
    const groupOps = group.map(tid => this.state.ownedProperties.find(o => o.tileId === tid)!);
    const minHouses = Math.min(...groupOps.map(o => o.houses));
    if (op.houses > minHouses) return false;

    if (p.money < tile.houseCost) return false;
    p.money -= tile.houseCost;
    op.houses++;
    this.addLog(`${p.name} built ${op.houses === 5 ? 'a hotel' : `house #${op.houses}`} on ${tile.name} ($${tile.houseCost})`);
    return true;
  }

  sellHouse(playerId: string, tileId: number): boolean {
    if (this.state.phase !== 'endTurn') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    const tile = tiles[tileId];
    if (!tile?.group || !tile.houseCost) return false;
    const op = this.state.ownedProperties.find(o => o.tileId === tileId && o.ownerId === p.id);
    if (!op || op.houses <= 0) return false;

    // Even selling
    const group = propertyGroups[tile.group];
    if (group) {
      const groupOps = group.map(tid => this.state.ownedProperties.find(o => o.tileId === tid)!);
      const maxHouses = Math.max(...groupOps.map(o => o.houses));
      if (op.houses < maxHouses) return false;
    }

    const refund = Math.floor(tile.houseCost / 2);
    p.money += refund;
    op.houses--;
    this.addLog(`${p.name} sold a house on ${tile.name} (+$${refund})`);
    return true;
  }

  // ─── Mortgage ───────────────────────────────────────────────

  mortgageProperty(playerId: string, tileId: number): boolean {
    if (this.state.phase !== 'endTurn') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    const tile = tiles[tileId];
    if (!tile?.price) return false;
    const op = this.state.ownedProperties.find(o => o.tileId === tileId && o.ownerId === p.id);
    if (!op || op.mortgaged || op.houses > 0) return false;
    const mortgage = Math.floor(tile.price / 2);
    p.money += mortgage;
    op.mortgaged = true;
    this.addLog(`${p.name} mortgaged ${tile.name} (+$${mortgage})`);
    return true;
  }

  unmortgageProperty(playerId: string, tileId: number): boolean {
    if (this.state.phase !== 'endTurn') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    const tile = tiles[tileId];
    if (!tile?.price) return false;
    const op = this.state.ownedProperties.find(o => o.tileId === tileId && o.ownerId === p.id);
    if (!op || !op.mortgaged) return false;
    const cost = Math.floor(tile.price / 2 * 1.1);
    if (p.money < cost) return false;
    p.money -= cost;
    op.mortgaged = false;
    this.addLog(`${p.name} unmortgaged ${tile.name} (-$${cost})`);
    return true;
  }

  // ─── Jail actions ───────────────────────────────────────────

  payJailFine(playerId: string): boolean {
    if (this.state.phase !== 'jailDecision') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId || !p.inJail) return false;
    if (p.money < JAIL_FINE) return false;
    p.money -= JAIL_FINE;
    p.inJail = false;
    p.jailTurns = 0;
    this.addLog(`${p.name} paid $${JAIL_FINE} to leave Semafor`);
    this.state.phase = 'rolling';
    return true;
  }

  useJailCard(playerId: string): boolean {
    if (this.state.phase !== 'jailDecision') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId || !p.inJail || p.getOutOfJailCards <= 0) return false;
    p.getOutOfJailCards--;
    p.inJail = false;
    p.jailTurns = 0;
    this.addLog(`${p.name} used a Get Out of Jail card`);
    this.state.phase = 'rolling';
    return true;
  }

  // ─── End turn ───────────────────────────────────────────────

  endTurn(playerId: string): boolean {
    if (this.state.phase !== 'endTurn') return false;
    const p = this.getCurrentPlayer();
    if (!p || p.id !== playerId) return false;
    this.advanceToNext();
    return true;
  }

  // ─── Helpers ────────────────────────────────────────────────

  private sendToJail(player: Player): void {
    player.inJail = true;
    player.jailTurns = 0;
    player.position = JAIL_POSITION; // Parcare position, but flagged as inJail
    this.state.doublesCount = 0;
    this.state.phase = 'endTurn';
  }

  private toEndOrRoll(isDoubles: boolean): void {
    this.state.phase = isDoubles && this.state.doublesCount > 0 ? 'rolling' : 'endTurn';
  }

  private calcRent(tile: typeof tiles[0], owned: OwnedProperty): number {
    if (tile.type === 'statie') {
      const count = this.state.ownedProperties.filter(o => o.ownerId === owned.ownerId && tiles[o.tileId]?.type === 'statie').length;
      return [25, 50, 100, 200][count - 1] || 25;
    }
    if (tile.type === 'cfr') {
      const count = this.state.ownedProperties.filter(o => o.ownerId === owned.ownerId && tiles[o.tileId]?.type === 'cfr').length;
      return [25, 50, 100, 200][count - 1] || 25;
    }
    if (tile.rent && tile.rent.length > owned.houses) {
      // Double rent if owner has all in group and no houses
      if (owned.houses === 0 && tile.group) {
        const group = propertyGroups[tile.group];
        if (group && group.every(tid => this.state.ownedProperties.some(o => o.tileId === tid && o.ownerId === owned.ownerId))) {
          return tile.rent[0] * 2;
        }
      }
      return tile.rent[owned.houses];
    }
    return tile.price ? Math.floor(tile.price * 0.1) : 0;
  }

  private advanceToNext(): void {
    this.state.doublesCount = 0;
    this.state.lastSurpriseCard = null;
    const active = this.state.players.filter(p => !p.bankrupt);
    if (active.length <= 1) { this.checkWin(); return; }
    let next = (this.state.currentPlayerIndex + 1) % this.state.players.length;
    while (this.state.players[next]?.bankrupt) next = (next + 1) % this.state.players.length;
    this.state.currentPlayerIndex = next;
    this.state.lastDiceRoll = null;
    const np = this.state.players[next];
    if (np) {
      this.addLog(`▶ ${np.name}'s turn`);
      this.state.phase = np.inJail ? 'jailDecision' : 'rolling';
    }
  }

  private checkWin(): void {
    const active = this.state.players.filter(p => !p.bankrupt);
    if (active.length === 1) {
      this.state.winner = active[0].id;
      this.state.phase = 'finished';
      this.addLog(`🏆 ${active[0].name} wins!`);
    } else if (active.length === 0) {
      this.state.phase = 'finished';
      this.addLog('Game over — everyone is bankrupt!');
    }
  }

  private addLog(msg: string): void {
    this.state.log.push(msg);
    if (this.state.log.length > 80) this.state.log = this.state.log.slice(-80);
  }

  getCurrentPlayer(): Player | null {
    return this.state.players[this.state.currentPlayerIndex] ?? null;
  }
}
