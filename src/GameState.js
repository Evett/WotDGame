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
        this.magicItems = [];
        this.currentNode = null;

        //Deck management
        this.fullDeck = [];
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];
        this.handLimit = 6;
        this.armor = 0;
        this.nextAttackBonus = 1;
        this.removedUntilRest = [];

        this.enemies = [];

        this.character = null;
        this.characterClass = null;
    }

    setCharacter(character) {
        this.character = character;
        this.characterClass = character.characterClass;
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

    getDeck() {
        return this.fullDeck;
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

    gainHealth(amount) {
        this.maxHealth += amount;
        this.health += amount;
        console.log(`Player gains ${amount}. HP: ${this.maxHealth}`)
    }

    summonAlly() {

    }

    applyPlayerBuff() {
        
    }

    applyStatus() {
        
    }

    addMagicItem(item) {
        console.log("Checking if has item:", item);
        if (!this.hasMagicItem(item.id)) {
            this.magicItems.push(item);
            console.log("Added magic item to inventory:", item.name);
            return true;
        }
        console.log("Already has item:", item.name);
        return false;
    }

    hasMagicItem(itemId) {
        console.log("All magic items when checking", this.magicItems);
        console.log(itemId);
        return this.magicItems.some(item => item.id === itemId);
    }

    addCard(card) {
        this.fullDeck.push(card);
        console.log("Added card to deck:", card);
    }

    gainGold(amount) {
        this.gold += amount;
        console.log(`After gaining ${amount} gold, you have ${this.gold} gold.`);
    }

    loseGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            console.log(`After losing ${amount} gold, you have ${this.gold} gold.`);
            return true;
        }
        
        console.log('Not enough money!');
        return false;
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

            if (card.isOncePerDay) {
                const handIndex = gameState.hand.findIndex(c => c.id === card.id);
                if (handIndex !== -1) {
                    const [removedCard] = gameState.hand.splice(index, 1);
                    gameState.removedUntilRest.push(removedCard);
                    console.log("Daily card removed from deck", removedCard);
                    return;
                }
            }
    
            // Deduct cost
            this.actions -= card.actionCost;
            this.mana -= card.manaCost;

            this.hand.splice(index, 1)[0];
            card.play(target, this, card, scene);
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

    restoreDailyCards() {
        console.log("Restored daily cards");
        this.fullDeck.push(...this.removedUntilRest);
        this.removedUntilRest = [];
    }

    isDead() {
        if (this.health === 0) {
            return true;
        }
        return false;
    }

    runItemTriggers(triggerName, ...args) {
        console.log("Running triggers for", triggerName);
        this.magicItems.forEach(item => {
            if (item.triggers && item.triggers[triggerName]) {
                console.log("Running trigger for item:", item);
                item.triggers[triggerName](this, ...args);
            }
        });
    }

    useMagicItem(itemIndex, target = null, scene) {
        if (itemIndex >= 0 && itemIndex < this.magicItems.length) {
            const magicItem = this.magicItems[itemIndex];
            
            magicItem.use(target, this, scene);
        }
    }
}

const gameState = new GameState();
export default gameState;