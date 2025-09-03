import Character from "./Character";

export default class CharacterFactory {

  static rehydrateCharacter(arr) {
    if (!arr) return [];
    return arr.map(c => c instanceof Character ? c : new Character(c));
  }

  static serializeCharacter(arr) {
    if (!arr) return [];
    return arr.map(c => ({
      name: c.name,
      characterClass: c.characterClass,
      health: c.health,
      actions: c.actions,
      mana: c.mana,
      deck: c.deck,
      heroAbility: c.heroAbility
    }));
  }
}