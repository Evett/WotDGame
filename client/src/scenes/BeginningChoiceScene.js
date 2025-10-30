export class BeginningChoiceScene extends BaseScene {
  constructor() {
    super({ key: 'BeginningChoiceScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'Beginning Choice', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}