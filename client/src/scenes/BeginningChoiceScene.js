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
    this.voteTexts = {};
    this.lastVotesJSON = '';
    const { x, y } = this.getCenter();

    this.add.text(x, y - 200, 'Beginning Choice', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

    this.mapChoices = this.service.getChoices();

    let offsetY = y - 50;
    this.mapChoices.forEach((choice, index) => { 
      const btn = this.add.text(x, offsetY, choice, {
        fontSize: '24px', backgroundColor: '#333', padding: { x: 10, y: 5 }, color: '#fff'
      }).setOrigin(0.5).setInteractive();


      btn.on('pointerdown', () => {
        if (!this.choiceMade) {
          this.choiceMade = true;
          btn.setStyle({ backgroundColor: '#006400' });
          this.service.selectChoice(choice);
        }
      });

      const voteText = this.add.text(x + 160, y + (index - 1)* 50, '0', {
        fontSize: '20px',
        color: '#ffdd88'
      }).setOrigin(0.5);

      this.voteTexts[choice] = voteText;

      offsetY += 50;
    });

    this.currentSceneKey = this.service.getRoomState('scene');

    this.createSceneListener(this.service, this.currentSceneKey);
  }

  update() {
    const votes = this.service.getRoomState('votes') || {};
    const json = JSON.stringify(votes);

    if (json !== this.lastVotesJSON) {
      this.lastVotesJSON = json;
      this.updateVoteUI(votes);
    }
  }

  updateVoteUI(votes) {
    const counts = {};

    Object.values(votes).forEach(choice => {
      counts[choice] = (counts[choice] || 0) + 1;
    });

    Object.entries(this.voteTexts).forEach(([choice, text]) => {
      const count = counts[choice] || 0;
      text.setText(count.toString());
    });
  }
}