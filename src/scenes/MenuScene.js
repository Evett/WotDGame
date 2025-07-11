import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';

export class MenuScene extends BaseScene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        // Title
        this.add.text(x, y-100, 'Wars of the Defeated', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Play Button
        const playButton = this.add.text(x, y, 'Play', {
            fontSize: '30px',
            color: '#ffffff',
            backgroundColor: '#0077ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#0055cc' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '#0077ff' });
        });

        playButton.on('pointerdown', () => {
            this.sceneManager.switchScene('CharacterSelectScene');
        });

        // Quit Button (for now, just logs to console)
        const quitButton = this.add.text(x, y+100, 'Quit', {
            fontSize: '30px',
            color: '#ffffff',
            backgroundColor: '#ff3333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        quitButton.on('pointerover', () => {
            quitButton.setStyle({ backgroundColor: '#cc0000' });
        });

        quitButton.on('pointerout', () => {
            quitButton.setStyle({ backgroundColor: '#ff3333' });
        });

        quitButton.on('pointerdown', () => {
            console.log('Why you tryna quit a browser game kek');
        });
    }
}