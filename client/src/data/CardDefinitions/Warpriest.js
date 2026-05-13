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
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 12 : 7;
                target.takeDamage(damage * state.nextAttackBonus);
                state.playerHeal(Math.floor(damage / 2));
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
        effect: (_, state, card) => {
            const strength = card.upgraded ? 4 : 2;
            state.applyPlayerBuff("Strength", strength, 2);
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
        effect: (_, state, card, scene) => {
            const hpLoss = card.upgraded ? 3 : 5;
            const draws = card.upgraded ? 5 : 3;
            state.playerTakeDamage(hpLoss);
            state.drawCards(draws, scene);
        },
        upgraded: false
    })
}