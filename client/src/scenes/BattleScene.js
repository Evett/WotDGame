import BaseScene from './BaseScene';
import EnemyLibrary from '../data/EnemyLibrary';

const CARD_WIDTH = 120;
const CARD_HEIGHT = 170;
const CARD_SPACING = 10;

export class BattleScene extends BaseScene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.createBackground(0x1a1a2e);

        // State
        this.gameState = this.service.getMyGameState();
        this.selectedCardIndex = null;
        this.selectedTarget = null;
        this.cardObjects = [];
        this.enemyObjects = [];
        this.isMyTurn = false;
        this.battleOver = false;

        // Initialize battle
        this.initBattle();

        // Build UI
        this.createPlayerStatsUI();
        this.createEnemyDisplay();
        this.createHandDisplay();
        this.createEndTurnButton();
        this.createTurnIndicator();

        // Listen for turn events
        this._endTurnHandler = (turnData) => this.handleEndTurnEvent(turnData);
        this.service.onEndTurn(this._endTurnHandler);

        // Cleanup on scene shutdown
        this.events.once('shutdown', () => {
            this.service.offEndTurn(this._endTurnHandler);
        });

        // Check if it's our turn
        this.checkTurn();

        this.createSceneListener(this.service);
    }

    // ─── Battle Init ────────────────────────────────────────

    initBattle() {
        // Host generates enemies and shares them; others read from room state
        let enemies = this.service.getBattleEnemies();
        if (enemies.length === 0) {
            if (this.service.isHost()) {
                // Host sets up the battle
                const difficulty = this.service.getRoomState('battleDifficulty') || 1;
                enemies = EnemyLibrary.getRandomEncounter(difficulty);
                enemies.forEach(e => e.decideIntent());
                this.service.setBattleEnemies(enemies);

                // First player goes first
                const players = this.service.getAllPlayers();
                if (players.length > 0) {
                    this.service.setCurrentTurnPlayer(players[0].id);
                }
            } else {
                // Non-host: wait for enemies to arrive
                this.time.addEvent({
                    delay: 200, loop: true,
                    callback: () => {
                        const e = this.service.getBattleEnemies();
                        if (e.length > 0) {
                            this.scene.restart({ service: this.service });
                        }
                    }
                });
                return;
            }
        }

        this.gameState.startBattle(enemies);
        this.gameState.resetDeck();
        this.gameState.drawHand(this);
        this.service.saveMyGameState(this.gameState);
    }

    // ─── Player Stats UI ────────────────────────────────────

    createPlayerStatsUI() {
        const { width, height } = this.scale;
        const y = height - 220;

        this.statsContainer = this.add.container(20, y);

        this.healthText = this.add.text(0, 0, '', { fontSize: '16px', color: '#ff6666' });
        this.manaText = this.add.text(0, 22, '', { fontSize: '16px', color: '#6699ff' });
        this.actionsText = this.add.text(0, 44, '', { fontSize: '16px', color: '#ffcc44' });
        this.armorText = this.add.text(0, 66, '', { fontSize: '16px', color: '#aaaaaa' });
        this.deckInfoText = this.add.text(0, 88, '', { fontSize: '14px', color: '#888888' });

        this.statsContainer.add([
            this.healthText, this.manaText, this.actionsText,
            this.armorText, this.deckInfoText
        ]);

        this.updateStatsUI();
    }

    updateStatsUI() {
        const gs = this.gameState;
        this.healthText.setText(`♥ HP: ${gs.health}/${gs.maxHealth}`);
        this.manaText.setText(`✦ Mana: ${gs.mana}/${gs.maxMana}`);
        this.actionsText.setText(`⚡ Actions: ${gs.actions}/${gs.maxActions}`);
        this.armorText.setText(`🛡 Armor: ${gs.armor}`);
        this.deckInfoText.setText(`Draw: ${gs.drawPile.length} | Discard: ${gs.discardPile.length}`);
    }

    // ─── Enemy Display ──────────────────────────────────────

    createEnemyDisplay() {
        const { width } = this.scale;
        const enemies = this.gameState.enemies;
        const totalWidth = enemies.length * 140;
        const startX = (width - totalWidth) / 2 + 70;
        const y = 160;

        this.enemyObjects = [];

        enemies.forEach((enemy, index) => {
            const x = startX + index * 140;
            const container = this.add.container(x, y);

            // Enemy body (clickable)
            const body = this.add.rectangle(0, 0, 100, 100, 0x8b0000)
                .setInteractive({ useHandCursor: true });

            // Highlight on hover
            body.on('pointerover', () => {
                if (this.selectedCardIndex !== null && enemy.isAlive) {
                    body.setStrokeStyle(3, 0xffff00);
                }
            });
            body.on('pointerout', () => {
                if (this.selectedTarget !== enemy) {
                    body.setStrokeStyle(0);
                }
            });

            // Click to target
            body.on('pointerdown', () => {
                if (!this.isMyTurn || this.battleOver) return;
                if (!enemy.isAlive) return;

                if (this.selectedCardIndex !== null) {
                    this.selectTarget(index);
                } else {
                    // Clicking enemy without card selected — just highlight as target
                    this.clearTargetHighlights();
                    this.selectedTarget = enemy;
                    body.setStrokeStyle(3, 0xff4444);
                }
            });

            const nameText = this.add.text(0, -65, enemy.name, {
                fontSize: '14px', color: '#fff'
            }).setOrigin(0.5);

            const hpBar = this.add.rectangle(0, 60, 90, 10, 0x333333);
            const hpFill = this.add.rectangle(0, 60, 90, 10, 0xff3333).setOrigin(0.5);

            const hpText = this.add.text(0, 78, `${enemy.health}/${enemy.maxHealth}`, {
                fontSize: '12px', color: '#fff'
            }).setOrigin(0.5);

            const intentText = this.add.text(0, -85, '', {
                fontSize: '12px', color: '#ffcc00'
            }).setOrigin(0.5);

            container.add([body, nameText, hpBar, hpFill, hpText, intentText]);

            this.enemyObjects.push({
                container, body, nameText, hpBar, hpFill, hpText, intentText, enemy
            });
        });

        this.updateEnemyDisplay();
    }

    updateEnemyDisplay() {
        this.enemyObjects.forEach(obj => {
            const { enemy, hpFill, hpText, intentText, body, container } = obj;

            if (!enemy.isAlive) {
                container.setAlpha(0.3);
                body.disableInteractive();
                intentText.setText('DEAD');
                hpText.setText('0');
                hpFill.setScale(0, 1);
                return;
            }

            const ratio = enemy.health / enemy.maxHealth;
            hpFill.setScale(ratio, 1);
            hpText.setText(`${enemy.health}/${enemy.maxHealth}`);

            // Show intent
            if (enemy.intent) {
                if (enemy.intent.type === 'attack') {
                    intentText.setText(`⚔ ${enemy.intent.damage}`);
                    intentText.setColor('#ff6666');
                } else if (enemy.intent.type === 'block') {
                    intentText.setText(`🛡 ${enemy.intent.amount}`);
                    intentText.setColor('#6699ff');
                } else if (enemy.intent.type === 'buff') {
                    intentText.setText(`↑ Buff`);
                    intentText.setColor('#66ff66');
                }
            }
        });
    }

    clearTargetHighlights() {
        this.enemyObjects.forEach(obj => {
            obj.body.setStrokeStyle(0);
        });
        this.selectedTarget = null;
    }

    // ─── Hand Display ───────────────────────────────────────

    createHandDisplay() {
        this.handContainer = this.add.container(0, 0);
        this.renderHand = true;
        this.updateHandDisplay();
    }

    updateHandDisplay() {
        // Clear existing card visuals
        this.cardObjects.forEach(obj => obj.container.destroy());
        this.cardObjects = [];

        const hand = this.gameState.hand;
        const { width, height } = this.scale;
        const totalWidth = hand.length * (CARD_WIDTH + CARD_SPACING);
        const startX = (width - totalWidth) / 2 + CARD_WIDTH / 2;
        const y = height - 100;

        hand.forEach((card, index) => {
            const x = startX + index * (CARD_WIDTH + CARD_SPACING);
            const container = this.add.container(x, y);

            // Card background
            const canAfford = this.gameState.actions >= card.actionCost &&
                              this.gameState.mana >= card.manaCost;
            const bgColor = canAfford ? 0x2a2a4a : 0x1a1a1a;
            const bg = this.add.rectangle(0, 0, CARD_WIDTH, CARD_HEIGHT, bgColor)
                .setStrokeStyle(2, this.getCardTypeColor(card.type))
                .setInteractive({ useHandCursor: true });

            // Card name
            const name = this.add.text(0, -60, card.name, {
                fontSize: '12px', color: '#fff', fontStyle: 'bold',
                wordWrap: { width: CARD_WIDTH - 10 }, align: 'center'
            }).setOrigin(0.5);

            // Cost
            const costText = this.add.text(-45, -75, `${card.actionCost}⚡ ${card.manaCost}✦`, {
                fontSize: '10px', color: '#ffcc44'
            }).setOrigin(0);

            // Type
            const typeText = this.add.text(0, -35, card.type, {
                fontSize: '10px', color: this.getCardTypeColorHex(card.type)
            }).setOrigin(0.5);

            // Description
            const desc = this.add.text(0, 10, card.getDescription(), {
                fontSize: '10px', color: '#cccccc',
                wordWrap: { width: CARD_WIDTH - 16 }, align: 'center'
            }).setOrigin(0.5);

            // Target indicator
            const targetIndicator = card.requiresTarget ?
                this.add.text(0, 55, '🎯 Target', { fontSize: '9px', color: '#ff8800' }).setOrigin(0.5) :
                this.add.text(0, 55, '', { fontSize: '9px' }).setOrigin(0.5);

            container.add([bg, name, costText, typeText, desc, targetIndicator]);

            // Hover effects
            bg.on('pointerover', () => {
                if (this.isMyTurn && canAfford) {
                    container.setScale(1.1);
                    container.setY(y - 15);
                }
            });
            bg.on('pointerout', () => {
                if (this.selectedCardIndex !== index) {
                    container.setScale(1);
                    container.setY(y);
                }
            });

            // Click card
            bg.on('pointerdown', () => {
                if (!this.isMyTurn || this.battleOver) return;
                if (!canAfford) {
                    this.showMessage('Not enough resources!', '#ff4444');
                    return;
                }

                if (this.selectedCardIndex === index) {
                    // Deselect
                    this.deselectCard();
                    return;
                }

                this.deselectCard();
                this.selectedCardIndex = index;
                container.setScale(1.1);
                container.setY(y - 15);
                bg.setStrokeStyle(3, 0xffff00);

                if (!card.requiresTarget) {
                    // Play immediately (no target needed)
                    this.playSelectedCard(null);
                } else {
                    this.showMessage('Click an enemy to target', '#ffcc44');
                }
            });

            this.cardObjects.push({ container, bg, card, index });
        });
    }

    deselectCard() {
        const { height } = this.scale;
        const y = height - 100;

        if (this.selectedCardIndex !== null) {
            const obj = this.cardObjects[this.selectedCardIndex];
            if (obj) {
                obj.container.setScale(1);
                obj.container.setY(y);
                obj.bg.setStrokeStyle(2, this.getCardTypeColor(obj.card.type));
            }
        }
        this.selectedCardIndex = null;
        this.clearTargetHighlights();
    }

    selectTarget(enemyIndex) {
        const enemy = this.gameState.enemies[enemyIndex];
        if (!enemy || !enemy.isAlive) return;

        this.playSelectedCard(enemy);
    }

    playSelectedCard(target) {
        if (this.selectedCardIndex === null) return;

        const index = this.selectedCardIndex;
        const result = this.gameState.playCard(index, target, this);

        if (result.success) {
            this.deselectCard();
            this.updateHandDisplay();
            this.updateEnemyDisplay();
            this.updateStatsUI();
            this.service.saveMyGameState(this.gameState);

            // Sync enemy state to room (since cards can damage enemies)
            this.service.setBattleEnemies(this.gameState.enemies);

            // Check if battle is won
            this.checkBattleEnd();
        } else {
            if (result.reason === 'target') {
                this.showMessage('Select a target!', '#ff8800');
            } else if (result.reason === 'actions') {
                this.showMessage('Not enough actions!', '#ff4444');
            } else if (result.reason === 'mana') {
                this.showMessage('Not enough mana!', '#ff4444');
            }
        }
    }

    // ─── End Turn ───────────────────────────────────────────

    createEndTurnButton() {
        const { width, height } = this.scale;

        this.endTurnBtn = this.add.text(width - 120, height - 220, 'End Turn', {
            fontSize: '20px', backgroundColor: '#cc6600',
            padding: { x: 16, y: 10 }, color: '#fff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.endTurnBtn.on('pointerdown', () => {
            if (!this.isMyTurn || this.battleOver) return;
            this.endTurn();
        });

        this.endTurnBtn.on('pointerover', () => {
            if (this.isMyTurn) this.endTurnBtn.setStyle({ backgroundColor: '#ff8800' });
        });
        this.endTurnBtn.on('pointerout', () => {
            this.endTurnBtn.setStyle({ backgroundColor: this.isMyTurn ? '#cc6600' : '#444444' });
        });
    }

    endTurn() {
        this.isMyTurn = false;
        this.deselectCard();
        this.gameState.discardHand();
        this.service.saveMyGameState(this.gameState);
        this.updateHandDisplay();
        this.updateTurnUI();
        this.service.endMyTurn();
    }

    // ─── Turn Management ────────────────────────────────────

    createTurnIndicator() {
        const { width } = this.scale;
        this.turnText = this.add.text(width / 2, 30, '', {
            fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.updateTurnUI();
    }

    checkTurn() {
        this.isMyTurn = this.service.isMyTurn();
        this.updateTurnUI();
    }

    updateTurnUI() {
        if (this.battleOver) {
            this.turnText.setText('');
            this.endTurnBtn.setStyle({ backgroundColor: '#444444' });
            return;
        }

        if (this.isMyTurn) {
            this.turnText.setText('YOUR TURN');
            this.turnText.setColor('#44ff44');
            this.endTurnBtn.setStyle({ backgroundColor: '#cc6600' });
        } else {
            const currentTurnId = this.service.getCurrentTurnPlayer();
            const players = this.service.getAllPlayers();
            const turnPlayer = players.find(p => p.id === currentTurnId);
            const name = turnPlayer ? turnPlayer.getProfile().name : 'Enemy';
            this.turnText.setText(`${name}'s Turn`);
            this.turnText.setColor('#aaaaaa');
            this.endTurnBtn.setStyle({ backgroundColor: '#444444' });
        }
    }

    handleEndTurnEvent(data) {
        if (this.battleOver) return;

        if (data.type === 'enemy_turn') {
            this.runEnemyTurn();
        } else if (data.type === 'next_player') {
            // Refresh enemy display (previous player may have damaged them)
            const enemies = this.service.getBattleEnemies();
            this.gameState.enemies = enemies;
            this.updateEnemyDisplay();

            if (data.playerId === this.service.getMyPlayer()?.id) {
                this.startMyTurn();
            } else {
                this.isMyTurn = false;
                this.updateTurnUI();
            }
        }
    }

    startMyTurn() {
        this.isMyTurn = true;

        // Refresh game state
        this.gameState = this.service.getMyGameState();

        // Refresh enemies from room state
        const enemies = this.service.getBattleEnemies();
        this.gameState.enemies = enemies;

        // Reset armor each turn, restore actions/mana
        this.gameState.armor = 0;
        this.gameState.actions = this.gameState.maxActions;
        this.gameState.mana = this.gameState.maxMana;

        // Draw new hand
        this.gameState.drawHand(this);

        this.service.saveMyGameState(this.gameState);
        this.updateStatsUI();
        this.updateEnemyDisplay();
        this.updateHandDisplay();
        this.updateTurnUI();

        this.showMessage('Your turn!', '#44ff44');
    }

    // ─── Enemy Turn ─────────────────────────────────────────

    runEnemyTurn() {
        this.isMyTurn = false;
        this.turnText.setText('Enemy Turn');
        this.turnText.setColor('#ff4444');

        const enemies = this.service.getBattleEnemies();
        this.gameState.enemies = enemies;
        const aliveEnemies = enemies.filter(e => e.isAlive);

        let delay = 0;
        aliveEnemies.forEach((enemy, i) => {
            this.time.delayedCall(delay, () => {
                // Each enemy attacks the current player (co-op: enemies split attacks)
                enemy.takeTurn(this.gameState);
                this.updateStatsUI();
                this.updateEnemyDisplay();
                this.flashEnemy(i);

                // Decide next intent
                enemy.decideIntent();
            });
            delay += 600;
        });

        // After all enemies act, start the next round (first player's turn)
        this.time.delayedCall(delay + 300, () => {
            // Save updated enemies
            this.service.setBattleEnemies(this.gameState.enemies);
            this.service.saveMyGameState(this.gameState);

            // Check if player died
            if (this.gameState.isDead()) {
                this.battleLost();
                return;
            }

            // Start first player's turn for next round
            const players = this.service.getAllPlayers();
            if (players.length > 0) {
                const firstPlayer = players[0];
                this.service.setCurrentTurnPlayer(firstPlayer.id);

                if (firstPlayer.id === this.service.getMyPlayer()?.id) {
                    this.startMyTurn();
                } else {
                    this.isMyTurn = false;
                    this.updateTurnUI();
                }
            }
        });
    }

    flashEnemy(index) {
        const obj = this.enemyObjects[index];
        if (!obj) return;
        this.tweens.add({
            targets: obj.container,
            x: obj.container.x - 10,
            duration: 50,
            yoyo: true,
            repeat: 2
        });
    }

    // ─── Battle End ─────────────────────────────────────────

    checkBattleEnd() {
        const allDead = this.gameState.enemies.every(e => !e.isAlive);
        if (allDead) {
            this.battleWon();
        }
    }

    battleWon() {
        this.battleOver = true;
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2 - 50, 'VICTORY!', {
            fontSize: '48px', color: '#44ff44', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Award gold
        this.gameState.gainGold(25);
        this.service.saveMyGameState(this.gameState);

        this.add.text(width / 2, height / 2 + 10, '+25 Gold', {
            fontSize: '24px', color: '#ffcc44'
        }).setOrigin(0.5);

        // Continue button
        const continueBtn = this.add.text(width / 2, height / 2 + 70, 'Continue', {
            fontSize: '24px', backgroundColor: '#006400',
            padding: { x: 20, y: 10 }, color: '#fff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueBtn.on('pointerdown', () => {
            // Clear battle state
            this.service.setRoomState('battleEnemies', null);
            this.service.setCurrentTurnPlayer(null);
            this.service.broadcastSceneSwitch('BeginningChoiceScene');
        });

        this.updateTurnUI();
    }

    battleLost() {
        this.battleOver = true;
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2, 'DEFEATED', {
            fontSize: '48px', color: '#ff4444', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.updateTurnUI();
    }

    // ─── Helpers ────────────────────────────────────────────

    showMessage(text, color = '#ffffff') {
        const { width } = this.scale;
        const msg = this.add.text(width / 2, 70, text, {
            fontSize: '16px', color, fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            alpha: 0,
            y: 50,
            duration: 1500,
            onComplete: () => msg.destroy()
        });
    }

    getCardTypeColor(type) {
        switch (type) {
            case 'Attack': return 0xff4444;
            case 'Skill': return 0x44aaff;
            case 'Spell': return 0xaa44ff;
            case 'Power': return 0xffaa00;
            default: return 0x888888;
        }
    }

    getCardTypeColorHex(type) {
        switch (type) {
            case 'Attack': return '#ff4444';
            case 'Skill': return '#44aaff';
            case 'Spell': return '#aa44ff';
            case 'Power': return '#ffaa00';
            default: return '#888888';
        }
    }
}