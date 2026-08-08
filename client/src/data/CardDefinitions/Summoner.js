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

    SummonLesserElemental: () => createCard({
        name: "Summon Lesser Elemental",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Summon an elemental that attacks for 4 each turn (3 turns).",
        upgradedDescription: "Summon an elemental that attacks for 6 each turn (3 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Lesser Elemental", damage: card.upgraded ? 6 : 4, duration: 3 });
        },
        upgraded: false
    }),

    EidolonStrike: () => createCard({
        name: "Eidolon Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 3 damage. Deal 8 if Eidolon is active.",
        upgradedDescription: "Deal 5 damage. Deal 12 if Eidolon is active.",
        effect: (target, state, card) => {
            if (target) {
                const damage = state.hasEidolon ? (card.upgraded ? 12 : 8) : (card.upgraded ? 5 : 3);
                target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    PlanarBinding: () => createCard({
        name: "Planar Binding",
        actionCost: 2,
        manaCost: 3,
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

    ManifestEidolon: () => createCard({
        name: "Manifest Eidolon",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "Summon your Eidolon. Gain 5 armor.",
        upgradedDescription: "Summon your Eidolon. Gain 8 armor.",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.playerArmor(card.upgraded ? 8 : 5);
        },
        upgraded: false
    }),

    EidolonShield: () => createCard({
        name: "Eidolon Shield",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Gain 7 armor if Eidolon is active.",
        upgradedDescription: "Gain 11 armor if Eidolon is active.",
        effect: (_, state, card) => {
            if (state.hasEidolon) state.playerArmor(card.upgraded ? 11 : 7);
        },
        upgraded: false
    }),

    SummonHound: () => createCard({
        name: "Summon Hound",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Summon a hound that deals 3 damage (4 turns).",
        upgradedDescription: "Summon a hound that deals 5 damage (4 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Summoned Hound", damage: card.upgraded ? 5 : 3, duration: 4 });
        },
        upgraded: false
    }),

    LifeLink: () => createCard({
        name: "Life Link",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        description: "Heal 6 HP. Requires Eidolon.",
        upgradedDescription: "Heal 10 HP. Requires Eidolon.",
        effect: (_, state, card) => {
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 10 : 6);
        },
        upgraded: false
    }),

    SummonSwarm: () => createCard({
        name: "Summon Swarm",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 3 damage to all enemies. Apply Poison 1 turn.",
        upgradedDescription: "Deal 5 damage to all enemies. Apply Poison 2 turns.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 5 : 3;
            state.enemies.forEach(e => {
                if (e.isAlive) {
                    e.takeDamage(damage);
                    e.applyStatus("Poison", card.upgraded ? 2 : 1);
                }
            });
        },
        upgraded: false
    }),

    TranspositionPact: () => createCard({
        name: "Transposition Pact",
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

    EidolonRush: () => createCard({
        name: "Eidolon Rush",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Eidolon deals 4 damage 3 times.",
        upgradedDescription: "Eidolon deals 5 damage 3 times.",
        effect: (target, state, card) => {
            if (target && state.hasEidolon) {
                const damage = card.upgraded ? 5 : 4;
                for (let i = 0; i < 3; i++) target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    SummonGreaterElemental: () => createCard({
        name: "Summon Greater Elemental",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon a powerful elemental (8 damage, 4 turns).",
        upgradedDescription: "Summon a powerful elemental (12 damage, 4 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Greater Elemental", damage: card.upgraded ? 12 : 8, duration: 4 });
        },
        upgraded: false
    }),

    PlanarShift: () => createCard({
        name: "Planar Shift",
        actionCost: 0,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Gain 10 armor.",
        upgradedDescription: "Gain 14 armor. Draw 1 card.",
        effect: (_, state, card, scene) => {
            state.playerArmor(card.upgraded ? 14 : 10);
            if (card.upgraded) state.drawCards(1, scene);
        },
        upgraded: false
    }),

    EidolonBite: () => createCard({
        name: "Eidolon Bite",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        description: "Deal 7 damage. Heal 3 if Eidolon active.",
        upgradedDescription: "Deal 11 damage. Heal 5 if Eidolon active.",
        effect: (target, state, card) => {
            if (target) target.takeDamage((card.upgraded ? 11 : 7) * state.nextAttackBonus);
            if (state.hasEidolon) state.playerHeal(card.upgraded ? 5 : 3);
        },
        upgraded: false
    }),

    ConjureWeapons: () => createCard({
        name: "Conjure Weapons",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        description: "Next attack deals +8.",
        upgradedDescription: "Next attack deals +12.",
        effect: (_, state, card) => {
            state.nextAttackBonus += card.upgraded ? 12 : 8;
        },
        upgraded: false
    }),

    MergeForms: () => createCard({
        name: "Merge Forms",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "Merge with Eidolon. Gain 10 armor, +3 attacks for 2 turns.",
        upgradedDescription: "Merge with Eidolon. Gain 15 armor, +5 attacks for 2 turns.",
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

    DismissalWave: () => createCard({
        name: "Dismissal Wave",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        description: "Deal 6 damage to all. Stun 1 random non-boss.",
        upgradedDescription: "Deal 9 damage to all. Stun 1 random non-boss.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 9 : 6;
            state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
            const stunnable = state.enemies.filter(e => e.isAlive && !e.isBoss);
            if (stunnable.length > 0) {
                stunnable[Math.floor(Math.random() * stunnable.length)].applyStatus("Stunned", 1);
            }
        },
        upgraded: false
    }),

    EidolonClaw: () => createCard({
        name: "Eidolon Claw",
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
                target.takeDamage((base + bonus) * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    PlanarAlly: () => createCard({
        name: "Planar Ally",
        actionCost: 1,
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

    AspectOfTheBeast: () => createCard({
        name: "Aspect of the Beast",
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

    SummonShadow: () => createCard({
        name: "Summon Shadow",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        description: "Summon a shadow (3 damage, applies Weakened, 2 turns).",
        upgradedDescription: "Summon a shadow (5 damage, applies Weakened, 3 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.summonAlly({ name: "Shadow", damage: card.upgraded ? 5 : 3, duration: card.upgraded ? 3 : 2 });
        },
        upgraded: false
    }),

    EtherealJaunt: () => createCard({
        name: "Ethereal Jaunt",
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

    EidolonBreath: () => createCard({
        name: "Eidolon Breath",
        actionCost: 1,
        manaCost: 2,
        type: "Attack",
        requiresTarget: false,
        description: "Eidolon deals 6 damage to all enemies.",
        upgradedDescription: "Eidolon deals 10 damage to all enemies.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                const damage = card.upgraded ? 10 : 6;
                state.enemies.forEach(e => { if (e.isAlive) e.takeDamage(damage); });
            }
        },
        upgraded: false
    }),

    SummonersWill: () => createCard({
        name: "Summoner's Will",
        actionCost: 0,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        description: "Draw 2 cards. Gain 1 mana.",
        upgradedDescription: "Draw 3 cards. Gain 1 mana.",
        effect: (_, state, card, scene) => {
            state.drawCards(card.upgraded ? 3 : 2, scene);
            state.mana += 1;
        },
        upgraded: false
    }),

    GateKeeper: () => createCard({
        name: "Gate Keeper",
        actionCost: 2,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon 3 allies (4 damage each, 2 turns).",
        upgradedDescription: "Summon 3 allies (6 damage each, 3 turns).",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            for (let i = 0; i < 3; i++) {
                state.summonAlly({ name: `Gate Minion ${i+1}`, damage: card.upgraded ? 6 : 4, duration: card.upgraded ? 3 : 2 });
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

    EvolutionSurge: () => createCard({
        name: "Evolution Surge",
        actionCost: 1,
        manaCost: 2,
        type: "Power",
        requiresTarget: false,
        description: "Eidolon gains +4 damage to all attacks this combat.",
        upgradedDescription: "Eidolon gains +6 damage to all attacks this combat.",
        effect: (_, state, card) => {
            if (state.hasEidolon) {
                state.applyPlayerBuff("EidolonBonus", card.upgraded ? 6 : 4, 99);
            }
        },
        upgraded: false
    }),

    ConjuredArmor: () => createCard({
        name: "Conjured Armor",
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

    Rejuvenate: () => createCard({
        name: "Rejuvenate",
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

    TwinEidolon: () => createCard({
        name: "Twin Eidolon",
        actionCost: 2,
        manaCost: 3,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Summon Eidolon. Gain 2 actions. Gain 10 armor.",
        upgradedDescription: "Summon Eidolon. Gain 3 actions. Gain 15 armor.",
        effect: (_, state, card) => {
            state.hasEidolon = true;
            state.actions += card.upgraded ? 3 : 2;
            state.playerArmor(card.upgraded ? 15 : 10);
        },
        upgraded: false
    })
}