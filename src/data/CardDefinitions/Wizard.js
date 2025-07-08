import Card from './../Card.js';

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
        effect: (target, state) => {
            if (target) {
                target.takeTrueDamage(6);
            }
        }
    }),
    
    Fireball: () => createCard({
        name: "Fireball",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: true,
        description: "Deal 10 damage to all enemies.",
        effect: (_, state) => {
            state.enemies.forEach(e => e.takeDamage(10));
        }
    }),
    
    Shield: () => createCard({
        name: "Shield",
        actionCost: 1,
        manaCost: 1,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Gain 6 armor. Negate the next attack.",
        effect: (_, state) => {
            state.playerArmor(6);
            state.applyStatus("Shielded", 1);
        }
    })
}