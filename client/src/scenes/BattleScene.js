import BaseScene from './BaseScene';
import EnemyLibrary from '../data/EnemyLibrary';
import Enemy from '../data/Enemy';
import CharacterLibrary from '../data/CharacterLibrary';

const CARD_WIDTH = 120;
const CARD_HEIGHT = 170;
const CARD_SPACING = 10;

// Color map for placeholder character sprites (must match CharacterSelectScene)
const CHARACTER_COLORS = {
    Alaen: 0x7744aa,
    Hassan: 0x44aa77,
    Marcus: 0x4466ff,
    Mohef: 0xcc2222,
    Nephereta: 0xffcc00,
    Urusha: 0xcc6600
};

export class BattleScene extends BaseScene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        this.load.image('char_alaen', 'characters/char_alaen.png');
        this.load.image('char_hassan', 'characters/char_alaen.png');
        this.load.image('char_marcus', 'characters/char_alaen.png');
        this.load.image('char_mohef', 'characters/char_alaen.png');
        this.load.image('char_nephereta', 'characters/char_alaen.png');
        this.load.image('char_urusha', 'characters/char_alaen.png');

        // Enemy sprites — all point to placeholder until real art is added
        const enemyNames = [
            'goblin', 'orc', 'slime', 'skeleton', 'bandit',
            'giant_spider', 'wraith', 'ogre_brute', 'dark_cultist', 'wolf_pack',
            'stone_golem', 'fire_elemental', 'vampire_spawn', 'minotaur', 'frost_witch',
            'shadow_assassin', 'plague_bear', 'bone_knight', 'harpy',
            'ancient_dragon', 'lich_king', 'iron_colossus', 'demon_prince', 'nyxaroth'
        ];
        enemyNames.forEach(name => {
            this.load.image(`enemy_${name}`, `enemies/${name}.png`);
        });

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('enemy_')) {
                console.warn(`[BattleScene] Enemy sprite not found: ${file.key}`);
            }
        });
    }

    create(data) {
        super.create();
        this.service = data.service;
        this.createBackground(0x1a1a2e);
        this.createInventoryButton(this.service);

        // State
        this.gameState = this.service.getMyGameState();
        this.selectedCardIndex = null;
        this.selectedTarget = null;
        this.cardObjects = [];
        this.enemyObjects = [];
        this.isMyTurn = false;
        this.battleOver = false;
        this.turnEnded = false;
        this.enemyTurnRunning = false;
        this.playersEndedTurn = new Set();
        this.currentRound = 1;

        // Register RPC-based battle event handler
        this._battleEventHandler = (type, data) => this.handleBattleEvent(type, data);
        this.service.onBattleEvent(this._battleEventHandler);

        // Initialize battle
        this.initBattle();

        // Build UI
        this.createAllyDisplay();
        this.createPlayerStatsUI();
        this.createEnemyDisplay();
        this.createHandDisplay();
        this.createEndTurnButton();
        this.createItemDisplay();
        this.createCharacterSprite();
        this.createTurnIndicator();

        // Cleanup on scene shutdown
        this.events.once('shutdown', () => {
            this.service.offBattleEvent(this._battleEventHandler);
        });

        // Start the first turn
        if (!this.waitingForHost) {
            this.startMyTurn();
        }

        // Poll ally HP updates
        this.time.addEvent({
            delay: 1000, loop: true,
            callback: () => this.updateAllyDisplay()
        });

        this.createSceneListener(this.service);
    }

    // ─── RPC Event Handler ──────────────────────────────────

    handleBattleEvent(type, data) {
        if (this.battleOver) return;

        switch (type) {
            case 'battle_ready':
                // Host has set up enemies — non-host joins
                if (this.waitingForHost) {
                    this.waitingForHost = false;
                    const enemies = this.service.getBattleEnemies();
                    if (enemies.length > 0) {
                        this.gameState.startBattle(enemies);
                        this.gameState.resetDeck();
                        this.gameState.actions = this.gameState.maxActions;
                        this.gameState.mana = this.gameState.maxMana;
                        this.gameState.armor = 0;
                        this.gameState.drawHand(this);
                        this.gameState.runItemTriggers('onBattleStart', this);
                        this.service.saveMyGameState(this.gameState);
                        // Rebuild enemy display with new enemies
                        this.enemyObjects.forEach(obj => obj.container.destroy());
                        this.createEnemyDisplay();
                        this.updateHandDisplay();
                        this.startMyTurn();
                    }
                }
                break;

            case 'enemy_damage':
                // Another player dealt damage — update local enemy state
                this.applyEnemyDamage(data.enemyIndex, data.newHealth, data.isAlive, data.statuses, data.armor);
                break;

            case 'player_ended_turn':
                // A player ended their turn
                this.playersEndedTurn.add(data.playerId);
                this.checkAllTurnsEnded();
                break;
        }
    }

    applyEnemyDamage(enemyIndex, newHealth, isAlive, statuses, armor) {
        const enemy = this.gameState.enemies[enemyIndex];
        if (!enemy) return;

        enemy.health = newHealth;
        enemy.isAlive = isAlive;
        if (statuses) {
            enemy.statuses = { ...statuses };
        }
        if (armor !== undefined) {
            enemy.armor = armor;
        }

        if (this.enemyObjects[enemyIndex]) {
            this.enemyObjects[enemyIndex].enemy = enemy;
        }
        this.updateEnemyDisplay();

        // Persist to room state (any client can do this, last write wins but they all converge)
        this.service.setBattleEnemies(this.gameState.enemies);

        // Check if all dead
        if (this.gameState.enemies.every(e => !e.isAlive)) {
            this.battleWon();
        }
    }

    // ─── Battle Init ────────────────────────────────────────

    initBattle() {
        this.isBossBattle = this.service.isBossBattle();
        const isBoss = this.service.isFinalBoss() || this.isBossBattle;
        this.playMusic(isBoss ? 'bgm_boss' : 'bgm_battle');

        this.waitingForHost = false;

        if (this.service.isHost()) {
            // Check if a battle is already in progress (reconnect case)
            const existingEnemies = this.service.getBattleEnemies();
            if (existingEnemies.length > 0 && existingEnemies.some(e => e.isAlive)) {
                // Resume existing battle
                this.gameState.enemies = existingEnemies;
                return;
            }

            // Fresh battle — use pre-rolled encounter from NarrativeScene if available
            this.service.setRoomState('battleEnemies', null);

            const playerCount = this.service.getAllPlayers().length || 1;
            let enemies;
            const preRolled = this.service.getRoomState('preRolledEncounter');

            if (preRolled && preRolled.length > 0) {
                // Use the encounter that was pre-rolled to match the narrative
                enemies = preRolled.map(e => Enemy.rehydrate(e));
                this.service.setRoomState('preRolledEncounter', null);
            } else if (this.service.isFinalBoss()) {
                enemies = EnemyLibrary.getFinalBossEncounter(playerCount);
            } else if (this.isBossBattle) {
                enemies = EnemyLibrary.getBossEncounter(playerCount);
            } else {
                const difficulty = this.service.getRoomState('battleDifficulty') || 1;
                enemies = EnemyLibrary.getRandomEncounter(difficulty, playerCount);
            }
            enemies.forEach(e => e.decideIntent());

            this.gameState.startBattle(enemies);
            this.gameState.resetDeck();
            this.gameState.actions = this.gameState.maxActions;
            this.gameState.mana = this.gameState.maxMana;
            this.gameState.armor = 0;
            this.gameState.drawHand(this);
            this.gameState.runItemTriggers('onBattleStart', this);
            this.service.saveMyGameState(this.gameState);

            // Broadcast to others that battle is ready
            this.service.broadcastBattleReady(enemies);
        } else {
            // Non-host: check if host already set up, otherwise wait for RPC
            const enemies = this.service.getBattleEnemies();
            if (enemies.length > 0 && enemies.some(e => e.isAlive)) {
                this.gameState.startBattle(enemies);
                this.gameState.resetDeck();
                this.gameState.actions = this.gameState.maxActions;
                this.gameState.mana = this.gameState.maxMana;
                this.gameState.armor = 0;
                this.gameState.drawHand(this);
                this.gameState.runItemTriggers('onBattleStart', this);
                this.service.saveMyGameState(this.gameState);
            } else {
                // Wait for BATTLE_READY RPC from host
                this.waitingForHost = true;
            }
        }
    }

    // ─── Character Sprite ───────────────────────────────────

    createCharacterSprite() {
        const { height } = this.scale;
        const charName = this.gameState.character?.name;
        if (!charName) return;

        const textureKey = `char_${charName.toLowerCase()}`;

        // Generate placeholder texture if it doesn't exist yet
        if (!this.textures.exists(textureKey)) {
            this.generateCharacterTexture(charName, textureKey);
        }

        this.characterSprite = this.add.image(80, height - 340, textureKey)
            .setScale(1.5)
            .setOrigin(0.5, 1);
    }

    generateCharacterTexture(charName, textureKey) {
        const color = CHARACTER_COLORS[charName] || 0x888888;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Head
        graphics.fillStyle(color, 1);
        graphics.fillCircle(32, 16, 14);
        // Body
        graphics.fillRoundedRect(16, 30, 32, 44, 6);
        // Arms
        graphics.fillRoundedRect(6, 34, 12, 32, 4);
        graphics.fillRoundedRect(46, 34, 12, 32, 4);
        // Legs
        graphics.fillRoundedRect(18, 72, 12, 28, 4);
        graphics.fillRoundedRect(34, 72, 12, 28, 4);

        graphics.generateTexture(textureKey, 64, 100);
        graphics.destroy();
    }

    getEnemySpriteKey(enemyName) {
        return 'enemy_' + enemyName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/_$/, '');
    }

    // ─── Ally Display ───────────────────────────────────────

    createAllyDisplay() {
        const { width, height } = this.scale;
        const players = this.service.getAllPlayers();
        const myId = this.service.getMyPlayer()?.id;

        this.allyObjects = [];
        const boxW = 110;
        const boxH = 70;
        const gap = 10;
        const totalW = players.length * (boxW + gap) - gap;
        const startX = (width - totalW) / 2 + boxW / 2;
        const y = height - 210;

        players.forEach((player, index) => {
            const x = startX + index * (boxW + gap);
            const isMe = player.id === myId;
            const gs = this.service.getPlayerGameState(player);

            const container = this.add.container(x, y);

            const bg = this.add.rectangle(0, 0, boxW, boxH, isMe ? 0x2a3a4a : 0x2a2a3a)
                .setStrokeStyle(isMe ? 2 : 1, isMe ? 0x44aaff : 0x555555);

            const charName = gs?.character?.name || player.getProfile().name || '???';
            const nameText = this.add.text(0, -22, charName, {
                fontSize: '12px', color: isMe ? '#44aaff' : '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            const classText = this.add.text(0, -8, gs?.characterClass || '', {
                fontSize: '10px', color: '#888'
            }).setOrigin(0.5);

            const hp = gs ? gs.health : 0;
            const maxHp = gs ? gs.maxHealth : 1;
            const hpBar = this.add.rectangle(0, 12, boxW - 16, 8, 0x333333);
            const hpFill = this.add.rectangle(-(boxW - 16) / 2, 12, boxW - 16, 8, 0x44cc44)
                .setOrigin(0, 0.5);

            const hpText = this.add.text(0, 26, `${hp}/${maxHp}`, {
                fontSize: '11px', color: '#aaffaa'
            }).setOrigin(0.5);

            container.add([bg, nameText, classText, hpBar, hpFill, hpText]);

            this.allyObjects.push({
                container, hpFill, hpText, player, barWidth: boxW - 16
            });
        });

        this.updateAllyDisplay();
    }

    updateAllyDisplay() {
        this.allyObjects.forEach(obj => {
            const gs = this.service.getPlayerGameState(obj.player);
            if (!gs) return;

            const ratio = gs.health / gs.maxHealth;
            obj.hpFill.displayWidth = obj.barWidth * Math.max(0, ratio);
            obj.hpText.setText(`${gs.health}/${gs.maxHealth}`);

            // Change color based on HP
            if (ratio > 0.5) {
                obj.hpFill.setFillStyle(0x44cc44);
            } else if (ratio > 0.25) {
                obj.hpFill.setFillStyle(0xccaa44);
            } else {
                obj.hpFill.setFillStyle(0xcc4444);
            }
        });
    }

    // ─── Player Stats UI ────────────────────────────────────

    createPlayerStatsUI() {
        const { width, height } = this.scale;
        const y = height - 285;

        this.statsContainer = this.add.container(20, y);

        // HP bar
        const barWidth = 120;
        this.hpBarBg = this.add.rectangle(barWidth / 2, 0, barWidth, 14, 0x333333);
        this.hpBarFill = this.add.rectangle(0, 0, barWidth, 14, 0xcc3333).setOrigin(0, 0.5);
        this.healthText = this.add.text(barWidth / 2, 0, '', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);

        this.manaText = this.add.text(0, 18, '', { fontSize: '14px', color: '#6699ff' });
        this.actionsText = this.add.text(0, 36, '', { fontSize: '14px', color: '#ffcc44' });
        this.armorText = this.add.text(0, 54, '', { fontSize: '14px', color: '#aaaaaa' });
        this.deckInfoText = this.add.text(0, 72, '', { fontSize: '12px', color: '#888888' });

        this.statsContainer.add([
            this.hpBarBg, this.hpBarFill, this.healthText,
            this.manaText, this.actionsText,
            this.armorText, this.deckInfoText
        ]);

        this.updateStatsUI();
    }

    updateStatsUI() {
        const gs = this.gameState;
        const ratio = gs.health / gs.maxHealth;
        this.hpBarFill.displayWidth = 120 * Math.max(0, ratio);
        if (ratio > 0.5) this.hpBarFill.setFillStyle(0x44cc44);
        else if (ratio > 0.25) this.hpBarFill.setFillStyle(0xccaa44);
        else this.hpBarFill.setFillStyle(0xcc3333);
        this.healthText.setText(`${gs.health}/${gs.maxHealth}`);
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

            // Enemy sprite or fallback colored box
            const textureKey = this.getEnemySpriteKey(enemy.name);
            let body;
            if (this.textures.exists(textureKey) && this.textures.get(textureKey).key !== '__MISSING') {
                body = this.add.image(0, 0, textureKey)
                    .setDisplaySize(100, 100)
                    .setInteractive({ useHandCursor: true });
            } else {
                body = this.add.rectangle(0, 0, 100, 100, enemy.isBoss ? 0x660066 : 0x8b0000)
                    .setInteractive({ useHandCursor: true });
            }

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
            const hpFill = this.add.rectangle(-45, 60, 90, 10, 0xff3333).setOrigin(0, 0.5);

            const hpText = this.add.text(0, 78, `${enemy.health}/${enemy.maxHealth}`, {
                fontSize: '12px', color: '#fff'
            }).setOrigin(0.5);

            const intentText = this.add.text(0, -85, '', {
                fontSize: '12px', color: '#ffcc00'
            }).setOrigin(0.5);

            const armorText = this.add.text(0, 95, '', {
                fontSize: '11px', color: '#6699ff'
            }).setOrigin(0.5);

            container.add([body, nameText, hpBar, hpFill, hpText, intentText, armorText]);

            this.enemyObjects.push({
                container, body, nameText, hpBar, hpFill, hpText, intentText, armorText, enemy
            });
        });

        this.updateEnemyDisplay();
    }

    updateEnemyDisplay() {
        this.enemyObjects.forEach(obj => {
            const { enemy, hpFill, hpText, intentText, armorText, body, container } = obj;

            if (!enemy.isAlive) {
                container.setAlpha(0.3);
                body.disableInteractive();
                intentText.setText('DEAD');
                hpText.setText('0');
                hpFill.displayWidth = 0;
                armorText.setText('');
                return;
            }

            const ratio = enemy.health / enemy.maxHealth;
            hpFill.displayWidth = 90 * ratio;
            hpText.setText(`${enemy.health}/${enemy.maxHealth}`);

            // Show armor
            if (enemy.armor > 0) {
                armorText.setText(`🛡 ${enemy.armor}`);
            } else {
                armorText.setText('');
            }

            // Show intent
            if (enemy.statuses?.Stunned && enemy.statuses.Stunned > 0) {
                intentText.setText(`💫 STUNNED (${enemy.statuses.Stunned})`);
                intentText.setColor('#ffff44');
            } else if (enemy.intent) {
                switch (enemy.intent.type) {
                    case 'attack':
                        intentText.setText(`⚔ ${enemy.intent.damage + (enemy.strength || 0)}`);
                        intentText.setColor('#ff6666');
                        break;
                    case 'multi_attack':
                        intentText.setText(`⚔ ${enemy.intent.damage + (enemy.strength || 0)}x${enemy.intent.hits}`);
                        intentText.setColor('#ff6666');
                        break;
                    case 'attack_and_block':
                        intentText.setText(`⚔${enemy.intent.damage + (enemy.strength || 0)} 🛡${enemy.intent.block}`);
                        intentText.setColor('#ffaa44');
                        break;
                    case 'block':
                        intentText.setText(`🛡 ${enemy.intent.amount}`);
                        intentText.setColor('#6699ff');
                        break;
                    case 'buff':
                        intentText.setText(`↑ Buff`);
                        intentText.setColor('#66ff66');
                        break;
                    case 'heal':
                        intentText.setText(`♥ Heal ${enemy.intent.amount}`);
                        intentText.setColor('#44ff44');
                        break;
                    case 'debuff':
                        intentText.setText(`↓ ${enemy.intent.status}`);
                        intentText.setColor('#cc44cc');
                        break;
                    default:
                        intentText.setText('?');
                        intentText.setColor('#888888');
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

    refreshEnemiesFromRoom() {
        // No longer used — enemy sync is now RPC-driven
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

        // Snapshot enemy state before card play
        const hpBefore = this.gameState.enemies.map(e => ({ health: e.health, isAlive: e.isAlive, armor: e.armor, statuses: { ...e.statuses } }));

        const result = this.gameState.playCard(index, target, this);

        if (result.success) {
            this.deselectCard();
            this.updateHandDisplay();
            this.updateEnemyDisplay();
            this.updateStatsUI();
            this.service.saveMyGameState(this.gameState);

            // Fire onCardPlayed trigger
            this.gameState.runItemTriggers('onCardPlayed', result.card, this);

            // Fire onEnemyKilled for any enemies that just died
            this.gameState.enemies.forEach(e => {
                if (!e.isAlive && !e._killedTriggered) {
                    e._killedTriggered = true;
                    this.gameState.runItemTriggers('onEnemyKilled', e, this);
                }
            });

            // Broadcast damage to all other players via RPC
            this.broadcastEnemyChanges(hpBefore);

            // Update stats again in case triggers changed them
            this.updateStatsUI();
            this.updateItemDisplay();

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

    broadcastEnemyChanges(hpBefore) {
        this.gameState.enemies.forEach((enemy, i) => {
            const changed = enemy.health !== hpBefore[i].health ||
                enemy.isAlive !== hpBefore[i].isAlive ||
                enemy.armor !== hpBefore[i].armor ||
                JSON.stringify(enemy.statuses) !== JSON.stringify(hpBefore[i].statuses);
            if (changed) {
                this.service.broadcastEnemyDamage(i, enemy.health, enemy.isAlive, { ...enemy.statuses }, enemy.armor);
            }
        });
        // Also persist to room state for reconnection
        this.service.setBattleEnemies(this.gameState.enemies);
    }

    // ─── End Turn ───────────────────────────────────────────

    createEndTurnButton() {
        const { width, height } = this.scale;

        this.endTurnBtn = this.add.text(width - 120, height - 285, 'End Turn', {
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

        // Hero Ability button
        const abilityName = this.gameState.character?.heroAbilityName || 'Hero Ability';
        const abilityDesc = this.gameState.character?.heroAbilityDescription?.(this.gameState.heroAbilityLevel) || '';
        this.heroAbilityBtn = this.add.text(width - 120, height - 230, abilityName, {
            fontSize: '16px', backgroundColor: '#6633cc',
            padding: { x: 12, y: 8 }, color: '#fff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.heroAbilityBtn.setData('tooltip', abilityDesc);

        this.heroAbilityBtn.on('pointerdown', () => {
            if (!this.isMyTurn || this.battleOver || this.gameState.heroAbilityUsed) return;
            const success = this.gameState.useHeroAbility();
            if (success) {
                this.heroAbilityBtn.setStyle({ backgroundColor: '#333333' });
                this.heroAbilityBtn.setAlpha(0.5);
                this.heroAbilityBtn.disableInteractive();
                this.updateResourceDisplay();
                this.showBattleMessage(`Used ${abilityName}!`);
            }
        });
        this.heroAbilityBtn.on('pointerover', () => {
            if (!this.gameState.heroAbilityUsed) this.heroAbilityBtn.setStyle({ backgroundColor: '#8844ff' });
        });
        this.heroAbilityBtn.on('pointerout', () => {
            if (!this.gameState.heroAbilityUsed) this.heroAbilityBtn.setStyle({ backgroundColor: '#6633cc' });
        });
    }

    // ─── Usable Items Display ───────────────────────────────

    createItemDisplay() {
        this.itemObjects = [];
        this.itemContainer = this.add.container(0, 0);
        this.updateItemDisplay();
    }

    updateItemDisplay() {
        // Clear existing
        if (this.itemObjects) {
            this.itemObjects.forEach(obj => obj.container.destroy());
        }
        this.itemObjects = [];

        const usableItems = this.gameState.magicItems.filter(item => item.type === 'usable');
        if (usableItems.length === 0) return;

        const { width } = this.scale;
        const itemSize = 50;
        const gap = 8;
        const startX = width - 60;
        const startY = 100;

        usableItems.forEach((item, index) => {
            const y = startY + index * (itemSize + gap);
            const container = this.add.container(startX, y);

            const canUse = item.canUse() && this.isMyTurn && !this.battleOver;
            const bgColor = canUse ? 0x4a2a6a : 0x2a2a2a;
            const borderColor = canUse ? 0xaa44ff : 0x555555;

            const bg = this.add.rectangle(0, 0, itemSize, itemSize, bgColor)
                .setStrokeStyle(2, borderColor)
                .setInteractive({ useHandCursor: canUse });

            const nameText = this.add.text(0, 0, item.name.substring(0, 3), {
                fontSize: '14px', color: canUse ? '#ffffff' : '#666666', fontStyle: 'bold'
            }).setOrigin(0.5);

            const usesText = this.add.text(0, 20, `${item.currentUses}/${item.usesPerCombat}`, {
                fontSize: '9px', color: '#aaaaaa'
            }).setOrigin(0.5);

            container.add([bg, nameText, usesText]);

            // Tooltip on hover
            bg.on('pointerover', () => {
                if (this.itemTooltip) this.itemTooltip.destroy();
                this.itemTooltip = this.add.text(startX - itemSize - 10, y, `${item.name}\n${item.description}`, {
                    fontSize: '11px', color: '#ffffff', backgroundColor: '#222222',
                    padding: { x: 8, y: 6 }, wordWrap: { width: 180 }
                }).setOrigin(1, 0.5);
            });

            bg.on('pointerout', () => {
                if (this.itemTooltip) {
                    this.itemTooltip.destroy();
                    this.itemTooltip = null;
                }
            });

            // Click to use
            bg.on('pointerdown', () => {
                if (!this.isMyTurn || this.battleOver) return;
                if (!item.canUse()) {
                    this.showMessage('Item already used!', '#888888');
                    return;
                }

                const realIndex = this.gameState.magicItems.indexOf(item);
                const hpBefore = this.gameState.enemies.map(e => ({ health: e.health, isAlive: e.isAlive, armor: e.armor, statuses: { ...e.statuses } }));
                const success = this.gameState.useMagicItem(realIndex, null, this);
                if (success) {
                    this.showMessage(`Used ${item.name}!`, '#aa44ff');
                    this.updateStatsUI();
                    this.updateEnemyDisplay();
                    this.updateItemDisplay();
                    this.service.saveMyGameState(this.gameState);
                    this.broadcastEnemyChanges(hpBefore);
                    this.checkBattleEnd();
                }
            });

            this.itemObjects.push({ container, item });
        });
    }

    updateSummonedAllies() {
        if (this.allyDisplayObjects) {
            this.allyDisplayObjects.forEach(obj => obj.destroy());
        }
        this.allyDisplayObjects = [];

        const startX = 20;
        const startY = 140;
        let y = startY;

        const players = this.service.getAllPlayers();
        const myId = this.service.getMyPlayer()?.id;

        players.forEach(player => {
            const isMe = player.id === myId;
            const gs = isMe ? this.gameState : this.service.getPlayerGameState(player);
            const allies = gs?.allies || [];
            if (allies.length === 0) return;

            const playerName = gs?.character?.name || player.getProfile().name || '???';
            if (!isMe) {
                const label = this.add.text(startX, y, `${playerName}'s summons:`, {
                    fontSize: '11px', color: '#aaaaaa'
                });
                this.allyDisplayObjects.push(label);
                y += 18;
            }

            allies.forEach(ally => {
                const color = isMe ? '#66ffaa' : '#88ccff';
                const txt = this.add.text(startX, y, `⚔ ${ally.name} (${ally.turnsRemaining} turns | ATK ${ally.damage})`, {
                    fontSize: '12px', color
                });
                this.allyDisplayObjects.push(txt);
                y += 20;
            });
        });
    }

    updateStatusDisplay() {
        if (this.statusDisplayObjects) {
            this.statusDisplayObjects.forEach(obj => obj.destroy());
        }
        this.statusDisplayObjects = [];

        const statuses = this.gameState.statuses || {};
        const buffs = this.gameState.buffs || {};
        const statusKeys = Object.keys(statuses);
        const buffKeys = Object.keys(buffs);
        if (statusKeys.length === 0 && buffKeys.length === 0) return;

        const startX = 20;
        const startY = this.scale.height - 100;

        let y = startY;
        statusKeys.forEach(name => {
            const txt = this.add.text(startX, y, `⚠ ${name} (${statuses[name]} turns)`, {
                fontSize: '11px', color: '#ff6688'
            });
            this.statusDisplayObjects.push(txt);
            y += 18;
        });

        buffKeys.forEach(name => {
            const txt = this.add.text(startX, y, `✦ ${name} (${buffs[name].turnsRemaining} turns)`, {
                fontSize: '11px', color: '#88ccff'
            });
            this.statusDisplayObjects.push(txt);
            y += 18;
        });
    }

    endTurn() {
        if (this.turnEnded) return;
        this.turnEnded = true;
        this.isMyTurn = false;

        // Fire onTurnEnd triggers for passive items
        this.gameState.runItemTriggers('onTurnEnd', this);

        this.deselectCard();
        this.gameState.discardHand();
        this.service.saveMyGameState(this.gameState);
        this.updateHandDisplay();
        this.updateTurnUI();

        // Track self immediately (don't rely on RPC loopback)
        const player = this.service.getMyPlayer();
        this.playersEndedTurn.add(player.id);
        this.service.broadcastEndTurn(player.id);
        this.checkAllTurnsEnded();
    }

    // ─── Simultaneous Turn Management ───────────────────────

    createTurnIndicator() {
        const { width } = this.scale;
        this.turnText = this.add.text(width / 2, 30, '', {
            fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
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
        } else if (this.turnEnded) {
            this.turnText.setText('Waiting for allies...');
            this.turnText.setColor('#aaaaaa');
            this.endTurnBtn.setStyle({ backgroundColor: '#444444' });
        } else {
            this.turnText.setText('Enemy Turn');
            this.turnText.setColor('#ff4444');
            this.endTurnBtn.setStyle({ backgroundColor: '#444444' });
        }
    }

    checkAllTurnsEnded() {
        if (this.battleOver || this.enemyTurnRunning) return;

        const allPlayers = this.service.getAllPlayers();
        if (allPlayers.length === 0) return;

        const allDone = allPlayers.every(p => this.playersEndedTurn.has(p.id));

        if (allDone) {
            this.enemyTurnRunning = true;
            this.playersEndedTurn.clear();
            this.currentRound++;
            this.runEnemyTurn();
        }
    }

    startMyTurn() {
        this.isMyTurn = true;
        this.turnEnded = false;
        this.enemyTurnRunning = false;

        // Reset armor each turn, restore actions/mana
        this.gameState.armor = 0;
        this.gameState.actions = this.gameState.maxActions;
        this.gameState.mana = this.gameState.maxMana;

        // Tick player statuses (poison damage, frozen, cursed, etc.)
        const statusMessages = this.gameState.tickStatuses();
        statusMessages.forEach((msg, i) => {
            this.time.delayedCall(i * 400, () => this.showMessage(msg, '#ff66aa'));
        });

        // Tick buff durations
        this.gameState.tickBuffs();

        // Check if poison killed the player
        if (this.gameState.isDead()) {
            this.battleLost();
            return;
        }

        // Fire onTurnStart triggers for passive items
        this.gameState.runItemTriggers('onTurnStart', this);

        // Apply level-up passive: heal at start of turn
        const turnHeal = this.gameState.passives?.turnHeal || 0;
        if (turnHeal > 0) {
            this.gameState.playerHeal(turnHeal);
            this.showMessage(`Passive: +${turnHeal} HP`, '#44ff44');
        }

        // Summoned allies act
        const hpBeforeAllies = this.gameState.enemies.map(e => ({ health: e.health, isAlive: e.isAlive, armor: e.armor, statuses: { ...e.statuses } }));
        const allyMessages = this.gameState.tickAllies();
        allyMessages.forEach((msg, i) => {
            this.time.delayedCall(i * 300 + statusMessages.length * 400, () => this.showMessage(msg, '#66ffaa'));
        });

        // Broadcast ally damage to other players
        this.broadcastEnemyChanges(hpBeforeAllies);
        this.updateEnemyDisplay();
        this.checkBattleEnd();

        // Draw new hand
        this.gameState.drawHand(this);

        // Apply level-up passive: extra draw
        const extraDraw = this.gameState.passives?.extraDraw || 0;
        if (extraDraw > 0) this.gameState.drawCards(extraDraw, this);

        this.service.saveMyGameState(this.gameState);
        this.updateStatsUI();
        this.updateEnemyDisplay();
        this.updateHandDisplay();
        this.updateTurnUI();
        this.updateItemDisplay();
        this.updateAllyDisplay();
        this.updateSummonedAllies();
        this.updateStatusDisplay();
    }

    // ─── Enemy Turn ─────────────────────────────────────────

    runEnemyTurn() {
        this.isMyTurn = false;
        this.turnText.setText('Enemy Turn');
        this.turnText.setColor('#ff4444');

        const aliveEnemies = this.gameState.enemies.filter(e => e.isAlive);

        let delay = 0;
        aliveEnemies.forEach((enemy, i) => {
            this.time.delayedCall(delay, () => {
                enemy.takeTurn(this.gameState);
                this.updateStatsUI();
                this.updateEnemyDisplay();
                this.updateSummonedAllies();
                this.flashEnemy(i);
                enemy.decideIntent();
            });
            delay += 600;
        });

        // After all enemies act, start the next round
        this.time.delayedCall(delay + 400, () => {
            // Save to room state for reconnection
            this.service.setBattleEnemies(this.gameState.enemies);
            this.service.saveMyGameState(this.gameState);

            if (this.gameState.isDead()) {
                this.battleLost();
                return;
            }

            this.startMyTurn();
            this.showMessage('Your turn!', '#44ff44');
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
        if (this.battleOver) return;
        this.battleOver = true;
        this.service.setRoomState('battleEnemies', null);
        const { width, height } = this.scale;

        // Check if this was the final boss
        const isFinalBoss = this.gameState.enemies.some(e => e.isFinalBoss);

        const goldReward = isFinalBoss ? 0 : (this.isBossBattle ? 75 : 25);
        const victoryText = isFinalBoss ? 'NYXAROTH DEFEATED!' : (this.isBossBattle ? 'BOSS DEFEATED!' : 'VICTORY!');
        const victoryColor = isFinalBoss ? '#ff44ff' : (this.isBossBattle ? '#ffaa00' : '#44ff44');

        // Full heal after boss fights
        if (this.isBossBattle || isFinalBoss) {
            this.gameState.health = this.gameState.maxHealth;
        }

        this.add.text(width / 2, height / 2 - 50, victoryText, {
            fontSize: '48px', color: victoryColor, fontStyle: 'bold'
        }).setOrigin(0.5);

        if (goldReward > 0) {
            this.gameState.gainGold(goldReward);

            this.add.text(width / 2, height / 2 + 10, `+${goldReward} Gold`, {
                fontSize: '24px', color: '#ffcc44'
            }).setOrigin(0.5);
        }

        this.service.saveMyGameState(this.gameState);

        // Continue button
        const btnText = isFinalBoss ? 'To Victory!' : 'Continue';
        const continueBtn = this.add.text(width / 2, height / 2 + 70, btnText, {
            fontSize: '24px', backgroundColor: '#006400',
            padding: { x: 20, y: 10 }, color: '#fff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueBtn.on('pointerdown', () => {
            this.service.setRoomState('battleEnemies', null);
            this.service.setCurrentTurnPlayer(null);
            if (isFinalBoss) {
                this.service.broadcastSceneSwitch('VictoryScene');
            } else if (this.isBossBattle) {
                this.service.broadcastSceneSwitch('BossRewardScene');
            } else {
                this.service.broadcastSceneSwitch('CardRewardScene');
            }
        });

        this.updateTurnUI();
    }

    battleLost() {
        this.battleOver = true;
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2 - 30, 'DEFEATED', {
            fontSize: '48px', color: '#ff4444', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 30, 'Your soul fades into the darkness...', {
            fontSize: '18px', color: '#aa4444'
        }).setOrigin(0.5);

        const retryBtn = this.add.text(width / 2, height / 2 + 90, 'Game Over', {
            fontSize: '24px', backgroundColor: '#440000',
            padding: { x: 20, y: 10 }, color: '#fff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        retryBtn.on('pointerdown', () => {
            this.service.setRoomState('battleEnemies', null);
            this.service.setCurrentTurnPlayer(null);
            this.service.broadcastSceneSwitch('GameOverScene');
        });

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
