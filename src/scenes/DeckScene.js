import Phaser from 'phaser';

export class DeckScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeckScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(400, 300, 'background').setScale(1.2); // Adjust based on image size

        // Title
        this.add.text(400, 150, 'DeckScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}