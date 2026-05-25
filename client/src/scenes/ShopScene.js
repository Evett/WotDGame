import BaseScene from './BaseScene';
import CardLibrary from '../data/CardLibrary';

export class ShopScene extends BaseScene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground(0x1a0a1a);
    this.createInventoryButton(this.service);
    this.gameState = this.service.getMyGameState();

    const { x, y } = this.getCenter();

    this.add.text(x, y - 290, '🛒 Shop', {
      fontSize: '34px', color: '#ffdd44', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.goldText = this.add.text(x, y - 245, `Gold: ${this.gameState.gold}`, {
      fontSize: '18px', color: '#ffcc00'
    }).setOrigin(0.5);

    // Generate shop offerings
    this.generateShop();

    // Waiting / done text
    this.statusText = this.add.text(x, y + 260, '', {
      fontSize: '15px', color: '#888'
    }).setOrigin(0.5);

    // Done button
    this.doneBtn = this.add.text(x, y + 220, '✓ Done Shopping', {
      fontSize: '20px', backgroundColor: '#2a2a0a',
      padding: { x: 20, y: 10 }, color: '#88ff88'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.doneBtn.on('pointerover', () => this.doneBtn.setStyle({ backgroundColor: '#3a3a1a' }));
    this.doneBtn.on('pointerout', () => this.doneBtn.setStyle({ backgroundColor: '#2a2a0a' }));
    this.doneBtn.on('pointerdown', () => this.finishShopping());

    // Poll for all done
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.checkAllDone()
    });

    this.createSceneListener(this.service);
  }

  // ─── Generate Shop ────────────────────────────────────────

  generateShop() {
    const { x, y } = this.getCenter();
    const classCards = CardLibrary.getRandomCardsForClass(this.gameState.characterClass, 3);
    const commonCards = CardLibrary.getRandomCommonCards(2);
    const allCards = [...classCards, ...commonCards];

    this.shopItems = allCards.map(card => ({
      card,
      price: this.getCardPrice(card),
      sold: false
    }));

    this.cardDisplays = [];
    const cols = Math.min(this.shopItems.length, 5);
    const cardW = 140;
    const cardH = 160;
    const gap = 12;
    const totalW = cols * cardW + (cols - 1) * gap;
    const startX = x - totalW / 2 + cardW / 2;
    const startY = y - 80;

    this.shopItems.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const cx = startX + col * (cardW + gap);
      const cy = startY + row * (cardH + gap + 20);

      const display = this.createCardDisplay(cx, cy, cardW, cardH, item, index);
      this.cardDisplays.push(display);
    });
  }

  createCardDisplay(cx, cy, w, h, item, index) {
    const { card, price } = item;

    // Card type colors
    const typeColors = {
      Attack: 0x662222,
      Skill: 0x226622,
      Magic: 0x222266,
      Spell: 0x222266
    };
    const bgColor = typeColors[card.type] || 0x333333;

    const bg = this.add.rectangle(cx, cy, w, h, bgColor)
      .setStrokeStyle(2, 0x666666)
      .setInteractive({ useHandCursor: true });

    const nameText = this.add.text(cx, cy - 50, card.name, {
      fontSize: '13px', color: '#fff', fontStyle: 'bold',
      wordWrap: { width: w - 12 }, align: 'center'
    }).setOrigin(0.5);

    const typeText = this.add.text(cx, cy - 30, card.type || '', {
      fontSize: '10px', color: '#aaa'
    }).setOrigin(0.5);

    const descText = this.add.text(cx, cy + 5, card.getDescription(), {
      fontSize: '10px', color: '#ccc',
      wordWrap: { width: w - 14 }, align: 'center'
    }).setOrigin(0.5);

    // Cost line
    const costStr = [];
    if (card.actionCost > 0) costStr.push(`${card.actionCost}⚡`);
    if (card.manaCost > 0) costStr.push(`${card.manaCost}💧`);
    const costText = this.add.text(cx, cy + 45, costStr.join(' ') || 'Free', {
      fontSize: '11px', color: '#ffcc44'
    }).setOrigin(0.5);

    // Price tag
    const priceText = this.add.text(cx, cy + h / 2 + 14, `${price} gold`, {
      fontSize: '14px', color: '#ffdd00', fontStyle: 'bold'
    }).setOrigin(0.5);

    bg.on('pointerover', () => {
      if (!item.sold) bg.setStrokeStyle(2, 0xffcc44);
    });
    bg.on('pointerout', () => {
      if (!item.sold) bg.setStrokeStyle(2, 0x666666);
    });
    bg.on('pointerdown', () => this.buyCard(index));

    return { bg, nameText, typeText, descText, costText, priceText };
  }

  // ─── Buy Card ─────────────────────────────────────────────

  buyCard(index) {
    const item = this.shopItems[index];
    if (!item || item.sold) return;

    if (this.gameState.gold < item.price) {
      this.flashStatus('Not enough gold!', '#ff4444');
      return;
    }

    item.sold = true;
    this.gameState.gold -= item.price;
    this.gameState.addCard(item.card);
    this.service.saveMyGameState(this.gameState);

    // Update gold display
    this.goldText.setText(`Gold: ${this.gameState.gold}`);

    // Mark card as sold visually
    const display = this.cardDisplays[index];
    display.bg.setFillStyle(0x111111);
    display.bg.setStrokeStyle(2, 0x333333);
    display.bg.disableInteractive();
    display.nameText.setColor('#555');
    display.descText.setColor('#444');
    display.priceText.setText('SOLD');
    display.priceText.setColor('#44ff44');

    this.flashStatus(`Bought ${item.card.name}!`, '#44ff44');
  }

  flashStatus(msg, color) {
    this.statusText.setText(msg).setColor(color);
    this.time.delayedCall(1500, () => {
      if (this.statusText) this.statusText.setText('').setColor('#888');
    });
  }

  // ─── Pricing ──────────────────────────────────────────────

  getCardPrice(card) {
    // Base price by type
    let base;
    switch (card.type) {
      case 'Attack': base = 30; break;
      case 'Skill': base = 25; break;
      case 'Magic': case 'Spell': base = 35; break;
      default: base = 25;
    }

    // Adjust for costs
    base += (card.manaCost || 0) * 8;
    base += (card.actionCost || 0) * 5;

    // Daily cards cost more
    if (card.isOncePerDay) base += 15;

    // Add some randomness (+/- 20%)
    const variance = Math.floor(base * 0.2);
    base += Math.floor(Math.random() * variance * 2) - variance;

    return Math.max(10, base);
  }

  // ─── Done / Transition ────────────────────────────────────

  finishShopping() {
    if (this.isDone) return;
    this.isDone = true;

    this.doneBtn.setStyle({ backgroundColor: '#111', color: '#555' });
    this.doneBtn.disableInteractive();

    // Disable all remaining cards
    this.shopItems.forEach((item, i) => {
      if (!item.sold) {
        const display = this.cardDisplays[i];
        display.bg.disableInteractive();
      }
    });

    this.statusText.setText('Waiting for other players...').setColor('#888');
    this.markDone();
  }

  markDone() {
    const player = this.service.getMyPlayer();
    player.setState('shopDone', true);
  }

  checkAllDone() {
    const allPlayers = this.service.getAllPlayers();
    const allDone = allPlayers.length > 0 &&
      allPlayers.every(p => p.getState('shopDone') === true);

    if (allDone) {
      allPlayers.forEach(p => p.setState('shopDone', false));

      if (this.service.isHost()) {
        this.service.broadcastSceneSwitch('BeginningChoiceScene');
      }
    }
  }
}