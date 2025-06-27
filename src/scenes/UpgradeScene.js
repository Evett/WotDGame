import BaseScene from './BaseScene.js';
import SceneManager from '../SceneManager';
import gameState from '../GameState';

export class UpgradeScene extends BaseScene {
    constructor() {
        super('UpgradeScene');
    }

    create() {
        const { x, y } = this.getCenter(this);

        this.sceneManager = new SceneManager(this);
        this.createBackground();
        this.add.text(x, 50, 'UpgradeScene', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

        this.add.text(x, y, 'Upgrade a Card', {
            fontSize: '24px',
            color: '#ccffcc'
        }).setOrigin(0.5);

        const upgradableCards = gameState.deck.filter(card => !card.upgraded);

        if (upgradableCards.length === 0) {
            this.add.text(x, y-100, 'No cards can be upgraded.', {
                fontSize: '18px',
                color: '#999'
            }).setOrigin(0.5);
            this.time.delayedCall(2000, () => this.scene.start('RestSiteScene'));
            return;
        }

        upgradableCards.forEach((card, index) => {
            const x = 150 + index * 160;
            const y = 250;

            const container = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 120, 150, 0x333333).setOrigin(0.5).setInteractive();
            const name = this.add.text(0, -50, card.name, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
            const desc = this.add.text(0, 0, card.description, { fontSize: '12px', color: '#ccc', wordWrap: { width: 100 } }).setOrigin(0.5);

            container.add([bg, name, desc]);

            bg.on('pointerdown', () => {
                card.upgraded = true;
                // You can also update card.effect or card.description here
                this.scene.start('RestSiteScene');
            });
        });
    }
}