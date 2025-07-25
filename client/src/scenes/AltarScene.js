import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';
import MagicItemLibrary from '../data/MagicItemLibrary';
import MagicItemRenderer from '../renderers/MagicItemRenderer';
import gameState from '../GameState';

export class AltarScene extends BaseScene {
    constructor() {
        super({ key: 'AltarScene' });
    }

    preload() {
        
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();

        // Title
        this.add.text(x, y-100, 'AltarScene', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const sampleItems = MagicItemLibrary.getRandomMagicItems(2);

        sampleItems.forEach((item, index) => {
            const xPos = 100 + (index % 9) * 180;
            const yPos = 150 + Math.floor(index / 9) * 220;
            new MagicItemRenderer(this, xPos, yPos, item, (selectedItem) => {
                const itemIndex = sampleItems.indexOf(selectedItem);
                if (itemIndex !== -1) {
                    gameState.addMagicItem(sampleItems[itemIndex]);
                }
                // Maybe purchase or preview logic here
            });
        });

        let returnToMapButton = this.add.text(x, y, 'Return to Map', { fontSize: '24px', backgroundColor: '' })
            .setOrigin(0.5)
            .setInteractive();

        returnToMapButton.on('pointerdown', () => {
            this.sceneManager.switchScene('MapScene');
        });
    }
}