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
        heroAbilityName: "Summon Khan",
        heroAbilityDescription: (level) => `Gain +${level} Action(s)`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.actions += level;
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
        heroAbilityName: "Shadow Step",
        heroAbilityDescription: (level) => `Gain ${3 + level * 2} Armor`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.armor += 3 + level * 2;
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
        heroAbilityName: "Arcane Surge",
        heroAbilityDescription: (level) => `Restore ${level} Action(s) and ${level} Mana`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.actions += level;
            gameState.mana += level;
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
        heroAbilityName: "Bloodlust",
        heroAbilityDescription: (level) => `Next attack deals x${1 + level} damage`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.nextAttackBonus = 1 + level;
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
        heroAbilityName: "Divine Blessing",
        heroAbilityDescription: (level) => `Heal ${5 * level} HP`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            const heal = 5 * level;
            gameState.health = Math.min(gameState.health + heal, gameState.maxHealth);
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
            CardLibrary.cards.Common.Berserk(),
            CardLibrary.cards.Warpriest.BlessingOfWar(),
            CardLibrary.cards.Warpriest.Sacrifice()
        ],
        heroAbilityName: "War Sacrifice",
        heroAbilityDescription: (level) => `Lose 5 HP, gain ${1 + level} actions`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.health -= 5;
            gameState.actions += 1 + level;
        }
    }),
};

export default CharacterLibrary