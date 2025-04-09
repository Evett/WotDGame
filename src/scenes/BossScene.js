import BaseScene from './BaseScene';

export class BossScene extends BaseScene {
    constructor() {
        super({ key: 'BossScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();

        // Title
        this.add.text(x, y, 'BossScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}