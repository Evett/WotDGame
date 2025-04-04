import Card from './Card.js';

const createCard = (options) => new Card(options);

const CardLibrary = {
    Strike: createCard({
        name: "Strike",
        cost: 1,
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
        cost: 1,
        type: "Skill",
        description: "Gain 5 block.",
        effect: (target, state) => {
            state.block = (state.block || 0) + 5;
        }
    }),
    Berserk: createCard({
        name: "Berserk",
        cost: 0,
        type: "Power",
        description: "Next attack deals double damage.",
        effect: (target, state) => {
            state.nextAttackBonus = "double";
        }
    }),
};

export default CardLibrary;