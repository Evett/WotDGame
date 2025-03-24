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
        this.character = null;
    }

    setCharacter(character) {
        this.character = character;
        this.health = character.health;
        this.maxHealth = character.health;
        this.actions = character.actions;
        this.deck = [...character.deck]; // For deck data later
    }

    useHeroAbility() {
        if (this.character?.heroAbility) {
            this.character.heroAbility(this);
        }
    }

}

const gameState = new GameState();
export default gameState;