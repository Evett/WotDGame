import Event from './Event.js';
import CardLibrary from './CardLibrary.js';

const createEvent = (options) => new Event(options);

const EventTags = {
    HEALING: "healing",
    GOLD: "gold",
    RISKY: "risky",
    CARD: "card",
    COMBAT: "combat",
    SAFE: "safe",
    NEUTRAL: "neutral"
}

const events = {
    LostMerchant: createEvent( {
        title: "Lost Merchant",
        description: "You find a traveling merchant trapped beneath a fallen cart.",
        tags: [EventTags.GOLD, EventTags.NEUTRAL],
        choices: [
            {
                text: "Help him (+20 gold)",
                effect: (state, scene) => {
                    state.gainGold(20);
                    scene.sceneManager.switchScene('MapScene');
                }
            },
            {
                text: "Ignore and move on",
                effect: (state, scene) => {
                    scene.sceneManager.switchScene('MapScene');
                }
            }
        ]
    }),
    
    WanderingSpirit: createEvent( {
        title: "Wandering Spirit",
        description: "A ghost offers to share forgotten knowledge for a part of your soul.",
        tags: [EventTags.CARD, EventTags.RISKY],
        choices: [
            {
                text: "Lose 10 HP, gain a random card",
                effect: (state, scene) => {
                    state.playerTakeDamage(10);
                    state.addCard(CardLibrary.getRandom());
                    scene.sceneManager.switchScene('MapScene');
                }
            },
            {
                text: "Refuse politely",
                effect: (state, scene) => {
                    scene.sceneManager.switchScene('MapScene');
                }
            }
        ]
    })
}

const EventLibrary = {
    events,
    getRandom: () => Phaser.Utils.Array.GetRandom(Object.values(events)),

    getRandomWithTag(tag) {
        const filtered = Object.values(events).filter(event =>
            event.tags && event.tags.includes(tag)
        );
        return Phaser.Utils.Array.GetRandom(filtered);
    },
    //Usage: EventLibrary.getRandomWithTag(EventTags.HEALING);

    getRandomMatching(filterFn) {
        const filtered = Object.values(events).filter(filterFn);
        return Phaser.Utils.Array.GetRandom(filtered);
    }
    //Usage: EventLibrary.getRandomMatching(event => event.tags.included(EventTags.HEALING) || event.tags.included(EventTags.SAFE));
    //Usage with other filter: EventLibrary.getRandomMatching(event => state.health > 10 || !eventtags.includes(EventTags.RISKY));
};

export default EventLibrary;