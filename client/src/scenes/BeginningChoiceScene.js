import BaseScene from './BaseScene';

export class BeginningChoiceScene extends BaseScene {
  constructor() {
    super({ key: 'BeginningChoiceScene' });
  }

  create(data) {
    super.create();
    this.service = data.service;
    this.createBackground();
    this.choiceMade = false;
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'Beginning Choice', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

    this.mapChoices = this.service.getChoices();

    let offsetY = y - 50;
    this.mapChoices.forEach(choice => { 
      const btn = this.add.text(x, offsetY, choice, {
            fontSize: '24px', backgroundColor: '#333', padding: { x: 10, y: 5 }, color: '#fff'
        }).setOrigin(0.5).setInteractive();


      btn.on('pointerdown', () => {
        if (!this.choiceMade) {
          this.choiceMade = true;
          btn.setStyle({ backgroundColor: '#006400' });
          this.service.selectChoice();
        }
      });
      offsetY += 50;
    });

    this.currentSceneKey = this.service.getRoomState('scene');

    this.createSceneListener(this.service, this.currentSceneKey);
  }
}