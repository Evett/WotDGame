import BaseScene from './BaseScene';

export class CardRewardScene extends BaseScene {
  constructor() {
    super({ key: 'CardRewardScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'CardRewardScene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}