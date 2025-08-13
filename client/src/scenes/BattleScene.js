import gameState from '../GameState.js';
import SceneManager from '../SceneManager';
import CardRenderer from '../renderers/CardRenderer.js';
import EnemyRenderer from '../renderers/EnemyRenderer.js';
import EnemyLibrary from '../data/EnemyLibrary.js';
import MagicItemRenderer from '../renderers/MagicItemRenderer.js';
import BaseScene from './BaseScene.js';

export class BattleScene extends BaseScene {
    constructor() {
        super({ key: 'BattleScene' });
        this.turnState = 'players';
        this.playerReady = false;
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
        this.resourceText = this.add.text(x+500, 10, '', {
            fontSize: '20px',
            color: '#fff'
        });
        this.renderHand = true;
        this.createEndTurnButton();
        this.startCombat();
        this.add.text(x, y-300, `Battling as: ${gameState.character.name}`, { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
        console.log("Hand on entering battle:", gameState.hand);

        this.socket.on('battle-turn-update', (readyPlayers) => {
            const readyCount = readyPlayers.length;
            this.endTurnButton.setText(`End Turn (${readyCount}/6)`);
        });

        this.socket.on('battle-enemy-turn', () => {
            this.endPlayerTurn();
        });

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
                if (cardIndex !== -1 && this.allowCardPlay) {
                    gameState.playCard(cardIndex, this.selectedTarget, this);
                    this.updateHandDisplay();
                    this.updateResourceDisplay();
                    this.enemyUIs.forEach(ui => ui.update());
                }
            });
            this.cardUIs.push(renderer);
        });
    }

    createEndTurnButton() {
        this.endTurnButton = this.add.text(this.cameras.main.centerX+200, this.cameras.main.centerY+300, 'End Turn', {
            fontSize: '20px',
            backgroundColor: '#444',
            padding: 10
        }).setInteractive();
    
        this.endTurnButton.on('pointerdown', () => {
            if (!this.playerReady) {
                this.playerReady = true;
                this.socket.emit('battle-end-turn', { lobbyId: this.lobbyId, playerId });
            }
        });
    }

    startCombat() {
        console.log("Combat Start");
        gameState.startBattle([
            EnemyLibrary.Goblin(this),
            EnemyLibrary.Orc(this)
        ]);

        gameState.enemies.forEach(enemy => enemy.decideIntent());

        this.updateEnemyDisplay();

        gameState.resetDeck();
        gameState.runItemTriggers("onBattleStart");
        this.startPlayerTurn();
    }

    updateResourceDisplay() {
        this.resourceText.setText(
            `Health: ${gameState.health}\n` +
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

    startPlayerTurn() {
        if(gameState.isDead()) {
            this.sceneManager.switchScene('GameOverScene');
            return;
        }
        this.turnState = 'players';
        this.playerReady = false;
        this.allowCardPlay = true;

        gameState.discardPile.push(...gameState.hand);
        gameState.hand = [];
        gameState.mana = gameState.maxMana;
        gameState.actions = gameState.maxActions;
        gameState.drawHand(this);

        this.updateHandDisplay();
        this.updateUsableMagicItemDisplay();
        this.updateResourceDisplay();

        this.endTurnButton.setAlpha(1);
        this.endTurnButton.setInteractive();

        console.log('Player turn started!');
    }

    endPlayerTurn() {
        this.turnState = 'enemy';
        this.allowCardPlay = false;

        this.endTurnButton.setAlpha(0.5);
        this.endTurnButton.disableInteractive();
        console.log('Player turn ended!');
        this.startEnemyTurn();
    }

    startEnemyTurn() {
        let index = 0;

        const processNextEnemy = () => {
            if (index < gameState.enemies.length) {
                const enemy = gameState.enemies[index++];
                enemy.takeTurn(processNextEnemy, gameState);
                this.enemyUIs.forEach(ui => ui.update());
                this.updateResourceDisplay();
            } else {
                this.time.delayedCall(600, () => {
                    this.startPlayerTurn();
                });
            }
        };

        processNextEnemy();
    }

    updateUsableMagicItemDisplay() {
        if (this.usableItemUIs) {
            this.usableItemUIs.forEach(t => t.destroy());
        }

        this.usableItemUIs = [];

        gameState.magicItems.forEach((item, index) => {
            const x = 100;
            const y = 550 + index*100;
        
            const renderer = new MagicItemRenderer(this, x, y, item, (clickedItem) => {
                const itemIndex = gameState.magicItems.indexOf(clickedItem);
                if (itemIndex !== -1 && item.type === "usable") {
                    gameState.useMagicItem(itemIndex, this.selectedTarget, this);
                    this.updateUsableMagicItemDisplay();
                    this.updateEnemyDisplay();
                }
            });
            this.usableItemUIs.push(renderer);
        });
    }
}