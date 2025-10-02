import gameState from './GameState';

class SceneManager {
    constructor(scene, socket, lobbyId) {
        this.scene = scene;
        this.socket = socket;
        this.lobbyId = lobbyId;

        if (this.socket) {
            this.socket.on('scene-data', ({ scene: sceneKey, data }) => {
                console.log(`[SceneManager] Received scene-data from server for ${sceneKey}:`, data);

                // Merge into persistent gameState if relevant
                const { character, deck, playerStats } = data;
                if (character || deck || playerStats) {
                    Object.assign(gameState, { character, deck, playerStats });
                }
                gameState.scene = sceneKey;

                const nextSceneData = {
                    ...data,
                    gameState,
                    playerId: gameState.playerId,
                    lobbyId: data.lobbyId || this.lobbyId,
                    socket: this.socket,
                    players: data.players,
                    characters: data.characters || {}
                };

                // Start the scene using server payload
                this.scene.scene.start(sceneKey, nextSceneData);
            });
        }
    }

    setLobby(lobbyId) {
        this.lobbyId = lobbyId;
    }

    switchScene(targetScene, data = {}) {
        console.log(`Switching to ${targetScene} with data:`, data);

        // Ask server to advance scene for everyone
        if (this.socket && this.lobbyId) {
            this.socket.emit('advance-scene', {
                lobbyId: this.lobbyId,
                scene: targetScene
            });
        }
    }
}

export default SceneManager;