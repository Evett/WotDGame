import Enemy from './Enemy.js';

const EnemyLibrary = {
    // ─── Basic Enemies ──────────────────────────────────────

    Goblin: () => new Enemy({
        name: "Goblin",
        maxHealth: 20,
        intents: [
            { type: 'attack', damage: 6 },
            { type: 'block', amount: 5 },
            { type: 'buff', amount: 1 }
        ],
        tags: ["Evil"]
    }),

    Orc: () => new Enemy({
        name: "Orc",
        maxHealth: 35,
        intents: [
            { type: 'attack', damage: 10 },
            { type: 'block', amount: 8 },
            { type: 'buff', amount: 3 }
        ],
        tags: ["Evil"]
    }),

    Slime: () => new Enemy({
        name: "Slime",
        maxHealth: 10,
        intents: [
            { type: 'attack', damage: 3 },
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

    // ─── New Enemies ────────────────────────────────────────

    Bandit: () => new Enemy({
        name: "Bandit",
        maxHealth: 25,
        intents: [
            { type: 'attack', damage: 7 },
            { type: 'multi_attack', damage: 3, hits: 3 },
            { type: 'block', amount: 6 }
        ],
        tags: []
    }),

    GiantSpider: () => new Enemy({
        name: "Giant Spider",
        maxHealth: 18,
        intents: [
            { type: 'attack', damage: 5 },
            { type: 'debuff', status: 'Weakened', duration: 1 },
            { type: 'multi_attack', damage: 2, hits: 4 }
        ],
        tags: []
    }),

    Wraith: () => new Enemy({
        name: "Wraith",
        maxHealth: 28,
        intents: [
            { type: 'attack', damage: 9 },
            { type: 'debuff', status: 'Vulnerable', duration: 1 },
            { type: 'attack', damage: 12 }
        ],
        tags: ["Evil", "Undead"]
    }),

    OgreBrute: () => new Enemy({
        name: "Ogre Brute",
        maxHealth: 50,
        intents: [
            { type: 'attack', damage: 14 },
            { type: 'buff', amount: 4 },
            { type: 'attack', damage: 8 }
        ],
        tags: ["Evil"]
    }),

    DarkCultist: () => new Enemy({
        name: "Dark Cultist",
        maxHealth: 22,
        intents: [
            { type: 'attack', damage: 6 },
            { type: 'buff', amount: 3 },
            { type: 'heal', amount: 10 },
            { type: 'debuff', status: 'Cursed', duration: 2 }
        ],
        tags: ["Evil"]
    }),

    WolfPack: () => new Enemy({
        name: "Wolf Pack",
        maxHealth: 15,
        intents: [
            { type: 'multi_attack', damage: 3, hits: 3 },
            { type: 'attack', damage: 8 },
            { type: 'multi_attack', damage: 2, hits: 4 }
        ],
        tags: []
    }),

    StoneGolem: () => new Enemy({
        name: "Stone Golem",
        maxHealth: 55,
        intents: [
            { type: 'block', amount: 15 },
            { type: 'attack', damage: 18 },
            { type: 'attack_and_block', damage: 8, block: 8 }
        ],
        tags: []
    }),

    FireElemental: () => new Enemy({
        name: "Fire Elemental",
        maxHealth: 30,
        intents: [
            { type: 'attack', damage: 12 },
            { type: 'multi_attack', damage: 4, hits: 3 },
            { type: 'buff', amount: 2 }
        ],
        tags: []
    }),

    VampireSpawn: () => new Enemy({
        name: "Vampire Spawn",
        maxHealth: 32,
        intents: [
            { type: 'attack', damage: 8 },
            { type: 'heal', amount: 8 },
            { type: 'attack_and_block', damage: 6, block: 6 },
            { type: 'debuff', status: 'Weakened', duration: 1 }
        ],
        tags: ["Evil", "Undead"]
    }),

    Minotaur: () => new Enemy({
        name: "Minotaur",
        maxHealth: 45,
        intents: [
            { type: 'attack', damage: 12 },
            { type: 'buff', amount: 3 },
            { type: 'attack', damage: 20 }
        ],
        tags: ["Evil"]
    }),

    FrostWitch: () => new Enemy({
        name: "Frost Witch",
        maxHealth: 24,
        intents: [
            { type: 'attack', damage: 7 },
            { type: 'debuff', status: 'Frozen', duration: 1 },
            { type: 'block', amount: 10 },
            { type: 'attack', damage: 14 }
        ],
        tags: ["Evil"]
    }),

    ShadowAssassin: () => new Enemy({
        name: "Shadow Assassin",
        maxHealth: 20,
        intents: [
            { type: 'multi_attack', damage: 4, hits: 4 },
            { type: 'buff', amount: 2 },
            { type: 'attack', damage: 15 }
        ],
        tags: ["Evil"]
    }),

    PlagueBear: () => new Enemy({
        name: "Plague Bear",
        maxHealth: 40,
        intents: [
            { type: 'attack', damage: 10 },
            { type: 'attack_and_block', damage: 6, block: 8 },
            { type: 'debuff', status: 'Poisoned', duration: 2 }
        ],
        tags: []
    }),

    BoneKnight: () => new Enemy({
        name: "Bone Knight",
        maxHealth: 38,
        intents: [
            { type: 'attack_and_block', damage: 8, block: 8 },
            { type: 'attack', damage: 12 },
            { type: 'block', amount: 12 },
            { type: 'buff', amount: 2 }
        ],
        tags: ["Evil", "Undead"]
    }),

    Harpy: () => new Enemy({
        name: "Harpy",
        maxHealth: 22,
        intents: [
            { type: 'attack', damage: 6 },
            { type: 'debuff', status: 'Stunned', duration: 1 },
            { type: 'multi_attack', damage: 3, hits: 3 }
        ],
        tags: ["Evil"]
    }),

    // ─── BOSSES ─────────────────────────────────────────────

    // Boss 1: Dragon — Enrages every 3rd turn, dealing massive AoE damage.
    // Pattern: Claw → Tail Sweep → ENRAGE → Fire Breath (repeats)
    Dragon: () => new Enemy({
        name: "Ancient Dragon",
        maxHealth: 220,
        isBoss: true,
        intents: [
            { type: 'attack', damage: 14 },             // 0: Claw
            { type: 'attack_and_block', damage: 10, block: 10 }, // 1: Tail Sweep
            { type: 'buff', amount: 5 },                // 2: Enrage
            { type: 'multi_attack', damage: 8, hits: 4 } // 3: Fire Breath
        ],
        intentPattern: [0, 1, 2, 3],
        tags: ["Evil"]
    }),

    // Boss 2: Lich King — Cycles between debuffing, healing, and heavy attacks.
    // Gimmick: Heals every 3rd turn and applies curses; must burst him down.
    // Pattern: Curse → Soul Drain → Dark Heal → Necrotic Blast (repeats)
    LichKing: () => new Enemy({
        name: "Lich King",
        maxHealth: 180,
        isBoss: true,
        intents: [
            { type: 'debuff', status: 'Cursed', duration: 2 },  // 0: Curse
            { type: 'attack', damage: 16 },                      // 1: Soul Drain
            { type: 'heal', amount: 25 },                        // 2: Dark Heal
            { type: 'attack', damage: 22 },                      // 3: Necrotic Blast
            { type: 'block', amount: 20 }                        // 4: Bone Shield
        ],
        intentPattern: [0, 1, 2, 3, 4],
        tags: ["Evil", "Undead"]
    }),

    // Boss 3: Iron Colossus — Alternates between massive armor and devastating attacks.
    // Gimmick: Fortifies with huge armor, then unleashes an unblockable slam.
    // Pattern: Fortify → Fortify → SLAM → Swing → Repair (repeats)
    IronColossus: () => new Enemy({
        name: "Iron Colossus",
        maxHealth: 250,
        isBoss: true,
        intents: [
            { type: 'block', amount: 25 },              // 0: Fortify
            { type: 'block', amount: 25 },              // 1: Fortify again
            { type: 'attack', damage: 30 },             // 2: Colossal Slam
            { type: 'attack_and_block', damage: 12, block: 12 }, // 3: Iron Swing
            { type: 'heal', amount: 15 }                // 4: Self-Repair
        ],
        intentPattern: [0, 1, 2, 3, 4],
        tags: []
    }),

    // Boss 4: Demon Prince — Fast, aggressive, buffs then multi-attacks
    // Gimmick: Buffs strength repeatedly then unleashes a flurry
    // Pattern: Buff → Attack → Buff → Multi-Attack → Debuff (repeats)
    DemonPrince: () => new Enemy({
        name: "Demon Prince",
        maxHealth: 200,
        isBoss: true,
        intents: [
            { type: 'buff', amount: 4 },                  // 0: Demonic Power
            { type: 'attack', damage: 14 },               // 1: Hellfire Slash
            { type: 'buff', amount: 4 },                  // 2: Demonic Power
            { type: 'multi_attack', damage: 6, hits: 5 }, // 3: Fury of Hell
            { type: 'debuff', status: 'Weakened', duration: 2 } // 4: Oppressive Aura
        ],
        intentPattern: [0, 1, 2, 3, 4],
        tags: ["Evil"]
    }),

    // ─── Encounter Generators ───────────────────────────────

    getRandomEncounter(difficulty = 1) {
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
        return enemies;
    },

    getBossEncounter() {
        const bosses = ['Dragon', 'LichKing', 'IronColossus', 'DemonPrince'];
        const key = bosses[Math.floor(Math.random() * bosses.length)];
        return [EnemyLibrary[key]()];
    }
};

export default EnemyLibrary;
