import Phaser from 'phaser';
import gameState from '../GameState.js';
import SceneManager from '../SceneManager';
import CardRenderer from '../renderers/CardRenderer.js';
import EnemyRenderer from '../renderers/EnemyRenderer.js';
import Enemy from '../data/Enemy.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.resourceText = this.add.text(350, 10, '', {
            fontSize: '20px',
            color: '#fff'
        });
        this.createEndTurnButton();
        this.startCombat();
        this.add.image(300, 300, 'background').setScale(1.2); // Adjust based on image size
        this.add.text(300, 75, `Battling as: ${gameState.character.name}`, { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
        console.log("Hand on entering battle:", gameState.hand);


        // Title
        this.add.text(100, 25, 'BattleScene', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let abilityButton = this.add.text(300, 300, 'Use Hero Ability', { fontSize: '24px', backgroundColor: '#ff5500' })
            .setOrigin(0.5)
            .setInteractive();

        let returnToMapButton = this.add.text(300, 225, 'Return to Map', { fontSize: '24px', backgroundColor: '#ff5500' })
            .setOrigin(0.5)
            .setInteractive();

        abilityButton.on('pointerdown', () => {
            gameState.character.heroAbility(gameState);
            this.updateResourceDisplay();
        });

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }

    updateHandDisplay() {
        if (this.cardUIs) {
            this.cardUIs.forEach(t => t.destroy());
        }

        this.cardUIs = [];

        const spacing = 120;
        const startX = this.cameras.main.centerX - ((gameState.hand.length - 1) * spacing) / 2;
        const y = 400;

        gameState.hand.forEach((card, index) => {
            const x = startX + index * spacing;

            const renderer = new CardRenderer(this, card, x, y, gameState, (clickedCard) => {
                const cardIndex = gameState.hand.indexOf(clickedCard);
                if (cardIndex !== -1) {
                    gameState.playCard(cardIndex, this.selectedTarget);
                    this.updateHandDisplay();
                    this.updateResourceDisplay();
                    this.enemyUIs.forEach(ui => ui.update());
                }
            });
            this.cardUIs.push(renderer);
        });
    }

    createEndTurnButton() {
        const btn = this.add.text(400, 230, 'End Turn', {
            fontSize: '20px',
            backgroundColor: '#444',
            padding: 10
        }).setInteractive();
    
        btn.on('pointerdown', () => {
            // Discard all cards in hand
            gameState.discardPile.push(...gameState.hand);
            gameState.hand = [];
            gameState.mana = gameState.maxMana;
            gameState.actions = gameState.maxActions;
    
            // Draw a new hand
            for (let i = 0; i < 5; i++) {
                gameState.drawCard();
            }
    
            this.updateHandDisplay();
            this.updateResourceDisplay();
        });
    }

    startCombat() {
        // Draw opening hand (e.g. 5 cards)

        gameState.startBattle([
            new Enemy("Goblin", 20),
            new Enemy("Orc", 35)
        ]);

        for (let i = 0; i < 5; i++) {
            gameState.drawCard();
        }
    
        this.updateHandDisplay();
        this.updateResourceDisplay();
        this.updateEnemyDisplay();
    }

    updateResourceDisplay() {
        this.resourceText.setText(
            `Armor: ${gameState.armor}\n` +
            `Actions: ${gameState.actions} / ${gameState.maxActions}\n` +
            `Mana: ${gameState.mana} / ${gameState.maxMana}`
        );
    }

    updateEnemyDisplay() {
        this.enemyUIs = [];

        gameState.enemies.forEach((enemy, index) => {
            const x = 200 + index * 150;
            const y = 150;

            const enemyUI = new EnemyRenderer(this, enemy, x, y, (target) => {
                this.selectedTarget = target;
                this.enemyUIs.forEach(ui => ui.select(ui.enemy === target));
                console.log('Target selected:', target.name);
            });

            this.enemyUIs.push(enemyUI);
        });
    }
}