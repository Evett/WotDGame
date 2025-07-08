import Card from './../Card.js';

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
        effect: (target, state) => {
            if (target) {
                const isEvil = target.tags?.includes("Evil");
                const damage = isEvil ? 16 : 8;
                target.takeDamage(damage * state.nextAttackBonus);
            }
        }
    }),
    
    LayOnHands: () => createCard({
        name: "Lay on Hands",
        actionCost: 1,
        manaCost: 2,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Heal 10 HP.",
        effect: (_, state) => {
            state.playerHeal(10);
        }
    }),
    
    DivineShield: () => createCard({
        name: "Divine Shield",
        actionCost: 1,
        manaCost: 1,
        type: "Skill",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 8 armor.",
        effect: (_, state) => {
            state.playerArmor(8);
        }
    })
}