export class StartingScene extends BaseScene {
  constructor() {
    super({ key: 'StartingScene' });
  }

  async create() {
    const { x, y } = this.getCenter();
    this.createBackground();

    this.add.text(x, y - 250, 'Wars of the Defeated', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);

    const player = await insertCoin({
      maxPlayers: 6,
      persistentMode: true,
      reconnectGracePeriod: 10
    });

    this.playerText = this.add.text(400, 200, "", { color: "#fff", fontSize: "20px" }).setOrigin(0.5);

    const refreshList = () => {
      const players = getPlayers();
      const names = players.map(p => {
        const ready = p.state.ready ? "✅" : "";
        return `${p.getProfile().name}${ready}`;
      }).join("\n");
      this.playerText.setText("Players:\n" + names);
    };

    onPlayerJoin((p) => {
      console.log("Player joined:", p.id, p.getProfile());
      refreshList();
    });
    onPlayerLeave((p) => {
      console.log("Player left:", p.id);
      refreshList();
    });

/*    onStateChange((state) => {
      refreshList();
      if (state.scene && state.scene !== "MenuScene") {
        this.scene.start(state.scene);
      }
    });*/

    const readyBtn = this.add.text(400, 400, "Ready", { backgroundColor: "#333", color: "#fff", padding: { x: 10, y: 5 } })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        player.setState("ready", !player.state.ready);
      });

    refreshList();
  }
}
