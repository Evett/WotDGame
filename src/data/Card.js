class Card {
    constructor({ name, actionCost = 1, manaCost = 1, type = "Attack", requiresTarget = false, isOncePerDay = false, description = "", upgradedDescription = "", effect, upgraded }) {
        this.name = name;                                       // Name
        this.actionCost = actionCost;                           // The action cost of the card
        this.manaCost = manaCost;                               // The mana cost of the card
        this.type = type;                                       // "Attack", "Spell", "Power", etc.
        this.requiresTarget = requiresTarget;                   // If a target needs to be selected
        this.isOncePerDay = isOncePerDay;                       // If a card is only available once per day
        this.description = description;                         // Display text
        this.upgradedDescription = upgradedDescription;         // Upgraded display text
        this.effect = effect;                                   // Function to call when played
        this.upgraded = upgraded;                               // Check if it is upgraded or not
    }

    play(target, state, card, scene) {
        if (this.effect) {
            this.effect(target, state, card, scene);
        }
    }

    getDescription() {
        return this.upgraded ? this.upgradedDescription : this.description;
    }
    upgrade() {
        this.upgraded = true;
    }
}

export default Card;