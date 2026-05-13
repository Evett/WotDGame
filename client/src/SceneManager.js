class SceneManager {
    constructor(service) {
        this.service = service;
    }

    switchScene(currentScene, targetScene) {
        console.log(`Switching to ${targetScene}`);

        this.service.setRoomState('scene', targetScene);
        const nextSceneData = {
            service: this.service
        };
        currentScene.scene.start(targetScene, nextSceneData);
    }
}

export default SceneManager;