import Phaser from 'phaser';

export class EventScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EventScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(300, 300, 'background').setScale(1.2); // Adjust based on image size

        // Title
        this.add.text(300, 150, 'EventScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}