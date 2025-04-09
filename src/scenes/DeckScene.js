import BaseScene from './BaseScene';

export class DeckScene extends BaseScene {
    constructor() {
        super({ key: 'DeckScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();

        // Title
        this.add.text(x, y, 'DeckScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}