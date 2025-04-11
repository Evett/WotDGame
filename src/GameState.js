class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.health = 100;
        this.maxHealth = 100;
        this.maxActions = 3;
        this.actions = 3;
        this.maxMana = 3;
        this.mana = 3;
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
        this.armor = 0;
        this.nextAttackBonus = 1;

        this.enemies = [];

        this.character = null;
    }

    setCharacter(character) {
        this.character = character;
        this.health = character.health;
        this.maxHealth = character.health;
        this.maxActions = this.actions = character.actions;
        this.maxMana = this. mana = character.mana;

        this.fullDeck = [...character.deck]; //Initial deck
        this.drawPile = [...this.fullDeck];
        console.log("Initial deck:", this.fullDeck);
        this.shuffleDeck();
        console.log("After shuffle deck draw pile:", this.drawPile);
    }

    playerTakeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        console.log(`Player takes ${amount} damage. HP: ${this.health}`);
    }

    playerHeal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
        console.log(`Player heals ${amount}. HP: ${this.health}`);
    }

    playerArmor(amount) {
        this.armor += amount;
        console.log(`Player puts on ${amount} armor. Total armor: ${this.armor}`);
    }

    summonAlly() {

    }

    applyPlayerBuff() {
        
    }

    applyStatus() {
        
    }

    addCard(card) {
        this.fullDeck.push(card);
        console.log("Added card to deck:", card);
    }

    gainGold(amount) {
        this.gold += amount;
        console.log(`After gaining ${amount} gold, you have ${this.gold} gold.`);
    }

    startBattle(enemiesArray) {
        this.enemies = enemiesArray;
    }

    resetDeck() {
        this.hand = [];
        this.discardPile = [];
        this.drawPile = [...this.fullDeck];
        console.log("Reset Deck: ", this.drawPile);
        this.shuffleDeck();
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

    reshuffleDiscardIntoDraw() {
        this.drawPile = Phaser.Utils.Array.Shuffle([...this.discardPile]);
        this.discardPile = [];
    }

    drawCard(scene) {
        this.drawCards(1, scene);
    }

    drawCards(amount=1, scene) {
        for (let i = 0; i < amount; i++) {
            scene.time.delayedCall(i * 150, () => {
                if (this.hand.length >= this.handLimit) {
                    console.log("Hand is full.");
                    return;
                }
    
                if (this.drawPile.length === 0) {
                    this.reshuffleDiscardIntoDraw();
                }
    
                if (this.drawPile.length === 0) {
                    console.log("No cards left to draw.");
                    return;
                }
    
                const card = this.drawPile.pop();
                this.hand.push(card);
                console.log("You drew:", card.name);
    
                if (scene.renderHand) {
                    scene.updateHandDisplay(); // Re-render hand each draw
                }
    
                // Optional: Add draw animation
                const drawAnim = scene.add.text(scene.cameras.main.centerX, -100, card.name, {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
    
                scene.tweens.add({
                    targets: drawAnim,
                    y: scene.cameras.main.centerY,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => drawAnim.destroy()
                });
            });
        }
    }
    
    drawHand(scene) {
        console.log("Drawing Hand");
    
        this.drawCards(this.handLimit, scene);
    }

    playCard(index, target = null, scene) {
        if (index >= 0 && index < this.hand.length) {
            const card = this.hand[index];

            // Determine if requirements are met, I'm using both mana and actions basically
            if (this.actions < card.actionCost) {
                console.log("Not enough actions!");
                return;
            }

            if (this.mana < card.manaCost) {
                console.log("Not enough mana!");
                return;
            }

            if (card.requiresTarget && !target) {
                console.log("No target selected!");
                return;
            }
    
            // Deduct cost
            this.actions -= card.actionCost;
            this.mana -= card.manaCost;

            this.hand.splice(index, 1)[0];
            card.play(target, this, scene);
            if (card.type === "Attack") {
                this.temporaryEffectReset();
            }
            console.log("You just played this card:", card);
            this.discardPile.push(card);
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
    
    temporaryEffectReset() {
        this.nextAttackBonus = 1;
    }

    isDead() {
        if (this.health === 0) {
            return true;
        }
        return false;
    }

}

const gameState = new GameState();
export default gameState;