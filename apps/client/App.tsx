import * as React from 'react';
import Board from './Board';
import Dice from './Dice';
import './Board.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL);
const tokenEmojis = ['🚗', '🧢', '🐧', '🧀', '🧛', '🐶'];

function App() {
  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    socket.on('playersUpdate', (updatedPlayers) => {
      setPlayers(updatedPlayers);

      // ✅ Only update local "me" after animation finishes
      if (!isAnimating && me) {
        const updatedMe = updatedPlayers.find((p) => p.id === me.id);
        if (updatedMe) setMe(updatedMe);
      }
    });

    return () => {
      socket.off('playersUpdate');
    };
  }, [me, isAnimating]);

  const joinGame = () => {
    const name = prompt('Enter your name');
    const avatar = tokenEmojis[Math.floor(Math.random() * tokenEmojis.length)];
    const player = { name, avatar, money: 1500 };
    setMe(player);
    socket.emit('joinGame', player);
  };

  //const rollDice = () => socket.emit('rollDice');
  const handleRollComplete = (value: number) => {
    if (!me) return;

    let tempPos = me.position;
    const steps = value;
    const delay = 200;

    setIsAnimating(true);

    const animateStep = (step: number) => {
      if (step >= steps) {
        setTimeout(() => {
          socket.emit('rollDice', value);
          setIsAnimating(false); // ✅ allow server sync again
        }, 100);
        return;
      }

      tempPos = (tempPos + 1) % 40;
      setMe((prev) => (prev ? { ...prev, position: tempPos } : null));

      setTimeout(() => animateStep(step + 1), delay);
    };

    animateStep(0);
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-xl font-bold">🎲 Turism (Romanian Monopoly)</h1>

      {!me && (
        <button onClick={joinGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Join Game
        </button>
      )}

      {me && (
        <div className="flex justify-center my-4">
          <Dice onRollComplete={handleRollComplete} />
        </div>
      )}

      {/* Add the board here */}
      <div className="my-8 flex justify-center">
        <Board players={players} />
      </div>

      {/* Existing player list */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {players.map((p) => (
          <div key={p.id} className="border p-2 rounded shadow">
            <span className="text-2xl">{p.avatar}</span>
            <div>{p.name}</div>
            <div>Tile: {p.position}</div>
            <div>💰 {p.money}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
