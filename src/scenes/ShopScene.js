import BaseScene from './BaseScene.js';
import CardLibrary from '../data/CardLibrary.js';
import SceneManager from '../SceneManager';
import gameState from '../GameState';
import CardRenderer from '../renderers/CardRenderer.js';

export class ShopScene extends BaseScene {
    constructor() {
        super('ShopScene');
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        this.add.text(x, 50, 'Shop', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

        this.cardPool = CardLibrary.getRandomCards(5);
        this.updateShopDisplay();

        let returnToMapButton = this.add.text(x, y, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }

    updateShopDisplay() {
        if (this.cardUIs) {
            this.cardUIs.forEach(t => t.destroy());
        }
        if (this.goldAmount) {
            this.goldAmount.destroy();
        }

        this.cardUIs = [];

        this.goldAmount = this.add.text(this.cameras.main.centerX * 1.8, this.cameras.main.centerY * 1.8, `Gold: ${gameState.gold}`, {
            fontSize: '20px', color: '#ffff00'
        }).setOrigin(0.5);

        const spacing = 120;
        const startX = this.cameras.main.centerX - ((this.cardPool.length - 1) * spacing) / 2;

        this.cardPool.forEach((card, index) => {
            const xPos = startX + index * spacing;
            const yPos = this.cameras.main.centerY * 0.3;
            const cardCost = Phaser.Math.Between(10, 40);

            const renderer = new CardRenderer(this, card, xPos, yPos, gameState, (clickedCard) => {
                const cardIndex = this.cardPool.indexOf(clickedCard);
                if (cardIndex !== -1 && gameState.loseGold(cardCost)) {
                    gameState.addCard(card);
                    this.updateShopDisplay();
                }
            }, { goldCost: cardCost });
            this.cardUIs.push(renderer);
        });
    }
}