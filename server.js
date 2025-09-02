// server.js
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

// Lobby and session stores
const lobbies = new Map(); // lobbyId -> { players: [{playerId,name,ready}], characters: {playerId:key}, maxPlayers, chat, currentScene }
const playerSessions = new Map(); // playerId -> { playerId, socketId, lobbyId, name, gameState, lastSeen }

io.on('connection', (socket) => {
  const playerId = socket.handshake.auth?.playerId;
  if (!playerId) {
    console.log('Connection rejected: missing playerId');
    socket.disconnect();
    return;
  }

  console.log(`Socket connected: ${socket.id} (playerId: ${playerId})`);
  let session = playerSessions.get(playerId);

  if (session) {
    // Reconnect: attach socket and rejoin lobby
    session.socketId = socket.id;
    session.lastSeen = Date.now();
    playerSessions.set(playerId, session);
    console.log("PlayerSession reconnecting:", session);

    if (session.lobbyId && lobbies.has(session.lobbyId)) {
      socket.join(session.lobbyId);
      const lobby = lobbies.get(session.lobbyId);

      // Immediately tell the client to jump to the current scene
      socket.emit('resync-data', {
          gameState: session.gameState || {},
          session: {
              playerId: session.playerId,
              name: session.name,
              lobbyId: session.lobbyId
          },
          lobby: {
              players: lobby.players,
              characters: lobby.characters,
              currentScene: lobby.currentScene,
              mapChoices: lobby.mapChoices || {}
          },
          sceneToGo: lobby.currentScene || session.gameState.scene || null
      });

      if (lobby.currentScene) {
        const data = readSceneData(lobby.currentScene, lobby);
        socket.emit('scene-data', { scene: lobby.currentScene, data });
      }

      // Also update the player list so UI refreshes
      io.to(session.lobbyId).emit('player-list', lobby.players);
    }
  } else {
    // New session skeleton; will be populated on join-lobby
    session = { playerId, socketId: socket.id, lobbyId: null, name: null, gameState: {}, lastSeen: Date.now() };
    playerSessions.set(playerId, session);
    console.log("New PlayerSessions:", session);

  }

  socket.on('request-sync', ({ lobbyId }) => {
    const s = playerSessions.get(playerId);
    const lobby = lobbies.get(lobbyId);
    console.log(`Player: ${playerId} trying to resync session`, s);

    if (!s) return;

    // Try to figure out the scene from multiple sources
    let sceneToGo = null;

    if (lobby && lobby.currentScene) {
      sceneToGo = lobby.currentScene;
    } else if (s.gameState && s.gameState.scene) {
      sceneToGo = s.gameState.scene;
    }
    console.log(`SceneToGo for resync: ${sceneToGo}`);

    socket.emit('resync-data', {
      gameState: s.gameState || {},
      session: {
        playerId: s.playerId,
        name: s.name,
        lobbyId: s.lobbyId
      },
      lobby: lobby
        ? {
            players: lobby.players,
            characters: lobby.characters,
            currentScene: lobby.currentScene,
            mapChoices: lobby.mapChoices || []
          }
        : null,
      sceneToGo
    });

    if (lobby.currentScene) {
      const data = readSceneData(lobby.currentScene, lobby);
      socket.emit('scene-data', { scene: lobby.currentScene, data });
    }

    io.to(session.lobbyId).emit('player-list', lobby.players);
  });


  // Join a lobby
  socket.on('join-lobby', ({ lobbyId, playerName }) => {
    console.log(`Player: ${playerId} joining lobby: ${lobbyId}`);
    if (!lobbyId) return;

    let lobby = lobbies.get(lobbyId);
    if (!lobby) {
      lobby = { players: [], maxPlayers: 2, characters: {}, chat: [], currentScene: null, sceneCounter: 0 };
      lobbies.set(lobbyId, lobby);
    }

    // Prevent duplicate join by playerId
    if (lobby.players.find(p => p.playerId === playerId)) {
      socket.emit('error-message', 'You are already in the lobby.');
      return;
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit('lobby-full');
      return;
    }

    // Add player (store playerId not transient socket.id)
    const player = { playerId, name: playerName, ready: false };
    lobby.players.push(player);

    // Update session
    session = playerSessions.get(playerId) || {};
    session.playerId = playerId;
    session.socketId = socket.id;
    session.lobbyId = lobbyId;
    session.name = playerName;
    session.lastSeen = Date.now();
    playerSessions.set(playerId, session);
    console.log("PlayerSession updated:", session);

    socket.join(lobbyId);
    io.to(lobbyId).emit('player-list', lobby.players);
    console.log(`Player ${playerId} joined lobby ${lobbyId}`);
  });

  // Toggle ready
  socket.on('toggle-ready', ({ lobbyId }) => {
    console.log(`Toggling ready check.`);
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    const player = lobby.players.find(p => p.playerId === playerId);
    if (!player) return;
    player.ready = !player.ready;
    io.to(lobbyId).emit('player-list', lobby.players);

    const allReady = lobby.players.length > 0 && lobby.players.every(p => p.ready);
    if (allReady && lobby.players.length === lobby.maxPlayers) {
      lobby.currentScene = 'CharacterSelectScene';
      lobby.players.forEach(p => {
        const ps = playerSessions.get(p.playerId);
        if (ps) {
          ps.gameState.scene = 'CharacterSelectScene';
          playerSessions.set(p.playerId, ps);
        }
      });
      io.to(lobbyId).emit('start-game', { players: lobby.players });
    }
  });

  // Chat forwarding
  socket.on('chat-message', ({ lobbyId, message }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    const chat = { playerId, name: session?.name || 'Unknown', message, ts: Date.now() };
    lobby.chat.push(chat);
    io.to(lobbyId).emit('chat-message', chat);
  });

  // Advance scene for lobby — saves scene into each player's session.gameState
  socket.on('advance-scene', ({ lobbyId, scene }) => {
    console.log(`Advancing to scene: ${scene}`);
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    lobby.currentScene = scene;

    const sceneData = generateSceneData(scene, lobby, lobbyId);

    lobby.players.forEach(p => {
      const ps = playerSessions.get(p.playerId);
      if (ps) {
        ps.gameState.scene = scene;
        playerSessions.set(p.playerId, ps);
        console.log("PlayerSession advancing scene:", ps);
      }
    });
    io.to(lobbyId).emit('scene-data', {
        scene,
        data: sceneData
    });
  });

  function generateSceneData(scene, lobby, lobbyId) {
    switch (scene) {
      case 'MapScene': {
        if (!lobby.mapChoices || !Array.isArray(lobby.mapChoices) || lobby.mapChoices.length === 0) {
          const allOptions = ['Battle', 'Event', 'Rest', 'Shop', 'Reward', 'Altar', 'Deck'];
          lobby.mapChoices = shuffleArray(allOptions).slice(0, 3);
        }
        lobby.mapVotes = lobby.mapVotes || {};
        return { lobbyId: lobbyId, choices: lobby.mapChoices, players: lobby.players };
      }
      case 'BattleScene': {
        if (!lobby.battleEnemies) {
          const enemies = ['Goblin', 'Orc', 'Slime'];
          lobby.battleEnemies = shuffleArray(enemies).slice(0, 2);
        }
        return { lobbyId, lobbyId, players: lobby.players, enemies: lobby.battleEnemies };
      }
      default:
        return { lobbyId: lobbyId, players: lobby.players };
    }
  }

  function readSceneData(scene, lobby) {
    switch (scene) {
      case 'MapScene':
        return { choices: lobby.mapChoices || [] };
      case 'BattleScene':
        return { enemies: lobby.battleEnemies || [] };
      default:
        return {};
    }
  }

  function gotoScene(lobbyId, scene) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    lobby.currentScene = scene;
    const data = generateSceneData(scene, lobby, lobbyId);

    lobby.players.forEach(p => {
      const ps = playerSessions.get(p.playerId);
      if (ps) {
        ps.gameState.scene = scene;
        playerSessions.set(p.playerId, ps);
      }
    });

    io.to(lobbyId).emit('scene-data', { scene, data });
  }


  // Player-side full gameState update (client should emit when deck/HP/etc. change)
  socket.on('update-game-state', ({ gameState }) => {
    const ps = playerSessions.get(playerId);
    console.log(`Updating gameState: ${gameState} for player ${playerId}`);
    console.log("In PlayerSession:", ps);
    if (ps) {
      ps.gameState = gameState;
      ps.lastSeen = Date.now();
      playerSessions.set(playerId, ps);
    }
  });

  // Select character (persistent playerId)
  socket.on('select-character', ({ lobbyId, characterKey, requesterPlayerId }) => {
    console.log(`Player ${playerId} selecting character ${characterKey}`);
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    // prevent reselect
    if (lobby.characters[requesterPlayerId]) {
      socket.emit('error-message', 'You already selected.');
      return;
    }

    if (Object.values(lobby.characters).includes(characterKey)) {
      socket.emit('error-message', 'Character already chosen.');
      return;
    }

    lobby.characters[requesterPlayerId] = characterKey;

    // save to session
    const ps = playerSessions.get(requesterPlayerId);
    if (ps) {
      ps.gameState = ps.gameState || {};
      ps.gameState.characterKey = characterKey;
      playerSessions.set(requesterPlayerId, ps);
      console.log("PlayerSession selecting character:", ps);
    }

    io.to(lobbyId).emit('character-selected', {
      playerId: requesterPlayerId,
      characterKey,
      allSelected: Object.keys(lobby.characters).length === lobby.players.length
    });
  });

  socket.on('map-choice', ({ lobbyId, playerId, choice }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby || !lobby.mapChoices?.includes(choice)) return;

    lobby.mapVotes = lobby.mapVotes || {};
    lobby.mapVotes[playerId] = choice;

    // broadcast current votes (playerId -> choice)
    io.to(lobbyId).emit('map-vote-update', { votes: lobby.mapVotes, players: lobby.players });

    // check majority
    const majority = Math.floor((lobby.players.length / 2) + 1);
    const counts = {};
    Object.values(lobby.mapVotes).forEach(c => { counts[c] = (counts[c] || 0) + 1; });

    const winner = Object.entries(counts).find(([_, c]) => c >= majority)?.[0];
    //Case 1 majority
    if (winner) {
      const nextScene = choiceToScene(winner);
      gotoScene(lobbyId, nextScene);
      return;
    }

    //Case 2 no majority
    if (Object.keys(lobby.mapVotes).length === lobby.players.length) {
      const maxVotes = Math.max(...Object.values(counts));
      const topChoices = Object.entries(counts)
        .filter(([_, c]) => c === maxVotes)
        .map(([choice]) => choice);

      const finalChoice = topChoices[Math.floor(Math.random() * topChoices.length)];
      const nextScene = choiceToScene(finalChoice);
      gotoScene(lobbyId, nextScene);
    }
  });

  // Battle turns
  socket.on('battle-end-turn', ({ lobbyId, playerId }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    lobby.battleReady = lobby.battleReady || new Set();
    lobby.battleReady.add(playerId);

    io.to(lobbyId).emit('battle-turn-update', Array.from(lobby.battleReady));

    if (lobby.battleReady.size === lobby.players.length) {
        lobby.battleReady.clear();
        io.to(lobbyId).emit('battle-enemy-turn');
    }
  });

  socket.on('scene-complete', ({ lobbyId, playerId }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    lobby.readyPlayers = lobby.readyPlayers || new Set();
    lobby.readyPlayers.add(playerId);

    io.to(lobbyId).emit('scene-complete-update', { readyPlayers: Array.from(lobby.readyPlayers) });

    if (lobby.readyPlayers.size === lobby.players.length) {
      lobby.readyPlayers.clear();

      const nextScene = getNextSceneAfterOther(lobby);
      gotoScene(lobbyId, nextScene);
    }
  });


  // Soft disconnect — keep session for reconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id} (playerId: ${playerId})`);
    const ps = playerSessions.get(playerId);
    if (ps) {
      ps.socketId = null;
      ps.lastSeen = Date.now();
      playerSessions.set(playerId, ps);
    }
  });

  function choiceToScene(choice) {
    switch (choice) {
      case 'Battle': return 'BattleScene';
      case 'Event': return 'EventScene';
      case 'Rest': return 'RestSiteScene';
      case 'Shop': return 'ShopScene';
      case 'Reward': return 'CardRewardScene';
      case 'Altar': return 'AltarScene';
      case 'Deck': return 'DeckScene';
      default: return 'MapScene';
    }
  }

  function getNextSceneAfterOther(lobby) {
    lobby.sceneCounter = (lobby.sceneCounter || 0) + 1;

    if (lobby.sceneCounter % 5 === 0) {
      // On every 5th, force Rest + Boss
      return 'RestScene';
    } else {
      return 'MapScene';
    }
  }
});

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cleanup sessions not reconnected within X ms
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of playerSessions.entries()) {
    if (!session.socketId && session.lastSeen && (now - session.lastSeen) > 5 * 60 * 1000) { // 5 minutes
      console.log(`Cleaning up stale session: ${id}`);
      // remove from lobby if present
      if (session.lobbyId && lobbies.has(session.lobbyId)) {
        const lobby = lobbies.get(session.lobbyId);
        lobby.players = lobby.players.filter(p => p.playerId !== id);
        delete lobby.characters[id];
        io.to(session.lobbyId).emit('player-list', lobby.players);
      }
      playerSessions.delete(id);
    }
  }
}, 60 * 1000);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
