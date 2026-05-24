import * as Playroom from 'playroomkit';
import GameState from './GameState';
import GameStateRehydrator from './data/GameStateRehydrator';
import CharacterLibrary from './data/CharacterLibrary';
import EnemyLibrary from './data/EnemyLibrary';
import Enemy from './data/Enemy';

const EVENTS = {
  PLAYER_CONNECTED: 'PLAYER_CONNECTED',
  READY_UP: 'READY_UP',
  SWITCH_SCENE: 'SWITCH_SCENE',
  CHARACTER_LOCKED: 'CHARACTER_LOCKED',
  SYNC_GAME_STATE: 'SYNC_GAME_STATE',
  BATTLE_ACTION: 'BATTLE_ACTION',
  END_TURN: 'END_TURN',
};

const SCENES = {
    MENU: 'StartingScene',
    SELECT: 'CharacterSelectScene',
    BEGINNING: 'BeginningChoiceScene',
    BATTLE: 'BattleScene',
    EVENT: 'EventScene',
    REST: 'RestScene',
    SHOP: 'ShopScene',
    REWARD: 'CardRewardScene',
    ALTAR: 'AltarScene',
    DECK: 'DeckScene'
};

export { SCENES };

export class Service {

    constructor() {
        this.playerStates = new Map();
        this.phaserGame = null;        // set by StartingScene after connect
        this.sceneChangeCallbacks = []; // scenes register to be notified
    }

    // ─── Connection ─────────────────────────────────────────

    async connect() { 
        try {
            this.registerEventListeners();

            const avatars = [
                'assets/jooooooooel.png'
            ];

            await Playroom.insertCoin({
                maxPlayers: 6,
                persistentMode: true,
                reconnectGracePeriod: 1800,
                avatars: avatars
            });

            // Wait briefly for room state to sync after insertCoin
            await this.waitForRoomStateSync();

            if (!Playroom.getState('scene')) {
                this.setRoomState('scene', SCENES.MENU);
            }

            return true;
        }
        catch (error) {
            console.error('Failed to connect:', error);
            return false;
        }
    }

    // ─── Event Listeners ────────────────────────────────────

    registerEventListeners() {
        Playroom.RPC.register(EVENTS.PLAYER_CONNECTED, async data => {
            console.log("Player connected:", data);
        });

        Playroom.RPC.register(EVENTS.SWITCH_SCENE, async data => {
            this.handleSceneSwitch(data);
        });

        Playroom.RPC.register(EVENTS.CHARACTER_LOCKED, async data => {
            console.log(`Character ${data.characterKey} locked by player ${data.playerId}`);
        });

        Playroom.RPC.register(EVENTS.SYNC_GAME_STATE, async data => {
            this.handleGameStateSync(data);
        });

        Playroom.RPC.register(EVENTS.END_TURN, async data => {
            this.handleEndTurn(data);
        });

        Playroom.onPlayerJoin(player => {
            this.handlePlayerJoined(player);
        });
    }

    // ─── Scene Management ───────────────────────────────────

    onSceneChange(callback) {
        this.sceneChangeCallbacks.push(callback);
    }

    offSceneChange(callback) {
        this.sceneChangeCallbacks = this.sceneChangeCallbacks.filter(cb => cb !== callback);
    }

    handleSceneSwitch(data) {
        const targetScene = data.scene;
        console.log(`RPC scene switch received: -> ${targetScene}`);
        this.setRoomState('scene', targetScene);
        this.sceneChangeCallbacks.forEach(cb => cb(targetScene));
    }

    broadcastSceneSwitch(targetScene) {
        Playroom.RPC.call(
            EVENTS.SWITCH_SCENE,
            { scene: targetScene },
            Playroom.RPC.Mode.ALL
        ).catch(err => console.error('Scene switch RPC failed:', err));
    }

    // ─── Player Join / State ────────────────────────────────

    handlePlayerJoined(player) {
        if (this.playerStates.has(player.id)) return;

        this.playerStates.set(player.id, player);

        // Only create a fresh GameState if the player doesn't already have one
        // (PlayroomKit persists player state across reconnects)
        const existing = player.getState('gameState');
        if (existing) {
            console.log(`Player reconnected with existing state: ${player.getProfile().name} (${player.id})`);
        } else {
            this.initializePlayerGameState(player);
            console.log(`Player joined fresh: ${player.getProfile().name} (${player.id})`);
        }
    }

    initializePlayerGameState(player) {
        const newState = new GameState();
        this.savePlayerGameState(player, newState);
    }

    /**
     * Returns the room's current scene key.
     * Used after connect to determine if we should skip the lobby.
     */
    getCurrentRoomScene() {
        return this.getRoomState('scene') || SCENES.MENU;
    }

