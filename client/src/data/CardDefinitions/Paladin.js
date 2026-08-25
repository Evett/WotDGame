import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SmiteEvil: () => createCard({
        name: "Smite Evil",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 11 damage.",
        upgradedDescription: "Deal 17 damage.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 17 : 11;
                target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    CureLightWounds: () => createCard({
        name: "Cure Light Wounds",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 10 HP.",
        upgradedDescription: "Heal 15 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    DivineShield: () => createCard({
        name: "Divine Shield",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 8 armor.",
        upgradedDescription: "Gain 13 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 13 : 8);
        },
        upgraded: false
    }),

    ChannelEnergy: () => createCard({
        name: "Channel Energy",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 12 true damage to all enemies.",
        upgradedDescription: "Deal 18 true damage to all enemies.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 18 : 12;
            state.enemies.forEach(e => { if (e.isAlive) e.takeTrueDamage(amount); });
        },
        upgraded: false
    }),

    AuraOfCourage: () => createCard({
        name: "Aura of Courage",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 6 armor.",
        upgradedDescription: "Gain 10 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 10 : 6);
        },
        upgraded: false
    }),

    Ironskin: () => createCard({
        name: "Ironskin",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Heal 5 HP. Gain 5 armor.",
        upgradedDescription: "Heal 8 HP. Gain 8 armor.",
        effect: (_, state, card) => {
            const amount = card.upgraded ? 8 : 5;
            state.playerHeal(amount);
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    DevastatingStrike: () => createCard({
        name: "Devastating Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Gain 3 armor.",
        upgradedDescription: "Deal 10 damage. Gain 5 armor.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 10 : 7));
            state.playerArmor(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    ChannelPositiveEnergy: () => createCard({
        name: "Channel Positive Energy",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Heal 8 HP. Deal 8 damage to Undead enemies.",
        upgradedDescription: "Heal 12 HP. Deal 12 damage to Undead enemies.",
        effect: (_, state, card) => {
            const amount = card.upgraded ? 12 : 8;
            state.playerHeal(amount);
            state.enemies.forEach(e => {
                if (e.isAlive && e.tags?.includes("Undead")) e.takeDamage(amount);
            });
        },
        upgraded: false
    }),

    ShieldOfFaith: () => createCard({
        name: "Shield of Faith",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 10 armor.",
        upgradedDescription: "Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    AngelicAspect: () => createCard({
        name: "AngelicAspect",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain +5 max HP permanently. Heal 5.",
        upgradedDescription: "Gain +8 max HP permanently. Heal 8.",
        effect: (_, state, card) => {
            state.gainHealth(card.upgraded ? 8 : 5);
        },
        upgraded: false
    }),

    HolyJavelin: () => createCard({
        name: "Holy Javelin",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 20 damage. Triple vs Evil.",
        upgradedDescription: "Deal 28 damage. Triple vs Evil.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 28 : 20;
                const isEvil = target.tags?.includes("Evil");
                target.takeDamage(state.calcDamage(isEvil ? base * 3 : base));
            }
        },
        upgraded: false
    }),

    Restoration: () => createCard({
        name: "Restoration",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 6 HP. Draw 1 card.",
        upgradedDescription: "Heal 9 HP. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerHeal(card.upgraded ? 9 : 6);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    LightOfIomedae: () => createCard({
        name: "Light of Iomedae",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 7 damage to all enemies. Gain 5 armor.",
        upgradedDescription: "Deal 11 damage to all enemies. Gain 8 armor.",
        effect: (_, state, card) => {
            const amount = card.upgraded ? 11 : 7;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(amount); });
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    BullsStrength: () => createCard({
        name: "Bull's Strength",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain +2 attack damage for 2 turns.",
        upgradedDescription: "Gain +3 attack damage for 3 turns.",
        effect: (_, state, card) => {
            const bonus = card.upgraded ? 3 : 2;
            state.applyPlayerBuff("AttackBonus", bonus, 3);
        },
        upgraded: false
    }),

    FireOfJudgement: () => createCard({
        name: "Fire of Judgement",
        actionCost: 0,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 true damage.",
        upgradedDescription: "Deal 13 true damage.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 13 : 9;
                target.takeTrueDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    RadiantCharge: () => createCard({
        name: "Radiant Charge",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Heal 3.",
        upgradedDescription: "Deal 9 damage. Heal 5.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 9 : 6));
            state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    ProtectionFromEvil: () => createCard({
        name: "Protection from Evil",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 12 armor.",
        upgradedDescription: "Gain 18 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 18 : 12);
        },
        upgraded: false
    }),

    AuraOfFaith: () => createCard({
        name: "Aura of Faith",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. If enemy is Evil, gain 5 armor.",
        upgradedDescription: "Deal 14 damage. If enemy is Evil, gain 8 armor.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 14 : 10));
                if (target.tags?.includes("Evil")) state.playerArmor(card.upgraded ? 8 : 5);
            }
        },
        upgraded: false
    }),

    InspiringRecovery: () => createCard({
        name: "Inspiring Recovery",
        actionCost: 3,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal to full HP.",
        upgradedDescription: "Heal to full HP. Gain 15 armor.",
        effect: (_, state, card) => {
            state.playerHeal(state.maxHealth);
            if (card.upgraded) state.playerArmor(15);
        },
        upgraded: false
    }),

    GreaterAngelicAspect: () => createCard({
        name: "Greater Angelic Aspect",
        actionCost: 2,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain +5 attack for 4 turns.",
        upgradedDescription: "Gain +8 attack for 4 turns.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 8 : 5, 4);
        },
        upgraded: false
    }),

    AuraOfRighteousness: () => createCard({
        name: "Aura of Righteousness",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Stun all non-boss enemies for 1 turn.",
        upgradedDescription: "Stun all enemies for 1 turn.",
        effect: (_, state, card) => {
            state.enemies.forEach(e => {
                if (e.isAlive && (card.upgraded || !e.isBoss)) {
                    e.applyStatus("Stunned", 1);
                }
            });
        },
        upgraded: false
    }),

    DivineGrace: () => createCard({
        name: "Divine Grace",
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

    DivineHealth: () => createCard({
        name: "Divine Health",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 6 armor. Gain 1 mana.",
        upgradedDescription: "Gain 9 armor. Gain 2 mana.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 9 : 6);
            state.mana += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    VitalStrike: () => createCard({
        name: "Vital Strike",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 17 damage.",
        upgradedDescription: "Deal 25 damage.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 25 : 17;
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    HerosDefiance: () => createCard({
        name: "Hero's Defiance",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 4 armor. Gain 1 action.",
        upgradedDescription: "Gain 6 armor. Gain 1 action.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 6 : 4);
            state.actions += 1;
        },
        upgraded: false
    }),

    DimensionalBlade: () => createCard({
        name: "Dimensional Blade",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 5 true damage to all enemies.",
        upgradedDescription: "Deal 9 true damage to all enemies.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 9 : 5;
            state.enemies.forEach(e => { if (e.isAlive) e.takeTrueDamage(damage); });
        },
        upgraded: false
    }),

    Adeline: () => createCard({
        name: "Adeline",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 2 actions this turn.",
        upgradedDescription: "Gain 2 actions. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.actions += 2;
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    DispelEvil: () => createCard({
        name: "Dispel Evil",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 30 damage to an Evil or Undead enemy.",
        upgradedDescription: "Deal 45 damage to an Evil or Undead enemy.",
        effect: (target, state, card) => {
            if (target && (target.tags?.includes("Evil") || target.tags?.includes("Undead"))) {
                target.takeDamage(state.calcDamage(card.upgraded ? 45 : 30));
            }
        },
        upgraded: false
    }),

    AbsorbAttack: () => createCard({
        name: "Absorb Attack",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Lose 8 HP. Gain 15 armor.",
        upgradedDescription: "Lose 8 HP. Gain 22 armor.",
        effect: (_, state, card) => {
            state.playerTakeDamage(8);
            state.playerArmor(card.upgraded ? 22 : 15);
        },
        upgraded: false
    }),

    AuraOfJustice: () => createCard({
        name: "Aura of Justice",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "All attacks deal +3 damage for rest of combat.",
        upgradedDescription: "All attacks deal +5 damage for rest of combat.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 5 : 3, 99);
        },
        upgraded: false
    }),

    FullAttack: () => createCard({
        name: "Full Attack",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Deal 4 to adjacent enemies.",
        upgradedDescription: "Deal 12 damage. Deal 6 to adjacent enemies.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 12 : 8));
                const splash = card.upgraded ? 6 : 4;
                state.enemies.forEach(e => {
                    if (e.isAlive && e !== target) e.takeDamage(splash);
                });
            }
        },
        upgraded: false
    })
}