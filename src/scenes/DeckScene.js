import BaseScene from './BaseScene';
import SceneManager from '../SceneManager';
import gameState from '../GameState';
import CardRenderer from '../renderers/CardRenderer.js';
import MagicItemRenderer from '../renderers/MagicItemRenderer.js';

export class DeckScene extends BaseScene {
    constructor() {
        super({ key: 'DeckScene' });
    }

    preload() {
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        // Title
        this.add.text(x, 40, 'Your Deck', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.renderDeck();
        this.renderItems();

        let returnToMapButton = this.add.text(x, y * 1.8, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
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