    /**
     * Wait for room state to be available after insertCoin.
     * PlayroomKit may need a moment to sync state from the server.
     */
    waitForRoomStateSync() {
        return new Promise(resolve => {
            // If state is already available, resolve immediately
            if (Playroom.getState('scene')) {
                resolve();
                return;
            }
            // Poll briefly for state to arrive (max 2 seconds)
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (Playroom.getState('scene') || attempts >= 20) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    savePlayerGameState(player, gameState) {
        const serialized = GameStateRehydrator.serialize(gameState);
        player.setState('gameState', serialized);
    }

    getPlayerGameState(player) {
        const raw = player.getState('gameState');
        if (!raw) return null;

        const rehydrated = GameStateRehydrator.rehydrate(raw);
        const gs = new GameState();
        Object.assign(gs, rehydrated);
        return gs;
    }

    getMyPlayer() {
        return Playroom.myPlayer();
    }

    isHost() {
        return Playroom.isHost();
    }

    getMyGameState() {
        const player = this.getMyPlayer();
        if (!player) return null;
        return this.getPlayerGameState(player);
    }

    saveMyGameState(gameState) {
        const player = this.getMyPlayer();
        if (!player) return;
        this.savePlayerGameState(player, gameState);
    }

    getAllPlayers() {
        return [...this.playerStates.values()];
    }

    getAllPlayerGameStates() {
        const states = [];
        for (const player of this.playerStates.values()) {
            const gs = this.getPlayerGameState(player);
            if (gs) {
                states.push({ player, gameState: gs });
            }
        }
        return states;
    }

    // Broadcast my game state to all players (for co-op visibility)
    syncMyGameState() {
        const player = this.getMyPlayer();
        const gs = this.getMyGameState();
        if (!player || !gs) return;

        Playroom.RPC.call(
            EVENTS.SYNC_GAME_STATE,
            {
                playerId: player.id,
                gameState: GameStateRehydrator.serialize(gs)
            },
            Playroom.RPC.Mode.OTHERS
        ).catch(err => console.error('Game state sync failed:', err));
    }

    handleGameStateSync(data) {
        // Another player's state was updated — store it locally
        const player = this.playerStates.get(data.playerId);
        if (player) {
            player.setState('gameState', data.gameState);
            console.log(`Synced game state from player ${data.playerId}`);
        }
    }

    // ─── Ready Up ───────────────────────────────────────────

    readyPlayer() {
        const player = this.getMyPlayer();
        if (!player) return;

        console.log(`Player ${player.getProfile().name} is ready`);
        player.setState('ready', true);

        this.checkAllReady(SCENES.SELECT);
    }

    checkAllReady(nextScene) {
        const allPlayers = this.getAllPlayers();
        const allReady = allPlayers.length > 0 &&
            allPlayers.every(p => p.getState('ready') === true);

        if (allReady) {
            console.log('All players ready! Switching to:', nextScene);
            // Reset ready state for next time
            allPlayers.forEach(p => p.setState('ready', false));
            this.broadcastSceneSwitch(nextScene);
        }
    }

    // ─── Character Select ───────────────────────────────────

    selectCharacter(characterKey) {
        const player = this.getMyPlayer();
        if (!player) return false;

        const takenChars = this.getRoomState('takenCharacters') || [];
        if (takenChars.includes(characterKey)) {
            console.warn(`${characterKey} is already taken.`);
            return false;
        }

        // Set character on local game state
        const gs = this.getMyGameState();
        gs.setCharacter(CharacterLibrary[characterKey]);
        this.saveMyGameState(gs);

        // Mark character as taken in room state
        const updatedTaken = [...takenChars, characterKey];
        this.setRoomState('takenCharacters', updatedTaken);

        console.log(`${player.getProfile().name} selected ${characterKey}`);

        // Notify other players
        Playroom.RPC.call(
            EVENTS.CHARACTER_LOCKED,
            { playerId: player.id, characterKey },
            Playroom.RPC.Mode.ALL
        ).catch(err => console.error('Character lock RPC failed:', err));

        // Check if all players have selected
        this.checkAllCharactersSelected();

        return true;
    }

    checkAllCharactersSelected() {
        const allPlayers = this.getAllPlayers();
        const allSelected = allPlayers.length > 0 &&
            allPlayers.every(p => {
                const gs = p.getState('gameState');
                return gs && gs.character;
            });

        if (allSelected) {
            console.log('All players have selected characters! Moving to next scene.');
            this.broadcastSceneSwitch(SCENES.BEGINNING);
        }
    }

    // ─── Voting / Choices ───────────────────────────────────

    selectChoice(choice) {
        const player = this.getMyPlayer();
        if (!player) return;

        const currentVotes = this.getRoomState('votes') || {};
        currentVotes[player.id] = choice;
        this.setRoomState('votes', currentVotes);

        console.log(`${player.getProfile().name} voted for ${choice}`);

        const votesSoFar = Object.values(currentVotes).length;
        const totalPlayers = this.getAllPlayers().length;

        if (votesSoFar < totalPlayers) {
            console.log(`Waiting for votes (${votesSoFar}/${totalPlayers})...`);
            return;
        }

        // Tally votes
        const voteCount = {};
        Object.values(currentVotes).forEach(c => {
            voteCount[c] = (voteCount[c] || 0) + 1;
        });

        const maxVotes = Math.max(...Object.values(voteCount));
        const topChoices = Object.keys(voteCount).filter(c => voteCount[c] === maxVotes);

        let winningChoice;
        if (topChoices.length === 1) {
            winningChoice = topChoices[0];
        } else {
            winningChoice = topChoices[Math.floor(Math.random() * topChoices.length)];
            console.log(`Tie broken randomly: ${winningChoice}`);
        }

        const nextScene = this.choiceToScene(winningChoice);
        console.log(`Vote result: ${winningChoice} -> ${nextScene}`);

        this.setRoomState('votes', {});
        this.setRoomState('choices', null);

        this.broadcastSceneSwitch(nextScene);
    }

    getChoices() {
        const validOptions = ['Battle', 'Event', 'Rest', 'Shop', 'Reward', 'Altar'];
        let choices = this.getRoomState('choices');

        // Validate stored choices aren't stale (e.g. from a previous version)
        if (choices && choices.every(c => validOptions.includes(c))) return choices;

        // Only the host generates choices to avoid race conditions
        if (Playroom.isHost()) {
            const shuffled = shuffleArray(validOptions);
            const options = shuffled.slice(0, 3);
            this.setRoomState('choices', options);
            return options;
        }

        // Non-host: return whatever is in room state (may be null briefly)
        return this.getRoomState('choices');
    }

    choiceToScene(choice) {
        switch (choice) {
            case 'Battle': return SCENES.BATTLE;
            case 'Event': return SCENES.EVENT;
            case 'Rest': return SCENES.REST;
            case 'Shop': return SCENES.SHOP;
            case 'Reward': return SCENES.REWARD;
            case 'Altar': return SCENES.ALTAR;
            default: return SCENES.BEGINNING;
        }
    }

    // ─── Battle State (Shared) ──────────────────────────────

    setBattleEnemies(enemies) {
        const serialized = enemies.map(e => e.serialize());
        this.setRoomState('battleEnemies', serialized);
    }

    getBattleEnemies() {
        const raw = this.getRoomState('battleEnemies');
        if (!raw) return [];
        return raw.map(e => Enemy.rehydrate(e));
    }

    setCurrentTurnPlayer(playerId) {
        this.setRoomState('currentTurnPlayer', playerId);
    }

    getCurrentTurnPlayer() {
        return this.getRoomState('currentTurnPlayer');
    }

    isMyTurn() {
        const player = this.getMyPlayer();
        return player && this.getCurrentTurnPlayer() === player.id;
    }

    endMyTurn() {
        const player = this.getMyPlayer();
        if (!player) return;

        // Save current state
        this.syncMyGameState();

        // Determine next player
        const players = this.getAllPlayers();
        const myIndex = players.findIndex(p => p.id === player.id);
        const nextIndex = (myIndex + 1) % players.length;

        if (nextIndex === 0) {
            // All players have taken their turn — enemy turn
            Playroom.RPC.call(
                EVENTS.END_TURN,
                { type: 'enemy_turn' },
                Playroom.RPC.Mode.ALL
            ).catch(err => console.error('End turn RPC failed:', err));
        } else {
            // Next player's turn
            const nextPlayer = players[nextIndex];
            this.setCurrentTurnPlayer(nextPlayer.id);
            Playroom.RPC.call(
                EVENTS.END_TURN,
                { type: 'next_player', playerId: nextPlayer.id },
                Playroom.RPC.Mode.ALL
            ).catch(err => console.error('End turn RPC failed:', err));
        }
    }

    handleEndTurn(data) {
        console.log('End turn event:', data);
        // Scenes listen for this via onEndTurn callbacks
        this.endTurnCallbacks.forEach(cb => cb(data));
    }

    onEndTurn(callback) {
        if (!this.endTurnCallbacks) this.endTurnCallbacks = [];
        this.endTurnCallbacks.push(callback);
    }

    offEndTurn(callback) {
        if (!this.endTurnCallbacks) return;
        this.endTurnCallbacks = this.endTurnCallbacks.filter(cb => cb !== callback);
    }

    // ─── Room State Helpers ─────────────────────────────────

    getPlayerState(player, inState) {
        return player.getState(inState);
    }

    setPlayerState(player, inState, inValue) {
        player.setState(inState, inValue);
    }

    getRoomState(inState) {
        return Playroom.getState(inState);
    }

    setRoomState(inState, inValue) {
        Playroom.setState(inState, inValue);
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