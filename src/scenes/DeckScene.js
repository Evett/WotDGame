import BaseScene from './BaseScene';
import SceneManager from '../SceneManager';
import gameState from '../GameState';
import CardRenderer from '../renderers/CardRenderer.js';

export class DeckScene extends BaseScene {
    constructor() {
        super({ key: 'DeckScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();

        // Title
        this.add.text(x, 40, 'Your Deck', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.cardUIs = [];

        const spacing = 120;
        const startX = this.cameras.main.centerX - ((gameState.fullDeck.length - 1) * spacing) / 2;

        gameState.fullDeck.forEach((card, index) => {
            const xPos = startX + index * spacing;
            const yPos = this.cameras.main.centerY * .3;

            const renderer = new CardRenderer(this, card, xPos, yPos, gameState, (clickedCard) => {
                const cardIndex = gameState.fullDeck.indexOf(clickedCard);
                if (cardIndex !== -1) {
                    console.log("Clicked on card:", gameState.fullDeck[cardIndex]);
                }
            });
            this.cardUIs.push(renderer);
        });

        let returnToMapButton = this.add.text(x, y, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }
}