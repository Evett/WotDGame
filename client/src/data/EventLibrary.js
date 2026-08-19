import Event from './Event.js';
import CardLibrary from './CardLibrary.js';
import MagicItemLibrary from './MagicItemLibrary.js';
import EventTags from './EventTags.js';

const createEvent = (options) => new Event(options);

const events = {
    LostMerchant: createEvent({
        title: "Lost Merchant",
        description: "You find a traveling merchant trapped beneath a fallen cart. His goods are scattered across the road.",
        tags: [EventTags.GOLD, EventTags.NEUTRAL],
        choices: [
            {
                text: "Help him free (+20 gold)",
                effect: (gameState) => {
                    gameState.gold += 20;
                }
            },
            {
                text: "Loot his scattered goods (+35 gold, lose 5 HP)",
                effect: (gameState) => {
                    gameState.gold += 35;
                    gameState.playerTakeDamage(5);
                }
            },
            {
                text: "Ignore and move on",
                effect: () => {}
            }
        ]
    }),

    WanderingSpirit: createEvent({
        title: "Wandering Spirit",
        description: "A ghost emerges from the mist, offering forgotten knowledge in exchange for a fragment of your soul.",
        tags: [EventTags.CARD, EventTags.RISKY],
        choices: [
            {
                text: "Accept the bargain (-10 HP, gain a random card)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(10);
                    const cards = CardLibrary.getRandomCardsForClass(gameState.characterClass, 1);
                    if (cards.length > 0) gameState.addCard(cards[0]);
                }
            },
            {
                text: "Refuse politely",
                effect: () => {}
            }
        ]
    }),

    MysteriousFountain: createEvent({
        title: "Mysterious Fountain",
        description: "A glowing fountain bubbles in a clearing. The water shimmers with an otherworldly light.",
        tags: [EventTags.HEALING, EventTags.SAFE],
        choices: [
            {
                text: "Drink deeply (Heal 20 HP)",
                effect: (gameState) => {
                    gameState.playerHeal(20);
                }
            },
            {
                text: "Wash your weapons (+2 damage next combat)",
                effect: (gameState) => {
                    gameState.flatDamageBonus += 2;
                }
            },
            {
                text: "Fill a vial for later (+5 max HP permanently)",
                effect: (gameState) => {
                    gameState.maxHealth += 5;
                    gameState.playerHeal(5);
                }
            }
        ]
    }),

    AbandonedShrine: createEvent({
        title: "Abandoned Shrine",
        description: "An old stone shrine dedicated to a forgotten god stands half-buried in vines. You sense lingering power.",
        tags: [EventTags.RISKY, EventTags.CARD],
        choices: [
            {
                text: "Pray at the shrine (+1 max mana)",
                effect: (gameState) => {
                    gameState.maxMana += 1;
                    gameState.mana += 1;
                }
            },
            {
                text: "Smash the shrine (gain 30 gold, lose 8 HP)",
                effect: (gameState) => {
                    gameState.gold += 30;
                    gameState.playerTakeDamage(8);
                }
            },
            {
                text: "Leave it alone",
                effect: () => {}
            }
        ]
    }),

    GoblinGamblers: createEvent({
        title: "Goblin Gamblers",
        description: "A group of goblins huddle around a makeshift table, rolling dice. They wave you over with crooked grins.",
        tags: [EventTags.GOLD, EventTags.RISKY],
        choices: [
            {
                text: "Gamble 15 gold (50% chance to double it)",
                effect: (gameState) => {
                    if (gameState.gold < 15) return;
                    gameState.gold -= 15;
                    if (Math.random() < 0.5) {
                        gameState.gold += 30;
                    }
                }
            },
            {
                text: "Rob them blind (+25 gold, lose 12 HP)",
                effect: (gameState) => {
                    gameState.gold += 25;
                    gameState.playerTakeDamage(12);
                }
            },
            {
                text: "Walk away",
                effect: () => {}
            }
        ]
    }),

    WoundedSoldier: createEvent({
        title: "Wounded Soldier",
        description: "A battered soldier leans against a tree, clutching a bloody wound. He reaches out a hand, offering his blade.",
        tags: [EventTags.CARD, EventTags.NEUTRAL],
        choices: [
            {
                text: "Heal him (-8 HP, gain a common card)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(8);
                    const card = CardLibrary.getRandomCommonCard();
                    gameState.addCard(card);
                }
            },
            {
                text: "Take his supplies (+15 gold)",
                effect: (gameState) => {
                    gameState.gold += 15;
                }
            },
            {
                text: "Help without cost (Heal 5 HP from karma)",
                effect: (gameState) => {
                    gameState.playerHeal(5);
                }
            }
        ]
    }),

    DarkBargain: createEvent({
        title: "Dark Bargain",
        description: "A cloaked figure blocks your path. 'I can make you stronger,' it whispers, 'for a small price...'",
        tags: [EventTags.RISKY, EventTags.CARD],
        choices: [
            {
                text: "Accept the bargain (-15 HP, +2 max actions)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(15);
                    gameState.maxActions += 2;
                    gameState.actions += 2;
                }
            },
            {
                text: "Demand gold instead (-10 HP, +40 gold)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(10);
                    gameState.gold += 40;
                }
            },
            {
                text: "Refuse and fight your way past (-5 HP)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(5);
                }
            }
        ]
    }),

    TravelingBard: createEvent({
        title: "Traveling Bard",
        description: "A jovial bard sits by a campfire, strumming a lute. 'Sit, friend! Let me play you a song.'",
        tags: [EventTags.HEALING, EventTags.SAFE],
        choices: [
            {
                text: "Rest by the fire (Heal 15 HP)",
                effect: (gameState) => {
                    gameState.playerHeal(15);
                }
            },
            {
                text: "Trade stories (+10 gold)",
                effect: (gameState) => {
                    gameState.gold += 10;
                }
            },
            {
                text: "Ask for a blessing (+3 armor)",
                effect: (gameState) => {
                    gameState.playerArmor(3);
                }
            }
        ]
    }),

    // ─── Card Removal Events ────────────────────────────────

    ForgottenLibrary: createEvent({
        title: "Forgotten Library",
        description: "Dusty shelves line the walls of a hidden chamber. An ancient librarian offers to help you forget useless knowledge.",
        tags: [EventTags.CARD, EventTags.SAFE],
        choices: [
            {
                text: "Remove a random card from your deck",
                effect: (gameState) => {
                    if (gameState.fullDeck.length > 3) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                    }
                }
            },
            {
                text: "Pay 30 gold to remove 2 random cards",
                effect: (gameState) => {
                    if (gameState.gold >= 30 && gameState.fullDeck.length > 4) {
                        gameState.gold -= 30;
                        for (let i = 0; i < 2; i++) {
                            const index = Math.floor(Math.random() * gameState.fullDeck.length);
                            gameState.fullDeck.splice(index, 1);
                        }
                    }
                }
            },
            {
                text: "Leave the library",
                effect: () => {}
            }
        ]
    }),

    PurifyingFlame: createEvent({
        title: "Purifying Flame",
        description: "A sacred brazier burns with white fire. You sense it could burn away weakness — or flesh.",
        tags: [EventTags.CARD, EventTags.RISKY],
        choices: [
            {
                text: "Cast a card into the flame (Remove a random card, lose 5 HP)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(5);
                    if (gameState.fullDeck.length > 3) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                    }
                }
            },
            {
                text: "Plunge your hands in (Remove 2 random cards, lose 15 HP)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(15);
                    for (let i = 0; i < 2 && gameState.fullDeck.length > 3; i++) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                    }
                }
            },
            {
                text: "Back away from the flames",
                effect: () => {}
            }
        ]
    }),

    // ─── Card Upgrade Events ────────────────────────────────

    MasterSmith: createEvent({
        title: "Master Smith",
        description: "A dwarven smith pounds at an enchanted anvil. Sparks of magic fly with each strike. 'Bring me something to improve!'",
        tags: [EventTags.CARD, EventTags.SAFE],
        choices: [
            {
                text: "Upgrade a random card (Free)",
                effect: (gameState) => {
                    const upgradeable = gameState.fullDeck.filter(c => !c.upgraded);
                    if (upgradeable.length > 0) {
                        const card = upgradeable[Math.floor(Math.random() * upgradeable.length)];
                        card.upgrade();
                    }
                }
            },
            {
                text: "Pay 40 gold to upgrade 2 random cards",
                effect: (gameState) => {
                    if (gameState.gold >= 40) {
                        gameState.gold -= 40;
                        const upgradeable = gameState.fullDeck.filter(c => !c.upgraded);
                        for (let i = 0; i < 2 && upgradeable.length > 0; i++) {
                            const index = Math.floor(Math.random() * upgradeable.length);
                            upgradeable[index].upgrade();
                            upgradeable.splice(index, 1);
                        }
                    }
                }
            },
            {
                text: "Decline the offer",
                effect: () => {}
            }
        ]
    }),

    ArcaneInfusion: createEvent({
        title: "Arcane Infusion",
        description: "A glowing ley line pulses beneath the ground. Its energy could empower your abilities — or overwhelm them.",
        tags: [EventTags.CARD, EventTags.RISKY],
        choices: [
            {
                text: "Channel the energy (Upgrade 2 random cards, lose 10 HP)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(10);
                    const upgradeable = gameState.fullDeck.filter(c => !c.upgraded);
                    for (let i = 0; i < 2 && upgradeable.length > 0; i++) {
                        const index = Math.floor(Math.random() * upgradeable.length);
                        upgradeable[index].upgrade();
                        upgradeable.splice(index, 1);
                    }
                }
            },
            {
                text: "Absorb cautiously (Upgrade 1 random card)",
                effect: (gameState) => {
                    const upgradeable = gameState.fullDeck.filter(c => !c.upgraded);
                    if (upgradeable.length > 0) {
                        const card = upgradeable[Math.floor(Math.random() * upgradeable.length)];
                        card.upgrade();
                    }
                }
            },
            {
                text: "Leave the ley line undisturbed",
                effect: () => {}
            }
        ]
    }),

    // ─── Magic Item Events ──────────────────────────────────

    RelicVault: createEvent({
        title: "Relic Vault",
        description: "Behind a crumbling wall you discover a vault filled with enchanted treasures, protected by a fading ward.",
        tags: [EventTags.CARD, EventTags.SAFE],
        choices: [
            {
                text: "Take a magic item",
                effect: (gameState) => {
                    const item = MagicItemLibrary.getRandom();
                    gameState.addMagicItem(item);
                }
            },
            {
                text: "Search deeper (-8 HP, take a magic item and gain 15 gold)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(8);
                    const item = MagicItemLibrary.getRandom();
                    gameState.addMagicItem(item);
                    gameState.gold += 15;
                }
            },
            {
                text: "Leave the vault sealed",
                effect: () => {}
            }
        ]
    }),

    WitchsHut: createEvent({
        title: "Witch's Hut",
        description: "A crooked hut sits in a clearing, smoke curling from its chimney. The witch inside cackles as you approach.",
        tags: [EventTags.RISKY, EventTags.CARD],
        choices: [
            {
                text: "Trade 20 HP for a magic item",
                effect: (gameState) => {
                    gameState.playerTakeDamage(20);
                    const item = MagicItemLibrary.getRandom();
                    gameState.addMagicItem(item);
                }
            },
            {
                text: "Buy a potion (Pay 25 gold, heal 30 HP)",
                effect: (gameState) => {
                    if (gameState.gold >= 25) {
                        gameState.gold -= 25;
                        gameState.playerHeal(30);
                    }
                }
            },
            {
                text: "Flee before she curses you",
                effect: () => {}
            }
        ]
    }),

    FallenAdventurer: createEvent({
        title: "Fallen Adventurer",
        description: "A skeleton in rusted armor lies against a dungeon wall. Its pack is still intact, a faint glow emanating from within.",
        tags: [EventTags.CARD, EventTags.NEUTRAL],
        choices: [
            {
                text: "Take the magic item from their pack",
                effect: (gameState) => {
                    const item = MagicItemLibrary.getRandom();
                    gameState.addMagicItem(item);
                }
            },
            {
                text: "Take their gold pouch (+30 gold)",
                effect: (gameState) => {
                    gameState.gold += 30;
                }
            },
            {
                text: "Pay respects and gain resolve (+10 max HP)",
                effect: (gameState) => {
                    gameState.maxHealth += 10;
                    gameState.playerHeal(10);
                }
            }
        ]
    }),

    // ─── Stat Boost Events ──────────────────────────────────

    DragonbloodSpring: createEvent({
        title: "Dragonblood Spring",
        description: "Steaming water flows from a crack in a volcanic wall. The liquid glows with draconic essence.",
        tags: [EventTags.RISKY, EventTags.HEALING],
        choices: [
            {
                text: "Bathe in the spring (+15 max HP, lose 10 current HP)",
                effect: (gameState) => {
                    gameState.maxHealth += 15;
                    gameState.playerTakeDamage(10);
                }
            },
            {
                text: "Drink the water (+1 max mana)",
                effect: (gameState) => {
                    gameState.maxMana += 1;
                }
            },
            {
                text: "It looks dangerous — leave",
                effect: () => {}
            }
        ]
    }),

    WarriorsTrial: createEvent({
        title: "Warrior's Trial",
        description: "Stone statues guard a training ground. A voice echoes: 'Prove your worth and be rewarded.'",
        tags: [EventTags.RISKY, EventTags.COMBAT],
        choices: [
            {
                text: "Accept the trial (-15 HP, +1 max actions permanently)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(15);
                    gameState.maxActions += 1;
                }
            },
            {
                text: "Meditate instead (Heal 10 HP, +1 hand size)",
                effect: (gameState) => {
                    gameState.playerHeal(10);
                    gameState.handLimit += 1;
                }
            },
            {
                text: "Decline the trial",
                effect: () => {}
            }
        ]
    }),

    AncientRunestone: createEvent({
        title: "Ancient Runestone",
        description: "A massive runestone hums with power. Symbols on its surface shift and change as you approach.",
        tags: [EventTags.CARD, EventTags.NEUTRAL],
        choices: [
            {
                text: "Touch the rune of power (+1 max mana, +1 max actions)",
                effect: (gameState) => {
                    gameState.maxMana += 1;
                    gameState.maxActions += 1;
                }
            },
            {
                text: "Touch the rune of life (+20 max HP)",
                effect: (gameState) => {
                    gameState.maxHealth += 20;
                    gameState.playerHeal(20);
                }
            },
            {
                text: "Touch the rune of knowledge (Gain 2 class cards)",
                effect: (gameState) => {
                    const cards = CardLibrary.getRandomCardsForClass(gameState.characterClass, 2);
                    cards.forEach(c => gameState.addCard(c));
                }
            }
        ]
    }),

    // ─── Card Reward Events ─────────────────────────────────

    ArcaneTome: createEvent({
        title: "Arcane Tome",
        description: "A floating book opens itself before you, its pages filled with techniques from every discipline.",
        tags: [EventTags.CARD, EventTags.SAFE],
        choices: [
            {
                text: "Study your own craft (Gain 2 class cards)",
                effect: (gameState) => {
                    const cards = CardLibrary.getRandomCardsForClass(gameState.characterClass, 2);
                    cards.forEach(c => gameState.addCard(c));
                }
            },
            {
                text: "Learn universal techniques (Gain 2 common cards)",
                effect: (gameState) => {
                    const cards = CardLibrary.getRandomCommonCards(2);
                    cards.forEach(c => gameState.addCard(c));
                }
            },
            {
                text: "Close the book (Gain 15 gold from selling it)",
                effect: (gameState) => {
                    gameState.gold += 15;
                }
            }
        ]
    }),

    GhostlyMentor: createEvent({
        title: "Ghostly Mentor",
        description: "The translucent spirit of a master warrior appears. 'I will teach you one last lesson before I pass on.'",
        tags: [EventTags.CARD, EventTags.SAFE],
        choices: [
            {
                text: "Learn an advanced technique (Gain 1 random upgraded class card)",
                effect: (gameState) => {
                    const cards = CardLibrary.getRandomCardsForClass(gameState.characterClass, 1);
                    if (cards.length > 0) {
                        cards[0].upgrade();
                        gameState.addCard(cards[0]);
                    }
                }
            },
            {
                text: "Ask about fundamentals (Gain 1 random upgraded common card)",
                effect: (gameState) => {
                    const card = CardLibrary.getRandomCommonCard();
                    card.upgrade();
                    gameState.addCard(card);
                }
            },
            {
                text: "Ask for blessing (+5 max HP, heal to full)",
                effect: (gameState) => {
                    gameState.maxHealth += 5;
                    gameState.health = gameState.maxHealth;
                }
            }
        ]
    }),

    // ─── Mixed / Gamble Events ──────────────────────────────

    CursedChest: createEvent({
        title: "Cursed Chest",
        description: "A chest bound in chains radiates dark energy. Something valuable must be worth such protection.",
        tags: [EventTags.RISKY, EventTags.GOLD],
        choices: [
            {
                text: "Break the chains (50% chance: +60 gold OR lose 20 HP)",
                effect: (gameState) => {
                    if (Math.random() < 0.5) {
                        gameState.gold += 60;
                    } else {
                        gameState.playerTakeDamage(20);
                    }
                }
            },
            {
                text: "Pick the lock carefully (Gain a magic item, lose 5 HP)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(5);
                    const item = MagicItemLibrary.getRandom();
                    gameState.addMagicItem(item);
                }
            },
            {
                text: "Leave the chest alone",
                effect: () => {}
            }
        ]
    }),

    FeyBargain: createEvent({
        title: "Fey Bargain",
        description: "A mischievous pixie hovers before you. 'Trade, trade! Something of yours for something of mine!'",
        tags: [EventTags.RISKY, EventTags.CARD],
        choices: [
            {
                text: "Trade a random card for a better one (Remove 1, gain 1 upgraded class card)",
                effect: (gameState) => {
                    if (gameState.fullDeck.length > 3) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                        const cards = CardLibrary.getRandomCardsForClass(gameState.characterClass, 1);
                        if (cards.length > 0) {
                            cards[0].upgrade();
                            gameState.addCard(cards[0]);
                        }
                    }
                }
            },
            {
                text: "Trade 10 HP for 30 gold",
                effect: (gameState) => {
                    gameState.playerTakeDamage(10);
                    gameState.gold += 30;
                }
            },
            {
                text: "Refuse the fey's deal",
                effect: () => {}
            }
        ]
    }),

    BloodAltar: createEvent({
        title: "Blood Altar",
        description: "A stone altar covered in dried blood stands in a dark chamber. Power radiates from the crimson runes.",
        tags: [EventTags.RISKY, EventTags.CARD],
        choices: [
            {
                text: "Sacrifice 50 HP (Upgrade all Attack cards in your deck)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(50);
                    gameState.fullDeck.filter(c => c.type === 'Attack' && !c.upgraded)
                        .forEach(c => c.upgrade());
                }
            },
            {
                text: "Sacrifice 25 HP (Gain +2 max mana)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(25);
                    gameState.maxMana += 2;
                }
            },
            {
                text: "The price is too high — leave",
                effect: () => {}
            }
        ]
    }),

    WanderingTrader: createEvent({
        title: "Wandering Trader",
        description: "A hooded trader with a floating carpet of wares blocks your path. 'Everything has a price, friend.'",
        tags: [EventTags.GOLD, EventTags.CARD],
        choices: [
            {
                text: "Buy a magic item (50 gold)",
                effect: (gameState) => {
                    if (gameState.gold >= 50) {
                        gameState.gold -= 50;
                        const item = MagicItemLibrary.getRandom();
                        gameState.addMagicItem(item);
                    }
                }
            },
            {
                text: "Buy 3 random class cards (35 gold)",
                effect: (gameState) => {
                    if (gameState.gold >= 35) {
                        gameState.gold -= 35;
                        const cards = CardLibrary.getRandomCardsForClass(gameState.characterClass, 3);
                        cards.forEach(c => gameState.addCard(c));
                    }
                }
            },
            {
                text: "Sell a random card (+20 gold)",
                effect: (gameState) => {
                    if (gameState.fullDeck.length > 3) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                        gameState.gold += 20;
                    }
                }
            }
        ]
    }),

    DreamRealm: createEvent({
        title: "Dream Realm",
        description: "You fall into a deep sleep and find yourself in a surreal landscape where thought becomes reality.",
        tags: [EventTags.CARD, EventTags.SAFE],
        choices: [
            {
                text: "Dream of strength (Upgrade 3 random cards)",
                effect: (gameState) => {
                    const upgradeable = gameState.fullDeck.filter(c => !c.upgraded);
                    const shuffled = [...upgradeable].sort(() => Math.random() - 0.5);
                    shuffled.slice(0, 3).forEach(c => c.upgrade());
                }
            },
            {
                text: "Dream of purity (Remove 2 random cards)",
                effect: (gameState) => {
                    for (let i = 0; i < 2 && gameState.fullDeck.length > 3; i++) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                    }
                }
            },
            {
                text: "Dream of restoration (Heal to full HP)",
                effect: (gameState) => {
                    gameState.health = gameState.maxHealth;
                }
            }
        ]
    }),

    TimeDistortion: createEvent({
        title: "Time Distortion",
        description: "Reality warps around you. Past and future blur together. You could reshape your destiny here.",
        tags: [EventTags.RISKY, EventTags.CARD],
        choices: [
            {
                text: "Rewind time (Remove 3 cards at random, lose 10 HP)",
                effect: (gameState) => {
                    gameState.playerTakeDamage(10);
                    for (let i = 0; i < 3 && gameState.fullDeck.length > 3; i++) {
                        const index = Math.floor(Math.random() * gameState.fullDeck.length);
                        gameState.fullDeck.splice(index, 1);
                    }
                }
            },
            {
                text: "Accelerate forward (+1 action, +1 mana, +1 hand size)",
                effect: (gameState) => {
                    gameState.maxActions += 1;
                    gameState.maxMana += 1;
                    gameState.handLimit += 1;
                }
            },
            {
                text: "Stay in the present moment",
                effect: () => {}
            }
        ]
    })
};

function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const EventLibrary = {
    events,

    getRandom() {
        const pool = Object.values(events);
        return pool[Math.floor(Math.random() * pool.length)];
    },

    getRandomWithTag(tag) {
        const filtered = Object.values(events).filter(event =>
            event.tags && event.tags.includes(tag)
        );
        if (filtered.length === 0) return this.getRandom();
        return filtered[Math.floor(Math.random() * filtered.length)];
    },

    getRandomMatching(filterFn) {
        const filtered = Object.values(events).filter(filterFn);
        if (filtered.length === 0) return this.getRandom();
        return filtered[Math.floor(Math.random() * filtered.length)];
    }
};

export default EventLibrary;
