import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, GameState } from '@turism/shared';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<TypedSocket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket: TypedSocket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('gameState', (state) => {
      setGameState(state);
      setError(null);
    });

    socket.on('roomCreated', (id) => {
      setRoomId(id);
    });

    socket.on('error', (msg) => {
      setError(msg);
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = (name: string, avatar: string) => {
    socketRef.current?.emit('createRoom', { name, avatar });
  };

  const joinRoom = (roomId: string, name: string, avatar: string) => {
    socketRef.current?.emit('joinRoom', { roomId, name, avatar });
  };

  const startGame = () => {
    socketRef.current?.emit('startGame');
  };

  const rollDice = () => {
    socketRef.current?.emit('rollDice');
  };

  const buyProperty = () => {
    socketRef.current?.emit('buyProperty');
  };

  const declinePurchase = () => {
    socketRef.current?.emit('declinePurchase');
  };

  const endTurn = () => {
    socketRef.current?.emit('endTurn');
  };

  const myId = socketRef.current?.id ?? null;

  return {
    gameState,
    roomId,
    error,
    connected,
    myId,
    createRoom,
    joinRoom,
    startGame,
    rollDice,
    buyProperty,
    declinePurchase,
    endTurn,
  };
}
