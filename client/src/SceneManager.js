class SceneManager {
    constructor(service) {
        this.service = service;
    }

    switchScene(currentScene, targetScene) {
        console.log(`Switching to ${targetScene} with data:`, data);

        this.service.setScene(targetScene);
        nextSceneDate = {
            service: this.service
        };
        currentScene.scene.start(targetScene, nextSceneData);
    }
}

export default SceneManager;