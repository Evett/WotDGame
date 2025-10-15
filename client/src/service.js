import * as Phaser from 'phaser';
import * as Playroom from 'playroomkit';

const OUT_OF_COMBAT_EVENTS = {
  PLAYER_CONNECTED: 'PLAYER_CONNECTED',
  NEW_GAME_STARTED: 'NEW_GAME_STARTED',
  EXISTING_GAME: 'EXISTING_GAME',
  READY_UP: 'READY_UP'
};

export class Service {

    constructor() {
        this.playerStates = new Map();
    }

    async connect() { 
        try {
            this.registerEventListeners();

            const avatars = [
                'assets/jooooooooel.png'
            ];

            Playroom.insertCoin({
                maxPlayers: 6,
                persistentMode: true,
                reconnectGracePeriod: 10,
                avatars: avatars
            });

            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    registerEventListeners() {
        Playroom.RPC.register(OUT_OF_COMBAT_EVENTS.PLAYER_CONNECTED, async PlayerConnectedData => {
            await this.handlePlayerConnectedEvent(PlayerConnectedData);
        });

        Playroom.RPC.register(OUT_OF_COMBAT_EVENTS.READY_UP, async ReadyData => {
            await this.readyPlayerEvent(ReadyData);
        })

        Playroom.onPlayerJoin(player => {
            this.handlePlayerJoined(player);
        });
    }

    async handlePlayerConnectedEvent(data) {
        console.log("Handling player connecting:", data);
    }

    async readyPlayerEvent(data) {
        console.log(`Player ${data.playerId} is ready`);
    }

    handlePlayerJoined(player) {
        let state = this.playerStates.get(player.id);
        if (state) {
            return;
        }
        
        state = { playerId: player.id };
        this.playerStates.set(player.id, state);
        console.log("New PlayerState:", state);
    }

    readyPlayer() {
        console.log(`Player ${Playroom.me().name} is ready`);
        this.playerStates.get(Playroom.me().id).isReady = true;

        const allReady = this.playerStates.length > 0 && this.playerStates.every(p => p.isReady);
        if (allReady) {
            console.log(`All players are ready!`);
        }
    }
}