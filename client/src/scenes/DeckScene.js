import BaseScene from './BaseScene';

export class DeckScene extends BaseScene {
  constructor() {
    super({ key: 'DeckScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'DeckScene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}