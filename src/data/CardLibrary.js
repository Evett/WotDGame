import Card from './Card.js';

const createCard = (options) => new Card(options);

const CardLibrary = {
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
        description: "Gain 5 block.",
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
};

export default CardLibrary;