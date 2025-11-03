import BaseScene from './BaseScene';

export class AltarScene extends BaseScene {
  constructor() {
    super({ key: 'AltarScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'AltarScene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}