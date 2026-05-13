import Character from './Character.js';
import CharacterLibrary from './CharacterLibrary.js';
import CardFactory from './CardFactory.js';

export default class CharacterFactory {

    static rehydrateCharacter(data) {
        if (data instanceof Character) return data;

        // Look up the character by name to restore the heroAbility function
        for (const [key, char] of Object.entries(CharacterLibrary)) {
            if (char.name === data.name) {
                return new Character({
                    ...data,
                    deck: CardFactory.rehydrateCards(data.deck),
                    heroAbility: char.heroAbility
                });
            }
        }

        console.warn(`Could not find heroAbility for character: ${data.name}`);
        return new Character(data);
    }

    static serializeCharacter(char) {
        return {
            name: char.name,
            characterClass: char.characterClass,
            health: char.health,
            actions: char.actions,
            mana: char.mana,
            deck: CardFactory.serializeCards(char.deck),
        };
    }
}
