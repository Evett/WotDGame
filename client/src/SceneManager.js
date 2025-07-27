import gameState from './GameState';

class SceneManager {
    constructor(scene) {
        this.scene = scene;
    }

    switchScene(targetScene, data = {}) {
        console.log(`Switching to ${targetScene} with data:`, data);

        // Separate gameplay state from transient multiplayer/session data
        const { character, deck, playerStats, ...transient } = data;

        // Merge only long term game data into gameState
        if (character || deck || playerStats) {
            Object.assign(gameState, { character, deck, playerStats });
        }

        // Pass everything directly
        this.scene.scene.start(targetScene, { ...transient, gameState });
    }
}

export default SceneManager;