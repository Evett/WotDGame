import gameState from './GameState';

class SceneManager {
    constructor(scene) {
        this.scene = scene;
    }

    switchScene(targetScene, data = {}) {
        console.log(`Switching to ${targetScene} with data:`, data);

        Object.assign(gameState, data); 

        this.scene.scene.start(targetScene, { gameState });
    }
}

export default SceneManager;