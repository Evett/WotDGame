class Enemy {
    constructor(options) {
        this.key = options.key || options.name;
        this.name = options.name;
        this.maxHealth = options.maxHealth;
        this.health = options.health ?? options.maxHealth;
        this.intents = options.intents;
        this.tags = options.tags || [];
        this.isBoss = options.isBoss || false;
        this.isFinalBoss = options.isFinalBoss || false;
        this.isAlive = options.isAlive ?? true;
        this.statuses = options.statuses || {};
        this.armor = options.armor || 0;
        this.strength = options.strength || 0; // Bonus damage on attacks
        this.turnCount = options.turnCount || 0;
        this.intentPattern = options.intentPattern || null; // Fixed rotation (array of indices)
        this.phasePattern = options.phasePattern || null; // Alternate pattern below 50% HP

        this.intent = options.intent || null;
        // Per-combat random seed so the same enemy name has different intent sequences each fight
        this.combatSeed = options.combatSeed ?? Math.floor(Math.random() * 100000);
    }

    decideIntent() {
        let pattern = this.intentPattern;

        // Phase 2 pattern activates below 50% HP
        if (this.phasePattern && this.health <= this.maxHealth * 0.5) {
            pattern = this.phasePattern;
        }

        if (pattern && pattern.length > 0) {
            const patternIndex = this.turnCount % pattern.length;
            const intentIndex = pattern[patternIndex];
            this.intent = this.intents[intentIndex];
        } else {
            const seed = this.hashSeed(this.name, this.turnCount + this.combatSeed);
            const index = seed % this.intents.length;
            this.intent = this.intents[index];
        }
        this.turnCount++;
    }

    // Simple deterministic hash from name + turn for consistent multiplayer intent
    hashSeed(name, turn) {
        let h = turn * 2654435761;
        for (let i = 0; i < name.length; i++) {
            h = ((h << 5) - h + name.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }

    tickStatuses() {
        const messages = [];
        if (this.statuses.Poison && this.statuses.Poison > 0) {
            const dmg = 3;
            this.health -= dmg;
            if (this.health <= 0) { this.health = 0; this.isAlive = false; }
            messages.push(`${this.name} takes ${dmg} poison damage!`);
        }
        // Decrement all durations
        Object.keys(this.statuses).forEach(key => {
            if (key === 'Stunned') return; // Stunned is decremented in takeTurn
            this.statuses[key]--;
            if (this.statuses[key] <= 0) delete this.statuses[key];
        });
        return messages;
    }

    getDamageMultiplier() {
        return (this.statuses.Weakened && this.statuses.Weakened > 0) ? 0.75 : 1;
    }

    takeTurn(target) {
        if (!this.isAlive) return;

        if (this.statuses.Stunned && this.statuses.Stunned > 0) {
            this.statuses.Stunned--;
            console.log(`${this.name} is stunned and skips their turn.`);
            return;
        }

        if (!this.intent) return;
        const weakMult = this.getDamageMultiplier();

        switch (this.intent.type) {
            case 'attack': {
                let damage = Math.floor((this.intent.damage + this.strength) * weakMult);
                if (target.armor > 0) {
                    const absorbed = Math.min(target.armor, damage);
                    target.armor -= absorbed;
                    damage -= absorbed;
                }
                if (damage > 0) {
                    target.playerTakeDamage(damage);
                }
                console.log(`${this.name} attacks for ${damage} damage!`);
                break;
            }
            case 'multi_attack': {
                const hits = this.intent.hits || 2;
                for (let i = 0; i < hits; i++) {
                    let damage = Math.floor((this.intent.damage + this.strength) * weakMult);
                    if (target.armor > 0) {
                        const absorbed = Math.min(target.armor, damage);
                        target.armor -= absorbed;
                        damage -= absorbed;
                    }
                    if (damage > 0) {
                        target.playerTakeDamage(damage);
                    }
                }
                console.log(`${this.name} attacks ${hits} times for ${Math.floor((this.intent.damage + this.strength) * weakMult)} each!`);
                break;
            }
            case 'block': {
                if (this.statuses.Corrode && this.statuses.Corrode > 0) {
                    console.log(`${this.name} tries to block but is corroded!`);
                } else {
                    this.armor += this.intent.amount;
                    console.log(`${this.name} blocks! Gained ${this.intent.amount} armor. Total: ${this.armor}`);
                }
                break;
            }
            case 'buff': {
                this.strength += (this.intent.amount || 2);
                console.log(`${this.name} powers up! Strength now: ${this.strength}`);
                break;
            }
            case 'heal': {
                const healAmount = Math.min(this.intent.amount, this.maxHealth - this.health);
                this.health += healAmount;
                console.log(`${this.name} heals for ${healAmount}! HP: ${this.health}/${this.maxHealth}`);
                break;
            }
            case 'attack_and_block': {
                let damage = Math.floor((this.intent.damage + this.strength) * weakMult);
                if (target.armor > 0) {
                    const absorbed = Math.min(target.armor, damage);
                    target.armor -= absorbed;
                    damage -= absorbed;
                }
                if (damage > 0) {
                    target.playerTakeDamage(damage);
                }
                if (this.statuses.Corrode && this.statuses.Corrode > 0) {
                    console.log(`${this.name} attacks for ${damage} but can't block (corroded)!`);
                } else {
                    this.armor += this.intent.block;
                    console.log(`${this.name} attacks for ${damage} and gains ${this.intent.block} armor!`);
                }
                break;
            }
            case 'debuff': {
                target.applyStatus(this.intent.status, this.intent.duration || 1);
                console.log(`${this.name} applies ${this.intent.status} to you!`);
                break;
            }
            default:
                console.log(`${this.name} does something unknown.`);
        }
    }

    takeDamage(amount) {
        // Frozen: take 50% more damage
        const frozenMult = (this.statuses.Frozen && this.statuses.Frozen > 0) ? 1.5 : 1;
        const adjusted = Math.floor(amount * frozenMult);
        let remaining = adjusted;
        if (this.armor > 0) {
            const absorbed = Math.min(this.armor, remaining);
            this.armor -= absorbed;
            remaining -= absorbed;
        }
        if (remaining > 0) {
            this.health -= remaining;
            if (this.health <= 0) {
                this.health = 0;
                this.isAlive = false;
            }
        }
        console.log(`${this.name} takes ${adjusted} damage (${adjusted - remaining} absorbed). HP: ${this.health}/${this.maxHealth}, Armor: ${this.armor}`);
    }

    takeTrueDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
        console.log(`${this.name} takes ${amount} TRUE damage (ignores armor). HP: ${this.health}/${this.maxHealth}`);
    }

    applyStatus(statusName, duration) {
        this.statuses[statusName] = (this.statuses[statusName] || 0) + duration;
        console.log(`${this.name} is now ${statusName} for ${this.statuses[statusName]} turns.`);
    }

    serialize() {
        return {
            key: this.key,
            name: this.name,
            maxHealth: this.maxHealth,
            health: this.health,
            armor: this.armor,
            strength: this.strength,
            turnCount: this.turnCount,
            intentPattern: this.intentPattern,
            phasePattern: this.phasePattern,
            intents: this.intents,
            tags: this.tags,
            isBoss: this.isBoss,
            isFinalBoss: this.isFinalBoss,
            isAlive: this.isAlive,
            statuses: { ...this.statuses },
            intent: this.intent,
            combatSeed: this.combatSeed
        };
    }

    static rehydrate(data) {
        return new Enemy(data);
    }
}

export default Enemy;
