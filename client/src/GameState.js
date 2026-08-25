import Phaser from 'phaser';

export default class GameState {
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

        this.fullDeck = [];
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];
        this.handLimit = 6;
        this.armor = 0;
        this.nextAttackMultiplier = 1;
        this.flatDamageBonus = 0;
        this.removedUntilRest = [];

        this.enemies = [];
        this.allies = [];
        this.buffs = {};
        this.statuses = {};
        this.hasEidolon = false;
        this.passives = {};

        this.character = null;
        this.characterClass = null;
        this.level = 1;
        this.heroAbilityLevel = 1;
        console.log("Initial gameState created");
    }

    setCharacter(character) {
        this.character = character;
        this.characterClass = character.characterClass;
        this.health = character.health;
        this.maxHealth = character.health;
        this.maxActions = this.actions = character.actions;
        this.maxMana = this.mana = character.mana;

        this.fullDeck = [...character.deck];
        this.drawPile = [...this.fullDeck];
        console.log("Initial deck:", this.fullDeck);
        this.shuffleDeck();
        console.log("After shuffle deck draw pile:", this.drawPile);
    }

    getDeck() {
        return this.fullDeck;
    }

    getPlayerCharacter() {
        return this.characterClass;
    }

    playerTakeDamage(amount) {
        // Vulnerable: take 50% more damage
        if (this.statuses?.Vulnerable && this.statuses.Vulnerable > 0) {
            amount = Math.floor(amount * 1.5);
        }
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        console.log(`Player takes ${amount} damage. HP: ${this.health}`);
        this.runItemTriggers('onDamageTaken', amount);
    }

    playerHeal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
        this.healedThisTurn = true;
        console.log(`Player heals ${amount}. HP: ${this.health}`);
    }

    playerArmor(amount) {
        this.armor += amount;
        console.log(`Player puts on ${amount} armor. Total armor: ${this.armor}`);
    }

    // Applies multiplier and flat bonus to base damage
    calcDamage(base) {
        return Math.floor(base * this.nextAttackMultiplier) + this.flatDamageBonus;
    }

    gainHealth(amount) {
        this.maxHealth += amount;
        this.health += amount;
        console.log(`Player gains ${amount}. HP: ${this.maxHealth}`)
    }

    summonAlly(allyData) {
        if (!this.allies) this.allies = [];
        this.allies.push({ ...allyData, turnsRemaining: allyData.duration });
        console.log(`Summoned ally: ${allyData.name}`);
    }

    tickAllies() {
        if (!this.allies || this.allies.length === 0) return [];

        const actions = [];
        const aliveEnemies = this.enemies.filter(e => e.isAlive);
        const damageBonus = (this.passives?.allyDamageBonus) || 0;
        const eidolonBonus = this.buffs?.EidolonBonus?.amount || 0;

        this.allies = this.allies.filter(ally => {
            if (ally.turnsRemaining <= 0) return false;

            // Ally attacks a random living enemy
            if (ally.damage && aliveEnemies.length > 0) {
                const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                const totalDmg = ally.damage + damageBonus + eidolonBonus;
                target.takeDamage(totalDmg);
                if (ally.debuff) target.applyStatus(ally.debuff, 1);
                const targetIndex = this.enemies.indexOf(target);
                actions.push({ type: 'attack', allyName: ally.name, damage: totalDmg, targetName: target.name, targetIndex });
            }

            // Ally heals player
            if (ally.heal) {
                this.playerHeal(ally.heal);
                actions.push({ type: 'heal', allyName: ally.name, amount: ally.heal });
            }

            // Ally grants flat attack bonus each turn
            if (ally.attackBonus) {
                this.flatDamageBonus += ally.attackBonus;
                actions.push({ type: 'buff', allyName: ally.name, amount: ally.attackBonus });
            }

            ally.turnsRemaining--;
            return ally.turnsRemaining > 0;
        });

        return actions;
    }

    applyPlayerBuff(buffName, amount, duration) {
        if (!this.buffs) this.buffs = {};
        this.buffs[buffName] = { amount, turnsRemaining: duration };
        console.log(`Applied buff ${buffName}: +${amount} for ${duration} turns`);
    }

    applyStatus(statusName, duration) {
        if (!this.statuses) this.statuses = {};
        this.statuses[statusName] = (this.statuses[statusName] || 0) + duration;
        console.log(`Applied status ${statusName} for ${this.statuses[statusName]} turns`);
    }

    // Called at start of each player turn
    tickStatuses() {
        if (!this.statuses) return [];
        const messages = [];

        // Poisoned: take damage each turn
        if (this.statuses.Poisoned && this.statuses.Poisoned > 0) {
            const poisonDmg = 3;
            this.health -= poisonDmg;
            if (this.health < 0) this.health = 0;
            messages.push(`Poisoned! -${poisonDmg} HP`);
        }

        // Weakened: handled in playCard (reduces attack damage by 25%)
        if (this.statuses.Weakened && this.statuses.Weakened > 0) {
            messages.push('Weakened! Attacks deal 25% less damage');
        }

        // Frozen: lose 1 action this turn
        if (this.statuses.Frozen && this.statuses.Frozen > 0) {
            this.actions = Math.max(0, this.actions - 1);
            messages.push('Frozen! -1 action this turn');
        }

        // Cursed: lose 1 mana this turn
        if (this.statuses.Cursed && this.statuses.Cursed > 0) {
            this.mana = Math.max(0, this.mana - 1);
            messages.push('Cursed! -1 mana this turn');
        }

        // Vulnerable: take 50% more damage (applied in playerTakeDamage)
        if (this.statuses.Vulnerable && this.statuses.Vulnerable > 0) {
            messages.push('Vulnerable! Taking 50% more damage');
        }

        // Decrement all status durations
        Object.keys(this.statuses).forEach(key => {
            this.statuses[key]--;
            if (this.statuses[key] <= 0) {
                delete this.statuses[key];
            }
        });

        return messages;
    }

    // Called at start of each player turn — applies and ticks buffs
    tickBuffs() {
        if (!this.buffs) this.buffs = {};
        this.healedThisTurn = false;

        // Re-apply persistent passive bonus each turn
        if (this.passives?.startStrength) {
            this.flatDamageBonus += this.passives.startStrength;
        }

        // Apply active buff effects
        Object.keys(this.buffs).forEach(key => {
            const buff = this.buffs[key];
            switch (key) {
                case 'AttackBonus':
                    this.flatDamageBonus += buff.amount;
                    break;
                case 'ArmorGain':
                    this.armor += buff.amount;
                    break;
                case 'ManaGain':
                    this.mana = Math.min(this.mana + buff.amount, this.maxMana + 3);
                    break;
                case 'Strength':
                    this.flatDamageBonus += buff.amount;
                    break;
                case 'HolyDamage':
                    this.flatDamageBonus += buff.amount;
                    break;
            }
        });

        // Decrement durations
        Object.keys(this.buffs).forEach(key => {
            this.buffs[key].turnsRemaining--;
            if (this.buffs[key].turnsRemaining <= 0) {
                console.log(`Buff expired: ${key}`);
                delete this.buffs[key];
            }
        });
    }

    // Weakened modifier for attack damage
    getAttackModifier() {
        if (this.statuses?.Weakened && this.statuses.Weakened > 0) {
            return 0.75;
        }
        return 1.0;
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
        this.hasEidolon = false;
        this.allies = [];
        this.heroAbilityUsed = false;
        this.buffs = {};
        this.statuses = {};
        this.resetItemsForCombat();

        // Apply combat-start passives from leveling
        const p = this.passives || {};
        if (p.startArmor) this.armor = (this.armor || 0) + p.startArmor;
        if (p.autoSummonEidolon) {
            this.hasEidolon = true;
            const charName = this.character?.name;
            const allyName = charName === 'Hassan' ? 'Kamau' : 'Khan';
            const dmg = charName === 'Hassan' ? 5 : 4;
            this.summonAlly({ name: allyName, damage: dmg, duration: 99, attackBonus: charName === 'Alaen' ? 2 : 0 });
        }
    }

    resetItemsForCombat() {
        this.magicItems.forEach(item => {
            if (item.resetForCombat) item.resetForCombat();
        });
    }

    resetDeck() {
        this.hand = [];
        this.discardPile = [];
        this.drawPile = [...this.fullDeck];
        console.log("Reset Deck: ", this.drawPile);
        this.shuffleDeck();
    }

    useHeroAbility() {
        if (this.heroAbilityUsed) return false;
        if (this.character?.heroAbility) {
            this.character.heroAbility(this);
            this.heroAbilityUsed = true;
            return true;
        }
        return false;
    }

    levelUp() {
        if (this.level >= 5) return;
        this.level += 1;
        this.heroAbilityLevel += 1;
        const hpGain = 8 + Math.floor(this.level * 3);
        this.maxHealth += hpGain;
        this.health += hpGain;

        // Apply character-specific level bonus
        const bonus = this.character?.levelBonuses?.find(b => b.level === this.level);
        if (bonus) {
            if (bonus.stat) {
                this[bonus.stat] = (this[bonus.stat] || 0) + bonus.value;
                if (bonus.stat === 'maxMana') this.mana = this.maxMana;
                if (bonus.stat === 'maxActions') this.actions = this.maxActions;
            }
            if (bonus.passive) {
                if (!this.passives) this.passives = {};
                this.passives[bonus.passive] = (this.passives[bonus.passive] || 0) + bonus.value;
            }
        }

        console.log(`Level up! Now level ${this.level}. +${hpGain} max HP.`, bonus?.description || '');
    }

    shuffleDeck() {
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
    }

    reshuffleDiscardIntoDraw() {
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        this.shuffleDeck();
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

            if (this.actions < card.actionCost) {
                console.log("Not enough actions!");
                return { success: false, reason: 'actions' };
            }

            if (this.mana < card.manaCost) {
                console.log("Not enough mana!");
                return { success: false, reason: 'mana' };
            }

            if (card.requiresTarget && !target) {
                console.log("No target selected!");
                return { success: false, reason: 'target' };
            }

            // Deduct cost
            this.actions -= card.actionCost;
            this.mana -= card.manaCost;

            this.hand.splice(index, 1);

            // Apply Weakened: reduce multiplier for this attack
            if (card.type === "Attack" && this.getAttackModifier() < 1) {
                this.nextAttackMultiplier *= this.getAttackModifier();
            }

            // ArmorPierce: temporarily remove all enemy armor before attack resolves
            let armorPierceTargets = [];
            if (card.type === "Attack" && this.buffs?.ArmorPierce) {
                armorPierceTargets = this.enemies.filter(e => e.isAlive).map(e => ({ enemy: e, savedArmor: e.armor }));
                armorPierceTargets.forEach(t => { t.enemy.armor = 0; });
                this.buffs.ArmorPierce.amount--;
                if (this.buffs.ArmorPierce.amount <= 0) delete this.buffs.ArmorPierce;
            }

            // Track health before attack for Lifesteal
            const preHealth = target ? target.health : 0;

            card.play(target, this, card, scene);

            // Lifesteal: heal for damage dealt
            if (card.type === "Attack" && this.buffs?.Lifesteal && target) {
                const damageDealt = preHealth - target.health;
                if (damageDealt > 0) {
                    this.playerHeal(damageDealt);
                }
                this.buffs.Lifesteal.amount--;
                if (this.buffs.Lifesteal.amount <= 0) delete this.buffs.Lifesteal;
            }

            // Restore armor that wasn't destroyed by the attack (for untargeted enemies)
            armorPierceTargets.forEach(t => {
                if (t.enemy.isAlive && t.enemy !== target) {
                    t.enemy.armor = t.savedArmor;
                }
            });

            if (card.type === "Attack" || card.type === "Spell") {
                this.temporaryEffectReset();
            }

            if (card.isOncePerDay) {
                this.removedUntilRest.push(card);
                console.log("Daily card removed from deck", card.name);
            } else {
                this.discardPile.push(card);
            }

            console.log("Played card:", card.name);
            return { success: true, card };
        }
        return { success: false, reason: 'invalid_index' };
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
        this.nextAttackMultiplier = 1;
    }

    restoreDailyCards() {
        console.log("Restored daily cards");
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
            return magicItem.use(target, this, scene);
        }
        return false;
    }
}