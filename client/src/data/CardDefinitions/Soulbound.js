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

    TentacleStrike: () => createCard({
        name: "Tentacle Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Deal 4 more if a summon is active.",
        upgradedDescription: "Deal 9 damage. Deal 6 more if a summon is active.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 9 : 6;
                const bonus = state.hasEidolon ? (card.upgraded ? 6 : 4) : 0;
                target.takeDamage(state.calcDamage(base + bonus));
            }
        },
        upgraded: false
    }),

    CorrosiveTouch: () => createCard({
        name: "Corrosive Touch",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage.",
        upgradedDescription: "Deal 11 damage.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 11 : 7;
                target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    ObscuringMist: () => createCard({
        name: "Obscuring Mist",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 6 armor.",
        upgradedDescription: "Gain 10 armor. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 10 : 6);
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    CreatePit: () => createCard({
        name: "Create Pit",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Gain 10 armor. Deal 10 damage.",
        upgradedDescription: "Gain 15 armor. Deal 15 damage.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 15 : 10;
                target.takeDamage(state.calcDamage(damage));
                state.playerArmor(card.upgraded ? 15 : 10);
            }
        },
        upgraded: false
    }),

    DarkWhispers: () => createCard({
        name: "Dark Whispers",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Lose 2 HP. Gain 10 armor.",
        upgradedDescription: "Lose 2 HP. Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerTakeDamage(2);
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    BloodTentacles: () => createCard({
        name: "Blood Tentacles",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 damage. Take 3 damage. Heal 3 if Eidolon active.",
        upgradedDescription: "Deal 14 damage. Take 3 damage. Heal 5 if Eidolon active.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 14 : 9));
            state.playerTakeDamage(3);
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    CausticBlood: () => createCard({
        name: "Caustic Blood",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 8 damage. Heal for damage dealt.",
        upgradedDescription: "Deal 12 damage. Heal for damage dealt.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 12 : 8;
                target.takeDamage(state.calcDamage(damage));
                state.playerHeal(damage);
            }
        },
        upgraded: false
    }),

    FusedEidolon: () => createCard({
        name: "Fused Eidolon",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 7 armor. Gain 5 more if a summon is active.",
        upgradedDescription: "Gain 10 armor. Gain 7 more if a summon is active.",
        effect: (_, state, card) => {
            const base = card.upgraded ? 10 : 7;
            const bonus = state.hasEidolon ? (card.upgraded ? 7 : 5) : 0;
            state.playerArmor(base + bonus);
        },
        upgraded: false
    }),

    WhisperingGroveStrike: () => createCard({
        name: "Whispering Grove Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 5 damage. Draw 1 card.",
        upgradedDescription: "Deal 8 damage. Draw 2 cards.",
        effect: (target, state, card, scene) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 8 : 5));
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    BreathOfNightmares: () => createCard({
        name: "Breath of Nightmares",
        actionCost: 2,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 8 damage to all enemies.",
        upgradedDescription: "Deal 12 damage to all enemies.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 12 : 8;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    LongArms: () => createCard({
        name: "Long Arms",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 true damage.",
        upgradedDescription: "Deal 15 true damage.",
        effect: (target, state, card) => {
            if (target) {
                target.takeTrueDamage(card.upgraded ? 15 : 10);
            }
        },
        upgraded: false
    }),

    Haste: () => createCard({
        name: "Haste",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 4 HP. Gain 1 action. Draw 1 card",
        upgradedDescription: "Heal 6 HP. Gain 2 actions. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerHeal(card.upgraded ? 6 : 4);
            state.drawCards(card.upgraded ? 2 : 1, scene);
            state.actions += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    HoldMonster: () => createCard({
        name: "Hold Monster",
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

    BlackTentacles: () => createCard({
        name: "Black Tentacles",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Heal 6 if enemy below half HP.",
        upgradedDescription: "Deal 9 damage. Heal 9 if enemy below half HP.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 9 : 6;
            if (target) {
                target.takeDamage(state.calcDamage(damage));
                if (target.isAlive && target.health <= target.maxHealth / 2) {
                    state.playerHeal(damage);
                }
            }
        },
        upgraded: false
    }),

    LivingShadows: () => createCard({
        name: "Living Shadows",
        actionCost: 0,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "While a summon is active, all attacks deal +4.",
        upgradedDescription: "While a summon is active, all attacks deal +6.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.applyPlayerBuff("AttackBonus", card.upgraded ? 6 : 4, 99);
            }
        },
        upgraded: false
    }),

    TarPool: () => createCard({
        name: "Tar Pool",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Apply Weakened 1 turn.",
        upgradedDescription: "Deal 12 damage. Apply Weakened 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 12 : 8));
                target.applyStatus("Weakened", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    Invisibility: () => createCard({
        name: "Invisibility",
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

    VitriolicMist: () => createCard({
        name: "Vitriolic Mist",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 10 damage. Gain 2 mana.",
        upgradedDescription: "Deal 15 damage. Gain 3 mana.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 15 : 10));
            state.mana += card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    Aspect: () => createCard({
        name: "Aspect",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 1 card.",
        upgradedDescription: "Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    TissandeisStorm: () => createCard({
        name: "Tissandei's Storm",
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

    Glide: () => createCard({
        name: "Glide",
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

    LifeBond: () => createCard({
        name: "Life Bond",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 2 mana.",
        upgradedDescription: "Gain 3 mana. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.hasEidolon = true;
            state.mana += card.upgraded ? 3 : 2;
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    WalkThePlank: () => createCard({
        name: "Walk the Plank",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 + (missing HP / 4) damage.",
        upgradedDescription: "Deal 9 + (missing HP / 3) damage.",
        effect: (target, state, card) => {
            const missing = state.maxHealth - state.health;
            const damage = card.upgraded ? 9 + Math.floor(missing / 3) : 6 + Math.floor(missing / 4);
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    LifeLink: () => createCard({
        name: "Life Link",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "If you have a summon active, gain 8 armor, +4 attacks for 3 turns.",
        upgradedDescription: "If you have a summon active, gain 12 armor, +6 attacks for 3 turns.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.playerArmor(card.upgraded ? 12 : 8);
                state.applyPlayerBuff("AttackBonus", card.upgraded ? 6 : 4, 3);
            }
        },
        upgraded: false
    }),

    IncendiaryCloud: () => createCard({
        name: "Incendiary Cloud",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Lose 6 HP. Deal 18 damage to all enemies.",
        upgradedDescription: "Lose 6 HP. Deal 25 damage to all enemies.",
        effect: (_, state, card) => {
            state.playerTakeDamage(6);
            const damage = card.upgraded ? 25 : 18;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    Transposition: () => createCard({
        name: "Transposition",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 10 HP. Requires a summon.",
        upgradedDescription: "Heal 16 HP. Requires a summon.",
        effect: (_, state, card) => {
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 16 : 10);
        },
        upgraded: false
    }),

    SwarmOfFangs: () => createCard({
        name: "Swarm of Fangs",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 4 damage 4 times. Requires a summon.",
        upgradedDescription: "Deal 6 damage 4 times. Requires a summon.",
        effect: (target, state, card) => {
            if (target && state.hasEidolon) {
                const damage = card.upgraded ? 5 : 4;
                for (let i = 0; i < 4; i++) target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    SplitForms: () => createCard({
        name: "Split Forms",
        actionCost: 0,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain 3 actions. Gain 8 armor.",
        upgradedDescription: "Gain 4 actions. Gain 12 armor.",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.actions += card.upgraded ? 4 : 3;
            state.playerArmor(card.upgraded ? 12 : 8);
        },
        upgraded: false
    }),

    Maze: () => createCard({
        name: "Maze",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 5 damage to all. Apply Weakened 1 turn.",
        upgradedDescription: "Deal 8 damage to all. Apply Weakened 2 turns.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                    e.applyStatus("Weakened", 2);
                }
            });
        },
        upgraded: false
    }),

    TissandeisPact: () => createCard({
        name: "Tissandei's Pact",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Lose 8 HP. Draw 4 cards. Gain 2 mana.",
        upgradedDescription: "Lose 6 HP. Draw 5 cards. Gain 3 mana.",
        effect: (_, state, card, scene) => {
            state.playerTakeDamage(card.upgraded ? 6 : 8);
            state.drawCards(card.upgraded ? 5 : 4, scene);
            state.mana += card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    AcidPit: () => createCard({
        name: "Acid Pit",
        actionCost: 2,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 25 damage. Gain 8 armor.",
        upgradedDescription: "Deal 35 damage. Gain 12 armor.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 35 : 25));
            state.playerArmor(card.upgraded ? 12 : 8);
        },
        upgraded: false
    }),

    InsectScouts: () => createCard({
        name: "Insect Scouts",
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