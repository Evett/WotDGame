import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    MagicMissile: () => createCard({
        name: "Magic Missile",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 6 true damage.",
        upgradedDescription: "Deal 10 true damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 10 : 6);
        },
        upgraded: false
    }),

    Fireball: () => createCard({
        name: "Fireball",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 10 damage to all enemies.",
        upgradedDescription: "Deal 16 damage to all enemies.",
        effect: (_, state, card) => {
            const damage = state.calcDamage(card.upgraded ? 16 : 10);
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    Shield: () => createCard({
        name: "Shield",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 6 armor.",
        upgradedDescription: "Gain 9 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 9 : 6);
        },
        upgraded: false
    }),

    LightningBolt: () => createCard({
        name: "Lightning Bolt",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 14 damage.",
        upgradedDescription: "Deal 20 damage.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 20 : 14));
        },
        upgraded: false
    }),

    ArcaneBlast: () => createCard({
        name: "Arcane Blast",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 8 damage. Draw 1 card.",
        upgradedDescription: "Deal 12 damage. Draw 1 card.",
        effect: (target, state, card, scene) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 12 : 8));
            state.drawCards(1, scene);
        },
        upgraded: false
    }),

    MageArmor: () => createCard({
        name: "Mage Armor",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 10 armor.",
        upgradedDescription: "Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    RayOfFrost: () => createCard({
        name: "Ray of Frost",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 5 damage. Apply Frozen for 1 turn.",
        upgradedDescription: "Deal 8 damage. Apply Frozen for 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 8 : 5));
                target.applyStatus("Frozen", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    Counterspell: () => createCard({
        name: "Counterspell",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 8 armor. Gain 1 action.",
        upgradedDescription: "Gain 12 armor. Gain 1 action.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 12 : 8);
            state.actions += 1;
        },
        upgraded: false
    }),

    ArcaneRecovery: () => createCard({
        name: "Arcane Recovery",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 3 mana.",
        upgradedDescription: "Gain 4 mana.",
        effect: (_, state, card) => {
            state.mana += card.upgraded ? 4 : 3;
        },
        upgraded: false
    }),

    Telekinesis: () => createCard({
        name: "Telekinesis",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 6 damage. Stun for 1 turn.",
        upgradedDescription: "Deal 9 damage. Stun for 1 turn.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 9 : 6));
                if (!target.isBoss) target.applyStatus("Stunned", 1);
            }
        },
        upgraded: false
    }),

    ChainLightning: () => createCard({
        name: "Chain Lightning",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 7 damage to all enemies.",
        upgradedDescription: "Deal 11 damage to all enemies.",
        effect: (_, state, card) => {
            const damage = state.calcDamage(card.upgraded ? 11 : 7);
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    MirrorImage: () => createCard({
        name: "Mirror Image",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 14 armor.",
        upgradedDescription: "Gain 20 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 20 : 14);
        },
        upgraded: false
    }),

    Disintegrate: () => createCard({
        name: "Disintegrate",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 30 true damage.",
        upgradedDescription: "Deal 45 true damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 45 : 30);
        },
        upgraded: false
    }),

    Haste: () => createCard({
        name: "Haste",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 2 actions. Draw 1 card.",
        upgradedDescription: "Gain 3 actions. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.actions += card.upgraded ? 3 : 2;
            state.drawCards(1, scene);
        },
        upgraded: false
    }),

    Slow: () => createCard({
        name: "Slow",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Stun all non-boss enemies for 1 turn.",
        upgradedDescription: "Stun all enemies for 1 turn.",
        effect: (_, state, card) => {
            state.enemies.forEach(e => {
                if (e.isAlive && (card.upgraded || !e.isBoss)) e.applyStatus("Stunned", 1);
            });
        },
        upgraded: false
    }),

    ConeOfCold: () => createCard({
        name: "Cone of Cold",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 6 damage to all. Apply Frozen 1 turn.",
        upgradedDescription: "Deal 9 damage to all. Apply Frozen 1 turn.",
        effect: (_, state, card) => {
            const damage = state.calcDamage(card.upgraded ? 9 : 6);
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                    e.applyStatus("Frozen", 1);
                }
            });
        },
        upgraded: false
    }),

    AcidSplash: () => createCard({
        name: "Acid Splash",
        actionCost: 1,
        manaCost: 0,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 4 damage. Apply Corrode for 2 turns.",
        upgradedDescription: "Deal 6 damage. Apply Corrode for 3 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 6 : 4));
                target.applyStatus("Corrode", card.upgraded ? 3 : 2);
            }
        },
        upgraded: false
    }),

    Invisibility: () => createCard({
        name: "Invisibility",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 8 armor. Draw 2 cards.",
        upgradedDescription: "Gain 12 armor. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 12 : 8);
            state.drawCards(2, scene);
        },
        upgraded: false
    }),

    Stoneskin: () => createCard({
        name: "Stoneskin",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 16 armor.",
        upgradedDescription: "Gain 22 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 22 : 16);
        },
        upgraded: false
    }),

    PowerWordStun: () => createCard({
        name: "Power Word: Stun",
        actionCost: 1,
        manaCost: 3,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Stun an enemy for 2 turns.",
        upgradedDescription: "Stun an enemy for 3 turns.",
        effect: (target, state, card) => {
            if (target) target.applyStatus("Stunned", card.upgraded ? 3 : 2);
        },
        upgraded: false
    }),

    Prestidigitation: () => createCard({
        name: "Prestidigitation",
        actionCost: 0,
        manaCost: 0,
        type: "Spell",
        requiresTarget: false,
        description: "Draw 2 cards.",
        upgradedDescription: "Draw 3 cards.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 3 : 2, scene);
        },
        upgraded: false
    }),

    MeteorSwarm: () => createCard({
        name: "Meteor Swarm",
        actionCost: 3,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 20 damage to all enemies.",
        upgradedDescription: "Deal 30 damage to all enemies.",
        effect: (_, state, card) => {
            const damage = state.calcDamage(card.upgraded ? 30 : 20);
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    ScorchingRay: () => createCard({
        name: "Scorching Ray",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 5 damage 3 times.",
        upgradedDescription: "Deal 7 damage 3 times.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 7 : 5;
            if (target) {
                for (let i = 0; i < 3; i++) target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    Dispel: () => createCard({
        name: "Dispel",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Draw 1 card. Gain 1 mana.",
        upgradedDescription: "Draw 2 cards. Gain 1 mana.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 2 : 1, scene);
            state.mana += 1;
        },
        upgraded: false
    }),

    WallOfForce: () => createCard({
        name: "Wall of Force",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 12 armor. Stun 1 random enemy.",
        upgradedDescription: "Gain 16 armor. Stun 1 random enemy.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 16 : 12);
            const alive = state.enemies.filter(e => e.isAlive && !e.isBoss);
            if (alive.length > 0) {
                alive[Math.floor(Math.random() * alive.length)].applyStatus("Stunned", 1);
            }
        },
        upgraded: false
    }),

    TimeStop: () => createCard({
        name: "Time Stop",
        actionCost: 0,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain 3 actions. Draw 3 cards.",
        upgradedDescription: "Gain 4 actions. Draw 4 cards.",
        effect: (_, state, card, scene) => {
            state.actions += card.upgraded ? 4 : 3;
            state.drawCards(card.upgraded ? 4 : 3, scene);
        },
        upgraded: false
    }),

    Frostbite: () => createCard({
        name: "Frostbite",
        actionCost: 1,
        manaCost: 0,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 4 damage. Gain 4 armor.",
        upgradedDescription: "Deal 6 damage. Gain 6 armor.",
        effect: (target, state, card) => {
            const amount = card.upgraded ? 6 : 4;
            if (target) target.takeDamage(state.calcDamage(amount));
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    DimensionDoor: () => createCard({
        name: "Dimension Door",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 6 armor. Gain 1 action.",
        upgradedDescription: "Gain 8 armor. Gain 2 actions.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 8 : 6);
            state.actions += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    EmpoweredSpell: () => createCard({
        name: "Empowered Spell",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Next spell deals double damage.",
        upgradedDescription: "Next spell deals triple damage.",
        effect: (_, state, card) => {
            state.nextAttackMultiplier *= card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    Thunderwave: () => createCard({
        name: "Thunderwave",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 5 damage to all enemies. Gain 5 armor.",
        upgradedDescription: "Deal 8 damage to all enemies. Gain 8 armor.",
        effect: (_, state, card) => {
            const amount = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(state.calcDamage(amount)); });
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    Wish: () => createCard({
        name: "Wish",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 20 HP. Gain 20 armor. Draw 3 cards.",
        upgradedDescription: "Heal 30 HP. Gain 30 armor. Draw 4 cards.",
        effect: (_, state, card, scene) => {
            const amount = card.upgraded ? 30 : 20;
            state.playerHeal(amount);
            state.playerArmor(amount);
            state.drawCards(card.upgraded ? 4 : 3, scene);
        },
        upgraded: false
    }),

    ArcaneSurge: () => createCard({
        name: "Arcane Surge",
        actionCost: 1,
        manaCost: 0,
        type: "Power",
        requiresTarget: false,
        description: "Spend all mana. Deal 4 damage per mana spent to a random enemy.",
        upgradedDescription: "Spend all mana. Deal 6 damage per mana spent to a random enemy.",
        effect: (_, state, card) => {
            const manaSpent = state.mana;
            state.mana = 0;
            const damage = manaSpent * (card.upgraded ? 6 : 4);
            const alive = state.enemies.filter(e => e.isAlive);
            if (alive.length > 0) {
                alive[Math.floor(Math.random() * alive.length)].takeDamage(damage);
            }
        },
        upgraded: false
    })
}