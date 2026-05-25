import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create() {
    }

    showScene() {
        console.log('BaseScene showScene does nothing');
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
        if (!this.scene || !this.scene.isActive() || !this.background || !this.background.setSize) {
            console.warn(`[onResize] Skipping resize: Scene inactive or background missing for ${this.scene?.key}`);
            return;
        }

        const { width, height } = gameSize;
        this.background.setSize(width, height);
        this.relayout?.();
    }

    getCenter() {
        return {
            x: this.scale.width / 2,
            y: this.scale.height / 2
        };
    }

    createSceneListener(inService) {
        this._sceneChangeHandler = (targetScene) => {
            if (targetScene !== this.scene.key) {
                console.log(`Scene change: ${this.scene.key} -> ${targetScene}`);
                // Close inventory overlay if open
                if (this.scene.isActive('DeckScene')) {
                    this.scene.stop('DeckScene');
                }
                this.scene.start(targetScene, { service: inService });
            }
        };
        inService.onSceneChange(this._sceneChangeHandler);

        this.events.once('shutdown', () => {
            inService.offSceneChange(this._sceneChangeHandler);
        });
        this.events.once('destroy', () => {
            inService.offSceneChange(this._sceneChangeHandler);
        });
    }

    createInventoryButton(service) {
        const { width } = this.scale;
        this.inventoryBtn = this.add.text(width - 20, 20, '🎒 Inventory', {
            fontSize: '16px', backgroundColor: '#333',
            padding: { x: 10, y: 6 }, color: '#fff'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true }).setDepth(900);

        this.inventoryBtn.on('pointerover', () => this.inventoryBtn.setStyle({ backgroundColor: '#555' }));
        this.inventoryBtn.on('pointerout', () => this.inventoryBtn.setStyle({ backgroundColor: '#333' }));
        this.inventoryBtn.on('pointerdown', () => {
            if (this.scene.isActive('DeckScene')) {
                this.scene.stop('DeckScene');
            } else {
                this.scene.launch('DeckScene', { service });
                this.scene.bringToTop('DeckScene');
            }
        });
    }
}