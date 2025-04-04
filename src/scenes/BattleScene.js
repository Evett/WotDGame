import Phaser from 'phaser';
import gameState from '../GameState.js';
import SceneManager from '../SceneManager';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.add.image(300, 300, 'background').setScale(1.2); // Adjust based on image size
        this.add.text(300, 100, `Battling as: ${gameState.character.name}`, { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
        console.log("Hand on entering battle:", gameState.hand);

        this.updateHandDisplay();

        // Title
        this.add.text(300, 150, 'BattleScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Button to draw new card
        const drawBtn = this.add.text(300, 400, 'Draw Card', { fontSize: '24px', backgroundColor: '#444' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                gameState.drawCard();
                this.updateHandDisplay();
            });

        // Button to play first card
        const playBtn = this.add.text(300, 450, 'Play First Card', { fontSize: '24px', backgroundColor: '#555' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                gameState.playCard(0);
                this.updateHandDisplay();
            });

        let abilityButton = this.add.text(300, 300, 'Use Hero Ability', { fontSize: '24px', backgroundColor: '#ff5500' })
            .setOrigin(0.5)
            .setInteractive();

        let returnToMapButton = this.add.text(300, 200, 'Return to Map', { fontSize: '24px', backgroundColor: '#ff5500' })
            .setOrigin(0.5)
            .setInteractive();

        abilityButton.on('pointerdown', () => {
            gameState.character.heroAbility(gameState);
        });

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }

    updateHandDisplay() {
        if (this.handTexts) {
            this.handTexts.forEach(t => t.destroy());
        }

        this.handTexts = [];

        const hand = gameState.hand;
        for (let i = 0; i < hand.length; i++) {
            const card = hand[i];
            const txt = this.add.text(50 + i * 100, 350, `${card.name}\n(${card.type})\n${card.description}`, { fontSize: '20px', color: '#fff' });
            this.handTexts.push(txt);
        }
    }
}