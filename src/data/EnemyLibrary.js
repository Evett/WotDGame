import Enemy from './Enemy.js'

const createEnemy = (options) => new Enemy(options);

const EnemyLibrary = {
    Goblin: createEnemy({
        name: "Goblin",
        maxHealth: 20
    }),
    Orc: createEnemy({
        name: "Orc",
        maxHealth: 35
    }),
};

export default EnemyLibrary;