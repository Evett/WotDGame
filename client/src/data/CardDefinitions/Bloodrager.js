import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    FlyingBlade: () => createCard({
        name: "Flying Blade",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. Take 3 damage.",
        upgradedDescription: "Deal 15 damage. Take 3 damage.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 15 : 10;
                target.takeDamage(state.calcDamage(damage));
                state.playerTakeDamage(3);
            }
        },
        upgraded: false
    }),

    Rage: () => createCard({
        name: "Rage",
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

    BloodCasting: () => createCard({
        name: "Blood Casting",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Draw 2 cards. Lose 5 HP.",
        upgradedDescription: "Draw 3 cards. Lose 4 HP.",
        effect: (_, state, card, scene) => {
            const draws = card.upgraded ? 3 : 2;
            const hpLoss = card.upgraded ? 4 : 5;
            state.drawCards(draws, scene);
            state.playerTakeDamage(hpLoss);
        },
        upgraded: false
    }),

    DraconicClaws: () => createCard({
        name: "Draconic Claws",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 damage.",
        upgradedDescription: "Deal 14 damage.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 14 : 9));
            }
        },
        upgraded: false
    }),

    Spelleating: () => createCard({
        name: "Spelleating",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Heal for damage dealt.",
        upgradedDescription: "Deal 11 damage. Heal for damage dealt.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 11 : 7;
                target.takeDamage(state.calcDamage(damage));
                state.playerHeal(damage);
            }
        },
        upgraded: false
    }),

    TirelessBloodRage: () => createCard({
        name: "Tireless Bloodrage",
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

    FireBreath: () => createCard({
        name: "Fire Breath",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 11 damage to all enemies. Take 2 damage.",
        upgradedDescription: "Deal 17 damage to all enemies. Take 2 damage.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 17 : 11;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(state.calcDamage(damage)); });
            state.playerTakeDamage(2);
        },
        upgraded: false
    }),

    BloodSurge: () => createCard({
        name: "Blood Surge",
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

    FullAttack: () => createCard({
        name: "Full Attack",
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
                    target.takeDamage(state.calcDamage(damage));
                }
            }
        },
        upgraded: false
    }),

    AllConsumingSwing: () => createCard({
        name: "All-Consuming Swing",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 8 damage to all enemies. Heal 2 per enemy hit.",
        upgradedDescription: "Deal 12 damage to all enemies. Heal 3 per enemy hit.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 12 : 8;
            const heal = card.upgraded ? 3 : 2;
            let hits = 0;
            state.enemies.forEach(e => { if (e.isAlive) { e.takeDamage(damage); hits++; } });
            state.playerHeal(heal * hits);
        },
        upgraded: false
    }),

    ArmorProficiency: () => createCard({
        name: "Armor Proficiency",
        actionCost: 1,
        manaCost: 0,
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
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 20 damage. Take 6 damage.",
        upgradedDescription: "Deal 28 damage. Take 6 damage.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 28 : 20));
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
        description: "Next attack deals true damage (ignores armor).",
        upgradedDescription: "Next 2 attacks deal true damage (ignores armor).",
        effect: (_, state, card) => {
            state.applyPlayerBuff("ArmorPierce", card.upgraded ? 2 : 1, 1);
        },
        upgraded: false
    }),

    FastHealer: () => createCard({
        name: "Fast Healer",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 3 HP",
        upgradedDescription: "Heal 5 HP.",
        effect: (_, state, card) => {
            const missing = state.maxHealth - state.health;
            const cap = card.upgraded ? 5 : 3;
            state.playerHeal(Math.min(missing, cap));
        },
        upgraded: false
    }),

    VitalStrike: () => createCard({
        name: "Vital Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 12 true damage.",
        upgradedDescription: "Deal 18 true damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 18 : 12);
        },
        upgraded: false
    }),

    Charge: () => createCard({
        name: "Feral Charge",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Gain 4 armor.",
        upgradedDescription: "Deal 9 damage. Gain 6 armor.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 9 : 6));
            state.playerArmor(card.upgraded ? 6 : 4);
        },
        upgraded: false
    }),

    Diehard: () => createCard({
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
            if (target) target.takeDamage(state.calcDamage(damage));
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
        description: "Lose all armor. Next attack deals +10 damage.",
        upgradedDescription: "Lose all armor. Next attack deals +15 damage.",
        effect: (_, state, card) => {
            const armorLost = state.armor || 0;
            state.armor = 0;
            state.flatDamageBonus += card.upgraded ? 15 : 10;
        },
        upgraded: false
    }),

    DraconicBloodline: () => createCard({
        name: "Draconic Bloodline",
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

    Fireball: () => createCard({
        name: "Bloodbath",
        actionCost: 2,
        manaCost: 1,
        type: "Attack",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 14 damage to all. Heal 5.",
        upgradedDescription: "Deal 20 damage to all. Heal 8.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 20 : 14;
            const heal = card.upgraded ? 8 : 5;
            state.playerHeal(heal);
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                }
            });
        },
        upgraded: false
    }),

    SwordWall: () => createCard({
        name: "Sword Wall",
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

    ImprovedVitalStrike: () => createCard({
        name: "ImprovedVitalStrike",
        actionCost: 2,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 16 damage. If below half HP, deal 24 instead.",
        upgradedDescription: "Deal 20 damage. If below half HP, deal 32 instead.",
        effect: (target, state, card) => {
            const low = state.health <= state.maxHealth / 2;
            const damage = low ? (card.upgraded ? 32 : 24) : (card.upgraded ? 20 : 16);
            if (target) target.takeDamage(state.calcDamage(damage));
        },
        upgraded: false
    }),

    Cleave: () => createCard({
        name: "Infernal Blood",
        actionCost: 1,
        manaCost: 0,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 9 damage to all enemies.",
        upgradedDescription: "Deal 13 damage to all enemies.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 13 : 9;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(state.calcDamage(damage)); });
        },
        upgraded: false
    }),

    CombatReflexes: () => createCard({
        name: "Combat Reflexes",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 12 damage. Take 5 damage. Draw 1 card.",
        upgradedDescription: "Deal 18 damage. Take 5 damage. Draw 2 cards.",
        effect: (target, state, card, scene) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 18 : 12));
            state.playerTakeDamage(5);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    Endurance: () => createCard({
        name: "Endurance",
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

    GreaterVitalStrike: () => createCard({
        name: "GreaterVitalStrike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Stun for 1 turn if enemy below half HP.",
        upgradedDescription: "Deal 12 damage. Stun for 1 turn if enemy below half HP.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 12 : 7;
                target.takeDamage(state.calcDamage(damage));
                if (target.isAlive && target.health <= target.maxHealth / 2) {
                    target.applyStatus("Stunned", 1);
                }
            }
        },
        upgraded: false
    }),

    BloodSanctuary: () => createCard({
        name: "Blood Sanctuary",
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
        description: "Gain +3 attack damage for the rest of combat.",
        upgradedDescription: "Gain +5 attack damage for the rest of combat.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 5 : 3, 99);
        },
        upgraded: false
    }),

    IndomitableWill: () => createCard({
        name: "Indomitable Will",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 actions. Draw 1 card. Lose 8 HP.",
        upgradedDescription: "Gain 3 actions. Draw 1 card. Lose 6 HP.",
        effect: (_, state, card, scene) => {
            state.actions += card.upgraded ? 3 : 2;
            state.playerTakeDamage(card.upgraded ? 6 : 8);
            state.drawCards(1, scene);
        },
        upgraded: false
    })
}