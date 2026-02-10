import React, { useState } from 'react';
import { useSocket } from './useSocket';
import { TOKEN_EMOJIS } from '@turism/shared';
import Lobby from './Lobby';
import Game from './Game';
import './Board.css';

export default function App() {
  const socket = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(TOKEN_EMOJIS[0]);
  const [joinCode, setJoinCode] = useState('');
  const [screen, setScreen] = useState<'home' | 'lobby' | 'game'>('home');

  // Determine screen based on game state
  const actualScreen = (() => {
    if (!socket.gameState) return screen === 'home' ? 'home' : 'home';
    if (socket.gameState.phase === 'waiting') return 'lobby';
    return 'game';
  })();

  const handleCreate = () => {
    if (!playerName.trim()) return;
    socket.createRoom(playerName.trim(), selectedAvatar);
    setScreen('lobby');
  };

  const handleJoin = () => {
    if (!playerName.trim() || !joinCode.trim()) return;
    socket.joinRoom(joinCode.trim().toUpperCase(), playerName.trim(), selectedAvatar);
    setScreen('lobby');
  };

  // ─── Home screen ────────────────────────────────────────────

  if (actualScreen === 'home' || !socket.gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-1">🎲 Turism</h1>
          <p className="text-gray-500 text-center mb-6 text-sm">Romanian Monopoly — Online</p>

          {socket.error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {socket.error}
            </div>
          )}

          {/* Name */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={20}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Avatar picker */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Choose your token</label>
          <div className="flex gap-2 mb-6 justify-center">
            {TOKEN_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedAvatar(emoji)}
                className={`text-3xl p-2 rounded-lg transition-all ${
                  selectedAvatar === emoji
                    ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-110'
                    : 'hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Create room */}
          <button
            onClick={handleCreate}
            disabled={!playerName.trim() || !socket.connected}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create New Game
          </button>

          {/* Join room */}
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Room code..."
              maxLength={5}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 uppercase tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleJoin}
              disabled={!playerName.trim() || !joinCode.trim() || !socket.connected}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Join
            </button>
          </div>

          {!socket.connected && (
            <p className="text-orange-500 text-xs text-center mt-4">Connecting to server...</p>
          )}
        </div>
      </div>
    );
  }

  // ─── Lobby screen ───────────────────────────────────────────

  if (actualScreen === 'lobby') {
    return (
      <Lobby
        gameState={socket.gameState}
        roomId={socket.roomId ?? socket.gameState.roomId}
        myId={socket.myId}
        onStartGame={socket.startGame}
        error={socket.error}
      />
    );
  }

  // ─── Game screen ────────────────────────────────────────────

  return (
    <Game
      gameState={socket.gameState}
      myId={socket.myId}
      onRollDice={socket.rollDice}
      onBuyProperty={socket.buyProperty}
      onDeclinePurchase={socket.declinePurchase}
      onEndTurn={socket.endTurn}
      error={socket.error}
    />
  );
}
