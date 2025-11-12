import * as Phaser from 'phaser';
import * as Playroom from 'playroomkit';
import GameState from './GameState';
import CharacterLibrary from './data/CharacterLibrary';

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
    BEGINNING: 'BeginningChoiceScene',
    EVENT: 'EventScene',
    REST: 'RestScene',
    SHOP: 'ShopScene',
    REWARD: 'CardRewardScene',
    ALTAR: 'AltarScene',
    DECK: 'DeckScene'
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
        console.log(`All players are ready, switching scenes`);
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
    }

    handlePlayerJoined(player) {
        let state = this.playerStates.get(player.id);
        if (state) {
            return;
        }

        this.initializePlayerGameState(player);
        
        this.playerStates.set(player.id, player);
        console.log("New PlayerState:", player);
        console.log("All current players:", this.playerStates);
    }

    initializePlayerGameState(player) {
        const newState = new GameState();
        const serializableState = JSON.parse(JSON.stringify(newState));
        this.setPlayerState(player, 'gameState', serializableState);
    }

    getPlayerGameState(player) {
        const raw = this.getPlayerState(player, 'gameState');
        if (!raw) return null;

        const restored = Object.assign(new GameState(), raw);
        return restored;
    }

    readyPlayer() {
        const player = Playroom.myPlayer();
        console.log(`Player ${player.getProfile().name} with id ${player.id} is ready`);
        this.playerStates.get(player.id).setState('ready', true);
        console.log("All current players:", this.playerStates);

        const allReady = [...this.playerStates.values()].length > 0 &&
                     [...this.playerStates.values()].every(p => p.state?.ready === true);
        if (allReady) {
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

        const gs = this.getPlayerGameState(player);
        gs.setCharacter(CharacterLibrary[characterKey]);
        this.setPlayerState(player, 'gameState', JSON.parse(JSON.stringify(gs)));

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

            const nextScene = SCENES.BEGINNING;
            Playroom.RPC.call(
                OUT_OF_COMBAT_EVENTS.READY_UP,
                nextScene,
                Playroom.RPC.Mode.ALL
            );
        }

        return true;
    }

    selectChoice(choice) {
        const player = Playroom.myPlayer();
        if (!player) return;

        const currentVotes = this.getRoomState('votes') || {};

        currentVotes[player.id] = choice;
        this.setRoomState('votes', currentVotes);

        console.log(`${player.getProfile().name} voted for ${choice}`);

        const votesSoFar = Object.values(currentVotes).length;
        const totalPlayers = [...this.playerStates.values()].length;

        if (votesSoFar < totalPlayers) {
            console.log(`Waiting for all players to vote (${votesSoFar}/${totalPlayers})...`);
            return;
        }

        const voteCount = {};
        Object.values(currentVotes).forEach(c => {
            voteCount[c] = (voteCount[c] || 0) + 1;
        });

        const maxVotes = Math.max(...Object.values(voteCount));
        const topChoices = Object.keys(voteCount).filter(c => voteCount[c] === maxVotes);

        let winningChoice;
        if (topChoices.length === 1) {
            winningChoice = topChoices[0];
            console.log(`✅ Winning choice by votes: ${winningChoice}`);
        } else {
            winningChoice = topChoices[Math.floor(Math.random() * topChoices.length)];
            console.log(`⚖️ Tie detected. Randomly selected ${winningChoice} among`, topChoices);
        }

        if (winningChoice) {
            const nextScene = this.choiceToScene(winningChoice);
            console.log(`🎯 Majority vote reached! ${winningChoice} → ${nextScene}`);

            this.setRoomState('votes', {});
            this.setRoomState('choices', null);

            Playroom.RPC.call(
                OUT_OF_COMBAT_EVENTS.READY_UP,
                nextScene,
                Playroom.RPC.Mode.ALL
            );
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

    getChoices() {
        if (!this.getRoomState('choices')) {
            const allOptions = ['Event', 'Rest', 'Shop', 'Reward', 'Altar', 'Deck'];
            const shuffled = shuffleArray(allOptions);
            const options = shuffled.slice(0, 3);
            this.setRoomState('choices', options);
        }
        return this.getRoomState('choices');
    }

    choiceToScene(choice) {
        switch (choice) {
            case 'Event': return SCENES.EVENT;
            case 'Rest': return SCENES.REST;
            case 'Shop': return SCENES.SHOP;
            case 'Reward': return SCENES.REWARD;
            case 'Altar': return SCENES.ALTAR;
            case 'Deck': return SCENES.DECK;
            default: return 'MapScene';
        }
    }
    
}

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}