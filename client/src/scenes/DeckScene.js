import BaseScene from './BaseScene';

export class DeckScene extends BaseScene {
  constructor() {
    super({ key: 'DeckScene' });
  }

  create(data) {
    this.service = data.service;
    this.gameState = this.service.getMyGameState();

    const { width, height } = this.scale;

    // Semi-transparent backdrop
    this.backdrop = this.add.rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0).setInteractive();

    // Panel
    const panelW = Math.min(width - 60, 700);
    const panelH = Math.min(height - 60, 550);
    const px = width / 2;
    const py = height / 2;

    this.add.rectangle(px, py, panelW, panelH, 0x1a1a2e)
      .setStrokeStyle(2, 0x4444aa);

    // Close button
    const closeBtn = this.add.text(px + panelW / 2 - 15, py - panelH / 2 + 15, '✕', {
      fontSize: '24px', color: '#ff4444'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.scene.stop());

    // Title
    this.add.text(px, py - panelH / 2 + 30, 'Inventory', {
      fontSize: '28px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Stats section
    const statsX = px - panelW / 2 + 30;
    let statsY = py - panelH / 2 + 70;
    const gs = this.gameState;

    this.add.text(statsX, statsY, `♥ HP: ${gs.health}/${gs.maxHealth}`, { fontSize: '14px', color: '#ff6666' });
    statsY += 22;
    this.add.text(statsX, statsY, `✦ Mana: ${gs.mana}/${gs.maxMana}`, { fontSize: '14px', color: '#6699ff' });
    statsY += 22;
    this.add.text(statsX, statsY, `⚡ Actions: ${gs.actions}/${gs.maxActions}`, { fontSize: '14px', color: '#ffcc44' });
    statsY += 22;
    this.add.text(statsX, statsY, `🛡 Armor: ${gs.armor}`, { fontSize: '14px', color: '#aaaaaa' });
    statsY += 22;
    this.add.text(statsX, statsY, `💰 Gold: ${gs.gold}`, { fontSize: '14px', color: '#ffdd44' });
    statsY += 22;
    this.add.text(statsX, statsY, `Class: ${gs.characterClass || 'None'}`, { fontSize: '14px', color: '#cc88ff' });

    // Magic Items section
    const itemsX = px + 80;
    let itemsY = py - panelH / 2 + 70;
    this.add.text(itemsX, itemsY, 'Magic Items', { fontSize: '16px', color: '#ffaa44', fontStyle: 'bold' });
    itemsY += 28;

    if (gs.magicItems && gs.magicItems.length > 0) {
      gs.magicItems.forEach(item => {
        this.add.text(itemsX, itemsY, `• ${item.name}`, { fontSize: '13px', color: '#fff' });
        itemsY += 18;
        this.add.text(itemsX + 10, itemsY, item.description, { fontSize: '11px', color: '#999' });
        itemsY += 20;
      });
    } else {
      this.add.text(itemsX, itemsY, 'None', { fontSize: '13px', color: '#666' });
    }

    // Deck section
    const deckStartY = py - panelH / 2 + 210;
    this.add.text(px, deckStartY, `Deck (${gs.fullDeck.length} cards)`, {
      fontSize: '16px', color: '#44ff44', fontStyle: 'bold'
    }).setOrigin(0.5);

    const deck = gs.fullDeck;
    const cardW = 100;
    const cardH = 50;
    const cols = Math.min(Math.floor((panelW - 40) / (cardW + 8)), 6);
    const gridStartX = px - ((cols - 1) * (cardW + 8)) / 2;
    const gridStartY = deckStartY + 30;

    deck.forEach((card, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const cx = gridStartX + col * (cardW + 8);
      const cy = gridStartY + row * (cardH + 6);

      this.add.rectangle(cx, cy, cardW, cardH, 0x2a2a4a)
        .setStrokeStyle(1, this.getCardTypeColor(card.type));

      this.add.text(cx, cy - 8, card.name, {
        fontSize: '10px', color: '#fff', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(cx, cy + 10, `${card.actionCost}⚡ ${card.manaCost}✦`, {
        fontSize: '9px', color: '#aaa'
      }).setOrigin(0.5);
    });

    // Close on backdrop click
    this.backdrop.on('pointerdown', () => this.scene.stop());
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
}