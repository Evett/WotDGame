import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SummonKamau: () => createCard({
        name: "Summon Kamau",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon your Eidolon, Kamau. It attacks for 5 each turn. Once per combat.",
        upgradedDescription: "Summon Kamau. Attacks for 8/turn. Draw 1 card. Once per combat.",
        effect: (_, state, card, scene) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Kamau", damage: card.upgraded ? 8 : 5, duration: 99 });
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    SummonLesserFireElemental: () => createCard({
        name: "Summon Lesser Elemental",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Summon an elemental that attacks for 4 each turn (3 turns).",
        upgradedDescription: "Summon an elemental that attacks for 6 each turn (3 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Lesser Fire Elemental", damage: card.upgraded ? 6 : 4, duration: 3 });
        },
        upgraded: false
    }),

    KamauStrike: () => createCard({
        name: "Kamau Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 3 damage. Deal 8 if a summon is active.",
        upgradedDescription: "Deal 5 damage. Deal 12 if a summon is active.",
        effect: (target, state, card) => {
            if (target) {
                const damage = state.hasEidolon ? (card.upgraded ? 12 : 8) : (card.upgraded ? 5 : 3);
                target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    ForceBow: () => createCard({
        name: "Force Bow",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Deal 7 damage.",
        upgradedDescription: "Deal 11 damage.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 11 : 7;
            if (target) {
                target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    KnellOfTheDepths: () => createCard({
        name: "Knell of the Depths",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: true,
        description: "Stun a non-boss enemy for 1 turn.",
        upgradedDescription: "Stun an enemy for 1 turn.",
        effect: (target, state, card) => {
            if (target && (card.upgraded || !target.isBoss)) {
                target.applyStatus("Stunned", 1);
            }
        },
        upgraded: false
    }),

    SpiderClimb: () => createCard({
        name: "Spider Climb",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 8 armor.",
        upgradedDescription: "Gain 12 armor.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 12 : 8);
        },
        upgraded: false
    }),

    FinalSacrifice: () => createCard({
        name: "Final Sacrifice",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain 7 armor and deal 10 damage to all enemies if a summon is active.",
        upgradedDescription: "Gain 11 armor and deal 15 damage to all enemies if a summon is active.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.playerArmor(card.upgraded ? 11 : 7);
                const damage = card.upgraded ? 15 : 10;
                state.enemies.forEach(e => {
                    if (e.isAlive) {
                        e.takeDamage(damage);
                    }
                });
            }         
        },
        upgraded: false
    }),

    InfernalChallenger: () => createCard({
        name: "Infernal Challenger",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Summon a devil that deals 3 damage (4 turns).",
        upgradedDescription: "Summon a devil that deals 5 damage (4 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Summoned Devil", damage: card.upgraded ? 5 : 3, duration: 4 });
        },
        upgraded: false
    }),

    LifeLink: () => createCard({
        name: "Life Link",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 6 HP. Requires a summon.",
        upgradedDescription: "Heal 10 HP. Requires a summon.",
        effect: (_, state, card) => {
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 10 : 6);
        },
        upgraded: false
    }),

    CurseOfDragonflies: () => createCard({
        name: "Curse of Dragonflies",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 5 damage to all enemies. Apply Poison 1 turn.",
        upgradedDescription: "Deal 8 damage to all enemies. Apply Poison 2 turns.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 8 : 5;
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                    e.applyStatus("Poison", card.upgraded ? 2 : 1);
                }
            });
        },
        upgraded: false
    }),

    AssumeAppearance: () => createCard({
        name: "Assume Appearance",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 5 armor. Draw 1 card.",
        upgradedDescription: "Gain 7 armor. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 7 : 5);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    ShadowStrike: () => createCard({
        name: "Shadow Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Your summon deals 4 damage 3 times.",
        upgradedDescription: "Your summon deals 5 damage 3 times.",
        effect: (target, state, card) => {
            if (target && state.hasEidolon) {
                const damage = card.upgraded ? 5 : 4;
                for (let i = 0; i < 3; i++) target.takeDamage(state.calcDamage(damage));
            }
        },
        upgraded: false
    }),

    SummonGreaterFireElemental: () => createCard({
        name: "Summon Greater Fire Elemental",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon a powerful elemental (8 damage, 4 turns).",
        upgradedDescription: "Summon a powerful elemental (12 damage, 4 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Greater Fire Elemental", damage: card.upgraded ? 12 : 8, duration: 4 });
        },
        upgraded: false
    }),

    ShadowStep: () => createCard({
        name: "Shadow Step",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 7 armor. Draw 1 card",
        upgradedDescription: "Gain 10 armor. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 10 : 7);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    Snowball: () => createCard({
        name: "Eidolon Bite",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 true damage.",
        upgradedDescription: "Deal 11 damage.",
        effect: (target, state, card) => {
            if (target) target.takeTrueDamage(card.upgraded ? 11 : 7);
        },
        upgraded: false
    }),

    LuckyNumber: () => createCard({
        name: "Lucky Number",
        actionCost: 1,
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

    MergeForms: () => createCard({
        name: "Merge Forms",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "If a summon is active, gain 10 armor, +3 attacks for 2 turns.",
        upgradedDescription: "If a summon is active, gain 15 armor, +5 attacks for 2 turns.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.playerArmor(card.upgraded ? 15 : 10);
                state.applyPlayerBuff("AttackBonus", card.upgraded ? 5 : 3, 2);
            }
        },
        upgraded: false
    }),

    SummonAngel: () => createCard({
        name: "Summon Angel",
        actionCost: 3,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon an angel (6 damage, heals 4 HP/turn, 3 turns).",
        upgradedDescription: "Summon an angel (9 damage, heals 6 HP/turn, 3 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Celestial Angel", damage: card.upgraded ? 9 : 6, heal: card.upgraded ? 6 : 4, duration: 3 });
        },
        upgraded: false
    }),

    UnleashPandemonium: () => createCard({
        name: "UnleashPandemonium",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 12 damage to all. Stun 1 random non-boss enemy.",
        upgradedDescription: "Deal 18 damage to all. Stun 1 random non-boss enemy.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 18 : 12;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
            const stunnable = state.enemies.filter(e => e.isAlive && !e.isBoss);
            if (stunnable.length > 0) {
                stunnable[Math.floor(Math.random() * stunnable.length)].applyStatus("Stunned", 1);
            }
        },
        upgraded: false
    }),

    TwinnedEidolon: () => createCard({
        name: "TwinnedEidolon",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 10 damage. Deal 5 more if Eidolon active.",
        upgradedDescription: "Deal 14 damage. Deal 7 more if Eidolon active.",
        effect: (target, state, card) => {
            if (target) {
                const base = card.upgraded ? 14 : 10;
                const bonus = state.hasEidolon ? (card.upgraded ? 7 : 5) : 0;
                target.takeDamage(state.calcDamage(base + bonus));
            }
        },
        upgraded: false
    }),

    UnseenServant: () => createCard({
        name: "Unseen Servant",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Summon an ally (4 damage, 2 turns). Draw 1 card.",
        upgradedDescription: "Summon an ally (6 damage, 3 turns). Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Planar Ally", damage: card.upgraded ? 6 : 4, duration: card.upgraded ? 3 : 2 });
            state.drawCards(1, scene);
        },
        upgraded: false
    }),

    ShadowJaunt: () => createCard({
        name: "Shadow Jaunt",
        actionCost: 0,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Gain 1 action. Gain 4 armor.",
        upgradedDescription: "Gain 2 actions. Gain 5 armor.",
        effect: (_, state, card) => {
            state.actions += card.upgraded ? 2 : 1;
            state.playerArmor(card.upgraded ? 5 : 4);
        },
        upgraded: false
    }),

    ExpelBlood: () => createCard({
        name: "Expel Blood",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon a blood elemental (10 damage, applies Weakened, 2 turns).",
        upgradedDescription: "Summon a blood elemental (15 damage, applies Weakened, 3 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Blood Elemental", damage: card.upgraded ? 15 : 10, debuff: "Weakened", duration: card.upgraded ? 3 : 2 });
        },
        upgraded: false
    }),

    DimensionalBounce: () => createCard({
        name: "Dimensional Bounce",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 8 armor. Gain 2 mana next turn.",
        upgradedDescription: "Gain 12 armor. Gain 3 mana next turn.",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 12 : 8);
            state.applyPlayerBuff("ManaGain", card.upgraded ? 3 : 2, 1);
        },
        upgraded: false
    }),

    Multiattack: () => createCard({
        name: "Multiattack",
        actionCost: 1,
        manaCost: 2,
        type: "Attack",
        requiresTarget: false,
        description: "Your summon deals 6 damage to all enemies.",
        upgradedDescription: "Your summon deals 10 damage to all enemies.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                const damage = card.upgraded ? 10 : 6;
                state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
            }
        },
        upgraded: false
    }),

    MakersCall: () => createCard({
        name: "Maker's Call",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 1 cards. Gain 1 mana.",
        upgradedDescription: "Draw 2 cards. Gain 1 mana.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 2 : 1, scene);
            state.mana += 1;
        },
        upgraded: false
    }),

    UncannyReminder: () => createCard({
        name: "Uncanny Reminder",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon 3 allies(?) (4 damage each, 3 turns).",
        upgradedDescription: "Summon 3 allies(?) (6 damage each, 4 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            for (let i = 0; i < 3; i++) {
                state.summonAlly({ name: `Gate Minion ${i+1}`, damage: card.upgraded ? 6 : 4, duration: card.upgraded ? 4 : 3 });
            }
        },
        upgraded: false
    }),

    ProtectiveBond: () => createCard({
        name: "Protective Bond",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 6 armor. Gain 4 more if Eidolon active.",
        upgradedDescription: "Gain 8 armor. Gain 6 more if Eidolon active.",
        effect: (_, state, card) => {
            const base = card.upgraded ? 8 : 6;
            const bonus = state.hasEidolon ? (card.upgraded ? 6 : 4) : 0;
            state.playerArmor(base + bonus);
        },
        upgraded: false
    }),

    FerociousSummons: () => createCard({
        name: "Ferocious Summons",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summons gains +4 damage to all attacks this combat.",
        upgradedDescription: "Summons gains +6 damage to all attacks this combat.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.applyPlayerBuff("EidolonBonus", card.upgraded ? 6 : 4, 99);
            }
        },
        upgraded: false
    }),

    GreaterShieldAlly: () => createCard({
        name: "Greater Shield Ally",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 8 armor. Summon a tiny guardian (2 damage, 2 turns).",
        upgradedDescription: "Gain 12 armor. Summon a tiny guardian (3 damage, 3 turns).",
        effect: (_, state, card) => {
            state.playerArmor(card.upgraded ? 12 : 8);
            state.hasEidolon = true;
            state.summonAlly({ name: "Tiny Guardian", damage: card.upgraded ? 3 : 2, duration: card.upgraded ? 3 : 2 });
        },
        upgraded: false
    }),

    CureModerateWounds: () => createCard({
        name: "Cure Moderate Wounds",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Heal 6. Draw 1 card.",
        upgradedDescription: "Heal 10. Draw 2 cards.",
        effect: (_, state, card, scene) => {
            state.playerHeal(card.upgraded ? 10 : 6);
            state.drawCards(card.upgraded ? 2 : 1, scene);
        },
        upgraded: false
    }),

    Planetarium: () => createCard({
        name: "Planetarium",
        actionCost: 2,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Gain 2 actions. Gain 10 armor.",
        upgradedDescription: "Gain 3 actions. Gain 15 armor.",
        effect: (_, state, card) => {
            state.actions += card.upgraded ? 3 : 2;
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    })
}