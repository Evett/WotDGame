class Card {
    constructor({ name, cost = 1, type = "Attack", description = "", effect }) {
        this.name = name;               // Name
        this.cost = cost;               // Energy/action/mana cost, haven't decided
        this.type = type;               // "Attack", "Spell", "Power", etc.
        this.description = description; // Display text
        this.effect = effect;           // Function to call when played
    }

    play(target, state) {
        if (this.effect) {
            this.effect(target, state);
        }
    }
}

export default Card;