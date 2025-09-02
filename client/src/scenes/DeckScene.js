import BaseScene from './BaseScene';
import SceneManager from '../SceneManager';
import gameState from '../GameState';
import CardRenderer from '../renderers/CardRenderer.js';
import MagicItemRenderer from '../renderers/MagicItemRenderer.js';
import { playerId } from '../socket.js';

export class DeckScene extends BaseScene {
    constructor() {
        super({ key: 'DeckScene' });
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
        this.add.text(x, 40, 'Your Deck', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.renderDeck();
        this.renderItems();

        let returnToMapButton = this.add.text(x, y, 'Confirm', {
            fontSize: '24px', backgroundColor: '#0077ff', padding: { x: 20, y: 10 }, color: '#fff'
        }).setOrigin(0.5).setInteractive();

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

    renderDeck() {
        this.cardUIs = [];

        gameState.fullDeck.forEach((card, index) => {
            const xPos = 100 + (index % 9) * 180;
            const yPos = 150 + Math.floor(index / 9) * 220;

            const renderer = new CardRenderer(this, card, xPos, yPos, gameState, (clickedCard) => {
                const cardIndex = gameState.fullDeck.indexOf(clickedCard);
                if (cardIndex !== -1) {
                    console.log("Clicked on card:", gameState.fullDeck[cardIndex]);
                }
            });
            this.cardUIs.push(renderer);
        });
    }

    renderItems() {
        this.itemUIs = [];

        gameState.magicItems.forEach((item, index) => {
            const xPos = 100 + (index % 9) * 180;
            const yPos = this.cameras.default.centerY * 1.8 + Math.floor(index / 9) * 220;

            const renderer = new MagicItemRenderer(this, xPos, yPos, item, (selectedItem) => {
                const itemIndex = gameState.magicItems.indexOf(selectedItem);
                if (itemIndex !== -1) {
                    console.log("Clicked on card:", gameState.magicItems[itemIndex]);
                }
            });
            this.itemUIs.push(renderer);
        });
    }
}