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

        // Title
        this.add.text(300, 150, 'BattleScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let abilityButton = this.add.text(300, 300, 'Use Hero Ability', { fontSize: '24px', backgroundColor: '#ff5500' })
            .setOrigin(0.5)
            .setInteractive();

        abilityButton.on('pointerdown', () => {
            gameState.character.heroAbility(gameState);
        });

        this.time.delayedCall(10000, () => {
            this.sceneManager.switchScene('MapScene');
        });
    }
}