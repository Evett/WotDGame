import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    Strike: () => createCard({
        name: "Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Deal 6 damage.",
        upgradedDescription: "Deal 9 damage.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 9 : 6;
            if (target) {
                target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    Block: () => createCard({
        name: "Block",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 5 armor.",
        upgradedDescription: "Gain 8 armor.",
        effect: (target, state, card) => {
            const armor = card.upgraded ? 8 : 5;
            state.armor = (state.armor || 0) + armor;
        },
        upgraded: false
    }),

    Berserk: () => createCard({
        name: "Berserk",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Next attack deals double damage.",
        upgradedDescription: "Next attack deals triple damage.",
        effect: (target, state, card) => {
            state.nextAttackMultiplier *= card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    QuickSlash: () => createCard({
        name: "Quick Slash",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 4 damage. Draw 1 card.",
        upgradedDescription: "Deal 6 damage. Draw 1 card.",
        effect: (target, state, card, scene) => {
            const damage = card.upgraded ? 6 : 4;
            if (target) target.takeDamage(state.calcDamage(damage));
            state.drawCards(1, scene);
        },
        upgraded: false
    }),

    Fortify: () => createCard({
        name: "Fortify",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 3 armor. Gain 3 more next turn.",
        upgradedDescription: "Gain 5 armor. Gain 5 more next turn.",
        effect: (_, state, card) => {
            const amount = card.upgraded ? 5 : 3;
            state.playerArmor(amount);
            state.applyPlayerBuff("ArmorGain", amount, 1);
        },
        upgraded: false
    }),

    Haymaker: () => createCard({
        name: "Haymaker",
        actionCost: 2,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 14 damage.",
        upgradedDescription: "Deal 20 damage.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 20 : 14;
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    SecondWind: () => createCard({
        name: "Second Wind",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 6 HP. Gain 3 armor.",
        upgradedDescription: "Heal 10 HP. Gain 5 armor.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 10 : 6);
            state.playerArmor(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    Flurry: () => createCard({
        name: "Flurry",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 3 damage 3 times.",
        upgradedDescription: "Deal 4 damage 3 times.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 4 : 3;
            if (target) {
                for (let i = 0; i < 3; i++) {
                    target.takeDamage(state.calcDamage(damage));
                }
            }
        },
        upgraded: false
    }),

    SharpenBlade: () => createCard({
        name: "Sharpen Blade",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Next attack deals double damage.",
        upgradedDescription: "Next attack deals triple damage.",
        effect: (_, state, card) => {
            state.nextAttackMultiplier *= card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    Bandage: () => createCard({
        name: "Bandage",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 4 HP.",
        upgradedDescription: "Heal 7 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 7 : 4);
        },
        upgraded: false
    }),

    Cleave: () => createCard({
        name: "Cleave",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: false,
        description: "Deal 4 damage to all enemies.",
        upgradedDescription: "Deal 7 damage to all enemies.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 7 : 4;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(state.calcDamage(damage)); });
        },
        upgraded: false
    }),

    Dodge: () => createCard({
        name: "Dodge",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 4 armor. Draw 1 card.",
        upgradedDescription: "Gain 6 armor. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 6 : 4);
            state.drawCards(1, scene);
        },
        upgraded: false
    }),

    Adrenaline: () => createCard({
        name: "Adrenaline",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 1 extra action this turn.",
        upgradedDescription: "Gain 2 extra actions this turn.",
        effect: (_, state, card) => {
            state.actions += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    PowerStrike: () => createCard({
        name: "Power Strike",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 18 damage.",
        upgradedDescription: "Deal 25 damage.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 25 : 18;
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    TacticalRetreat: () => createCard({
        name: "Tactical Retreat",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 6 armor. Draw 2 cards.",
        upgradedDescription: "Gain 8 armor. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 8 : 6);
            state.drawCards(2, scene);
        },
        upgraded: false
    }),

    VenomStrike: () => createCard({
        name: "Venom Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 5 damage. Apply Poison for 2 turns.",
        upgradedDescription: "Deal 7 damage. Apply Poison for 3 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 7 : 5));
                target.applyStatus("Poison", card.upgraded ? 3 : 2);
            }
        },
        upgraded: false
    }),

    Meditate: () => createCard({
        name: "Meditate",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 mana.",
        upgradedDescription: "Gain 3 mana.",
        effect: (_, state, card) => {
            state.mana += card.upgraded ? 3 : 2;
        },
        upgraded: false
    }),

    Headbutt: () => createCard({
        name: "Headbutt",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Lose 2 armor.",
        upgradedDescription: "Deal 12 damage. Lose 2 armor.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 12 : 8;
            if (target) target.takeDamage(state.calcDamage(damage));
            state.armor = Math.max(0, (state.armor || 0) - 2);
        },
        upgraded: false
    }),

    Preparation: () => createCard({
        name: "Preparation",
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

    ShieldBash: () => createCard({
        name: "Shield Bash",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal damage equal to your armor.",
        upgradedDescription: "Deal damage equal to your armor +4.",
        effect: (target, state, card) => {
            const damage = (state.armor || 0) + (card.upgraded ? 4 : 0);
            if (target && damage > 0) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    Rally: () => createCard({
        name: "Rally",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 1 action. Gain 4 armor.",
        upgradedDescription: "Gain 1 action. Gain 7 armor.",
        effect: (_, state, card) => {
            state.actions += 1;
            state.playerArmor(card.upgraded ? 7 : 4);
        },
        upgraded: false
    }),

    WildSwing: () => createCard({
        name: "Wild Swing",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 5-15 damage (random).",
        upgradedDescription: "Deal 8-18 damage (random).",
        effect: (target, state, card) => {
            const min = card.upgraded ? 8 : 5;
            const max = card.upgraded ? 18 : 15;
            const damage = min + Math.floor(Math.random() * (max - min + 1));
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    Recuperate: () => createCard({
        name: "Recuperate",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 8 HP.",
        upgradedDescription: "Heal 13 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 13 : 8);
        },
        upgraded: false
    }),

    IronWill: () => createCard({
        name: "Iron Will",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 10 armor.",
        upgradedDescription: "Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    DesperateStrike: () => createCard({
        name: "Desperate Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 5 damage. If below half HP, deal 15 instead.",
        upgradedDescription: "Deal 8 damage. If below half HP, deal 20 instead.",
        effect: (target, state, card) => {
            const low = state.health <= state.maxHealth / 2;
            const damage = low ? (card.upgraded ? 20 : 15) : (card.upgraded ? 8 : 5);
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    Parry: () => createCard({
        name: "Parry",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 3 armor.",
        upgradedDescription: "Gain 5 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    DoubleStrike: () => createCard({
        name: "Double Strike",
        actionCost: 2,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage twice.",
        upgradedDescription: "Deal 10 damage twice.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 10 : 7;
            if (target) {
                target.takeDamage(state.calcDamage(damage));
                target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    Taunt: () => createCard({
        name: "Taunt",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 8 armor.",
        upgradedDescription: "Gain 12 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 12 : 8);
        },
        upgraded: false
    }),

    Feint: () => createCard({
        name: "Feint",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 1 card. Gain 1 action.",
        upgradedDescription: "Draw 2 cards. Gain 1 action.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 2 : 1, scene);
            state.actions += 1;
        },
        upgraded: false
    }),

    Overpower: () => createCard({
        name: "Overpower",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. If this kills, draw 2 cards.",
        upgradedDescription: "Deal 14 damage. If this kills, draw 2 cards.",
        effect: (target, state, card, scene) => {
            const damage = card.upgraded ? 14 : 10;
            if (target) {
                target.takeDamage(state.calcDamage(damage));
                if (!target.isAlive) state.drawCards(2, scene);
            }
        },
        upgraded: false
    }),

    Endure: () => createCard({
        name: "Endure",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 6 armor. Heal 3 HP.",
        upgradedDescription: "Gain 9 armor. Heal 5 HP.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 9 : 6);
            state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    BattleCry: () => createCard({
        name: "Battle Cry",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "All attacks deal +3 this combat.",
        upgradedDescription: "All attacks deal +5 this combat.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 5 : 3, 99);
        },
        upgraded: false
    })
};