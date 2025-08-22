import gameState from '../GameState.js';
import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import { playerId } from '../socket.js';

export class GameOverScene extends BaseScene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('background', 'assets/jooooooooel.png');
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        this.add.image(x, y, 'background').setScale(1.2);

        // Title
        this.add.text(x, y-100, 'LOL LOSER you really died while testing xD', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let restartButton = this.add.text(x, y, 'Try again', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MenuScene');
        });
    }
}