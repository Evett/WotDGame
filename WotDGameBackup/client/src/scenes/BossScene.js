import BaseScene from './BaseScene';
import { playerId } from '../socket.js';

export class BossScene extends BaseScene {
    constructor() {
        super({ key: 'BossScene' });
    }

    preload() {
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        // Title
        this.add.text(x, y, 'BossScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}