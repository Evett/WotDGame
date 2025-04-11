class EnemyRenderer {
    constructor(scene, enemy, x, y, onTarget = () => {}) {
        this.scene = scene;
        this.enemy = enemy;
        this.x = x;
        this.y = y;
        this.onTarget = onTarget;
        this.container = null;

        this.selected = scene.add.rectangle(0, 0, 110, 110, 0x00ffff, 0.3)
            .setStrokeStyle(3, 0x00ffff)
            .setVisible(false);

        this.render();
    }

    render() {
        const { scene, enemy, x, y } = this;

        this.container = scene.add.container(x, y);

        const bg = scene.add.rectangle(0, 0, 100, 100, 0x770000).setStrokeStyle(2, 0xffffff);
        const nameText = scene.add.text(0, -30, enemy.name, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        const healthText = scene.add.text(0, 10, `HP: ${enemy.health}/${enemy.maxHealth}`, { fontSize: '12px', color: '#fff' }).setOrigin(0.5);
        const intentText = scene.add.text(0, -60, enemy.intentText, { fontSize: '12px', color: '#fff' }).setOrigin(0.5);

        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => {
            this.onTarget(enemy);
        });

        this.healthText = healthText;
        this.intentDescription = intentText;
        this.container.add([bg, nameText, healthText, intentText, this.selected]);
    }

    update() {
        this.healthText.setText(`HP: ${this.enemy.health}/${this.enemy.maxHealth}`);
        this.intentDescription.setText(this.enemy.intentText);
    }

    select(isSelected) {
        this.selected.setVisible(isSelected);
    }

    destroy() {
        this.container.destroy(true);
    }
}

export default EnemyRenderer