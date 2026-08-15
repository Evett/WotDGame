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

// Cards in starter decks — excluded from rewards and shops
const STARTER_CARD_NAMES = new Set([
  'Strike', 'Block', 'Berserk',
  'Eidolon Strike', 'Summon Khan', 'Phantom Strike',
  'Summon Kamau', 'Planar Binding',
  'Magic Missile', 'Shield', 'Fireball',
  'Blood Fury', 'Raging Howl', 'Arcane Bloodline',
  'Smite Evil', 'Divine Shield', 'Lay on Hands',
  'Sacred Strike', 'Blessing of War', 'Sacrifice'
]);

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
  STARTER_CARD_NAMES,

  getRandomCommonCard() {
    const pool = Object.values(cards.Common)
      .filter(f => !STARTER_CARD_NAMES.has(f().name));
    return pool[Math.floor(Math.random() * pool.length)]();
  },

  getRandomCommonCards(amount = 1) {
    return shuffleArray(Object.values(cards.Common)
      .filter(f => !STARTER_CARD_NAMES.has(f().name)))
      .slice(0, amount)
      .map(factory => factory());
  },

  getCardsForClass(characterClass) {
    return Object.values(cards[characterClass] || {}).map(factory => factory());
  },

  getRandomCardsForClass(characterClass, amount = 1) {
    return shuffleArray(Object.values(cards[characterClass] || {})
      .filter(f => !STARTER_CARD_NAMES.has(f().name)))
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