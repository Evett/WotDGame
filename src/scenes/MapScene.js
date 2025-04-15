import gameState from '../GameState';
import SceneManager from '../SceneManager';
import BaseScene from './BaseScene';

export class MapScene extends BaseScene {
    constructor() {
        super({ key: 'MapScene' });
    }

    create() {
        const { x, y } = this.getCenter(this);
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        this.add.text(x, y-250, 'Choose Your Path', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        this.nodes = [
            { x: x-400, y: y-50, type: 'reward' },
            { x: x-200, y: y, type: 'battle' },
            { x: x, y: y+50, type: 'event' },
            { x: x+200, y: y, type: 'altar' },
            { x: x+400, y: y-50, type: 'deck' },
            { x: x +600, y, type: 'restsite' }
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
            'reward' : 'CardRewardScene',
            'battle' : 'BattleScene',
            'event' : 'EventScene',
            'altar' : 'AltarScene',
            'deck' : 'DeckScene',
            'restsite' : 'RestSiteScene'
        };
        return sceneMap[type] || 'MapScene';
    }
}