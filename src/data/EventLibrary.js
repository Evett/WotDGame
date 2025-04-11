import Event from './Event.js';
import CardLibrary from './CardLibrary.js';

const createEvent = (options) => new Event(options);

const events = {
    LostMerchant: createEvent( {
        title: "Lost Merchant",
        description: "You find a traveling merchant trapped beneath a fallen cart.",
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
};

export default EventLibrary;