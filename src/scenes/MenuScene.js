import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png'); // Replace with your own background
    }

    create() {
        this.add.image(400, 300, 'background').setScale(1.2); // Adjust based on your image size

        // Title
        this.add.text(400, 150, 'Deckbuilder Game', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Play Button
        const playButton = this.add.text(400, 300, 'Play', {
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
            this.scene.start('GameScene'); // Change this when your main game is ready
        });

        // Quit Button (for now, just logs to console)
        const quitButton = this.add.text(400, 400, 'Quit', {
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