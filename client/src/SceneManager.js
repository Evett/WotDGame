import gameState from './GameState';

class SceneManager {
    constructor(scene, socket, lobbyId) {
        this.scene = scene;
        this.socket = socket;
        this.lobbyId = lobbyId;
    }

    setLobby(lobbyId) {
        this.lobbyId = lobbyId;
    }

    switchScene(targetScene, data = {}) {
        console.log(`Switching to ${targetScene} with data:`, data);

        if (this.socket && this.lobbyId) {
            this.socket.emit('advance-scene', {
                lobbyId: this.lobbyId,
                scene: targetScene
            });
        }

        // Separate gameplay state from transient multiplayer/session data
        const { character, deck, playerStats, ...transient } = data;

        // Merge only long term game data into gameState
        if (character || deck || playerStats) {
            Object.assign(gameState, { character, deck, playerStats });
        }

        gameState.scene = targetScene;

        const nextSceneData = {
            ...data,
            gameState,
            playerId: data.playerId || gameState.playerId,
            lobbyId: this.lobbyId,
            socket: this.socket
        };

        // Pass everything directly
        this.scene.scene.start(targetScene, nextSceneData);
    }
}

export default SceneManager;