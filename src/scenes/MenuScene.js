import Phaser from 'phaser';
import SceneManager from '../SceneManager';

const sizes={
    width:300,
    height:300
};

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.add.image(sizes.width, sizes.height, 'background').setScale(1.2); // Adjust based on image size

        // Title
        this.add.text(sizes.width, sizes.height/2, 'Wars of the Defeated', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Play Button
        const playButton = this.add.text(sizes.width, sizes.height, 'Play', {
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
        const quitButton = this.add.text(sizes.width, sizes.height+100, 'Quit', {
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