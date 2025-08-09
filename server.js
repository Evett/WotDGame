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

const lobbies = new Map(); // lobbyId -> { players: [], chat: [], characters: {}, maxPlayers }
const playerSessions = new Map(); // playerId -> { playerId, socketId, lobbyId, name, gameState, lastSeen }

// === Connection Handling ===
io.on('connection', (socket) => {
  const playerId = socket.handshake.auth?.playerId;
  if (!playerId) {
    socket.disconnect();
    return;
  }

  console.log('User connected:', socket.id, 'playerId:', playerId);

  // If session exists → reconnect
  if (playerSessions.has(playerId)) {
    const session = playerSessions.get(playerId);
    session.socketId = socket.id;
    playerSessions.set(playerId, session);

    if (session.lobbyId && lobbies.has(session.lobbyId)) {
      socket.join(session.lobbyId);
      socket.emit('resync', {
        lobbyId: session.lobbyId,
        playerData: session,
        lobby: lobbies.get(session.lobbyId),
      });
    }
  } else {
    // New session
    playerSessions.set(playerId, { socketId: socket.id, lobbyId: null, gameState: {} });
  }

  // Join lobby
  socket.on('join-lobby', ({ lobbyId, playerName }) => {
    let lobby = lobbies.get(lobbyId);
    if (!lobby) {
      lobby = { players: [], maxPlayers: 2, characters: {} };
      lobbies.set(lobbyId, lobby);
    }

    // Avoid double join
    if (lobby.players.find(p => p.playerId === playerId)) return;

    const player = { id: socket.id, playerId, name: playerName, ready: false };
    lobby.players.push(player);

    // Save in session
    playerSessions.set(playerId, {
      ...playerSessions.get(playerId),
      lobbyId,
      gameState: { scene: 'LobbyScene' }, // default scene
    });

    socket.join(lobbyId);
    io.to(lobbyId).emit('player-list', lobby.players);
  });

  // === Toggle Ready ===
  socket.on('toggle-ready', ({ lobbyId }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    const player = lobby.players.find((p) => p.playerId === playerId);
    if (player) {
      player.ready = !player.ready;
      io.to(lobbyId).emit('player-list', lobby.players);

      const allReady = lobby.players.length > 0 && lobby.players.every((p) => p.ready);
      if (allReady && lobby.players.length === lobby.maxPlayers) {
        io.to(lobbyId).emit('start-game', { players: lobby.players });
      }
    }
  });

  // === Chat ===
  socket.on('chat-message', ({ lobbyId, name, message }) => {
    const chatMsg = { name, message };
    const lobby = lobbies.get(lobbyId);
    if (lobby) {
      lobby.chat.push(chatMsg);
      io.to(lobbyId).emit('chat-message', chatMsg);
    }
  });

  // === Advance Scene ===
  socket.on('advance-scene', ({ lobbyId, scene }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    // Save to each player's gameState
    lobby.players.forEach((p) => {
      const ps = playerSessions.get(p.playerId);
      if (ps) ps.gameState.scene = scene;
    });

    io.to(lobbyId).emit('advance-scene', scene);
  });

  // === Select Character ===
  socket.on('select-character', ({ lobbyId, characterKey }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    // Already chosen a character?
    if (lobby.characters[playerId]) {
      socket.emit('error-message', 'You already selected a character.');
      return;
    }

    // Character already taken?
    const alreadyChosen = Object.values(lobby.characters).includes(characterKey);
    if (alreadyChosen) return;

    lobby.characters[playerId] = characterKey;

    // Save in gameState
    session.gameState.characterKey = characterKey;

    io.to(lobbyId).emit('character-selected', {
      playerId,
      characterKey,
      allSelected: Object.keys(lobby.characters).length === lobby.players.length,
    });
  });

  socket.on('disconnect', () => {
    session.socketId = null;
    session.lastSeen = Date.now();
    console.log(`Player ${playerId} disconnected (soft hold for reconnect)`);
  });
});

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of playerSessions.entries()) {
    if (!session.socketId && now - session.lastSeen > 300000) { // 5 min
      console.log(`Cleaning up session for player ${id}`);
      playerSessions.delete(id);
    }
  }
}, 60000);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
