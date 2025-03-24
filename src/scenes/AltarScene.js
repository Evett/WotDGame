import Phaser from 'phaser';
import SceneManager from '../SceneManager';

export class AltarScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AltarScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.add.image(300, 300, 'background').setScale(1.2); // Adjust based on image size

        // Title
        this.add.text(300, 150, 'AltarScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            this.sceneManager.switchScene('MapScene');
        });
    }
}