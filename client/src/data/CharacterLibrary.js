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
            ...repeat(() => CardLibrary.cards.Soulbound.CorrosiveTouch(), 2),
            ...repeat(() => CardLibrary.cards.Soulbound.ObscuringMist(), 4),
            ...repeat(() => CardLibrary.cards.Soulbound.TentacleStrike(), 1),
            CardLibrary.cards.Soulbound.CreatePit(),
            CardLibrary.cards.Common.Meditate(),
            CardLibrary.cards.Soulbound.SummonKhan()
        ],
        heroAbilityName: "Help from Khan",
        heroAbilityDescription: (level) => `Gain +${level} Action(s)`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.actions += level;
        },
        levelBonuses: [
            { level: 2, description: "+1 Hand Size", stat: 'handLimit', value: 1 },
            { level: 3, description: "+1 Max Mana", stat: 'maxMana', value: 1 },
            { level: 4, description: "Your summons deal +2 damage", passive: 'allyDamageBonus', value: 2 },
            { level: 5, description: "Start combat with Khan summoned", passive: 'autoSummonEidolon', value: true }
        ]
    }),
    Hassan: createCharacter({
        name: "Hassan",
        characterClass: "Summoner",
        health: 90,
        actions: 4,
        mana: 2,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Summoner.ForceBow(), 2),
            ...repeat(() => CardLibrary.cards.Summoner.SpiderClimb(), 3),
            ...repeat(() => CardLibrary.cards.Summoner.KamauStrike(), 2),
            CardLibrary.cards.Common.Meditate(),
            CardLibrary.cards.Summoner.SummonKamau(),
            CardLibrary.cards.Summoner.Planetarium()
        ],
        heroAbilityName: "Shadow Step",
        heroAbilityDescription: (level) => `Gain ${3 + level * 2} Armor`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.armor += 3 + level * 2;
        },
        levelBonuses: [
            { level: 2, description: "Your summons deal +1 damage", passive: 'allyDamageBonus', value: 1 },
            { level: 3, description: "+1 Hand Size", stat: 'handLimit', value: 1 },
            { level: 4, description: "Your summons deal +2 more damage", passive: 'allyDamageBonus', value: 2 },
            { level: 5, description: "+1 Max Mana", stat: 'maxMana', value: 1 }
        ]
    }),
    Marcus: createCharacter({
        name: "Marcus",
        characterClass: "Wizard",
        health: 80,
        actions: 3,
        mana: 3,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Wizard.MagicMissile(), 3),
            ...repeat(() => CardLibrary.cards.Wizard.Shield(), 4),
            CardLibrary.cards.Common.Meditate(),
            CardLibrary.cards.Wizard.Fireball(),
            CardLibrary.cards.Wizard.RayOfFrost()
        ],
        heroAbilityName: "Arcane Surge",
        heroAbilityDescription: (level) => `Restore ${level} Action(s) and ${level} Mana`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.actions += level;
            gameState.mana += level;
        },
        levelBonuses: [
            { level: 2, description: "+1 Max Mana", stat: 'maxMana', value: 1 },
            { level: 3, description: "+1 Hand Size", stat: 'handLimit', value: 1 },
            { level: 4, description: "+1 Max Mana", stat: 'maxMana', value: 1 },
            { level: 5, description: "Draw 1 extra card each turn", passive: 'extraDraw', value: 1 }
        ]
    }),
    Mohef: createCharacter({
        name: "Mohef",
        characterClass: "Bloodrager",
        health: 110,
        actions: 4,
        mana: 1,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Bloodrager.FlyingBlade(), 3),
            ...repeat(() => CardLibrary.cards.Bloodrager.ArmorProficiency(), 2),
            ...repeat(() => CardLibrary.cards.Bloodrager.DraconicClaws(), 2),
            CardLibrary.cards.Bloodrager.Rage(),
            CardLibrary.cards.Bloodrager.FastHealer(),
            CardLibrary.cards.Bloodrager.FireBreath()
        ],
        heroAbilityName: "Power Attack",
        heroAbilityDescription: (level) => `Next attack deals x${1 + Math.ceil(level / 2)} damage`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            gameState.nextAttackMultiplier = 1 + Math.ceil(level / 2);
        },
        levelBonuses: [
            { level: 2, description: "+1 Max Actions", stat: 'maxActions', value: 1 },
            { level: 3, description: "Start combat with 5 armor", passive: 'startArmor', value: 5 },
            { level: 4, description: "+1 Max Actions", stat: 'maxActions', value: 1 },
            { level: 5, description: "Start combat with +2 Strength", passive: 'startStrength', value: 2 }
        ]
    }),
    Nephereta: createCharacter({
        name: "Nephereta",
        characterClass: "Paladin",
        health: 100,
        actions: 3,
        mana: 2,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Paladin.DevastatingStrike(), 3),
            ...repeat(() => CardLibrary.cards.Paladin.AuraOfCourage(), 3),
            CardLibrary.cards.Paladin.SmiteEvil(),
            CardLibrary.cards.Paladin.CureLightWounds(),
            CardLibrary.cards.Paladin.ChannelEnergy(),
            CardLibrary.cards.Paladin.DivineShield()
        ],
        heroAbilityName: "Lay on Hands",
        heroAbilityDescription: (level) => `Heal ${5 * level} HP`,
        heroAbility: (gameState) => {
            const level = gameState.heroAbilityLevel || 1;
            const heal = 5 * level;
            gameState.health = Math.min(gameState.health + heal, gameState.maxHealth);
        },
        levelBonuses: [
            { level: 2, description: "Start combat with 5 armor", passive: 'startArmor', value: 5 },
            { level: 3, description: "+1 Max Mana", stat: 'maxMana', value: 1 },
            { level: 4, description: "Start combat with +10 armor", passive: 'startArmor', value: 10 },
            { level: 5, description: "Heal 3 HP at start of each turn", passive: 'turnHeal', value: 3 }
        ]
    }),
    Urusha: createCharacter({
        name: "Urusha",
        characterClass: "Warpriest",
        health: 85,
        actions: 3,
        mana: 2,
        deck: 
        [
            ...repeat(() => CardLibrary.cards.Warpriest.SacredArmor(), 3),
            ...repeat(() => CardLibrary.cards.Warpriest.FervorStrike(), 3),
            CardLibrary.cards.Warpriest.SacredStrike(),
            CardLibrary.cards.Warpriest.StrengthSurge(),
            CardLibrary.cards.Warpriest.SacredWeapon(),
            CardLibrary.cards.Warpriest.Fervor()
        ],
        heroAbilityName: "Death or Glory",
        heroAbilityDescription: (level) => `Lose 5 HP, gain ${1 + level} actions`,
        heroAbility: (gameState) => {
            if (gameState.health <= 5) return;
            const level = gameState.heroAbilityLevel || 1;
            gameState.health -= 5;
            gameState.actions += 1 + level;
        },
        levelBonuses: [
            { level: 2, description: "+1 Max Actions", stat: 'maxActions', value: 1 },
            { level: 3, description: "Heal 2 HP at start of each turn", passive: 'turnHeal', value: 2 },
            { level: 4, description: "+1 Max Mana", stat: 'maxMana', value: 1 },
            { level: 5, description: "Heal 3 more HP at start of turn", passive: 'turnHeal', value: 3 }
        ]
    }),
};

export default CharacterLibrary