import BaseScene from './BaseScene';
import { Service } from '../service';

export class StartingScene extends BaseScene {
  constructor() {
    super({ key: 'StartingScene' });
    this.service = new Service();
  }

  async create() {
    const { x, y } = this.getCenter();
    this.createBackground();

    const connected = await this.service.connect();
    if (!connected) {
      console.log('failed to connect to service');
      return;
    }
    console.log('connected to service');

    this.service.phaserGame = this.game;

    // If the room is already past the lobby (e.g. we're reconnecting),
    // jump straight to whatever scene everyone else is on.
    const currentRoomScene = this.service.getCurrentRoomScene();
    if (currentRoomScene && currentRoomScene !== 'StartingScene') {
      console.log(`Reconnecting — jumping to ${currentRoomScene}`);
      // Wait for player state to sync before switching scenes
      await this.service.waitForPlayerStateSync();
      this.scene.start(currentRoomScene, { service: this.service });
      return;
    }

    this.add.text(x, y - 250, 'Wars of the Defeated', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);

    this.playerListText = this.add.text(x, y - 50, '', {
      fontSize: '18px', color: '#ccc', align: 'center', lineSpacing: 8
    }).setOrigin(0.5);

    this.readyButton = this.add.text(x, y + 300, 'Ready Up', {
      fontSize: '24px', backgroundColor: '#ff8800',
      padding: { x: 20, y: 10 }, color: '#fff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.readyButton.on('pointerdown', () => {
      this.service.readyPlayer();
      this.readyButton.setStyle({ backgroundColor: '#006400', color: '#fff' });
      this.readyButton.setText('✓ Ready!');
      this.readyButton.disableInteractive();
    });

    // Poll to show who's ready
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.updatePlayerList()
    });

    this.createSceneListener(this.service);
  }

  updatePlayerList() {
    const players = this.service.getAllPlayers();
    if (players.length === 0) return;

    const lines = players.map(p => {
      const name = p.getProfile().name || 'Player';
      const ready = p.getState('ready') ? '✓' : '…';
      const color = p.getState('ready') ? '🟢' : '⚪';
      return `${color} ${name} ${ready}`;
    });

    this.playerListText.setText(lines.join('\n'));
  }
}
