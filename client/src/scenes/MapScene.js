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
        this.buttons = {};        
        this.voteLabels = {};      
        this.choiceMade = false;

        this.showScene();

        this.socket.off('map-vote-update');
        this.socket.off('advance-scene');

        this.socket.on('map-vote-update', ({ votes }) => {
            this.votes = votes;
            this.updateVoteDisplay();
        });

        this.socket.on('advance-scene', ({ scene, payload }) => {
            if (scene !== 'MapScene') {
            this.sceneManager.setLobby(this.lobbyId);
            this.sceneManager.switchScene(scene, {
                gameState,
                players: this.players,
                playerId,
                lobbyId: this.lobbyId,
                ...payload
            });
            }
        });

        this.events.once('shutdown', () => {
            this.socket.off('map-vote-update');
            this.socket.off('advance-scene');
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

            const label = this.add.text(x + 160, offsetY, '0', { fontSize: '20px', color: '#fff' }).setOrigin(0, 0.5);

            this.buttons[choice] = btn;
            this.voteLabels[choice] = label;

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
        const counts = {};
        Object.values(this.votes).forEach(c => counts[c] = (counts[c] || 0) + 1);

        for (const choice of this.mapChoices) {
            const n = counts[choice] || 0;
            if (this.voteLabels[choice]) this.voteLabels[choice].setText(String(n));
        }

        const totalVotes = Object.keys(this.votes).length;
        this.readyText.setText(`Votes: ${totalVotes}/${this.players?.length ?? 0}`);
    }
}