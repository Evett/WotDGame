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

        this.time.delayedCall(0, () => {
            if (this.scene.isActive() && this.background && typeof this.background.setSize === 'function') {
                this.onResize(this.scale.gameSize);
            } else {
                console.warn(`[DelayedResize] Skipped resize: scene inactive or background not ready in ${this.scene.key}`);
            }
        });
        this.events.once('shutdown', this.cleanupResizeListener, this);
        this.events.once('destroy', this.cleanupResizeListener, this);  
    }

    cleanupResizeListener() {
        this.scale.off('resize', this.onResize, this);
    }

    onResize(gameSize) {
        const { width, height } = gameSize;

        if (!this.background || typeof this.background.setSize !== 'function') {
            console.warn(`[onResize] Skipped in ${this.scene.key} — background missing or not a Rectangle`);
            return;
        }
        
        this.background.setSize(width, height);
        this.relayout?.();
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