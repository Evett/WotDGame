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
    SELECT: 'CharacterSelectScene',
    MAP: 'MapScene',
    BEGINNING: 'BeginningChoiceScene'
}

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

            if (!Playroom.getState('scene')) { this.setRoomState('scene', SCENES.MENU); }

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
        let currentScene = this.getRoomState('scene');
        this.setRoomState('scene', scene);
        const data = { current : currentScene,
            next : scene
        }
        Playroom.RPC.call(OUT_OF_COMBAT_EVENTS.SWITCH_SCENE, data, Playroom.RPC.Mode.ALL).catch((error) => {
            console.log(error);
        });
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

    selectCharacter(characterKey) {
        const player = Playroom.myPlayer();
        if (!player) return false;

        const takenChars = this.getRoomState('takenCharacters') || [];
        if (takenChars.includes(characterKey)) {
            console.warn(`${characterKey} is already taken.`);
            return false;
        }

        this.setPlayerState(player, 'character', characterKey);

        const updatedTaken = [...takenChars, characterKey];
        this.setRoomState('takenCharacters', updatedTaken);

        console.log(`${player.getProfile().name} selected ${characterKey}`);

        Playroom.RPC.call(
            OUT_OF_COMBAT_EVENTS.CHARACTER_LOCKED,
            { playerId: player.id, characterKey },
            Playroom.RPC.Mode.ALL
        );

        const allPlayers = [...this.playerStates.values()];
        const allSelected = allPlayers.length > 0 && allPlayers.every(p => p.state?.character);

        if (allSelected) {
            console.log(`✅ All players have selected their characters! Moving to next scene.`);

            const nextScene = SCENES.MAP;
            Playroom.RPC.call(
                OUT_OF_COMBAT_EVENTS.READY_UP,
                nextScene,
                Playroom.RPC.Mode.ALL
            );
        }

        return true;
    }

    handleCharacterLocked({ playerId, characterKey }) {
        const player = this.playerStates.get(playerId);
        if (player) this.setPlayerState(player, 'character', characterKey);

        const taken = new Set(Playroom.getState('takenCharacters') || []);
        taken.add(characterKey);
        this.setRoomState('takenCharacters', [...taken]);

        const allPlayers = [...this.playerStates.values()];
        const allLocked = allPlayers.every((p) => p.state?.character);

        if (allLocked) {
            console.log('All players have chosen their character!');
            this.setRoomState('scene', SCENES.MAP);
        }
    }

    getPlayerState(player, inState) {
        const value = this.playerStates.get(player.id).getState(inState);
        console.log(`Getting value ${value} from player state ${inState} for player ${player.getProfile().name}`);
        return value;
    }

    setPlayerState(player, inState, inValue) {
        this.playerStates.get(player.id).setState(inState, inValue);
        console.log(`Player ${player.getProfile().name} set state ${inState} to ${inValue}`);
    }

    getRoomState(inState) {
        const value = Playroom.getState(inState);
        console.log(`Getting value ${value} from room state ${inState}`);
        return value;
    }

    setRoomState(inState, inValue) {
        Playroom.setState(inState, inValue);
        console.log(`Room set state ${inState} to ${inValue}`);
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