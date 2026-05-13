import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    BloodFury: () => createCard({
        name: "Blood Fury",
        actionCost: 1,
        manaCost: 1,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Deal 10 damage. Take 3 damage.",
        upgradedDescription: "Deal 15 damage. Take 3",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 15 : 10;
                target.takeDamage(damage * state.nextAttackBonus);
                state.playerTakeDamage(3);
            }
        },
        upgraded: false
    }),
    
    RagingHowl: () => createCard({
        name: "Raging Howl",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain +2 attack damage for 2 turns.",
        upgradedDescription: "Gain +3 attack damage for 2 turns.",
        effect: (_, state, card) => {
            const bonus = card.upgraded ? 3 : 2;
            state.applyPlayerBuff("AttackBonus", bonus, 2);
        },
        upgraded: false
    }),
    
    ArcaneBloodline: () => createCard({
        name: "Arcane Bloodline",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Draw 2 cards. Lose 2 HP.",
        upgradedDescription: "Draw 3 cards. Lose 1 HP.",
        effect: (_, state, card, scene) => {
            const draws = card.upgraded ? 3 : 2;
            const hpLoss = card.upgraded ? 1 : 2;
            state.drawCards(draws, scene);
            state.playerTakeDamage(hpLoss);
        },
        upgraded: false
    })
}