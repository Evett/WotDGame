import Character from './Character.js'
import CardLibrary from './CardLibrary.js'

const createCharacter = (options) => new Character(options);

const repeat = (fn, times) => Array.from({ length: times }, fn);

const CharacterLibrary = {
    Alaen: createCharacter({
        name: "Alaen",
        characterClass: "Soulbound",
        health: 120,
        actions: 3,
        mana: 2,
        deck: [
            ...repeat(() => CardLibrary.cards.Common.Strike(), 2),
            ...repeat(() => CardLibrary.cards.Common.Block(), 3),
            ...repeat(() => CardLibrary.cards.Summoner.EidolonStrike(), 2),
            CardLibrary.cards.Common.Berserk(),
            CardLibrary.cards.Summoner.PlanarBinding(),
            CardLibrary.cards.Summoner.SummonLesserElemental()
        ],
        heroAbility: (gameState) => {
            console.log("Alaen's Summon Khan: Gain +1 Action!");
            gameState.actions += 1;
        }
    }),
    Hassan: createCharacter({
        name: "Hassan",
        characterClass: "Summoner",
        health: 90,
        actions: 4,
        mana: 2,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Common.Strike(), 2),
            ...repeat(() => CardLibrary.cards.Common.Block(), 3),
            ...repeat(() => CardLibrary.cards.Summoner.EidolonStrike(), 2),
            CardLibrary.cards.Common.Berserk(),
            CardLibrary.cards.Summoner.PlanarBinding(),
            CardLibrary.cards.Summoner.SummonLesserElemental()
        ],
        heroAbility: (gameState) => {
            console.log("Hassan's Shadow Step: Gain temporary Evasion!");
        }
}),
    Marcus: createCharacter({
        name: "Marcus",
        characterClass: "Wizard",
        health: 80,
        actions: 3,
        mana: 3,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Common.Strike(), 2),
            ...repeat(() => CardLibrary.cards.Wizard.MagicMissile(), 3),
            ...repeat(() => CardLibrary.cards.Wizard.Shield(), 3),
            CardLibrary.cards.Common.Block(),
            CardLibrary.cards.Wizard.Fireball()
        ],
        heroAbility: (gameState) => {
            console.log("Marcus's Arcane Boost: Restore 1 Action!");
            gameState.actions += 1;
        }
    }),
    Mohef: createCharacter({
        name: "Mohef",
        characterClass: "Bloodrager",
        health: 100,
        actions: 4,
        mana: 1,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Common.Strike(), 3),
            ...repeat(() => CardLibrary.cards.Common.Block(), 2),
            ...repeat(() => CardLibrary.cards.Bloodrager.BloodFury(), 2),
            CardLibrary.cards.Common.Berserk(),
            CardLibrary.cards.Bloodrager.RagingHowl(),
            CardLibrary.cards.Bloodrager.ArcaneBloodline()
        ],
        heroAbility: (gameState) => {
            console.log("Mohef's Precision: Your next attack deals double damage!");
        }
    }),
    Nephereta: createCharacter({
        name: "Nephereta",
        characterClass: "Paladin",
        health: 110,
        actions: 3,
        mana: 1,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Common.Strike(), 2),
            ...repeat(() => CardLibrary.cards.Common.Block(), 3),
            ...repeat(() => CardLibrary.cards.Paladin.SmiteEvil(), 2),
            ...repeat(() => CardLibrary.cards.Paladin.DivineShield(), 2),
            CardLibrary.cards.Paladin.LayOnHands()
        ],
        heroAbility: (gameState) => {
            console.log("Nephereta's Blessing: Heal 5 HP!");
            gameState.health = Math.min(gameState.health + 5, gameState.maxHealth);
        }
    }),
    Urusha: createCharacter({
        name: "Urusha",
        characterClass: "Warpriest",
        health: 85,
        actions: 3,
        mana: 2,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Common.Strike(), 2),
            ...repeat(() => CardLibrary.cards.Common.Block(), 3),
            ...repeat(() => CardLibrary.cards.Warpriest.SacredStrike(), 2),
            CardLibrary.cards.Common.Berserk,
            CardLibrary.cards.Warpriest.BlessingOfWar,
            CardLibrary.cards.Warpriest.Sacrifice
        ],
        heroAbility: (gameState) => {
            console.log("Urusha's Sacrifice: Lose 5 HP, gain 2 actions.");
            gameState.health -= 5;
            gameState.actions += 2;
        }
    }),
};

export default CharacterLibrary