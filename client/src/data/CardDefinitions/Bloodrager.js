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
        effect: (target, state) => {
            if (target) {
                target.takeDamage(10 * state.nextAttackBonus);
                state.playerTakeDamage(3);
            }
        }
    }),
    
    RagingHowl: () => createCard({
        name: "Raging Howl",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain +2 attack damage for 2 turns.",
        effect: (_, state) => {
            state.applyPlayerBuff("AttackBonus", 2, 2);
        }
    }),
    
    ArcaneBloodline: () => createCard({
        name: "Arcane Bloodline",
        actionCost: 0,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Draw 2 cards. Lose 2 HP.",
        effect: (_, state, scene) => {
            state.drawCards(2, scene);
            state.playerTakeDamage(2);
        }
    })
}