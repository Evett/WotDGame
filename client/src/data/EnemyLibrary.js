import Enemy from './Enemy.js';

const EnemyLibrary = {
    // ─── Basic Enemies ──────────────────────────────────────

    Goblin: () => new Enemy({
        name: "Goblin",
        maxHealth: 100,
        intents: [
            { type: 'attack', damage: 8 },
            { type: 'block', amount: 8 },
            { type: 'buff', amount: 2 }
        ],
        tags: ["Evil"]
    }),

    Orc: () => new Enemy({
        name: "Orc",
        maxHealth: 180,
        intents: [
            { type: 'attack', damage: 14 },
            { type: 'block', amount: 12 },
            { type: 'buff', amount: 4 }
        ],
        tags: ["Evil"]
    }),

    Slime: () => new Enemy({
        name: "Slime",
        maxHealth: 60,
        intents: [
            { type: 'attack', damage: 5 },
            { type: 'attack', damage: 5 }
        ]
    }),

    Skeleton: () => new Enemy({
        name: "Skeleton",
        maxHealth: 80,
        intents: [
            { type: 'attack', damage: 7 },
            { type: 'block', amount: 6 }
        ],
        tags: ["Evil", "Undead"]
    }),

    // ─── New Enemies ────────────────────────────────────────

    Bandit: () => new Enemy({
        name: "Bandit",
        maxHealth: 130,
        intents: [
            { type: 'attack', damage: 10 },
            { type: 'multi_attack', damage: 4, hits: 3 },
            { type: 'block', amount: 10 }
        ],
        tags: []
    }),

    GiantSpider: () => new Enemy({
        name: "Giant Spider",
        maxHealth: 95,
        intents: [
            { type: 'attack', damage: 7 },
            { type: 'debuff', status: 'Weakened', duration: 1 },
            { type: 'multi_attack', damage: 3, hits: 4 }
        ],
        tags: []
    }),

    Wraith: () => new Enemy({
        name: "Wraith",
        maxHealth: 150,
        intents: [
            { type: 'attack', damage: 12 },
            { type: 'debuff', status: 'Vulnerable', duration: 1 },
            { type: 'attack', damage: 16 }
        ],
        tags: ["Evil", "Undead"]
    }),

    OgreBrute: () => new Enemy({
        name: "Ogre Brute",
        maxHealth: 260,
        intents: [
            { type: 'attack', damage: 18 },
            { type: 'buff', amount: 5 },
            { type: 'attack', damage: 12 }
        ],
        tags: ["Evil"]
    }),

    DarkCultist: () => new Enemy({
        name: "Dark Cultist",
        maxHealth: 120,
        intents: [
            { type: 'attack', damage: 9 },
            { type: 'buff', amount: 4 },
            { type: 'heal', amount: 20 },
            { type: 'debuff', status: 'Cursed', duration: 2 }
        ],
        tags: ["Evil"]
    }),

    WolfPack: () => new Enemy({
        name: "Wolf Pack",
        maxHealth: 85,
        intents: [
            { type: 'multi_attack', damage: 4, hits: 3 },
            { type: 'attack', damage: 11 },
            { type: 'multi_attack', damage: 3, hits: 4 }
        ],
        tags: []
    }),

    StoneGolem: () => new Enemy({
        name: "Stone Golem",
        maxHealth: 300,
        intents: [
            { type: 'block', amount: 25 },
            { type: 'attack', damage: 22 },
            { type: 'attack_and_block', damage: 12, block: 12 }
        ],
        tags: []
    }),

    FireElemental: () => new Enemy({
        name: "Fire Elemental",
        maxHealth: 160,
        intents: [
            { type: 'attack', damage: 15 },
            { type: 'multi_attack', damage: 5, hits: 3 },
            { type: 'buff', amount: 3 }
        ],
        tags: []
    }),

    VampireSpawn: () => new Enemy({
        name: "Vampire Spawn",
        maxHealth: 170,
        intents: [
            { type: 'attack', damage: 11 },
            { type: 'heal', amount: 15 },
            { type: 'attack_and_block', damage: 8, block: 8 },
            { type: 'debuff', status: 'Weakened', duration: 1 }
        ],
        tags: ["Evil", "Undead"]
    }),

    Minotaur: () => new Enemy({
        name: "Minotaur",
        maxHealth: 240,
        intents: [
            { type: 'attack', damage: 16 },
            { type: 'buff', amount: 4 },
            { type: 'attack', damage: 25 }
        ],
        tags: ["Evil"]
    }),

    FrostWitch: () => new Enemy({
        name: "Frost Witch",
        maxHealth: 130,
        intents: [
            { type: 'attack', damage: 10 },
            { type: 'debuff', status: 'Frozen', duration: 1 },
            { type: 'block', amount: 14 },
            { type: 'attack', damage: 18 }
        ],
        tags: ["Evil"]
    }),

    ShadowAssassin: () => new Enemy({
        name: "Shadow Assassin",
        maxHealth: 110,
        intents: [
            { type: 'multi_attack', damage: 5, hits: 4 },
            { type: 'buff', amount: 3 },
            { type: 'attack', damage: 19 }
        ],
        tags: ["Evil"]
    }),

    PlagueBear: () => new Enemy({
        name: "Plague Bear",
        maxHealth: 220,
        intents: [
            { type: 'attack', damage: 14 },
            { type: 'attack_and_block', damage: 8, block: 12 },
            { type: 'debuff', status: 'Poisoned', duration: 2 }
        ],
        tags: []
    }),

    BoneKnight: () => new Enemy({
        name: "Bone Knight",
        maxHealth: 200,
        intents: [
            { type: 'attack_and_block', damage: 11, block: 11 },
            { type: 'attack', damage: 16 },
            { type: 'block', amount: 18 },
            { type: 'buff', amount: 3 }
        ],
        tags: ["Evil", "Undead"]
    }),

    Harpy: () => new Enemy({
        name: "Harpy",
        maxHealth: 115,
        intents: [
            { type: 'attack', damage: 9 },
            { type: 'debuff', status: 'Stunned', duration: 1 },
            { type: 'multi_attack', damage: 4, hits: 3 }
        ],
        tags: ["Evil"]
    }),

    // ─── BOSSES ─────────────────────────────────────────────

    // Boss 1: Dragon — Enrages every 3rd turn, dealing massive AoE damage.
    Dragon: () => new Enemy({
        name: "Ancient Dragon",
        maxHealth: 900,
        isBoss: true,
        intents: [
            { type: 'attack', damage: 20 },
            { type: 'attack_and_block', damage: 14, block: 15 },
            { type: 'buff', amount: 6 },
            { type: 'multi_attack', damage: 10, hits: 4 }
        ],
        intentPattern: [0, 1, 2, 3],
        tags: ["Evil"]
    }),

    // Boss 2: Lich King — Debuffs, heals, and bursts.
    LichKing: () => new Enemy({
        name: "Lich King",
        maxHealth: 750,
        isBoss: true,
        intents: [
            { type: 'debuff', status: 'Cursed', duration: 2 },
            { type: 'attack', damage: 22 },
            { type: 'heal', amount: 50 },
            { type: 'attack', damage: 30 },
            { type: 'block', amount: 30 }
        ],
        intentPattern: [0, 1, 2, 3, 4],
        tags: ["Evil", "Undead"]
    }),

    // Boss 3: Iron Colossus — Massive armor then devastating slams.
    IronColossus: () => new Enemy({
        name: "Iron Colossus",
        maxHealth: 1000,
        isBoss: true,
        intents: [
            { type: 'block', amount: 40 },
            { type: 'block', amount: 40 },
            { type: 'attack', damage: 38 },
            { type: 'attack_and_block', damage: 16, block: 16 },
            { type: 'heal', amount: 30 }
        ],
        intentPattern: [0, 1, 2, 3, 4],
        tags: []
    }),

    // Boss 4: Demon Prince — Buffs then multi-attacks.
    DemonPrince: () => new Enemy({
        name: "Demon Prince",
        maxHealth: 850,
        isBoss: true,
        intents: [
            { type: 'buff', amount: 5 },
            { type: 'attack', damage: 18 },
            { type: 'buff', amount: 5 },
            { type: 'multi_attack', damage: 8, hits: 5 },
            { type: 'debuff', status: 'Weakened', duration: 2 }
        ],
        intentPattern: [0, 1, 2, 3, 4],
        tags: ["Evil"]
    }),

    // ─── FINAL BOSS ─────────────────────────────────────────

    Nyxaroth: () => new Enemy({
        name: "Nyxaroth, Shadow Gate Guardian",
        maxHealth: 1500,
        isBoss: true,
        isFinalBoss: true,
        intents: [
            { type: 'block', amount: 50 },
            { type: 'debuff', status: 'Weakened', duration: 2 },
            { type: 'attack', damage: 24 },
            { type: 'block', amount: 35 },
            { type: 'attack', damage: 36 },
            { type: 'buff', amount: 7 },
            { type: 'multi_attack', damage: 9, hits: 5 },
            { type: 'heal', amount: 60 },
            { type: 'multi_attack', damage: 11, hits: 4 },
            { type: 'attack', damage: 45 }
        ],
        intentPattern: [0, 1, 2, 3, 4],
        phasePattern: [5, 6, 7, 8, 9],
        tags: ["Evil", "Undead"]
    }),

    // ─── Encounter Generators ───────────────────────────────

    scaleForPlayers(enemies, playerCount) {
        const scale = playerCount / 6;
        enemies.forEach(e => {
            e.maxHealth = Math.round(e.maxHealth * scale);
            e.health = e.maxHealth;
        });
        return enemies;
    },

    getRandomEncounter(difficulty = 1, playerCount = 6) {
        const tierOne = ['Goblin', 'Slime', 'Skeleton', 'Bandit', 'WolfPack'];
        const tierTwo = ['Orc', 'GiantSpider', 'Wraith', 'DarkCultist', 'FrostWitch', 'Harpy', 'ShadowAssassin'];
        const tierThree = ['OgreBrute', 'StoneGolem', 'FireElemental', 'VampireSpawn', 'Minotaur', 'PlagueBear', 'BoneKnight'];

        const enemies = [];
        const count = Math.min(1 + difficulty, 4);

        for (let i = 0; i < count; i++) {
            let pool;
            if (difficulty <= 1) {
                pool = tierOne;
            } else if (difficulty <= 2) {
                pool = Math.random() < 0.6 ? tierTwo : tierOne;
            } else {
                pool = Math.random() < 0.5 ? tierThree : tierTwo;
            }
            const key = pool[Math.floor(Math.random() * pool.length)];
            enemies.push(EnemyLibrary[key]());
        }
        return this.scaleForPlayers(enemies, playerCount);
    },

    getBossEncounter(playerCount = 6) {
        const bosses = ['Dragon', 'LichKing', 'IronColossus', 'DemonPrince'];
        const key = bosses[Math.floor(Math.random() * bosses.length)];
        return this.scaleForPlayers([EnemyLibrary[key]()], playerCount);
    },

    getFinalBossEncounter(playerCount = 6) {
        return this.scaleForPlayers([EnemyLibrary.Nyxaroth()], playerCount);
    }
};

export default EnemyLibrary;
