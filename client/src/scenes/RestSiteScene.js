import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import gameState from '../GameState';
import { playerId } from '../socket.js';

export class RestSiteScene extends BaseScene {
    constructor() {
        super({ key: 'RestSiteScene' });
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

        // Title
        this.add.text(x, y-200, 'RestSiteScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.createOption('Rest (+30% HP)', x, y-100, () => this.heal());
        this.createOption('Upgrade a Card', x, y, () => this.startUpgrade());
        this.createOption('Continue', x, y+100, () => this.sceneManager.switchScene('MapScene'));
        
    }

    createOption(label, x, y, callback) {
        const text = this.add.text(x, y, label, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        text.on('pointerdown', callback);
        text.on('pointerover', () => text.setColor('#ffff66'));
        text.on('pointerout', () => text.setColor('#ffffff'));
    }

    heal() {
        const missingHealth = gameState.maxHealth - gameState.health;
        const healAmount = Math.floor(missingHealth * 0.3);
        gameState.health = Math.min(gameState.maxHealth, gameState.health + healAmount);
        gameState.restoreDailyCards();
        this.socket.emit('update-game-state', { gameState });

        this.showMessage(`You heal for ${healAmount} HP.`, () => {
            this.sceneManager.switchScene('MapScene');
        });
    }

    startUpgrade() {
        this.sceneManager.switchScene('UpgradeScene');
    }

    showMessage(text, callback) {
        const box = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 300, 100, 0x000000, 0.8);
        const msg = this.add.text(this.scale.width / 2, this.scale.height / 2, text, {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 280 }
        }).setOrigin(0.5);
        this.time.delayedCall(2000, () => {
            box.destroy();
            msg.destroy();
            callback();
        });
    }
}