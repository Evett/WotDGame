import Card from './Card.js';

const createCard = (options) => new Card(options);

const cards = {
    Strike: createCard({
        name: "Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 6 damage.",
        effect: (target, state) => {
            if (target) {
                target.takeDamage(6 * state.nextAttackBonus);
            }
        }
    }),

    Block: createCard({
        name: "Block",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 5 armor.",
        effect: (target, state) => {
            state.armor = (state.armor || 0) + 5;
        }
    }),

    Berserk: createCard({
        name: "Berserk",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Next attack deals double damage.",
        effect: (target, state) => {
            state.nextAttackBonus *= 2;
        }
    }),
    //Paladin cards
    SmiteEvil: createCard({
        name: "Smite Evil",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 8 damage. Double if enemy is Evil.",
        effect: (target, state) => {
            if (target) {
                const isEvil = target.tags?.includes("Evil");
                const damage = isEvil ? 16 : 8;
                target.takeDamage(damage * state.nextAttackBonus);
            }
        }
    }),
    
    LayOnHands: createCard({
        name: "Lay on Hands",
        actionCost: 1,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 10 HP.",
        effect: (_, state) => {
            state.playerHeal(10);
        }
    }),
    
    DivineShield: createCard({
        name: "Divine Shield",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 8 armor.",
        effect: (_, state) => {
            state.playerArmor(8);
        }
    }),
    //Summoner 1 cards
    SummonLesserElemental: createCard({
        name: "Summon Lesser Elemental",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Summon an elemental ally that attacks for 4 damage each turn.",
        effect: (_, state) => {
            state.summonAlly({ name: "Lesser Elemental", damage: 4, duration: 3 });
        }
    }),
    
    EidolonStrike: createCard({
        name: "Eidolon Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Your Eidolon deals 5 damage.",
        effect: (target, state) => {
            if (target && state.hasEidolon) {
                target.takeDamage(5 * state.nextAttackBonus);
            }
        }
    }),
    
    PlanarBinding: createCard({
        name: "Planar Binding",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: true,
        description: "Stun a non-boss enemy for 1 turn.",
        effect: (target, state) => {
            if (target && !target.isBoss) {
                target.applyStatus("Stunned", 1);
            }
        }
    }),
    //Summoner 2 cards
    //todo
    //Bloodrager cards
    BloodFury: createCard({
        name: "Blood Fury",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. Take 3 damage.",
        effect: (target, state) => {
            if (target) {
                target.takeDamage(10 * state.nextAttackBonus);
                state.playerTakeDamage(3);
            }
        }
    }),
    
    RagingHowl: createCard({
        name: "Raging Howl",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain +2 attack damage for 2 turns.",
        effect: (_, state) => {
            state.applyPlayerBuff("AttackBonus", 2, 2);
        }
    }),
    
    ArcaneBloodline: createCard({
        name: "Arcane Bloodline",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Draw 2 cards. Lose 2 HP.",
        effect: (_, state, scene) => {
            state.drawCards(2, scene);
            state.playerTakeDamage(2);
        }
    }),
    //Wizard cards
    MagicMissile: createCard({
        name: "Magic Missile",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        description: "Deal 6 damage that can't miss.",
        effect: (target, state) => {
            if (target) {
                target.takeTrueDamage(6);
            }
        }
    }),
    
    Fireball: createCard({
        name: "Fireball",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 10 damage to all enemies.",
        effect: (_, state) => {
            state.enemies.forEach(e => e.takeDamage(10));
        }
    }),
    
    Shield: createCard({
        name: "Shield",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 6 armor. Negate the next attack.",
        effect: (_, state) => {
            state.playerArmor(6);
            state.applyStatus("Shielded", 1);
        }
    }),
    //Warpriest cards
    SacredStrike: createCard({
        name: "Sacred Strike",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Heal for half.",
        effect: (target, state) => {
            if (target) {
                target.takeDamage(7 * state.nextAttackBonus);
                state.playerHeal(4);
            }
        }
    }),
    
    BlessingOfWar: createCard({
        name: "Blessing of War",
        actionCost: 1,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 2 strength for 2 turns.",
        effect: (_, state) => {
            state.applyPlayerBuff("Strength", 2, 2);
        }
    }),
    
    Sacrifice: createCard({
        name: "Sacrifice",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Lose 5 HP. Draw 3 cards.",
        effect: (_, state, scene) => {
            state.playerTakeDamage(5);
            state.drawCards(3, scene);
        }
    }),
};

const CardLibrary = {
    cards,
    getRandom: () => Phaser.Utils.Array.GetRandom(Object.values(cards)),
};

export default CardLibrary;