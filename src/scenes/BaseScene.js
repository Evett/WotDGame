import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    createBackground(color = 0x1d1d1d) {
        // Create and store the background rectangle
        this.background = this.add.rectangle(0, 0, this.scale.width, this.scale.height, color)
            .setOrigin(0)
            .setDepth(-100);

        this.scale.on('resize', this.onResize, this);
    }

    onResize(gameSize) {
        const { width, height } = gameSize;

        if (this.background) {
            this.background.setSize(width, height);
        }

        this.relayout?.(); // optional hook for child scenes
    }

    getCenter() {
        return {
            x: this.scale.width / 2,
            y: this.scale.height / 2
        };
    }

    getSafeArea(padding = 20) {
        return {
            left: padding,
            right: this.scale.width - padding,
            top: padding,
            bottom: this.scale.height - padding
        };
    }
}