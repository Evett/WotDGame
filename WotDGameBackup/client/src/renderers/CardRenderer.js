class CardRenderer {
    constructor(scene, card, x, y, gameState, onClick = () => {}, options = {}) {
        this.scene = scene;
        this.card = card;
        this.x = x;
        this.y = y;
        this.gameState = gameState;
        this.onClick = onClick;
        this.container = null;
        this.goldCost = options.goldCost;

        this.render();
    }

    render() {
        const { scene, card, x, y, gameState, options } = this;
        const width = 100;
        const height = 150;

        this.container = scene.add.container(x, y);

        const background = scene.add.rectangle(0, 0, width, height, 0x2c2c2c, 1).setStrokeStyle(2, 0xffffff);
        this.container.add(background);

        const nameText = scene.add.text(0, -height / 2 + 12, card.name, {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5, 0);
        this.container.add(nameText);

        const descText = scene.add.text(0, 0, card.getDescription(), {
            fontSize: '12px',
            color: '#aaaaaa',
            wordWrap: { width: width - 20 },
            align: 'center',
        }).setOrigin(0.5);
        this.container.add(descText);

        if (this.goldCost) {
            const goldCost = scene.add.text(0, height, `${this.goldCost} gold`,{
                fontSize: '12px', 
                color: '#ff0',
                fontFamily: 'Arial' 
            }).setOrigin(0.5);
            this.container.add(goldCost);
        }

        const costParts = [];
        if (card.actionCost > 0) costParts.push(`${card.actionCost}A`);
        if (card.manaCost > 0) costParts.push(`${card.manaCost}M`);
        const costText = scene.add.text(0, height / 2 - 18, costParts.join(" + "), {
            fontSize: '14px',
            color: '#FFD700'
        }).setOrigin(0.5);
        this.container.add(costText);

        background.setInteractive();
        background.on('pointerover', () => background.setFillStyle(0x444444));
        background.on('pointerout', () => background.setFillStyle(0x2c2c2c));
        if (!this.goldCost && (gameState.actions < card.actionCost || gameState.mana < card.manaCost)) {
            background.setAlpha(0.5);
        }
        background.on('pointerdown', () => {
            this.onClick(this.card);
        });
    }

    destroy() {
        this.container.destroy();
    }
}

export default CardRenderer