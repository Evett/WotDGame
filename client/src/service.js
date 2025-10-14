import * as Phaser from 'phaser';
import * as Playroom from 'playroomkit';

const CUSTOM_PLAYROOM_EVENTS = {
  PLAYER_CONNECTED: 'PLAYER_CONNECTED',
  NEW_GAME_STARTED: 'NEW_GAME_STARTED',
  EXISTING_GAME: 'EXISTING_GAME',
};

export class Service {

    constructor() {
        const playerStates = {};
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
        Playroom.RPC.register(CUSTOM_PLAYROOM_EVENTS.PLAYER_CONNECTED, async PlayerConnectedData => {
            await this.handlePlayerConnectedEvent(PlayerConnectedData);
        });

        Playroom.onPlayerJoin(player => {
            this.handlePlayerJoined(player);
        });
    }

    async handlePlayerConnectedEvent(data) {
        
        
    }

    handlePlayerJoined(player) {
        let state = this.playerStates.get(player.Id);
        if (state) {
            return;
        }
        
        state = { playerId: player.id };
        this.playerStates.set(player.id, state);
        console.log("New PlayerState:", state);
    }
}