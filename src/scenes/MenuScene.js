import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';

export class MenuScene extends BaseScene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();

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
            console.log('Quit game'); // Later, integrate actual game exit logic
        });
    }
}