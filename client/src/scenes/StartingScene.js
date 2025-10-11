import BaseScene from './BaseScene';
import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";

export class StartingScene extends BaseScene {
  constructor() {
    super({ key: 'StartingScene' });
  }

  async create() {
    this.playerStates = new Map();
    const { x, y } = this.getCenter();
    this.createBackground();

    this.add.text(x, y - 250, 'Wars of the Defeated', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);

    try {
      await insertCoin({
        maxPlayers: 6,
        persistentMode: true,
        reconnectGracePeriod: 10
      });
    } catch (error) {
      console.error(error);
    }

    this.playerText = this.add.text(400, 200, "", { color: "#fff", fontSize: "20px" }).setOrigin(0.5);

    onPlayerJoin((p) => {
      let state = playerStates.get(p.Id);
      if (state) {
        return;
      }
      else {
        state = { playerId: p.id };
        playerSessions.set(p.id, state);
        console.log("New PlayerState:", state);
      }

    });
  }
}
