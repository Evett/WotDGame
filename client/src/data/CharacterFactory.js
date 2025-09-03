import Character from "./Character";

export default class CharacterFactory {

  static rehydrateCharacter(data) {
    return data instanceof Character ? data : new Character(data);
  }

  static serializeCharacter(char) {
    return {
      name: char.name,
      characterClass: char.characterClass,
      health: char.health,
      actions: char.actions,
      mana: char.mana,
      deck: char.deck,
      heroAbility: char.heroAbility
    };
  }
}