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
const playerSessions = new Map();

io.on('connection', (socket) => {

  const playerId = socket.handshake.auth.playerId;
  if (!playerId) {
    console.warn('Connection rejected: no playerId');
    socket.disconnect();
    return;
  }

  console.log(`User connected: ${socket.id} (playerId: ${playerId})`);

  // Reconnect or new session
  const existing = playerSessions.get(playerId);
  if (existing) {
    existing.socketId = socket.id;
    socket.join(existing.lobbyId);

    const lobby = lobbies.get(existing.lobbyId);
    const player = lobby?.players.find(p => p.id === existing.socketId);

    socket.emit('reconnected', {
      lobbyId: existing.lobbyId,
      playerData: player || { name: 'Unknown', id: socket.id },
    });
  }

  socket.on('join-lobby', ({ lobbyId, playerName }) => {
    let lobby = lobbies.get(lobbyId);

    if (!lobby) {
      lobby = {
        players: [],
        maxPlayers: 2,
        chat: [],
        characters: {},
        currentScene: null
      };
      lobbies.set(lobbyId, lobby);
    }

    if (lobby.players.find(p => p.id === socket.id)) {
      socket.emit('error-message', 'You have already joined this lobby.');
      return;
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit('lobby-full');
      return;
    }

    const player = { id: socket.id, name: playerName, ready: false };
    lobby.players.push(player);

    playerSessions.set(socket.handshake.auth.playerId, {
      socketId: socket.id,
      scene: 'MenuScene', 
      gameState: {},       
      character: null,
      lobbyId: lobbyId,
    });

    socket.join(lobbyId);
    io.to(lobbyId).emit('player-list', lobby.players);
  });

  socket.on('request-sync', ({ playerId, lobbyId }) => {
    const session = playerSessions.get(playerId);
    const lobby = lobbies.get(lobbyId);
    console.log(`User session sync request: ${session} for lobby: ${lobby})`)
    if (!lobby) return;

    const player = lobby.players.find(p => p.id === socket.id);
    if (!player) return;

    socket.emit('resync-data', {
      gameState: session.gameState,
      playerData: player,
      scene: lobby.currentScene || 'MenuScene'
    });
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

  socket.on('advance-scene', ({ lobbyId, scene }) => {
    const lobby = lobbies.get(lobbyId);
    if (lobby) {
      lobby.currentScene = scene;
      lobby.players.forEach(p => {
        io.to(p.id).emit('advance-scene', scene);
      });
    }
  });

  socket.on('select-character', ({ lobbyId, playerId, characterKey }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    if (lobby.characters[playerId]) {
      socket.emit('error-message', 'You already selected a character.');
      return;
    }

    const alreadyChosen = Object.values(lobby.characters).includes(characterKey);
    if (alreadyChosen) return;

    lobby.characters[playerId] = characterKey;

    io.to(lobbyId).emit('character-selected', {
      playerId,
      characterKey,
      allSelected: Object.keys(lobby.characters).length === lobby.players.length
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id} (playerId: ${playerId})`);
    /*for (const [lobbyId, lobby] of lobbies.entries()) {
      lobby.players = lobby.players.filter(p => p.id !== socket.id);
      io.to(lobbyId).emit('player-list', lobby.players);
      if (lobby.players.length === 0) {
        lobbies.delete(lobbyId);
      }
    }
    console.log('User disconnected:', socket.id);*/
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