import Phaser from 'phaser';
import gameState from '../GameState';

export class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
    }

    create() {
        this.add.text(300, 50, 'Choose Your Path', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        this.nodes = [
            { x: 100, y: 200, type: 'battle' },
            { x: 300, y: 250, type: 'event' },
            { x: 500, y: 200, type: 'altar' }
        ];

        this.nodes.forEach((node, index) => {
            let nodeGraphic = this.add.circle(node.x, node.y, 20, 0xffffff).setInteractive();

            nodeGraphic.on('pointerdown', () => {
                this.handleNodeSelection(node);
            });
        });
    }

    handleNodeSelection(node) {
        gameState.currentNode = node;

        switch (node.type) {
            case 'battle':
                this.scene.start('BattleScene');
                break;
            case 'event':
                this.scene.start('EventScene');
                break;
            case 'altar':
                this.scene.start('AltarScene');
                break;
        }
    }
}