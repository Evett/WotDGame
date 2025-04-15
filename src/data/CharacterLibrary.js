import Character from './Character.js'
import CardLibrary from './CardLibrary.js'

const createCharacter = (options) => new Character(options);

const CharacterLibrary = {
    Alaen: createCharacter({
        name: "Alaen",
        health: 120,
        actions: 3,
        mana: 2,
        deck: [
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.EidolonStrike,
            CardLibrary.cards.EidolonStrike,
            CardLibrary.cards.Berserk,
            CardLibrary.cards.PlanarBinding,
            CardLibrary.cards.SummonLesserElemental
        ],
        heroAbility: (gameState) => {
            console.log("Alaen's Summon Khan: Gain +1 Action!");
            gameState.actions += 1;
        }
    }),
    Hassan: createCharacter({
        name: "Hassan",
        health: 90,
        actions: 4,
        mana: 2,
        deck: 
        [
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.EidolonStrike,
            CardLibrary.cards.EidolonStrike,
            CardLibrary.cards.Berserk,
            CardLibrary.cards.PlanarBinding,
            CardLibrary.cards.SummonLesserElemental
        ],
        heroAbility: (gameState) => {
            console.log("Hassan's Shadow Step: Gain temporary Evasion!");
        }
}),
    Marcus: createCharacter({
        name: "Marcus",
        health: 80,
        actions: 3,
        mana: 3,
        deck: 
        [
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Block,
            CardLibrary.cards.MagicMissile,
            CardLibrary.cards.MagicMissile,
            CardLibrary.cards.MagicMissile,
            CardLibrary.cards.Fireball,
            CardLibrary.cards.Shield,
            CardLibrary.cards.Shield,
            CardLibrary.cards.Shield,
        ],
        heroAbility: (gameState) => {
            console.log("Marcus's Arcane Boost: Restore 1 Action!");
            gameState.actions += 1;
        }
    }),
    Mohef: createCharacter({
        name: "Mohef",
        health: 100,
        actions: 4,
        mana: 1,
        deck: 
        [
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.BloodFury,
            CardLibrary.cards.BloodFury,
            CardLibrary.cards.Berserk,
            CardLibrary.cards.RagingHowl,
            CardLibrary.cards.ArcaneBloodline
        ],
        heroAbility: (gameState) => {
            console.log("Mohef's Precision: Your next attack deals double damage!");
        }
    }),
    Nephereta: createCharacter({
        name: "Nephereta",
        health: 110,
        actions: 3,
        mana: 1,
        deck: 
        [
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.SmiteEvil,
            CardLibrary.cards.SmiteEvil,
            CardLibrary.cards.LayOnHands,
            CardLibrary.cards.DivineShield,
            CardLibrary.cards.DivineShield
        ],
        heroAbility: (gameState) => {
            console.log("Nephereta's Blessing: Heal 5 HP!");
            gameState.health = Math.min(gameState.health + 5, gameState.maxHealth);
        }
    }),
    Urusha: createCharacter({
        name: "Urusha",
        health: 85,
        actions: 3,
        mana: 2,
        deck: 
        [
            CardLibrary.cards.Strike,
            CardLibrary.cards.Strike,
            CardLibrary.cards.Berserk,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.Block,
            CardLibrary.cards.SacredStrike,
            CardLibrary.cards.SacredStrike,
            CardLibrary.cards.BlessingOfWar,
            CardLibrary.cards.Sacrifice
        ],
        heroAbility: (gameState) => {
            console.log("Urusha's Sacrifice: Lose 5 HP, gain 2 actions.");
            gameState.health -= 5;
            gameState.actions += 2;
        }
    }),
};

export default CharacterLibrary