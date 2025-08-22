import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import gameState from '../GameState.js';
import EventLibrary from '../data/EventLibrary.js';
import EventTags from '../data/EventTags.js';

export class EventScene extends BaseScene {
    constructor() {
        super({ key: 'EventScene' });
    }

    preload() {
    }

    create(data) {
        super.create();
        this.lobbyId = data.lobbyId;
        this.playerName = data.playerName;
        this.players = data.players;
        this.sceneManager = new SceneManager(this, this.socket, this.lobbyId);
        this.showScene();
    }

    showScene() {
        this.createBackground();
        const { x, y } = this.getCenter();

        const event = EventLibrary.getRandomMatching(event => gameState.health > 10 || !event.tags.includes(EventTags.RISKY));

        console.log("Starting event:", event);

        this.renderEvent(event, x, y);

        // Title
        this.add.text(x, y-100, 'EventScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        returnToMapButton.on('pointerdown', () => {
            this.socket.emit('scene-complete', { lobbyId: this.sceneManager.lobbyId, playerId });
            returnToMapButton.disableInteractive().setStyle({ backgroundColor: '#555' });
        });

        this.readyText = this.add.text(x, y + 100, 'Waiting for others...', {
            fontSize: '20px', color: '#fff'
        }).setOrigin(0.5);

        // server notifies when others confirm
        this.socket.on('scene-complete-update', ({ readyPlayers }) => {
            this.readyText.setText(`Ready: ${readyPlayers.length}/${this.players.length}`);
        });

        // when server says move on
        this.socket.on('advance-scene', ({ scene, data }) => {
            this.sceneManager.switchScene(scene, { ...data, players: this.players, playerId });
        });
    }

    renderEvent(event, x, y) {
        this.add.text(x, 100, event.title, {
            fontSize: '28px',
            color: '#fff'
        }).setOrigin(0.5);

        this.add.text(x, 160, event.description, {
            fontSize: '18px',
            color: '#ccc',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        event.choices.forEach((choice, index) => {
            const buttonY = 260 + index * 60;
            const button = this.add.text(x, buttonY, choice.text, {
                fontSize: '20px',
                color: '#ffcc00',
                backgroundColor: '#444',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            button.on('pointerdown', () => {
                choice.effect(gameState, this);
            });
        });
    }
}