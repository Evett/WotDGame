import Enemy from './Enemy.js'

const EnemyLibrary = {
    Goblin: (scene) => new Enemy(scene, {
        name: "Goblin",
        maxHealth: 20,
        intents: [
            { type: 'attack', damage: 6 },
            { type: 'block', amount: 5 },
            { type: 'buff', effect: 'strength' }
        ]
    }),

    Orc: (scene) => new Enemy(scene, {
        name: "Orc",
        maxHealth: 35,
        intents: [
            { type: 'attack', damage: 10 },
            { type: 'block', amount: 8 },
            { type: 'buff', effect: 'rage' }
        ]
    }),

    Slime: (scene) => new Enemy(scene, {
        name: "Slime",
        maxHealth: 10,
        intents: [
            { type: 'attack', damage: 3 }
        ]
    })
};

export default EnemyLibrary;