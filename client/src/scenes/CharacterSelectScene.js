import BaseScene from './BaseScene';
import CharacterLibrary from '../data/CharacterLibrary';

export class CharacterSelectScene extends BaseScene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.selectedCharacters = {};
    this.characterButtons = {};

    this.add.text(x, y - 200, 'Choose Your Character', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

    const takenChars = this.service.getRoomState('takenCharacters') || [];

    let yPos = y - 100;
    Object.keys(CharacterLibrary).forEach((charKey) => {
      const character = CharacterLibrary[charKey];

      const isTaken = takenChars.includes(key);
      const button = this.add.text(x, yPos, character.name, {
        fontSize: '24px', backgroundColor: '#333', padding: { x: 10, y: 5 }, color: '#fff'
      }).setOrigin(0.5).setInteractive();

      if (!isTaken) {
        button.on('pointerdown', () => {
          this.service.selectCharacter(key);
          button.setStyle({ backgroundColor: '#006400' });
          this.disableAllButtons();
        });
      }

      this.characterButtons.push({ key, button });
    });
  }

  disableAllButtons() {
    this.characterButtons.forEach(({ button }) => {
      button.disableInteractive();
    });
  }
}
