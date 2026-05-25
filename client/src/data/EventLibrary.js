import Event from './Event.js';
import CardLibrary from './CardLibrary.js';
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
                text: "Wash your weapons (+2 next attack bonus)",
                effect: (gameState) => {
                    gameState.nextAttackBonus += 2;
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
