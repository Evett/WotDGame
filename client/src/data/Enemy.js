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

        this.intent = options.intent || null;
    }

    decideIntent() {
        const choice = this.intents[Math.floor(Math.random() * this.intents.length)];
        this.intent = choice;
    }

    takeTurn(target) {
        if (!this.isAlive) return;

        if (this.statuses.Stunned && this.statuses.Stunned > 0) {
            this.statuses.Stunned--;
            console.log(`${this.name} is stunned and skips their turn.`);
            return;
        }

        if (this.intent?.type === 'attack') {
            let damage = this.intent.damage;
            if (target.armor > 0) {
                const absorbed = Math.min(target.armor, damage);
                target.armor -= absorbed;
                damage -= absorbed;
            }
            if (damage > 0) {
                target.playerTakeDamage(damage);
            }
            console.log(`${this.name} attacks for ${this.intent.damage} damage!`);
        } else if (this.intent?.type === 'block') {
            this.armor += this.intent.amount;
            console.log(`${this.name} blocks! Gained ${this.intent.amount} armor. Total: ${this.armor}`);
        } else if (this.intent?.type === 'buff') {
            console.log(`${this.name} buffs!`);
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
