import gameState from '../GameState.js';
import CharacterLibrary from '../data/CharacterLibrary.js';
import SceneManager from '../SceneManager.js';
import BaseScene from './BaseScene.js';

export class CharacterSelectScene extends BaseScene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.createBackground();
        const { x, y } = this.getCenter();
        this.add.text(x, y-200, 'Choose Your Character', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        let yPos = y-100;
        Object.keys(CharacterLibrary).forEach((charKey) => {
            const character = CharacterLibrary[charKey];

            let charButton = this.add.text(x, yPos, character.name, { fontSize: '24px', backgroundColor: '' })
                .setOrigin(0.5)
                .setInteractive();

            charButton.on('pointerdown', () => {
                this.selectCharacter(charKey);
            });

            yPos += 50;
        });
    }

    selectCharacter(charKey) {
        gameState.setCharacter(CharacterLibrary[charKey]);
        console.log(`Selected character: ${gameState.character.name}`);
        this.sceneManager.switchScene('MapScene'); // Move to map
    }
}