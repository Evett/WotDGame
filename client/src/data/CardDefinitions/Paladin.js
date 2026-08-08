import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SmiteEvil: () => createCard({
        name: "Smite Evil",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Double if enemy is Evil.",
        upgradedDescription: "Deal 12 damage. Double if enemy is Evil.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 12 : 8;
                const isEvil = target.tags?.includes("Evil");
                const damage = isEvil ? base * 2 : base;
                target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    LayOnHands: () => createCard({
        name: "Lay on Hands",
        actionCost: 1,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 10 HP.",
        upgradedDescription: "Heal 15 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    DivineShield: () => createCard({
        name: "Divine Shield",
        actionCost: 1,
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

    HolySmite: () => createCard({
        name: "Holy Smite",
        actionCost: 1,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 12 true damage to Evil enemies. 6 to others.",
        upgradedDescription: "Deal 18 true damage to Evil enemies. 9 to others.",
        effect: (target, state, card) => {
            if (target) {
                const isEvil = target.tags?.includes("Evil");
                const damage = isEvil ? (card.upgraded ? 18 : 12) : (card.upgraded ? 9 : 6);
                target.takeTrueDamage(damage);
            }
        },
        upgraded: false
    }),

    AuraOfCourage: () => createCard({
        name: "Aura of Courage",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 5 armor. Remove 1 debuff.",
        upgradedDescription: "Gain 8 armor. Remove all debuffs.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 8 : 5);
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

    DivineGrace: () => createCard({
        name: "Divine Grace",
        actionCost: 0,
        manaCost: 2,
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

    SwordOfValor: () => createCard({
        name: "Sword of Valor",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Gain 3 armor.",
        upgradedDescription: "Deal 10 damage. Gain 5 armor.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 10 : 7) * state.nextAttackBonus);
            state.playerArmor(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    ChannelPositiveEnergy: () => createCard({
        name: "Channel Positive Energy",
        actionCost: 1,
        manaCost: 2,
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

    RighteousMight: () => createCard({
        name: "Righteous Might",
        actionCost: 1,
        manaCost: 2,
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

    HolyAvenger: () => createCard({
        name: "Holy Avenger",
        actionCost: 2,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 20 damage. Triple vs Evil.",
        upgradedDescription: "Deal 28 damage. Triple vs Evil.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 28 : 20;
                const isEvil = target.tags?.includes("Evil");
                target.takeDamage((isEvil ? base * 3 : base) * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    MercysBlessing: () => createCard({
        name: "Mercy's Blessing",
        actionCost: 1,
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

    Consecrate: () => createCard({
        name: "Consecrate",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 5 damage to all enemies. Gain 5 armor.",
        upgradedDescription: "Deal 8 damage to all enemies. Gain 8 armor.",
        effect: (_, state, card) => {
            const amount = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(amount); });
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    DivineBond: () => createCard({
        name: "Divine Bond",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Your next attack heals you for damage dealt.",
        upgradedDescription: "Your next 2 attacks heal you for damage dealt.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("Lifesteal", 1, card.upgraded ? 2 : 1);
        },
        upgraded: false
    }),

    Retribution: () => createCard({
        name: "Retribution",
        actionCost: 0,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal damage equal to your armor (max 12).",
        upgradedDescription: "Deal damage equal to your armor (max 18).",
        effect: (target, state, card) => {
            if (target) {
                const cap = card.upgraded ? 18 : 12;
                const damage = Math.min(state.armor || 0, cap);
                target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    CrusadersStrike: () => createCard({
        name: "Crusader's Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Heal 3.",
        upgradedDescription: "Deal 9 damage. Heal 5.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 9 : 6) * state.nextAttackBonus);
            state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    ProtectionFromEvil: () => createCard({
        name: "Protection from Evil",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 12 armor.",
        upgradedDescription: "Gain 18 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 18 : 12);
        },
        upgraded: false
    }),

    ZealousStrike: () => createCard({
        name: "Zealous Strike",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. If enemy is Evil, gain 5 armor.",
        upgradedDescription: "Deal 14 damage. If enemy is Evil, gain 8 armor.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 14 : 10) * state.nextAttackBonus);
                if (target.tags?.includes("Evil")) state.playerArmor(card.upgraded ? 8 : 5);
            }
        },
        upgraded: false
    }),

    HandOfTheHealer: () => createCard({
        name: "Hand of the Healer",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal to full HP.",
        upgradedDescription: "Heal to full HP. Gain 10 armor.",
        effect: (_, state, card) => {
            state.playerHeal(state.maxHealth);
            if (card.upgraded) state.playerArmor(10);
        },
        upgraded: false
    }),

    JudgmentOfLight: () => createCard({
        name: "Judgment of Light",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 10 damage. Heal 10 HP.",
        upgradedDescription: "Deal 15 damage. Heal 15 HP.",
        effect: (target, state, card) => {
            const amount = card.upgraded ? 15 : 10;
            if (target) target.takeDamage(amount * state.nextAttackBonus);
            state.playerHeal(amount);
        },
        upgraded: false
    }),

    HeavenlyShout: () => createCard({
        name: "Heavenly Shout",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
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

    GuidingLight: () => createCard({
        name: "Guiding Light",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 2 cards.",
        upgradedDescription: "Draw 3 cards.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 3 : 2, scene);
        },
        upgraded: false
    }),

    VowOfPoverty: () => createCard({
        name: "Vow of Poverty",
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

    RadiantSlash: () => createCard({
        name: "Radiant Slash",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 damage. If you healed this turn, deal 14 instead.",
        upgradedDescription: "Deal 12 damage. If you healed this turn, deal 20 instead.",
        effect: (target, state, card) => {
            const healed = state.buffs?.Lifesteal || state.health > state.maxHealth * 0.9;
            const damage = healed ? (card.upgraded ? 20 : 14) : (card.upgraded ? 12 : 9);
            if (target) target.takeDamage(damage * state.nextAttackBonus);
        },
        upgraded: false
    }),

    PaladinsMarch: () => createCard({
        name: "Paladin's March",
        actionCost: 1,
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

    DivineJustice: () => createCard({
        name: "Divine Justice",
        actionCost: 2,
        manaCost: 2,
        type: "Attack",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 10 true damage to all enemies.",
        upgradedDescription: "Deal 16 true damage to all enemies.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 16 : 10;
            state.enemies.forEach(e => { if (e.isAlive) e.takeTrueDamage(damage); });
        },
        upgraded: false
    }),

    FaithfulSteed: () => createCard({
        name: "Faithful Steed",
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

    HolyWord: () => createCard({
        name: "Holy Word",
        actionCost: 1,
        manaCost: 3,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 30 damage to an Evil or Undead enemy.",
        upgradedDescription: "Deal 40 damage to an Evil or Undead enemy.",
        effect: (target, state, card) => {
            if (target && (target.tags?.includes("Evil") || target.tags?.includes("Undead"))) {
                target.takeDamage((card.upgraded ? 40 : 30) * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    Martyrdom: () => createCard({
        name: "Martyrdom",
        actionCost: 1,
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
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "All attacks deal +3 vs Evil for rest of combat.",
        upgradedDescription: "All attacks deal +5 vs Evil for rest of combat.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("HolyDamage", card.upgraded ? 5 : 3, 99);
        },
        upgraded: false
    }),

    BlessedHammer: () => createCard({
        name: "Blessed Hammer",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Deal 4 to adjacent enemies.",
        upgradedDescription: "Deal 12 damage. Deal 6 to adjacent enemies.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 12 : 8) * state.nextAttackBonus);
                const splash = card.upgraded ? 6 : 4;
                state.enemies.forEach(e => {
                    if (e.isAlive && e !== target) e.takeDamage(splash);
                });
            }
        },
        upgraded: false
    })
}