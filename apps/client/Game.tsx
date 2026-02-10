import React from 'react';
import type { GameState } from '@turism/shared';
import { tiles } from '@turism/shared';
import Board from './Board';
import Dice from './Dice';
import GameLog from './GameLog';

interface GameProps {
  gameState: GameState;
  myId: string | null;
  onRollDice: () => void;
  onBuyProperty: () => void;
  onDeclinePurchase: () => void;
  onEndTurn: () => void;
  error: string | null;
}

export default function Game({
  gameState,
  myId,
  onRollDice,
  onBuyProperty,
  onDeclinePurchase,
  onEndTurn,
  error,
}: GameProps) {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myId;
  const me = gameState.players.find((p) => p.id === myId);
  const currentTile = currentPlayer ? tiles[currentPlayer.position] : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="bg-emerald-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold">🎲 Turism</span>
          <span className="text-emerald-300 text-sm">Room: {gameState.roomId}</span>
        </div>
        <div className="text-sm">
          {gameState.phase === 'finished' ? (
            <span className="text-yellow-300 font-bold">🏆 Game Over!</span>
          ) : (
            <span>
              Turn: <strong>{currentPlayer?.avatar} {currentPlayer?.name}</strong>
              {isMyTurn && <span className="ml-2 text-yellow-300">(YOUR TURN)</span>}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm text-center">{error}</div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-auto">
        {/* Board */}
        <div className="flex-1 flex justify-center items-start overflow-auto">
          <Board players={gameState.players} ownedProperties={gameState.ownedProperties} />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Dice & Actions */}
          <div className="bg-white rounded-xl shadow p-4">
            <Dice
              values={gameState.lastDiceRoll}
              canRoll={isMyTurn && gameState.phase === 'rolling'}
              onRoll={onRollDice}
            />

            {/* Buy/Decline buttons */}
            {isMyTurn && gameState.phase === 'buying' && currentTile && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-600 mb-2 text-center">
                  Buy <strong>{currentTile.name}</strong> for <strong>${currentTile.price}</strong>?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onBuyProperty}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Buy ${currentTile.price}
                  </button>
                  <button
                    onClick={onDeclinePurchase}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                  >
                    Pass
                  </button>
                </div>
              </div>
            )}

            {/* End turn */}
            {isMyTurn && gameState.phase === 'endTurn' && (
              <div className="mt-4">
                <button
                  onClick={onEndTurn}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  End Turn
                </button>
              </div>
            )}

            {/* Waiting message */}
            {!isMyTurn && gameState.phase !== 'finished' && (
              <p className="mt-4 text-gray-400 text-sm text-center">
                Waiting for {currentPlayer?.name} to play...
              </p>
            )}

            {/* Winner */}
            {gameState.phase === 'finished' && gameState.winner && (
              <div className="mt-4 text-center">
                <p className="text-2xl mb-1">🏆</p>
                <p className="font-bold text-lg">
                  {gameState.players.find((p) => p.id === gameState.winner)?.name} wins!
                </p>
              </div>
            )}
          </div>

          {/* Players */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">Players</h3>
            <div className="space-y-2">
              {gameState.players.map((player, index) => {
                const isCurrent = index === gameState.currentPlayerIndex;
                const propertyCount = gameState.ownedProperties.filter(
                  (op) => op.ownerId === player.id
                ).length;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      player.bankrupt
                        ? 'bg-red-50 opacity-50'
                        : isCurrent
                          ? 'bg-emerald-50 ring-1 ring-emerald-300'
                          : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{player.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {player.name}
                        {player.id === myId && (
                          <span className="text-emerald-600 text-xs ml-1">(you)</span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs">
                        💰 ${player.money} · 🏠 {propertyCount}
                        {player.bankrupt && ' · 💀 Bankrupt'}
                      </div>
                    </div>
                    {isCurrent && !player.bankrupt && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* My properties */}
          {me && (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">My Properties</h3>
              {me.properties.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No properties yet</p>
              ) : (
                <div className="space-y-1">
                  {me.properties.map((tileId) => {
                    const tile = tiles[tileId];
                    if (!tile) return null;
                    return (
                      <div
                        key={tileId}
                        className="flex items-center gap-2 text-sm p-1.5 rounded bg-gray-50"
                      >
                        <span className="font-medium">{tile.name}</span>
                        <span className="text-gray-400 ml-auto text-xs">${tile.price}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Game log */}
          <GameLog log={gameState.log} />
        </div>
      </div>
    </div>
  );
}
