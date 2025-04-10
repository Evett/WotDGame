import Enemy from './Enemy.js'

const EnemyLibrary = {
    Goblin: (scene) => new Enemy(scene, {
        name: "Goblin",
        maxHealth: 20
    }),

    Orc: (scene) => new Enemy(scene, {
        name: "Orc",
        maxHealth: 35
    }),
};

export default EnemyLibrary;