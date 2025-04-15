import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import gameState from '../GameState';

export class RestSiteScene extends BaseScene {
    constructor() {
        super({ key: 'RestSiteScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();

        // Title
        this.add.text(x, y-100, 'RestSiteScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        gameState.restoreDailyCards();

        let returnToMapButton = this.add.text(x, y, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }
}