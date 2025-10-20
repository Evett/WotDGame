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

const CardLibrary = {
  cards,

  getRandomCommonCard() {
    const pool = Object.values(cards.Common);
    return Phaser.Utils.Array.GetRandom(pool)(); // Call the factory
  },

  getRandomCommonCards(amount = 1) {
    return Phaser.Utils.Array.Shuffle(Object.values(cards.Common))
      .slice(0, amount)
      .map(factory => factory());
  },

  getCardsForClass(characterClass) {
    return Object.values(cards[characterClass] || {}).map(factory => factory());
  },

  getRandomCardsForClass(characterClass, amount = 1) {
    return Phaser.Utils.Array.Shuffle(Object.values(cards[characterClass] || {}))
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