import Phaser from 'phaser';
import gameState from '../GameState.js';
import characters from '../data/Character.js';
import SceneManager from '../SceneManager.js';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    create() {
        this.sceneManager = new SceneManager(this);
        this.add.text(300, 100, 'Choose Your Character', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        let yPos = 200;
        Object.keys(characters).forEach((charKey) => {
            const character = characters[charKey];

            let charButton = this.add.text(300, yPos, character.name, { fontSize: '24px', backgroundColor: '#0077ff' })
                .setOrigin(0.5)
                .setInteractive();

            charButton.on('pointerdown', () => {
                this.selectCharacter(charKey);
            });

            yPos += 50;
        });
    }

    selectCharacter(charKey) {
        gameState.setCharacter(characters[charKey]);
        console.log(`Selected character: ${gameState.character.name}`);
        this.sceneManager.switchScene('MapScene'); // Move to map
    }
}