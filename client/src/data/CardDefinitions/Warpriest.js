import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SacredStrike: () => createCard({
        name: "Sacred Strike",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Heal for half.",
        upgradedDescription: "Deal 12 damage. Heal for half.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 12 : 7;
                target.takeDamage(damage * state.nextAttackBonus);
                state.playerHeal(Math.floor(damage / 2));
            }
        },
        upgraded: false
    }),

    BlessingOfWar: () => createCard({
        name: "Blessing of War",
        actionCost: 1,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 strength for 2 turns.",
        upgradedDescription: "Gain 4 strength for 2 turns.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("Strength", card.upgraded ? 4 : 2, 2);
        },
        upgraded: false
    }),

    Sacrifice: () => createCard({
        name: "Sacrifice",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Lose 5 HP. Draw 3 cards.",
        upgradedDescription: "Lose 3 HP. Draw 5 cards.",
        effect: (_, state, card, scene) => {
            state.playerTakeDamage(card.upgraded ? 3 : 5);
            state.drawCards(card.upgraded ? 5 : 3, scene);
        },
        upgraded: false
    }),

    SacredWeapon: () => createCard({
        name: "Sacred Weapon",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Next attack deals +6 damage.",
        upgradedDescription: "Next attack deals +10 damage.",
        effect: (_, state, card) => {
            state.nextAttackBonus += card.upgraded ? 10 : 6;
        },
        upgraded: false
    }),

    FervorStrike: () => createCard({
        name: "Fervor Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Gain 1 mana.",
        upgradedDescription: "Deal 9 damage. Gain 2 mana.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 9 : 6) * state.nextAttackBonus);
            state.mana += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    DivineProtection: () => createCard({
        name: "Divine Protection",
        actionCost: 0,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 10 armor.",
        upgradedDescription: "Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    CureWounds: () => createCard({
        name: "Cure Wounds",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Heal 8 HP.",
        upgradedDescription: "Heal 13 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 13 : 8);
        },
        upgraded: false
    }),

    ChannelSmite: () => createCard({
        name: "Channel Smite",
        actionCost: 1,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 12 damage. Heal 6 HP.",
        upgradedDescription: "Deal 18 damage. Heal 9 HP.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 18 : 12) * state.nextAttackBonus);
            state.playerHeal(card.upgraded ? 9 : 6);
        },
        upgraded: false
    }),

    Zeal: () => createCard({
        name: "Zeal",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 1 action. Gain 3 armor.",
        upgradedDescription: "Gain 1 action. Gain 5 armor.",
        effect: (_, state, card) => {
            state.actions += 1;
            state.playerArmor(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    BlessedArmor: () => createCard({
        name: "Blessed Armor",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 7 armor. Heal 3 HP.",
        upgradedDescription: "Gain 11 armor. Heal 5 HP.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 11 : 7);
            state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    HolyStrike: () => createCard({
        name: "Holy Strike",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Double vs Undead.",
        upgradedDescription: "Deal 12 damage. Double vs Undead.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 12 : 8;
                const isUndead = target.tags?.includes("Undead");
                target.takeDamage((isUndead ? base * 2 : base) * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    WarBlessing: () => createCard({
        name: "War Blessing",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "Gain +3 to all attacks for 3 turns.",
        upgradedDescription: "Gain +5 to all attacks for 3 turns.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 5 : 3, 3);
        },
        upgraded: false
    }),

    SpiritualWeapon: () => createCard({
        name: "Spiritual Weapon",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Summon a weapon that deals 5 damage each turn.",
        upgradedDescription: "Summon a weapon that deals 8 damage each turn.",
        effect: (_, state, card) => {
            state.summonAlly({ name: "Spiritual Weapon", damage: card.upgraded ? 8 : 5, duration: 3 });
        },
        upgraded: false
    }),

    MartialPrayer: () => createCard({
        name: "Martial Prayer",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 2 cards. Gain 3 armor.",
        upgradedDescription: "Draw 3 cards. Gain 4 armor.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 3 : 2, scene);
            state.playerArmor(card.upgraded ? 4 : 3);
        },
        upgraded: false
    }),

    Retaliation: () => createCard({
        name: "Retaliation",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 5 damage. Gain 5 armor.",
        upgradedDescription: "Deal 8 damage. Gain 8 armor.",
        effect: (target, state, card) => {
            const amount = card.upgraded ? 8 : 5;
            if (target) target.takeDamage(amount * state.nextAttackBonus);
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    DevoutFury: () => createCard({
        name: "Devout Fury",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage 3 times.",
        upgradedDescription: "Deal 11 damage 3 times.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 11 : 8;
            if (target) {
                for (let i = 0; i < 3; i++) target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    RestorationPrayer: () => createCard({
        name: "Restoration Prayer",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Heal 12 HP. Remove 1 status.",
        upgradedDescription: "Heal 18 HP. Remove all statuses.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 18 : 12);
            if (state.statuses) {
                if (card.upgraded) {
                    state.statuses = {};
                } else {
                    const keys = Object.keys(state.statuses);
                    if (keys.length > 0) delete state.statuses[keys[0]];
                }
            }
        },
        upgraded: false
    }),

    ShieldOfDevotion: () => createCard({
        name: "Shield of Devotion",
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

    RighteousFervor: () => createCard({
        name: "Righteous Fervor",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 2 actions.",
        upgradedDescription: "Gain 2 actions. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.actions += 2;
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    ConsecratedBlade: () => createCard({
        name: "Consecrated Blade",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. Heal 5 if enemy is Evil.",
        upgradedDescription: "Deal 14 damage. Heal 7 if enemy is Evil.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 14 : 10) * state.nextAttackBonus);
                if (target.tags?.includes("Evil")) state.playerHeal(card.upgraded ? 7 : 5);
            }
        },
        upgraded: false
    }),

    MassHealing: () => createCard({
        name: "Mass Healing",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 25 HP.",
        upgradedDescription: "Heal 40 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 40 : 25);
        },
        upgraded: false
    }),

    WarpriestsFocus: () => createCard({
        name: "Warpriest's Focus",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 mana. Gain 4 armor.",
        upgradedDescription: "Gain 3 mana. Gain 6 armor.",
        effect: (_, state, card) => {
            state.mana += card.upgraded ? 3 : 2;
            state.playerArmor(card.upgraded ? 6 : 4);
        },
        upgraded: false
    }),

    HammerOfFaith: () => createCard({
        name: "Hammer of Faith",
        actionCost: 2,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 22 damage. Stun for 1 turn.",
        upgradedDescription: "Deal 30 damage. Stun for 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 30 : 22) * state.nextAttackBonus);
                target.applyStatus("Stunned", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    Persistence: () => createCard({
        name: "Persistence",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 1 card. Gain 2 armor.",
        upgradedDescription: "Draw 2 cards. Gain 3 armor.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 2 : 1, scene);
            state.playerArmor(card.upgraded ? 3 : 2);
        },
        upgraded: false
    }),

    DivineStorm: () => createCard({
        name: "Divine Storm",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 8 damage to all. Heal 4 per enemy hit.",
        upgradedDescription: "Deal 12 damage to all. Heal 6 per enemy hit.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 12 : 8;
            const heal = card.upgraded ? 6 : 4;
            let hits = 0;
            state.enemies.forEach(e => { if (e.isAlive) { e.takeDamage(damage); hits++; } });
            state.playerHeal(heal * hits);
        },
        upgraded: false
    }),

    BattleMeditation: () => createCard({
        name: "Battle Meditation",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 mana. Heal 4.",
        upgradedDescription: "Gain 3 mana. Heal 6.",
        effect: (_, state, card) => {
            state.mana += card.upgraded ? 3 : 2;
            state.playerHeal(card.upgraded ? 6 : 4);
        },
        upgraded: false
    }),

    Absolution: () => createCard({
        name: "Absolution",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 15 HP. Gain 10 armor. Draw 2 cards.",
        upgradedDescription: "Heal 22 HP. Gain 15 armor. Draw 3 cards.",
        effect: (_, state, card, scene) => {
            state.playerHeal(card.upgraded ? 22 : 15);
            state.playerArmor(card.upgraded ? 15 : 10);
            state.drawCards(card.upgraded ? 3 : 2, scene);
        },
        upgraded: false
    }),

    WrathfulSmite: () => createCard({
        name: "Wrathful Smite",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 damage. Apply Weakened for 1 turn.",
        upgradedDescription: "Deal 13 damage. Apply Weakened for 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 13 : 9) * state.nextAttackBonus);
                target.applyStatus("Weakened", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    SacredFlame: () => createCard({
        name: "Sacred Flame",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 7 true damage.",
        upgradedDescription: "Deal 11 true damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 11 : 7);
        },
        upgraded: false
    }),

    Endurance: () => createCard({
        name: "Endurance",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain +5 max HP permanently.",
        upgradedDescription: "Gain +8 max HP permanently.",
        isOncePerDay: true,
        effect: (_, state, card) => {
            state.gainHealth(card.upgraded ? 8 : 5);
        },
        upgraded: false
    }),

    BattlePrayer: () => createCard({
        name: "Battle Prayer",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 5. Gain 5 armor. Draw 1 card.",
        upgradedDescription: "Heal 8. Gain 8 armor. Draw 1 card.",
        effect: (_, state, card, scene) => {
            const amount = card.upgraded ? 8 : 5;
            state.playerHeal(amount);
            state.playerArmor(amount);
            state.drawCards(1, scene);
        },
        upgraded: false
    })
}