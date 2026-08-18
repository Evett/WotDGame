import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SacredStrike: () => createCard({
        name: "Sacred Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Heal for half.",
        upgradedDescription: "Deal 12 damage. Heal for half.",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 12 : 8;
                target.takeDamage(state.calcDamage(damage));
                state.playerHeal(Math.floor(damage / 2));
            }
        },
        upgraded: false
    }),

    StrengthSurge: () => createCard({
        name: "Strength Surge",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 strength for 2 turns.",
        upgradedDescription: "Gain 4 strength for 2 turns.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("Strength", card.upgraded ? 4 : 2, 2);
        },
        upgraded: false
    }),

    Fervor: () => createCard({
        name: "Fervor",
        actionCost: 1,
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

    SacredWeapon: () => createCard({
        name: "Sacred Weapon",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Next attack deals double damage.",
        upgradedDescription: "Next attack deals triple damage.",
        effect: (_, state, card) => {
            state.nextAttackMultiplier *= card.upgraded ? 3 : 2;
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
        upgradedDescription: "Deal 10 damage. Gain 2 mana.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 10 : 6));
            state.mana += card.upgraded ? 2 : 1;
        },
        upgraded: false
    }),

    SacredArmor: () => createCard({
        name: "Sacred Armor",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 7 armor.",
        upgradedDescription: "Gain 11 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 11 : 7);
        },
        upgraded: false
    }),

    CureLightWounds: () => createCard({
        name: "Cure Light Wounds",
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

    DivineFavor: () => createCard({
        name: "Divine Favor",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 12 damage. Heal 6 HP.",
        upgradedDescription: "Deal 18 damage. Heal 9 HP.",
        effect: (target, state, card) => {
            if (target) target.takeDamage(state.calcDamage(card.upgraded ? 18 : 12));
            state.playerHeal(card.upgraded ? 9 : 6);
        },
        upgraded: false
    }),

    GuardianArmor: () => createCard({
        name: "Guardian Armor",
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

    Ironskin: () => createCard({
        name: "Ironskin",
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

    ShieldBonk: () => createCard({
        name: "Shield Bonk",
        actionCost: 0,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal damage equal to your armor.",
        upgradedDescription: "Deal damage equal to twice your armor",
        effect: (target, state, card) => {
            if (target) {
                const damage = state.armor;
                target.takeDamage(state.calcDamage(card.upgraded ? damage * 2 : damage));
            }
        },
        upgraded: false
    }),

    Sunmetal: () => createCard({
        name: "Sunmetal",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain +3 to all attacks for 4 turns.",
        upgradedDescription: "Gain +5 to all attacks for 4 turns.",
        effect: (_, state, card) => {
            state.applyPlayerBuff("AttackBonus", card.upgraded ? 5 : 3, 4);
        },
        upgraded: false
    }),

    SummonRhinoceros: () => createCard({
        name: "Summon Rhinoceros",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Summon a Rhinoceros that deals 5 damage each turn for 3 turns.",
        upgradedDescription: "Summon a Rhinoceros that deals 8 damage each turn for 3 turns.",
        effect: (_, state, card) => {
            state.summonAlly({ name: "Rhinoceros", damage: card.upgraded ? 8 : 5, duration: 3 });
        },
        upgraded: false
    }),

    Blessing: () => createCard({
        name: "Blessing",
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

    Ironhide: () => createCard({
        name: "Retaliation",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage. Gain 6 armor.",
        upgradedDescription: "Deal 10 damage. Gain 10 armor.",
        effect: (target, state, card) => {
            const amount = card.upgraded ? 10 : 6;
            if (target) target.takeDamage(state.calcDamage(amount));
            state.playerArmor(amount);
        },
        upgraded: false
    }),

    ForGorum: () => createCard({
        name: "For Gorum",
        actionCost: 2,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage 3 times.",
        upgradedDescription: "Deal 12 damage 3 times.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 12 : 8;
            if (target) {
                for (let i = 0; i < 3; i++) target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    CureModerateWounds: () => createCard({
        name: "Heal",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Heal 12 HP.",
        upgradedDescription: "Heal 18 HP.",
        effect: (_, state, card) => {
            state.playerHeal(card.upgraded ? 18 : 12);
        },
        upgraded: false
    }),

    ShieldOfGorum: () => createCard({
        name: "Shield of Gorum",
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

    BreathOfLife: () => createCard({
        name: "Breath of Life",
        actionCost: 0,
        manaCost: 0,
        type: "Power",
        requiresTarget: false,
        description: "Gain 2 actions. Draw 1 card.",
        upgradedDescription: "Gain 3 actions. Draw 2 card.",
        effect: (_, state, card, scene) => {
            state.actions += card.upgraded ? 3 : 2;
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    DeadlyJuggernaut: () => createCard({
        name: "Deadly Juggernaut",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 15 damage.",
        upgradedDescription: "Deal 20 damage.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 20 : 15));
            }
        },
        upgraded: false
    }),

    Heal: () => createCard({
        name: "Heal",
        actionCost: 2,
        manaCost: 2,
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

    HeroesFeast: () => createCard({
        name: "Heroes' Feast",
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

    SummonStampede: () => createCard({
        name: "SummonStampede",
        actionCost: 2,
        manaCost: 2,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 22 damage. Stun for 1 turn.",
        upgradedDescription: "Deal 30 damage. Stun for 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 30 : 22));
                target.applyStatus("Stunned", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    MusicOfTheSpheres: () => createCard({
        name: "Music of the Spheres",
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

    ChannelEnergy: () => createCard({
        name: "Channel Energy",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 8 damage to all enemies. Heal 4 per enemy hit.",
        upgradedDescription: "Deal 12 damage to all enemies. Heal 6 per enemy hit.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 12 : 8;
            const heal = card.upgraded ? 6 : 4;
            let hits = 0;
            state.enemies.forEach(e => { if (e.isAlive) { e.takeDamage(damage); hits++; } });
            state.playerHeal(heal * hits);
        },
        upgraded: false
    }),

    ChantForGorum: () => createCard({
        name: "Chant for Gorum",
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

    Geniekind: () => createCard({
        name: "Geniekind",
        actionCost: 0,
        manaCost: 1,
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

    CompelHostility: () => createCard({
        name: "Compel Hostility",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 9 damage. Apply Weakened for 1 turn.",
        upgradedDescription: "Deal 13 damage. Apply Weakened for 2 turns.",
        effect: (target, state, card) => {
            if (target) {
                target.takeDamage(state.calcDamage(card.upgraded ? 13 : 9));
                target.applyStatus("Weakened", card.upgraded ? 2 : 1);
            }
        },
        upgraded: false
    }),

    HellfireRay: () => createCard({
        name: "Hellfire Ray",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: true,
        description: "Deal 33 true damage.",
        upgradedDescription: "Deal 66 true damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 66 : 33);
        },
        upgraded: false
    }),

    Diehard: () => createCard({
        name: "Diehard",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain +5 max HP permanently.",
        upgradedDescription: "Gain +8 max HP permanently.",
        isOncePerDay: true,
        effect: (_, state, card) => {
            state.gainHealth(card.upgraded ? 8 : 5);
        },
        upgraded: false
    }),

    Prayer: () => createCard({
        name: "Prayer",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
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