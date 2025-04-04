class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.health = 100;
        this.maxHealth = 100;
        this.actions = 3;
        this.deck = [];
        this.gold = 50;
        this.relics = [];
        this.currentNode = null;

        //Deck management
        this.fullDeck = [];
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];
        this.handLimit = 6;

        this.character = null;
    }

    setCharacter(character) {
        this.character = character;
        this.health = character.health;
        this.maxHealth = character.health;
        this.actions = character.actions;

        this.fullDeck = [...character.deck]; //Initial deck
        this.drawPile = this.fullDeck;
        console.log("Initial deck:", this.fullDeck);
        this.shuffleDeck();
        console.log("After shuffle deck draw pile:", this.drawPile);
        this.drawHand();
        console.log("Initial hand:", this.hand);
    }

    useHeroAbility() {
        if (this.character?.heroAbility) {
            this.character.heroAbility(this);
        }
    }

    shuffleDeck() {
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
    }

    drawCard() {
        if (this.drawPile.length === 0) {
            this.restockDeck();
        }
        if (this.drawPile.length > 0 && this.hand.length < this.handLimit) {
            const card = this.drawPile.pop();
            console.log("You just drew this card:", card);
            this.hand.push(card);
        }
    }

    drawHand() {
        while (this.hand.length < this.handLimit && this.drawPile.length > 0) {
            this.drawCard();
        }
    }

    playCard(index) {
        if (index >= 0 && index < this.hand.length) {
            const card = this.hand.splice(index, 1)[0];
            card.play(null, this);
            console.log("You just played this card:", card);
            this.discardPile.push(card);
            // Card effects
        }
    }

    discardHand() {
        this.discardPile.push(...this.hand);
        this.hand = [];
    }

    restockDeck() {
        if (this.discardPile.length > 0) {
            this.drawPile = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDeck();
        }
    }

}

const gameState = new GameState();
export default gameState;