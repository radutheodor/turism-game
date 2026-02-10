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
    socket.on('gameState', (s) => { setGameState(s); setError(null); });
    socket.on('roomCreated', (id) => setRoomId(id));
    socket.on('error', (msg) => { setError(msg); setTimeout(() => setError(null), 3000); });
    return () => { socket.disconnect(); };
  }, []);

  const emit = (ev: string, ...args: any[]) => (socketRef.current as any)?.emit(ev, ...args);

  return {
    gameState, roomId, error, connected,
    myId: socketRef.current?.id ?? null,
    createRoom: (name: string, avatar: string) => emit('createRoom', { name, avatar }),
    joinRoom: (roomId: string, name: string, avatar: string) => emit('joinRoom', { roomId, name, avatar }),
    startGame: () => emit('startGame'),
    rollDice: () => emit('rollDice'),
    buyProperty: () => emit('buyProperty'),
    declinePurchase: () => emit('declinePurchase'),
    endTurn: () => emit('endTurn'),
    buildHouse: (tileId: number) => emit('buildHouse', tileId),
    sellHouse: (tileId: number) => emit('sellHouse', tileId),
    mortgageProperty: (tileId: number) => emit('mortgageProperty', tileId),
    unmortgageProperty: (tileId: number) => emit('unmortgageProperty', tileId),
    payJailFine: () => emit('payJailFine'),
    useJailCard: () => emit('useJailCard'),
  };
}
