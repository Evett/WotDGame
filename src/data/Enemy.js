class Enemy {
    constructor(scene, options) {
        this.scene = scene;
        this.name = options.name;
        this.maxHealth = options.maxHealth;
        this.health = options.maxHealth;
        this.isAlive = true;

        this.intent = null;
    }

    decideIntent() {
        const possibleIntents = [
            { type: 'attack', damage: 6 },
            { type: 'block', amount: 5 },
            { type: 'buff', effect: 'strength' }
        ];

        const choice = Phaser.Math.RND.pick(possibleIntents);
        this.intent = choice;

        if (choice.type === 'attack') {
            this.intentText = `Attack ${choice.damage}`;
        } else if (choice.type === 'block') {
            this.intentText = `Block ${choice.amount}`;
        } else if (choice.type === 'buff') {
            this.intentText = `Buff`;
        }
    }

    takeTurn(done, target) {
        if (!this.isAlive) {
            done();
            return;
        }

        console.log('Enemy takes its turn!');

        if (this.intent?.type === 'attack') {
            console.log("Enemy attacks!");
            target.playerTakeDamage?.(this.intent.damage);
        } else if (this.intent?.type === 'block') {
            console.log("Enemy blocks!");
        } else if (this.intent?.type === 'buff') {
            console.log("Enemy buffs");
        }

        this.decideIntent();

        this.scene.time.delayedCall(500, () => {
            done();
        });
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