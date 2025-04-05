class Card {
    constructor({ name, actionCost = 1, manaCost = 1, type = "Attack", requiresTarget = false, description = "", effect }) {
        this.name = name;                       // Name
        this.actionCost = actionCost;           // The action cost of the card
        this.manaCost = manaCost;               // The mana cost of the card
        this.type = type;                       // "Attack", "Spell", "Power", etc.
        this.requiresTarget = requiresTarget;   //If a target needs to be selected
        this.description = description;         // Display text
        this.effect = effect;                   // Function to call when played
    }

    play(target, state) {
        if (this.effect) {
            this.effect(target, state);
        }
    }
}

export default Card;