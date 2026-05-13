import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    MagicMissile: () => createCard({
        name: "Magic Missile",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Deal 6 damage that can't miss.",
        upgradedDescription: "Deal 10 damage that can't miss",
        effect: (target, state, card) => {
            if (target) {
                const damage = card.upgraded ? 10 : 6;
                target.takeTrueDamage(damage);
            }
        },
        upgraded: false
    }),
    
    Fireball: () => createCard({
        name: "Fireball",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 10 damage to all enemies.",
        upgradedDescription: "Deal 16 damage to all enemies.",
        effect: (_, state, card) => {
            const damage = card.upgraded ? 16 : 10;
            state.enemies.forEach(e => e.takeDamage(damage));
        },
        upgraded: false
    }),
    
    Shield: () => createCard({
        name: "Shield",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 6 armor. Negate the next attack.",
        upgradedDescription: "Gain 9 armor. Negate the next attack.",
        effect: (_, state, card) => {
            const armor = card.upgraded ? 9 : 6;
            state.playerArmor(armor);
            state.applyStatus("Shielded", 1);
        },
        upgraded: false
    })
}