import Card from './Card.js';

const createCard = (options) => new Card(options);

const CardLibrary = {
    Strike: createCard({
        name: "Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        description: "Deal 6 damage.",
        effect: (target, state) => {
            if (target) {
                target.takeDamage(6);
            }
        }
    }),
    Block: createCard({
        name: "Block",
        actionCost: 0,
        manaCost: 1,
        type: "Skill",
        description: "Gain 5 block.",
        effect: (target, state) => {
            state.block = (state.block || 0) + 5;
        }
    }),
    Berserk: createCard({
        name: "Berserk",
        actionCost: 1,
        manaCost: 1,
        type: "Power",
        description: "Next attack deals double damage.",
        effect: (target, state) => {
            state.nextAttackBonus = "double";
        }
    }),
};

export default CardLibrary;