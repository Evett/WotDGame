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
        this.choiceLabels = {};

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

            const countText = this.add.text(x + 140, offsetY, '0', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);
            this.choiceLabels[choice] = countText;

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

        this.updateVoteDisplay();
    }

    updateVoteDisplay() {
        const counts = {};
        for (const c of this.mapChoices) counts[c] = 0;
        Object.values(this.votes || {}).forEach(ch => {
            if (counts.hasOwnProperty(ch)) counts[ch] += 1;
        });

        // update texts
        this.mapChoices.forEach(choice => {
            const label = this.choiceLabels[choice];
            if (label) label.setText(String(counts[choice] || 0));
        });

        const readyCount = Object.keys(this.votes || {}).length;
        this.readyText?.setText(`Votes: ${readyCount}/${this.players.length || 0}`);
    }
}