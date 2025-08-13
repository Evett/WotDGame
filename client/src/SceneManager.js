import gameState from './GameState';

class SceneManager {
    constructor(scene, socket, lobbyId) {
        this.scene = scene;
        this.socket = socket;
        this.lobbyId = lobbyId;
        this.socket.off('advance-scene');
        this.socket.on('advance-scene', (sceneName, payload = {}) => {
            console.log(`[SceneManager] Server approved scene change to ${sceneName}`, payload);

            // Merge persistent game data
            const { character, deck, playerStats, ...transient } = payload;
            if (character || deck || playerStats) {
                Object.assign(gameState, { character, deck, playerStats });
            }

            gameState.scene = sceneName;

            const nextSceneData = {
                ...payload,
                gameState,
                playerId: payload.playerId || gameState.playerId,
                lobbyId: this.lobbyId,
                socket: this.socket
            };

            this.scene.scene.start(sceneName, nextSceneData);
        });
    }

    setLobby(lobbyId) {
        this.lobbyId = lobbyId;
    }

    switchScene(targetScene, data = {}) {
        if (!this.lobbyId) {
            console.error('[SceneManager] Cannot switch scene without a lobbyId!');
            return;
        }

        console.log(`[SceneManager] Requesting scene change to ${targetScene}`, data);

        this.socket.emit('advance-scene', {
            lobbyId: this.lobbyId,
            scene: targetScene
        });

        // Store transient data so we can merge when server responds
        // This ensures non-persistent data like "players" or "playerId" gets passed
        this._pendingData = data;
    }
}

export default SceneManager;