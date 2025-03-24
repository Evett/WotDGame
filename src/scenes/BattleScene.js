import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(300, 300, 'background').setScale(1.2); // Adjust based on image size

        // Title
        this.add.text(300, 150, 'BattleScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}