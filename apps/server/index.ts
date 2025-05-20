import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type { Player } from '@turism/shared';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3001;

app.use(cors());
app.get('/', (req, res) => res.send('Turism backend running.'));

let players: Player[] = [];

io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  socket.on('joinGame', (player) => {
    players.push({ ...player, id: socket.id, position: 0 });
    io.emit('playersUpdate', players);
  });

  socket.on('rollDice', (value: number) => {
    const player = players.find((p) => p.id === socket.id);
    if (player) {
      player.position = (player.position + value) % 40;
      io.emit('playersUpdate', players);
    }
  });

  socket.on('disconnect', () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit('playersUpdate', players);
  });
});

httpServer.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
