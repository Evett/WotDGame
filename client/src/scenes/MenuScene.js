// src/scenes/MenuScene.js
import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import { playerId } from '../socket.js';
import gameState from '../GameState.js';

export class MenuScene extends BaseScene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    super.create();
    this.sceneManager = new SceneManager(this);
    this.createBackground();
    const { x, y } = this.getCenter();

    this.alreadyJoined = false;
    this.lobbyId = null;
    this.nickname = '';

    // If server tells us we reconnected to a lobby, request full sync
    this.socket.on('reconnected', ({ lobbyId, name }) => {
      this.lobbyId = lobbyId;
      this.nickname = name;
      // ask server for saved gameState & lobby info
      this.socket.emit('request-sync', { lobbyId });
      this.alreadyJoined = true;
    });

    // server responds with full state (session + lobby info)
    this.socket.on('resync-data', ({ gameState: serverGameState, session, lobby }) => {
      // Merge server game state into our local gameState singleton
      if (serverGameState) {
        Object.assign(gameState, serverGameState);
      }
      if (session) {
        this.lobbyId = session.lobbyId;
        this.nickname = session.name;
      }

      // If server says we are mid-scene, jump there
      const sceneToGo = (serverGameState && serverGameState.scene) || (lobby && lobby.currentScene);
      if (sceneToGo) {
        // switch to the scene the server says we're in
        this.sceneManager.switchScene(sceneToGo, {
          lobby,
          playerId,
          playerName: this.nickname
        });
        return;
      }
    });

    // Build UI
    this.showScene();
  }

  showScene() {
    const { x, y } = this.getCenter();

    this.add.text(x, y - 250, 'Wars of the Defeated', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);

    this.add.text(x - 150, y - 180, 'Nickname:', { fontSize: '20px', color: '#fff' }).setOrigin(0, 0.5);
    this.nicknameInput = this.add.dom(x + 50, y - 180, 'input', 'width: 200px; height: 24px');
    this.nicknameInput.node.value = this.nickname || '';

    this.add.text(x - 150, y - 130, 'Lobby ID:', { fontSize: '20px', color: '#fff' }).setOrigin(0, 0.5);
    this.lobbyIdInput = this.add.dom(x + 50, y - 130, 'input', 'width: 200px; height: 24px');
    this.lobbyIdInput.node.value = this.lobbyId || '';

    const joinButton = this.add.text(x, y - 20, 'Join Lobby', { fontSize: '24px', backgroundColor: '#0077ff', padding: { x: 20, y: 10 }, color: '#fff' })
      .setOrigin(0.5).setInteractive();

    joinButton.on('pointerdown', () => {
      const nickname = this.nicknameInput.node.value.trim();
      const lobbyId = this.lobbyIdInput.node.value.trim();
      if (!nickname || !lobbyId) return alert('Please enter nickname and lobby ID.');

      if (this.alreadyJoined) return;
      this.nickname = nickname;
      this.lobbyId = lobbyId;

      this.socket.emit('join-lobby', { lobbyId, playerName: nickname });
      this.alreadyJoined = true;
    });

    this.playerListText = this.add.text(x, y + 50, 'Players:\n', { fontSize: '20px', color: '#fff' }).setOrigin(0.5, 0);

    const readyButton = this.add.text(x, y + 300, 'Not Ready', { fontSize: '24px', backgroundColor: '#ff8800', padding: { x: 20, y: 10 }, color: '#fff' })
      .setOrigin(0.5).setInteractive();

    readyButton.on('pointerdown', () => {
      this.socket.emit('toggle-ready', { lobbyId: this.lobbyId });
    });

    // chat UI
    this.chatMessages = this.add.text(x - 250, y + 200, '', { fontSize: '16px', color: '#fff', wordWrap: { width: 500 } }).setOrigin(0, 0);
    this.chatInput = this.add.dom(x, y + 360, 'input', 'width: 400px; height: 24px');

    this.input.keyboard.on('keydown-ENTER', () => {
      const msg = this.chatInput.node.value.trim();
      if (msg) {
        this.socket.emit('chat-message', { lobbyId: this.lobbyId, message: msg });
        this.chatInput.node.value = '';
      }
    });

    // socket listeners
    this.socket.on('player-list', (players) => {
      const text = players.map(p => `${p.name} ${p.ready ? '✅' : '❌'}`).join('\n');
      this.playerListText.setText('Players:\n' + text);
    });

    this.socket.on('lobby-full', () => alert('Lobby is full!'));
    this.socket.on('chat-message', (chat) => {
      this.chatMessages.text += `\n${chat.name || chat.playerId}: ${chat.message}`;
    });

    this.socket.on('start-game', ({ players }) => {
      this.sceneManager.switchScene('CharacterSelectScene', { socket: this.socket, players, playerId, lobbyId: this.lobbyId });
    });
  }
}
