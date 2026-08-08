import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    BloodFury: () => createCard({
        name: "Blood Fury",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. Take 3 damage.",
        upgradedDescription: "Deal 15 damage. Take 3 damage.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 15 : 10;
                target.takeDamage(damage * state.nextAttackBonus);
                state.playerTakeDamage(3);
            }
        },
        upgraded: false
    }),

    RagingHowl: () => createCard({
        name: "Raging Howl",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain +2 attack damage for 2 turns.",
        upgradedDescription: "Gain +3 attack damage for 2 turns.",
        effect: (_, state, card) => {
            const bonus = card.upgraded ? 3 : 2;
            state.applyPlayerBuff("AttackBonus", bonus, 2);
        },
        upgraded: false
    }),

    ArcaneBloodline: () => createCard({
        name: "Arcane Bloodline",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Draw 2 cards. Lose 2 HP.",
        upgradedDescription: "Draw 3 cards. Lose 1 HP.",
        effect: (_, state, card, scene) => {
            const draws = card.upgraded ? 3 : 2;
            const hpLoss = card.upgraded ? 1 : 2;
            state.drawCards(draws, scene);
            state.playerTakeDamage(hpLoss);
        },
        upgraded: false
    }),

    GutRip: () => createCard({
        name: "Gut Rip",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Apply Bleed for 2 turns.",
        upgradedDescription: "Deal 11 damage. Apply Bleed for 3 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 11 : 8) * state.nextAttackBonus);
                target.applyStatus("Bleed", card.upgraded ? 3 : 2);
            }
        },
        upgraded: false
    }),

    BloodDrinker: () => createCard({
        name: "Blood Drinker",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Heal for damage dealt.",
        upgradedDescription: "Deal 11 damage. Heal for damage dealt.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 11 : 7;
                target.takeDamage(damage * state.nextAttackBonus);
                state.playerHeal(damage);
            }
        },
        upgraded: false
    }),

    PrimalRage: () => createCard({
        name: "Primal Rage",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain +4 attack for 3 turns. Lose 5 HP.",
        upgradedDescription: "Gain +6 attack for 3 turns. Lose 5 HP.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 6 : 4, 3);
            state.playerTakeDamage(5);
        },
        upgraded: false
    }),

    SavageCleave: () => createCard({
        name: "Savage Cleave",
        actionCost: 2,
        manaCost: 0,
        type: "Attack",
        requiresTarget: false,
        description: "Deal 6 damage to all enemies. Take 2 damage.",
        upgradedDescription: "Deal 10 damage to all enemies. Take 2 damage.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 10 : 6;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
            state.playerTakeDamage(2);
        },
        upgraded: false
    }),

    BloodlineSurge: () => createCard({
        name: "Bloodline Surge",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 2 actions. Lose 4 HP.",
        upgradedDescription: "Gain 3 actions. Lose 4 HP.",
        effect: (_, state, card) => {
            state.actions += card.upgraded ? 3 : 2;
            state.playerTakeDamage(4);
        },
        upgraded: false
    }),

    FrenzyStrike: () => createCard({
        name: "Frenzy Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 4 damage 3 times.",
        upgradedDescription: "Deal 5 damage 3 times.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 5 : 4;
            if (target) {
                for (let i = 0; i < 3; i++) {
                    target.takeDamage(damage * state.nextAttackBonus);
                }
            }
        },
        upgraded: false
    }),

    BloodMist: () => createCard({
        name: "Blood Mist",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 3 damage to all enemies. Heal 2 per enemy hit.",
        upgradedDescription: "Deal 5 damage to all enemies. Heal 3 per enemy hit.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 5 : 3;
            const heal = card.upgraded ? 3 : 2;
            let hits = 0;
            state.enemies.forEach(e => { if (e.isAlive) { e.takeDamage(damage); hits++; } });
            state.playerHeal(heal * hits);
        },
        upgraded: false
    }),

    ThickSkin: () => createCard({
        name: "Thick Skin",
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

    Rampage: () => createCard({
        name: "Rampage",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 20 damage. Take 6 damage.",
        upgradedDescription: "Deal 28 damage. Take 6 damage.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 28 : 20) * state.nextAttackBonus);
            state.playerTakeDamage(6);
        },
        upgraded: false
    }),

    UnstoppableForce: () => createCard({
        name: "Unstoppable Force",
        actionCost: 1,
        manaCost: 0,
        type: "Power",
        requiresTarget: false,
        description: "Next attack ignores armor.",
        upgradedDescription: "Next 2 attacks ignore armor.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("ArmorPierce", 1, card.upgraded ? 2 : 1);
        },
        upgraded: false
    }),

    RageHealing: () => createCard({
        name: "Rage Healing",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal HP equal to your missing health (max 15).",
        upgradedDescription: "Heal HP equal to your missing health (max 25).",
        effect: (_, state, card) => {
            const missing = state.maxHealth - state.health;
            const cap = card.upgraded ? 25 : 15;
            state.playerHeal(Math.min(missing, cap));
        },
        upgraded: false
    }),

    AberrantBloodline: () => createCard({
        name: "Aberrant Bloodline",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 12 true damage.",
        upgradedDescription: "Deal 18 true damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 18 : 12);
        },
        upgraded: false
    }),

    FeralCharge: () => createCard({
        name: "Feral Charge",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Gain 4 armor.",
        upgradedDescription: "Deal 9 damage. Gain 6 armor.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 9 : 6) * state.nextAttackBonus);
            state.playerArmor(card.upgraded ? 6 : 4);
        },
        upgraded: false
    }),

    BloodyVengeance: () => createCard({
        name: "Bloody Vengeance",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 4 + (missing HP / 5) damage.",
        upgradedDescription: "Deal 6 + (missing HP / 4) damage.",
        effect: (target, state, card) => {
            const missing = state.maxHealth - state.health;
            const damage = card.upgraded ? 6 + Math.floor(missing / 4) : 4 + Math.floor(missing / 5);
            if (target) target.takeDamage(damage * state.nextAttackBonus);
        },
        upgraded: false
    }),

    IntimidatingPresence: () => createCard({
        name: "Intimidating Presence",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: true,
        description: "Stun a non-boss enemy for 1 turn.",
        upgradedDescription: "Stun any enemy for 1 turn.",
        effect: (target, state, card) => {
            if (target && (card.upgraded || !target.isBoss)) {
                target.applyStatus("Stunned", 1);
            }
        },
        upgraded: false
    }),

    RecklessAbandon: () => createCard({
        name: "Reckless Abandon",
        actionCost: 0,
        manaCost: 0,
        type: "Power",
        requiresTarget: false,
        description: "Lose all armor. Next attack deals +damage equal to armor lost.",
        upgradedDescription: "Lose all armor. Next attack deals +damage (x1.5) equal to armor lost.",
        effect: (_, state, card) => {
            const armorLost = state.armor || 0;
            state.armor = 0;
            state.nextAttackBonus += card.upgraded ? Math.floor(armorLost * 1.5) : armorLost;
        },
        upgraded: false
    }),

    CelestialBloodline: () => createCard({
        name: "Celestial Bloodline",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 20 HP. Gain 5 armor.",
        upgradedDescription: "Heal 30 HP. Gain 10 armor.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 30 : 20);
            state.playerArmor(card.upgraded ? 10 : 5);
        },
        upgraded: false
    }),

    Bloodbath: () => createCard({
        name: "Bloodbath",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 8 damage to all. Heal 5 per kill.",
        upgradedDescription: "Deal 14 damage to all. Heal 8 per kill.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 14 : 8;
            const heal = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                    if (!e.isAlive) state.playerHeal(heal);
                }
            });
        },
        upgraded: false
    }),

    DraconicBloodline: () => createCard({
        name: "Draconic Bloodline",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 8 armor. Deal 5 damage to all enemies.",
        upgradedDescription: "Gain 12 armor. Deal 8 damage to all enemies.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 12 : 8);
            const damage = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
        },
        upgraded: false
    }),

    BloodRage: () => createCard({
        name: "Blood Rage",
        actionCost: 0,
        manaCost: 0,
        type: "Power",
        requiresTarget: false,
        description: "Lose 3 HP. Draw 2 cards.",
        upgradedDescription: "Lose 2 HP. Draw 3 cards.",
        effect: (_, state, card, scene) => {
            state.playerTakeDamage(card.upgraded ? 2 : 3);
            state.drawCards(card.upgraded ? 3 : 2, scene);
        },
        upgraded: false
    }),

    DevastatingBlow: () => createCard({
        name: "Devastating Blow",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 16 damage. If below half HP, deal 24 instead.",
        upgradedDescription: "Deal 20 damage. If below half HP, deal 32 instead.",
        effect: (target, state, card) => {
            const low = state.health <= state.maxHealth / 2;
            const damage = low ? (card.upgraded ? 32 : 24) : (card.upgraded ? 20 : 16);
            if (target) target.takeDamage(damage * state.nextAttackBonus);
        },
        upgraded: false
    }),

    InfernalBlood: () => createCard({
        name: "Infernal Blood",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 9 damage. Apply Burn for 2 turns.",
        upgradedDescription: "Deal 13 damage. Apply Burn for 3 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage((card.upgraded ? 13 : 9) * state.nextAttackBonus);
                target.applyStatus("Burn", card.upgraded ? 3 : 2);
            }
        },
        upgraded: false
    }),

    Deathwish: () => createCard({
        name: "Deathwish",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 12 damage. Take 5 damage. Draw 1 card.",
        upgradedDescription: "Deal 18 damage. Take 5 damage. Draw 2 cards.",
        effect: (target, state, card, scene) => {
            if (target) target.takeDamage((card.upgraded ? 18 : 12) * state.nextAttackBonus);
            state.playerTakeDamage(5);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    UndyingRage: () => createCard({
        name: "Undying Rage",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain 10 max HP permanently.",
        upgradedDescription: "Gain 15 max HP permanently.",
        effect: (_, state, card) => {
            state.gainHealth(card.upgraded ? 15 : 10);
        },
        upgraded: false
    }),

    BerserkerSlam: () => createCard({
        name: "Berserker Slam",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Stun for 1 turn if enemy below half HP.",
        upgradedDescription: "Deal 10 damage. Stun for 1 turn if enemy below half HP.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 10 : 7;
                target.takeDamage(damage * state.nextAttackBonus);
                if (target.isAlive && target.health <= target.maxHealth / 2) {
                    target.applyStatus("Stunned", 1);
                }
            }
        },
        upgraded: false
    }),

    SpellEater: () => createCard({
        name: "Spell Eater",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 4 armor. Gain 1 mana.",
        upgradedDescription: "Gain 6 armor. Gain 2 mana.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 6 : 4);
            state.mana += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    GreaterBloodrage: () => createCard({
        name: "Greater Bloodrage",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Double your attack bonus for the rest of combat.",
        upgradedDescription: "Triple your attack bonus for the rest of combat.",
        effect: (_, state, card) => {
            state.nextAttackBonus *= card.upgraded ? 3 : 2;
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 6 : 4, 99);
        },
        upgraded: false
    }),

    MightyRage: () => createCard({
        name: "Mighty Rage",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 2 actions. Lose 8 HP.",
        upgradedDescription: "Gain 3 actions. Lose 8 HP.",
        effect: (_, state, card) => {
            state.actions += card.upgraded ? 3 : 2;
            state.playerTakeDamage(8);
        },
        upgraded: false
    })
}