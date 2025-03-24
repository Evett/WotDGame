import Phaser from 'phaser';
import gameState from '../GameState';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
    }

    create() {
        this.add.text(400, 50, 'Choose Your Path', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        this.nodes = [
            { x: 200, y: 200, type: 'battle' },
            { x: 400, y: 250, type: 'event' },
            { x: 600, y: 200, type: 'altar' }
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