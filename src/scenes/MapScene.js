import Phaser from 'phaser';
import gameState from '../GameState';
import SceneManager from '../SceneManager';

export class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.add.text(300, 50, 'Choose Your Path', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        this.nodes = [
            { x: 100, y: 200, type: 'battle' },
            { x: 300, y: 250, type: 'event' },
            { x: 500, y: 200, type: 'altar' }
        ];

        this.nodes.forEach((node, index) => {
            let nodeGraphic = this.add.circle(node.x, node.y, 20, 0xffffff).setInteractive();

            nodeGraphic.on('pointerdown', () => {
                gameState.currentNode = node;
                this.sceneManager.switchScene(this.getSceneType(node.type));
            });
        });
    }

    getSceneType(type) {
        const sceneMap = {
            'battle' : 'BattleScene',
            'event' : 'EventScene',
            'altar' : 'AltarScene'
        };
        return sceneMap[type] || 'MapScene';
    }
}