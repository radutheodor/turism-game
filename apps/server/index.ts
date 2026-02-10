import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type { ServerToClientEvents, ClientToServerEvents } from '@turism/shared';
import { GameRoom } from './GameRoom';

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.get('/', (_req, res) => res.send('Turism backend running.'));
app.get('/health', (_req, res) => res.json({ status: 'ok', rooms: rooms.size }));

// ─── Room management ────────────────────────────────────────────

const rooms = new Map<string, GameRoom>();
const playerRooms = new Map<string, string>(); // socketId → roomId

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function broadcastState(roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit('gameState', room.state);
}

// ─── Socket handlers ────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[connect] ${socket.id}`);

  socket.on('createRoom', ({ name, avatar }) => {
    const roomId = generateRoomId();
    const room = new GameRoom(roomId);

    const added = room.addPlayer(socket.id, name, avatar);
    if (!added) {
      socket.emit('error', 'Failed to create room');
      return;
    }

    rooms.set(roomId, room);
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);

    console.log(`[room] ${name} created room ${roomId}`);
    socket.emit('roomCreated', roomId);
    broadcastState(roomId);
  });

  socket.on('joinRoom', ({ roomId, name, avatar }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', `Room ${roomId} not found`);
      return;
    }

    const added = room.addPlayer(socket.id, name, avatar);
    if (!added) {
      socket.emit('error', 'Cannot join — room full, game already started, or avatar taken');
      return;
    }

    playerRooms.set(socket.id, roomId);
    socket.join(roomId);

    console.log(`[room] ${name} joined room ${roomId}`);
    broadcastState(roomId);
  });

  socket.on('startGame', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const started = room.startGame(socket.id);
    if (!started) {
      socket.emit('error', 'Cannot start — not enough players or not the host');
      return;
    }

    console.log(`[game] Room ${roomId} started`);
    broadcastState(roomId);
  });

  socket.on('rollDice', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const result = room.rollDice(socket.id);
    if (!result) {
      socket.emit('error', 'Not your turn or wrong phase');
      return;
    }

    broadcastState(roomId);
  });

  socket.on('buyProperty', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    if (!room.buyProperty(socket.id)) {
      socket.emit('error', 'Cannot buy this property');
      return;
    }

    broadcastState(roomId);
  });

  socket.on('declinePurchase', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.declinePurchase(socket.id);
    broadcastState(roomId);
  });

  socket.on('endTurn', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.endTurn(socket.id);
    broadcastState(roomId);
  });

  socket.on('disconnect', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    console.log(`[disconnect] ${socket.id} from room ${roomId}`);

    const room = rooms.get(roomId);
    if (room) {
      room.removePlayer(socket.id);

      if (room.state.players.length === 0) {
        rooms.delete(roomId);
        console.log(`[room] Room ${roomId} deleted (empty)`);
      } else {
        broadcastState(roomId);
      }
    }

    playerRooms.delete(socket.id);
  });
});

// ─── Cleanup stale rooms every 30 minutes ───────────────────────

setInterval(() => {
  for (const [roomId, room] of rooms) {
    if (room.state.players.length === 0) {
      rooms.delete(roomId);
      console.log(`[cleanup] Removed empty room ${roomId}`);
    }
  }
}, 30 * 60 * 1000);

httpServer.listen(PORT, () => {
  console.log(`Turism server listening on port ${PORT}`);
});
