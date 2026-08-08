class Enemy {
    constructor(options) {
        this.key = options.key || options.name;
        this.name = options.name;
        this.maxHealth = options.maxHealth;
        this.health = options.health ?? options.maxHealth;
        this.intents = options.intents;
        this.tags = options.tags || [];
        this.isBoss = options.isBoss || false;
        this.isAlive = options.isAlive ?? true;
        this.statuses = options.statuses || {};
        this.armor = options.armor || 0;
        this.strength = options.strength || 0; // Bonus damage on attacks
        this.turnCount = options.turnCount || 0;
        this.intentPattern = options.intentPattern || null; // Fixed rotation (array of indices)

        this.intent = options.intent || null;
    }

    decideIntent() {
        if (this.intentPattern && this.intentPattern.length > 0) {
            // Fixed rotation pattern for bosses
            const patternIndex = this.turnCount % this.intentPattern.length;
            const intentIndex = this.intentPattern[patternIndex];
            this.intent = this.intents[intentIndex];
        } else {
            const choice = this.intents[Math.floor(Math.random() * this.intents.length)];
            this.intent = choice;
        }
        this.turnCount++;
    }

    takeTurn(target) {
        if (!this.isAlive) return;

        if (this.statuses.Stunned && this.statuses.Stunned > 0) {
            this.statuses.Stunned--;
            console.log(`${this.name} is stunned and skips their turn.`);
            return;
        }

        if (!this.intent) return;

        switch (this.intent.type) {
            case 'attack': {
                let damage = this.intent.damage + this.strength;
                if (target.armor > 0) {
                    const absorbed = Math.min(target.armor, damage);
                    target.armor -= absorbed;
                    damage -= absorbed;
                }
                if (damage > 0) {
                    target.playerTakeDamage(damage);
                }
                console.log(`${this.name} attacks for ${this.intent.damage + this.strength} damage!`);
                break;
            }
            case 'multi_attack': {
                const hits = this.intent.hits || 2;
                for (let i = 0; i < hits; i++) {
                    let damage = this.intent.damage + this.strength;
                    if (target.armor > 0) {
                        const absorbed = Math.min(target.armor, damage);
                        target.armor -= absorbed;
                        damage -= absorbed;
                    }
                    if (damage > 0) {
                        target.playerTakeDamage(damage);
                    }
                }
                console.log(`${this.name} attacks ${hits} times for ${this.intent.damage + this.strength} each!`);
                break;
            }
            case 'block': {
                this.armor += this.intent.amount;
                console.log(`${this.name} blocks! Gained ${this.intent.amount} armor. Total: ${this.armor}`);
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
                let damage = this.intent.damage + this.strength;
                if (target.armor > 0) {
                    const absorbed = Math.min(target.armor, damage);
                    target.armor -= absorbed;
                    damage -= absorbed;
                }
                if (damage > 0) {
                    target.playerTakeDamage(damage);
                }
                this.armor += this.intent.block;
                console.log(`${this.name} attacks for ${this.intent.damage + this.strength} and gains ${this.intent.block} armor!`);
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
        let remaining = amount;
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
        console.log(`${this.name} takes ${amount} damage (${amount - remaining} absorbed). HP: ${this.health}/${this.maxHealth}, Armor: ${this.armor}`);
    }

    takeTrueDamage(amount) {
        this.takeDamage(amount);
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
            intents: this.intents,
            tags: this.tags,
            isBoss: this.isBoss,
            isAlive: this.isAlive,
            statuses: { ...this.statuses },
            intent: this.intent
        };
    }

    static rehydrate(data) {
        return new Enemy(data);
    }
}

export default Enemy;
