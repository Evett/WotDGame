import BaseScene from './BaseScene';
import MagicItemLibrary from '../data/MagicItemLibrary';

export class AltarScene extends BaseScene {
  constructor() {
    super({ key: 'AltarScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground(0x1a0a2e);
    this.createInventoryButton(this.service);
    this.choiceMade = false;
    this.gameState = this.service.getMyGameState();

    const { x, y } = this.getCenter();

    this.add.text(x, y - 250, 'The Altar', {
      fontSize: '36px', color: '#cc88ff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(x, y - 200, 'Choose your blessing...', {
      fontSize: '18px', color: '#aaa'
    }).setOrigin(0.5);

    // Option 1: Random Magic Item
    const itemBtn = this.add.text(x, y - 80, '✦ Receive a Magic Item', {
      fontSize: '22px', backgroundColor: '#2a0a4a',
      padding: { x: 20, y: 12 }, color: '#ffcc44'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    itemBtn.on('pointerover', () => itemBtn.setStyle({ backgroundColor: '#3a1a5a' }));
    itemBtn.on('pointerout', () => itemBtn.setStyle({ backgroundColor: '#2a0a4a' }));
    itemBtn.on('pointerdown', () => this.chooseItem());

    // Option 2: Remove a card
    const removeBtn = this.add.text(x, y + 0, '✂ Remove a Card', {
      fontSize: '22px', backgroundColor: '#2a0a4a',
      padding: { x: 20, y: 12 }, color: '#ff8888'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    removeBtn.on('pointerover', () => removeBtn.setStyle({ backgroundColor: '#3a1a5a' }));
    removeBtn.on('pointerout', () => removeBtn.setStyle({ backgroundColor: '#2a0a4a' }));
    removeBtn.on('pointerdown', () => this.showCardRemoval());

    this.itemBtn = itemBtn;
    this.removeBtn = removeBtn;

    // Waiting text (hidden initially)
    this.waitingText = this.add.text(x, y + 180, '', {
      fontSize: '16px', color: '#888'
    }).setOrigin(0.5);

    // Poll for all players done
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.checkAllDone()
    });

    this.createSceneListener(this.service);
  }

  // ─── Choose Item ──────────────────────────────────────────

  chooseItem() {
    if (this.choiceMade) return;
    this.choiceMade = true;

    const { x, y } = this.getCenter();

    // Hide buttons
    this.itemBtn.setVisible(false);
    this.removeBtn.setVisible(false);

    // Give a random magic item
    const item = MagicItemLibrary.getRandom();
    const added = this.gameState.addMagicItem(item);

    if (added) {
      this.add.text(x, y - 60, `Received: ${item.name}`, {
        fontSize: '22px', color: '#44ff44'
      }).setOrigin(0.5);
      this.add.text(x, y - 25, item.description, {
        fontSize: '14px', color: '#cccccc'
      }).setOrigin(0.5);
    } else {
      this.add.text(x, y - 60, `You already have: ${item.name}`, {
        fontSize: '18px', color: '#ffaa44'
      }).setOrigin(0.5);
    }

    this.service.saveMyGameState(this.gameState);
    this.markDone();
  }

  // ─── Card Removal ─────────────────────────────────────────

  showCardRemoval() {
    if (this.choiceMade) return;
    this.choiceMade = true;

    const { x, y } = this.getCenter();

    // Hide buttons
    this.itemBtn.setVisible(false);
    this.removeBtn.setVisible(false);

    const deck = this.gameState.fullDeck;
    if (deck.length === 0) {
      this.add.text(x, y - 60, 'No cards to remove!', {
        fontSize: '18px', color: '#ff4444'
      }).setOrigin(0.5);
      this.markDone();
      return;
    }

    this.add.text(x, y - 130, 'Click a card to remove it', {
      fontSize: '16px', color: '#ffcc44'
    }).setOrigin(0.5);

    // Display deck cards in a scrollable grid
    const cardWidth = 110;
    const cardHeight = 60;
    const cols = Math.min(deck.length, 5);
    const rows = Math.ceil(deck.length / cols);
    const startX = x - ((cols - 1) * (cardWidth + 8)) / 2;
    const startY = y - 80;

    deck.forEach((card, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const cx = startX + col * (cardWidth + 8);
      const cy = startY + row * (cardHeight + 8);

      const bg = this.add.rectangle(cx, cy, cardWidth, cardHeight, 0x2a2a4a)
        .setStrokeStyle(1, 0x666666)
        .setInteractive({ useHandCursor: true });

      const nameText = this.add.text(cx, cy - 10, card.name, {
        fontSize: '11px', color: '#fff', fontStyle: 'bold'
      }).setOrigin(0.5);

      const descText = this.add.text(cx, cy + 12, card.getDescription(), {
        fontSize: '9px', color: '#aaa',
        wordWrap: { width: cardWidth - 8 }, align: 'center'
      }).setOrigin(0.5);

      bg.on('pointerover', () => bg.setStrokeStyle(2, 0xff4444));
      bg.on('pointerout', () => bg.setStrokeStyle(1, 0x666666));

      bg.on('pointerdown', () => {
        this.removeCard(index, bg, nameText, descText);
      });
    });
  }

  removeCard(index, bg, nameText, descText) {
    const { x, y } = this.getCenter();
    const card = this.gameState.fullDeck[index];

    this.gameState.fullDeck.splice(index, 1);
    this.service.saveMyGameState(this.gameState);

    // Destroy card visuals (fade out)
    bg.disableInteractive();
    this.tweens.add({
      targets: [bg, nameText, descText],
      alpha: 0,
      duration: 300
    });

    this.add.text(x, y + 120, `Removed: ${card.name}`, {
      fontSize: '18px', color: '#ff6666'
    }).setOrigin(0.5);

    this.markDone();
  }

  // ─── Done / Sync ──────────────────────────────────────────

  markDone() {
    const player = this.service.getMyPlayer();
    const doneMap = this.service.getRoomState('altarDone') || {};
    doneMap[player.id] = true;
    this.service.setRoomState('altarDone', doneMap);
    this.waitingText.setText('Waiting for other players...');
  }

  checkAllDone() {
    if (this.transitioned) return;
    const players = this.service.getAllPlayers();
    if (players.length === 0) return;

    const doneMap = this.service.getRoomState('altarDone') || {};
    const allDone = players.every(p => doneMap[p.id] === true);

    if (allDone) {
      this.transitioned = true;
      this.service.setRoomState('altarDone', null);
      this.service.broadcastSceneSwitch('NarrativeScene');
    }
  }
}