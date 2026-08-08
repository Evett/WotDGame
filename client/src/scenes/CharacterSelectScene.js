import BaseScene from './BaseScene';
import CharacterLibrary from '../data/CharacterLibrary';

// Color map for placeholder character sprites
const CHARACTER_COLORS = {
    Alaen: 0x7744aa,
    Hassan: 0x44aa77,
    Marcus: 0x4466ff,
    Mohef: 0xcc2222,
    Nephereta: 0xffcc00,
    Urusha: 0xcc6600
};

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
    this.previewSprite = null;
    this.previewName = null;
    this.previewStats = null;

    // Generate placeholder textures if not yet created
    this.generateCharacterTextures();

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

      // Hover shows character preview sprite
      button.on('pointerover', () => {
        this.showCharacterPreview(charKey, character);
      });

      button.on('pointerout', () => {
        this.hideCharacterPreview();
      });

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

  generateCharacterTextures() {
    Object.keys(CharacterLibrary).forEach(charKey => {
      const textureKey = `char_${charKey.toLowerCase()}`;
      if (this.textures.exists(textureKey)) return;

      const color = CHARACTER_COLORS[charKey] || 0x888888;
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });

      // Draw a simple character silhouette placeholder
      // Head
      graphics.fillStyle(color, 1);
      graphics.fillCircle(32, 16, 14);
      // Body
      graphics.fillRoundedRect(16, 30, 32, 44, 6);
      // Arms
      graphics.fillRoundedRect(6, 34, 12, 32, 4);
      graphics.fillRoundedRect(46, 34, 12, 32, 4);
      // Legs
      graphics.fillRoundedRect(18, 72, 12, 28, 4);
      graphics.fillRoundedRect(34, 72, 12, 28, 4);

      graphics.generateTexture(textureKey, 64, 100);
      graphics.destroy();
    });
  }

  showCharacterPreview(charKey, character) {
    this.hideCharacterPreview();

    const { width, height } = this.scale;
    const previewX = width - 150;
    const previewY = height / 2 - 40;
    const textureKey = `char_${charKey.toLowerCase()}`;

    this.previewSprite = this.add.image(previewX, previewY, textureKey)
      .setScale(2)
      .setOrigin(0.5);

    this.previewName = this.add.text(previewX, previewY - 120, character.name, {
      fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    const statsStr = `Class: ${character.characterClass}\nHP: ${character.health}\nActions: ${character.actions} | Mana: ${character.mana}`;
    this.previewStats = this.add.text(previewX, previewY + 120, statsStr, {
      fontSize: '14px', color: '#cccccc', align: 'center'
    }).setOrigin(0.5);
  }

  hideCharacterPreview() {
    if (this.previewSprite) { this.previewSprite.destroy(); this.previewSprite = null; }
    if (this.previewName) { this.previewName.destroy(); this.previewName = null; }
    if (this.previewStats) { this.previewStats.destroy(); this.previewStats = null; }
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

/*
todo:
When you have real sprites, put them here:
client/src/assets/characters/
    char_alaen.png
    char_hassan.png
    char_marcus.png
    char_mohef.png
    char_nephereta.png
    char_urusha.png
Then add a preload() method to load them instead of generating textures. In either scene, replace generateCharacterTexture/generateCharacterTextures with:
preload() {
    this.load.image('char_alaen', 'src/assets/characters/char_alaen.png');
    this.load.image('char_hassan', 'src/assets/characters/char_hassan.png');
    // ... etc for each character
}
The texture key format is char_<name lowercase> — as long as your loaded images use those keys, the existing code will display them automatically with no other changes needed.
*/