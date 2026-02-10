import React from 'react';
import type { GameState } from '@turism/shared';
import { MIN_PLAYERS } from '@turism/shared';

interface LobbyProps {
  gameState: GameState;
  roomId: string;
  myId: string | null;
  onStartGame: () => void;
  error: string | null;
}

export default function Lobby({ gameState, roomId, myId, onStartGame, error }: LobbyProps) {
  const isHost = gameState.players[0]?.id === myId;
  const canStart = gameState.players.length >= MIN_PLAYERS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-1">🏠 Game Lobby</h2>

        {/* Room code */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm mb-1">Share this code with friends:</p>
          <div className="inline-block bg-gray-100 rounded-xl px-6 py-3">
            <span className="font-mono text-3xl font-bold tracking-widest text-emerald-700">
              {roomId}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {/* Player list */}
        <div className="space-y-2 mb-6">
          {gameState.players.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                player.id === myId ? 'bg-emerald-50 ring-1 ring-emerald-300' : 'bg-gray-50'
              }`}
            >
              <span className="text-2xl">{player.avatar}</span>
              <span className="font-medium flex-1">{player.name}</span>
              {index === 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  HOST
                </span>
              )}
              {player.id === myId && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  YOU
                </span>
              )}
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 6 - gameState.players.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 opacity-40"
            >
              <span className="text-2xl">👤</span>
              <span className="text-gray-400 italic">Waiting for player...</span>
            </div>
          ))}
        </div>

        {/* Start button (host only) */}
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {canStart
              ? `Start Game (${gameState.players.length} players)`
              : `Need at least ${MIN_PLAYERS} players to start`}
          </button>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Waiting for the host to start the game...
          </p>
        )}
      </div>
    </div>
  );
}
