import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SmiteEvil: () => createCard({
        name: "Smite Evil",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
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
        isOncePerDay: false,
        description: "Heal 10 HP.",
        upgradedDescription: "Heal 15 HP.",
        effect: (_, state, card) => {
            const heal = card.upgraded ? 15 : 10;
            state.playerHeal(heal);
        },
        upgraded: false
    }),
    
    DivineShield: () => createCard({
        name: "Divine Shield",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 8 armor.",
        upgradedDescription: "Gain 13 armor.",
        effect: (_, state, card) => {
            const armor = card.upgraded ? 13 : 8;
            state.playerArmor(armor);
        },
        upgraded: false
    })
}