import Common from './CardDefinitions/Common.js';
import Bloodrager from './CardDefinitions/Bloodrager.js';
import Paladin from './CardDefinitions/Paladin.js';
import Soulbound from './CardDefinitions/Soulbound.js';
import Summoner from './CardDefinitions/Summoner.js';
import Warpriest from './CardDefinitions/Warpriest.js';
import Wizard from './CardDefinitions/Wizard.js';

const cards = {
  Common,
  Bloodrager,
  Paladin,
  Soulbound,
  Summoner,
  Warpriest,
  Wizard
};

function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const CardLibrary = {
  cards,

  getRandomCommonCard() {
    const pool = Object.values(cards.Common);
    return pool[Math.floor(Math.random() * pool.length)]();
  },

  getRandomCommonCards(amount = 1) {
    return shuffleArray(Object.values(cards.Common))
      .slice(0, amount)
      .map(factory => factory());
  },

  getCardsForClass(characterClass) {
    return Object.values(cards[characterClass] || {}).map(factory => factory());
  },

  getRandomCardsForClass(characterClass, amount = 1) {
    return shuffleArray(Object.values(cards[characterClass] || {}))
      .slice(0, amount)
      .map(factory => factory());
  },

  getAllCards() {
    return Object.values(cards).flatMap(set =>
      Object.values(set).map(factory => factory())
    );
  }
};

export default CardLibrary;