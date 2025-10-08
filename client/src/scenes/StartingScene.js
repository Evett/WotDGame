export class StartingScene extends BaseScene {
  constructor() {
    super({ key: 'StartingScene' });
  }

  create() {
    this.showScene();
  }

  showScene() {
    const { x, y } = this.getCenter();
    this.createBackground();

    this.add.text(x, y - 250, 'Wars of the Defeated', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);
    onPlayerJoin(playerState => this.addPlayer(playerState));
  }

   addPlayer(playerState) {
    console.log('Player joined');
    playerState.onQuit(() => {
      sprite.destroy();
      console.log('Player quit');
      this.players = this.players.filter(p => p.state !== playerState);
    });
  }
}
