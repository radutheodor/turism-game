import React, { useState } from 'react';
import type { GameState } from '@turism/shared';
import { tiles, groupColors, propertyGroups } from '@turism/shared';
import Board from './Board';
import Dice3D from './Dice3D';
import GameLog from './GameLog';

interface GameProps {
  gameState: GameState;
  myId: string | null;
  onRollDice: () => void;
  onBuyProperty: () => void;
  onDeclinePurchase: () => void;
  onEndTurn: () => void;
  onBuildHouse: (tileId: number) => void;
  onSellHouse: (tileId: number) => void;
  onMortgage: (tileId: number) => void;
  onUnmortgage: (tileId: number) => void;
  onPayJailFine: () => void;
  onUseJailCard: () => void;
  error: string | null;
}

export default function Game({
  gameState, myId, onRollDice, onBuyProperty, onDeclinePurchase, onEndTurn,
  onBuildHouse, onSellHouse, onMortgage, onUnmortgage, onPayJailFine, onUseJailCard, error,
}: GameProps) {
  const [showPropMgr, setShowPropMgr] = useState(false);
  const cur = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = cur?.id === myId;
  const me = gameState.players.find(p => p.id === myId);
  const curTile = cur ? tiles[cur.position] : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="bg-emerald-800 text-white px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base">🎲 Turism</span>
          <span className="text-emerald-300 text-xs">Room: {gameState.roomId}</span>
        </div>
        <div>
          {gameState.phase === 'finished' ? (
            <span className="text-yellow-300 font-bold">🏆 Game Over!</span>
          ) : (
            <span>
              {cur?.avatar} <strong>{cur?.name}</strong>
              {isMyTurn && <span className="ml-2 text-yellow-300 font-bold">YOUR TURN</span>}
            </span>
          )}
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 text-sm text-center">{error}</div>}

      {/* Surprise card banner */}
      {gameState.lastSurpriseCard && (
        <div className="bg-pink-50 border-b border-pink-200 px-4 py-2 text-center text-sm">
          <span className="font-bold text-pink-700">🎴 Surpriză:</span>{' '}
          <span className="text-pink-900">{gameState.lastSurpriseCard.text}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 overflow-auto">
        {/* Board */}
        <div className="flex-1 flex justify-center items-start overflow-auto">
          <Board players={gameState.players} ownedProperties={gameState.ownedProperties} />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-80 flex flex-col gap-3 flex-shrink-0">
          {/* Dice & Actions */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <Dice3D
              values={gameState.lastDiceRoll}
              canRoll={isMyTurn && (gameState.phase === 'rolling' || gameState.phase === 'jailDecision')}
              onRoll={onRollDice}
            />

            {/* Jail decision */}
            {isMyTurn && gameState.phase === 'jailDecision' && me?.inJail && (
              <div className="mt-3 border-t pt-3 space-y-2">
                <p className="text-sm text-center font-medium text-orange-700">🚦 You're at Semafor!</p>
                <div className="flex gap-2">
                  <button onClick={onPayJailFine} disabled={(me?.money ?? 0) < 50}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-40">
                    Pay $50
                  </button>
                  {(me?.getOutOfJailCards ?? 0) > 0 && (
                    <button onClick={onUseJailCard}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                      Use Card 🃏
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 text-center">Or roll doubles to escape</p>
              </div>
            )}

            {/* Buy/Decline */}
            {isMyTurn && gameState.phase === 'buying' && curTile && (
              <div className="mt-3 border-t pt-3">
                <p className="text-sm text-gray-600 mb-2 text-center">
                  Buy <strong>{curTile.name}</strong> {curTile.icon} for <strong>${curTile.price}</strong>?
                </p>
                <div className="flex gap-2">
                  <button onClick={onBuyProperty}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium">
                    Buy ${curTile.price}
                  </button>
                  <button onClick={onDeclinePurchase}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium">
                    Pass
                  </button>
                </div>
              </div>
            )}

            {/* End turn + Property manager */}
            {isMyTurn && gameState.phase === 'endTurn' && (
              <div className="mt-3 space-y-2">
                <button onClick={() => setShowPropMgr(!showPropMgr)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium border border-blue-200">
                  {showPropMgr ? '▲ Hide Properties' : '▼ Manage Properties'}
                </button>
                <button onClick={onEndTurn}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold">
                  End Turn →
                </button>
              </div>
            )}

            {!isMyTurn && gameState.phase !== 'finished' && (
              <p className="mt-3 text-gray-400 text-xs text-center">Waiting for {cur?.name}...</p>
            )}

            {gameState.phase === 'finished' && gameState.winner && (
              <div className="mt-3 text-center">
                <p className="text-3xl">🏆</p>
                <p className="font-bold text-lg">{gameState.players.find(p => p.id === gameState.winner)?.name} wins!</p>
              </div>
            )}
          </div>

          {/* Property Manager (expandable) */}
          {showPropMgr && isMyTurn && gameState.phase === 'endTurn' && me && (
            <PropertyManager
              me={me}
              gameState={gameState}
              onBuildHouse={onBuildHouse}
              onSellHouse={onSellHouse}
              onMortgage={onMortgage}
              onUnmortgage={onUnmortgage}
            />
          )}

          {/* Players */}
          <div className="bg-white rounded-xl shadow-md p-3">
            <h3 className="font-bold text-xs text-gray-500 uppercase mb-2">Players</h3>
            <div className="space-y-1.5">
              {gameState.players.map((player, i) => {
                const isCur = i === gameState.currentPlayerIndex;
                const props = gameState.ownedProperties.filter(op => op.ownerId === player.id).length;
                return (
                  <div key={player.id} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                    player.bankrupt ? 'bg-red-50 opacity-50' : isCur ? 'bg-emerald-50 ring-1 ring-emerald-300' : 'bg-gray-50'
                  }`}>
                    <span className="text-xl">{player.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {player.name}
                        {player.id === myId && <span className="text-emerald-600 text-xs ml-1">(you)</span>}
                        {player.inJail && <span className="text-orange-500 text-xs ml-1">🚦</span>}
                      </div>
                      <div className="text-gray-500 text-xs">
                        💰${player.money} · 🏠{props}
                        {player.getOutOfJailCards > 0 && ` · 🃏${player.getOutOfJailCards}`}
                        {player.bankrupt && ' · 💀'}
                      </div>
                    </div>
                    {isCur && !player.bankrupt && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game log */}
          <GameLog log={gameState.log} />
        </div>
      </div>
    </div>
  );
}

// ─── Property Manager subcomponent ────────────────────────────

function PropertyManager({ me, gameState, onBuildHouse, onSellHouse, onMortgage, onUnmortgage }: {
  me: GameProps['gameState']['players'][0];
  gameState: GameState;
  onBuildHouse: (id: number) => void;
  onSellHouse: (id: number) => void;
  onMortgage: (id: number) => void;
  onUnmortgage: (id: number) => void;
}) {
  if (me.properties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <p className="text-gray-400 text-xs italic text-center">No properties yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-3 max-h-60 overflow-y-auto">
      <h3 className="font-bold text-xs text-gray-500 uppercase mb-2">Build / Mortgage</h3>
      <div className="space-y-1">
        {me.properties.map(tid => {
          const t = tiles[tid];
          const op = gameState.ownedProperties.find(o => o.tileId === tid);
          if (!t || !op) return null;

          const ownsGroup = t.group && propertyGroups[t.group]?.every(
            g => gameState.ownedProperties.some(o => o.tileId === g && o.ownerId === me.id && !o.mortgaged)
          );
          const canBuild = ownsGroup && t.houseCost && !op.mortgaged && op.houses < 5 && me.money >= (t.houseCost || 0);
          const gc = t.group ? groupColors[t.group] : undefined;

          return (
            <div key={tid} className="flex items-center gap-1.5 text-xs p-1.5 rounded bg-gray-50">
              {gc && <span className="w-2 h-full rounded-sm" style={{ backgroundColor: gc, minHeight: 16, display: 'inline-block' }} />}
              <span>{t.icon}</span>
              <span className="font-medium flex-1 truncate">{t.name}</span>
              {op.houses > 0 && op.houses < 5 && <span className="text-gray-500">{op.houses}🏠</span>}
              {op.houses === 5 && <span>🏨</span>}
              {op.mortgaged && <span className="text-red-500 font-bold text-[10px]">MORT</span>}
              <div className="flex gap-0.5 flex-shrink-0">
                {canBuild && (
                  <button onClick={() => onBuildHouse(tid)} className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] hover:bg-green-200 font-bold" title={`Build $${t.houseCost}`}>+🏠</button>
                )}
                {op.houses > 0 && (
                  <button onClick={() => onSellHouse(tid)} className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] hover:bg-red-200 font-bold" title="Sell house">-🏠</button>
                )}
                {!op.mortgaged && op.houses === 0 && (
                  <button onClick={() => onMortgage(tid)} className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] hover:bg-yellow-200 font-bold" title={`Mortgage +$${Math.floor((t.price || 0) / 2)}`}>M</button>
                )}
                {op.mortgaged && (
                  <button onClick={() => onUnmortgage(tid)} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] hover:bg-blue-200 font-bold" title="Unmortgage">U</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
