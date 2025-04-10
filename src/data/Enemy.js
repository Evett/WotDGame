class Enemy {
    constructor(scene, options) {
        this.scene = scene;
        this.name = options.name;
        this.maxHealth = options.maxHealth;
        this.health = options.maxHealth;
        this.isAlive = true;
    }

    takeTurn(done, target) {
        if (!this.isAlive) {
            done();
            return;
        }

        console.log('Enemy attacks!');

        const damage = 30
        target.playerTakeDamage(damage);

        this.scene.time.delayedCall(500, () => {
            done();
        })
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