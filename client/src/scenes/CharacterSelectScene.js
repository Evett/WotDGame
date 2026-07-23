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

    this.characterButtons = {};
    this.hasSelected = false;

    this.add.text(x, y - 200, 'Choose Your Character', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

    let yPos = y - 100;
    Object.keys(CharacterLibrary).forEach((charKey) => {
      const character = CharacterLibrary[charKey];

      const button = this.add.text(x - 60, yPos, character.name, {
        fontSize: '24px', backgroundColor: '#333', padding: { x: 10, y: 5 }, color: '#fff'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      const statusText = this.add.text(x + 100, yPos, '', {
        fontSize: '16px', color: '#888'
      }).setOrigin(0, 0.5);

      button.on('pointerdown', () => {
        if (this.hasSelected) return;
        if (this.service.selectCharacter(charKey)) {
          this.hasSelected = true;
          button.setStyle({ backgroundColor: '#006400' });
          this.disableAllButtons();
        }
      });

      this.characterButtons[charKey] = { button, statusText };
      yPos += 50;
    });

    // Poll to update taken status
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.updateTakenDisplay()
    });

    // Initial update
    this.updateTakenDisplay();

    this.createSceneListener(this.service);
  }

  updateTakenDisplay() {
    const takenChars = this.service.getRoomState('takenCharacters') || [];

    Object.entries(this.characterButtons).forEach(([charKey, { button, statusText }]) => {
      if (takenChars.includes(charKey)) {
        if (!this.hasSelected || button.style.backgroundColor !== '#006400') {
          button.setStyle({ backgroundColor: '#222', color: '#666' });
        }
        button.disableInteractive();
        statusText.setText('(taken)').setColor('#ff6666');
      }
    });
  }

  disableAllButtons() {
    Object.entries(this.characterButtons).forEach(([key, { button }]) => {
      button.disableInteractive();
    });
  }
}
