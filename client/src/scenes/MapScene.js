import gameState from '../GameState';
import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import { playerId } from '../socket.js';

export class MapScene extends BaseScene {
    constructor() {
        super({ key: 'MapScene' });
    }

    create(data) {
        super.create();
        this.lobbyId = data.lobbyId;
        this.playerName = data.playerName;
        this.players = data.players;
        this.sceneManager = new SceneManager(this, this.socket, this.lobbyId);
        this.mapChoices = data.choices || [];
        this.votes = {};

        this.showScene();

        this.socket.on('map-vote-update', ({ votes }) => {
            this.votes = votes;
            this.updateVoteDisplay();
        });
    }

    showScene() {

        this.createBackground();
        const { x, y } = this.getCenter();

        this.add.text(x, y - 250, 'Map - Choose Your Next Path', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

        let offsetY = y - 50;
        this.mapChoices.forEach(choice => {
            const btn = this.add.text(x, offsetY, choice, {
                fontSize: '24px', backgroundColor: '#333', padding: { x: 10, y: 5 }, color: '#fff'
            }).setOrigin(0.5).setInteractive();

            btn.on('pointerdown', () => {
                if (!this.choiceMade) {
                    this.choiceMade = true;
                    this.socket.emit('map-choice', { lobbyId: this.lobbyId, playerId, choice });
                    btn.setStyle({ backgroundColor: '#555' });
                }
            });

            offsetY += 50;
        });

        this.readyText = this.add.text(x, y + 200, 'Waiting for others...', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

        // Update ready state UI
        this.socket.on('map-choice-update', (readyPlayers) => {
            const readyCount = readyPlayers.length;
            this.readyText.setText(`Ready: ${readyCount}/${this.players.length}`);
        });

        // All ready → move to next scene
        this.socket.on('all-map-choices-ready', (nextScene) => {
            this.sceneManager.setLobby(this.lobbyId);
            this.sceneManager.switchScene(nextScene, { gameState, players: this.players, playerId });
        });
    }

    getOptions() {
        return ['Battle', 'Event', 'Rest', 'Shop', 'Reward', 'Altar', 'Deck'];
    }

    updateVoteDisplay() {
        for (const location of this.locations) {
            const count = this.voteCounts[location] || 0;
            if (this.voteTexts[location]) {
                this.voteTexts[location].setText(count);
            }
        }
    }
}