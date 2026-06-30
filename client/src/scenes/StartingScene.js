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

    this.playerText = this.add.text(400, 200, "", { color: "#fff", fontSize: "20px" }).setOrigin(0.5);

    const readyButton = this.add.text(x, y + 300, 'Not Ready', { fontSize: '24px', backgroundColor: '#ff8800', padding: { x: 20, y: 10 }, color: '#fff' })
      .setOrigin(0.5).setInteractive();

    readyButton.on('pointerdown', () => {
      this.service.readyPlayer();
    });

    this.createSceneListener(this.service);
  }
}
