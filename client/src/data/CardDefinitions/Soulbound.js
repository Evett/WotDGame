import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SummonKhan: () => createCard({
        name: "Summon Khan",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon Khan (4 dmg/turn). +2 bonus to next attack each turn. Once per combat.",
        upgradedDescription: "Summon Khan (6 dmg/turn). +3 bonus to next attack each turn. Draw 1. Once per combat.",
        effect: (_, state, card, scene) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Khan", damage: card.upgraded ? 6 : 4, duration: 99, attackBonus: card.upgraded ? 3 : 2 });
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    PhantomStrike: () => createCard({
        name: "Phantom Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Deal 4 more if Eidolon active.",
        upgradedDescription: "Deal 9 damage. Deal 6 more if Eidolon active.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 9 : 6;
                const bonus = state.hasEidolon ? (card.upgraded ? 6 : 4) : 0;
                target.takeDamage((base + bonus) * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    EidolonStrike: () => createCard({
        name: "Eidolon Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 3 damage. Deal 8 if Eidolon is active.",
        upgradedDescription: "Deal 5 damage. Deal 12 if Eidolon is active.",
        effect: (target, state, card) => {
            if (target) {
                const damage = state.hasEidolon ? (card.upgraded ? 12 : 8) : (card.upgraded ? 5 : 3);
                target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    SoulBond: () => createCard({
        name: "Soul Bond",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Summon Eidolon. Gain 6 armor.",
        upgradedDescription: "Summon Eidolon. Gain 10 armor. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.hasEidolon = true;
            state.playerArmor(card.upgraded ? 10 : 6);
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    LifeTransference: () => createCard({
        name: "Life Transference",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Lose 2 HP. Gain 10 armor.",
        upgradedDescription: "Lose 2 HP. Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerTakeDamage(2);
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    SharedPain: () => createCard({
        name: "Shared Pain",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 damage. Take 3 damage. Heal 3 if Eidolon active.",
        upgradedDescription: "Deal 14 damage. Take 3 damage. Heal 5 if Eidolon active.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 14 : 9) * state.nextAttackBonus);
            state.playerTakeDamage(3);
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    SoulSiphon: () => createCard({
        name: "Soul Siphon",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 8 damage. Heal for damage dealt.",
        upgradedDescription: "Deal 12 damage. Heal for damage dealt.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 12 : 8;
                target.takeDamage(damage * state.nextAttackBonus);
                state.playerHeal(damage);
            }
        },
        upgraded: false
    }),

    PhantomArmor: () => createCard({
        name: "Phantom Armor",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 7 armor. Gain 5 more if Eidolon active.",
        upgradedDescription: "Gain 10 armor. Gain 7 more if Eidolon active.",
        effect: (_, state, card) => {
            const base = card.upgraded ? 10 : 7;
            const bonus = state.hasEidolon ? (card.upgraded ? 7 : 5) : 0;
            state.playerArmor(base + bonus);
        },
        upgraded: false
    }),

    TetherStrike: () => createCard({
        name: "Tether Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 5 damage. Draw 1 card.",
        upgradedDescription: "Deal 8 damage. Draw 2 cards.",
        effect: (target, state, card, scene) => {
            if (target) target.takeDamage((card.upgraded ? 8 : 5) * state.nextAttackBonus);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    SoulBurst: () => createCard({
        name: "Soul Burst",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 7 damage to all. Lose 5 HP.",
        upgradedDescription: "Deal 11 damage to all. Lose 5 HP.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 11 : 7;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
            state.playerTakeDamage(5);
        },
        upgraded: false
    }),

    PhantomReach: () => createCard({
        name: "Phantom Reach",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 true damage. Requires Eidolon.",
        upgradedDescription: "Deal 15 true damage. Requires Eidolon.",
        effect: (target, state, card) => {
            if (target && state.hasEidolon) {
                target.takeTrueDamage(card.upgraded ? 15 : 10);
            }
        },
        upgraded: false
    }),

    EtherealMend: () => createCard({
        name: "Ethereal Mend",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 8 HP. Gain 4 armor.",
        upgradedDescription: "Heal 12 HP. Gain 6 armor.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 12 : 8);
            state.playerArmor(card.upgraded ? 6 : 4);
        },
        upgraded: false
    }),

    SoulChains: () => createCard({
        name: "Soul Chains",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Stun non-boss for 1 turn. Gain 5 armor.",
        upgradedDescription: "Stun any enemy for 1 turn. Gain 8 armor.",
        effect: (target, state, card) => {
            if (target && (card.upgraded || !target.isBoss)) {
                target.applyStatus("Stunned", 1);
            }
            state.playerArmor(card.upgraded ? 8 : 5);
        },
        upgraded: false
    }),

    FeedOnSuffering: () => createCard({
        name: "Feed on Suffering",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Heal 6 if enemy below half HP.",
        upgradedDescription: "Deal 9 damage. Heal 9 if enemy below half HP.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 9 : 6;
            if (target) {
                target.takeDamage(damage * state.nextAttackBonus);
                if (target.isAlive && target.health <= target.maxHealth / 2) {
                    state.playerHeal(damage);
                }
            }
        },
        upgraded: false
    }),

    BondOfSouls: () => createCard({
        name: "Bond of Souls",
        actionCost: 0,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "While Eidolon active, all attacks deal +4.",
        upgradedDescription: "While Eidolon active, all attacks deal +6.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.applyPlayerBuff("AttackBonus", card.upgraded ? 6 : 4, 99);
            }
        },
        upgraded: false
    }),

    PhantomLash: () => createCard({
        name: "Phantom Lash",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Apply Weakened 1 turn.",
        upgradedDescription: "Deal 12 damage. Apply Weakened 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 12 : 8) * state.nextAttackBonus);
                target.applyStatus("Weakened", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    SpectralBarrier: () => createCard({
        name: "Spectral Barrier",
        actionCost: 0,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 12 armor.",
        upgradedDescription: "Gain 18 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 18 : 12);
        },
        upgraded: false
    }),

    SoulDrain: () => createCard({
        name: "Soul Drain",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 10 damage. Gain 2 mana.",
        upgradedDescription: "Deal 15 damage. Gain 3 mana.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 15 : 10) * state.nextAttackBonus);
            state.mana += card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    GhostlyPresence: () => createCard({
        name: "Ghostly Presence",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 2 cards.",
        upgradedDescription: "Draw 3 cards.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 3 : 2, scene);
        },
        upgraded: false
    }),

    SoulStorm: () => createCard({
        name: "Soul Storm",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 12 damage to all. Heal 5 per enemy hit.",
        upgradedDescription: "Deal 18 damage to all. Heal 7 per enemy hit.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 18 : 12;
            const heal = card.upgraded ? 7 : 5;
            let hits = 0;
            state.enemies.forEach(e => { if (e.isAlive) { e.takeDamage(damage); hits++; } });
            state.playerHeal(heal * hits);
        },
        upgraded: false
    }),

    PhantomDodge: () => createCard({
        name: "Phantom Dodge",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 6 armor. Gain 1 action.",
        upgradedDescription: "Gain 9 armor. Gain 1 action.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 9 : 6);
            state.actions += 1;
        },
        upgraded: false
    }),

    SoulTether: () => createCard({
        name: "Soul Tether",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Summon Eidolon. Gain 2 mana.",
        upgradedDescription: "Summon Eidolon. Gain 3 mana. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.hasEidolon = true;
            state.mana += card.upgraded ? 3 : 2;
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    VengefulPhantom: () => createCard({
        name: "Vengeful Phantom",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 4 + (missing HP / 4) damage.",
        upgradedDescription: "Deal 6 + (missing HP / 3) damage.",
        effect: (target, state, card) => {
            const missing = state.maxHealth - state.health;
            const damage = card.upgraded ? 6 + Math.floor(missing / 3) : 4 + Math.floor(missing / 4);
            if (target) target.takeDamage(damage * state.nextAttackBonus);
        },
        upgraded: false
    }),

    SpiritualFusion: () => createCard({
        name: "Spiritual Fusion",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "Merge with Eidolon. Gain 8 armor, +4 attacks for 3 turns.",
        upgradedDescription: "Merge with Eidolon. Gain 12 armor, +6 attacks for 3 turns.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.playerArmor(card.upgraded ? 12 : 8);
                state.applyPlayerBuff("AttackBonus", card.upgraded ? 6 : 4, 3);
            }
        },
        upgraded: false
    }),

    WailOfAgony: () => createCard({
        name: "Wail of Agony",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Lose 6 HP. Deal 10 damage to all enemies.",
        upgradedDescription: "Lose 6 HP. Deal 15 damage to all enemies.",
        effect: (_, state, card) => {
            state.playerTakeDamage(6);
            const damage = card.upgraded ? 15 : 10;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    SoulRecovery: () => createCard({
        name: "Soul Recovery",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 10 HP. Requires Eidolon.",
        upgradedDescription: "Heal 16 HP. Requires Eidolon.",
        effect: (_, state, card) => {
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 16 : 10);
        },
        upgraded: false
    }),

    PhantomFlurry: () => createCard({
        name: "Phantom Flurry",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 4 damage 4 times. Requires Eidolon.",
        upgradedDescription: "Deal 5 damage 4 times. Requires Eidolon.",
        effect: (target, state, card) => {
            if (target && state.hasEidolon) {
                const damage = card.upgraded ? 5 : 4;
                for (let i = 0; i < 4; i++) target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    DualExistence: () => createCard({
        name: "Dual Existence",
        actionCost: 0,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon Eidolon. Gain 3 actions. Gain 8 armor.",
        upgradedDescription: "Summon Eidolon. Gain 4 actions. Gain 12 armor.",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.actions += card.upgraded ? 4 : 3;
            state.playerArmor(card.upgraded ? 12 : 8);
        },
        upgraded: false
    }),

    EchoingScream: () => createCard({
        name: "Echoing Scream",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 5 damage to all. Apply Weakened 1 turn.",
        upgradedDescription: "Deal 8 damage to all. Apply Weakened 1 turn.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                    e.applyStatus("Weakened", 1);
                }
            });
        },
        upgraded: false
    }),

    DeathPact: () => createCard({
        name: "Death Pact",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Lose 8 HP. Draw 4 cards. Gain 2 mana.",
        upgradedDescription: "Lose 6 HP. Draw 5 cards. Gain 3 mana.",
        effect: (_, state, card, scene) => {
            state.playerTakeDamage(card.upgraded ? 6 : 8);
            state.drawCards(card.upgraded ? 5 : 4, scene);
            state.mana += card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    SoulShatter: () => createCard({
        name: "Soul Shatter",
        actionCost: 2,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 25 damage. Lose 8 HP.",
        upgradedDescription: "Deal 35 damage. Lose 8 HP.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 35 : 25) * state.nextAttackBonus);
            state.playerTakeDamage(8);
        },
        upgraded: false
    }),

    SpiritWalk: () => createCard({
        name: "Spirit Walk",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 5 armor. Gain 1 action. Draw 1 card.",
        upgradedDescription: "Gain 7 armor. Gain 1 action. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 7 : 5);
            state.actions += 1;
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    })
}