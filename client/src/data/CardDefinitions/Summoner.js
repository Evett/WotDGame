import Card from '../Card.js';

const createCard = (options) => new Card(options);

export default {
    SummonLesserElemental: () => createCard({
        name: "Summon Lesser Elemental",
        actionCost: 1,
        manaCost: 2,
        type: "Spell",
        requiresTarget: false,
        isOncePerDay: false,
        description: "Summon an elemental ally that attacks for 4 damage each turn.",
        effect: (_, state) => {
            state.summonAlly({ name: "Lesser Elemental", damage: 4, duration: 3 });
        }
    }),
    
    EidolonStrike: () => createCard({
        name: "Eidolon Strike",
        actionCost: 1,
        manaCost: 0,
        type: "Attack",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Your Eidolon deals 5 damage.",
        effect: (target, state) => {
            if (target && state.hasEidolon) {
                target.takeDamage(5 * state.nextAttackBonus);
            }
        }
    }),
    
    PlanarBinding: () => createCard({
        name: "Planar Binding",
        actionCost: 2,
        manaCost: 3,
        type: "Spell",
        requiresTarget: true,
        isOncePerDay: false,
        description: "Stun a non-boss enemy for 1 turn.",
        effect: (target, state) => {
            if (target && !target.isBoss) {
                target.applyStatus("Stunned", 1);
            }
        }
    })
}