import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SacredStrike: () => createCard({
        name: "Sacred Strike",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Deal 7 damage. Heal for half.",
        upgradedDescription: "Deal 12 damage. Heal for half.",
        effect: (target, state) => {
            if (target) {
                target.takeDamage(7 * state.nextAttackBonus);
                state.playerHeal(4);
            }
        },
        upgraded: false
    }),
    
    BlessingOfWar: () => createCard({
        name: "Blessing of War",
        actionCost: 1,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 2 strength for 2 turns.",
        upgradedDescription: "Gain 4 strength for 2 turns.",
        effect: (_, state) => {
            state.applyPlayerBuff("Strength", 2, 2);
        },
        upgraded: false
    }),
    
    Sacrifice: () => createCard({
        name: "Sacrifice",
        actionCost: 1,
        manaCost: 0,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Lose 5 HP. Draw 3 cards.",
        upgradedDescription: "Lose 3 HP. Draw 5 cards.",
        effect: (_, state, scene) => {
            state.playerTakeDamage(5);
            state.drawCards(3, scene);
        },
        upgraded: false
    })
}