import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';

export class AltarScene extends BaseScene {
    constructor() {
        super({ key: 'AltarScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();

        // Title
        this.add.text(x, y-100, 'AltarScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let returnToMapButton = this.add.text(x, y, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }
}