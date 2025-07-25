import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    Strike: () => createCard({
        name: "Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Deal 6 damage.",
        upgradedDescription: "Deal 9 damage.",
        effect: (target, state, card) => {
            const damage = card.upgraded ? 9 : 6;
            if (target) {
                target.takeDamage(damage * state.nextAttackBonus);
            }
        },
        upgraded: false
    }),

    Block: () => createCard({
        name: "Block",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 5 armor.",
        upgradedDescription: "Gain 8 armor.",
        effect: (target, state, card) => {
            const armor = card.upgraded ? 8 : 5;
            state.armor = (state.armor || 0) + armor;
        },
        upgraded: false
    }),

    Berserk: () => createCard({
        name: "Berserk",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Next attack deals double damage.",
        effect: (target, state) => {
            state.nextAttackBonus *= 2;
        }
    })
};