import BaseScene from './BaseScene';

export class ShopScene extends BaseScene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'ShopScene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}