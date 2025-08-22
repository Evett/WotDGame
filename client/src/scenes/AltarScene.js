import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import MagicItemLibrary from '../data/MagicItemLibrary';
import MagicItemRenderer from '../renderers/MagicItemRenderer';
import gameState from '../GameState';

export class AltarScene extends BaseScene {
    constructor() {
        super({ key: 'AltarScene' });
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

        // Title
        this.add.text(x, y-100, 'AltarScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const sampleItems = MagicItemLibrary.getRandomMagicItems(2);

        sampleItems.forEach((item, index) => {
            const xPos = 100 + (index % 9) * 180;
            const yPos = 150 + Math.floor(index / 9) * 220;
            new MagicItemRenderer(this, xPos, yPos, item, (selectedItem) => {
                const itemIndex = sampleItems.indexOf(selectedItem);
                if (itemIndex !== -1) {
                    gameState.addMagicItem(sampleItems[itemIndex]);
                }
                // Maybe purchase or preview logic here
            });
        });

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
}