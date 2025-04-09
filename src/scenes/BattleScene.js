import gameState from '../GameState.js';
import SceneManager from '../SceneManager';
import CardRenderer from '../renderers/CardRenderer.js';
import EnemyRenderer from '../renderers/EnemyRenderer.js';
import EnemyLibrary from '../data/EnemyLibrary.js';
import BaseScene from './BaseScene.js';

export class BattleScene extends BaseScene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        this.resourceText = this.add.text(x+500, 10, '', {
            fontSize: '20px',
            color: '#fff'
        });
        this.createEndTurnButton();
        this.startCombat();
        this.scale.on('resize', this.resize, this);
        this.add.text(x, y-300, `Battling as: ${gameState.character.name}`, { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
        console.log("Hand on entering battle:", gameState.hand);


        // Title
        this.add.text(x, 25, 'BattleScene', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let abilityButton = this.add.text(x, y+300, 'Use Hero Ability', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        abilityButton.on('pointerdown', () => {
            gameState.character.heroAbility(gameState);
            this.updateResourceDisplay();
        });

        let returnToMapButton = this.add.text(x, 225, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }

    resize (gameSize, baseSize, displaySize, resolution) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.resize(width, height);

        this.bg.setSize(width, height);
    }

    updateHandDisplay() {
        if (this.cardUIs) {
            this.cardUIs.forEach(t => t.destroy());
        }

        this.cardUIs = [];

        const spacing = 120;
        const startX = this.cameras.main.centerX - ((gameState.hand.length - 1) * spacing) / 2;

        gameState.hand.forEach((card, index) => {
            const xPos = startX + index * spacing;
            const yPos = this.cameras.main.centerY * 1.8;

            const renderer = new CardRenderer(this, card, xPos, yPos, gameState, (clickedCard) => {
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
        const btn = this.add.text(this.x+200, this.y+300, 'End Turn', {
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
            EnemyLibrary.Goblin,
            EnemyLibrary.Orc
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

        const spacing = 300;
        const startY = this.cameras.main.centerY - ((gameState.enemies.length - 1) * spacing) / 2;
        gameState.enemies.forEach((enemy, index) => {
            const xPos = this.cameras.main.centerX * 1.8;
            const yPos = startY + index * spacing;

            const enemyUI = new EnemyRenderer(this, enemy, xPos, yPos, (target) => {
                this.selectedTarget = target;
                this.enemyUIs.forEach(ui => ui.select(ui.enemy === target));
                console.log('Target selected:', target.name);
            });

            this.enemyUIs.push(enemyUI);
        });
    }
}