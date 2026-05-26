import BaseScene from './BaseScene';
import CardLibrary from '../data/CardLibrary';

export class CardRewardScene extends BaseScene {
  constructor() {
    super({ key: 'CardRewardScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground(0x0a1a0a);
    this.createInventoryButton(this.service);
    this.choiceMade = false;
    this.gameState = this.service.getMyGameState();

    const { x, y } = this.getCenter();

    this.add.text(x, y - 260, 'Card Reward', {
      fontSize: '36px', color: '#44ff44', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(x, y - 215, 'Choose a card to add to your deck', {
      fontSize: '16px', color: '#aaa'
    }).setOrigin(0.5);

    // Generate 3 random cards based on player's class
    const charClass = this.gameState.characterClass;
    let offerings = [];
    if (charClass && CardLibrary.cards[charClass]) {
      // 2 class cards + 1 common
      offerings = [
        ...CardLibrary.getRandomCardsForClass(charClass, 2),
        CardLibrary.getRandomCommonCard()
      ];
    } else {
      offerings = CardLibrary.getRandomCommonCards(3);
    }

    // Display cards
    const cardWidth = 160;
    const cardHeight = 220;
    const spacing = 30;
    const totalWidth = offerings.length * cardWidth + (offerings.length - 1) * spacing;
    const startX = x - totalWidth / 2 + cardWidth / 2;

    offerings.forEach((card, index) => {
      const cx = startX + index * (cardWidth + spacing);
      const cy = y - 20;

      const container = this.add.container(cx, cy);

      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x1a2a1a)
        .setStrokeStyle(2, this.getCardTypeColor(card.type))
        .setInteractive({ useHandCursor: true });

      const nameText = this.add.text(0, -80, card.name, {
        fontSize: '15px', color: '#fff', fontStyle: 'bold',
        wordWrap: { width: cardWidth - 16 }, align: 'center'
      }).setOrigin(0.5);

      const typeText = this.add.text(0, -55, card.type, {
        fontSize: '12px', color: this.getCardTypeColorHex(card.type)
      }).setOrigin(0.5);

      const costText = this.add.text(0, -35, `${card.actionCost}⚡ ${card.manaCost}✦`, {
        fontSize: '13px', color: '#ffcc44'
      }).setOrigin(0.5);

      const descText = this.add.text(0, 15, card.getDescription(), {
        fontSize: '12px', color: '#cccccc',
        wordWrap: { width: cardWidth - 20 }, align: 'center'
      }).setOrigin(0.5);

      const targetText = card.requiresTarget
        ? this.add.text(0, 70, '🎯 Requires Target', { fontSize: '10px', color: '#ff8800' }).setOrigin(0.5)
        : this.add.text(0, 70, '', { fontSize: '10px' }).setOrigin(0.5);

      container.add([bg, nameText, typeText, costText, descText, targetText]);

      // Hover
      bg.on('pointerover', () => {
        if (!this.choiceMade) {
          container.setScale(1.05);
          bg.setStrokeStyle(3, 0xffff00);
        }
      });
      bg.on('pointerout', () => {
        if (!this.choiceMade) {
          container.setScale(1);
          bg.setStrokeStyle(2, this.getCardTypeColor(card.type));
        }
      });

      // Click to pick
      bg.on('pointerdown', () => {
        if (this.choiceMade) return;
        this.pickCard(card, container, bg);
      });
    });

    // Skip button
    const skipBtn = this.add.text(x, y + 150, 'Skip', {
      fontSize: '20px', backgroundColor: '#333',
      padding: { x: 20, y: 8 }, color: '#aaa'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    skipBtn.on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#555' }));
    skipBtn.on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#333' }));
    skipBtn.on('pointerdown', () => {
      if (this.choiceMade) return;
      this.skipReward();
    });

    // Waiting text
    this.waitingText = this.add.text(x, y + 210, '', {
      fontSize: '16px', color: '#888'
    }).setOrigin(0.5);

    // Poll for all done
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.checkAllDone()
    });

    this.createSceneListener(this.service);
  }

  pickCard(card, container, bg) {
    this.choiceMade = true;
    const { x, y } = this.getCenter();

    this.gameState.addCard(card);
    this.service.saveMyGameState(this.gameState);

    bg.setStrokeStyle(3, 0x44ff44);
    container.setScale(1.1);

    this.add.text(x, y + 150, `Added ${card.name} to your deck!`, {
      fontSize: '18px', color: '#44ff44'
    }).setOrigin(0.5);

    this.markDone();
  }

  skipReward() {
    this.choiceMade = true;
    const { x, y } = this.getCenter();

    this.add.text(x, y + 150, 'Skipped card reward', {
      fontSize: '16px', color: '#888'
    }).setOrigin(0.5);

    this.markDone();
  }

  markDone() {
    const player = this.service.getMyPlayer();
    const doneMap = this.service.getRoomState('rewardDone') || {};
    doneMap[player.id] = true;
    this.service.setRoomState('rewardDone', doneMap);
    this.waitingText.setText('Waiting for other players...');
  }

  checkAllDone() {
    const players = this.service.getAllPlayers();
    if (players.length === 0) return;

    const doneMap = this.service.getRoomState('rewardDone') || {};
    const allDone = players.every(p => doneMap[p.id] === true);

    if (allDone) {
      this.service.setRoomState('rewardDone', null);
      this.service.broadcastSceneSwitch('BeginningChoiceScene');
    }
  }

  getCardTypeColor(type) {
    switch (type) {
      case 'Attack': return 0xff4444;
      case 'Skill': return 0x44aaff;
      case 'Spell': return 0xaa44ff;
      case 'Power': return 0xffaa00;
      default: return 0x888888;
    }
  }

  getCardTypeColorHex(type) {
    switch (type) {
      case 'Attack': return '#ff4444';
      case 'Skill': return '#44aaff';
      case 'Spell': return '#aa44ff';
      case 'Power': return '#ffaa00';
      default: return '#888888';
    }
  }
}