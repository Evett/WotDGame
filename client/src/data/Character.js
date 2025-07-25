class Character {
   constructor({ name, characterClass, health, actions, mana, deck, heroAbility }) {
        this.name = name;
        this.characterClass = characterClass;
        this.health = health;
        this.actions = actions;
        this.mana = mana;
        this.deck = deck;
        this.heroAbility = heroAbility;
    }
}

export default Character;