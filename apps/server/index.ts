import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type { ServerToClientEvents, ClientToServerEvents } from '../../packages/shared';
import { GameRoom } from './GameRoom';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3001;

app.use(cors());
app.get('/', (_req, res) => res.send('Turism backend running.'));
app.get('/health', (_req, res) => res.json({ status: 'ok', rooms: rooms.size }));

const rooms = new Map<string, GameRoom>();
const playerRooms = new Map<string, string>();

function genId(): string {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 5; i++) id += c[Math.floor(Math.random() * c.length)];
  return id;
}

function broadcast(roomId: string) {
  const r = rooms.get(roomId);
  if (r) io.to(roomId).emit('gameState', r.state);
}

function getRoom(socketId: string) {
  const roomId = playerRooms.get(socketId);
  if (!roomId) return null;
  const room = rooms.get(roomId);
  if (!room) return null;
  return { roomId, room };
}

io.on('connection', (socket) => {
  console.log(`[+] ${socket.id}`);

  socket.on('createRoom', ({ name, avatar }) => {
    const roomId = genId();
    const room = new GameRoom(roomId);
    if (!room.addPlayer(socket.id, name, avatar)) { socket.emit('error', 'Failed'); return; }
    rooms.set(roomId, room);
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    broadcast(roomId);
  });

  socket.on('joinRoom', ({ roomId, name, avatar }) => {
    const room = rooms.get(roomId);
    if (!room) { socket.emit('error', `Room ${roomId} not found`); return; }
    if (!room.addPlayer(socket.id, name, avatar)) { socket.emit('error', 'Cannot join'); return; }
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    broadcast(roomId);
  });

  socket.on('startGame', () => { const r = getRoom(socket.id); if (r && r.room.startGame(socket.id)) broadcast(r.roomId); });
  socket.on('rollDice', () => { const r = getRoom(socket.id); if (r && r.room.rollDice(socket.id)) broadcast(r.roomId); });
  socket.on('buyProperty', () => { const r = getRoom(socket.id); if (r && r.room.buyProperty(socket.id)) broadcast(r.roomId); });
  socket.on('declinePurchase', () => { const r = getRoom(socket.id); if (r) { r.room.declinePurchase(socket.id); broadcast(r.roomId); } });
  socket.on('endTurn', () => { const r = getRoom(socket.id); if (r) { r.room.endTurn(socket.id); broadcast(r.roomId); } });
  socket.on('buildHouse', (tileId) => { const r = getRoom(socket.id); if (r && r.room.buildHouse(socket.id, tileId)) broadcast(r.roomId); });
  socket.on('sellHouse', (tileId) => { const r = getRoom(socket.id); if (r && r.room.sellHouse(socket.id, tileId)) broadcast(r.roomId); });
  socket.on('mortgageProperty', (tileId) => { const r = getRoom(socket.id); if (r && r.room.mortgageProperty(socket.id, tileId)) broadcast(r.roomId); });
  socket.on('unmortgageProperty', (tileId) => { const r = getRoom(socket.id); if (r && r.room.unmortgageProperty(socket.id, tileId)) broadcast(r.roomId); });
  socket.on('payJailFine', () => { const r = getRoom(socket.id); if (r && r.room.payJailFine(socket.id)) broadcast(r.roomId); });
  socket.on('useJailCard', () => { const r = getRoom(socket.id); if (r && r.room.useJailCard(socket.id)) broadcast(r.roomId); });

  socket.on('disconnect', () => {
    const r = getRoom(socket.id);
    if (r) {
      r.room.removePlayer(socket.id);
      if (r.room.state.players.length === 0) rooms.delete(r.roomId);
      else broadcast(r.roomId);
    }
    playerRooms.delete(socket.id);
  });
});

setInterval(() => { for (const [id, r] of rooms) if (r.state.players.length === 0) rooms.delete(id); }, 30 * 60 * 1000);
httpServer.listen(PORT, () => console.log(`Server on port ${PORT}`));
