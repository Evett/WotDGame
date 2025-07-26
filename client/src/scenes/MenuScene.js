import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import { io } from 'socket.io-client';

export class MenuScene extends BaseScene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    create() {

        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();
        this.socket = io();

        // Title
        this.add.text(x, y-250, 'Wars of the Defeated', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Nickname Input
        this.add.text(x - 150, y - 180, 'Nickname:', { fontSize: '20px', color: '#ffffff' }).setOrigin(0, 0.5);
        this.nicknameInput = this.add.dom(x + 50, y - 180, 'input', 'width: 200px; height: 24px');

        // Lobby ID Input
        this.add.text(x - 150, y - 130, 'Lobby ID:', { fontSize: '20px', color: '#ffffff' }).setOrigin(0, 0.5);
        this.lobbyIdInput = this.add.dom(x + 50, y - 130, 'input', 'width: 200px; height: 24px');

        // Max Players Input
        this.add.text(x - 150, y - 80, 'Max Players:', { fontSize: '20px', color: '#ffffff' }).setOrigin(0, 0.5);
        this.maxPlayersInput = this.add.dom(x + 50, y - 80, 'input', 'width: 50px; height: 24px');

        // Join Button
        const joinButton = this.add.text(x, y - 20, 'Join Lobby', {
            fontSize: '24px',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 },
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        joinButton.on('pointerdown', () => {
            const nickname = this.nicknameInput.node.value.trim();
            const lobbyId = this.lobbyIdInput.node.value.trim();
            const maxPlayers = parseInt(this.maxPlayersInput.node.value.trim()) || 4;

            if (!nickname || !lobbyId) return alert('Please enter nickname and lobby ID.');

            this.nickname = nickname;
            this.lobbyId = lobbyId;
            this.maxPlayers = maxPlayers;

            this.socket.emit('join-lobby', { lobbyId, playerName: nickname, maxPlayers });
        });

        // Player List Display
        this.playerListText = this.add.text(x, y + 50, 'Players:\n', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5, 0);

        // Ready Toggle
        this.ready = false;
        const readyButton = this.add.text(x, y + 180, 'Not Ready', {
            fontSize: '24px',
            backgroundColor: '#ff8800',
            padding: { x: 20, y: 10 },
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        readyButton.on('pointerdown', () => {
            this.ready = !this.ready;
            readyButton.setText(this.ready ? 'Ready!' : 'Not Ready');
            this.socket.emit('player-ready', { lobbyId: this.lobbyId, playerName: this.nickname, ready: this.ready });
        });

        // Chat UI
        this.chatMessages = this.add.text(x - 250, y + 240, '', {
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 500 }
        }).setOrigin(0, 1);

        this.chatInput = this.add.dom(x, y + 260, 'input', 'width: 400px; height: 24px');

        this.input.keyboard.on('keydown-ENTER', () => {
            const msg = this.chatInput.node.value.trim();
            if (msg) {
                this.socket.emit('chat-message', { lobbyId: this.lobbyId, playerName: this.nickname, message: msg });
                this.chatInput.node.value = '';
            }
        });

        // Socket listeners
        this.socket.on('player-list', (players) => {
            const text = players.map(p => `${p.name} ${p.ready ? '✅' : '❌'}`).join('\n');
            this.playerListText.setText('Players:\n' + text);
        });

        this.socket.on('lobby-full', () => {
            alert('Lobby is full!');
        });

        this.socket.on('start-game', ({ players }) => {
            this.sceneManager.switchScene('CharacterSelectScene', {
                socket: this.socket,
                players,
                playerName: this.nickname,
                lobbyId: this.lobbyId
            });
        });

        this.socket.on('chat-message', ({ playerName, message }) => {
            this.chatMessages.text += `\n${playerName}: ${message}`;
        });
    }
}