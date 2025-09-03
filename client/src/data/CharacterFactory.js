import Character from "./Character";

export default class CharacterFactory {

  static rehydrateCharacter(data) {
    return data instanceof Character ? data : new Character(data);
  }

  static serializeCharacter(char) {
    return {
      name: c.name,
      characterClass: c.characterClass,
      health: c.health,
      actions: c.actions,
      mana: c.mana,
      deck: c.deck,
      heroAbility: c.heroAbility
    };
  }
}