class Enemy {
    constructor({ name, maxHealth }) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.isAlive = true;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
    }
}

export default Enemy