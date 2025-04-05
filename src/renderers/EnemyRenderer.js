class EnemyRenderer {
    constructor(scene, enemy, x, y, onTarget = () => {}) {
        this.scene = scene;
        this.enemy = enemy;
        this.container = scene.add.container(x, y);

        const bg = scene.add.rectangle(0, 0, 100, 100, 0x770000).setStrokeStyle(2, 0xffffff);
        const nameText = scene.add.text(0, -30, enemy.name, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        const healthText = scene.add.text(0, 10, `HP: ${enemy.health}/${enemy.maxHealth}`, { fontSize: '12px', color: '#fff' }).setOrigin(0.5);

        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => {
            onTarget(enemy);
        });

        this.healthText = healthText;
        this.container.add([bg, nameText, healthText]);
    }

    update() {
        this.healthText.setText(`HP: ${this.enemy.health}/${this.enemy.maxHealth}`);
    }

    destroy() {
        this.container.destroy(true);
    }
}

export default EnemyRenderer