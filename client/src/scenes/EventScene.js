import BaseScene from './BaseScene';

export class EventScene extends BaseScene {
  constructor() {
    super({ key: 'EventScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'EventScene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}