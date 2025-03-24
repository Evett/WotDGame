class GameState {
    constructor() {
        this.health = 100;
        this.deck = [];
        this.gold = 50;
        this.relics = [];
        this.currentNode = null;
    }

    reset() {
        this.health = 100;
        this.deck = [];
        this.gold = 50;
        this.relics = [];
        this.currentNode = null;
    }
}

const gameState = new GameState();
export default gameState;