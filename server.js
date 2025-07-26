import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const lobbies = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-lobby', ({ lobbyId, playerName }) => {
    let lobby = lobbies.get(lobbyId);

    if (!lobby) {
      // Create new lobby
      lobby = {
        players: [],
        maxPlayers: 6, // default, could be sent from client
        chat: [],
      };
      lobbies.set(lobbyId, lobby);
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit('lobby-full');
      return;
    }

    const player = { id: socket.id, name: playerName, ready: false };
    lobby.players.push(player);

    socket.join(lobbyId);
    io.to(lobbyId).emit('player-list', lobby.players);
  });

  socket.on('set-max-players', ({ lobbyId, maxPlayers }) => {
    const lobby = lobbies.get(lobbyId);
    if (lobby) {
      lobby.maxPlayers = Math.min(maxPlayers, 6);
    }
  });

  socket.on('toggle-ready', ({ lobbyId }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    const player = lobby.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(lobbyId).emit('player-list', lobby.players);

      const allReady = lobby.players.length > 0 && lobby.players.every(p => p.ready);
      if (allReady && lobby.players.length === lobby.maxPlayers) {
        io.to(lobbyId).emit('start-game', { players: lobby.players });
      }
    }
  });

  socket.on('chat-message', ({ lobbyId, name, message }) => {
    const chat = { name, message };
    const lobby = lobbies.get(lobbyId);
    if (lobby) {
      lobby.chat.push(chat);
      io.to(lobbyId).emit('chat-message', chat);
    }
  });

  socket.on('disconnect', () => {
    for (const [lobbyId, lobby] of lobbies.entries()) {
      lobby.players = lobby.players.filter(p => p.id !== socket.id);
      io.to(lobbyId).emit('player-list', lobby.players);
      if (lobby.players.length === 0) {
        lobbies.delete(lobbyId);
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});