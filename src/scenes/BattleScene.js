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
        this.createEndTurnButton();
        this.startCombat();
        this.add.image(300, 300, 'background').setScale(1.2); // Adjust based on image size
        this.add.text(300, 100, `Battling as: ${gameState.character.name}`, { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
        console.log("Hand on entering battle:", gameState.hand);

        this.updateHandDisplay();

        // Title
        this.add.text(300, 150, 'BattleScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

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

        gameState.hand.forEach((card, i) => {
            const txt = this.add.text(50 + i * 100, 350, `${card.name}\n(${card.type})\n${card.description}`, {
                fontSize: '16px',
                color: '#fff',
                backgroundColor: '#333',
                padding: 10,
            }).setInteractive();
    
            txt.on('pointerdown', () => {
                gameState.playCard(i);
                this.updateHandDisplay();
            });
    
            this.handTexts.push(txt);
        });
    }

    createEndTurnButton() {
        const btn = this.add.text(400, 430, 'End Turn', {
            fontSize: '20px',
            backgroundColor: '#444',
            padding: 10
        }).setInteractive();
    
        btn.on('pointerdown', () => {
            // Discard all cards in hand
            gameState.discardPile.push(...gameState.hand);
            gameState.hand = [];
    
            // Draw a new hand
            for (let i = 0; i < 5; i++) {
                gameState.drawCard();
            }
    
            this.updateHandDisplay();
        });
    }

    startCombat() {
        // Draw opening hand (e.g. 5 cards)
        for (let i = 0; i < 5; i++) {
            gameState.drawCard();
        }
    
        this.updateHandDisplay();
    }
}