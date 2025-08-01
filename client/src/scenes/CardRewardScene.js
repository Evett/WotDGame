import BaseScene from './BaseScene.js';
import CardLibrary from '../data/CardLibrary.js';
import SceneManager from '../SceneManager';
import gameState from '../GameState';
import CardRenderer from '../renderers/CardRenderer.js';

export class CardRewardScene extends BaseScene {
    constructor() {
        super('CardRewardScene');
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();
        this.add.text(x, 50, 'Choose a Card', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

        const cardOptions = CardLibrary.getRandomCardsForClass(gameState.characterClass, 3);

        this.cardUIs = [];

        const spacing = 120;
        const startX = this.cameras.main.centerX - ((cardOptions.length - 1) * spacing) / 2;

        cardOptions.forEach((card, index) => {
            const xPos = startX + index * spacing;
            const yPos = this.cameras.main.centerY * .3;

            const renderer = new CardRenderer(this, card, xPos, yPos, gameState, (clickedCard) => {
                const cardIndex = cardOptions.indexOf(clickedCard);
                if (cardIndex !== -1) {
                    gameState.addCard(cardOptions[cardIndex]);
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