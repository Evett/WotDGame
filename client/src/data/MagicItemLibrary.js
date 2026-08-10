import MagicItem from './MagicItem.js';

const createMagicItem = (options) => new MagicItem(options);

const magicItems = {
    // ─── Passive Items ──────────────────────────────────────

    AmuletOfVitality: () => createMagicItem({
        id: "amulet_of_vitality",
        name: "Amulet of Vitality",
        description: "Start each battle with +5 max health.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.gainHealth(5);
            }
        }
    }),

    CloakOfResistance: () => createMagicItem({
        id: "cloak_of_resistance",
        name: "Cloak of Resistance",
        description: "Gain 2 armor at the start of each turn.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.playerArmor(2);
            }
        }
    }),

    BeltOfGiantStrength: () => createMagicItem({
        id: "belt_of_giant_strength",
        name: "Belt of Giant Strength",
        description: "Your next attack each turn deals +3 damage.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.nextAttackBonus += 3;
            }
        }
    }),

    HeadbandOfVastIntellect: () => createMagicItem({
        id: "headband_of_vast_intellect",
        name: "Headband of Vast Intellect",
        description: "Gain +1 mana at the start of each battle.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.maxMana += 1;
                state.mana += 1;
            }
        }
    }),

    BootsOfSpeed: () => createMagicItem({
        id: "boots_of_speed",
        name: "Boots of Speed",
        description: "Gain +1 action at the start of each battle.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.maxActions += 1;
                state.actions += 1;
            }
        }
    }),

    RingOfRegeneration: () => createMagicItem({
        id: "ring_of_regeneration",
        name: "Ring of Regeneration",
        description: "Heal 2 HP at the start of each turn.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.playerHeal(2);
            }
        }
    }),

    PhylacteryOfFaithfulness: () => createMagicItem({
        id: "phylactery_of_faithfulness",
        name: "Phylactery of Faithfulness",
        description: "Draw 1 extra card at the start of each turn.",
        type: "passive",
        triggers: {
            onTurnStart: (state, scene) => {
                state.drawCard(scene);
            }
        }
    }),

    BracersOfArmor: () => createMagicItem({
        id: "bracers_of_armor",
        name: "Bracers of Armor",
        description: "Gain 4 armor at the start of each battle.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.playerArmor(4);
            }
        }
    }),

    IounStoneOfFortitude: () => createMagicItem({
        id: "ioun_stone_of_fortitude",
        name: "Ioun Stone of Fortitude",
        description: "When you take damage, gain 1 armor.",
        type: "passive",
        triggers: {
            onDamageTaken: (state) => {
                state.playerArmor(1);
            }
        }
    }),

    NecklaceOfFireballs: () => createMagicItem({
        id: "necklace_of_fireballs",
        name: "Necklace of Fireballs",
        description: "When you kill an enemy, deal 4 damage to all other enemies.",
        type: "passive",
        triggers: {
            onEnemyKilled: (state, _enemy, _scene) => {
                state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(4));
            }
        }
    }),

    HandOfTheMage: () => createMagicItem({
        id: "hand_of_the_mage",
        name: "Hand of the Mage",
        description: "Playing a Spell card gives +1 mana back.",
        type: "passive",
        triggers: {
            onCardPlayed: (state, card) => {
                if (card && card.type === 'Spell') {
                    state.mana = Math.min(state.mana + 1, state.maxMana + 2);
                }
            }
        }
    }),

    StoneFamiliar: () => createMagicItem({
        id: "stone_familiar",
        name: "Stone Familiar",
        description: "At end of turn, gain armor equal to unspent mana.",
        type: "passive",
        triggers: {
            onTurnEnd: (state) => {
                if (state.mana > 0) {
                    state.playerArmor(state.mana);
                }
            }
        }
    }),

    // ─── Usable Items ───────────────────────────────────────

    WandOfFire: () => createMagicItem({
        id: "wand_of_fire",
        name: "Wand of Fire",
        description: "Deal 10 damage to a random enemy. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            const alive = state.enemies.filter(e => e.isAlive);
            if (alive.length > 0) {
                const randomTarget = alive[Math.floor(Math.random() * alive.length)];
                randomTarget.takeDamage(10);
            }
        }
    }),

    PotionOfHealing: () => createMagicItem({
        id: "potion_of_healing",
        name: "Potion of Healing",
        description: "Heal 15 HP. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerHeal(15);
        }
    }),

    WandOfLightning: () => createMagicItem({
        id: "wand_of_lightning",
        name: "Wand of Lightning",
        description: "Deal 6 damage to ALL enemies. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(6));
        }
    }),

    ScrollOfHaste: () => createMagicItem({
        id: "scroll_of_haste",
        name: "Scroll of Haste",
        description: "Gain +2 actions this turn. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.actions += 2;
        }
    }),

    PearlOfPower: () => createMagicItem({
        id: "pearl_of_power",
        name: "Pearl of Power",
        description: "Restore 3 mana. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.mana += 3;
        }
    }),

    StaffOfDefense: () => createMagicItem({
        id: "staff_of_defense",
        name: "Staff of Defense",
        description: "Gain 10 armor. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerArmor(10);
        }
    }),

    DustOfDisappearance: () => createMagicItem({
        id: "dust_of_disappearance",
        name: "Dust of Disappearance",
        description: "Gain 20 armor this turn. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerArmor(20);
        }
    }),

    HornOfBlasting: () => createMagicItem({
        id: "horn_of_blasting",
        name: "Horn of Blasting",
        description: "Deal 8 damage to all enemies and stun one for 1 turn. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            const alive = state.enemies.filter(e => e.isAlive);
            alive.forEach(e => e.takeDamage(8));
            if (alive.length > 0) {
                const target = alive[Math.floor(Math.random() * alive.length)];
                target.applyStatus('Stunned', 1);
            }
        }
    }),

    DeckOfManyThings: () => createMagicItem({
        id: "deck_of_many_things",
        name: "Deck of Many Things",
        description: "Draw 3 cards. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state, scene) => {
            state.drawCards(3, scene);
        }
    }),

    RodOfAbsorption: () => createMagicItem({
        id: "rod_of_absorption",
        name: "Rod of Absorption",
        description: "Gain 5 armor and 2 mana. Usable twice per combat.",
        type: "usable",
        usesPerCombat: 2,
        effect: (_, state) => {
            state.playerArmor(5);
            state.mana += 2;
        }
    }),

    // ─── New Passive Items ──────────────────────────────────

    CloakOfDisplacement: () => createMagicItem({
        id: "cloak_of_displacement",
        name: "Cloak of Displacement",
        description: "Gain 3 armor at the start of each combat.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.playerArmor(3);
            }
        }
    }),

    HelmOfBrilliance: () => createMagicItem({
        id: "helm_of_brilliance",
        name: "Helm of Brilliance",
        description: "When you play a Spell, deal 2 damage to all enemies.",
        type: "passive",
        triggers: {
            onCardPlayed: (state, card) => {
                if (card && card.type === 'Spell') {
                    state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(2));
                }
            }
        }
    }),

    GauntletsOfOgrePower: () => createMagicItem({
        id: "gauntlets_of_ogre_power",
        name: "Gauntlets of Ogre Power",
        description: "Attack cards deal +2 damage (applied as bonus to next attack each turn).",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.nextAttackBonus += 2;
            }
        }
    }),

    RingOfEvasion: () => createMagicItem({
        id: "ring_of_evasion",
        name: "Ring of Evasion",
        description: "When you take damage, 25% chance to negate it entirely.",
        type: "passive",
        triggers: {
            onDamageTaken: (state, amount) => {
                if (Math.random() < 0.25) {
                    state.playerHeal(amount);
                }
            }
        }
    }),

    AmuletOfNaturalArmor: () => createMagicItem({
        id: "amulet_of_natural_armor",
        name: "Amulet of Natural Armor",
        description: "Gain 1 armor whenever you play a card.",
        type: "passive",
        triggers: {
            onCardPlayed: (state) => {
                state.playerArmor(1);
            }
        }
    }),

    CloakOfTheMontebank: () => createMagicItem({
        id: "cloak_of_the_mountebank",
        name: "Cloak of the Mountebank",
        description: "When an enemy dies, draw 1 card.",
        type: "passive",
        triggers: {
            onEnemyKilled: (state, _enemy, scene) => {
                state.drawCards(1, scene);
            }
        }
    }),

    FlametongueSword: () => createMagicItem({
        id: "flametongue_sword",
        name: "Flametongue Sword",
        description: "After playing an Attack card, deal 3 fire damage to a random enemy.",
        type: "passive",
        triggers: {
            onCardPlayed: (state, card) => {
                if (card && card.type === 'Attack') {
                    const alive = state.enemies.filter(e => e.isAlive);
                    if (alive.length > 0) {
                        alive[Math.floor(Math.random() * alive.length)].takeDamage(3);
                    }
                }
            }
        }
    }),

    WingedBoots: () => createMagicItem({
        id: "winged_boots",
        name: "Winged Boots",
        description: "At end of turn, if you have unspent actions, gain 2 armor per action.",
        type: "passive",
        triggers: {
            onTurnEnd: (state) => {
                if (state.actions > 0) {
                    state.playerArmor(state.actions * 2);
                }
            }
        }
    }),

    VestOfEscape: () => createMagicItem({
        id: "vest_of_escape",
        name: "Vest of Escape",
        description: "Start each combat with +1 action.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.maxActions += 1;
                state.actions += 1;
            }
        }
    }),

    RuneOfWarding: () => createMagicItem({
        id: "rune_of_warding",
        name: "Rune of Warding",
        description: "The first time you take damage each turn, gain 4 armor.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state._wardingActive = true;
            },
            onDamageTaken: (state) => {
                if (state._wardingActive) {
                    state.playerArmor(4);
                    state._wardingActive = false;
                }
            }
        }
    }),

    // ─── New Usable Items ───────────────────────────────────

    ElixirOfLifeBreath: () => createMagicItem({
        id: "elixir_of_life_breath",
        name: "Elixir of Life's Breath",
        description: "Heal 30 HP. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerHeal(30);
        }
    }),

    StaffOfThunder: () => createMagicItem({
        id: "staff_of_thunder",
        name: "Staff of Thunder",
        description: "Deal 12 damage to all enemies. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(12));
        }
    }),

    ScarabOfProtection: () => createMagicItem({
        id: "scarab_of_protection",
        name: "Scarab of Protection",
        description: "Gain 15 armor and cleanse all debuffs. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerArmor(15);
            state.statuses = {};
        }
    }),

    RodOfWonder: () => createMagicItem({
        id: "rod_of_wonder",
        name: "Rod of Wonder",
        description: "Deal 5-20 random damage to a random enemy. Usable twice per combat.",
        type: "usable",
        usesPerCombat: 2,
        effect: (_, state) => {
            const alive = state.enemies.filter(e => e.isAlive);
            if (alive.length > 0) {
                const dmg = 5 + Math.floor(Math.random() * 16);
                alive[Math.floor(Math.random() * alive.length)].takeDamage(dmg);
            }
        }
    }),

    CrystalBallOfMindReading: () => createMagicItem({
        id: "crystal_ball_of_mind_reading",
        name: "Crystal Ball of Mind Reading",
        description: "Draw 4 cards. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state, scene) => {
            state.drawCards(4, scene);
        }
    })
};

const MagicItemLibrary = {
    magicItems,

    getById(id) {
        for (const key of Object.keys(magicItems)) {
            const item = magicItems[key]();
            if (item.id === id) return item;
        }
        return null;
    },

    getRandom() {
        const keys = Object.keys(magicItems);
        const key = keys[Math.floor(Math.random() * keys.length)];
        return magicItems[key]();
    },

    getRandomMagicItems(amount = 1) {
        const keys = Object.keys(magicItems);
        const shuffled = [...keys].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount).map(k => magicItems[k]());
    }
};

export default MagicItemLibrary;
