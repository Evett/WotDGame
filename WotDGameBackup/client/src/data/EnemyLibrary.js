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
    }),

    // === BOSSES ===
    Dragon: (scene) => new Enemy(scene, {
        name: "Dragon",
        maxHealth: 200,
        intents: [
            { type: 'attack', damage: 25 },
            { type: 'attack', damage: 15, effect: 'burn' },
            { type: 'buff', effect: 'enrage' }
        ]
    }),

    Lich: (scene) => new Enemy(scene, {
        name: "Lich",
        maxHealth: 150,
        intents: [
            { type: 'attack', damage: 20 },
            { type: 'summon', enemy: 'Skeleton' },
            { type: 'buff', effect: 'curse' }
        ]
    })
};

export default EnemyLibrary;