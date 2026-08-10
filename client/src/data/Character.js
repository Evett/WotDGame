class Character {
   constructor({ name, characterClass, health, actions, mana, deck, heroAbility, heroAbilityName, heroAbilityDescription, levelBonuses }) {
        this.name = name;
        this.characterClass = characterClass;
        this.health = health;
        this.actions = actions;
        this.mana = mana;
        this.deck = deck;
        this.heroAbility = heroAbility;
        this.heroAbilityName = heroAbilityName || 'Unknown Ability';
        this.heroAbilityDescription = heroAbilityDescription || (() => 'No description');
        this.levelBonuses = levelBonuses || [];
    }
}

export default Character;