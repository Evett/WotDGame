import Enemy from './Enemy.js';

const EnemyLibrary = {
    Goblin: () => new Enemy({
        name: "Goblin",
        maxHealth: 20,
        intents: [
            { type: 'attack', damage: 6 },
            { type: 'block', amount: 5 },
            { type: 'buff', effect: 'strength' }
        ],
        tags: ["Evil"]
    }),

    Orc: () => new Enemy({
        name: "Orc",
        maxHealth: 35,
        intents: [
            { type: 'attack', damage: 10 },
            { type: 'block', amount: 8 },
            { type: 'buff', effect: 'rage' }
        ],
        tags: ["Evil"]
    }),

    Slime: () => new Enemy({
        name: "Slime",
        maxHealth: 10,
        intents: [
            { type: 'attack', damage: 3 }
        ]
    }),

    Skeleton: () => new Enemy({
        name: "Skeleton",
        maxHealth: 15,
        intents: [
            { type: 'attack', damage: 5 },
            { type: 'block', amount: 4 }
        ],
        tags: ["Evil", "Undead"]
    }),

    // === BOSSES ===
    Dragon: () => new Enemy({
        name: "Dragon",
        maxHealth: 200,
        isBoss: true,
        intents: [
            { type: 'attack', damage: 25 },
            { type: 'attack', damage: 15 },
            { type: 'buff', effect: 'enrage' }
        ],
        tags: ["Evil"]
    }),

    Lich: () => new Enemy({
        name: "Lich",
        maxHealth: 150,
        isBoss: true,
        intents: [
            { type: 'attack', damage: 20 },
            { type: 'buff', effect: 'curse' }
        ],
        tags: ["Evil", "Undead"]
    }),

    getRandomEncounter(difficulty = 1) {
        const normalEnemies = ['Goblin', 'Orc', 'Slime', 'Skeleton'];
        const enemies = [];
        const count = Math.min(1 + difficulty, 4);
        for (let i = 0; i < count; i++) {
            const key = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
            enemies.push(EnemyLibrary[key]());
        }
        return enemies;
    }
};

export default EnemyLibrary;
