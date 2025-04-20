class MagicItemRenderer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, item, onClick = null) {
        super(scene, x, y);

        this.scene = scene;
        this.item = item;

        const bg = scene.add.rectangle(0, 0, 180, 100, 0x222222, 0.8).setStrokeStyle(2, 0xffffff).setOrigin(0.5);
        this.add(bg);

        const nameText = scene.add.text(0, -35, item.name, {
            fontSize: '16px',
            color: '#ffd700',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);
        this.add(nameText);

        const descriptionText = scene.add.text(0, 10, item.description, {
            fontSize: '12px',
            color: '#dddddd',
            align: 'center',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);
        this.add(descriptionText);

        if (onClick) {
            this.setInteractive(new Phaser.Geom.Rectangle(-90, -50, 180, 100), Phaser.Geom.Rectangle.Contains);
            this.on('pointerdown', () => onClick(item));
            this.on('pointerover', () => bg.setStrokeStyle(2, 0xffff00));
            this.on('pointerout', () => bg.setStrokeStyle(2, 0xffffff));
        }

        scene.add.existing(this);
    }
}

export default MagicItemRenderer;