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
        description: "Your first attack each turn deals +3 damage.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.flatDamageBonus += 3;
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
                state.actions += 1;
            }
        }
    }),

    RingOfSustenance: () => createMagicItem({
        id: "ring_of_sustenance",
        name: "Ring of Sustenance",
        description: "Heal 2 HP at the start of each turn.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.playerHeal(2);
            }
        }
    }),

    StoneOfGoodLuck: () => createMagicItem({
        id: "stone_of_good_luck",
        name: "Stone of Good Luck",
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

    RingOfProtection: () => createMagicItem({
        id: "ring_of_protection",
        name: "Ring of Protection",
        description: "When you take damage, gain 1 armor.",
        type: "passive",
        triggers: {
            onDamageTaken: (state) => {
                state.playerArmor(1);
            }
        }
    }),

    NecklaceOfInfernos: () => createMagicItem({
        id: "necklace_of_infernos",
        name: "Necklace of Infernos",
        description: "When you kill an enemy, deal 4 damage to all other enemies.",
        type: "passive",
        triggers: {
            onEnemyKilled: (state, _enemy, _scene) => {
                state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(4));
            }
        }
    }),

    SilverHand: () => createMagicItem({
        id: "silver_hand",
        name: "Silver Hand",
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

    GuidingVellum: () => createMagicItem({
        id: "guiding_vellum",
        name: "Guiding Vellum",
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

    FortunesArrow: () => createMagicItem({
        id: "fortunes_arrow",
        name: "Fortune's Arrow",
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

    StaffOfShittyHealing: () => createMagicItem({
        id: "staff_of_shitty_healing",
        name: "Staff of Shitty Healing",
        description: "Heal 15 HP. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerHeal(15);
        }
    }),

    BookOfInfiniteSpells: () => createMagicItem({
        id: "book_of_infinite_spells",
        name: "Book of Infinite Spells",
        description: "Deal 6 damage to ALL enemies. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(6));
        }
    }),

    BootsOfTeleportation: () => createMagicItem({
        id: "boots_of_teleportation",
        name: "Boots of Teleportation",
        description: "Gain +2 actions this turn. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.actions += 2;
        }
    }),

    BountifulBottle: () => createMagicItem({
        id: "bountiful_bottle",
        name: "Bountiful Bottle",
        description: "Restore 3 mana. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.mana += 3;
        }
    }),

    TheOneWhoFindsPeaceInTheSun: () => createMagicItem({
        id: "the_one_who_finds_peace_in_the_sun",
        name: "The One Who Finds Peace in the Sun",
        description: "Gain 20 armor. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerArmor(20);
        }
    }),

    ShieldOfSunrise: () => createMagicItem({
        id: "shield_of_sunrise",
        name: "Shield of Sunrise",
        description: "Gain 10 armor this turn. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerArmor(10);
        }
    }),

    TheWhisperingGrove: () => createMagicItem({
        id: "the_whispering_grove",
        name: "The Whispering Grove",
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

    NargrymsSteelHand: () => createMagicItem({
        id: "nargryms_steel_hand",
        name: "Nargrym's Steel Hand",
        description: "Gain 5 armor and 2 mana. Usable twice per combat.",
        type: "usable",
        usesPerCombat: 2,
        effect: (_, state) => {
            state.playerArmor(5);
            state.mana += 2;
        }
    }),

    // ─── New Passive Items ──────────────────────────────────

    PhoenixArmor: () => createMagicItem({
        id: "phoenix_armor",
        name: "Phoenix Armor",
        description: "Gain 3 armor at the start of each combat.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.playerArmor(3);
            }
        }
    }),

    BouncingMetamagicRod: () => createMagicItem({
        id: "bouncing_metamagic_rod",
        name: "Bouncing Metamagic Rod",
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

    AimarsResolve: () => createMagicItem({
        id: "aimars_resolve",
        name: "Aimar's Resolve",
        description: "Attack cards deal +2 damage each turn.",
        type: "passive",
        triggers: {
            onTurnStart: (state) => {
                state.flatDamageBonus += 2;
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

    TheTailOfKhan: () => createMagicItem({
        id: "the_tail_of_khan",
        name: "The Tail of Khan",
        description: "When an enemy dies, draw 1 card.",
        type: "passive",
        triggers: {
            onEnemyKilled: (state, _enemy, scene) => {
                state.drawCards(1, scene);
            }
        }
    }),

    DawnbladeOfIomedae: () => createMagicItem({
        id: "dawnblade_of_iomedae",
        name: "Dawnblade of Iomedae",
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

    VyzstraziumSnarlshield: () => createMagicItem({
        id: "vyzstrazium_snarlshield",
        name: "Vyzstrazium Snarlshield",
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

    KaravansRing: () => createMagicItem({
        id: "karavans_ring",
        name: "Karavan's Ring",
        description: "Start each combat with +1 action.",
        type: "passive",
        triggers: {
            onBattleStart: (state) => {
                state.actions += 1;
            }
        }
    }),

    CelestialArmor: () => createMagicItem({
        id: "celestial_armor",
        name: "Celestial Armor",
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

    DragonboundGauntlets: () => createMagicItem({
        id: "dragonbound_gauntlets",
        name: "Dragonbound Gauntlets",
        description: "Deal 12 damage to all enemies. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.enemies.filter(e => e.isAlive).forEach(e => e.takeDamage(12));
        }
    }),

    BeaconOfTrueFaith: () => createMagicItem({
        id: "beacon_of_true_faith",
        name: "Beacon of True Faith",
        description: "Gain 15 armor and cleanse all debuffs. Usable once per combat.",
        type: "usable",
        usesPerCombat: 1,
        effect: (_, state) => {
            state.playerArmor(15);
            state.statuses = {};
        }
    }),

    QAndVBeacon: () => createMagicItem({
        id: "q_and_v_beacon",
        name: "Q and V Beacon",
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

    TheSoulbindReliquary: () => createMagicItem({
        id: "the_soulbind_reliquary",
        name: "The Soulbind Reliquary",
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
