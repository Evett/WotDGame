import * as Phaser from 'phaser';
import * as Playroom from 'playroomkit';

const OUT_OF_COMBAT_EVENTS = {
  PLAYER_CONNECTED: 'PLAYER_CONNECTED',
  NEW_GAME_STARTED: 'NEW_GAME_STARTED',
  EXISTING_GAME: 'EXISTING_GAME',
  READY_UP: 'READY_UP'
};

const SCENES = {
    MENU: 'StartingScene',
    SELECT: 'CharacterSelectScene'
}

export class Service {

    constructor() {
        this.playerStates = new Map();
        this.setScene(SCENES.MENU);
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
        });

        Playroom.RPC.register(OUT_OF_COMBAT_EVENTS.SWITCH_SCENE, async SwitchSceneData => {
            await this.switchScene(SwitchSceneData);
        });

        Playroom.onPlayerJoin(player => {
            this.handlePlayerJoined(player);
        });
    }

    async handlePlayerConnectedEvent(data) {
        console.log("Handling player connecting:", data);
    }

    async readyPlayerEvent(scene) {
        console.log(`All players are ready, starting game`);
        let currentScene = this.getScene();
        this.setScene(scene);
        const data = {current : currentScene,
            next : scene
        }
        Playroom.RPC.call(OUT_OF_COMBAT_EVENTS.SWITCH_SCENE, data, Playroom.RPC.Mode.ALL).catch((error) => {
            console.log(error);
        });
    }
    

    getScene() {
        console.log(`Getting scene ${Playroom.getState('scene')}`);
        return Playroom.getState('scene');
    }

    setScene(scene) {
        console.log(`Setting scene to ${scene}`);
        Playroom.setState('scene', scene);
    }

    switchScene(data) {
        console.log(`Switching from scene ${data.current} to ${data.next}`);
        data.current.scene.start(next);
    }

    handlePlayerJoined(player) {
        let state = this.playerStates.get(player.id);
        if (state) {
            return;
        }
        
        this.playerStates.set(player.id, player);
        console.log("New PlayerState:", player);
        console.log("All current players:", this.playerStates);
    }

    readyPlayer() {
        const player = Playroom.myPlayer();
        console.log(`Player ${player.getProfile().name} with id ${player.id} is ready`);
        this.playerStates.get(player.id).setState('ready', true);
        console.log("All current players:", this.playerStates);

        const allReady = [...this.playerStates.values()].length > 0 &&
                     [...this.playerStates.values()].every(p => p.state?.ready === true);
        if (allReady) {
            console.log(`All players are ready!`);
            const data = SCENES.SELECT;
            Playroom.RPC.call(OUT_OF_COMBAT_EVENTS.READY_UP, data, Playroom.RPC.Mode.ALL).catch((error) => {
                console.log(error);
            });
        }
    }

    choiceToScene(choice) {
        switch (choice) {
            case 'Battle': return 'BattleScene';
            case 'Event': return 'EventScene';
            case 'Rest': return 'RestSiteScene';
            case 'Shop': return 'ShopScene';
            case 'Reward': return 'CardRewardScene';
            case 'Altar': return 'AltarScene';
            case 'Deck': return 'DeckScene';
            default: return 'MapScene';
        }
    }
}